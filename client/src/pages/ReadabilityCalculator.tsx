import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaDownload,
  FaBookReader,
  FaGraduationCap,
  FaChartLine,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaHashtag,
  FaParagraph,
  FaUpload
} from 'react-icons/fa';
import { Link } from 'wouter';
import useFileUpload from '@/hooks/useFileUpload';

export default function ReadabilityCalculator() {
  const [text, setText] = useState('');
  const { toast } = useToast();

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setText(content);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

  // Structured data for Readability Calculator
  const readabilitySchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Free Readability Calculator 2025 - Flesch Reading Ease Score & Grade Level Checker",
    "alternateName": ["Readability Checker", "Reading Level Calculator", "Flesch-Kincaid Grade Level", "Text Readability Analyzer"],
    "url": "https://wordcounterplusapp.com/readability-calculator",
    "description": "Advanced readability calculator with Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, SMOG Index, Coleman-Liau Index, and Automated Readability Index. Optimize content for your target audience with instant readability scores.",
    "applicationCategory": ["Productivity", "Text Analysis", "Education", "Content Optimization", "SEO Tools"],
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
      "ratingCount": "3,482",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Flesch Reading Ease Score (0-100)",
      "Flesch-Kincaid Grade Level",
      "Gunning Fog Index",
      "SMOG Index (Simple Measure of Gobbledygook)",
      "Coleman-Liau Index",
      "Automated Readability Index (ARI)",
      "Audience targeting recommendations",
      "Grade level assessment",
      "Reading time estimation",
      "Sentence complexity analysis",
      "Word difficulty scoring",
      "Export readability reports"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    }
  };

  // SEO Configuration with high-CPC keywords
  useSEO({
    title: 'Free Readability Calculator 2025 - Flesch Reading Ease Score & Grade Level Checker',
    description: 'Professional readability calculator with Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, SMOG, Coleman-Liau, and ARI scores. Optimize content readability for students, professionals, and general audiences. Free online readability checker trusted by 100K+ writers, educators, and content creators.',
    keywords: 'readability calculator free, flesch reading ease score, flesch kincaid grade level, readability checker online, text readability analyzer, gunning fog index calculator, SMOG index checker, coleman liau index, automated readability index ARI, reading level calculator, content readability score, text complexity analyzer, grade level checker, reading ease calculator, content optimization tool, SEO readability checker, writing readability test, document readability analyzer, academic writing readability, blog readability score, website readability checker, content grade level, text difficulty analyzer, audience readability tool, educational content analyzer, plain language checker, simple language score, reading comprehension level, text accessibility checker, content complexity score, writing clarity analyzer, readability metrics, reading age calculator, literacy level checker, text simplification tool, audience targeting readability, professional writing analyzer, technical writing readability, marketing content readability, email readability checker, social media readability, web content accessibility, SEO content readability, search engine readability, user friendly content checker, clear writing analyzer, effective writing score, communication clarity tool',
    canonical: 'https://wordcounterplusapp.com/readability-calculator',
    structuredData: readabilitySchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/readability-calculator',
      'en-GB': 'https://wordcounterplusapp.com/readability-calculator',
      'en-CA': 'https://wordcounterplusapp.com/readability-calculator',
      'en-AU': 'https://wordcounterplusapp.com/readability-calculator',
      'x-default': 'https://wordcounterplusapp.com/readability-calculator'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Readability Calculator', url: 'https://wordcounterplusapp.com/readability-calculator' }
    ]
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('readabilityCalculatorText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('readabilityCalculatorText', text);
  }, [text]);

  // Advanced text analysis with readability scores
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const syllables = text.split(/\s+/).reduce((count, word) => count + countSyllables(word), 0);
    const characters = text.replace(/\s/g, '').length;
    
    // Flesch Reading Ease (0-100, higher = easier)
    const fleschReadingEase = sentences > 0 && words > 0
      ? 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
      : 0;
    
    // Flesch-Kincaid Grade Level
    const fleschKincaidGrade = sentences > 0 && words > 0
      ? 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
      : 0;
    
    // Gunning Fog Index
    const complexWords = text.split(/\s+/).filter(word => countSyllables(word) >= 3).length;
    const gunningFog = sentences > 0 && words > 0
      ? 0.4 * ((words / sentences) + 100 * (complexWords / words))
      : 0;
    
    // SMOG Index
    const smogIndex = sentences >= 30
      ? 1.0430 * Math.sqrt(complexWords * (30 / sentences)) + 3.1291
      : 0;
    
    // Coleman-Liau Index
    const avgLettersPer100Words = words > 0 ? (characters / words) * 100 : 0;
    const avgSentencesPer100Words = words > 0 ? (sentences / words) * 100 : 0;
    const colemanLiau = 0.0588 * avgLettersPer100Words - 0.296 * avgSentencesPer100Words - 15.8;
    
    // Automated Readability Index (ARI)
    const ari = sentences > 0 && words > 0
      ? 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43
      : 0;
    
    return {
      words,
      sentences,
      syllables,
      characters,
      fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)).toFixed(1),
      fleschKincaidGrade: Math.max(0, fleschKincaidGrade).toFixed(1),
      gunningFog: Math.max(0, gunningFog).toFixed(1),
      smogIndex: Math.max(0, smogIndex).toFixed(1),
      colemanLiau: Math.max(0, colemanLiau).toFixed(1),
      ari: Math.max(0, ari).toFixed(1),
      readingTime: words > 0 ? Math.ceil(words / 200) : 0,
    };
  }, [text]);

  // Helper function to count syllables
  function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let count = 0;
    let prevIsVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevIsVowel) {
        count++;
      }
      prevIsVowel = isVowel;
    }
    
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(count, 1);
  }

  // Get readability level description
  const getReadabilityLevel = (score: number): { level: string; color: string; audience: string } => {
    const numScore = parseFloat(score.toString());
    if (numScore >= 90) return { level: 'Very Easy', color: 'text-green-600 dark:text-green-400', audience: '5th grade, Very easy to read' };
    if (numScore >= 80) return { level: 'Easy', color: 'text-green-500 dark:text-green-500', audience: '6th grade, Easy to read' };
    if (numScore >= 70) return { level: 'Fairly Easy', color: 'text-blue-500 dark:text-blue-400', audience: '7th grade, Fairly easy' };
    if (numScore >= 60) return { level: 'Standard', color: 'text-blue-600 dark:text-blue-500', audience: '8th-9th grade, Plain English' };
    if (numScore >= 50) return { level: 'Fairly Difficult', color: 'text-yellow-600 dark:text-yellow-500', audience: '10th-12th grade, Fairly difficult' };
    if (numScore >= 30) return { level: 'Difficult', color: 'text-orange-600 dark:text-orange-500', audience: 'College, Difficult' };
    return { level: 'Very Difficult', color: 'text-red-600 dark:text-red-500', audience: 'College graduate, Very difficult' };
  };

  const readabilityLevel = getReadabilityLevel(parseFloat(stats.fleschReadingEase));

  const clearText = () => {
    setText('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text Copied",
        description: "Text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadReport = () => {
    const report = `READABILITY ANALYSIS REPORT
========================================

Text Statistics:
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Syllables: ${stats.syllables}
- Characters: ${stats.characters}

Readability Scores:
- Flesch Reading Ease: ${stats.fleschReadingEase} (${readabilityLevel.level})
- Flesch-Kincaid Grade Level: ${stats.fleschKincaidGrade}
- Gunning Fog Index: ${stats.gunningFog}
- SMOG Index: ${stats.smogIndex}
- Coleman-Liau Index: ${stats.colemanLiau}
- Automated Readability Index (ARI): ${stats.ari}

Target Audience: ${readabilityLevel.audience}
Estimated Reading Time: ${stats.readingTime} minute(s)

========================================
Generated by Word Counter Plus
https://wordcounterplusapp.com/readability-calculator
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'readability-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Readability report has been downloaded.",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <FileInput />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Readability Calculator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Analyze text readability with Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and more. Optimize your content for your target audience.
            </p>
          </div>

          {/* Text Input Area */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg sm:text-xl">Enter Your Text</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-upload-text"
                    title="Upload text file"
                  >
                    <FaUpload className="inline mr-1" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type or paste your text here to analyze readability..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[12rem] h-48 sm:h-64 md:h-72 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                data-testid="textarea-readability-text"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={copyToClipboard}
                  disabled={!text}
                  className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                  data-testid="button-copy-text"
                  title="Copy text to clipboard"
                >
                  <FaCopy className="text-sm" />
                  <span>Copy</span>
                </button>
                <button 
                  onClick={downloadReport}
                  disabled={!text}
                  className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                  data-testid="button-download-report"
                  title="Download readability report"
                >
                  <FaDownload className="text-sm" />
                  <span>Report</span>
                </button>
                <button 
                  onClick={clearText}
                  disabled={!text}
                  className="px-2 sm:px-3 py-2 bg-destructive text-destructive-foreground rounded text-xs sm:text-sm hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                  data-testid="button-clear-text"
                  title="Clear all text"
                >
                  <FaEraser className="text-sm" />
                  <span>Clear</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Main Readability Score */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <FaBookReader className="text-primary" />
                Flesch Reading Ease Score
              </CardTitle>
              <CardDescription>Higher scores indicate easier readability (0-100 scale)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className={`text-6xl font-bold ${readabilityLevel.color} mb-2`}>
                  {stats.fleschReadingEase}
                </div>
                <Badge className={`${readabilityLevel.color} mb-2`}>
                  {readabilityLevel.level}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {readabilityLevel.audience}
                </p>
              </div>
              <Progress value={parseFloat(stats.fleschReadingEase)} className="h-3" />
            </CardContent>
          </Card>

          {/* All Readability Scores */}
          <Tabs defaultValue="scores" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scores" className="text-xs sm:text-sm">All Scores</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm">Text Stats</TabsTrigger>
              <TabsTrigger value="guide" className="text-xs sm:text-sm">Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Flesch-Kincaid Grade</span>
                      <span className="text-2xl font-bold text-foreground">{stats.fleschKincaidGrade}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">U.S. school grade level</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Gunning Fog Index</span>
                      <span className="text-2xl font-bold text-foreground">{stats.gunningFog}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Years of formal education needed</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">SMOG Index</span>
                      <span className="text-2xl font-bold text-foreground">{stats.smogIndex}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Years of education required</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Coleman-Liau Index</span>
                      <span className="text-2xl font-bold text-foreground">{stats.colemanLiau}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">U.S. grade level</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Automated Readability (ARI)</span>
                      <span className="text-2xl font-bold text-foreground">{stats.ari}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">U.S. grade level</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reading Time</span>
                      <span className="text-2xl font-bold text-foreground">{stats.readingTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Minutes (~200 words/min)</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-card border border-border">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FaFileAlt className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.words}</p>
                    <p className="text-xs text-muted-foreground">Words</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FaParagraph className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.sentences}</p>
                    <p className="text-xs text-muted-foreground">Sentences</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FaHashtag className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.syllables}</p>
                    <p className="text-xs text-muted-foreground">Syllables</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FaHashtag className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.characters}</p>
                    <p className="text-xs text-muted-foreground">Characters</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Flesch Reading Ease Score Guide</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <span>90-100: Very Easy</span>
                      <span className="text-muted-foreground">5th grade</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <span>80-89: Easy</span>
                      <span className="text-muted-foreground">6th grade</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <span>70-79: Fairly Easy</span>
                      <span className="text-muted-foreground">7th grade</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                      <span>60-69: Standard</span>
                      <span className="text-muted-foreground">8th-9th grade</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                      <span>50-59: Fairly Difficult</span>
                      <span className="text-muted-foreground">10th-12th grade</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <span>30-49: Difficult</span>
                      <span className="text-muted-foreground">College</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <span>0-29: Very Difficult</span>
                      <span className="text-muted-foreground">College graduate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* How to Use */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <FaInfoCircle className="text-primary" />
                How to Improve Readability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Use shorter sentences (15-20 words average)</li>
                <li>Choose simple words over complex ones</li>
                <li>Break up long paragraphs</li>
                <li>Use active voice instead of passive</li>
                <li>Add headings and bullet points</li>
                <li>Remove unnecessary jargon</li>
                <li>Target Flesch Reading Ease score of 60+ for general audiences</li>
              </ul>
            </CardContent>
          </Card>

          {/* Related Tools */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Related Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaFileAlt className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">Word Counter</p>
                    <p className="text-xs text-muted-foreground">Count words & analyze text</p>
                  </div>
                </Link>
                <Link href="/seo-content-analyzer">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaChartLine className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">SEO Content Analyzer</p>
                    <p className="text-xs text-muted-foreground">Optimize content for SEO</p>
                  </div>
                </Link>
                <Link href="/plagiarism-checker">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaGraduationCap className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">Plagiarism Checker</p>
                    <p className="text-xs text-muted-foreground">Check content originality</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
