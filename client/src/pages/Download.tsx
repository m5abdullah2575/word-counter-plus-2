import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FaEdit,
  FaGoogleDrive,
  FaDropbox,
  FaCloud,
  FaFacebook,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';
import { SiBox } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { getRelatedTools } from '@/lib/relatedTools';
import type { Tool } from '@/data/toolsConfig';

export default function Download() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fileData, setFileData] = useState<{
    content: string;
    filename: string;
    fileType: string;
    mimeType: string;
    sourceToolId?: string;
  } | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [customFilename, setCustomFilename] = useState('');
  const [isEditingFilename, setIsEditingFilename] = useState(false);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('downloadData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFileData(data);
        setCustomFilename(data.filename);
        
        if (data.sourceToolId) {
          const tools = getRelatedTools(data.sourceToolId, 4);
          setRelatedTools(tools);
        }
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
    return <FaFileAlt className="w-12 h-12 text-primary" />;
  };

  const getFileSize = () => {
    if (!fileData) return '0 KB';
    const bytes = new Blob([fileData.content]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const siteUrl = window.location.origin;
    const shareText = 'Check out Word Counter Plus - Free text analysis tools for writers!';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

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
    <div className="min-h-screen bg-background py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <Button
          onClick={() => setLocation('/')}
          variant="ghost"
          className="mb-3 sm:mb-4 min-h-[44px] sm:min-h-[40px]"
          data-testid="button-back-home"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="shadow-sm border">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <FaDownload className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                    Your File is Ready
                  </CardTitle>
                  {downloaded && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <FaCheckCircle className="mr-1 h-3 w-3" />
                      Downloaded
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-muted/40 rounded-lg flex-shrink-0">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditingFilename ? (
                      <div className="flex gap-2">
                        <Input
                          value={customFilename}
                          onChange={(e) => setCustomFilename(e.target.value)}
                          className="flex-1 text-sm"
                          data-testid="input-filename"
                        />
                        <Button
                          onClick={() => setIsEditingFilename(false)}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]"
                          data-testid="button-save-filename"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold truncate" data-testid="text-filename">
                          {(customFilename || fileData.filename).replace(/\.(txt|pdf|csv|docx)$/i, '')}
                        </h3>
                        <Button
                          onClick={() => setIsEditingFilename(true)}
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex-shrink-0"
                          data-testid="button-edit-filename"
                        >
                          <FaEdit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{fileData.fileType.toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground">{getFileSize()}</span>
                    </div>
                  </div>
                </div>

                {downloading && (
                  <div className="space-y-2">
                    <Progress value={downloadProgress} className="w-full h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Preparing... {downloadProgress}%
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleDownload('pdf')}
                    disabled={downloading}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-download-pdf"
                  >
                    <FaFilePdf className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">PDF</span>
                    <span className="xs:hidden">PDF</span>
                  </Button>
                  <Button
                    onClick={() => handleDownload('txt')}
                    disabled={downloading}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-download-txt"
                  >
                    <FaFileAlt className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>TXT</span>
                  </Button>
                  <Button
                    onClick={() => handleDownload('csv')}
                    disabled={downloading}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-download-csv"
                  >
                    <FaFileCsv className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>CSV</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-print"
                  >
                    <FaPrint className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Print</span>
                  </Button>
                  <Button
                    onClick={() => handleDownload()}
                    variant="default"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-download-default"
                  >
                    <FaDownload className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Download</span>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-sm">Save to Cloud</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleCloudSave('Google Drive')}
                      variant="outline"
                      className="w-full justify-start text-xs px-2 sm:px-3 min-h-[44px] sm:min-h-[36px]"
                      data-testid="button-save-google-drive"
                    >
                      <FaGoogleDrive className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Google Drive</span>
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Dropbox')}
                      variant="outline"
                      className="w-full justify-start text-xs px-2 sm:px-3 min-h-[44px] sm:min-h-[36px]"
                      data-testid="button-save-dropbox"
                    >
                      <FaDropbox className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Dropbox</span>
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('OneDrive')}
                      variant="outline"
                      className="w-full justify-start text-xs px-2 sm:px-3 min-h-[44px] sm:min-h-[36px]"
                      data-testid="button-save-onedrive"
                    >
                      <FaCloud className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">OneDrive</span>
                    </Button>
                    <Button
                      onClick={() => handleCloudSave('Box')}
                      variant="outline"
                      className="w-full justify-start text-xs px-2 sm:px-3 min-h-[44px] sm:min-h-[36px]"
                      data-testid="button-save-box"
                    >
                      <SiBox className="mr-1 sm:mr-1.5 text-primary h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Box</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold">Share Word Counter Plus</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Help others discover our free text analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleSocialShare('facebook')}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-share-facebook"
                  >
                    <FaFacebook className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Facebook</span>
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('twitter')}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-share-twitter"
                  >
                    <FaTwitter className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                    <span>Twitter</span>
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('linkedin')}
                    variant="outline"
                    className="w-full text-xs sm:text-sm min-h-[44px] sm:min-h-[36px]"
                    data-testid="button-share-linkedin"
                  >
                    <FaLinkedin className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                    <span>LinkedIn</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {relatedTools.length > 0 && (
              <Card className="shadow-sm border">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-semibold">Related Tools</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Explore more text analysis tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {relatedTools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        data-testid={`link-related-tool-${tool.id}`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group min-h-[44px]">
                          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors flex-shrink-0">
                            <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center sm:items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-xs sm:text-sm group-hover:text-primary transition-colors">
                                {tool.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 hidden sm:block">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
