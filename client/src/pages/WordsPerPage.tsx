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
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import useFileUpload from '@/hooks/useFileUpload';
import { 
  FaExchangeAlt,
  FaFileAlt,
  FaClock,
  FaMicrophone,
  FaBook,
  FaCog,
  FaInfoCircle,
  FaChartBar,
  FaUpload,
  FaDownload,
  FaEraser,
  FaCopy,
  FaEye,
  FaRuler,
  FaCompressAlt
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
  'Comic Sans MS': 1.1,
  'Palatino': 1.03,
  'Garamond': 0.98,
  'Trebuchet MS': 1.07
};

// Font size multipliers (base: 12pt = 1.0)
const FONT_SIZE_MULTIPLIERS: Record<number, number> = {
  8: 0.67,
  9: 0.75,
  10: 0.83,
  11: 0.92,
  12: 1.0,
  13: 1.08,
  14: 1.17,
  16: 1.33,
  18: 1.5,
  20: 1.67
};

// Spacing multipliers for words per page
const SPACING_MULTIPLIERS: Record<string, number> = {
  'single': 1.8,
  '1.15': 1.5,
  '1.5': 1.2,
  'double': 1.0
};

// Paper sizes (width x height in inches)
const PAPER_SIZES: Record<string, { width: number; height: number; label: string }> = {
  'letter': { width: 8.5, height: 11, label: 'Letter (8.5" × 11")' },
  'a4': { width: 8.27, height: 11.69, label: 'A4 (8.27" × 11.69")' },
  'legal': { width: 8.5, height: 14, label: 'Legal (8.5" × 14")' },
  'a5': { width: 5.83, height: 8.27, label: 'A5 (5.83" × 8.27")' }
};

// Document type presets
const DOCUMENT_PRESETS = {
  'academic': { font: 'Times New Roman', fontSize: 12, spacing: 'double', margins: 1, name: 'Academic Essay' },
  'novel': { font: 'Times New Roman', fontSize: 12, spacing: 'double', margins: 1, name: 'Novel Manuscript' },
  'blog': { font: 'Arial', fontSize: 12, spacing: '1.5', margins: 0.75, name: 'Blog Post' },
  'business': { font: 'Arial', fontSize: 11, spacing: 'single', margins: 1, name: 'Business Document' },
  'ebook': { font: 'Georgia', fontSize: 12, spacing: '1.5', margins: 0.5, name: 'E-book' },
  'screenplay': { font: 'Courier New', fontSize: 12, spacing: 'single', margins: 1, name: 'Screenplay' }
};

// Base words per page (12pt Times New Roman, double-spaced, 1" margins, letter size)
const BASE_WORDS_PER_PAGE = 275;

type PresetType = keyof typeof DOCUMENT_PRESETS | null;

export default function WordsPerPage() {
  const [mode, setMode] = useState<'words-to-pages' | 'pages-to-words'>('words-to-pages');
  const [wordCount, setWordCount] = useState<number>(1000);
  const [pageCount, setPageCount] = useState<number>(4);
  const [font, setFont] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [spacing, setSpacing] = useState<string>('double');
  const [paperSize, setPaperSize] = useState('letter');
  const [margins, setMargins] = useState(1);
  const [pasteText, setPasteText] = useState('');
  const [preset, setPreset] = useState<PresetType>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setPasteText(content);
      setMode('words-to-pages');
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain', '.doc', '.docx']
  });

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
      "Multiple paper sizes",
      "Custom margins",
      "Document presets",
      "Reading time estimates",
      "Speaking time estimates",
      "File upload support",
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

  // Calculate words per page based on all settings
  const wordsPerPageCalculation = useMemo(() => {
    const fontMultiplier = FONT_MULTIPLIERS[font] || 1.0;
    const sizeMultiplier = FONT_SIZE_MULTIPLIERS[fontSize] || 1.0;
    const spacingMultiplier = SPACING_MULTIPLIERS[spacing] || 1.0;
    const paper = PAPER_SIZES[paperSize];
    const paperSizeMultiplier = (paper.width * paper.height) / (8.5 * 11);
    const marginMultiplier = Math.pow((8.5 - 2 * margins) / 6.5, 1.5);
    
    return Math.round(
      BASE_WORDS_PER_PAGE * 
      spacingMultiplier * 
      paperSizeMultiplier * 
      marginMultiplier / 
      (fontMultiplier * sizeMultiplier)
    );
  }, [font, fontSize, spacing, paperSize, margins]);

  // Calculate pages from words
  const calculatedPages = useMemo(() => {
    if (mode === 'words-to-pages') {
      const count = pasteText ? pasteText.trim().split(/\s+/).filter(w => w.length > 0).length : wordCount;
      return Number((count / wordsPerPageCalculation).toFixed(2));
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

  // Additional statistics
  const statistics = useMemo(() => {
    const words = calculatedWords;
    const characters = pasteText ? pasteText.length : words * 5; // Average 5 chars per word
    const charactersNoSpaces = pasteText ? pasteText.replace(/\s/g, '').length : words * 4;
    const sentences = pasteText ? pasteText.split(/[.!?]+/).filter(s => s.trim().length > 0).length : Math.round(words / 15);
    const paragraphs = pasteText ? pasteText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : Math.round(words / 100);
    
    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      avgWordLength: Math.round(charactersNoSpaces / words * 10) / 10 || 0
    };
  }, [calculatedWords, pasteText]);

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

  // Comparison data (different spacings)
  const comparisonData = useMemo(() => {
    const baseCalc = (spacingType: string) => {
      const fontMultiplier = FONT_MULTIPLIERS[font] || 1.0;
      const sizeMultiplier = FONT_SIZE_MULTIPLIERS[fontSize] || 1.0;
      const spacingMultiplier = SPACING_MULTIPLIERS[spacingType] || 1.0;
      const paper = PAPER_SIZES[paperSize];
      const paperSizeMultiplier = (paper.width * paper.height) / (8.5 * 11);
      const marginMultiplier = Math.pow((8.5 - 2 * margins) / 6.5, 1.5);
      
      return Math.round(
        BASE_WORDS_PER_PAGE * 
        spacingMultiplier * 
        paperSizeMultiplier * 
        marginMultiplier / 
        (fontMultiplier * sizeMultiplier)
      );
    };

    return [
      { spacing: 'Single', wpp: baseCalc('single'), pages: Number((calculatedWords / baseCalc('single')).toFixed(2)) },
      { spacing: '1.15 Lines', wpp: baseCalc('1.15'), pages: Number((calculatedWords / baseCalc('1.15')).toFixed(2)) },
      { spacing: '1.5 Lines', wpp: baseCalc('1.5'), pages: Number((calculatedWords / baseCalc('1.5')).toFixed(2)) },
      { spacing: 'Double', wpp: baseCalc('double'), pages: Number((calculatedWords / baseCalc('double')).toFixed(2)) }
    ];
  }, [font, fontSize, paperSize, margins, calculatedWords]);

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

  // Apply preset
  const applyPreset = (presetKey: PresetType) => {
    if (!presetKey) return;
    const presetData = DOCUMENT_PRESETS[presetKey];
    setFont(presetData.font);
    setFontSize(presetData.fontSize);
    setSpacing(presetData.spacing);
    setMargins(presetData.margins);
    setPreset(presetKey);
    toast({
      title: "Preset Applied",
      description: `Applied ${presetData.name} formatting.`,
    });
  };

  // Clear all
  const clearAll = () => {
    setPasteText('');
    setWordCount(1000);
    setPageCount(4);
    toast({
      title: "Cleared",
      description: "All text and inputs have been cleared.",
    });
  };

  // Copy result
  const copyResult = () => {
    const result = mode === 'words-to-pages' 
      ? `${calculatedPages.toFixed(2)} pages` 
      : `${calculatedWords.toLocaleString()} words`;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied",
      description: `Result copied: ${result}`,
    });
  };

  // Download report
  const downloadReport = () => {
    const report = `WORDS PER PAGE CALCULATION REPORT
Generated: ${new Date().toLocaleString()}

=== INPUT ===
Mode: ${mode === 'words-to-pages' ? 'Words to Pages' : 'Pages to Words'}
${mode === 'words-to-pages' ? `Words: ${calculatedWords.toLocaleString()}` : `Pages: ${pageCount}`}

=== SETTINGS ===
Font: ${font}
Font Size: ${fontSize}pt
Line Spacing: ${spacing}
Paper Size: ${PAPER_SIZES[paperSize].label}
Margins: ${margins}"

=== RESULTS ===
${mode === 'words-to-pages' ? `Pages: ${calculatedPages.toFixed(2)}` : `Words: ${calculatedWords.toLocaleString()}`}
Words Per Page: ${wordsPerPageCalculation}
Reading Time: ${readingTime}
Speaking Time: ${speakingTime}

=== STATISTICS ===
Total Words: ${statistics.words.toLocaleString()}
Characters: ${statistics.characters.toLocaleString()}
Characters (no spaces): ${statistics.charactersNoSpaces.toLocaleString()}
Sentences: ${statistics.sentences}
Paragraphs: ${statistics.paragraphs}
Avg Word Length: ${statistics.avgWordLength} characters

=== QUICK REFERENCE ===
${quickReference.map(ref => `${ref.words.toLocaleString()} words = ${ref.pages} pages`).join('\n')}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `words-per-page-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Calculation report has been downloaded.",
    });
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-3 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 px-2">
              Words Per Page Calculator
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2">
              Convert words to pages or pages to words with advanced formatting options
            </p>
          </div>

          {/* Mode Selector */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                <FaExchangeAlt className="text-primary text-sm sm:text-base" />
                Conversion Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => { setMode('words-to-pages'); setPasteText(''); }}
                  variant={mode === 'words-to-pages' ? 'default' : 'outline'}
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
                  data-testid="button-mode-words-to-pages"
                >
                  <FaFileAlt className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
                  Words → Pages
                </Button>
                <Button
                  onClick={switchMode}
                  variant="secondary"
                  size="icon"
                  className="w-10 h-10 sm:w-11 sm:h-11 self-center sm:self-auto"
                  data-testid="button-switch-mode"
                  title="Switch conversion mode"
                >
                  <FaExchangeAlt className="text-xs sm:text-sm" />
                </Button>
                <Button
                  onClick={() => { setMode('pages-to-words'); setPasteText(''); }}
                  variant={mode === 'pages-to-words' ? 'default' : 'outline'}
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
                  data-testid="button-mode-pages-to-words"
                >
                  <FaFileAlt className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
                  Pages → Words
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Presets */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                <FaBook className="text-primary text-sm sm:text-base" />
                Document Presets
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Quick formatting templates for common document types</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {(Object.keys(DOCUMENT_PRESETS) as PresetType[]).map((key) => {
                  if (!key) return null;
                  const presetData = DOCUMENT_PRESETS[key];
                  return (
                    <Button
                      key={key}
                      onClick={() => applyPreset(key)}
                      variant={preset === key ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs sm:text-sm h-auto py-2 px-2 sm:px-3"
                    >
                      {presetData.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                  <FaCog className="text-primary text-sm sm:text-base" />
                  {mode === 'words-to-pages' ? 'Input & Settings' : 'Page Count & Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 space-y-3 sm:space-y-4">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-auto">
                    <TabsTrigger value="manual" className="text-xs sm:text-sm py-1.5 sm:py-2" data-testid="tab-manual">Manual Input</TabsTrigger>
                    <TabsTrigger value="paste" className="text-xs sm:text-sm py-1.5 sm:py-2" data-testid="tab-paste">Paste/Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                    {mode === 'words-to-pages' ? (
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="wordCount" className="text-xs sm:text-sm">Number of Words</Label>
                        <Input
                          id="wordCount"
                          type="number"
                          min="1"
                          value={wordCount}
                          onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                          className="text-base sm:text-lg font-semibold h-10 sm:h-12"
                          data-testid="input-word-count"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="pageCount" className="text-xs sm:text-sm">Number of Pages</Label>
                        <Input
                          id="pageCount"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={pageCount}
                          onChange={(e) => setPageCount(parseFloat(e.target.value) || 0)}
                          className="text-base sm:text-lg font-semibold h-10 sm:h-12"
                          data-testid="input-page-count"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="pasteText" className="text-xs sm:text-sm">Paste Your Text</Label>
                      <Textarea
                        id="pasteText"
                        placeholder="Paste your text here to automatically calculate word count and page estimate..."
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        className="h-32 sm:h-40 resize-none text-xs sm:text-sm"
                        data-testid="textarea-paste-text"
                      />
                      {pasteText && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Detected: {pasteText.trim().split(/\s+/).filter(w => w.length > 0).length.toLocaleString()} words
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={triggerFileUpload}
                        disabled={isUploading}
                        variant="secondary"
                        size="sm"
                        className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <FaUpload className="mr-1 text-xs sm:text-sm" />
                        {isUploading ? 'Uploading...' : 'Upload File'}
                      </Button>
                      <Button
                        onClick={clearAll}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <FaEraser className="mr-1 text-xs sm:text-sm" />
                        Clear
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Formatting Options */}
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-border">
                  <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Formatting Options</h3>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="font" className="text-xs sm:text-sm">Font</Label>
                    <Select value={font} onValueChange={(v) => { setFont(v); setPreset(null); }}>
                      <SelectTrigger id="font" data-testid="select-font" className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(FONT_MULTIPLIERS).map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="fontSize" className="text-xs sm:text-sm">Font Size</Label>
                      <Select value={fontSize.toString()} onValueChange={(v) => { setFontSize(parseInt(v)); setPreset(null); }}>
                        <SelectTrigger id="fontSize" data-testid="select-font-size" className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(FONT_SIZE_MULTIPLIERS).map((s) => (
                            <SelectItem key={s} value={s}>{s}pt</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="spacing" className="text-xs sm:text-sm">Line Spacing</Label>
                      <Select value={spacing} onValueChange={(v) => { setSpacing(v); setPreset(null); }}>
                        <SelectTrigger id="spacing" data-testid="select-spacing" className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="1.15">1.15</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="paperSize" className="text-xs sm:text-sm">Paper Size</Label>
                    <Select value={paperSize} onValueChange={(v) => { setPaperSize(v); setPreset(null); }}>
                      <SelectTrigger id="paperSize" data-testid="select-paper-size" className="h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAPER_SIZES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="margins" className="text-xs sm:text-sm">Margins: {margins}"</Label>
                    <Slider
                      id="margins"
                      min={0.5}
                      max={2}
                      step={0.25}
                      value={[margins]}
                      onValueChange={(v) => { setMargins(v[0]); setPreset(null); }}
                      className="w-full"
                      data-testid="slider-margins"
                    />
                    <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                      <span>0.5"</span>
                      <span>2"</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                    <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                      <FaInfoCircle className="text-primary flex-shrink-0" />
                      <span>Words per page: <strong>{wordsPerPageCalculation}</strong></span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-3 sm:space-y-4">
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                      <FaChartBar className="text-primary text-sm sm:text-base" />
                      Results
                    </CardTitle>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button
                        onClick={copyResult}
                        size="sm"
                        variant="ghost"
                        className="h-7 sm:h-8 px-2 text-xs"
                        title="Copy result"
                      >
                        <FaCopy className="text-xs sm:text-sm" />
                      </Button>
                      <Button
                        onClick={downloadReport}
                        size="sm"
                        variant="ghost"
                        className="h-7 sm:h-8 px-2 text-xs"
                        title="Download report"
                      >
                        <FaDownload className="text-xs sm:text-sm" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0 space-y-4 sm:space-y-6">
                  {/* Main Result */}
                  <div className="text-center p-4 sm:p-6 bg-primary/10 rounded-lg">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2" data-testid="result-main">
                      {mode === 'words-to-pages' ? calculatedPages.toFixed(2) : calculatedWords.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {mode === 'words-to-pages' ? 'Pages' : 'Words'}
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-background border border-border rounded-lg">
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Characters</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold">{statistics.characters.toLocaleString()}</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-background border border-border rounded-lg">
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">No Spaces</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold">{statistics.charactersNoSpaces.toLocaleString()}</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-background border border-border rounded-lg">
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Sentences</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold">{statistics.sentences}</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-background border border-border rounded-lg">
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Paragraphs</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold">{statistics.paragraphs}</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-background border border-border rounded-lg col-span-2">
                      <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Avg Word Length</div>
                      <div className="text-sm sm:text-base md:text-lg font-bold">{statistics.avgWordLength} chars</div>
                    </div>
                  </div>

                  {/* Time Estimates */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="p-3 sm:p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                        <FaClock className="text-primary text-xs sm:text-sm" />
                        <span className="text-[10px] sm:text-xs font-semibold">Reading Time</span>
                      </div>
                      <div className="text-sm sm:text-base md:text-lg font-bold" data-testid="result-reading-time">{readingTime}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">~200 wpm</div>
                    </div>

                    <div className="p-3 sm:p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                        <FaMicrophone className="text-primary text-xs sm:text-sm" />
                        <span className="text-[10px] sm:text-xs font-semibold">Speaking Time</span>
                      </div>
                      <div className="text-sm sm:text-base md:text-lg font-bold" data-testid="result-speaking-time">{speakingTime}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">~130 wpm</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {mode === 'words-to-pages' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                        <span>Progress to Next Page</span>
                        <span>{((calculatedPages % 1) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(calculatedPages % 1) * 100} className="h-1.5 sm:h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Settings Summary */}
              <Card className="bg-muted/50">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm">Current Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{font}</Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{fontSize}pt</Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{spacing} spaced</Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{PAPER_SIZES[paperSize].label.split('(')[0]}</Badge>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{margins}" margins</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comparison Tool */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                  <FaCompressAlt className="text-primary text-sm sm:text-base" />
                  Spacing Comparison
                </CardTitle>
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <FaEye className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </Button>
              </div>
              <CardDescription className="text-xs sm:text-sm">Compare page counts across different line spacings</CardDescription>
            </CardHeader>
            {showComparison && (
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-2 px-2 sm:px-3">Spacing</th>
                        <th className="text-right py-2 px-2 sm:px-3">Words/Page</th>
                        <th className="text-right py-2 px-2 sm:px-3">Pages</th>
                        <th className="text-right py-2 px-2 sm:px-3">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2 px-2 sm:px-3 font-semibold">{item.spacing}</td>
                          <td className="py-2 px-2 sm:px-3 text-right">{item.wpp}</td>
                          <td className="py-2 px-2 sm:px-3 text-right font-semibold">{item.pages}</td>
                          <td className="py-2 px-2 sm:px-3 text-right text-muted-foreground">
                            {index > 0 ? `${(item.pages - comparisonData[0].pages >= 0 ? '+' : '')}${(item.pages - comparisonData[0].pages).toFixed(2)}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Quick Reference Table */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                <FaBook className="text-primary text-sm sm:text-base" />
                Quick Reference Table
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Common word counts with current settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-2 px-2 sm:px-3">Words</th>
                      <th className="text-left py-2 px-2 sm:px-3">Pages</th>
                      <th className="text-left py-2 px-2 sm:px-3">Reading</th>
                      <th className="text-left py-2 px-2 sm:px-3">Speaking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReference.map((ref, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 sm:px-3 font-semibold">{ref.words.toLocaleString()}</td>
                        <td className="py-2 px-2 sm:px-3">{ref.pages}</td>
                        <td className="py-2 px-2 sm:px-3 text-muted-foreground">
                          {ref.words < 200 ? `${Math.round(ref.words / 200 * 60)}s` : `${Math.round(ref.words / 200)} min`}
                        </td>
                        <td className="py-2 px-2 sm:px-3 text-muted-foreground">
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
          <Card className="bg-muted/50">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">Common Use Cases</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2">📚 Students & Academics</h4>
                <ul className="text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li>• Meet essay page requirements</li>
                  <li>• Estimate research paper length</li>
                  <li>• Plan thesis chapter lengths</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2">✍️ Writers & Authors</h4>
                <ul className="text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li>• Estimate novel/book page count</li>
                  <li>• Plan chapter word targets</li>
                  <li>• Meet publisher requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2">💼 Content Creators</h4>
                <ul className="text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li>• Plan blog post length</li>
                  <li>• Estimate article page count</li>
                  <li>• Meet content briefs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1.5 sm:mb-2">🎤 Speakers & Presenters</h4>
                <ul className="text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li>• Time speech presentations</li>
                  <li>• Calculate script length</li>
                  <li>• Plan presentation duration</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <FileInput />
    </main>
  );
}
