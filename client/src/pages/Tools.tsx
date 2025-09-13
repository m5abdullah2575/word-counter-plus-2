import { Link } from 'wouter';
import useSEO from '@/hooks/useSEO';
import { FaPenFancy, FaTextHeight, FaPlus } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getToolConfig, isDevelopment } from '@/lib/site';

export default function Tools() {
  useSEO({
    title: 'All Text Tools - Word Counter Plus',
    description: 'Explore our comprehensive collection of text analysis and processing tools. From word counting to text case conversion and more.',
    keywords: 'text tools, word counter, text case converter, text analysis, writing tools'
  });

  // Get host-aware URLs for tools
  const toolConfig = getToolConfig();

  const tools = [
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Advanced word counting tool with real-time text analysis, readability scores, and keyword density analysis.',
      icon: FaPenFancy,
      href: toolConfig.wordCounterUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      features: ['Real-time counting', 'Readability analysis', 'Keyword density', 'Export options']
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more.',
      icon: FaTextHeight,
      href: toolConfig.textCaseUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      features: ['Multiple case types', 'Batch processing', 'File upload support', 'Instant conversion']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Text Analysis Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools to analyze, process, and transform your text. Perfect for writers, 
            content creators, students, and professionals who work with text daily.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => {
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
                <CardContent>
                  <ul className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
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

          {/* Coming Soon Card */}
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
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
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
      </div>
    </div>
  );
}