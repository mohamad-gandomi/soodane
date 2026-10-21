import { apiClient } from '@/lib/api-client';
import { BlogPost, BlogCategory, BlogFilterParams } from '@/types/blog';

export const blogService = {
  async getPosts(params?: BlogFilterParams): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      const response = await apiClient<any>('/blog/posts', {
        params: {
          search: params?.search,
          categorySlug: params?.categorySlug,
          page: params?.page || 1,
          limit: params?.limit || 12,
        },
      });

      if (response && Array.isArray(response.data)) {
        return {
          posts: response.data,
          total: response.meta?.total || response.data.length,
        };
      }
      if (Array.isArray(response)) {
        return { posts: response, total: response.length };
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to fetch blog posts from backend:', err);
      }
    }

    return { posts: [], total: 0 };
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const post = await apiClient<BlogPost>(`/blog/posts/${slug}`);
      return post || null;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Failed to fetch blog post "${slug}":`, err);
      }
      return null;
    }
  },

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const categories = await apiClient<BlogCategory[]>('/blog/categories');
      if (Array.isArray(categories)) {
        return categories;
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to fetch blog categories:', err);
      }
    }
    return [];
  },
};
