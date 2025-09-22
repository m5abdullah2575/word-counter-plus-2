import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { 
  FaPenFancy, 
  FaTextHeight, 
  FaPlus, 
  FaSearch, 
  FaQuoteLeft,
  FaExchangeAlt,
  FaSearchPlus,
  FaCode,
  FaKey,
  FaFileCode,
  FaChartBar,
  FaRandom,
  FaCog,
  FaAlignLeft,
  FaHashtag,
  FaFilter,
  FaSort,
  FaListOl,
  FaClock,
  FaQrcode,
  FaEraser,
  FaLightbulb,
  FaUsers,
  FaEnvelope,
  FaBookOpen
} from 'react-icons/fa';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getToolConfig, isDevelopment } from '@/lib/site';
import { useState, useMemo, useEffect } from 'react';

// Tool categories for organization
type ToolCategory = 'all' | 'text-analysis' | 'text-processing' | 'content-generation' | 'development';

interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
}

const categories: ToolCategoryInfo[] = [
  {
    id: 'all',
    name: 'All Tools',
    description: 'Browse our complete collection of text tools'
  },
  {
    id: 'text-analysis',
    name: 'Text Analysis',
    description: 'Analyze and measure text properties'
  },
  {
    id: 'text-processing',
    name: 'Text Processing',
    description: 'Transform and manipulate text'
  },
  {
    id: 'content-generation',
    name: 'Content Generation',
    description: 'Generate new content and codes'
  },
  {
    id: 'development',
    name: 'Development Tools',
    description: 'Tools for developers and coders'
  }
];

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  // Ensure page starts at the top
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    
    // Additional scroll after a short delay to handle async rendering
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Get host-aware URLs for tools
  const toolConfig = getToolConfig();

  const allTools = [
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Advanced word counting tool with real-time text analysis, readability scores, and keyword density analysis. Perfect for writers, students, and content creators who need detailed text statistics.',
      icon: FaPenFancy,
      href: toolConfig.wordCounterUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      category: 'text-analysis' as ToolCategory
    },
    {
      id: 'character-counter',
      title: 'Character Counter',
      description: 'Count characters with and without spaces, words, sentences, paragraphs, and check social media character limits for Twitter, Facebook, Instagram, and more platforms.',
      icon: FaHashtag,
      href: '/character-counter',
      isExternal: false,
      category: 'text-analysis' as ToolCategory
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more. Ideal for formatting text for different platforms and coding conventions.',
      icon: FaTextHeight,
      href: toolConfig.textCaseUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      category: 'text-processing' as ToolCategory
    }
  ];

  // Enhanced structured data for Tools collection
  const toolsCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Text Analysis Tools Collection - Word Counter Plus",
    "description": "Comprehensive collection of professional text analysis, word counting, and text processing tools for writers, content creators, and developers.",
    "url": "https://wordcounterplusapp.com/tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allTools.length,
      "itemListElement": allTools.map((tool, index) => ({
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
    title: 'All Text Tools - Word Counter Plus',
    description: 'Explore our comprehensive collection of text analysis and processing tools. From word counting to text case conversion and more.',
    keywords: 'text tools, word counter, text case converter, text analysis, writing tools',
    canonical: 'https://wordcounterplusapp.com/tools',
    structuredData: toolsCollectionSchema,
    breadcrumbs: [
      { name: "Home", url: "https://wordcounterplusapp.com" },
      { name: "Tools", url: "https://wordcounterplusapp.com/tools" }
    ]
  });

  // Filter tools based on search query and category
  const filteredTools = useMemo(() => {
    let filtered = allTools;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg shadow-primary/25">
              <FaPenFancy className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Text Analysis Tools
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              Powerful tools to analyze, process, and transform your text. Perfect for writers, 
              content creators, students, and professionals who work with text daily.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                <FaLightbulb className="w-4 h-4 mr-2" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-500/20">
                <FaUsers className="w-4 h-4 mr-2" />
                2M+ Happy Users
              </div>
              <div className="flex items-center px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20">
                <FaClock className="w-4 h-4 mr-2" />
                Free & Instant
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="h-11 px-6 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                    data-testid={`button-category-${category.id}`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              
              {/* Category Description */}
              <div className="text-center mb-8">
                <p className="text-muted-foreground text-lg">
                  {categories.find(cat => cat.id === selectedCategory)?.description}
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Search tools by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full text-base bg-background/50 border-border/50 focus:bg-background focus:border-primary/40 transition-all"
                  data-testid="input-search-tools"
                />
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
              {filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                const cardContent = (
                  <Card className="group h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="text-center p-8">
                      <div className="flex justify-center mb-6">
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                          <IconComponent className="text-4xl text-primary group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      <div className="mt-6 pt-4 border-t border-border/30">
                        <div className="flex items-center justify-center text-xs text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
                          <span className="px-3 py-1.5 bg-muted/50 rounded-full border border-border/30 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                            Click to open
                          </span>
                        </div>
                      </div>
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

              {/* Coming Soon Card - only show when no search query */}
              {!searchQuery.trim() && (
                <Card className="group h-full border-dashed border-2 border-border/50 bg-gradient-to-br from-muted/20 via-muted/10 to-background hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="text-center p-8">
                    <div className="flex justify-center mb-6">
                      <div className="p-6 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-all duration-300">
                        <FaPlus className="text-4xl text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 mb-3">
                      More Tools Coming Soon
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      We're constantly adding new text processing and analysis tools to help improve your workflow.
                    </CardDescription>
                    <div className="mt-6 pt-4 border-t border-border/30">
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <span className="px-3 py-1.5 bg-muted/30 rounded-full border border-border/30">
                          Stay tuned for updates
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </div>
          ) : (
            /* No Results State */
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-3xl bg-muted/50 border border-border/30">
                  <FaSearch className="text-5xl text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No tools found
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                Try searching with different keywords or browse all our tools.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-8 py-3 text-base font-medium"
                data-testid="button-clear-search"
              >
                <FaEraser className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}

          {/* CTA Section - only show when no search query and all category is selected */}
          {!searchQuery.trim() && selectedCategory === 'all' && (
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-8 lg:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <FaLightbulb className="text-3xl text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Need a Specific Tool?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Can't find what you're looking for? Let us know what text processing tool would help your workflow. We're always looking to add new features based on user feedback.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" data-testid="link-contact-request">
                    <div className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:scale-105 transition-all duration-200 font-medium text-base shadow-lg shadow-primary/25">
                      <FaEnvelope className="w-5 h-5 mr-3" />
                      Request a Tool
                    </div>
                  </Link>
                  <Link href="/blog" data-testid="link-blog">
                    <div className="inline-flex items-center px-8 py-4 bg-background text-foreground border border-border rounded-xl hover:bg-muted hover:scale-105 transition-all duration-200 font-medium text-base">
                      <FaBookOpen className="w-5 h-5 mr-3" />
                      Read Writing Tips
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}