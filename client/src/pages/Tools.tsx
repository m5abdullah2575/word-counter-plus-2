import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { 
  FaPenFancy, 
  FaTextHeight, 
  FaHashtag
} from 'react-icons/fa';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getToolConfig, isDevelopment } from '@/lib/site';
import { useEffect } from 'react';

export default function Tools() {
  // Ensure page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get host-aware URLs for tools
  const toolConfig = getToolConfig();

  const tools = [
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Advanced word counting tool with real-time text analysis, readability scores, and keyword density analysis. Perfect for writers, students, and content creators.',
      icon: FaPenFancy,
      href: toolConfig.wordCounterUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain
    },
    {
      id: 'character-counter',
      title: 'Character Counter',
      description: 'Count characters with and without spaces, words, sentences, paragraphs, and check social media character limits for all major platforms.',
      icon: FaHashtag,
      href: '/character-counter',
      isExternal: false
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more. Ideal for formatting text for different platforms.',
      icon: FaTextHeight,
      href: toolConfig.textCaseUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain
    }
  ];

  // Enhanced structured data for Tools collection
  const toolsCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Text Analysis Tools Collection - Word Counter Plus",
    "description": "Professional text analysis, word counting, and text processing tools for writers, content creators, and students.",
    "url": "https://wordcounterplusapp.com/tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
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

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              const cardContent = (
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card border-border">
                  <CardHeader className="text-center p-8">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-xl bg-primary/10">
                        <IconComponent className="text-4xl text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground mb-3">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
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