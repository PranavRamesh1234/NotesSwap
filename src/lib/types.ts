export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  subject: string;
  file_url: string;
  preview_url: string;
  user_id: string;
  created_at: string;
  is_free: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  topics: string[];
  max_members: number;
  image_url: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface GroupSharedFile {
  id: string;
  group_id: string;
  product_id: string;
  shared_by: string;
  created_at: string;
  products?: Product;
}