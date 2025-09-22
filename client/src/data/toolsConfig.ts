import { 
  FaPenFancy, 
  FaTextHeight, 
  FaHashtag,
  FaSpellCheck,
  FaAlignLeft,
  FaPalette,
  FaLanguage,
  FaFileAlt
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
    // Future tools (coming soon)
    {
      id: 'grammar-checker',
      title: 'Grammar Checker',
      description: 'Advanced grammar and spell checking tool to help you write error-free content with intelligent suggestions and corrections.',
      icon: FaSpellCheck,
      href: '/grammar-checker',
      isExternal: false,
      category: 'Analysis',
      tags: ['grammar', 'spelling', 'correction', 'proofreading'],
      isComingSoon: true
    },
    {
      id: 'text-summarizer',
      title: 'Text Summarizer',
      description: 'Automatically generate concise summaries of long texts while preserving key information and main ideas.',
      icon: FaAlignLeft,
      href: '/text-summarizer',
      isExternal: false,
      category: 'Analysis',
      tags: ['summarize', 'ai', 'content', 'extract'],
      isComingSoon: true
    },
    {
      id: 'text-formatter',
      title: 'Text Formatter',
      description: 'Format and beautify your text with various styling options, indentation, and structure improvements.',
      icon: FaPalette,
      href: '/text-formatter',
      isExternal: false,
      category: 'Formatting',
      tags: ['format', 'beautify', 'structure', 'styling'],
      isComingSoon: true
    },
    {
      id: 'language-detector',
      title: 'Language Detector',
      description: 'Automatically detect the language of any text with high accuracy across multiple languages and scripts.',
      icon: FaLanguage,
      href: '/language-detector',
      isExternal: false,
      category: 'Analysis',
      tags: ['language', 'detection', 'multilingual', 'identify'],
      isComingSoon: true
    },
    {
      id: 'text-extractor',
      title: 'Text Extractor',
      description: 'Extract text from images, PDFs, and other documents with OCR technology for easy editing and analysis.',
      icon: FaFileAlt,
      href: '/text-extractor',
      isExternal: false,
      category: 'Conversion',
      tags: ['ocr', 'extract', 'pdf', 'image', 'conversion'],
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