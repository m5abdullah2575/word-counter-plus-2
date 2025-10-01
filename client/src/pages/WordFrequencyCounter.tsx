import WordFrequencyCounter from '@/components/text-tools/WordFrequencyCounter';
import { useSEO } from '@/hooks/useSEO';

export default function WordFrequencyCounterPage() {
  const wordFrequencySchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Word Frequency Counter - Text Analysis Tool",
    "alternateName": ["Word Frequency Counter", "Word Count Frequency", "Word Occurrence Counter"],
    "url": "https://wordcounterplusapp.com/word-frequency-counter",
    "description": "Advanced word frequency counter that analyzes text and displays how many times each unique word appears. Sort results by word or frequency, download as CSV, and analyze text diversity.",
    "applicationCategory": ["Productivity", "Text Analysis", "Writing"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Word Counter Plus"
    },
    "featureList": [
      "Count word frequency and occurrences",
      "Display unique words and total words",
      "Sort by word or frequency",
      "Download results as CSV",
      "Text diversity ratio analysis",
      "Upload text files",
      "Real-time analysis"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  useSEO({
    title: 'Word Frequency Counter 2025 - Count Word Occurrences & Analyze Text | Word Counter Plus',
    description: 'Free word frequency counter to analyze how many times each word appears in your text. Sort results by word or frequency, download as CSV, and track text diversity. Perfect for writers, researchers, and content creators. Mobile-optimized and completely free.',
    keywords: 'word frequency counter, word occurrence counter, word frequency analysis, count word frequency, word frequency tool, text frequency analyzer, word occurrence tool, word count frequency, unique word counter, word diversity analyzer, text analysis tool, word frequency chart, word distribution analysis, keyword frequency counter, word repetition checker, text statistics tool, word usage analyzer, content analysis tool, linguistic analysis, word pattern analysis, text mining tool, word frequency calculator, vocabulary diversity tool, word occurrence statistics, SEO keyword frequency, content optimization tool, academic text analyzer, research text analysis, word cloud data, text diversity ratio',
    canonical: 'https://wordcounterplusapp.com/word-frequency-counter',
    structuredData: wordFrequencySchema
  });

  return (
    <>
      <WordFrequencyCounter />
    </>
  );
}
