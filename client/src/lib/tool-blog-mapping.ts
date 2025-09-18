import { getToolConfig, isDevelopment } from './site';

// Tool information for mapping
export interface ToolInfo {
  id: string;
  title: string;
  href: string;
  isExternal: boolean;
  keywords: string[]; // Keywords to match against blog content
}

// Get all available tools with mapping information
export function getAllTools(): ToolInfo[] {
  const toolConfig = getToolConfig();

  return [
    {
      id: 'word-counter',
      title: 'Word Counter',
      href: toolConfig.wordCounterUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      keywords: ['word count', 'text analysis', 'readability', 'writing', 'content', 'word frequency', 'keyword density']
    },
    {
      id: 'character-counter',
      title: 'Character Counter',
      href: '/character-counter',
      isExternal: false,
      keywords: ['character count', 'character limit', 'social media', 'twitter', 'facebook', 'instagram']
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      href: toolConfig.textCaseUrl,
      isExternal: !isDevelopment() && !toolConfig.isMainDomain,
      keywords: ['text case', 'uppercase', 'lowercase', 'title case', 'camel case', 'formatting']
    }
  ];
}

// Find the most relevant tool for a blog post
export function getRelatedTool(blogTitle: string, blogContent: string, blogTags: string[]): ToolInfo | null {
  const tools = getAllTools();
  const searchText = `${blogTitle} ${blogContent} ${blogTags.join(' ')}`.toLowerCase();
  
  let bestMatch: ToolInfo | null = null;
  let bestScore = 0;

  for (const tool of tools) {
    let score = 0;
    
    // Check how many keywords match
    for (const keyword of tool.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        // Give higher weight to exact matches and title matches
        if (blogTitle.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        } else if (blogTags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = tool;
    }
  }
  
  // Only return a match if we have a reasonable confidence level
  return bestScore >= 2 ? bestMatch : null;
}

// Find all tools related to a blog post (for showing multiple options)
export function getAllRelatedTools(blogTitle: string, blogContent: string, blogTags: string[], limit: number = 3): ToolInfo[] {
  const tools = getAllTools();
  const searchText = `${blogTitle} ${blogContent} ${blogTags.join(' ')}`.toLowerCase();
  
  const toolScores = tools.map(tool => {
    let score = 0;
    
    for (const keyword of tool.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        if (blogTitle.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        } else if (blogTags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    return { tool, score };
  });
  
  return toolScores
    .filter(item => item.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);
}

// Find blog posts related to a specific tool
export function getBlogPostsForTool(toolId: string, allBlogPosts: any[], limit: number = 3): any[] {
  const tool = getAllTools().find(t => t.id === toolId);
  if (!tool) return [];
  
  const relatedPosts = allBlogPosts.map(post => {
    const searchText = `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
    let score = 0;
    
    for (const keyword of tool.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        if (post.title.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        } else if (post.tags.some((tag: string) => tag.toLowerCase().includes(keyword.toLowerCase()))) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    return { post, score };
  });
  
  return relatedPosts
    .filter(item => item.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}