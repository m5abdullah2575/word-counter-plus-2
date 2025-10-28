import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import jsPDF from 'jspdf';
import { 
  Download as DownloadIcon, 
  FileText, 
  File, 
  FileSpreadsheet, 
  CheckCircle2, 
  ArrowLeft,
  Printer,
  Share2,
  Edit3,
  FileType,
  Shield,
  BarChart3,
  Cloud,
  Sparkles,
  FileCheck,
  Zap
} from 'lucide-react';
import { FaGoogleDrive, FaDropbox } from 'react-icons/fa';
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
  const [customFilename, setCustomFilename] = useState('');
  const [isEditingFilename, setIsEditingFilename] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

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
    if (!fileData) return <FileText className="w-16 h-16 text-primary" />;
    
    switch (fileData.fileType) {
      case 'pdf':
        return <File className="w-16 h-16 text-red-500" />;
      case 'csv':
        return <FileSpreadsheet className="w-16 h-16 text-green-500" />;
      case 'docx':
        return <FileType className="w-16 h-16 text-blue-600" />;
      case 'txt':
      default:
        return <FileText className="w-16 h-16 text-blue-500" />;
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

    try {
      let finalFilename = customFilename || fileData.filename;
      
      if (format === 'pdf') {
        if (!finalFilename.toLowerCase().endsWith('.pdf')) {
          finalFilename = finalFilename.replace(/\.[^.]+$/, '') + '.pdf';
        }
        
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const maxLineWidth = pageWidth - (margin * 2);
        
        pdf.setFontSize(16);
        pdf.text(finalFilename.replace('.pdf', ''), margin, margin);
        
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

      setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);

        toast({
          title: "Download Complete",
          description: `${finalFilename} has been downloaded successfully.`,
        });
      }, 500);
    } catch (error) {
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
    const file = new (File as any)([blob], customFilename || fileData.filename, { type: fileData.mimeType });

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

  const analytics = getFileAnalytics();

  if (!fileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-12">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full">
                <FileText className="w-20 h-20 text-primary" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                No File Available
              </h2>
              <p className="text-muted-foreground max-w-md text-lg">
                Generate a file using one of our tools to get started with downloading.
              </p>
              <Button
                onClick={() => setLocation('/')}
                size="lg"
                className="mt-6 shadow-lg hover:shadow-xl transition-all"
                data-testid="button-go-home"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button
          onClick={() => setLocation('/')}
          variant="ghost"
          className="mb-8 hover:bg-white/50 dark:hover:bg-gray-900/50"
          data-testid="button-back-home"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      {getFileIcon()}
                    </div>
                    <div>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        {fileData.fileType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {downloaded && (
                    <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Downloaded</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {isEditingFilename ? (
                    <div className="flex gap-2">
                      <Input
                        value={customFilename}
                        onChange={(e) => setCustomFilename(e.target.value)}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60"
                        data-testid="input-filename"
                      />
                      <Button
                        onClick={() => setIsEditingFilename(false)}
                        variant="secondary"
                        size="icon"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        data-testid="button-save-filename"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-white truncate">
                        {customFilename || fileData.filename}
                      </h1>
                      <Button
                        onClick={() => setIsEditingFilename(true)}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        data-testid="button-edit-filename"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-white/80 text-lg">{getFileSize()}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleDownload()}
                      disabled={downloading}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 shadow-lg"
                      data-testid="button-download-original"
                    >
                      <DownloadIcon className="mr-2 w-5 h-5" />
                      {downloading ? 'Downloading...' : 'Download'}
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="lg"
                      className="border-2"
                      data-testid="button-print"
                    >
                      <Printer className="mr-2 w-5 h-5" />
                      Print
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Export Formats</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => handleDownload('pdf')}
                      variant="outline"
                      className="flex-col h-auto py-4"
                      data-testid="button-download-pdf"
                    >
                      <File className="w-6 h-6 mb-2 text-red-500" />
                      <span className="text-sm">PDF</span>
                    </Button>
                    <Button
                      onClick={() => handleDownload('txt')}
                      variant="outline"
                      className="flex-col h-auto py-4"
                      data-testid="button-download-txt"
                    >
                      <FileText className="w-6 h-6 mb-2 text-blue-500" />
                      <span className="text-sm">TXT</span>
                    </Button>
                    <Button
                      onClick={() => handleDownload('csv')}
                      variant="outline"
                      className="flex-col h-auto py-4"
                      data-testid="button-download-csv"
                    >
                      <FileSpreadsheet className="w-6 h-6 mb-2 text-green-500" />
                      <span className="text-sm">CSV</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-primary" />
                    Cloud Storage
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleCloudSave('Google Drive')}
                      variant="outline"
                      className="justify-start"
                      data-testid="button-save-google-drive"
                    >
                      <FaGoogleDrive className="mr-2 w-5 h-5 text-blue-500" />
                      Google Drive
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Dropbox')}
                      variant="outline"
                      className="justify-start"
                      data-testid="button-save-dropbox"
                    >
                      <FaDropbox className="mr-2 w-5 h-5 text-blue-600" />
                      Dropbox
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('OneDrive')}
                      variant="outline"
                      className="justify-start"
                      data-testid="button-save-onedrive"
                    >
                      <Cloud className="mr-2 w-5 h-5 text-blue-400" />
                      OneDrive
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Box')}
                      variant="outline"
                      className="justify-start"
                      data-testid="button-save-box"
                    >
                      <SiBox className="mr-2 w-5 h-5 text-blue-700" />
                      Box
                    </Button>
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-2"
                  data-testid="button-share"
                >
                  <Share2 className="mr-2 w-5 h-5" />
                  Share File
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  File Analytics
                </h3>
              </div>
              
              {analytics && (
                <div className="p-6 space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Words</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400" data-testid="stat-words">
                      {analytics.words.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Characters</p>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400" data-testid="stat-characters">
                      {analytics.characters.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-2xl p-4 border border-pink-200 dark:border-pink-800">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Lines</p>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400" data-testid="stat-lines">
                        {analytics.lines.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Paragraphs</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400" data-testid="stat-paragraphs">
                        {analytics.paragraphs.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 rounded-2xl p-5 border border-teal-200 dark:border-teal-800">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Reading Time</p>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400" data-testid="stat-reading-time">
                      {Math.ceil(analytics.words / 200)} min
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Save your file to cloud storage for easy access across all your devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
