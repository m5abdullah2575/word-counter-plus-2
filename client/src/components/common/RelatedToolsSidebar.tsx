import { Link } from 'wouter';
import { FaCopy, FaSync, FaClock, FaSort, FaCheck } from "@/components/common/Icons";
import { 
  FaSpellCheck, 
  FaSearch, 
  FaChartLine, 
  FaMicrophone, 
  FaFileAlt, 
  FaRandom,
  FaHashtag
} from 'react-icons/fa';

interface RelatedToolsSidebarProps {
  currentTool?: string;
  limit?: number;
}

export default function RelatedToolsSidebar({ currentTool, limit = 5 }: RelatedToolsSidebarProps) {
  // Define all tools with their metadata and categories
  const allTools = [
    {
      href: "/",
      name: "Word Counter",
      description: "Count words & analyze text",
      icon: FaHashtag,
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      testId: "link-word-counter",
      category: "analysis"
    },
    {
      href: "/character-counter",
      name: "Character Counter",
      description: "Count characters & spaces",
      icon: FaCopy,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      testId: "link-character-counter",
      category: "analysis"
    },
    {
      href: "/grammar-checker",
      name: "Grammar Checker",
      description: "Fix grammar & spelling",
      icon: FaSpellCheck,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      testId: "link-grammar-checker",
      category: "writing"
    },
    {
      href: "/plagiarism-checker",
      name: "Plagiarism Checker",
      description: "Check content originality",
      icon: FaSearch,
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      testId: "link-plagiarism-checker",
      category: "writing"
    },
    {
      href: "/readability-calculator",
      name: "Readability Score",
      description: "Check text readability",
      icon: FaChartLine,
      iconColor: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      testId: "link-readability-calculator",
      category: "analysis"
    },
    {
      href: "/seo-content-analyzer",
      name: "SEO Analyzer",
      description: "Optimize content for SEO",
      icon: FaChartLine,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      testId: "link-seo-analyzer",
      category: "seo"
    },
    {
      href: "/speech-to-text",
      name: "Speech to Text",
      description: "Convert voice to text",
      icon: FaMicrophone,
      iconColor: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      testId: "link-speech-to-text",
      category: "conversion"
    },
    {
      href: "/resume-cv-checker",
      name: "Resume Checker",
      description: "Analyze your resume",
      icon: FaFileAlt,
      iconColor: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      testId: "link-resume-checker",
      category: "writing"
    },
    {
      href: "/random-word-generator",
      name: "Word Generator",
      description: "Generate random words",
      icon: FaRandom,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      testId: "link-word-generator",
      category: "utility"
    },
    {
      href: "/text-case-converter",
      name: "Case Converter",
      description: "Change text case format",
      icon: FaSync,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      testId: "link-text-case-converter",
      category: "utility"
    }
  ];

  // Smart filtering: prioritize tools from the same category, then others
  const currentToolData = allTools.find(tool => tool.href === currentTool);
  const currentCategory = currentToolData?.category;
  
  const filteredRelatedTools = allTools
    .filter(tool => tool.href !== currentTool)
    .sort((a, b) => {
      if (currentCategory) {
        if (a.category === currentCategory && b.category !== currentCategory) return -1;
        if (a.category !== currentCategory && b.category === currentCategory) return 1;
      }
      return 0;
    })
    .slice(0, limit);

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
    </div>
  );
}