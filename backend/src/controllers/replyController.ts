import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const createReply = async (req: AuthRequest, res: Response) => {
  const { postId, body } = req.body;
  const authorId = req.user?.id;
  const attachmentIds: number[] = req.body.attachmentIds || [];

  try {
    // Create reply and update post reply count in a transaction
    const [reply] = await prisma.$transaction([
      prisma.reply.create({
        data: {
          postId: parseInt(postId),
          authorId: authorId!,
          body
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
      }),
      prisma.post.update({
        where: { id: parseInt(postId) },
        data: { repliesCount: { increment: 1 } }
      })
    ]);

    // Link attachments to the reply if any attachment IDs provided
    if (attachmentIds.length > 0) {
      await prisma.attachment.updateMany({
        where: { id: { in: attachmentIds } },
        data: { replyId: reply.id }
      });
    }

    // Re-fetch reply to get updated attachmentFiles
    const updatedReply = await prisma.reply.findUnique({
      where: { id: reply.id },
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

    if (!updatedReply) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve created reply' });
    }

    const fileAttachments = updatedReply.attachmentFiles.map(file => ({
      id: file.id,
      type: file.fileType as 'pdf' | 'image' | 'docx' | 'other',
      name: file.originalName,
      size: formatFileSize(file.fileSize)
    }));

    // Transform to match expected API format (camelCase for frontend)
    const response = {
      id: updatedReply.id,
      postId: updatedReply.postId,
      authorId: updatedReply.authorId,
      body: updatedReply.body,
      votes: updatedReply.votes,
      attachments: fileAttachments,
      createdAt: updatedReply.createdAt.toISOString(),
      authorHandle: updatedReply.author.handle
    };

    console.log('✅ Reply created:', response);

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Create reply error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getRepliesForPost = async (req: Request, res: Response) => {
  const postId = req.query.postId;

  try {
    const replies = await prisma.reply.findMany({
      where: { postId: parseInt(postId as string) },
      orderBy: { createdAt: 'desc' },
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

    // Transform to match expected API format (camelCase for frontend)
    const transformedReplies = replies.map(reply => {
      const fileAttachments = reply.attachmentFiles.map(file => ({
        id: file.id,
        type: file.fileType as 'pdf' | 'image' | 'docx' | 'other',
        name: file.originalName,
        size: formatFileSize(file.fileSize)
      }));

      return {
        id: reply.id,
        postId: reply.postId,
        authorId: reply.authorId,
        body: reply.body,
        votes: reply.votes,
        attachments: fileAttachments,
        createdAt: reply.createdAt.toISOString(),
        authorHandle: reply.author.handle
      };
    });

    console.log(`📝 Fetched ${transformedReplies.length} replies for post ${postId}`);

    res.json({
      success: true,
      data: transformedReplies
    });
  } catch (err: any) {
    console.error('Get replies error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const voteReply = async (req: AuthRequest, res: Response) => {
  const { delta } = req.body;
  const replyId = parseInt(req.params.id);

  try {
    const reply = await prisma.reply.update({
      where: { id: replyId },
      data: { votes: { increment: delta } }
    });

    // Transform to match expected API format (camelCase for frontend)
    const response = {
      id: reply.id,
      postId: reply.postId,
      authorId: reply.authorId,
      body: reply.body,
      votes: reply.votes,
      createdAt: reply.createdAt.toISOString()
    };

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Reply not found' });
    }
    console.error('Vote reply error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
