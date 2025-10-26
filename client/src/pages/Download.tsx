import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaDownload, FaFileAlt, FaFilePdf, FaFileCsv, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storedData = sessionStorage.getItem('downloadData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFileData(data);
      } catch (error) {
        console.error('Error parsing download data:', error);
        toast({
          title: "Error",
          description: "Failed to load download data.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "No File to Download",
        description: "No download data found. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDownload = () => {
    if (!fileData) return;

    const blob = new Blob([fileData.content], { type: fileData.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    toast({
      title: "Download Complete",
      description: `${fileData.filename} has been downloaded successfully.`,
    });

    sessionStorage.removeItem('downloadData');
  };

  const getFileIcon = () => {
    if (!fileData) return <FaFileAlt className="w-16 h-16 text-primary" />;
    
    switch (fileData.fileType) {
      case 'pdf':
        return <FaFilePdf className="w-16 h-16 text-red-500" />;
      case 'csv':
        return <FaFileCsv className="w-16 h-16 text-green-500" />;
      case 'txt':
      default:
        return <FaFileAlt className="w-16 h-16 text-blue-500" />;
    }
  };

  const getFileSize = () => {
    if (!fileData) return '0 KB';
    const bytes = new Blob([fileData.content]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          onClick={() => setLocation('/')}
          variant="ghost"
          className="mb-6"
          data-testid="button-back-home"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl font-bold">Download Your File</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-6 bg-muted rounded-full">
                {getFileIcon()}
              </div>

              {fileData ? (
                <>
                  <div className="text-center space-y-2 w-full">
                    <h3 className="text-xl font-semibold text-foreground break-all px-4" data-testid="text-filename">
                      {fileData.filename}
                    </h3>
                    <p className="text-muted-foreground">
                      File Size: <span className="font-medium" data-testid="text-filesize">{getFileSize()}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Type: <span className="font-medium uppercase" data-testid="text-filetype">{fileData.fileType}</span>
                    </p>
                  </div>

                  {!downloaded ? (
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="w-full max-w-sm mt-4"
                      data-testid="button-download-file"
                    >
                      <FaDownload className="mr-2" />
                      Download Now
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400" data-testid="text-download-success">
                      <FaCheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Download Complete!</span>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg w-full">
                    <h4 className="font-semibold mb-2 text-sm">Preview:</h4>
                    <div className="max-h-48 overflow-y-auto text-xs text-muted-foreground font-mono bg-background p-3 rounded border" data-testid="text-file-preview">
                      {fileData.content.substring(0, 500)}
                      {fileData.content.length > 500 && '...'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">No file data available</p>
                  <Button
                    onClick={() => setLocation('/')}
                    data-testid="button-go-home"
                  >
                    Go to Home
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Your file is ready to download. Click the button above to save it to your device.</p>
        </div>
      </div>
    </div>
  );
}
