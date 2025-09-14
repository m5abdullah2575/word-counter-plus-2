import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaFileAlt,
  FaHashtag,
  FaFont,
  FaListOl,
  FaParagraph,
  FaEye,
  FaClock
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'Character Counter - Count Characters with Spaces | Word Counter Plus',
    description: 'Free online character counter tool. Count characters with spaces, without spaces, words, sentences, and paragraphs in real-time. Perfect for social media posts, essays, and content creation.',
    keywords: 'character counter, character count, letter counter, count characters, text analysis, social media character limit, twitter character count, facebook character limit'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('characterCounterText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('characterCounterText', text);
  }, [text]);

  // Calculate all statistics
  const stats = {
    charactersWithSpaces: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0,
    paragraphs: text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0,
    lines: text.split('\n').length,
    averageWordsPerSentence: 0,
    averageCharsPerWord: 0,
    readingTime: 0
  };

  // Calculate averages
  if (stats.sentences > 0) {
    stats.averageWordsPerSentence = Math.round((stats.words / stats.sentences) * 10) / 10;
  }
  if (stats.words > 0) {
    stats.averageCharsPerWord = Math.round((stats.charactersWithoutSpaces / stats.words) * 10) / 10;
    stats.readingTime = Math.ceil(stats.words / 200); // Average reading speed: 200 words per minute
  }

  // Social media character limits
  const socialLimits = {
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
    youtube: 5000,
    tiktok: 300
  };

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
    a.download = 'character-count-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your text has been downloaded as a TXT file.",
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

  // Character limit helper function
  const getCharacterLimitStatus = (limit: number) => {
    const remaining = limit - stats.charactersWithSpaces;
    const percentage = (stats.charactersWithSpaces / limit) * 100;
    
    if (percentage >= 100) return { color: 'bg-red-500', status: 'Over limit' };
    if (percentage >= 90) return { color: 'bg-orange-500', status: 'Near limit' };
    if (percentage >= 70) return { color: 'bg-yellow-500', status: 'Approaching limit' };
    return { color: 'bg-green-500', status: 'Within limit' };
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Character Counter
          </h1>
          <p className="text-xl text-muted-foreground">
            Count characters, words, sentences, and analyze your text in real-time
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
                      Type, paste, or upload text to analyze character count
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
                  placeholder="Start typing or paste your text here to count characters..."
                  className="min-h-[300px] resize-none"
                  data-testid="textarea-character-input"
                />
                
                <div className="flex justify-between mt-4">
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
                    {stats.charactersWithSpaces} characters
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-4">
            {/* Character Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaHashtag className="mr-2 text-primary" />
                  Character Count
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With spaces:</span>
                  <span className="font-bold text-2xl text-primary" data-testid="text-chars-with-spaces">
                    {stats.charactersWithSpaces}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Without spaces:</span>
                  <span className="font-bold text-xl" data-testid="text-chars-without-spaces">
                    {stats.charactersWithoutSpaces}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Text Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaFileAlt className="mr-2 text-primary" />
                  Text Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <FaFont className="mr-1" /> Words:
                  </span>
                  <span className="font-semibold" data-testid="text-word-count">{stats.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <FaListOl className="mr-1" /> Sentences:
                  </span>
                  <span className="font-semibold" data-testid="text-sentence-count">{stats.sentences}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <FaParagraph className="mr-1" /> Paragraphs:
                  </span>
                  <span className="font-semibold" data-testid="text-paragraph-count">{stats.paragraphs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lines:</span>
                  <span className="font-semibold" data-testid="text-line-count">{stats.lines}</span>
                </div>
                {stats.averageWordsPerSentence > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg words/sentence:</span>
                    <span className="font-semibold">{stats.averageWordsPerSentence}</span>
                  </div>
                )}
                {stats.averageCharsPerWord > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg chars/word:</span>
                    <span className="font-semibold">{stats.averageCharsPerWord}</span>
                  </div>
                )}
                {stats.readingTime > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <FaClock className="mr-1" /> Reading time:
                    </span>
                    <span className="font-semibold">{stats.readingTime} min</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaEye className="mr-2 text-primary" />
                  Social Media Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(socialLimits).map(([platform, limit]) => {
                  const status = getCharacterLimitStatus(limit);
                  const remaining = limit - stats.charactersWithSpaces;
                  const percentage = Math.min((stats.charactersWithSpaces / limit) * 100, 100);
                  
                  return (
                    <div key={platform} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{platform}:</span>
                        <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                          {remaining < 0 ? `${Math.abs(remaining)} over` : `${remaining} left`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${status.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Character Counter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaHashtag className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Real-time Counting</h3>
              <p className="text-sm text-muted-foreground">
                Count characters with and without spaces as you type
              </p>
            </div>
            <div className="text-center">
              <FaEye className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Social Media Limits</h3>
              <p className="text-sm text-muted-foreground">
                Check character limits for Twitter, Facebook, Instagram, and more
              </p>
            </div>
            <div className="text-center">
              <FaUpload className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">File Support</h3>
              <p className="text-sm text-muted-foreground">
                Upload TXT, PDF, Word documents, and more file formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}