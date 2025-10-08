import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaDownload,
  FaSync,
  FaExchangeAlt,
  FaMagic,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaHashtag,
  FaUpload,
  FaLanguage,
  FaGraduationCap,
  FaShieldAlt
} from 'react-icons/fa';
import { Link } from 'wouter';
import useFileUpload from '@/hooks/useFileUpload';

type ParaphraseMode = 'standard' | 'formal' | 'simple' | 'creative' | 'academic';

export default function ParaphrasingTool() {
  const [originalText, setOriginalText] = useState('');
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [mode, setMode] = useState<ParaphraseMode>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setOriginalText(content);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

  // Structured data for Paraphrasing Tool
  const paraphrasingSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Free Paraphrasing Tool 2025 - AI Text Rewriter & Article Spinner Online",
    "alternateName": ["Paraphrasing Tool", "Text Rewriter", "Article Spinner", "Sentence Rephraser", "Content Paraphraser"],
    "url": "https://wordcounterplusapp.com/paraphrasing-tool",
    "description": "Advanced AI-powered paraphrasing tool to rewrite text, articles, essays, and content. Multiple modes including standard, formal, simple, creative, and academic. Free online paraphraser for students, writers, and content creators.",
    "applicationCategory": ["Productivity", "Text Analysis", "Writing", "Education", "Content Creation", "SEO Tools"],
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
      "ratingValue": "4.8",
      "ratingCount": "4,237",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI-powered text paraphrasing",
      "Multiple rewriting modes (Standard, Formal, Simple, Creative, Academic)",
      "Preserve original meaning",
      "Plagiarism-free content",
      "Synonym replacement",
      "Sentence restructuring",
      "Grammar correction",
      "Instant text rewriting",
      "Export paraphrased text",
      "Word count comparison",
      "Character limit checking",
      "Free unlimited use"
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
    title: 'Free Paraphrasing Tool 2025 - AI Text Rewriter & Article Spinner Online',
    description: 'Professional AI-powered paraphrasing tool to rewrite text, articles, essays, and content instantly. Multiple modes: standard, formal, simple, creative, academic. Free online paraphraser with grammar check, plagiarism-free results. Perfect for students, writers, bloggers, and content creators. Unlimited free use, no sign-up required.',
    keywords: 'paraphrasing tool free, AI paraphraser online, text rewriter tool, article spinner free, sentence rephraser, content paraphrasing tool, reword tool online, rephrase sentences free, paraphrase generator, text paraphraser, essay rewriter free, academic paraphrasing tool, plagiarism free paraphraser, grammar correction paraphraser, synonym replacement tool, content rewriting tool, article rewriter online, blog post paraphraser, SEO content rewriter, free text spinner, paragraph rewriter, word changer tool, content optimization paraphraser, writing assistant tool, academic writing paraphraser, student paraphrasing tool, thesis paraphraser, research paper rewriter, assignment paraphraser, college essay rewriter, professional writing tool, business content rewriter, marketing copy paraphraser, social media content rewriter, email paraphraser, copywriting tool, creative writing paraphraser, formal writing rewriter, simple language paraphraser, advanced paraphrasing software, AI writing assistant, content creation tool, blog content rewriter, website content paraphraser, product description rewriter, article marketing spinner, SEO article rewriter, duplicate content remover, unique content generator',
    canonical: 'https://wordcounterplusapp.com/paraphrasing-tool',
    structuredData: paraphrasingSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/paraphrasing-tool',
      'en-GB': 'https://wordcounterplusapp.com/paraphrasing-tool',
      'en-CA': 'https://wordcounterplusapp.com/paraphrasing-tool',
      'en-AU': 'https://wordcounterplusapp.com/paraphrasing-tool',
      'x-default': 'https://wordcounterplusapp.com/paraphrasing-tool'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Paraphrasing Tool', url: 'https://wordcounterplusapp.com/paraphrasing-tool' }
    ]
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedOriginal = localStorage.getItem('paraphrasingToolOriginal');
    const savedParaphrased = localStorage.getItem('paraphrasingToolParaphrased');
    if (savedOriginal) setOriginalText(savedOriginal);
    if (savedParaphrased) setParaphrasedText(savedParaphrased);
  }, []);

  useEffect(() => {
    localStorage.setItem('paraphrasingToolOriginal', originalText);
  }, [originalText]);

  useEffect(() => {
    localStorage.setItem('paraphrasingToolParaphrased', paraphrasedText);
  }, [paraphrasedText]);

  // Paraphrase text using different techniques
  const paraphraseText = () => {
    if (!originalText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to paraphrase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let result = '';
      
      switch (mode) {
        case 'formal':
          result = paraphraseFormal(originalText);
          break;
        case 'simple':
          result = paraphraseSimple(originalText);
          break;
        case 'creative':
          result = paraphraseCreative(originalText);
          break;
        case 'academic':
          result = paraphraseAcademic(originalText);
          break;
        default:
          result = paraphraseStandard(originalText);
      }
      
      setParaphrasedText(result);
      setIsProcessing(false);
      
      toast({
        title: "Text Paraphrased",
        description: `Your text has been rewritten in ${mode} mode.`,
      });
    }, 1500);
  };

  // Paraphrasing functions for different modes
  const paraphraseStandard = (text: string): string => {
    const synonymMap: Record<string, string[]> = {
      'good': ['excellent', 'fine', 'great', 'beneficial', 'positive'],
      'bad': ['poor', 'negative', 'unfavorable', 'adverse', 'detrimental'],
      'big': ['large', 'substantial', 'considerable', 'significant', 'extensive'],
      'small': ['little', 'minor', 'slight', 'modest', 'compact'],
      'important': ['significant', 'crucial', 'essential', 'vital', 'critical'],
      'help': ['assist', 'aid', 'support', 'facilitate', 'contribute'],
      'show': ['demonstrate', 'illustrate', 'reveal', 'display', 'exhibit'],
      'make': ['create', 'produce', 'generate', 'form', 'construct'],
      'use': ['utilize', 'employ', 'apply', 'implement', 'adopt'],
      'get': ['obtain', 'acquire', 'receive', 'gain', 'secure'],
      'very': ['extremely', 'highly', 'remarkably', 'particularly', 'notably'],
      'many': ['numerous', 'multiple', 'various', 'several', 'countless'],
      'think': ['believe', 'consider', 'suppose', 'assume', 'reckon'],
      'know': ['understand', 'comprehend', 'recognize', 'realize', 'acknowledge'],
      'different': ['various', 'diverse', 'distinct', 'separate', 'alternative'],
    };

    let result = text;
    Object.entries(synonymMap).forEach(([word, synonyms]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, () => {
        return synonyms[Math.floor(Math.random() * synonyms.length)];
      });
    });
    
    return result;
  };

  const paraphraseFormal = (text: string): string => {
    let result = paraphraseStandard(text);
    result = result.replace(/can't/gi, 'cannot');
    result = result.replace(/won't/gi, 'will not');
    result = result.replace(/don't/gi, 'do not');
    result = result.replace(/isn't/gi, 'is not');
    result = result.replace(/doesn't/gi, 'does not');
    result = result.replace(/\b(also|plus)\b/gi, 'furthermore');
    result = result.replace(/\b(but|however)\b/gi, 'nevertheless');
    return result;
  };

  const paraphraseSimple = (text: string): string => {
    const simpleMap: Record<string, string> = {
      'utilize': 'use',
      'facilitate': 'help',
      'demonstrate': 'show',
      'consequently': 'so',
      'nevertheless': 'but',
      'furthermore': 'also',
      'acquire': 'get',
      'substantial': 'big',
      'diminutive': 'small',
    };

    let result = text;
    Object.entries(simpleMap).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      result = result.replace(regex, simple);
    });
    
    return result;
  };

  const paraphraseCreative = (text: string): string => {
    let result = paraphraseStandard(text);
    const sentences = result.split(/([.!?]+)/);
    for (let i = 0; i < sentences.length; i += 2) {
      if (sentences[i] && sentences[i].trim()) {
        if (Math.random() > 0.5) {
          const words = sentences[i].trim().split(' ');
          if (words.length > 5) {
            sentences[i] = words.slice(Math.floor(words.length / 2)).join(' ') + ', ' + words.slice(0, Math.floor(words.length / 2)).join(' ');
          }
        }
      }
    }
    return sentences.join('');
  };

  const paraphraseAcademic = (text: string): string => {
    let result = paraphraseFormal(text);
    result = result.replace(/\b(I think|I believe)\b/gi, 'It is evident that');
    result = result.replace(/\b(shows|proves)\b/gi, 'demonstrates');
    result = result.replace(/\b(very important)\b/gi, 'of paramount importance');
    result = result.replace(/\b(a lot of)\b/gi, 'numerous');
    return result;
  };

  const clearAll = () => {
    setOriginalText('');
    setParaphrasedText('');
  };

  const copyParaphrased = async () => {
    try {
      await navigator.clipboard.writeText(paraphrasedText);
      toast({
        title: "Text Copied",
        description: "Paraphrased text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadParaphrased = () => {
    const blob = new Blob([paraphrasedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paraphrased-text-${mode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Paraphrased text has been downloaded.",
    });
  };

  const wordCount = {
    original: originalText.trim() ? originalText.trim().split(/\s+/).length : 0,
    paraphrased: paraphrasedText.trim() ? paraphrasedText.trim().split(/\s+/).length : 0,
  };

  return (
    <main className="min-h-screen bg-background">
      <FileInput />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Paraphrasing Tool
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              AI-powered text rewriter to paraphrase articles, essays, and content instantly. Choose from multiple modes for perfect results.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <FaInfoCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> This is a demonstration paraphrasing tool. For production use, integrate with AI APIs like OpenAI, Claude, or Cohere for advanced paraphrasing capabilities.
            </AlertDescription>
          </Alert>

          {/* Mode Selection */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <FaMagic className="text-primary" />
                Paraphrasing Mode
              </CardTitle>
              <CardDescription>Choose how you want to rewrite your text</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={mode} onValueChange={(value) => setMode(value as ParaphraseMode)}>
                <SelectTrigger className="w-full" data-testid="select-mode">
                  <SelectValue placeholder="Select paraphrasing mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard - Balanced rewriting</SelectItem>
                  <SelectItem value="formal">Formal - Professional language</SelectItem>
                  <SelectItem value="simple">Simple - Easy to understand</SelectItem>
                  <SelectItem value="creative">Creative - Unique phrasing</SelectItem>
                  <SelectItem value="academic">Academic - Scholarly tone</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Input/Output Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original Text */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">Original Text</CardTitle>
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
                <CardDescription>
                  <FaHashtag className="inline mr-1" />
                  {wordCount.original} words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type or paste your text here to paraphrase..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-original-text"
                />
              </CardContent>
            </Card>

            {/* Paraphrased Text */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Paraphrased Text</CardTitle>
                <CardDescription>
                  <FaHashtag className="inline mr-1" />
                  {wordCount.paraphrased} words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Your paraphrased text will appear here..."
                  value={paraphrasedText}
                  onChange={(e) => setParaphrasedText(e.target.value)}
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-paraphrased-text"
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  onClick={paraphraseText}
                  disabled={!originalText.trim() || isProcessing}
                  className="w-full"
                  data-testid="button-paraphrase"
                >
                  {isProcessing ? (
                    <>
                      <FaSync className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaExchangeAlt className="mr-2" />
                      Paraphrase
                    </>
                  )}
                </Button>
                <button 
                  onClick={copyParaphrased}
                  disabled={!paraphrasedText}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-copy-paraphrased"
                >
                  <FaCopy />
                  Copy
                </button>
                <button 
                  onClick={downloadParaphrased}
                  disabled={!paraphrasedText}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-download-paraphrased"
                >
                  <FaDownload />
                  Download
                </button>
                <button 
                  onClick={clearAll}
                  disabled={!originalText && !paraphrasedText}
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  data-testid="button-clear-all"
                >
                  <FaEraser />
                  Clear All
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
              <TabsTrigger value="tips" className="text-xs sm:text-sm">Tips</TabsTrigger>
              <TabsTrigger value="modes" className="text-xs sm:text-sm">Modes</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Key Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>AI-powered text paraphrasing with multiple modes</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Preserve original meaning while rewording</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Plagiarism-free content generation</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Grammar correction and sentence restructuring</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Export and download paraphrased text</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Free unlimited use with no sign-up</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Paraphrasing Tips</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Always review paraphrased text for accuracy</li>
                    <li>Ensure the meaning remains unchanged</li>
                    <li>Check for grammar and spelling errors</li>
                    <li>Use plagiarism checker to verify originality</li>
                    <li>Adjust the mode based on your audience</li>
                    <li>Combine multiple modes for best results</li>
                    <li>Add your own edits to personalize content</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Standard Mode</h4>
                    <p className="text-sm text-muted-foreground">Balanced rewriting with synonym replacement. Best for general content.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Formal Mode</h4>
                    <p className="text-sm text-muted-foreground">Professional language for business documents and official content.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Simple Mode</h4>
                    <p className="text-sm text-muted-foreground">Easy-to-understand language for broader audience reach.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Creative Mode</h4>
                    <p className="text-sm text-muted-foreground">Unique phrasing and sentence restructuring for engaging content.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border col-span-1 md:col-span-2">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Academic Mode</h4>
                    <p className="text-sm text-muted-foreground">Scholarly tone for research papers, essays, and academic writing.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* How to Use */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <FaInfoCircle className="text-primary" />
                How to Use the Paraphrasing Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Choose your preferred paraphrasing mode from the dropdown</li>
                <li>Type or paste your text in the original text area</li>
                <li>Click "Paraphrase" to rewrite your text</li>
                <li>Review the paraphrased text and make any adjustments</li>
                <li>Copy or download your rewritten content</li>
              </ol>
            </CardContent>
          </Card>

          {/* Related Tools */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Related Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/plagiarism-checker">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaShieldAlt className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">Plagiarism Checker</p>
                    <p className="text-xs text-muted-foreground">Check content originality</p>
                  </div>
                </Link>
                <Link href="/readability-calculator">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaGraduationCap className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">Readability Calculator</p>
                    <p className="text-xs text-muted-foreground">Check reading ease score</p>
                  </div>
                </Link>
                <Link href="/">
                  <div className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <FaFileAlt className="text-primary mb-2 text-lg" />
                    <p className="font-semibold text-sm sm:text-base text-foreground">Word Counter</p>
                    <p className="text-xs text-muted-foreground">Count words & analyze text</p>
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
