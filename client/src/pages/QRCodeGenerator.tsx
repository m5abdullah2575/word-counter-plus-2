import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
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
  FaPlus,
  FaTrash,
  FaSave,
  FaEye,
  FaMagic,
  FaCloudUploadAlt
} from 'react-icons/fa';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('text');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [margin, setMargin] = useState(4);
  const [showLogo, setShowLogo] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [templates, setTemplates] = useState<Array<{id: string, name: string, content: string, type: string}>>([]);
  const [batchTexts, setBatchTexts] = useState<string[]>(['']);
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
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
    
    // Load saved templates
    const savedTemplates = localStorage.getItem('qr-templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.warn('Failed to load saved templates');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('qrCodeText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('qrCodeType', qrType);
  }, [qrType]);

  // Enhanced QR Code generation with logo support
  const generateQRCode = async (customText?: string) => {
    const textToUse = customText || text;
    if (!textToUse.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text to generate QR code.",
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
        margin: margin,
        color: {
          dark: darkColor,
          light: lightColor
        },
        width: size
      };

      const qrCodeDataUrl = await QRCode.toDataURL(textToUse, options);
      
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

  // Add logo to QR code
  const addLogoToQRCode = async (qrDataUrl: string, logoDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create an offscreen canvas for logo embedding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = size;
      canvas.height = size;
      
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0, size, size);
        
        const logoImg = new Image();
        logoImg.onload = () => {
          try {
            const logoSize = size * 0.2; // 20% of QR code size
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            
            // Add white background for logo
            ctx.fillStyle = lightColor;
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            resolve(canvas.toDataURL('image/png'));
          } catch (error) {
            reject(error);
          }
        };
        logoImg.onerror = () => reject(new Error('Failed to load logo image'));
        logoImg.src = logoDataUrl;
      };
      qrImg.onerror = () => reject(new Error('Failed to load QR code image'));
      qrImg.src = qrDataUrl;
    });
  };

  // Auto-generate when text or settings change
  useEffect(() => {
    if (text.trim()) {
      const timeoutId = setTimeout(() => {
        generateQRCode();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setQrCodeDataUrl('');
    }
  }, [text, size, errorLevel, darkColor, lightColor, margin, showLogo, logoDataUrl]);

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
      const fileContent = await readFileAsText(file);
      setText(fileContent);
      toast({
        title: "File Uploaded",
        description: `Content from ${file.name} loaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to read file content.",
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
    <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
        {/* Main Tool Area */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              QR Code Generator
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
              Create professional QR codes with advanced features including file uploads, logo embedding, color customization, and batch generation
            </p>
          </div>

          {/* Enhanced Tabs Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">
                <FaQrcode className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs sm:text-sm">
                <FaPalette className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="text-xs sm:text-sm">
                <FaCloudUploadAlt className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="batch" className="text-xs sm:text-sm">
                <FaMagic className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Batch</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Input Area */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl">QR Code Content</CardTitle>
                      <CardDescription className="text-sm">
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(qrTypes).map(([key, type]) => {
                            const IconComponent = type.icon;
                            return (
                              <Button
                                key={key}
                                variant="outline"
                                size="sm"
                                onClick={() => insertTemplate(key)}
                                data-testid={`button-template-${key}`}
                                className="flex-shrink-0 text-xs sm:text-sm"
                              >
                                <IconComponent className="mr-1" />
                                <span className="hidden sm:inline">{type.name}</span>
                                <span className="sm:hidden">{type.name.split(' ')[0]}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Text Input */}
                      <div>
                        <Label htmlFor="qrText" className="text-sm font-medium">Content</Label>
                        <Textarea
                          id="qrText"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={qrTypes[qrType as keyof typeof qrTypes]?.placeholder || 'Enter content...'}
                          className="min-h-[120px] sm:min-h-[140px] resize-none mt-1 text-sm"
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
                </div>

                {/* QR Code Display */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <CardTitle className="flex items-center text-lg sm:text-xl">
                          <FaQrcode className="mr-2 text-primary" />
                          Generated QR Code
                        </CardTitle>
                        {qrCodeDataUrl && (
                          <Button onClick={downloadQRCode} data-testid="button-download" size="sm">
                            <FaDownload className="mr-1" />
                            Download PNG
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {qrCodeDataUrl ? (
                        <div className="text-center">
                          <div className="inline-block p-3 sm:p-4 bg-white rounded-lg shadow-sm border mx-auto">
                            <img 
                              src={qrCodeDataUrl} 
                              alt="Generated QR Code" 
                              className="max-w-full h-auto max-h-64 sm:max-h-80 lg:max-h-96"
                              data-testid="img-qr-code"
                            />
                          </div>
                          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                            <p>{size}x{size} pixels • Error correction: {errorLevel}</p>
                            {showLogo && logoDataUrl && <p className="mt-1">Logo embedded</p>}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12">
                          <FaQrcode className="text-4xl sm:text-5xl lg:text-6xl text-muted-foreground mx-auto mb-3 sm:mb-4" />
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {isGenerating ? 'Generating QR code...' : 'Enter content to generate QR code'}
                          </p>
                          {isGenerating && (
                            <div className="inline-block w-5 h-5 sm:w-6 sm:h-6 mt-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4">
                  {/* Size and Error Correction */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl">Size & Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="size" className="text-sm font-medium">Size (pixels)</Label>
                          <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                            <SelectTrigger data-testid="select-size" className="mt-1">
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
                          <Label htmlFor="errorLevel" className="text-sm font-medium">Error Correction</Label>
                          <Select value={errorLevel} onValueChange={setErrorLevel}>
                            <SelectTrigger data-testid="select-error-level" className="mt-1">
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
                      
                      <div>
                        <Label className="text-sm font-medium">Margin: {margin}</Label>
                        <Slider
                          value={[margin]}
                          onValueChange={(value) => setMargin(value[0])}
                          max={10}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colors */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl">Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="darkColor" className="text-sm font-medium">Foreground Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="darkColor"
                              type="color"
                              value={darkColor}
                              onChange={(e) => setDarkColor(e.target.value)}
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={darkColor}
                              onChange={(e) => setDarkColor(e.target.value)}
                              placeholder="#000000"
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="lightColor" className="text-sm font-medium">Background Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="lightColor"
                              type="color"
                              value={lightColor}
                              onChange={(e) => setLightColor(e.target.value)}
                              className="w-12 h-10 p-1 border rounded"
                            />
                            <Input
                              value={lightColor}
                              onChange={(e) => setLightColor(e.target.value)}
                              placeholder="#FFFFFF"
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Logo Section */}
                <div>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl">Logo Embedding</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showLogo"
                          checked={showLogo}
                          onCheckedChange={setShowLogo}
                        />
                        <Label htmlFor="showLogo" className="text-sm font-medium">
                          Add logo to QR code
                        </Label>
                      </div>

                      {showLogo && (
                        <div>
                          <Label className="text-sm font-medium">Upload Logo</Label>
                          <div className="mt-2 space-y-2">
                            <input
                              ref={logoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    toast({
                                      title: "File Too Large",
                                      description: "Please select an image smaller than 2MB.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  const dataUrl = await readFileAsDataURL(file);
                                  setLogoDataUrl(dataUrl);
                                }
                              }}
                              className="hidden"
                            />
                            <Button 
                              onClick={() => logoInputRef.current?.click()} 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                            >
                              <FaImage className="mr-2" />
                              Choose Logo Image
                            </Button>
                            {logoDataUrl && (
                              <div className="text-center">
                                <img 
                                  src={logoDataUrl} 
                                  alt="Logo preview" 
                                  className="w-16 h-16 object-contain mx-auto rounded border"
                                />
                                <Button 
                                  onClick={() => { setLogoDataUrl(''); setShowLogo(false); }} 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-2"
                                >
                                  Remove Logo
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">File Upload</CardTitle>
                    <CardDescription className="text-sm">
                      Upload text files to generate QR codes from file content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      className="w-full"
                    >
                      <FaFileUpload className="mr-2" />
                      Upload Text File
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: TXT, CSV, JSON, XML (max 5MB)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Template Management</CardTitle>
                    <CardDescription className="text-sm">
                      Save and manage your QR code templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          if (!text.trim()) {
                            toast({
                              title: "No Content",
                              description: "Please enter content to save as template.",
                              variant: "destructive",
                            });
                            return;
                          }
                          const templateName = prompt('Enter template name:');
                          if (!templateName) return;
                          const newTemplate = {
                            id: Date.now().toString(),
                            name: templateName,
                            content: text,
                            type: qrType
                          };
                          const updatedTemplates = [...templates, newTemplate];
                          setTemplates(updatedTemplates);
                          localStorage.setItem('qr-templates', JSON.stringify(updatedTemplates));
                          toast({
                            title: "Template Saved",
                            description: `Template "${templateName}" has been saved.`,
                          });
                        }}
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        <FaSave className="mr-2" />
                        Save Template
                      </Button>
                    </div>
                    
                    {templates.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {templates.map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium truncate flex-1 mr-2">{template.name}</span>
                            <div className="flex gap-1">
                              <Button 
                                onClick={() => {
                                  setText(template.content);
                                  setQrType(template.type);
                                  toast({
                                    title: "Template Loaded",
                                    description: `Loaded template "${template.name}".`,
                                  });
                                }}
                                variant="outline" 
                                size="sm"
                              >
                                <FaEye className="w-3 h-3" />
                              </Button>
                              <Button 
                                onClick={() => {
                                  const updatedTemplates = templates.filter(t => t.id !== template.id);
                                  setTemplates(updatedTemplates);
                                  localStorage.setItem('qr-templates', JSON.stringify(updatedTemplates));
                                  toast({
                                    title: "Template Deleted",
                                    description: "Template has been removed.",
                                  });
                                }}
                                variant="outline" 
                                size="sm"
                              >
                                <FaTrash className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Batch Tab */}
            <TabsContent value="batch" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Batch QR Generation</CardTitle>
                  <CardDescription className="text-sm">
                    Generate multiple QR codes at once
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {batchTexts.map((batchText, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={batchText}
                          onChange={(e) => {
                            const updated = [...batchTexts];
                            updated[index] = e.target.value;
                            setBatchTexts(updated);
                          }}
                          placeholder={`QR Code ${index + 1} content...`}
                          className="flex-1 text-sm"
                        />
                        {batchTexts.length > 1 && (
                          <Button
                            onClick={() => {
                              if (batchTexts.length > 1) {
                                setBatchTexts(batchTexts.filter((_, i) => i !== index));
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setBatchTexts([...batchTexts, ''])}
                      variant="outline" 
                      size="sm"
                    >
                      <FaPlus className="mr-2" />
                      Add More
                    </Button>
                    <Button 
                      onClick={async () => {
                        const validTexts = batchTexts.filter(t => t.trim());
                        if (validTexts.length === 0) {
                          toast({
                            title: "No Content",
                            description: "Please add some text for batch generation.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setIsGenerating(true);
                        const results: string[] = [];
                        try {
                          for (const batchText of validTexts) {
                            const options = {
                              errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
                              type: 'image/png' as const,
                              quality: 0.92,
                              margin: margin,
                              color: {
                                dark: darkColor,
                                light: lightColor
                              },
                              width: size
                            };
                            const qrDataUrl = await QRCode.toDataURL(batchText, options);
                            results.push(qrDataUrl);
                          }
                          setBatchResults(results);
                          toast({
                            title: "Batch Generation Complete",
                            description: `Generated ${results.length} QR codes successfully.`,
                          });
                        } catch (error) {
                          toast({
                            title: "Batch Generation Failed",
                            description: "Some QR codes failed to generate.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                    >
                      <FaMagic className="mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate All'}
                    </Button>
                  </div>

                  {batchResults.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                      {batchResults.map((result, index) => (
                        <div key={index} className="text-center">
                          <div className="inline-block p-2 bg-white rounded border">
                            <img 
                              src={result} 
                              alt={`QR Code ${index + 1}`} 
                              className="w-full h-auto max-w-24"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.download = `qr-code-${index + 1}-${Date.now()}.png`;
                              link.href = result;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs"
                          >
                            <FaDownload className="mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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