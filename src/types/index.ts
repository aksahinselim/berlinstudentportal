export interface University {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  email: string
  name: string
  uniId: number
  status: 'pending' | 'verified' | 'rejected'
  handle: string
  isAdmin?: boolean
}

export interface Attachment {
  id?: number
  type: 'pdf' | 'image' | 'docx' | 'other'
  name: string
  size: string
  url?: string
}

export interface Post {
  id: number
  uniId: number
  authorId: number
  title: string
  body: string
  tags: string[]
  votes: number
  replies: number
  createdAt: string
  attachments: Attachment[]
}

export interface Reply {
  id: number
  postId: number
  authorId: number
  body: string
  createdAt: string
  votes: number
  attachments?: Attachment[]
  authorHandle?: string  // Author's display name
}

export interface Verification {
  id: number
  userId: number
  uniId: number
  selfieUrl: string
  cardUrl: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

