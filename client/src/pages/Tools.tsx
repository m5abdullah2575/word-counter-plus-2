import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAvailableTools, getComingSoonTools } from '@/data/toolsConfig';
import { useEffect } from 'react';

export default function Tools() {
  // Ensure page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get tools data from configuration
  const availableTools = getAvailableTools();
  const comingSoonTools = getComingSoonTools();

  // Enhanced structured data for Tools collection
  const toolsCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Text Analysis Tools Collection - Word Counter Plus",
    "description": "Professional text analysis, word counting, and text processing tools for writers, content creators, and students.",
    "url": "https://wordcounterplusapp.com/tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": availableTools.length,
      "itemListElement": availableTools.map((tool, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": tool.title,
        "description": tool.description,
        "url": tool.isExternal ? tool.href : `https://wordcounterplusapp.com${tool.href}`,
        "applicationCategory": "Productivity",
        "operatingSystem": "Web Browser",
        "isAccessibleForFree": true,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wordcounterplusapp.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tools",
          "item": "https://wordcounterplusapp.com/tools"
        }
      ]
    }
  };

  useSEO({
    title: 'Text Analysis Tools - Word Counter Plus',
    description: 'Professional text analysis and processing tools including word counter, character counter, and text case converter for writers and students.',
    keywords: 'text tools, word counter, character counter, text case converter, text analysis, writing tools',
    canonical: 'https://wordcounterplusapp.com/tools',
    structuredData: toolsCollectionSchema,
    breadcrumbs: [
      { name: "Home", url: "https://wordcounterplusapp.com" },
      { name: "Tools", url: "https://wordcounterplusapp.com/tools" }
    ]
  });

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Text Analysis Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional text analysis and processing tools for writers, students, and content creators.
            </p>
          </div>

          {/* Available Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableTools.map((tool) => {
              const IconComponent = tool.icon;
              const cardContent = (
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-card dark:bg-card border border-border dark:border-border hover:border-primary/30 rounded-xl overflow-hidden">
                  <CardHeader className="text-center p-6 relative">
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                        <IconComponent className="text-3xl text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <CardTitle className="text-lg font-bold text-foreground dark:text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {tool.title}
                    </CardTitle>
                    
                    {/* Description */}
                    <CardDescription className="text-muted-foreground dark:text-muted-foreground leading-relaxed text-sm line-clamp-3">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs py-1 px-2 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs py-1 px-2 rounded-full">
                          +{tool.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Indicator */}
                    <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                      Try it now 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              );

              // Use external link for cross-domain navigation, internal Link for same-domain
              if (tool.isExternal) {
                return (
                  <a 
                    key={tool.id} 
                    href={tool.href} 
                    data-testid={`link-tool-${tool.id}`}
                    rel="noopener noreferrer"
                  >
                    {cardContent}
                  </a>
                );
              } else {
                return (
                  <Link key={tool.id} href={tool.href} data-testid={`link-tool-${tool.id}`}>
                    {cardContent}
                  </Link>
                );
              }
            })}
          </div>

          {/* Coming Soon Tools */}
          {comingSoonTools.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground">
                  Exciting new tools we're working on for you
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {comingSoonTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card key={tool.id} className="h-full opacity-75 bg-card dark:bg-card border border-border dark:border-border rounded-xl overflow-hidden">
                      <CardHeader className="text-center p-6 relative">
                        {/* Coming Soon Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                        
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                          <div className="p-4 rounded-2xl bg-muted dark:bg-muted">
                            <IconComponent className="text-3xl text-muted-foreground dark:text-muted-foreground" />
                          </div>
                        </div>
                        
                        {/* Title */}
                        <CardTitle className="text-lg font-bold text-muted-foreground dark:text-muted-foreground mb-3">
                          {tool.title}
                        </CardTitle>
                        
                        {/* Description */}
                        <CardDescription className="text-muted-foreground/80 dark:text-muted-foreground/80 leading-relaxed text-sm">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center bg-muted/30 rounded-xl p-8 border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Need Help with Your Writing?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore our blog for writing tips, grammar guides, and best practices to improve your content.
            </p>
            <Link href="/blog" data-testid="link-blog-cta">
              <div className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Read Writing Tips
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}