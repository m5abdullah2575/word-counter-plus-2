import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getToolsData } from '@/data/toolsConfig';
import { useEffect } from 'react';

export default function Tools() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allTools = getToolsData();

  const availableTools = allTools.filter(tool => !tool.isComingSoon);
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
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-6 xs:mb-8 sm:mb-12 md:mb-16">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 xs:mb-3 sm:mb-4">
              Text Analysis Tools
            </h1>
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Professional text analysis and processing tools for writers, students, and content creators.
            </p>
          </div>

          {/* All Tools Grid - Responsive for all devices */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
            {allTools.map((tool) => {
              const IconComponent = tool.icon;
              const isComingSoon = tool.isComingSoon;
              
              const cardContent = (
                <Card className={`relative group transition-all duration-300 bg-card border-2 border-border rounded-xl overflow-hidden h-full ${
                  isComingSoon 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 cursor-pointer hover:border-primary/50 active:scale-95'
                }`}>
                  <CardHeader className="text-center p-3 xs:p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between items-center">
                    
                    <div className="flex-1 flex flex-col justify-center items-center">
                      {/* Icon Container with enhanced hover effect */}
                      <div className="flex justify-center mb-2 xs:mb-3 sm:mb-4">
                        <div className={`p-2 xs:p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                          isComingSoon 
                            ? 'bg-muted' 
                            : 'bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:scale-110 group-hover:rotate-3'
                        }`}>
                          <IconComponent className={`text-xl xs:text-2xl sm:text-3xl transition-all duration-300 ${
                            isComingSoon 
                              ? 'text-muted-foreground' 
                              : 'text-primary group-hover:scale-110 group-hover:text-primary'
                          }`} />
                        </div>
                      </div>
                      
                      {/* Title with better responsive sizing */}
                      <CardTitle className={`text-xs xs:text-sm sm:text-base md:text-lg font-bold mb-1 xs:mb-2 leading-tight transition-colors duration-300 ${
                        isComingSoon 
                          ? 'text-muted-foreground' 
                          : 'text-foreground group-hover:text-primary'
                      }`}>
                        {tool.title}
                      </CardTitle>
                      
                      {/* Description with better line clamping */}
                      <CardDescription className={`text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 transition-colors duration-300 ${
                        isComingSoon 
                          ? 'text-muted-foreground/70' 
                          : 'text-muted-foreground group-hover:text-foreground/80'
                      }`}>
                        {tool.description}
                      </CardDescription>
                    </div>

                    {/* Coming Soon Badge */}
                    {isComingSoon && (
                      <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md font-medium">
                        Coming Soon
                      </div>
                    )}

                    {/* Hover Shine Effect */}
                    {!isComingSoon && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    )}
                  </CardHeader>
                </Card>
              );

              if (isComingSoon) {
                return (
                  <div key={tool.id} data-testid={`tool-${tool.id}`} className="h-[240px]">
                    {cardContent}
                  </div>
                );
              }

              if (tool.isExternal) {
                return (
                  <a 
                    key={tool.id} 
                    href={tool.href} 
                    data-testid={`link-tool-${tool.id}`}
                    rel="noopener noreferrer"
                    className="block h-[240px]"
                  >
                    {cardContent}
                  </a>
                );
              } else {
                return (
                  <Link key={tool.id} href={tool.href} data-testid={`link-tool-${tool.id}`}>
                    <div className="block h-[240px]">
                      {cardContent}
                    </div>
                  </Link>
                );
              }
            })}
          </div>

          {/* CTA Section with enhanced styling */}
          <div className="mt-8 xs:mt-12 sm:mt-16 md:mt-20 text-center px-4">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 border border-primary/20">
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 xs:mb-3 sm:mb-4">
                Need a Specific Tool?
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-4 xs:mb-5 sm:mb-6">
                Can't find what you're looking for? Let us know what text processing tool would help your workflow.
              </p>
              <Link href="/contact" data-testid="link-request-tool-cta">
                <div className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium text-sm sm:text-base active:scale-95">
                  Request a Tool
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
