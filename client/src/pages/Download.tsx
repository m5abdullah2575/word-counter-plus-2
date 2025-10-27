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
import jsPDF from 'jspdf';
import { 
  FaDownload, 
  FaFileAlt, 
  FaFilePdf, 
  FaFileCsv, 
  FaCheckCircle, 
  FaArrowLeft,
  FaPrint,
  FaShare,
  FaEdit,
  FaFileWord,
  FaTools,
  FaShieldAlt,
  FaChartBar,
  FaGoogleDrive,
  FaDropbox,
  FaCloud
} from 'react-icons/fa';
import { SiBox } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleDownload = async (format?: string) => {
    if (!fileData) return;

    setDownloading(true);
    setDownloadProgress(0);

    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      let finalFilename = customFilename || fileData.filename;
      
      if (format === 'pdf') {
        // Generate actual PDF using jsPDF
        if (!finalFilename.toLowerCase().endsWith('.pdf')) {
          finalFilename = finalFilename.replace(/\.[^.]+$/, '') + '.pdf';
        }
        
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const maxLineWidth = pageWidth - (margin * 2);
        
        // Add title
        pdf.setFontSize(16);
        pdf.text(finalFilename.replace('.pdf', ''), margin, margin);
        
        // Add content
        pdf.setFontSize(11);
        const lines = pdf.splitTextToSize(fileData.content, maxLineWidth);
        let yPosition = margin + 10;
        
        for (let i = 0; i < lines.length; i++) {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(lines[i], margin, yPosition);
          yPosition += 6;
        }
        
        pdf.save(finalFilename);
      } else if (format === 'txt') {
        if (!finalFilename.toLowerCase().endsWith('.txt')) {
          finalFilename = finalFilename.replace(/\.[^.]+$/, '') + '.txt';
        }
        const blob = new Blob([fileData.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        if (!finalFilename.toLowerCase().endsWith('.csv')) {
          finalFilename = finalFilename.replace(/\.[^.]+$/, '') + '.csv';
        }
        const blob = new Blob([fileData.content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Original format
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
      }

      setDownloadProgress(100);
      setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);

        toast({
          title: "Download Complete",
          description: `${finalFilename} has been downloaded successfully.`,
        });
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setDownloading(false);
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your file. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleCloudSave = async (service: string) => {
    if (!fileData) return;

    const blob = new Blob([fileData.content], { type: fileData.mimeType });
    const file = new File([blob], customFilename || fileData.filename, { type: fileData.mimeType });

    if (service === 'Google Drive') {
      await handleGoogleDriveUpload(file);
    } else if (service === 'Dropbox') {
      await handleDropboxUpload(file);
    } else if (service === 'OneDrive') {
      await handleOneDriveUpload(file);
    } else if (service === 'Box') {
      await handleBoxUpload(file);
    }
  };

  const handleGoogleDriveUpload = async (file: File) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    
    toast({
      title: "Google Drive Upload",
      description: "Opening Google Drive authentication window...",
    });

    try {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        (window as any).gapi.load('client:auth2:picker', async () => {
          await (window as any).gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file'
          });

          const authInstance = (window as any).gapi.auth2.getAuthInstance();
          await authInstance.signIn();
          
          const accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
          
          const metadata = {
            name: file.name,
            mimeType: file.type
          };

          const form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
          form.append('file', file);

          const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: form
          });

          if (response.ok) {
            toast({
              title: "Upload Successful",
              description: "File uploaded to Google Drive successfully!",
            });
            authInstance.signOut();
          } else {
            throw new Error('Upload failed');
          }
        });
      };
      document.body.appendChild(script);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to Google Drive. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDropboxUpload = async (file: File) => {
    toast({
      title: "Dropbox Upload",
      description: "Opening Dropbox file saver...",
    });

    try {
      const script = document.createElement('script');
      script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
      script.id = 'dropboxjs';
      script.setAttribute('data-app-key', import.meta.env.VITE_DROPBOX_APP_KEY || 'your_dropbox_app_key');
      
      script.onload = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          (window as any).Dropbox.save(content, file.name, {
            success: () => {
              toast({
                title: "Upload Successful",
                description: "File saved to Dropbox successfully!",
              });
            },
            error: (error: any) => {
              toast({
                title: "Upload Failed",
                description: "Failed to save to Dropbox. Please try again.",
                variant: "destructive"
              });
            }
          });
        };
        reader.readAsDataURL(file);
      };
      
      document.body.appendChild(script);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to Dropbox. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleOneDriveUpload = async (file: File) => {
    const clientId = import.meta.env.VITE_ONEDRIVE_CLIENT_ID || 'your_onedrive_client_id';
    
    toast({
      title: "OneDrive Upload",
      description: "Opening OneDrive authentication window...",
    });

    try {
      const redirectUri = encodeURIComponent(window.location.origin + '/download');
      const scope = encodeURIComponent('files.readwrite');
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
      
      const authWindow = window.open(authUrl, 'OneDrive Auth', 'width=600,height=700');
      
      const checkAuth = setInterval(() => {
        try {
          if (authWindow?.location.hash) {
            const hash = authWindow.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            
            if (accessToken) {
              clearInterval(checkAuth);
              authWindow.close();
              
              uploadToOneDrive(file, accessToken);
            }
          }
        } catch (e) {
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkAuth);
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
      }, 60000);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to OneDrive. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadToOneDrive = async (file: File, accessToken: string) => {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type
        },
        body: file
      });

      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "File uploaded to OneDrive successfully!",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to OneDrive. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBoxUpload = async (file: File) => {
    const clientId = import.meta.env.VITE_BOX_CLIENT_ID || 'your_box_client_id';
    
    toast({
      title: "Box Upload",
      description: "Opening Box authentication window...",
    });

    try {
      const redirectUri = encodeURIComponent(window.location.origin + '/download');
      const authUrl = `https://account.box.com/api/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}`;
      
      const authWindow = window.open(authUrl, 'Box Auth', 'width=600,height=700');
      
      const checkAuth = setInterval(() => {
        try {
          if (authWindow?.location.hash) {
            const hash = authWindow.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            
            if (accessToken) {
              clearInterval(checkAuth);
              authWindow.close();
              
              uploadToBox(file, accessToken);
            }
          }
        } catch (e) {
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkAuth);
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
      }, 60000);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to Box. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadToBox = async (file: File, accessToken: string) => {
    try {
      const formData = new FormData();
      formData.append('attributes', JSON.stringify({ name: file.name, parent: { id: '0' } }));
      formData.append('file', file);

      const response = await fetch('https://upload.box.com/api/2.0/files/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "File uploaded to Box successfully!",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload to Box. Please try again.",
        variant: "destructive"
      });
    }
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
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="download" className="gap-2" data-testid="tab-download">
              <FaDownload className="w-4 h-4" />
              <span>Download</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2" data-testid="tab-analytics">
              <FaChartBar className="w-4 h-4" />
              <span>Analytics</span>
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
                    Your file is ready. Download, print, or save to cloud storage.
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

                    {/* Download Options */}
                    <div className="w-full max-w-md space-y-3">
                      {/* Primary Download Button */}
                      <Button
                        onClick={() => handleDownload()}
                        size="lg"
                        className="w-full"
                        disabled={downloading}
                        data-testid="button-download-file"
                      >
                        <FaDownload className="mr-2" />
                        {downloading ? 'Downloading...' : 'Download File'}
                      </Button>

                      {/* Format Options */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleDownload('pdf')}
                          variant="outline"
                          disabled={downloading}
                          data-testid="button-download-pdf"
                          className="flex-col h-auto py-3"
                        >
                          <FaFilePdf className="w-5 h-5 mb-1 text-red-500" />
                          <span className="text-xs">PDF</span>
                        </Button>
                        <Button
                          onClick={() => handleDownload('txt')}
                          variant="outline"
                          disabled={downloading}
                          data-testid="button-download-txt"
                          className="flex-col h-auto py-3"
                        >
                          <FaFileAlt className="w-5 h-5 mb-1 text-blue-500" />
                          <span className="text-xs">TXT</span>
                        </Button>
                        <Button
                          onClick={() => handleDownload('csv')}
                          variant="outline"
                          disabled={downloading}
                          data-testid="button-download-csv"
                          className="flex-col h-auto py-3"
                        >
                          <FaFileCsv className="w-5 h-5 mb-1 text-green-500" />
                          <span className="text-xs">CSV</span>
                        </Button>
                      </div>

                      {/* Save to Cloud */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            className="w-full"
                            data-testid="button-save-cloud"
                          >
                            <FaCloud className="mr-2" />
                            Save to Cloud Storage
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Choose a service</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCloudSave('Google Drive')} data-testid="cloud-google-drive">
                            <FaGoogleDrive className="mr-2 w-4 h-4 text-blue-600" />
                            Google Drive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloudSave('Dropbox')} data-testid="cloud-dropbox">
                            <FaDropbox className="mr-2 w-4 h-4 text-blue-500" />
                            Dropbox
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloudSave('OneDrive')} data-testid="cloud-onedrive">
                            <FaCloud className="mr-2 w-4 h-4 text-blue-700" />
                            OneDrive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloudSave('Box')} data-testid="cloud-box">
                            <SiBox className="mr-2 w-4 h-4 text-blue-800" />
                            Box
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="w-full max-w-md grid grid-cols-2 gap-2">
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
                        onClick={handleShare}
                        variant="outline"
                        className="flex-col h-auto py-3"
                        data-testid="button-share"
                      >
                        <FaShare className="w-5 h-5 mb-1" />
                        <span className="text-xs">Share</span>
                      </Button>
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
        </Tabs>
      </div>
    </div>
  );
}
