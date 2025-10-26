import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FaDownload, 
  FaFileAlt, 
  FaFilePdf, 
  FaFileCsv, 
  FaCheckCircle, 
  FaArrowLeft,
  FaPrint,
  FaShare,
  FaCopy,
  FaEdit,
  FaHistory,
  FaTrash,
  FaFileWord,
  FaClock,
  FaTools,
  FaShieldAlt,
  FaChartBar
} from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DownloadHistoryItem {
  filename: string;
  fileType: string;
  fileSize: string;
  timestamp: number;
  id: string;
}

export default function Download() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fileData, setFileData] = useState<{
    content: string;
    filename: string;
    fileType: string;
    mimeType: string;
  } | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [customFilename, setCustomFilename] = useState('');
  const [isEditingFilename, setIsEditingFilename] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('download');

  useEffect(() => {
    const storedData = sessionStorage.getItem('downloadData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFileData(data);
        setCustomFilename(data.filename);
      } catch (error) {
        console.error('Error parsing download data:', error);
        toast({
          title: "Error",
          description: "Failed to load download data.",
          variant: "destructive"
        });
      }
    }

    // Load download history
    const history = localStorage.getItem('downloadHistory');
    if (history) {
      try {
        setDownloadHistory(JSON.parse(history));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, [toast]);

  const getFileIcon = () => {
    if (!fileData) return <FaFileAlt className="w-20 h-20 text-primary" />;
    
    switch (fileData.fileType) {
      case 'pdf':
        return <FaFilePdf className="w-20 h-20 text-red-500" />;
      case 'csv':
        return <FaFileCsv className="w-20 h-20 text-green-500" />;
      case 'docx':
        return <FaFileWord className="w-20 h-20 text-blue-600" />;
      case 'txt':
      default:
        return <FaFileAlt className="w-20 h-20 text-blue-500" />;
    }
  };

  const getFileSize = () => {
    if (!fileData) return '0 KB';
    const bytes = new Blob([fileData.content]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileAnalytics = () => {
    if (!fileData) return null;
    
    const content = fileData.content;
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    const lines = content.split('\n').length;
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    return { words, characters, charactersNoSpaces, lines, paragraphs, sentences };
  };

  const handleDownload = async () => {
    if (!fileData) return;

    setDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Ensure filename has correct extension
    let finalFilename = customFilename || fileData.filename;
    
    // If the filename doesn't have an extension, add the original file type
    if (!finalFilename.includes('.')) {
      finalFilename = `${finalFilename}.${fileData.fileType}`;
    }
    
    const blob = new Blob([fileData.content], { type: fileData.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadProgress(100);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      
      // Add to history
      const historyItem: DownloadHistoryItem = {
        filename: finalFilename,
        fileType: fileData.fileType,
        fileSize: getFileSize(),
        timestamp: Date.now(),
        id: Date.now().toString()
      };
      
      const newHistory = [historyItem, ...downloadHistory].slice(0, 10);
      setDownloadHistory(newHistory);
      localStorage.setItem('downloadHistory', JSON.stringify(newHistory));

      toast({
        title: "Download Complete",
        description: `${finalFilename} has been downloaded successfully.`,
      });
    }, 500);
  };

  const handlePrint = () => {
    if (!fileData) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${fileData.filename}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <h2>${fileData.filename}</h2>
            <pre>${fileData.content}</pre>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    toast({
      title: "Print Dialog Opened",
      description: "Your document is ready to print.",
    });
  };

  const handleCopyContent = () => {
    if (!fileData) return;
    
    navigator.clipboard.writeText(fileData.content).then(() => {
      toast({
        title: "Copied!",
        description: "File content copied to clipboard.",
      });
    });
  };

  const handleShare = () => {
    if (!fileData) return;

    if (navigator.share) {
      navigator.share({
        title: fileData.filename,
        text: fileData.content.substring(0, 200) + '...',
      }).catch(err => console.error('Error sharing:', err));
    } else {
      toast({
        title: "Share via Email",
        description: "Opening your email client...",
      });
      
      const subject = encodeURIComponent(`Check out this file: ${fileData.filename}`);
      const body = encodeURIComponent(fileData.content.substring(0, 500) + '\n\n...');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem('downloadHistory');
    setShowClearHistoryDialog(false);
    toast({
      title: "History Cleared",
      description: "Download history has been cleared.",
    });
  };

  const removeHistoryItem = (id: string) => {
    const newHistory = downloadHistory.filter(item => item.id !== id);
    setDownloadHistory(newHistory);
    localStorage.setItem('downloadHistory', JSON.stringify(newHistory));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getRelatedTools = () => {
    const tools = [
      { name: 'Word Counter', path: '/', icon: '📝' },
      { name: 'Character Counter', path: '/character-counter', icon: '🔤' },
      { name: 'Text Case Converter', path: '/text-case-converter', icon: '🔄' },
      { name: 'Grammar Checker', path: '/grammar-checker', icon: '✓' },
      { name: 'Readability Calculator', path: '/readability-calculator', icon: '📊' },
    ];
    return tools;
  };

  const analytics = getFileAnalytics();

  if (!fileData) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <FaFileAlt className="w-24 h-24 text-muted-foreground/30" />
                <h2 className="text-2xl font-bold">No File to Download</h2>
                <p className="text-muted-foreground max-w-md">
                  No download data found. Please use one of our tools to generate a file first.
                </p>
                <Button
                  onClick={() => setLocation('/')}
                  size="lg"
                  className="mt-4"
                  data-testid="button-go-home"
                >
                  <FaArrowLeft className="mr-2" />
                  Go to Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          onClick={() => setLocation('/')}
          variant="ghost"
          className="mb-6"
          data-testid="button-back-home"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="download" className="gap-2" data-testid="tab-download">
              <FaDownload className="w-4 h-4" />
              <span>Download</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2" data-testid="tab-analytics">
              <FaChartBar className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
              <FaHistory className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          {/* Download Tab */}
          <TabsContent value="download" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Download Card */}
              <Card className="shadow-lg lg:col-span-2">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <FaDownload className="text-primary" />
                    Download Your File
                  </CardTitle>
                  <CardDescription>
                    Your file is ready. Choose your preferred format and download options below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-6">
                    {/* File Icon */}
                    <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                      {getFileIcon()}
                    </div>

                    {/* File Info */}
                    <div className="text-center space-y-3 w-full">
                      {isEditingFilename ? (
                        <div className="space-y-2">
                          <Label htmlFor="filename">Filename</Label>
                          <div className="flex gap-2 max-w-md mx-auto">
                            <Input
                              id="filename"
                              value={customFilename}
                              onChange={(e) => setCustomFilename(e.target.value)}
                              className="flex-1"
                              data-testid="input-filename"
                            />
                            <Button
                              onClick={() => setIsEditingFilename(false)}
                              variant="outline"
                              size="icon"
                              data-testid="button-save-filename"
                            >
                              <FaCheckCircle />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground break-all px-4" data-testid="text-filename">
                            {customFilename}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditingFilename(true)}
                            data-testid="button-edit-filename"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="secondary" className="text-sm">
                          {getFileSize()}
                        </Badge>
                        <Badge variant="secondary" className="text-sm uppercase">
                          {fileData.fileType}
                        </Badge>
                        {analytics && (
                          <Badge variant="secondary" className="text-sm">
                            {analytics.words.toLocaleString()} words
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Download Progress */}
                    {downloading && (
                      <div className="w-full max-w-md space-y-2">
                        <Progress value={downloadProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          Downloading... {downloadProgress}%
                        </p>
                      </div>
                    )}

                    {/* Download Success */}
                    {downloaded && !downloading && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-6 py-3 rounded-lg" data-testid="text-download-success">
                        <FaCheckCircle className="w-6 h-6" />
                        <span className="font-semibold">Download Complete!</span>
                      </div>
                    )}

                    {/* Download Button */}
                    <div className="w-full max-w-md">
                      <Button
                        onClick={() => handleDownload()}
                        size="lg"
                        className="w-full"
                        disabled={downloading}
                        data-testid="button-download-file"
                      >
                        <FaDownload className="mr-2" />
                        {downloading ? 'Downloading...' : 'Download Now'}
                      </Button>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="w-full max-w-md grid grid-cols-3 gap-2">
                      <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="flex-col h-auto py-3"
                        data-testid="button-print"
                      >
                        <FaPrint className="w-5 h-5 mb-1" />
                        <span className="text-xs">Print</span>
                      </Button>
                      <Button
                        onClick={handleCopyContent}
                        variant="outline"
                        className="flex-col h-auto py-3"
                        data-testid="button-copy"
                      >
                        <FaCopy className="w-5 h-5 mb-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="flex-col h-auto py-3"
                        data-testid="button-share"
                      >
                        <FaShare className="w-5 h-5 mb-1" />
                        <span className="text-xs">Share</span>
                      </Button>
                    </div>

                    {/* File Preview */}
                    <div className="w-full">
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">File Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="max-h-64 overflow-y-auto text-sm text-muted-foreground font-mono bg-background p-4 rounded border" data-testid="text-file-preview">
                            {fileData.content.substring(0, 1000)}
                            {fileData.content.length > 1000 && (
                              <span className="text-primary">... (truncated)</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Security Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FaShieldAlt className="text-green-600 dark:text-green-400" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>Your files are processed locally in your browser</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>No data is sent to any server</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>Files are automatically deleted after download</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Tools */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FaTools className="text-primary" />
                      Related Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getRelatedTools().map((tool) => (
                      <Link key={tool.path} href={tool.path}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <span className="mr-2">{tool.icon}</span>
                          {tool.name}
                        </Button>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <FaChartBar className="text-primary" />
                  File Analytics
                </CardTitle>
                <CardDescription>
                  Detailed statistics and metrics for your file
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Words</p>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="stat-words">
                            {analytics.words.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Characters</p>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="stat-characters">
                            {analytics.characters.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Characters (No Spaces)</p>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400" data-testid="stat-characters-no-spaces">
                            {analytics.charactersNoSpaces.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Lines</p>
                          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400" data-testid="stat-lines">
                            {analytics.lines.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Paragraphs</p>
                          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400" data-testid="stat-paragraphs">
                            {analytics.paragraphs.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Sentences</p>
                          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400" data-testid="stat-sentences">
                            {analytics.sentences.toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">File Size</p>
                          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400" data-testid="stat-filesize">
                            {getFileSize()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Word Length</p>
                          <p className="text-3xl font-bold text-red-600 dark:text-red-400" data-testid="stat-avg-word-length">
                            {analytics.words > 0 ? (analytics.charactersNoSpaces / analytics.words).toFixed(1) : '0'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Reading Time</p>
                          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="stat-reading-time">
                            {Math.ceil(analytics.words / 200)} min
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <FaHistory className="text-primary" />
                      Download History
                    </CardTitle>
                    <CardDescription>
                      Your recent downloads (last 10)
                    </CardDescription>
                  </div>
                  {downloadHistory.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowClearHistoryDialog(true)}
                      data-testid="button-clear-history"
                    >
                      <FaTrash className="mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {downloadHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FaClock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Download History</h3>
                    <p className="text-muted-foreground">
                      Your download history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadHistory.map((item) => (
                      <Card key={item.id} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {item.fileType === 'pdf' && <FaFilePdf className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />}
                              {item.fileType === 'csv' && <FaFileCsv className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />}
                              {(item.fileType === 'txt' || item.fileType === 'text') && <FaFileAlt className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />}
                              {item.fileType === 'docx' && <FaFileWord className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />}
                              {!['pdf', 'csv', 'txt', 'text', 'docx'].includes(item.fileType) && <FaFileAlt className="w-8 h-8 text-gray-500 flex-shrink-0 mt-1" />}
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate" data-testid={`history-filename-${item.id}`}>
                                  {item.filename}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {item.fileSize}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs uppercase">
                                    {item.fileType}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    {formatDate(item.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeHistoryItem(item.id)}
                              className="flex-shrink-0"
                              data-testid={`button-delete-history-${item.id}`}
                            >
                              <FaTrash className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Clear History Dialog */}
      <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Download History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all download history records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearHistory} data-testid="button-confirm-clear">
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
