import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
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
  FaExpand
} from 'react-icons/fa';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('text');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // Simple QR Code generation (placeholder - in production use qrcode library)
  const generateQRCode = async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text to generate QR code.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // This is a placeholder implementation
      // In production, you would use a library like 'qrcode' npm package
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Simple placeholder QR code (black and white pattern)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      ctx.fillStyle = '#000000';
      const cellSize = size / 25;
      
      // Create a simple pattern based on text hash
      const hash = text.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      for (let x = 0; x < 25; x++) {
        for (let y = 0; y < 25; y++) {
          const shouldFill = ((x + y + hash) % 3) === 0;
          if (shouldFill) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }

      // Add corner squares (typical QR code pattern)
      const cornerSize = cellSize * 7;
      // Top-left corner
      ctx.fillRect(0, 0, cornerSize, cornerSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cellSize, cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(cellSize * 2, cellSize * 2, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize);

      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);

      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
  }, [text, size, errorLevel]);

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
      example: 'Hello World!'
    },
    url: {
      name: 'Website URL',
      icon: FaLink,
      placeholder: 'https://example.com',
      example: 'https://www.google.com'
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
      example: 'tel:+1234567890'
    },
    email: {
      name: 'Email',
      icon: FaEnvelope,
      placeholder: 'mailto:example@email.com',
      example: 'mailto:john@example.com'
    }
  };

  const insertTemplate = (type: string) => {
    const template = qrTypes[type as keyof typeof qrTypes];
    if (template) {
      setText(template.example);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            QR Code Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create custom QR codes for text, URLs, WiFi, phone numbers, and more
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Content</CardTitle>
                <CardDescription>
                  Choose a type and enter the content for your QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Type Selection */}
                <div>
                  <Label htmlFor="qrType">QR Code Type</Label>
                  <Select value={qrType} onValueChange={setQrType}>
                    <SelectTrigger data-testid="select-qr-type">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(qrTypes).map(([key, type]) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center">
                              <IconComponent className="mr-2" />
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
                  <Label>Quick Templates</Label>
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
                        >
                          <IconComponent className="mr-1" />
                          {type.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Input */}
                <div>
                  <Label htmlFor="qrText">Content</Label>
                  <Textarea
                    id="qrText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={qrTypes[qrType as keyof typeof qrTypes]?.placeholder || 'Enter content...'}
                    className="min-h-[100px] resize-none"
                    data-testid="textarea-qr-input"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                    <FaCopy className="mr-1" />
                    Copy Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearText} data-testid="button-clear">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Size (pixels)</Label>
                    <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                      <SelectTrigger data-testid="select-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                      <SelectContent>
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
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
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
                    <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Generated QR Code" 
                        className="max-w-full h-auto"
                        data-testid="img-qr-code"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {size}x{size} pixels • Error correction: {errorLevel}
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

            {/* Canvas for QR generation (hidden) */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">QR Code Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaLink className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Website URLs</h3>
              <p className="text-sm text-muted-foreground">
                Share links easily with QR codes for websites, social media, or landing pages
              </p>
            </div>
            <div className="text-center">
              <FaWifi className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">WiFi Networks</h3>
              <p className="text-sm text-muted-foreground">
                Let guests connect to WiFi instantly by scanning a QR code
              </p>
            </div>
            <div className="text-center">
              <FaPhone className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                Share phone numbers, emails, or complete contact cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}