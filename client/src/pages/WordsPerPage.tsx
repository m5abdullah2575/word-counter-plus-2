import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaExchangeAlt,
  FaFileAlt,
  FaClock,
  FaMicrophone,
  FaBook,
  FaCog,
  FaInfoCircle,
  FaChartBar
} from 'react-icons/fa';

// Font multipliers (base: Times New Roman = 1.0)
const FONT_MULTIPLIERS: Record<string, number> = {
  'Arial': 1.05,
  'Times New Roman': 1.0,
  'Calibri': 1.08,
  'Verdana': 1.2,
  'Courier New': 1.15,
  'Georgia': 1.02,
  'Helvetica': 1.05,
  'Comic Sans MS': 1.1
};

// Font size multipliers (base: 12pt = 1.0)
const FONT_SIZE_MULTIPLIERS: Record<number, number> = {
  9: 0.75,
  10: 0.83,
  11: 0.92,
  12: 1.0,
  13: 1.08,
  14: 1.17,
  16: 1.33
};

// Spacing multipliers for words per page
const SPACING_MULTIPLIERS: Record<string, number> = {
  'single': 1.8,
  '1.5': 1.2,
  'double': 1.0
};

// Base words per page (12pt Times New Roman, double-spaced, 1" margins)
const BASE_WORDS_PER_PAGE = 275;

export default function WordsPerPage() {
  const [mode, setMode] = useState<'words-to-pages' | 'pages-to-words'>('words-to-pages');
  const [wordCount, setWordCount] = useState<number>(1000);
  const [pageCount, setPageCount] = useState<number>(4);
  const [font, setFont] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [spacing, setSpacing] = useState<'single' | '1.5' | 'double'>('double');
  const [pasteText, setPasteText] = useState('');
  const { toast } = useToast();

  // Structured data for SEO
  const wordsPerPageSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Words Per Page Calculator - Essay & Document Length Estimator",
    "alternateName": ["Words to Pages Calculator", "Page Count Calculator", "Words Per Page Converter"],
    "url": "https://wordcounterplusapp.com/words-per-page",
    "description": "Professional words per page calculator with bidirectional conversion, real-time text analysis, reading time estimates, and customizable formatting options. Convert words to pages or pages to words instantly.",
    "applicationCategory": ["Productivity", "Writing", "Education", "Calculator"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization", 
      "name": "Word Counter Plus"
    },
    "featureList": [
      "Words to pages conversion",
      "Pages to words conversion",
      "Real-time text analysis",
      "Multiple font support",
      "Font size customization",
      "Line spacing options",
      "Reading time estimates",
      "Speaking time estimates",
      "Quick reference tables",
      "Comparison tool"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  useSEO({
    title: 'Words Per Page Calculator 2025 - Convert Words to Pages & Pages to Words | Word Counter Plus',
    description: 'Free words per page calculator with bidirectional conversion. Instantly convert words to pages or pages to words with customizable font, size, spacing, and margins. Includes reading time, speaking time estimates, and quick reference tables. Perfect for students, writers, and content creators.',
    keywords: 'words per page calculator, words to pages, pages to words, page count calculator, essay length calculator, word count to pages, how many pages is 1000 words, how many words is 5 pages, academic paper length, document page estimate, words per page converter, essay page calculator, manuscript page count, book page estimate, article length calculator, words to pages double spaced, words to pages single spaced, font size page calculator, spacing page calculator',
    canonical: 'https://wordcounterplusapp.com/words-per-page',
    structuredData: wordsPerPageSchema
  });

  // Calculate words per page based on settings
  const wordsPerPageCalculation = useMemo(() => {
    const fontMultiplier = FONT_MULTIPLIERS[font] || 1.0;
    const sizeMultiplier = FONT_SIZE_MULTIPLIERS[fontSize] || 1.0;
    const spacingMultiplier = SPACING_MULTIPLIERS[spacing] || 1.0;
    
    return Math.round(BASE_WORDS_PER_PAGE * spacingMultiplier / (fontMultiplier * sizeMultiplier));
  }, [font, fontSize, spacing]);

  // Calculate pages from words
  const calculatedPages = useMemo(() => {
    if (mode === 'words-to-pages') {
      const count = pasteText ? pasteText.trim().split(/\s+/).filter(w => w.length > 0).length : wordCount;
      return Number((count / wordsPerPageCalculation).toFixed(1));
    }
    return pageCount;
  }, [mode, wordCount, pasteText, wordsPerPageCalculation, pageCount]);

  // Calculate words from pages
  const calculatedWords = useMemo(() => {
    if (mode === 'pages-to-words') {
      return Math.round(pageCount * wordsPerPageCalculation);
    }
    return pasteText ? pasteText.trim().split(/\s+/).filter(w => w.length > 0).length : wordCount;
  }, [mode, pageCount, pasteText, wordCount, wordsPerPageCalculation]);

  // Reading time (200 words per minute average)
  const readingTime = useMemo(() => {
    const minutes = calculatedWords / 200;
    if (minutes < 1) return `${Math.round(minutes * 60)} seconds`;
    if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }, [calculatedWords]);

  // Speaking time (130 words per minute average)
  const speakingTime = useMemo(() => {
    const minutes = calculatedWords / 130;
    if (minutes < 1) return `${Math.round(minutes * 60)} seconds`;
    if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }, [calculatedWords]);

  // Quick reference data
  const quickReference = useMemo(() => {
    return [
      { words: 250, pages: Number((250 / wordsPerPageCalculation).toFixed(1)) },
      { words: 500, pages: Number((500 / wordsPerPageCalculation).toFixed(1)) },
      { words: 750, pages: Number((750 / wordsPerPageCalculation).toFixed(1)) },
      { words: 1000, pages: Number((1000 / wordsPerPageCalculation).toFixed(1)) },
      { words: 1500, pages: Number((1500 / wordsPerPageCalculation).toFixed(1)) },
      { words: 2000, pages: Number((2000 / wordsPerPageCalculation).toFixed(1)) },
      { words: 2500, pages: Number((2500 / wordsPerPageCalculation).toFixed(1)) },
      { words: 3000, pages: Number((3000 / wordsPerPageCalculation).toFixed(1)) },
      { words: 5000, pages: Number((5000 / wordsPerPageCalculation).toFixed(1)) },
      { words: 10000, pages: Number((10000 / wordsPerPageCalculation).toFixed(1)) }
    ];
  }, [wordsPerPageCalculation]);

  // Switch mode and auto-convert values
  const switchMode = () => {
    if (mode === 'words-to-pages') {
      setPageCount(calculatedPages);
      setMode('pages-to-words');
    } else {
      setWordCount(calculatedWords);
      setMode('words-to-pages');
    }
  };

  // Update word count when text is pasted
  useEffect(() => {
    if (pasteText && mode === 'words-to-pages') {
      const words = pasteText.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (words > 0) {
        toast({
          title: "Text Analyzed",
          description: `Detected ${words.toLocaleString()} words from pasted text.`,
        });
      }
    }
  }, [pasteText, mode, toast]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Words Per Page Calculator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Convert words to pages or pages to words with customizable formatting options
            </p>
          </div>

          {/* Mode Selector */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaExchangeAlt className="text-primary" />
                Conversion Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => { setMode('words-to-pages'); setPasteText(''); }}
                  variant={mode === 'words-to-pages' ? 'default' : 'outline'}
                  className="flex-1"
                  data-testid="button-mode-words-to-pages"
                >
                  <FaFileAlt className="mr-2" />
                  Words → Pages
                </Button>
                <Button
                  onClick={switchMode}
                  variant="secondary"
                  size="icon"
                  className="sm:w-auto"
                  data-testid="button-switch-mode"
                  title="Switch conversion mode"
                >
                  <FaExchangeAlt />
                </Button>
                <Button
                  onClick={() => { setMode('pages-to-words'); setPasteText(''); }}
                  variant={mode === 'pages-to-words' ? 'default' : 'outline'}
                  className="flex-1"
                  data-testid="button-mode-pages-to-words"
                >
                  <FaFileAlt className="mr-2" />
                  Pages → Words
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Input Section */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaCog className="text-primary" />
                  {mode === 'words-to-pages' ? 'Input & Settings' : 'Page Count & Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual" data-testid="tab-manual">Manual Input</TabsTrigger>
                    <TabsTrigger value="paste" data-testid="tab-paste">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4 mt-4">
                    {mode === 'words-to-pages' ? (
                      <div className="space-y-2">
                        <Label htmlFor="wordCount">Number of Words</Label>
                        <Input
                          id="wordCount"
                          type="number"
                          min="1"
                          value={wordCount}
                          onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                          className="text-lg font-semibold"
                          data-testid="input-word-count"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="pageCount">Number of Pages</Label>
                        <Input
                          id="pageCount"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={pageCount}
                          onChange={(e) => setPageCount(parseFloat(e.target.value) || 0)}
                          className="text-lg font-semibold"
                          data-testid="input-page-count"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="pasteText">Paste Your Text</Label>
                      <Textarea
                        id="pasteText"
                        placeholder="Paste your text here to automatically calculate word count and page estimate..."
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        className="h-32 resize-none"
                        data-testid="textarea-paste-text"
                      />
                      {pasteText && (
                        <p className="text-sm text-muted-foreground">
                          Detected: {pasteText.trim().split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Formatting Options */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-sm text-muted-foreground">Formatting Options</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font">Font</Label>
                    <Select value={font} onValueChange={setFont}>
                      <SelectTrigger id="font" data-testid="select-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
                        <SelectTrigger id="fontSize" data-testid="select-font-size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">9pt</SelectItem>
                          <SelectItem value="10">10pt</SelectItem>
                          <SelectItem value="11">11pt</SelectItem>
                          <SelectItem value="12">12pt</SelectItem>
                          <SelectItem value="13">13pt</SelectItem>
                          <SelectItem value="14">14pt</SelectItem>
                          <SelectItem value="16">16pt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spacing">Line Spacing</Label>
                      <Select value={spacing} onValueChange={(v) => setSpacing(v as any)}>
                        <SelectTrigger id="spacing" data-testid="select-spacing">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="1.5">1.5 Lines</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <FaInfoCircle className="text-primary" />
                      Estimates based on 1" margins and standard letter size (8.5" × 11")
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-4">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaChartBar className="text-primary" />
                    Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <div className="text-4xl sm:text-5xl font-bold text-primary mb-2" data-testid="result-main">
                      {mode === 'words-to-pages' ? calculatedPages.toFixed(1) : calculatedWords.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {mode === 'words-to-pages' ? 'Pages' : 'Words'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {wordsPerPageCalculation} words per page
                    </div>
                  </div>

                  {/* Time Estimates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-primary" />
                        <span className="text-xs font-semibold">Reading Time</span>
                      </div>
                      <div className="text-lg font-bold" data-testid="result-reading-time">{readingTime}</div>
                      <div className="text-xs text-muted-foreground">~200 wpm</div>
                    </div>

                    <div className="p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMicrophone className="text-primary" />
                        <span className="text-xs font-semibold">Speaking Time</span>
                      </div>
                      <div className="text-lg font-bold" data-testid="result-speaking-time">{speakingTime}</div>
                      <div className="text-xs text-muted-foreground">~130 wpm</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {mode === 'words-to-pages' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Visual Page Estimate</span>
                        <span>{calculatedPages.toFixed(1)} pages</span>
                      </div>
                      <Progress value={Math.min((calculatedPages % 1) * 100, 100)} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Settings Summary */}
              <Card className="bg-muted/50 border border-border">
                <CardHeader>
                  <CardTitle className="text-sm">Current Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{font}</Badge>
                    <Badge variant="secondary">{fontSize}pt</Badge>
                    <Badge variant="secondary">{spacing === '1.5' ? '1.5' : spacing} spaced</Badge>
                    <Badge variant="secondary">1" margins</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Reference Table */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBook className="text-primary" />
                Quick Reference Table
              </CardTitle>
              <CardDescription>
                Common word counts with current settings ({font}, {fontSize}pt, {spacing} spaced)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Words</th>
                      <th className="text-left py-2 px-3">Pages</th>
                      <th className="text-left py-2 px-3">Reading Time</th>
                      <th className="text-left py-2 px-3">Speaking Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReference.map((ref, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-3 font-semibold">{ref.words.toLocaleString()}</td>
                        <td className="py-2 px-3">{ref.pages}</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {ref.words < 200 ? `${Math.round(ref.words / 200 * 60)}s` : `${Math.round(ref.words / 200)} min`}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {ref.words < 130 ? `${Math.round(ref.words / 130 * 60)}s` : `${Math.round(ref.words / 130)} min`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card className="bg-muted/50 border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Common Use Cases</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📚 Students & Academics</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Meet essay page requirements</li>
                  <li>• Estimate research paper length</li>
                  <li>• Plan thesis chapter lengths</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✍️ Writers & Authors</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Estimate novel/book page count</li>
                  <li>• Plan chapter word targets</li>
                  <li>• Meet publisher requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💼 Content Creators</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Plan blog post length</li>
                  <li>• Estimate article page count</li>
                  <li>• Meet content briefs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎤 Speakers & Presenters</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Time speech presentations</li>
                  <li>• Calculate script length</li>
                  <li>• Plan presentation duration</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
