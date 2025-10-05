import { 
  FaPenFancy, 
  FaTextHeight, 
  FaHashtag,
  FaChartBar,
  FaPlus,
  FaRandom
} from 'react-icons/fa';
import { IconType } from 'react-icons';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  href: string;
  isExternal: boolean;
  category: string;
  tags: string[];
  isComingSoon?: boolean;
  featured?: boolean;
}

export const getToolsData = (): Tool[] => {
  
  return [
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Advanced word counting tool with real-time text analysis, readability scores, and keyword density analysis. Perfect for writers, students, and content creators.',
      icon: FaPenFancy,
      href: '/',
      isExternal: false,
      category: 'Analysis',
      tags: ['word count', 'readability', 'analysis', 'writing'],
      featured: true
    },
    {
      id: 'character-counter',
      title: 'Character Counter',
      description: 'Count characters with and without spaces, words, sentences, paragraphs, and check social media character limits for all major platforms.',
      icon: FaHashtag,
      href: '/character-counter',
      isExternal: false,
      category: 'Analysis',
      tags: ['character count', 'social media', 'limits', 'twitter'],
      featured: true
    },
    {
      id: 'text-case-converter',
      title: 'Text Case Converter',
      description: 'Convert text between different cases: uppercase, lowercase, title case, camel case, and more. Ideal for formatting text for different platforms.',
      icon: FaTextHeight,
      href: '/text-case-converter',
      isExternal: false,
      category: 'Formatting',
      tags: ['case conversion', 'formatting', 'uppercase', 'lowercase'],
      featured: true
    },
    {
      id: 'word-frequency-counter',
      title: 'Word Frequency Counter',
      description: 'Count how many times each unique word appears in your text. Sort results by word or frequency and download as CSV for analysis.',
      icon: FaChartBar,
      href: '/word-frequency-counter',
      isExternal: false,
      category: 'Analysis',
      tags: ['word frequency', 'word count', 'occurrence', 'analysis', 'statistics'],
      featured: true
    },
    {
      id: 'random-word-generator',
      title: 'Random Word Generator',
      description: 'Generate random words with customizable options including word count, length, type, and complexity for creative writing and brainstorming.',
      icon: FaRandom,
      href: '/random-word-generator',
      isExternal: false,
      category: 'Generation',
      tags: ['random words', 'word generator', 'creative writing', 'brainstorming', 'random'],
      featured: true
    },
    // Future tools (coming soon) - only one placeholder
    {
      id: 'more-tools-coming-soon',
      title: 'More Tools Coming Soon',
      description: 'We\'re constantly adding new text processing and analysis tools to help improve your workflow.',
      icon: FaPlus,
      href: '#',
      isExternal: false,
      category: 'Coming Soon',
      tags: ['coming', 'soon', 'new', 'tools'],
      isComingSoon: true
    }
  ];
};

export const getAvailableTools = (): Tool[] => {
  return getToolsData().filter(tool => !tool.isComingSoon);
};

export const getComingSoonTools = (): Tool[] => {
  return getToolsData().filter(tool => tool.isComingSoon);
};

export const getFeaturedTools = (): Tool[] => {
  return getToolsData().filter(tool => tool.featured && !tool.isComingSoon);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return getToolsData().filter(tool => tool.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = getToolsData().map(tool => tool.category);
  return [...new Set(categories)];
};