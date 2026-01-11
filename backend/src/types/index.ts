export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  uni_id: number;
  status: 'pending' | 'verified' | 'rejected';
  handle: string;
  is_admin: boolean;
  created_at: Date;
}

export interface University {
  id: number;
  name: string;
  slug: string;
}

export interface Attachment {
  type: 'pdf' | 'image' | 'docx' | 'other';
  name: string;
  size: string;
  path?: string; // stored path on server
}

export interface Post {
  id: number;
  uni_id: number;
  author_id: number;
  title: string;
  body: string;
  tags: string[];
  votes: number;
  replies_count: number;
  attachments: Attachment[];
  created_at: Date;
}

export interface Reply {
  id: number;
  post_id: number;
  author_id: number;
  body: string;
  votes: number;
  created_at: Date;
}

export interface Verification {
  id: number;
  user_id: number;
  uni_id: number;
  selfie_url: string;
  card_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: Date;
}
