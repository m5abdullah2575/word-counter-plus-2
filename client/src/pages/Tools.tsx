import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { 
  FaPenFancy, 
  FaTextHeight, 
  FaPlus, 
  FaSearch, 
  FaCompress,
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
  FaSort
} from 'react-icons/fa';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getToolConfig, isDevelopment } from '@/lib/site';
import { useState, useMemo, useEffect } from 'react';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');

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
      isExternal: !isDevelopment() && !toolConfig.isMainDomain
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more. Ideal for formatting text for different platforms and coding conventions.',
      icon: FaTextHeight,
      href: toolConfig.textCaseUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain
    },
    {
      id: 'lorem-generator',
      title: 'Lorem Ipsum Generator',
      description: 'Generate placeholder text for your designs and layouts. Create custom amounts of Lorem Ipsum text with options for paragraphs, sentences, and words.',
      icon: FaQuoteLeft,
      href: '/lorem-generator',
      isExternal: false
    },
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and special characters for maximum security.',
      icon: FaKey,
      href: '/password-generator',
      isExternal: false
    },
    {
      id: 'find-replace',
      title: 'Find and Replace Tool',
      description: 'Search and replace text patterns with advanced options. Support for regular expressions, case sensitivity, and whole word matching for precise text editing.',
      icon: FaSearchPlus,
      href: '/find-replace',
      isExternal: false
    },
    {
      id: 'text-encoder',
      title: 'Text Encoder/Decoder',
      description: 'Encode and decode text using various methods including Base64, URL encoding, HTML entities, and more. Essential for web development and data processing.',
      icon: FaCode,
      href: '/text-encoder',
      isExternal: false
    },
    {
      id: 'text-summarizer',
      title: 'Text Summarizer',
      description: 'Extract key sentences and main points from long text. Perfect for summarizing articles, documents, and research papers using intelligent sentence scoring.',
      icon: FaCompress,
      href: '/text-summarizer',
      isExternal: false
    },
    {
      id: 'word-frequency-analyzer',
      title: 'Word Frequency Analyzer',
      description: 'Analyze word frequency and distribution in your text. Identify the most commonly used words, keyword density, and vocabulary richness statistics.',
      icon: FaChartBar,
      href: '/word-frequency-analyzer',
      isExternal: false
    },
    {
      id: 'text-diff-checker',
      title: 'Text Diff Checker',
      description: 'Compare two texts side by side and highlight differences. Find added, removed, and changed content between document versions with line-by-line comparison.',
      icon: FaExchangeAlt,
      href: '/text-diff-checker',
      isExternal: false
    },
    {
      id: 'duplicate-line-remover',
      title: 'Duplicate Line Remover',
      description: 'Remove duplicate lines from your text efficiently. Clean up lists, data files, and documents by eliminating redundant content with customizable options.',
      icon: FaFilter,
      href: '/duplicate-line-remover',
      isExternal: false
    },
    {
      id: 'text-sorting-tool',
      title: 'Text Sorting Tool',
      description: 'Sort text lines in various orders: alphabetical, by length, numerical, or random. Perfect for organizing lists, data files, and arranging content systematically.',
      icon: FaSort,
      href: '/text-sorting-tool',
      isExternal: false
    }
  ];

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTools;
    }
    
    const query = searchQuery.toLowerCase();
    return allTools.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              data-testid="button-clear-search"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* CTA Section - only show when no search query */}
        {!searchQuery.trim() && (
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