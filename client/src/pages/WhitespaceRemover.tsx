import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaFilter,
  FaSpaceShuttle,
  FaListUl,
  FaAlignLeft,
  FaCompressArrowsAlt,
  FaBroom
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';

export default function WhitespaceRemover() {
  const [text, setText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  
  // Removal options
  const [options, setOptions] = useState({
    removeExtraSpaces: true,
    removeLeadingSpaces: true,
    removeTrailingSpaces: true,
    removeEmptyLines: true,
    removeTabs: false,
    removeLineBreaks: false,
    trimEachLine: true
  });

  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'Whitespace Remover - Clean Extra Spaces & Empty Lines | Word Counter Plus',
    description: 'Free whitespace remover tool. Remove extra spaces, empty lines, tabs, and clean up text formatting. Perfect for code cleanup, data processing, and text formatting.',
    keywords: 'whitespace remover, remove extra spaces, remove empty lines, clean text, text formatter, space remover, line cleaner, text cleanup'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('whitespaceRemoverText');
    if (savedText) {
      setText(savedText);
    }
    const savedOptions = localStorage.getItem('whitespaceRemoverOptions');
    if (savedOptions) {
      try {
        setOptions(JSON.parse(savedOptions));
      } catch (error) {
        console.error('Failed to parse saved options:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('whitespaceRemoverText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('whitespaceRemoverOptions', JSON.stringify(options));
  }, [options]);

  // Process text when input or options change
  useEffect(() => {
    if (text) {
      processText();
    } else {
      setProcessedText('');
    }
  }, [text, options]);

  const processText = () => {
    let result = text;

    // Remove tabs
    if (options.removeTabs) {
      result = result.replace(/\t/g, '');
    }

    // Remove line breaks (convert to single line)
    if (options.removeLineBreaks) {
      result = result.replace(/\n/g, ' ');
    }

    // Split into lines for line-by-line processing
    let lines = result.split('\n');

    // Trim each line
    if (options.trimEachLine) {
      lines = lines.map(line => line.trim());
    } else {
      // Apply leading/trailing space removal separately
      if (options.removeLeadingSpaces) {
        lines = lines.map(line => line.replace(/^\s+/, ''));
      }
      if (options.removeTrailingSpaces) {
        lines = lines.map(line => line.replace(/\s+$/, ''));
      }
    }

    // Remove extra spaces within lines
    if (options.removeExtraSpaces) {
      lines = lines.map(line => line.replace(/\s+/g, ' '));
    }

    // Remove empty lines
    if (options.removeEmptyLines) {
      lines = lines.filter(line => line.length > 0);
    }

    result = lines.join('\n');
    setProcessedText(result);
  };

  // Calculate statistics
  const originalStats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    spaces: text.split(' ').length - 1,
    lines: text.split('\n').length,
    emptyLines: text.split('\n').filter(line => line.trim() === '').length,
    tabs: (text.match(/\t/g) || []).length,
    leadingSpaces: text.split('\n').reduce((count, line) => {
      const match = line.match(/^(\s+)/);
      return count + (match ? match[1].length : 0);
    }, 0),
    trailingSpaces: text.split('\n').reduce((count, line) => {
      const match = line.match(/(\s+)$/);
      return count + (match ? match[1].length : 0);
    }, 0)
  };

  const processedStats = {
    characters: processedText.length,
    charactersNoSpaces: processedText.replace(/\s/g, '').length,
    spaces: processedText.split(' ').length - 1,
    lines: processedText.split('\n').length,
    emptyLines: processedText.split('\n').filter(line => line.trim() === '').length,
    tabs: (processedText.match(/\t/g) || []).length
  };

  const reduction = {
    characters: originalStats.characters - processedStats.characters,
    spaces: originalStats.spaces - processedStats.spaces,
    lines: originalStats.lines - processedStats.lines,
    emptyLines: originalStats.emptyLines - processedStats.emptyLines,
    tabs: originalStats.tabs - processedStats.tabs
  };

  const clearText = () => {
    setText('');
    setProcessedText('');
    setUploadedFileInfo(null);
  };

  const copyToClipboard = async (textToCopy: string, type: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Text Copied",
        description: `${type} has been copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Text Pasted",
        description: "Text has been pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([processedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your cleaned text has been downloaded as a TXT file.",
    });
  };

  const applyProcessedText = () => {
    setText(processedText);
    toast({
      title: "Text Applied",
      description: "Processed text has been applied to the input.",
    });
  };

  // File upload functionality
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';
    setIsUploading(true);
    
    try {
      const result = await parseFile(file);
      setText(result.text);
      
      setUploadedFileInfo({
        name: result.fileName,
        size: result.fileSize,
        type: result.fileType
      });
      
      toast({
        title: "File Processed Successfully!",
        description: `"${result.fileName}" has been loaded.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateOption = (key: string, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const presets = {
    basic: {
      removeExtraSpaces: true,
      removeLeadingSpaces: true,
      removeTrailingSpaces: true,
      removeEmptyLines: true,
      removeTabs: false,
      removeLineBreaks: false,
      trimEachLine: true
    },
    aggressive: {
      removeExtraSpaces: true,
      removeLeadingSpaces: true,
      removeTrailingSpaces: true,
      removeEmptyLines: true,
      removeTabs: true,
      removeLineBreaks: false,
      trimEachLine: true
    },
    singleLine: {
      removeExtraSpaces: true,
      removeLeadingSpaces: true,
      removeTrailingSpaces: true,
      removeEmptyLines: true,
      removeTabs: true,
      removeLineBreaks: true,
      trimEachLine: true
    }
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    setOptions(presets[presetName]);
    toast({
      title: "Preset Applied",
      description: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset has been applied.`,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Whitespace Remover
          </h1>
          <p className="text-xl text-muted-foreground">
            Clean up text by removing extra spaces, empty lines, and unwanted whitespace
          </p>
        </div>

        {/* File Information Display */}
        {uploadedFileInfo && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
              <FaUpload className="mr-2" />
              File Loaded Successfully
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-600 dark:text-green-400 font-medium">File:</span>
                <p className="text-green-800 dark:text-green-200 break-all" data-testid="text-uploaded-filename">{uploadedFileInfo.name}</p>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400 font-medium">Size:</span>
                <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filesize">
                  {Math.round(uploadedFileInfo.size / 1024)}KB
                </p>
              </div>
              <div>
                <span className="text-green-600 dark:text-green-400 font-medium">Type:</span>
                <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filetype">{uploadedFileInfo.type}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Options Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaFilter className="mr-2 text-primary" />
                  Cleanup Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Presets */}
                <div>
                  <Label className="font-medium mb-2 block">Quick Presets</Label>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" onClick={() => applyPreset('basic')} className="w-full" data-testid="button-preset-basic">
                      <FaBroom className="mr-1" />
                      Basic Cleanup
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('aggressive')} className="w-full" data-testid="button-preset-aggressive">
                      <FaCompressArrowsAlt className="mr-1" />
                      Aggressive
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('singleLine')} className="w-full" data-testid="button-preset-single-line">
                      <FaAlignLeft className="mr-1" />
                      Single Line
                    </Button>
                  </div>
                </div>

                {/* Individual Options */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeExtraSpaces" 
                      checked={options.removeExtraSpaces}
                      onCheckedChange={(checked) => updateOption('removeExtraSpaces', checked as boolean)}
                      data-testid="checkbox-extra-spaces"
                    />
                    <Label htmlFor="removeExtraSpaces" className="text-sm">Remove extra spaces</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trimEachLine" 
                      checked={options.trimEachLine}
                      onCheckedChange={(checked) => updateOption('trimEachLine', checked as boolean)}
                      data-testid="checkbox-trim-lines"
                    />
                    <Label htmlFor="trimEachLine" className="text-sm">Trim each line</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeLeadingSpaces" 
                      checked={options.removeLeadingSpaces}
                      onCheckedChange={(checked) => updateOption('removeLeadingSpaces', checked as boolean)}
                      disabled={options.trimEachLine}
                      data-testid="checkbox-leading-spaces"
                    />
                    <Label htmlFor="removeLeadingSpaces" className="text-sm">Remove leading spaces</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeTrailingSpaces" 
                      checked={options.removeTrailingSpaces}
                      onCheckedChange={(checked) => updateOption('removeTrailingSpaces', checked as boolean)}
                      disabled={options.trimEachLine}
                      data-testid="checkbox-trailing-spaces"
                    />
                    <Label htmlFor="removeTrailingSpaces" className="text-sm">Remove trailing spaces</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeEmptyLines" 
                      checked={options.removeEmptyLines}
                      onCheckedChange={(checked) => updateOption('removeEmptyLines', checked as boolean)}
                      data-testid="checkbox-empty-lines"
                    />
                    <Label htmlFor="removeEmptyLines" className="text-sm">Remove empty lines</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeTabs" 
                      checked={options.removeTabs}
                      onCheckedChange={(checked) => updateOption('removeTabs', checked as boolean)}
                      data-testid="checkbox-tabs"
                    />
                    <Label htmlFor="removeTabs" className="text-sm">Remove tabs</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="removeLineBreaks" 
                      checked={options.removeLineBreaks}
                      onCheckedChange={(checked) => updateOption('removeLineBreaks', checked as boolean)}
                      data-testid="checkbox-line-breaks"
                    />
                    <Label htmlFor="removeLineBreaks" className="text-sm">Remove line breaks</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Text Input</CardTitle>
                    <CardDescription>
                      Enter, paste, or upload text to clean up whitespace
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* File Upload */}
                    <label className={`px-3 py-2 rounded text-sm transition-colors ${
                      isUploading 
                        ? 'bg-primary/50 text-primary-foreground cursor-wait' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer'
                    }`}
                           data-testid="button-upload-file">
                      {isUploading ? (
                        <>
                          <div className="inline-block w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="inline mr-1" />
                          Upload
                        </>
                      )}
                      <input 
                        type="file" 
                        accept={getFileInputAccept()} 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="sr-only"
                      />
                    </label>
                    
                    <Button variant="outline" size="sm" onClick={pasteText} data-testid="button-paste">
                      Paste
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearText} data-testid="button-clear">
                      <FaEraser className="mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter or paste text here to remove whitespace..."
                  className="min-h-[200px] resize-none font-mono"
                  data-testid="textarea-whitespace-input"
                />
              </CardContent>
            </Card>

            {/* Output Area */}
            {processedText && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Cleaned Text</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(processedText, 'Cleaned text')} data-testid="button-copy">
                        <FaCopy className="mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadText} data-testid="button-download">
                        <FaDownload className="mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={applyProcessedText} data-testid="button-apply">
                        Apply to Input
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={processedText}
                    readOnly
                    className="min-h-[200px] resize-none font-mono bg-muted"
                    data-testid="textarea-cleaned-output"
                  />
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {text && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaListUl className="mr-2 text-primary" />
                    Cleanup Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">-{reduction.characters}</p>
                      <p className="text-sm text-muted-foreground">Characters Removed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">-{reduction.spaces}</p>
                      <p className="text-sm text-muted-foreground">Spaces Removed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">-{reduction.emptyLines}</p>
                      <p className="text-sm text-muted-foreground">Empty Lines Removed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {originalStats.characters > 0 ? Math.round((reduction.characters / originalStats.characters) * 100) : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Size Reduction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Whitespace Remover Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaBroom className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Multiple Cleanup Options</h3>
              <p className="text-sm text-muted-foreground">
                Remove extra spaces, empty lines, tabs, and unwanted whitespace
              </p>
            </div>
            <div className="text-center">
              <FaCompressArrowsAlt className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Quick Presets</h3>
              <p className="text-sm text-muted-foreground">
                Use predefined cleanup presets for common scenarios
              </p>
            </div>
            <div className="text-center">
              <FaListUl className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Detailed Statistics</h3>
              <p className="text-sm text-muted-foreground">
                See exactly what was removed and how much space was saved
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}