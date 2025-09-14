import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaClock,
  FaMicrophone,
  FaBook,
  FaUserGraduate,
  FaEye,
  FaChartLine,
  FaUsers,
  FaBaby
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';

export default function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [customReadingSpeed, setCustomReadingSpeed] = useState(200);
  const [customSpeakingSpeed, setCustomSpeakingSpeed] = useState(150);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'Reading Time Calculator - Estimate Reading & Speaking Time | Word Counter Plus',
    description: 'Free reading time calculator. Calculate how long it takes to read text aloud or silently. Perfect for speeches, presentations, articles, and content planning.',
    keywords: 'reading time calculator, reading time estimator, speech time calculator, presentation timer, words per minute, reading speed, speaking time'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('readingTimeText');
    if (savedText) {
      setText(savedText);
    }
    const savedReadingSpeed = localStorage.getItem('customReadingSpeed');
    if (savedReadingSpeed) {
      setCustomReadingSpeed(parseInt(savedReadingSpeed));
    }
    const savedSpeakingSpeed = localStorage.getItem('customSpeakingSpeed');
    if (savedSpeakingSpeed) {
      setCustomSpeakingSpeed(parseInt(savedSpeakingSpeed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('readingTimeText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('customReadingSpeed', customReadingSpeed.toString());
  }, [customReadingSpeed]);

  useEffect(() => {
    localStorage.setItem('customSpeakingSpeed', customSpeakingSpeed.toString());
  }, [customSpeakingSpeed]);

  // Calculate word count and statistics
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, '').length;

  // Reading speed presets (words per minute)
  const readingSpeeds = {
    slow: 150,          // Slow reader
    average: 200,       // Average adult
    fast: 300,          // Fast reader
    speed: 400,         // Speed reader
    child: 100,         // Elementary school child
    custom: customReadingSpeed
  };

  // Speaking speed presets (words per minute)
  const speakingSpeeds = {
    slow: 120,          // Slow speech
    conversational: 150, // Normal conversation
    presentation: 160,   // Presentation pace
    fast: 180,          // Fast speech
    podcast: 170,       // Podcast speed
    custom: customSpeakingSpeed
  };

  // Calculate reading times
  const readingTimes = Object.entries(readingSpeeds).reduce((acc, [key, speed]) => {
    const minutes = wordCount / speed;
    const totalSeconds = Math.round(minutes * 60);
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = totalSeconds % 60;
    
    acc[key] = {
      minutes: Math.round(minutes * 10) / 10,
      display: displayMinutes > 0 
        ? `${displayMinutes}m ${displaySeconds}s`
        : `${displaySeconds}s`
    };
    return acc;
  }, {} as Record<string, { minutes: number; display: string }>);

  // Calculate speaking times
  const speakingTimes = Object.entries(speakingSpeeds).reduce((acc, [key, speed]) => {
    const minutes = wordCount / speed;
    const totalSeconds = Math.round(minutes * 60);
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = totalSeconds % 60;
    
    acc[key] = {
      minutes: Math.round(minutes * 10) / 10,
      display: displayMinutes > 0 
        ? `${displayMinutes}m ${displaySeconds}s`
        : `${displaySeconds}s`
    };
    return acc;
  }, {} as Record<string, { minutes: number; display: string }>);

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
    const analysisText = `
Reading Time Analysis
=====================

Text Statistics:
- Words: ${wordCount}
- Characters: ${characterCount}
- Characters (no spaces): ${characterCountNoSpaces}

Reading Times:
- Slow reader (${readingSpeeds.slow} WPM): ${readingTimes.slow.display}
- Average reader (${readingSpeeds.average} WPM): ${readingTimes.average.display}
- Fast reader (${readingSpeeds.fast} WPM): ${readingTimes.fast.display}
- Speed reader (${readingSpeeds.speed} WPM): ${readingTimes.speed.display}

Speaking Times:
- Slow speech (${speakingSpeeds.slow} WPM): ${speakingTimes.slow.display}
- Conversational (${speakingSpeeds.conversational} WPM): ${speakingTimes.conversational.display}
- Presentation (${speakingSpeeds.presentation} WPM): ${speakingTimes.presentation.display}
- Fast speech (${speakingSpeeds.fast} WPM): ${speakingTimes.fast.display}

Original Text:
==============
${text}
    `;

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reading-time-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Downloaded",
      description: "Your reading time analysis has been downloaded as a TXT file.",
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
            Reading Time Calculator
          </h1>
          <p className="text-xl text-muted-foreground">
            Calculate reading and speaking time for your text content
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
                      Type, paste, or upload text to calculate reading time
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
                  placeholder="Start typing or paste your text here to calculate reading time..."
                  className="min-h-[300px] resize-none"
                  data-testid="textarea-reading-time-input"
                />
                
                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                      <FaCopy className="mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadText} data-testid="button-download">
                      <FaDownload className="mr-1" />
                      Download Analysis
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {wordCount} words
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Speed Settings */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Custom Speed Settings</CardTitle>
                <CardDescription>
                  Adjust reading and speaking speeds to match your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="readingSpeed">Custom Reading Speed (WPM)</Label>
                    <Input
                      id="readingSpeed"
                      type="number"
                      value={customReadingSpeed}
                      onChange={(e) => setCustomReadingSpeed(parseInt(e.target.value) || 200)}
                      min="50"
                      max="1000"
                      className="mt-1"
                      data-testid="input-reading-speed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speakingSpeed">Custom Speaking Speed (WPM)</Label>
                    <Input
                      id="speakingSpeed"
                      type="number"
                      value={customSpeakingSpeed}
                      onChange={(e) => setCustomSpeakingSpeed(parseInt(e.target.value) || 150)}
                      min="50"
                      max="500"
                      className="mt-1"
                      data-testid="input-speaking-speed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaBook className="mr-2 text-primary" />
                  Text Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words:</span>
                  <span className="font-bold text-xl text-primary" data-testid="text-word-count">
                    {wordCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-semibold">{characterCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters (no spaces):</span>
                  <span className="font-semibold">{characterCountNoSpaces}</span>
                </div>
              </CardContent>
            </Card>

            {/* Reading Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaEye className="mr-2 text-primary" />
                  Reading Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <FaBaby className="mr-1 text-xs" /> Child reader:
                  </span>
                  <span className="font-semibold" data-testid="text-reading-child">
                    {readingTimes.child.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slow reader:</span>
                  <span className="font-semibold" data-testid="text-reading-slow">
                    {readingTimes.slow.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average reader:</span>
                  <span className="font-bold text-green-600" data-testid="text-reading-average">
                    {readingTimes.average.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fast reader:</span>
                  <span className="font-semibold" data-testid="text-reading-fast">
                    {readingTimes.fast.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed reader:</span>
                  <span className="font-semibold" data-testid="text-reading-speed">
                    {readingTimes.speed.display}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Custom speed:</span>
                  <span className="font-bold text-blue-600" data-testid="text-reading-custom">
                    {readingTimes.custom.display}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Speaking Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaMicrophone className="mr-2 text-primary" />
                  Speaking Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slow speech:</span>
                  <span className="font-semibold" data-testid="text-speaking-slow">
                    {speakingTimes.slow.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversational:</span>
                  <span className="font-bold text-green-600" data-testid="text-speaking-conversational">
                    {speakingTimes.conversational.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Presentation:</span>
                  <span className="font-semibold" data-testid="text-speaking-presentation">
                    {speakingTimes.presentation.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Podcast:</span>
                  <span className="font-semibold" data-testid="text-speaking-podcast">
                    {speakingTimes.podcast.display}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fast speech:</span>
                  <span className="font-semibold" data-testid="text-speaking-fast">
                    {speakingTimes.fast.display}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Custom speed:</span>
                  <span className="font-bold text-blue-600" data-testid="text-speaking-custom">
                    {speakingTimes.custom.display}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Reading Time Calculator Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaClock className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Multiple Reading Speeds</h3>
              <p className="text-sm text-muted-foreground">
                Calculate reading time for different reader types and speeds
              </p>
            </div>
            <div className="text-center">
              <FaMicrophone className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Speaking Time Estimates</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for speeches, presentations, and podcast planning
              </p>
            </div>
            <div className="text-center">
              <FaChartLine className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Custom Speed Settings</h3>
              <p className="text-sm text-muted-foreground">
                Set your own reading and speaking speeds for personalized results
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}