// Shared blog data for both client and server
// This file avoids client-side dependencies like import.meta.env

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

// Core blog posts (simplified version for server-side use)
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Improve Your Writing Readability Score",
    excerpt: "Learn proven techniques to make your content more readable and engaging for your audience. Discover the secrets of Flesch-Kincaid scores and how to optimize your writing.",
    content: "Learn proven techniques to make your content more readable and engaging for your audience. Discover the secrets of Flesch-Kincaid scores and how to optimize your writing for better readability.",
    publishDate: "2025-09-05",
    readTime: "5 min read",
    tags: ["Writing Tips", "Readability", "Content Creation"],
    slug: "improve-writing-readability-score",
    image: "/images/Text_analysis_blog_image_e338860d.png"
  },
  {
    id: "2",
    title: "SEO Content Writing: The Ultimate Guide",
    excerpt: "Master the art of SEO content writing with our comprehensive guide. Learn keyword optimization, content structure, and ranking strategies that actually work.",
    content: "Master the art of SEO content writing with our comprehensive guide. Learn keyword optimization, content structure, and ranking strategies that actually work.",
    publishDate: "2025-09-01",
    readTime: "8 min read",
    tags: ["SEO", "Content Writing", "Digital Marketing"],
    slug: "seo-content-writing-ultimate-guide",
    image: "/images/SEO_content_blog_image_17fd0347.png"
  },
  {
    id: "3",
    title: "10 Writing Mistakes That Kill Your Content",
    excerpt: "Avoid these common writing mistakes that can damage your credibility and hurt your rankings. Learn how to identify and fix these issues in your content.",
    content: "Avoid these common writing mistakes that can damage your credibility and hurt your rankings. Learn how to identify and fix these issues in your content.",
    publishDate: "2025-08-28",
    readTime: "6 min read",
    tags: ["Writing Tips", "Content Quality", "Blogging"],
    slug: "writing-mistakes-kill-content",
    image: "/images/Writing_mistakes_blog_image_856c193e.png"
  },
  {
    id: "4",
    title: "Content Planning: How to Create a Winning Strategy",
    excerpt: "Build a content strategy that drives traffic, engagement, and conversions. Learn how to plan, create, and optimize content that your audience loves.",
    content: "Build a content strategy that drives traffic, engagement, and conversions. Learn how to plan, create, and optimize content that your audience loves.",
    publishDate: "2025-08-25",
    readTime: "7 min read",
    tags: ["Content Strategy", "Planning", "Marketing"],
    slug: "content-planning-winning-strategy",
    image: "/images/Content_strategy_blog_image_fc6428d5.png"
  },
  {
    id: "5",
    title: "Essential Grammar Rules Every Writer Should Know",
    excerpt: "Master the fundamental grammar rules that make your writing clear, professional, and error-free. From punctuation to sentence structure, we cover it all.",
    content: "Master the fundamental grammar rules that make your writing clear, professional, and error-free. From punctuation to sentence structure, we cover it all.",
    publishDate: "2025-08-22",
    readTime: "6 min read",
    tags: ["Grammar", "Writing Tips", "Language"],
    slug: "essential-grammar-rules-writers",
    image: "/images/Grammar_tips_blog_image_64d0441b.png"
  }
];

// Helper function to get related posts
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = blogPosts.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  // Get posts with matching tags
  const relatedPosts = blogPosts
    .filter(post => 
      post.slug !== currentSlug && 
      post.tags.some((tag: string) => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
    
  // If we need more posts, add recent ones
  if (relatedPosts.length < limit) {
    const recentPosts = blogPosts
      .filter(post => 
        post.slug !== currentSlug && 
        !relatedPosts.some(related => related.slug === post.slug)
      )
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit - relatedPosts.length);
      
    relatedPosts.push(...recentPosts);
  }
  
  return relatedPosts;
}