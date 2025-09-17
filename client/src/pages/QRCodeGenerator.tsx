import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { apiRequest } from '@/lib/queryClient';
import QRCode from 'qrcode';
import ModernToolsSidebar from '@/components/common/ModernToolsSidebar';
import { 
  FaCopy, 
  FaEraser, 
  FaDownload,
  FaQrcode,
  FaLink,
  FaWifi,
  FaPhone,
  FaEnvelope,
  FaPalette,
  FaExpand,
  FaFileUpload,
  FaImage,
  FaFileAlt,
  FaPlus
} from 'react-icons/fa';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('text');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'QR Code Generator - Create Custom QR Codes | Word Counter Plus',
    description: 'Free QR code generator. Create custom QR codes for text, URLs, WiFi, phone numbers, and email. Download high-quality QR codes in PNG format.',
    keywords: 'QR code generator, QR code creator, custom QR codes, URL QR code, WiFi QR code, phone QR code, email QR code, free QR generator'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('qrCodeText');
    if (savedText) {
      setText(savedText);
    }
    const savedType = localStorage.getItem('qrCodeType');
    if (savedType) {
      setQrType(savedType);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qrCodeText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('qrCodeType', qrType);
  }, [qrType]);

  // QR capacity validation
  const validateQRCapacity = (content: string, errorLevel: string): boolean => {
    // Rough capacity estimates for different error correction levels
    const capacities: Record<string, number> = {
      'L': 2953, // Low: ~7% error correction
      'M': 2331, // Medium: ~15% error correction  
      'Q': 1663, // Quartile: ~25% error correction
      'H': 1273  // High: ~30% error correction
    };

    const maxCapacity = capacities[errorLevel] || capacities['M'];
    const contentBytes = new TextEncoder().encode(content).length;
    
    return contentBytes <= maxCapacity;
  };

  // QR Code generation with logo support
  const generateQRCode = async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text to generate QR code.",
        variant: "destructive",
      });
      return;
    }

    // Validate QR capacity before generation
    if (!validateQRCapacity(text, errorLevel)) {
      toast({
        title: "Content Too Large",
        description: `Content is too large for QR code with ${errorLevel} error correction. Try reducing content length, using lower error correction (L), or uploading as a file instead.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const options = {
        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
        type: 'image/png' as const,
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: size
      };

      const qrCodeDataUrl = await QRCode.toDataURL(text, options);
      
      // If logo is enabled, add it to the QR code
      if (showLogo && logoDataUrl) {
        try {
          const enhancedQR = await addLogoToQRCode(qrCodeDataUrl, logoDataUrl);
          setQrCodeDataUrl(enhancedQR);
        } catch (logoError) {
          console.warn('Logo embedding failed:', logoError);
          setQrCodeDataUrl(qrCodeDataUrl); // Use QR without logo
          toast({
            title: "Logo Embedding Failed",
            description: "QR code generated without logo. Please try a different logo image.",
            variant: "destructive",
          });
        }
      } else {
        setQrCodeDataUrl(qrCodeDataUrl);
      }

      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully!",
      });
    } catch (error) {
      console.error('QR Code generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please check your content and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add logo to QR code using proper OffscreenCanvas with fallback
  const addLogoToQRCode = async (qrDataUrl: string, logoDataUrl: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Try to use OffscreenCanvas first (modern approach)
        let canvas: OffscreenCanvas | HTMLCanvasElement;
        let ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
        
        if (typeof OffscreenCanvas !== 'undefined') {
          canvas = new OffscreenCanvas(size, size);
          ctx = canvas.getContext('2d');
        } else {
          // Fallback to DOM canvas for older browsers
          canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          ctx = canvas.getContext('2d');
        }
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Load images using createImageBitmap for OffscreenCanvas compatibility
        try {
          const qrResponse = await fetch(qrDataUrl);
          const qrBlob = await qrResponse.blob();
          const qrBitmap = await createImageBitmap(qrBlob);
          
          const logoResponse = await fetch(logoDataUrl);
          const logoBlob = await logoResponse.blob();
          const logoBitmap = await createImageBitmap(logoBlob);
          
          // Draw QR code
          ctx.drawImage(qrBitmap, 0, 0, size, size);
          
          // Draw logo with background
          const logoSize = size * 0.2; // 20% of QR code size
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;
          
          // Add white background for logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
          
          ctx.drawImage(logoBitmap, logoX, logoY, logoSize, logoSize);
          
          // Convert to blob and then to data URL
          if (canvas instanceof OffscreenCanvas) {
            const blob = await canvas.convertToBlob({ type: 'image/png' });
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
            reader.readAsDataURL(blob);
          } else {
            resolve(canvas.toDataURL('image/png'));
          }
          
          // Clean up bitmaps
          qrBitmap.close();
          logoBitmap.close();
          
        } catch (fetchError) {
          // Fallback to Image objects if fetch/createImageBitmap fails
          const qrImg = new Image();
          qrImg.onload = () => {
            ctx!.drawImage(qrImg, 0, 0, size, size);
            
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoSize = size * 0.2;
              const logoX = (size - logoSize) / 2;
              const logoY = (size - logoSize) / 2;
              
              ctx!.fillStyle = '#FFFFFF';
              ctx!.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
              ctx!.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              
              if (canvas instanceof OffscreenCanvas) {
                canvas.convertToBlob({ type: 'image/png' }).then(blob => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                });
              } else {
                resolve((canvas as HTMLCanvasElement).toDataURL('image/png'));
              }
            };
            logoImg.onerror = () => reject(new Error('Failed to load logo image'));
            logoImg.src = logoDataUrl;
          };
          qrImg.onerror = () => reject(new Error('Failed to load QR code image'));
          qrImg.src = qrDataUrl;
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // Auto-generate when text changes
  useEffect(() => {
    if (text.trim()) {
      const timeoutId = setTimeout(() => {
        generateQRCode();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setQrCodeDataUrl('');
    }
  }, [text, size, errorLevel, showLogo, logoDataUrl]);

  const clearText = () => {
    setText('');
    setQrCodeDataUrl('');
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

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) {
      toast({
        title: "No QR Code",
        description: "Generate a QR code first before downloading.",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been downloaded as a PNG file.",
    });
  };

  // QR Type templates
  const qrTypes = {
    text: {
      name: 'Plain Text',
      icon: FaQrcode,
      placeholder: 'Enter any text...',
      example: 'Word Counter Plus - The ultimate text analysis tool!'
    },
    url: {
      name: 'Website URL',
      icon: FaLink,
      placeholder: 'https://example.com',
      example: 'https://wordcounterplusapp.com'
    },
    wifi: {
      name: 'WiFi Network',
      icon: FaWifi,
      placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
      example: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
    },
    phone: {
      name: 'Phone Number',
      icon: FaPhone,
      placeholder: 'tel:+1234567890',
      example: 'tel:+923194124382'
    },
    email: {
      name: 'Email',
      icon: FaEnvelope,
      placeholder: 'mailto:example@email.com',
      example: 'mailto:wordcounterplusapp@gmail.com'
    }
  };

  const insertTemplate = (type: string) => {
    const template = qrTypes[type as keyof typeof qrTypes];
    if (template) {
      setText(template.example);
    }
  };

  // File upload handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload file to backend
      const dataUrl = await readFileAsDataURL(file);
      const base64Data = dataUrl.split(',')[1]; // Remove data:mime;base64, prefix

      const uploadData = {
        filename: `file_${Date.now()}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        data: base64Data
      };

      const response = await apiRequest('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const fullUrl = `${window.location.origin}${result.url}`;
      setText(fullUrl);

      toast({
        title: "File Uploaded",
        description: `File ${file.name} uploaded successfully. QR code will link to the file.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to server.",
        variant: "destructive",
      });
    }
  };

  // Photo upload handler (for restaurant menus, etc.)
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Image Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload photo to backend
      const dataUrl = await readFileAsDataURL(file);
      const base64Data = dataUrl.split(',')[1]; // Remove data:mime;base64, prefix

      const uploadData = {
        filename: `photo_${Date.now()}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        data: base64Data
      };

      const response = await apiRequest('/api/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const fullUrl = `${window.location.origin}${result.url}`;
      setText(fullUrl);

      toast({
        title: "Photo Uploaded",
        description: `Photo ${file.name} uploaded successfully. QR code will link to the photo.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo to server.",
        variant: "destructive",
      });
    }
  };

  // Logo upload handler
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file for the logo.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Logo Too Large",
        description: "Please select a logo image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setLogoDataUrl(dataUrl);
      setShowLogo(true);
      toast({
        title: "Logo Uploaded",
        description: "Logo will be embedded in your QR codes.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo image.",
        variant: "destructive",
      });
    }
  };

  // File reading utilities
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              QR Code Generator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create custom QR codes with file upload, photo upload, and logo embedding features
            </p>
          </div>

          {/* Input Area */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">QR Code Content</CardTitle>
                <CardDescription>
                  Choose a type and enter the content for your QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Type Selection */}
                <div>
                  <Label htmlFor="qrType" className="text-sm font-medium">QR Code Type</Label>
                  <Select value={qrType} onValueChange={setQrType}>
                    <SelectTrigger data-testid="select-qr-type" className="mt-1">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card text-foreground border rounded-md shadow-md">
                      {Object.entries(qrTypes).map(([key, type]) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center">
                              <IconComponent className="mr-2 text-sm" />
                              {type.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Templates */}
                <div>
                  <Label className="text-sm font-medium">Quick Templates</Label>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {Object.entries(qrTypes).map(([key, type]) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => insertTemplate(key)}
                          data-testid={`button-template-${key}`}
                          className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <IconComponent className="mr-1" />
                          <span className="hidden sm:inline">{type.name}</span>
                          <span className="sm:hidden">{type.name.split(' ')[0]}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <Label className="text-sm font-medium">Upload Options</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.csv,.json,.xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <FaFileUpload className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Upload File</span>
                      <span className="sm:hidden">File</span>
                    </Button>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => photoInputRef.current?.click()} 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <FaImage className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Upload Photo</span>
                      <span className="sm:hidden">Photo</span>
                    </Button>

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => logoInputRef.current?.click()} 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <FaPlus className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Add Logo</span>
                      <span className="sm:hidden">Logo</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    File: TXT/CSV/JSON/XML (max 5MB) • Photo: Images (max 10MB) • Logo: Images (max 2MB)
                  </p>
                </div>

                {/* Logo Display */}
                {showLogo && logoDataUrl && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={logoDataUrl} 
                        alt="Logo preview" 
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded"
                      />
                      <span className="text-sm font-medium">Logo will be embedded in QR code</span>
                    </div>
                    <Button 
                      onClick={() => { setLogoDataUrl(''); setShowLogo(false); }} 
                      variant="outline" 
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Text Input */}
                <div>
                  <Label htmlFor="qrText" className="text-sm font-medium">Content</Label>
                  <Textarea
                    id="qrText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={qrTypes[qrType as keyof typeof qrTypes]?.placeholder || 'Enter content...'}
                    className="min-h-[100px] sm:min-h-[120px] resize-none mt-1 text-sm"
                    data-testid="textarea-qr-input"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy" className="flex-1 sm:flex-none">
                    <FaCopy className="mr-1" />
                    Copy Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearText} data-testid="button-clear" className="flex-1 sm:flex-none">
                    <FaEraser className="mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaPalette className="mr-2 text-primary" />
                  QR Code Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Size (pixels)</Label>
                    <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                      <SelectTrigger data-testid="select-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-card text-foreground border rounded-md shadow-md">
                        <SelectItem value="128">128x128</SelectItem>
                        <SelectItem value="256">256x256</SelectItem>
                        <SelectItem value="512">512x512</SelectItem>
                        <SelectItem value="1024">1024x1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="errorLevel">Error Correction</Label>
                    <Select value={errorLevel} onValueChange={setErrorLevel}>
                      <SelectTrigger data-testid="select-error-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-card text-foreground border rounded-md shadow-md">
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="flex items-center">
                  <FaQrcode className="mr-2 text-primary" />
                  Generated QR Code
                </CardTitle>
                {qrCodeDataUrl && (
                  <Button onClick={downloadQRCode} data-testid="button-download">
                    <FaDownload className="mr-1" />
                    Download PNG
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {qrCodeDataUrl ? (
                <div className="text-center">
                  <div className="inline-block p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Generated QR Code" 
                      className="max-w-full h-auto max-h-64 sm:max-h-80 lg:max-h-96"
                      data-testid="img-qr-code"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {size}x{size} pixels • Error correction: {errorLevel}
                    {showLogo && logoDataUrl && ' • Logo embedded'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaQrcode className="text-6xl text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isGenerating ? 'Generating QR code...' : 'Enter content to generate QR code'}
                  </p>
                  {isGenerating && (
                    <div className="inline-block w-6 h-6 mt-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>


          {/* Usage Examples */}
          <div className="mt-8 lg:mt-12 bg-muted/50 rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">QR Code Examples</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <FaLink className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Website URLs</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Share links easily with QR codes for websites, social media, or landing pages
                </p>
              </div>
              <div className="text-center">
                <FaWifi className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">WiFi Networks</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Let guests connect to WiFi instantly by scanning a QR code
                </p>
              </div>
              <div className="text-center">
                <FaPhone className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Contact Information</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Share phone numbers, emails, or complete contact cards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6 xl:sticky xl:top-4 xl:h-fit">
          <ModernToolsSidebar currentTool="/qr-code-generator" />
        </div>
      </div>

      {/* Hidden elements */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileInputRef} type="file" accept=".txt,.csv,.json,.xml" className="hidden" />
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" />
    </main>
  );
}