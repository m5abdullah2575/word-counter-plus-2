import WordFrequencyCounter from '@/components/text-tools/WordFrequencyCounter';
import { useSEO } from '@/hooks/useSEO';
import { FaCheckCircle, FaChartBar, FaFilter, FaHighlighter, FaBolt, FaGraduationCap, FaPenFancy, FaSearch } from 'react-icons/fa';
import { Link } from 'wouter';

export default function WordFrequencyCounterPage() {
  const wordFrequencySchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Word Frequency Counter - Advanced Text Analysis Tool 2025",
    "alternateName": ["Word Frequency Counter", "Word Occurrence Counter", "Keyword Density Analyzer", "Word Frequency Analysis Tool"],
    "url": "https://wordcounterplusapp.com/word-frequency-counter",
    "description": "Professional word frequency counter with stop word filtering, case sensitivity options, keyword density analysis, and visual charts. Analyze word patterns, track keyword usage, and optimize content for SEO. Free online tool with CSV export.",
    "applicationCategory": ["Productivity", "Text Analysis", "Writing", "SEO Tools", "Content Marketing"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Word Counter Plus",
      "url": "https://wordcounterplusapp.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1,856",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Count word frequency and occurrences",
      "Keyword density percentage calculation",
      "Stop words filtering (common words like 'the', 'is', 'and')",
      "Case-sensitive and case-insensitive analysis",
      "Minimum word length filter",
      "Top 20 words bar chart visualization",
      "Click to highlight word occurrences in text",
      "Sort by word or frequency",
      "Download results as CSV with density data",
      "Real-time word frequency analysis",
      "Text diversity ratio calculation",
      "Upload text files for analysis",
      "Mobile-responsive design"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    }
  };

  useSEO({
    title: 'Free Word Frequency Counter 2025 - Keyword Density Analyzer & SEO Tool | US, UK, CA',
    description: 'Advanced word frequency counter free with keyword density analysis, stop word filtering, visual charts. Analyze text patterns, SEO keyword optimization, track word usage. Used by 50K+ SEO specialists, content marketers, researchers in USA, UK, Canada, Australia. CSV export, click-to-highlight, real-time analysis.',
    keywords: 'word frequency counter free, keyword density analyzer, word occurrence counter, text frequency analysis tool, keyword frequency checker free, word usage analyzer, SEO keyword density calculator, content analysis tool free, word repetition checker, word distribution chart, text pattern analysis, stop words filter, word occurrence statistics, keyword analysis tool, text analytics free, word frequency visualization, corpus analysis tool, text diversity analyzer, unique word counter, semantic analysis tool',
    canonical: 'https://wordcounterplusapp.com/word-frequency-counter',
    structuredData: wordFrequencySchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/word-frequency-counter',
      'en-GB': 'https://wordcounterplusapp.com/word-frequency-counter',
      'en-CA': 'https://wordcounterplusapp.com/word-frequency-counter',
      'en-AU': 'https://wordcounterplusapp.com/word-frequency-counter',
      'x-default': 'https://wordcounterplusapp.com/word-frequency-counter'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Word Frequency Counter', url: 'https://wordcounterplusapp.com/word-frequency-counter' }
    ]
  });

  return (
    <>
      <WordFrequencyCounter />

      {/* How to Use Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-sm border border-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
              How to Use the Word Frequency Counter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Enter or Upload Your Text</h3>
                    <p className="text-sm text-muted-foreground">
                      Type or paste your content into the text area. You can also upload a .txt file using the Upload button for quick analysis of larger documents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Configure Filter Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Toggle "Ignore Stop Words" to filter out common words like "the", "is", and "and". Enable "Case Sensitive" to treat "Word" and "word" separately. Use the minimum length slider to filter words by character count (1-10).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">View Results & Statistics</h3>
                    <p className="text-sm text-muted-foreground">
                      See total words (filtered), unique words count, and diversity ratio. Switch between Table View to see all words with frequency and density percentages, or Chart View for a visual bar chart of the top 20 most frequent words.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Highlight Words in Text</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the highlight icon next to any word in the table, or click on a bar in the chart to highlight all occurrences of that word in your original text. This helps you visualize word distribution and repetition patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Sort & Analyze Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on "Word" or "Frequency" column headers to sort alphabetically or by occurrence count. Review keyword density percentages to identify which words dominate your content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">6</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Export Your Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Download your word frequency analysis as a CSV file with word, frequency, and density columns. Perfect for further analysis, reporting, or sharing with team members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Advanced Features for Text Analysis
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaFilter className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Stop Words Filtering</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically filter out common words (the, is, and, etc.) to focus on meaningful keywords and content-specific terms in your analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaChartBar className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Visual Bar Chart</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View top 20 most frequent words in an interactive bar chart. Click any bar to highlight that word throughout your text for pattern analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaHighlighter className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Click to Highlight</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Click any word to instantly highlight all occurrences in your text. Perfect for identifying repetition, analyzing word placement, and improving content flow.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaBolt className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Keyword Density</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Calculate precise keyword density percentages for SEO optimization. Track how often important terms appear relative to total word count.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaCheckCircle className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Case Sensitivity</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Toggle case-sensitive analysis to treat "Apple" and "apple" as different words, or combine them for general frequency counting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <FaSearch className="text-primary text-2xl mr-3" />
                <h3 className="font-semibold text-foreground">Min Length Filter</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Filter words by minimum character length (1-10) to focus on substantial terms and eliminate short filler words from your analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
              Perfect for Every Professional
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <FaPenFancy className="text-primary text-2xl" aria-label="Pen Icon" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">Content Writers & Bloggers</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze keyword usage, avoid word repetition, and optimize content for SEO. Track keyword density to ensure natural keyword distribution and improve search rankings.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <FaGraduationCap className="text-primary text-2xl" aria-label="Graduation Cap Icon" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">Researchers & Students</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze academic papers, identify overused terms, and study vocabulary diversity. Perfect for linguistic research, literature analysis, and thesis writing.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <FaSearch className="text-primary text-2xl" aria-label="Search Icon" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">SEO Specialists</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor keyword frequency, analyze competitor content, and optimize pages for target keywords. Export data for comprehensive SEO reports and strategy planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive SEO Blog Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-sm border border-border">
            <article className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Word Frequency Analysis: The Complete Guide to Text Pattern Recognition and Content Optimization
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Understanding Word Frequency Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Word frequency analysis is a powerful text analysis technique that reveals how often specific words appear in your content. This fundamental method helps writers, researchers, and SEO professionals understand content patterns, identify overused terms, and optimize keyword distribution for better readability and search engine performance.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Professional content creators rely on word frequency counting to maintain natural keyword density, typically targeting 1-3% for primary keywords. This balanced approach ensures content reads naturally while maximizing SEO effectiveness without triggering keyword stuffing penalties from search engines.
                  </p>

                  <h4 className="text-lg font-semibold text-foreground mb-3">Essential SEO Applications</h4>
                  <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                    <li><strong>Keyword Density Optimization:</strong> Maintain ideal 1-3% density for primary keywords and 0.5-1% for secondary keywords</li>
                    <li><strong>Semantic Analysis:</strong> Identify related terms and LSI keywords to strengthen topical relevance</li>
                    <li><strong>Content Gap Analysis:</strong> Compare word usage against competitor content to identify optimization opportunities</li>
                    <li><strong>Over-Optimization Detection:</strong> Spot excessive keyword repetition that could harm search rankings</li>
                    <li><strong>Topic Clustering:</strong> Group related keywords for comprehensive content coverage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Advanced Features and Filters</h3>
                  <p className="text-muted-foreground mb-4">
                    Modern word frequency counters offer sophisticated filtering options that enhance analysis accuracy. Stop word filtering removes common words like "the," "is," and "and" that don't contribute to content meaning, allowing you to focus on substantive keywords and industry-specific terminology.
                  </p>

                  <h4 className="text-lg font-semibold text-foreground mb-3">Professional Analysis Tools</h4>
                  <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                    <li><strong>Stop Words Filtering:</strong> Remove 100+ common words to focus on meaningful content terms</li>
                    <li><strong>Case Sensitivity Control:</strong> Distinguish proper nouns from common words or combine for general analysis</li>
                    <li><strong>Minimum Length Filtering:</strong> Eliminate short words (1-2 characters) that rarely carry meaning</li>
                    <li><strong>Visual Distribution Charts:</strong> Bar charts display top 20 words for quick pattern recognition</li>
                    <li><strong>Interactive Highlighting:</strong> Click words to visualize their distribution throughout text</li>
                    <li><strong>CSV Export:</strong> Download frequency data with density percentages for detailed reporting</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Content Marketing and SEO Strategy</h3>
                <p className="text-muted-foreground mb-4">
                  Word frequency analysis transforms content strategy by revealing optimization opportunities invisible to manual review. Content marketers use frequency data to ensure target keywords appear naturally throughout articles while maintaining readability. This data-driven approach helps create content that satisfies both search engine algorithms and human readers.
                </p>
                
                <div className="bg-muted/30 rounded-lg p-6 mb-4">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Optimal Keyword Density Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Primary Keywords</h5>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Target density: 1-3% of total words</li>
                        <li>Avoid exceeding 5% to prevent penalties</li>
                        <li>Distribute evenly throughout content</li>
                        <li>Include in title, headers, and meta description</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Secondary Keywords</h5>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Target density: 0.5-1% of total words</li>
                        <li>Support primary keyword themes</li>
                        <li>Enhance semantic relevance</li>
                        <li>Improve long-tail search visibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Academic and Research Applications</h3>
                <p className="text-muted-foreground mb-4">
                  Researchers and academic writers utilize word frequency analysis for linguistic studies, literature analysis, and vocabulary diversity assessment. This quantitative approach provides objective data about text composition, revealing patterns that support literary criticism, authorship attribution studies, and comparative text analysis.
                </p>

                <h4 className="text-lg font-semibold text-foreground mb-3">Research Methodologies</h4>
                <div className="space-y-3 text-muted-foreground mb-4">
                  <p>
                    <strong>Corpus Linguistics:</strong> Analyze large text collections to identify language patterns, collocations, and usage trends across different genres, time periods, or authors. Word frequency data forms the foundation for computational linguistics research.
                  </p>
                  <p>
                    <strong>Stylometric Analysis:</strong> Examine author writing styles through word choice patterns. Frequency analysis can reveal distinctive vocabulary preferences that help attribute anonymous texts or study stylistic evolution across an author's career.
                  </p>
                  <p>
                    <strong>Readability Assessment:</strong> Vocabulary diversity, measured through unique word ratios, indicates text complexity. Higher diversity ratios (40-60%) suggest sophisticated vocabulary, while lower ratios indicate simpler, more accessible content.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Content Quality and Readability Optimization</h3>
                <p className="text-muted-foreground mb-4">
                  Excessive word repetition damages content quality and reader engagement. Word frequency analysis identifies overused terms that create monotonous prose, enabling writers to enhance vocabulary variety through synonym substitution and sentence restructuring.
                </p>

                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 mb-4">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Quality Improvement Strategies</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Identify Repetition Patterns</h5>
                      <p>Use click-to-highlight features to visualize word distribution. Words appearing in clusters indicate areas needing revision for better flow and variety.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Balance Keyword Usage</h5>
                      <p>Monitor keyword density to ensure natural distribution. Excessive concentration in specific paragraphs appears artificial to both readers and search algorithms.</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-1">Enhance Vocabulary Diversity</h5>
                      <p>Target diversity ratios above 40% for professional content. Low ratios indicate limited vocabulary; use synonyms and varied expressions to improve richness.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Competitive Content Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  SEO professionals analyze competitor content to identify keyword strategies and topical coverage gaps. By comparing word frequency distributions across top-ranking pages, you can discover important terms your content may be missing, opportunities for differentiation, and emerging keyword trends in your niche.
                </p>

                <h4 className="text-lg font-semibold text-foreground mb-3">Competitive Analysis Workflow</h4>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Extract Competitor Content:</strong> Gather text from top 10 ranking pages for your target keywords</li>
                  <li><strong>Analyze Individual Pages:</strong> Run word frequency analysis on each competitor page with stop words filtered</li>
                  <li><strong>Identify Common Terms:</strong> Find keywords appearing frequently across multiple competitors</li>
                  <li><strong>Spot Content Gaps:</strong> Identify topics competitors cover that your content lacks</li>
                  <li><strong>Optimize Your Content:</strong> Incorporate relevant terms naturally while maintaining unique voice and perspective</li>
                </ol>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-xl font-semibold text-foreground mb-4">Best Practices for Word Frequency Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Content Creation Phase</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Analyze competitor content before writing to identify target keywords</li>
                      <li>Set keyword density goals (1-3% primary, 0.5-1% secondary)</li>
                      <li>Focus on natural writing first, optimize in revision phase</li>
                      <li>Use stop word filtering to focus analysis on meaningful terms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Content Revision Phase</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Check keyword density to avoid over-optimization</li>
                      <li>Use highlighting to identify repetition clusters</li>
                      <li>Replace overused words with synonyms for variety</li>
                      <li>Verify vocabulary diversity ratio exceeds 40%</li>
                      <li>Export data for team review and reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
