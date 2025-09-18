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
  FaEraser
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

  useSEO({
    title: 'All Text Tools - Word Counter Plus',
    description: 'Explore our comprehensive collection of text analysis and processing tools. From word counting to text case conversion and more.',
    keywords: 'text tools, word counter, text case converter, text analysis, writing tools'
  });

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Text Analysis Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Powerful tools to analyze, process, and transform your text. Perfect for writers, 
            content creators, students, and professionals who work with text daily.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-10 px-4 text-sm font-medium transition-all duration-200 hover:scale-105"
                data-testid={`button-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Category Description */}
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              {categories.find(cat => cat.id === selectedCategory)?.description}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
              data-testid="input-search-tools"
            />
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              const cardContent = (
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-border bg-card">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <IconComponent className="text-3xl text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
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

            {/* Coming Soon Card - only show when no search query */}
            {!searchQuery.trim() && (
              <Card className="h-full border-dashed border-2 border-border bg-muted/20">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                      <FaPlus className="text-3xl text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-muted-foreground">
                    More Tools Coming Soon
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    We're constantly adding new text processing and analysis tools to help improve your workflow.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <FaSearch className="text-3xl text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tools found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try searching with different keywords or browse all our tools.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2"
              data-testid="button-clear-search"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section - only show when no search query and all category is selected */}
        {!searchQuery.trim() && selectedCategory === 'all' && (
          <div className="text-center bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Need a Specific Tool?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Let us know what text processing tool would help your workflow.
            </p>
            <Link href="/contact" data-testid="link-contact-request">
              <div className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Request a Tool
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}