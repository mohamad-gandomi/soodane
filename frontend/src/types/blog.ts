export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  displayOrder?: number;
  _count?: {
    posts: number;
    children?: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  authorId?: string;
  categoryId?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface BlogFilterParams {
  search?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export interface BlogPaginatedResponse {
  data: BlogPost[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
