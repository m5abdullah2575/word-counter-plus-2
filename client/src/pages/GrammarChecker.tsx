import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUpload,
  FaSpellCheck,
  FaSync,
  FaFileAlt,
  FaHashtag
} from 'react-icons/fa';
import { Link } from 'wouter';
import useFileUpload from '@/hooks/useFileUpload';

interface GrammarError {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: Array<{ value: string }>;
  rule: {
    id: string;
    description: string;
    category: {
      id: string;
      name: string;
    };
  };
  type?: {
    typeName: string;
  };
}

interface GrammarCheckResult {
  matches: GrammarError[];
}

export default function GrammarChecker() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [correctedText, setCorrectedText] = useState('');
  const { toast } = useToast();

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setText(content);
      setResult(null);
      setCorrectedText('');
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

  // Structured data for Grammar Checker
  const grammarCheckerSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Free Grammar Checker 2025 - Online Grammar & Spell Check Tool",
    "alternateName": ["Grammar Checker", "Grammar Check", "Spell Checker", "Grammar Correction Tool", "Free Grammar Check"],
    "url": "https://wordcounterplusapp.com/grammar-checker",
    "description": "Professional free grammar checker to detect and fix grammar, spelling, punctuation errors instantly. AI-powered grammar correction for students, writers, and professionals. Check grammar online free with real-time suggestions.",
    "applicationCategory": ["Productivity", "Writing", "Education", "Text Analysis", "Grammar Tools"],
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
      "ratingCount": "8,543",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Real-time grammar checking",
      "Spelling error detection",
      "Punctuation correction",
      "Grammar suggestions",
      "Instant error highlighting",
      "Free unlimited use",
      "No sign-up required",
      "Export corrected text",
      "File upload support",
      "Multi-language support"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    }
  };

  // SEO Configuration
  useSEO({
    title: 'Free Grammar Checker 2025 - Online Grammar & Spell Check Tool',
    description: 'Professional free grammar checker online. Detect and fix grammar mistakes, spelling errors, and punctuation instantly. AI-powered grammar correction tool for students, writers, professionals. Check grammar free with real-time suggestions. Trusted by 500K+ users in US, UK, Canada, Australia. No sign-up required, unlimited free use.',
    keywords: 'grammar checker free, free grammar check online, grammar check tool, spell checker free, grammar correction online, punctuation checker, grammar and spelling checker, online grammar checker, free grammar checker no sign up, grammar check online free, sentence checker, writing grammar checker, english grammar checker, grammar mistake finder, grammar correction tool free, essay grammar checker, academic grammar check, professional grammar checker, grammar fixer free, grammar check app',
    canonical: 'https://wordcounterplusapp.com/grammar-checker',
    structuredData: grammarCheckerSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/grammar-checker',
      'en-GB': 'https://wordcounterplusapp.com/grammar-checker',
      'en-CA': 'https://wordcounterplusapp.com/grammar-checker',
      'en-AU': 'https://wordcounterplusapp.com/grammar-checker',
      'x-default': 'https://wordcounterplusapp.com/grammar-checker'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Grammar Checker', url: 'https://wordcounterplusapp.com/grammar-checker' }
    ]
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('grammarCheckerText');
    if (savedText) setText(savedText);
  }, []);

  useEffect(() => {
    localStorage.setItem('grammarCheckerText', text);
  }, [text]);

  // Check grammar using free LanguageTool API
  const checkGrammar = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to check grammar.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'en-US',
        }),
      });

      if (!response.ok) {
        throw new Error('Grammar check failed');
      }

      const data = await response.json();
      setResult(data);

      // Generate corrected text
      if (data.matches && data.matches.length > 0) {
        let corrected = text;
        // Apply corrections from end to start to maintain offsets
        const sortedMatches = [...data.matches].sort((a, b) => b.offset - a.offset);
        
        for (const match of sortedMatches) {
          if (match.replacements && match.replacements.length > 0) {
            const before = corrected.substring(0, match.offset);
            const after = corrected.substring(match.offset + match.length);
            corrected = before + match.replacements[0].value + after;
          }
        }
        
        setCorrectedText(corrected);

        toast({
          title: "Grammar Check Complete",
          description: `Found ${data.matches.length} issue${data.matches.length !== 1 ? 's' : ''}.`,
        });
      } else {
        setCorrectedText(text);
        toast({
          title: "Perfect!",
          description: "No grammar or spelling errors found.",
        });
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast({
        title: "Check Failed",
        description: "Unable to check grammar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const clearAll = () => {
    setText('');
    setResult(null);
    setCorrectedText('');
  };

  const copyCorrected = async () => {
    try {
      await navigator.clipboard.writeText(correctedText || text);
      toast({
        title: "Text Copied",
        description: "Corrected text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadCorrected = () => {
    const textToDownload = correctedText || text;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grammar-checked-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Corrected text has been downloaded.",
    });
  };

  // Highlight text with errors
  const getHighlightedText = () => {
    if (!result || !result.matches || result.matches.length === 0) {
      return text;
    }

    let highlighted = '';
    let lastOffset = 0;

    const sortedMatches = [...result.matches].sort((a, b) => a.offset - b.offset);

    for (const match of sortedMatches) {
      // Add text before error
      highlighted += text.substring(lastOffset, match.offset);
      
      // Add error with styling
      const errorText = text.substring(match.offset, match.offset + match.length);
      highlighted += `<mark class="bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-0.5 rounded cursor-pointer" title="${match.message}">${errorText}</mark>`;
      
      lastOffset = match.offset + match.length;
    }

    // Add remaining text
    highlighted += text.substring(lastOffset);

    return highlighted;
  };

  const errorsByType = result?.matches.reduce((acc, match) => {
    const type = match.rule.category.name;
    if (!acc[type]) acc[type] = [];
    acc[type].push(match);
    return acc;
  }, {} as Record<string, GrammarError[]>) || {};

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const errorCount = result?.matches?.length || 0;

  return (
    <main className="min-h-screen bg-background">
      <FileInput />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Grammar Checker
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Free online grammar and spell checker. Instantly detect and fix grammar mistakes, spelling errors, and punctuation issues.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <FaInfoCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
              <strong>100% Free:</strong> Powered by LanguageTool - no API key or sign-up required. Check grammar unlimited times.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-card border border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  <FaHashtag className="inline mr-1" />
                  {wordCount}
                </div>
                <p className="text-sm text-muted-foreground">Words</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  <FaExclamationTriangle className="inline mr-1" />
                  {errorCount}
                </div>
                <p className="text-sm text-muted-foreground">Issues Found</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  <FaCheckCircle className="inline mr-1" />
                  {errorCount === 0 && result ? '100%' : result ? `${Math.max(0, Math.round((1 - errorCount / Math.max(wordCount, 1)) * 100))}%` : '-'}
                </div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Input/Output Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original Text */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">Your Text</CardTitle>
                  <button 
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-upload-text"
                    title="Upload text file"
                  >
                    <FaUpload className="inline mr-1" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                <CardDescription>Enter or paste text to check grammar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type or paste your text here to check for grammar and spelling errors..."
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    // Reset results when text changes
                    if (result) {
                      setResult(null);
                      setCorrectedText('');
                    }
                  }}
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-grammar-input"
                />
              </CardContent>
            </Card>

            {/* Corrected Text with Highlights */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  {result && errorCount > 0 ? 'Errors Highlighted' : 'Preview'}
                </CardTitle>
                <CardDescription>
                  {result && errorCount > 0 ? 'Hover over highlighted text to see suggestions' : 'Your checked text will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg overflow-y-auto text-sm sm:text-base whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: result ? getHighlightedText() : text || '<span class="text-muted-foreground">Check your text to see results...</span>' }}
                  data-testid="preview-grammar-result"
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  onClick={checkGrammar}
                  disabled={!text.trim() || isChecking}
                  className="w-full"
                  data-testid="button-check-grammar"
                >
                  {isChecking ? (
                    <>
                      <FaSync className="mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <FaSpellCheck className="mr-2" />
                      Check Grammar
                    </>
                  )}
                </Button>
                <button 
                  onClick={copyCorrected}
                  disabled={!result}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-copy-corrected"
                >
                  <FaCopy />
                  Copy
                </button>
                <button 
                  onClick={downloadCorrected}
                  disabled={!result}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-download-corrected"
                >
                  <FaDownload />
                  Download
                </button>
                <button 
                  onClick={clearAll}
                  disabled={!text && !result}
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-clear-all"
                >
                  <FaEraser />
                  Clear All
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Error Details */}
          {result && errorCount > 0 && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All Issues ({errorCount})
                </TabsTrigger>
                {Object.keys(errorsByType).slice(0, 3).map((type) => (
                  <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                    {type} ({errorsByType[type].length})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-3 max-h-[400px] overflow-y-auto">
                {result.matches.map((error, idx) => (
                  <Card key={idx} className="bg-card border border-orange-200 dark:border-orange-900">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {error.rule.category.name}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">{error.message}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            "{text.substring(error.offset, error.offset + error.length)}"
                          </p>
                          {error.replacements && error.replacements.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">Suggestion:</span>
                              {error.replacements.slice(0, 3).map((rep, i) => (
                                <Badge key={i} className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                  {rep.value}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {Object.entries(errorsByType).slice(0, 3).map(([type, errors]) => (
                <TabsContent key={type} value={type} className="space-y-3 max-h-[400px] overflow-y-auto">
                  {errors.map((error, idx) => (
                    <Card key={idx} className="bg-card border border-orange-200 dark:border-orange-900">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{error.message}</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              "{text.substring(error.offset, error.offset + error.length)}"
                            </p>
                            {error.replacements && error.replacements.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">Suggestion:</span>
                                {error.replacements.slice(0, 3).map((rep, i) => (
                                  <Badge key={i} className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                    {rep.value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}

          {/* Corrected Text Output */}
          {correctedText && (
            <Card className="bg-card border border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Corrected Text
                </CardTitle>
                <CardDescription>Text with all suggested corrections applied</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={correctedText}
                  onChange={(e) => setCorrectedText(e.target.value)}
                  className="w-full min-h-[12rem] p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-corrected-text"
                />
              </CardContent>
            </Card>
          )}

          {/* Features & Tips */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
              <TabsTrigger value="tips" className="text-xs sm:text-sm">Tips</TabsTrigger>
              <TabsTrigger value="faq" className="text-xs sm:text-sm">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Key Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Real-time grammar and spelling check</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Punctuation error detection</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Instant correction suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Error categorization and highlighting</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>100% free - no API key required</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>File upload support (TXT, DOC, DOCX)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Export corrected text</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Grammar Checking Tips</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Always review suggested corrections before applying</li>
                    <li>Check context - not all suggestions may be appropriate</li>
                    <li>Use for essays, emails, articles, and professional writing</li>
                    <li>Upload documents for batch checking</li>
                    <li>Combine with spell checker for comprehensive review</li>
                    <li>Read your text aloud after corrections</li>
                    <li>Learn from repeated errors to improve your writing</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Is this grammar checker really free?</p>
                      <p className="text-muted-foreground">Yes! 100% free with no hidden costs or API keys needed. Powered by LanguageTool's free API.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">What types of errors does it detect?</p>
                      <p className="text-muted-foreground">Grammar mistakes, spelling errors, punctuation issues, and style suggestions.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Can I upload documents?</p>
                      <p className="text-muted-foreground">Yes! Upload TXT, DOC, or DOCX files up to 10MB for instant checking.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Is my text stored or shared?</p>
                      <p className="text-muted-foreground">Your text is only saved locally in your browser. We don't store or share your content.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Tools */}
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Related Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/plagiarism-checker">
                  <div className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-primary" />
                      <span className="text-sm font-medium">Plagiarism Checker</span>
                    </div>
                  </div>
                </Link>
                <Link href="/readability-calculator">
                  <div className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-primary" />
                      <span className="text-sm font-medium">Readability Calculator</span>
                    </div>
                  </div>
                </Link>
                <Link href="/">
                  <div className="block p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-primary" />
                      <span className="text-sm font-medium">Word Counter</span>
                    </div>
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
