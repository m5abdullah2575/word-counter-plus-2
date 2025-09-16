import { Link } from 'wouter';
import { FaCopy, FaSync, FaClock, FaSort, FaCheck } from "@/components/common/Icons";

interface RelatedToolsSidebarProps {
  currentTool?: string; // To highlight the current tool or exclude it from the list
}

export default function RelatedToolsSidebar({ currentTool }: RelatedToolsSidebarProps) {
  // Define all related tools with their metadata
  const relatedTools = [
    {
      href: "/",
      name: "Word Counter",
      description: "Count words & analyze text",
      icon: FaCopy,
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      testId: "link-word-counter"
    },
    {
      href: "/character-counter",
      name: "Character Counter",
      description: "Count characters & spaces",
      icon: FaCopy,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      testId: "link-character-counter"
    },
    {
      href: "/text-case-convert",
      name: "Case Converter",
      description: "Change text case format",
      icon: FaSync,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      testId: "link-text-case-converter"
    },
    {
      href: "/reading-time-calculator",
      name: "Reading Time",
      description: "Calculate read duration",
      icon: FaClock,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      testId: "link-reading-time"
    },
    {
      href: "/line-counter",
      name: "Line Counter",
      description: "Count text lines",
      icon: FaSort,
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      testId: "link-line-counter"
    }
  ];

  // Define other tools
  const otherTools = [
    {
      href: "/lorem-generator",
      name: "Lorem Ipsum Generator",
      testId: "link-lorem-generator"
    },
    {
      href: "/password-generator",
      name: "Password Generator",
      testId: "link-password-generator"
    },
    {
      href: "/text-encoder",
      name: "Text Encoder/Decoder",
      testId: "link-text-encoder"
    },
    {
      href: "/qr-code-generator",
      name: "QR Code Generator",
      testId: "link-qr-generator"
    },
    {
      href: "/json-formatter",
      name: "JSON Formatter",
      testId: "link-json-formatter"
    },
    {
      href: "/find-replace",
      name: "Find & Replace Tool",
      testId: "link-find-replace"
    },
    {
      href: "/duplicate-line-remover",
      name: "Duplicate Line Remover",
      testId: "link-duplicate-remover"
    },
    {
      href: "/text-sorting-tool",
      name: "Text Sorting Tool",
      testId: "link-text-sorting"
    },
    {
      href: "/whitespace-remover",
      name: "Whitespace Remover",
      testId: "link-whitespace-remover"
    },
    {
      href: "/word-frequency-analyzer",
      name: "Word Frequency Analyzer",
      testId: "link-word-frequency"
    },
    {
      href: "/text-diff-checker",
      name: "Text Diff Checker",
      testId: "link-text-diff"
    }
  ];

  // Filter out the current tool from both lists
  const filteredRelatedTools = relatedTools.filter(tool => tool.href !== currentTool);
  const filteredOtherTools = otherTools.filter(tool => tool.href !== currentTool);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Related Tools */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Related Tools</h3>
        <div className="grid grid-cols-1 gap-3">
          {filteredRelatedTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link 
                key={tool.href}
                href={tool.href} 
                className="group flex items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" 
                data-testid={tool.testId}
                aria-label={`Go to ${tool.name} tool`}
              >
                <div className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className={`${tool.iconColor} text-lg`} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{tool.name}</h4>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-border">
          <Link 
            href="/tools" 
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center py-2 hover:bg-primary/5 rounded focus-visible:ring-2 focus-visible:ring-primary" 
            data-testid="link-more-tools"
          >
            More Text Tools →
          </Link>
        </div>
      </div>

      {/* Other Tools Category */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Other Tools</h3>
        <div className="space-y-3">
          {filteredOtherTools.map((tool) => (
            <a 
              key={tool.href}
              href={tool.href} 
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" 
              data-testid={tool.testId}
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {/* Advertisement Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center text-sm text-muted-foreground">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-48 flex items-center justify-center mb-2">
            <span className="text-gray-500 dark:text-gray-400">Advertisement Space</span>
          </div>
          <p className="text-xs">Promote your business here</p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">💡 Writing Tips</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start">
            <FaCheck className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
            Keep sentences under 20 words for better readability
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
            Aim for 1-2% keyword density for SEO
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
            Use active voice for clearer writing
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
            Break up long paragraphs for better flow
          </li>
        </ul>
      </div>

      {/* Word Count Goals */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">📊 Word Count Guidelines</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Blog Post</span>
            <span className="font-semibold text-primary">1,500-2,500</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Social Media</span>
            <span className="font-semibold text-primary">100-280</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Email Subject</span>
            <span className="font-semibold text-primary">6-10</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Meta Description</span>
            <span className="font-semibold text-primary">120-160</span>
          </div>
        </div>
      </div>
    </div>
  );
}