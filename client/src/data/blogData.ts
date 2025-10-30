export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  content: string;
  publishDate: string;
  readTime: string;
  tags: string[];
  slug: string;
}

export const allBlogPosts: BlogPost[] = [];
