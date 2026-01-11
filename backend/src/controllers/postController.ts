import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const getPosts = async (req: AuthRequest, res: Response) => {
  const { uniId, tag, search, sortBy, limit, offset } = req.query;

  try {
    // Build where clause
    const where: any = {};
    
    if (uniId) {
      where.uniId = parseInt(uniId as string);
    }
    
    if (tag) {
      where.tags = { has: tag as string };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { body: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'top') {
      orderBy = { votes: 'desc' };
    } else if (sortBy === 'active') {
      orderBy = { repliesCount: 'desc' };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
      include: {
        author: {
          select: {
            id: true,
            handle: true,
            name: true
          }
        },
        replies: {
          orderBy: { votes: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                handle: true,
                name: true
              }
            }
          }
        },
        attachmentFiles: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            fileType: true,
            fileSize: true
          }
        }
      }
    });

    // Transform to match expected API format
    const transformedPosts = posts.map(post => {
      // FIXED: Only use database attachment files (attachmentFiles relation)
      // Don't merge with JSON attachments to avoid duplicates
      const fileAttachments = post.attachmentFiles.map(file => ({
        id: file.id,
        type: file.fileType as 'pdf' | 'image' | 'docx' | 'other',
        name: file.originalName,
        size: formatFileSize(file.fileSize)
      }));
      
      console.log(`📎 Post ${post.id}: ${fileAttachments.length} attachments`);
      
      return {
        id: post.id,
        uniId: post.uniId,              // camelCase ✅
        authorId: post.authorId,        // camelCase ✅
        title: post.title,
        body: post.body,
        tags: post.tags,
        votes: post.votes,
        replies: post.repliesCount,     // camelCase ✅
        createdAt: post.createdAt.toISOString(),  // camelCase + ISO ✅
        authorHandle: post.author.handle,          // camelCase ✅
        attachments: fileAttachments    // Only DB attachments
      };
    });

    res.json({
      success: true,
      data: {
        posts: transformedPosts,
        total: transformedPosts.length
      }
    });
  } catch (err: any) {
    console.error('Get posts error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, body, tags, uniId } = req.body;
  const authorId = req.user?.id;
  
  // FIXED: Frontend sends attachmentIds (array of numbers), not attachments objects
  const attachmentIds: number[] = req.body.attachmentIds || [];
  
  console.log(`📝 Creating post with ${attachmentIds.length} attachments:`, attachmentIds);

  try {
    // Create post first
    const post = await prisma.post.create({
      data: {
        uniId: parseInt(uniId),
        authorId: authorId!,
        title,
        body,
        tags: tags || [],
        attachments: [] // Keep empty - we use attachmentFiles relation now
      },
      include: {
        author: {
          select: {
            id: true,
            handle: true,
            name: true
          }
        }
      }
    });

    // Link attachments to the post if any attachment IDs provided
    if (attachmentIds.length > 0) {
      console.log(`🔗 Linking ${attachmentIds.length} attachments to post ${post.id}`);
      
      const updateResult = await prisma.attachment.updateMany({
        where: { id: { in: attachmentIds } },
        data: { postId: post.id }
      });
      
      console.log(`✅ Linked ${updateResult.count} attachments to post ${post.id}`);
    }

    // Fetch the post again with attachments to return complete data
    const postWithAttachments = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: {
          select: {
            id: true,
            handle: true,
            name: true
          }
        },
        attachmentFiles: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            fileType: true,
            fileSize: true
          }
        }
      }
    });

    // Transform attachments
    const fileAttachments = postWithAttachments?.attachmentFiles.map(file => ({
      id: file.id,
      type: file.fileType as 'pdf' | 'image' | 'docx' | 'other',
      name: file.originalName,
      size: formatFileSize(file.fileSize)
    })) || [];

    // Transform to match expected API format (camelCase)
    const response = {
      id: post.id,
      uniId: post.uniId,
      authorId: post.authorId,
      title: post.title,
      body: post.body,
      tags: post.tags,
      votes: post.votes,
      replies: post.repliesCount,
      createdAt: post.createdAt.toISOString(),
      authorHandle: post.author.handle,
      attachments: fileAttachments
    };

    console.log(`✅ Post created: ${post.id} by ${post.author.handle} with ${fileAttachments.length} attachments`);

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Create post error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: {
          select: {
            id: true,
            handle: true,
            name: true
          }
        },
        replies: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                handle: true,
                name: true
              }
            }
          }
        },
        attachmentFiles: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            fileType: true,
            fileSize: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // FIXED: Only use database attachment files (no merge with JSON to avoid duplicates)
    const fileAttachments = post.attachmentFiles.map(file => ({
      id: file.id,
      type: file.fileType as 'pdf' | 'image' | 'docx' | 'other',
      name: file.originalName,
      size: formatFileSize(file.fileSize)
    }));

    console.log(`📎 Post ${post.id} detail: ${fileAttachments.length} attachments`);

    // Transform to match expected API format
    const response = {
      id: post.id,
      uniId: post.uniId,              // camelCase ✅
      authorId: post.authorId,        // camelCase ✅
      title: post.title,
      body: post.body,
      tags: post.tags,
      votes: post.votes,
      replies: post.repliesCount,     // camelCase ✅
      createdAt: post.createdAt.toISOString(),  // camelCase + ISO ✅
      authorHandle: post.author.handle,          // camelCase ✅
      attachments: fileAttachments    // Only DB attachments
    };

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Get post by ID error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const votePost = async (req: AuthRequest, res: Response) => {
  const { delta } = req.body; // 1 or -1
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        votes: { increment: delta }
      }
    });

    // Transform to match expected API format (camelCase)
    const response = {
      id: post.id,
      uniId: post.uniId,              // camelCase ✅
      authorId: post.authorId,        // camelCase ✅
      title: post.title,
      body: post.body,
      tags: post.tags,
      votes: post.votes,
      replies: post.repliesCount,     // camelCase ✅
      createdAt: post.createdAt.toISOString(),  // camelCase + ISO ✅
      attachments: []  // Empty for vote response
    };

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    console.error('Vote post error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
