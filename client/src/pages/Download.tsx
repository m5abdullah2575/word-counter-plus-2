import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    // Previous type-specific icons (commented out)
    // if (!fileData) return <FaFileAlt className="w-16 h-16 text-primary" />;
    // switch (fileData.fileType) {
    //   case 'pdf':
    //     return <FaFilePdf className="w-16 h-16 text-primary" />;
    //   case 'csv':
    //     return <FaFileCsv className="w-16 h-16 text-primary" />;
    //   case 'docx':
    //     return <FaFileWord className="w-16 h-16 text-primary" />;
    //   case 'txt':
    //   default:
    //     return <FaFileAlt className="w-16 h-16 text-primary" />;
    // }
    
    return <FaFileAlt className="w-20 h-20 text-primary" />;
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-sm border">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <FaFileAlt className="w-20 h-20 text-muted-foreground" />
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
                  Back to Tools
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

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-sm border">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <FaDownload className="text-primary" />
                      Download Your File
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Your file is ready. Download, print, or save to cloud storage.
                    </CardDescription>
                  </div>
                  {downloaded && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <FaCheckCircle className="mr-1" />
                      Downloaded
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-6 bg-muted/40 rounded-lg">
                    {getFileIcon()}
                  </div>

                  <div className="text-center space-y-2 w-full">
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
                            <FaCheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-xl font-semibold" data-testid="text-filename">
                          {(customFilename || fileData.filename).replace(/\.(txt|pdf|csv|docx)$/i, '')}
                        </h3>
                        <Button
                          onClick={() => setIsEditingFilename(true)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          data-testid="button-edit-filename"
                        >
                          <FaEdit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="outline">{fileData.fileType.toUpperCase()}</Badge>
                      <span className="text-sm text-muted-foreground">{getFileSize()}</span>
                    </div>
                  </div>
                </div>

                {downloading && (
                  <div className="space-y-2">
                    <Progress value={downloadProgress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      Preparing download... {downloadProgress}%
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Download Options</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => handleDownload('pdf')}
                      disabled={downloading}
                      variant="outline"
                      className="w-full"
                      data-testid="button-download-pdf"
                    >
                      <FaFilePdf className="mr-2 text-primary" />
                      PDF
                    </Button>
                    <Button
                      onClick={() => handleDownload('txt')}
                      disabled={downloading}
                      variant="outline"
                      className="w-full"
                      data-testid="button-download-txt"
                    >
                      <FaFileAlt className="mr-2 text-primary" />
                      TXT
                    </Button>
                    <Button
                      onClick={() => handleDownload('csv')}
                      disabled={downloading}
                      variant="outline"
                      className="w-full"
                      data-testid="button-download-csv"
                    >
                      <FaFileCsv className="mr-2 text-primary" />
                      CSV
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Additional Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full"
                      data-testid="button-print"
                    >
                      <FaPrint className="mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full"
                      data-testid="button-share"
                    >
                      <FaShare className="mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Save to Cloud</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleCloudSave('Google Drive')}
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-save-google-drive"
                    >
                      <FaGoogleDrive className="mr-2 text-primary" />
                      Google Drive
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Dropbox')}
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-save-dropbox"
                    >
                      <FaDropbox className="mr-2 text-primary" />
                      Dropbox
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('OneDrive')}
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-save-onedrive"
                    >
                      <FaCloud className="mr-2 text-primary" />
                      OneDrive
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Box')}
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-save-box"
                    >
                      <SiBox className="mr-2 text-primary" />
                      Box
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
