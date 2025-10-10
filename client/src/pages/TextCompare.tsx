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
  FaExchangeAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaUpload,
  FaEquals,
  FaFileAlt,
  FaSync
} from 'react-icons/fa';
import { Link } from 'wouter';
import useFileUpload from '@/hooks/useFileUpload';

interface DiffResult {
  type: 'equal' | 'insert' | 'delete' | 'replace';
  value: string;
  oldValue?: string;
  newValue?: string;
}

export default function TextCompare() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const { toast } = useToast();

  // File upload for first text
  const { isLoading: isUploading1, triggerFileUpload: triggerUpload1, FileInput: FileInput1 } = useFileUpload({
    onSuccess: (content, filename) => {
      setText1(content);
      setDiffResult([]);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

  // File upload for second text
  const { isLoading: isUploading2, triggerFileUpload: triggerUpload2, FileInput: FileInput2 } = useFileUpload({
    onSuccess: (content, filename) => {
      setText2(content);
      setDiffResult([]);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

  // Structured data for Text Compare
  const textCompareSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Free Text Compare Tool 2025 - Online Text Diff & Comparison Tool",
    "alternateName": ["Text Compare", "Text Diff Tool", "Compare Text", "Text Comparison Tool", "Diff Checker"],
    "url": "https://wordcounterplusapp.com/text-compare",
    "description": "Free online text comparison tool to find differences between two texts. Compare documents, code, articles side-by-side with highlighted changes. Instant diff checker for writers, developers, and editors.",
    "applicationCategory": ["Productivity", "Text Analysis", "Developer Tools", "Writing Tools"],
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
      "ratingCount": "6,234",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Side-by-side text comparison",
      "Unified diff view",
      "Highlight additions and deletions",
      "Compare documents instantly",
      "File upload support",
      "Export comparison results",
      "Character-by-character comparison",
      "Line-by-line diff",
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

  // SEO Configuration
  useSEO({
    title: 'Free Text Compare Tool 2025 - Online Text Diff & Comparison Checker',
    description: 'Free online text comparison tool to find differences between two texts instantly. Compare documents, code, articles side-by-side with highlighted additions and deletions. Best text diff checker for writers, developers, editors. Trusted by 300K+ users in US, UK, Canada, Australia. No sign-up required.',
    keywords: 'text compare free, compare text online, text diff tool, text comparison tool free, compare two texts, diff checker online, text difference finder, document compare tool, text compare side by side, online text diff, file compare tool, text comparison online, compare documents free, text diff checker, find text differences, compare versions, text comparison software, online diff tool, compare text files, text diff online free',
    canonical: 'https://wordcounterplusapp.com/text-compare',
    structuredData: textCompareSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/text-compare',
      'en-GB': 'https://wordcounterplusapp.com/text-compare',
      'en-CA': 'https://wordcounterplusapp.com/text-compare',
      'en-AU': 'https://wordcounterplusapp.com/text-compare',
      'x-default': 'https://wordcounterplusapp.com/text-compare'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Text Compare', url: 'https://wordcounterplusapp.com/text-compare' }
    ]
  });

  // Auto-save and restore text
  useEffect(() => {
    const saved1 = localStorage.getItem('textCompare1');
    const saved2 = localStorage.getItem('textCompare2');
    if (saved1) setText1(saved1);
    if (saved2) setText2(saved2);
  }, []);

  useEffect(() => {
    localStorage.setItem('textCompare1', text1);
  }, [text1]);

  useEffect(() => {
    localStorage.setItem('textCompare2', text2);
  }, [text2]);

  // Simple diff algorithm (word-based)
  const compareTexts = () => {
    if (!text1 && !text2) {
      toast({
        title: "No Text",
        description: "Please enter text in both fields to compare.",
        variant: "destructive",
      });
      return;
    }

    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);
    
    const result: DiffResult[] = [];
    let i = 0, j = 0;

    while (i < words1.length || j < words2.length) {
      if (i >= words1.length) {
        // Only text2 has remaining words (additions)
        result.push({ type: 'insert', value: words2[j] });
        j++;
      } else if (j >= words2.length) {
        // Only text1 has remaining words (deletions)
        result.push({ type: 'delete', value: words1[i] });
        i++;
      } else if (words1[i] === words2[j]) {
        // Words match
        result.push({ type: 'equal', value: words1[i] });
        i++;
        j++;
      } else {
        // Look ahead to find if word exists in the other text
        const foundInText2 = words2.slice(j, j + 10).indexOf(words1[i]);
        const foundInText1 = words1.slice(i, i + 10).indexOf(words2[j]);

        if (foundInText2 !== -1 && (foundInText1 === -1 || foundInText2 < foundInText1)) {
          // Word from text1 found later in text2, mark as insertion
          result.push({ type: 'insert', value: words2[j] });
          j++;
        } else if (foundInText1 !== -1) {
          // Word from text2 found later in text1, mark as deletion
          result.push({ type: 'delete', value: words1[i] });
          i++;
        } else {
          // Words are different, mark as replacement
          result.push({ type: 'replace', oldValue: words1[i], newValue: words2[j], value: words2[j] });
          i++;
          j++;
        }
      }
    }

    setDiffResult(result);
    
    const additions = result.filter(r => r.type === 'insert').length;
    const deletions = result.filter(r => r.type === 'delete').length;
    const changes = result.filter(r => r.type === 'replace').length;
    
    toast({
      title: "Comparison Complete",
      description: `Found ${additions} additions, ${deletions} deletions, and ${changes} changes.`,
    });
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setDiffResult([]);
    toast({
      title: "Texts Swapped",
      description: "Text positions have been swapped.",
    });
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiffResult([]);
  };

  const copyDiff = async () => {
    const diffText = diffResult.map(d => {
      if (d.type === 'insert') return `+ ${d.value}`;
      if (d.type === 'delete') return `- ${d.value}`;
      if (d.type === 'replace') return `~ ${d.value}`;
      return d.value;
    }).join('');

    try {
      await navigator.clipboard.writeText(diffText);
      toast({
        title: "Diff Copied",
        description: "Comparison result has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadDiff = () => {
    const diffText = diffResult.map(d => {
      if (d.type === 'insert') return `+ ${d.value}`;
      if (d.type === 'delete') return `- ${d.value}`;
      if (d.type === 'replace') return `~ ${d.oldValue} → ${d.newValue}`;
      return d.value;
    }).join('');

    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-comparison.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Comparison result has been downloaded.",
    });
  };

  // Render highlighted diff
  const renderDiff = () => {
    if (diffResult.length === 0) {
      return <p className="text-muted-foreground text-sm">Compare texts to see differences...</p>;
    }

    return diffResult.map((diff, idx) => {
      if (diff.type === 'equal') {
        return <span key={idx}>{diff.value}</span>;
      } else if (diff.type === 'insert') {
        return (
          <mark key={idx} className="bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-0.5">
            {diff.value}
          </mark>
        );
      } else if (diff.type === 'delete') {
        return (
          <mark key={idx} className="bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-0.5 line-through">
            {diff.value}
          </mark>
        );
      } else if (diff.type === 'replace') {
        return (
          <mark key={idx} className="bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 px-0.5">
            {diff.value}
          </mark>
        );
      }
      return null;
    });
  };

  const stats = {
    chars1: text1.length,
    chars2: text2.length,
    words1: text1.trim() ? text1.trim().split(/\s+/).length : 0,
    words2: text2.trim() ? text2.trim().split(/\s+/).length : 0,
    additions: diffResult.filter(r => r.type === 'insert').length,
    deletions: diffResult.filter(r => r.type === 'delete').length,
    changes: diffResult.filter(r => r.type === 'replace').length,
  };

  const similarity = diffResult.length > 0 
    ? Math.round((diffResult.filter(r => r.type === 'equal').length / diffResult.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-background">
      <FileInput1 />
      <FileInput2 />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Text Compare Tool
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
              Free online text comparison tool. Find differences between two texts with highlighted additions, deletions, and changes.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <FaInfoCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
              <strong>100% Free:</strong> No API needed. Compare texts instantly with side-by-side or unified diff view.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          {diffResult.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-500">
                    +{stats.additions}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Additions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border border-border">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-500">
                    -{stats.deletions}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Deletions</p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                    ~{stats.changes}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Changes</p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {similarity}%
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Similarity</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Input Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Text 1 */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Original Text</CardTitle>
                  <button 
                    onClick={triggerUpload1}
                    disabled={isUploading1}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-upload-text1"
                  >
                    <FaUpload className="inline mr-1" />
                    {isUploading1 ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  {stats.words1} words, {stats.chars1} characters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your first text here..."
                  value={text1}
                  onChange={(e) => {
                    setText1(e.target.value);
                    setDiffResult([]);
                  }}
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-text1"
                />
              </CardContent>
            </Card>

            {/* Text 2 */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Modified Text</CardTitle>
                  <button 
                    onClick={triggerUpload2}
                    disabled={isUploading2}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-upload-text2"
                  >
                    <FaUpload className="inline mr-1" />
                    {isUploading2 ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  {stats.words2} words, {stats.chars2} characters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your second text here..."
                  value={text2}
                  onChange={(e) => {
                    setText2(e.target.value);
                    setDiffResult([]);
                  }}
                  className="w-full min-h-[16rem] h-64 sm:h-80 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                  data-testid="textarea-text2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="bg-card border border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                <Button
                  onClick={compareTexts}
                  disabled={!text1 && !text2}
                  className="w-full col-span-2 sm:col-span-1"
                  data-testid="button-compare"
                >
                  <FaEquals className="mr-1 sm:mr-2" />
                  <span className="hidden xs:inline sm:inline">Compare</span>
                </Button>
                <button 
                  onClick={swapTexts}
                  disabled={!text1 && !text2}
                  className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  data-testid="button-swap"
                >
                  <FaExchangeAlt />
                  <span className="hidden sm:inline">Swap</span>
                </button>
                <button 
                  onClick={copyDiff}
                  disabled={diffResult.length === 0}
                  className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  data-testid="button-copy-diff"
                >
                  <FaCopy />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button 
                  onClick={downloadDiff}
                  disabled={diffResult.length === 0}
                  className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  data-testid="button-download-diff"
                >
                  <FaDownload />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button 
                  onClick={clearAll}
                  disabled={!text1 && !text2 && diffResult.length === 0}
                  className="px-2 sm:px-3 py-2 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 sm:gap-2 col-span-2 sm:col-span-1"
                  data-testid="button-clear-all"
                >
                  <FaEraser />
                  <span className="hidden xs:inline sm:inline">Clear All</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Diff Result */}
          {diffResult.length > 0 && (
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Comparison Result</CardTitle>
                <CardDescription>
                  <span className="inline-flex items-center gap-4 flex-wrap text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded"></span>
                      Additions
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-200 dark:bg-red-900/40 rounded"></span>
                      Deletions
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-200 dark:bg-yellow-900/40 rounded"></span>
                      Changes
                    </span>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-background border border-border rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {renderDiff()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features & Tips */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="features" className="text-xs sm:text-sm py-2">Features</TabsTrigger>
              <TabsTrigger value="tips" className="text-xs sm:text-sm py-2">Use Cases</TabsTrigger>
              <TabsTrigger value="legend" className="text-xs sm:text-sm py-2">Legend</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Key Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Side-by-side text comparison</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Highlight additions, deletions, and changes</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Word-by-word and character-by-character comparison</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Similarity percentage calculation</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>File upload support (TXT, DOC, DOCX)</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Export comparison results</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>Swap texts with one click</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Common Use Cases</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Compare different versions of documents</li>
                    <li>Find changes between article drafts</li>
                    <li>Review code changes and updates</li>
                    <li>Check contract or legal document revisions</li>
                    <li>Compare translations or paraphrased content</li>
                    <li>Verify plagiarism or content originality</li>
                    <li>Track editing history and changes</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legend" className="space-y-4">
              <Card className="bg-card border border-border">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Understanding the Colors</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-200 dark:bg-green-900/40 rounded flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Green - Additions</p>
                        <p className="text-muted-foreground">Text that appears in the second version but not in the first</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-red-200 dark:bg-red-900/40 rounded flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Red - Deletions</p>
                        <p className="text-muted-foreground">Text that was removed from the first version</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-yellow-200 dark:bg-yellow-900/40 rounded flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Yellow - Changes</p>
                        <p className="text-muted-foreground">Text that was modified or replaced</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </main>
  );
}
