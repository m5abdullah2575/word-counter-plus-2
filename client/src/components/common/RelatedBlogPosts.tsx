import { Link } from 'wouter';
import { FaCalendar, FaClock, FaArrowRight } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPostsForTool } from '@/lib/tool-blog-mapping';
import { blogPosts } from '@/data/blogData';

interface RelatedBlogPostsProps {
  toolId: string;
  limit?: number;
  className?: string;
}

export default function RelatedBlogPosts({ toolId, limit = 3, className = '' }: RelatedBlogPostsProps) {
  const relatedPosts = getBlogPostsForTool(toolId, blogPosts, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`mt-12 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Related Articles
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn more about using this tool effectively with our expert guides and writing tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card 
            key={post.id}
            className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-border bg-card"
            data-testid={`related-blog-${post.id}`}
          >
            <Link href={`/blog/${post.slug}`}>
              <div>
                {/* Featured Image */}
                {post.image && (
                  <div className="aspect-video">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      loading="lazy"
                    />
                  </div>
                )}

                <CardHeader className="pb-2">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" aria-label="Calendar Icon" />
                      <span>
                        {new Date(post.publishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" aria-label="Clock Icon" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm">
                      Read Article
                      <FaArrowRight className="ml-2 text-xs" aria-label="Right Arrow Icon" />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* View All Articles CTA */}
      <div className="text-center mt-8">
        <Link href="/blog">
          <span className="inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors font-medium">
            View All Articles
            <FaArrowRight className="ml-2" aria-label="Right Arrow Icon" />
          </span>
        </Link>
      </div>
    </div>
  );
}