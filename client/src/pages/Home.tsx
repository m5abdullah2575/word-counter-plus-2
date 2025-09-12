import useSEO from '@/hooks/useSEO';
import { lazy, Suspense } from 'react';
const WordCounterTool = lazy(() => import('@/components/word-counter/WordCounterTool'));
import { Link } from 'wouter';
import { FaArrowRight, FaBolt, FaChartLine, FaCheckCircle, FaDownload, FaGraduationCap, FaPenFancy } from 'react-icons/fa';
import { getCurrentOrigin, getDomainUrl } from '@/lib/site';
import { getWordCounterSEO } from '@/lib/seo-config';

export default function Home() {
  const currentOrigin = getCurrentOrigin();
  const seoConfig = getWordCounterSEO();
  
  useSEO({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    canonical: seoConfig.canonical,
    ogImage: seoConfig.ogImage,
    ogType: "website",
    structuredData: seoConfig.structuredData,
    breadcrumbs: seoConfig.breadcrumbs
  });

  // SEO configuration with structured data is now handled by the useSEO hook

  return (
    <>
      <main role="main">
        <h1 className="sr-only">Free Word Counter, Character Counter & Text Counter Tool</h1>
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading Word Counter...</p>
            </div>
          </div>
        }>
          <WordCounterTool />
        </Suspense>
      </main>

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Word Counter Plus?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Word Counter Plus is the most comprehensive <strong>word counter and text analysis tool</strong> available online. 
                  Whether you're a writer, blogger, student, or content creator, our advanced features help you create better content.
                </p>
                <p>
                  Our tool provides real-time analysis including <strong>word count</strong>, <strong>character count</strong>, 
                  <strong>readability scores</strong>, and <strong>keyword density analysis</strong> – all completely free.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <FaBolt className="text-primary text-2xl mb-2" aria-label="Bolt Icon" />
                    <h3 className="font-semibold">Real-time Analysis</h3>
                    <p className="text-sm">Instant results as you type</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <FaDownload className="text-primary text-2xl mb-2" aria-label="Download Icon" />
                    <h3 className="font-semibold">Export Options</h3>
                    <p className="text-sm">PDF, CSV, TXT formats</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features List */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Advanced Word Counter:</strong> Count words, characters, sentences, and paragraphs with precision
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Text Case Converter:</strong> <a href={getDomainUrl('case')} className="text-primary hover:text-primary/80 underline">Convert text between 12 different case formats</a> including camelCase, snake_case, and more
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Readability Analysis:</strong> Flesch-Kincaid readability scores and reading level assessment
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Keyword Density:</strong> Analyze keyword frequency for SEO optimization
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Export & Share:</strong> Download analysis as PDF, CSV, or TXT files
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Reading Time:</strong> Estimate reading and speaking time for your content
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary mr-3 mt-1" aria-label="Check Circle Icon" />
                  <div>
                    <strong>Goal Tracking:</strong> Set word limits and track your progress
                  </div>
                </li>
              </ul>
              
              <div className="mt-6">
                <Link href="/faq">
                  <span className="inline-flex items-center text-red-700 hover:text-red-600 font-medium">
                    Learn More About Our Features
                    <FaArrowRight className="ml-2" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Perfect For Every Writer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FaPenFancy className="text-primary text-2xl" aria-label="Pen Icon" />
              </div>
              <h3 className="font-semibold mb-2">Content Creators</h3>
              <p className="text-sm text-muted-foreground">
                Optimize blog posts, articles, and social media content with precise word counts and readability analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-primary text-2xl" aria-label="Graduation Cap Icon" />
              </div>
              <h3 className="font-semibold mb-2">Students</h3>
              <p className="text-sm text-muted-foreground">
                Meet essay requirements, track assignment progress, and improve academic writing with detailed analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-card rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FaChartLine className="text-primary text-2xl" aria-label="Line Chart Icon" />
              </div>
              <h3 className="font-semibold mb-2">SEO Specialists</h3>
              <p className="text-sm text-muted-foreground">
                Analyze keyword density, optimize content length, and improve search engine rankings.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Text Tools Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Professional Text Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-border">
              <h3 className="font-semibold mb-3 text-lg">Word Counter & Text Analyzer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive text analysis with word count, character count, readability scores, and keyword density analysis.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• Real-time word and character counting</li>
                <li>• Readability score calculation</li>
                <li>• Keyword density analysis</li>
                <li>• Export to PDF, CSV, TXT</li>
              </ul>
              <Link href="/" className="text-primary hover:text-primary/80 font-medium text-sm">
                Use Word Counter Tool →
              </Link>
            </div>
            
            <div className="bg-white dark:bg-card rounded-lg p-6 shadow-sm border border-border">
              <h3 className="font-semibold mb-3 text-lg">Text Case Converter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Convert text between 12 different case formats including programming cases, basic text cases, and creative formatting.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• camelCase, PascalCase, snake_case</li>
                <li>• UPPERCASE, lowercase, Title Case</li>
                <li>• File upload support (TXT, HTML, RTF)</li>
                <li>• Copy and download converted text</li>
              </ul>
              <a href={getDomainUrl('case')} className="text-primary hover:text-primary/80 font-medium text-sm">
                Use Case Converter Tool →
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              All our <strong>text tools</strong> are completely free and work in your browser. Perfect for writers, developers, students, and content creators.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>✓ No registration required</span>
              <span>✓ Works offline</span>
              <span>✓ Privacy-focused</span>
              <span>✓ Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Structured data is now handled by the useSEO hook */}
    </>
  );
}
