import { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import RelatedToolsSidebar from '@/components/common/RelatedToolsSidebar';
import { FaSearchPlus, FaCopy, FaRedo, FaExchangeAlt, FaCogs, FaUpload, FaDownload } from 'react-icons/fa';

export default function FindReplace() {
  const [text, setText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [options, setOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    globalReplace: true
  });
  const [stats, setStats] = useState({
    totalMatches: 0,
    replacements: 0
  });
  const [regexError, setRegexError] = useState<string>('');
  const { toast } = useToast();

  useSEO({
    title: 'Find and Replace Tool - Word Counter Plus',
    description: 'Search and replace text patterns with advanced options. Support for regular expressions, case sensitivity, and whole word matching.',
    keywords: 'find replace, text search, regex, pattern replacement, text editor, bulk replace'
  });

  const escapeRegex = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const matches = useMemo(() => {
    if (!text || !findText) {
      return [];
    }

    try {
      let searchPattern: string | RegExp;
      
      if (options.useRegex) {
        const flags = options.caseSensitive ? 'g' : 'gi';
        searchPattern = new RegExp(findText, flags);
      } else {
        let pattern = escapeRegex(findText);
        if (options.wholeWord) {
          pattern = `\\b${pattern}\\b`;
        }
        const flags = options.caseSensitive ? 'g' : 'gi';
        searchPattern = new RegExp(pattern, flags);
      }

      return text.match(searchPattern) || [];
    } catch (error) {
      setRegexError('Invalid regular expression pattern');
      return [];
    }
  }, [text, findText, options]);

  // Update stats when matches change and clear regex error if matches are valid
  useEffect(() => {
    setStats(prev => ({ ...prev, totalMatches: matches.length }));
    if (matches.length > 0 || (!findText || !text)) {
      setRegexError('');
    }
  }, [matches, findText, text]);

  const performReplace = useCallback(() => {
    if (!text || !findText) {
      toast({
        title: "Missing Input",
        description: "Please enter both text to search and find text.",
        variant: "destructive",
      });
      return;
    }

    try {
      let searchPattern: string | RegExp;
      
      if (options.useRegex) {
        const flags = options.globalReplace 
          ? (options.caseSensitive ? 'g' : 'gi')
          : (options.caseSensitive ? '' : 'i');
        searchPattern = new RegExp(findText, flags);
      } else {
        let pattern = escapeRegex(findText);
        if (options.wholeWord) {
          pattern = `\\b${pattern}\\b`;
        }
        const flags = options.globalReplace 
          ? (options.caseSensitive ? 'g' : 'gi')
          : (options.caseSensitive ? '' : 'i');
        searchPattern = new RegExp(pattern, flags);
      }

      const originalMatches = text.match(searchPattern) || [];
      const result = text.replace(searchPattern, replaceText);
      const newMatches = result.match(searchPattern) || [];
      const replacements = originalMatches.length - newMatches.length;
      
      setProcessedText(result);
      setStats({
        totalMatches: originalMatches.length,
        replacements: replacements
      });

      toast({
        title: "Replace Complete",
        description: `Made ${replacements} replacement${replacements !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Replace Failed",
        description: "Error performing replacement. Please check your pattern.",
        variant: "destructive",
      });
    }
  }, [text, findText, replaceText, options, toast]);

  const copyToClipboard = async () => {
    const textToCopy = processedText || text;
    try {
      await navigator.clipboard.writeText(textToCopy);
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

  const handleReset = () => {
    setText('');
    setFindText('');
    setReplaceText('');
    setProcessedText('');
    setStats({ totalMatches: 0, replacements: 0 });
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type - allow text/* MIME types OR specific extensions
    const allowedExtensions = [/\.txt$/i, /\.md$/i, /\.csv$/i, /\.log$/i, /\.json$/i];
    const isTextMime = file.type.startsWith('text/');
    const hasAllowedExtension = allowedExtensions.some(regex => regex.test(file.name));
    
    if (!isTextMime && !hasAllowedExtension) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a text file (.txt, .md, .csv, .log, .json, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      // Reset processed text and stats when new file is loaded
      setProcessedText('');
      setStats({ totalMatches: 0, replacements: 0 });
      
      toast({
        title: "File Uploaded",
        description: `Successfully loaded ${file.name} (${content.length} characters)`,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Unable to read the file. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
    // Reset the input so the same file can be uploaded again
    event.target.value = '';
  };

  const downloadResult = () => {
    const textToDownload = processedText || text;
    
    if (!textToDownload.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some text or perform a replacement first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = processedText 
        ? `find-replace-result-${Date.now()}.txt`
        : `text-content-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "File Downloaded",
        description: processedText 
          ? "Processed text has been saved to your device."
          : "Original text has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file.",
        variant: "destructive",
      });
    }
  };

  // matches are computed via useMemo above

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find and Replace Tool
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Search and replace text patterns with advanced options including regex support, case sensitivity, and whole word matching.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
          {/* Input Text */}
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Enter or paste the text you want to search and modify, or upload a text file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                id="file-upload"
                accept=".txt,.md,.csv,text/*"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
              <div className="mb-4">
                <Button 
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded=10 text-sm transition-colors text-center"
                  title='Uplode the Text, CSV, Log, JSON file'
                  size="sm" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  data-testid="button-upload"
                >
                  <FaUpload className="mr-2" />
                  Upload 
                </Button>
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Enter your text here or click 'Upload File' to load from a file..."
                data-testid="textarea-input"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                {text.split(/\s+/).filter(w => w.length > 0).length} words, {text.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Search and Replace Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaSearchPlus className="text-primary" />
                  Search & Replace
                </CardTitle>
                <CardDescription>
                  Configure your search and replace operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="findText">Find Text</Label>
                  <Input
                    id="findText"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Enter text to find..."
                    data-testid="input-find"
                    className={regexError ? "border-destructive" : ""}
                  />
                  {regexError && (
                    <p className="text-destructive text-sm mt-1" data-testid="text-regex-error">
                      {regexError}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="replaceText">Replace With</Label>
                  <Input
                    id="replaceText"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Enter replacement text..."
                    data-testid="input-replace"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={performReplace} className="flex-1" data-testid="button-replace">
                    <FaExchangeAlt className="mr-2" />
                    Replace
                  </Button>
                  <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                    <FaRedo className="mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaCogs className="text-primary" />
                  Search Options
                </CardTitle>
                <CardDescription>
                  Customize search behavior and matching rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="caseSensitive"
                      checked={options.caseSensitive}
                      onCheckedChange={() => handleOptionChange('caseSensitive')}
                      data-testid="checkbox-case-sensitive"
                    />
                    <Label htmlFor="caseSensitive">Case sensitive</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wholeWord"
                      checked={options.wholeWord}
                      onCheckedChange={() => handleOptionChange('wholeWord')}
                      data-testid="checkbox-whole-word"
                    />
                    <Label htmlFor="wholeWord">Match whole words only</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useRegex"
                      checked={options.useRegex}
                      onCheckedChange={() => handleOptionChange('useRegex')}
                      data-testid="checkbox-regex"
                    />
                    <Label htmlFor="useRegex">Use regular expressions</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="globalReplace"
                      checked={options.globalReplace}
                      onCheckedChange={() => handleOptionChange('globalReplace')}
                      data-testid="checkbox-global"
                    />
                    <Label htmlFor="globalReplace">Replace all occurrences</Label>
                  </div>
                </div>

                {/* Search Stats */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Matches found:</span>
                      <span className="font-mono" data-testid="text-matches">{stats.totalMatches}</span>
                    </div>
                    {processedText && (
                      <div className="flex justify-between">
                        <span>Replacements made:</span>
                        <span className="font-mono" data-testid="text-replacements">{stats.replacements}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Text */}
          {processedText && (
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  Text after find and replace operation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button 
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded=10 text-sm transition-colors text-center"
                    title='Download the Text file'
                    size="sm" 
                    onClick={downloadResult}
                    data-testid="button-download-result"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                    <FaCopy className="mr-2" />
                    Copy Result
                  </Button>
                </div>
                <Textarea
                  value={processedText}
                  onChange={(e) => setProcessedText(e.target.value)}
                  className="min-h-[200px] resize-none"
                  placeholder="Processed text will appear here..."
                  data-testid="textarea-output"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {processedText.split(/\s+/).filter(w => w.length > 0).length} words, {processedText.length} characters
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Examples */}
          {options.useRegex && (
            <Card>
              <CardHeader>
                <CardTitle>Regular Expression Examples</CardTitle>
                <CardDescription>
                  Common regex patterns you can use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>\\d+</strong> - Match any number
                  </div>
                  <div>
                    <strong>\\w+</strong> - Match any word
                  </div>
                  <div>
                    <strong>\\s+</strong> - Match whitespace
                  </div>
                  <div>
                    <strong>^.*$</strong> - Match entire lines
                  </div>
                  <div>
                    <strong>[a-z]+</strong> - Match lowercase letters
                  </div>
                  <div>
                    <strong>\\b\\w{4}\\b</strong> - Match 4-letter words
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:sticky lg:top-4 lg:h-fit">
          <RelatedToolsSidebar currentTool="/find-replace" />
        </div>
      </div>
    </main>
  );
}