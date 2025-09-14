import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaListOl,
  FaSort,
  FaFilter,
  FaHashtag
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';

export default function LineCounter() {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'Line Counter - Count Lines in Text | Word Counter Plus',
    description: 'Free online line counter tool. Count total lines, non-empty lines, and analyze line statistics in your text. Perfect for code, data files, and document analysis.',
    keywords: 'line counter, count lines, line count, text lines, code lines, file lines, data analysis, text statistics'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('lineCounterText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lineCounterText', text);
  }, [text]);

  // Calculate line statistics
  const lines = text.split('\n');
  const stats = {
    totalLines: lines.length,
    nonEmptyLines: lines.filter(line => line.trim().length > 0).length,
    emptyLines: lines.filter(line => line.trim().length === 0).length,
    linesWithSpacesOnly: lines.filter(line => line.length > 0 && line.trim().length === 0).length,
    longestLine: lines.reduce((max, line) => Math.max(max, line.length), 0),
    shortestLine: lines.length > 0 ? lines.filter(line => line.trim().length > 0)
      .reduce((min, line) => Math.min(min, line.trim().length), Infinity) : 0,
    averageLineLength: lines.length > 0 ? Math.round(lines.reduce((sum, line) => sum + line.length, 0) / lines.length * 10) / 10 : 0,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length
  };

  // Fix shortest line calculation
  if (stats.shortestLine === Infinity) {
    stats.shortestLine = 0;
  }

  const clearText = () => {
    setText('');
    setUploadedFileInfo(null);
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
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'line-count-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your text has been downloaded as a TXT file.",
    });
  };

  const removeEmptyLines = () => {
    const cleanedText = lines.filter(line => line.trim().length > 0).join('\n');
    setText(cleanedText);
    toast({
      title: "Empty Lines Removed",
      description: `Removed ${stats.emptyLines} empty lines.`,
    });
  };

  const numberLines = () => {
    const numberedText = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
    setText(numberedText);
    toast({
      title: "Lines Numbered",
      description: "Added line numbers to your text.",
    });
  };

  const sortLines = () => {
    const sortedText = lines.sort().join('\n');
    setText(sortedText);
    toast({
      title: "Lines Sorted",
      description: "Lines have been sorted alphabetically.",
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
        description: `"${result.fileName}" analyzed successfully.`,
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Line Counter
          </h1>
          <p className="text-xl text-muted-foreground">
            Count lines, analyze line statistics, and process text line by line
          </p>
        </div>

        {/* File Information Display */}
        {uploadedFileInfo && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
              <FaUpload className="mr-2" />
              File Analysis Complete
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Input Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Enter Your Text</CardTitle>
                    <CardDescription>
                      Type, paste, or upload text to analyze line count
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
                          Uploading...
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
                  placeholder="Start typing or paste your text here to count lines..."
                  className="min-h-[300px] resize-none font-mono"
                  data-testid="textarea-line-input"
                />
                
                <div className="flex flex-wrap justify-between mt-4 gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                      <FaCopy className="mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadText} data-testid="button-download">
                      <FaDownload className="mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.totalLines} lines
                  </div>
                </div>
                
                {/* Line Processing Actions */}
                {text.trim() && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium mb-3">Line Processing</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={removeEmptyLines}
                        disabled={stats.emptyLines === 0}
                        data-testid="button-remove-empty-lines"
                      >
                        <FaFilter className="mr-1" />
                        Remove Empty Lines
                      </Button>
                      <Button variant="outline" size="sm" onClick={numberLines} data-testid="button-number-lines">
                        <FaHashtag className="mr-1" />
                        Number Lines
                      </Button>
                      <Button variant="outline" size="sm" onClick={sortLines} data-testid="button-sort-lines">
                        <FaSort className="mr-1" />
                        Sort Lines
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-4">
            {/* Line Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaListOl className="mr-2 text-primary" />
                  Line Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total lines:</span>
                  <span className="font-bold text-2xl text-primary" data-testid="text-total-lines">
                    {stats.totalLines}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Non-empty lines:</span>
                  <span className="font-bold text-xl text-green-600" data-testid="text-non-empty-lines">
                    {stats.nonEmptyLines}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empty lines:</span>
                  <span className="font-bold text-xl text-orange-600" data-testid="text-empty-lines">
                    {stats.emptyLines}
                  </span>
                </div>
                {stats.linesWithSpacesOnly > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Whitespace-only lines:</span>
                    <span className="font-bold text-yellow-600">
                      {stats.linesWithSpacesOnly}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Line Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longest line:</span>
                  <span className="font-semibold">{stats.longestLine} chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shortest line:</span>
                  <span className="font-semibold">{stats.shortestLine} chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average length:</span>
                  <span className="font-semibold">{stats.averageLineLength} chars</span>
                </div>
              </CardContent>
            </Card>

            {/* Text Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Text Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words:</span>
                  <span className="font-semibold" data-testid="text-word-count">{stats.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-semibold" data-testid="text-character-count">{stats.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters (no spaces):</span>
                  <span className="font-semibold">{stats.charactersNoSpaces}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Line Counter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaListOl className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Real-time Counting</h3>
              <p className="text-sm text-muted-foreground">
                Count total lines, empty lines, and non-empty lines as you type
              </p>
            </div>
            <div className="text-center">
              <FaFilter className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Line Processing</h3>
              <p className="text-sm text-muted-foreground">
                Remove empty lines, add line numbers, and sort lines alphabetically
              </p>
            </div>
            <div className="text-center">
              <FaUpload className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">File Support</h3>
              <p className="text-sm text-muted-foreground">
                Upload and analyze text files, code files, and data files
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}