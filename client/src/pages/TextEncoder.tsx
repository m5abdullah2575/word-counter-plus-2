import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaCode, FaCopy, FaRedo, FaExchangeAlt, FaLock, FaUnlock, FaUpload, FaDownload } from 'react-icons/fa';
import { encodeBase64, decodeBase64 } from '@/lib/base64';
import { toBytes, fromBytes } from '@/lib/utf8';

type EncodingMethod = {
  id: string;
  name: string;
  description: string;
  encode: (input: string) => string;
  decode: (input: string) => string;
  canDecode: boolean;
};

const ENCODING_METHODS: EncodingMethod[] = [
  {
    id: 'base64',
    name: 'Base64',
    description: 'Standard Base64 encoding/decoding',
    encode: (input: string) => encodeBase64(input),
    decode: (input: string) => decodeBase64(input),
    canDecode: true
  },
  {
    id: 'url',
    name: 'URL Encoding',
    description: 'URL percent-encoding for web URLs',
    encode: (input: string) => encodeURIComponent(input),
    decode: (input: string) => {
      try {
        return decodeURIComponent(input);
      } catch {
        throw new Error('Invalid URL encoding');
      }
    },
    canDecode: true
  },
  {
    id: 'html',
    name: 'HTML Entities',
    description: 'HTML entity encoding for special characters',
    encode: (input: string) => {
      // Use a deterministic character-by-character mapping
      return input
        .replace(/&/g, '&amp;')   // Must be first to avoid double-encoding
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },
    decode: (input: string) => {
      const div = document.createElement('div');
      div.innerHTML = input;
      return div.textContent || div.innerText || '';
    },
    canDecode: true
  },
  {
    id: 'hex',
    name: 'Hexadecimal',
    description: 'Convert text to hexadecimal representation',
    encode: (input: string) => {
      const bytes = toBytes(input);
      return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(' ');
    },
    decode: (input: string) => {
      try {
        const hexBytes = input.replace(/\s+/g, '').match(/.{1,2}/g) || [];
        const bytes = hexBytes.map(hex => parseInt(hex, 16));
        return fromBytes(new Uint8Array(bytes));
      } catch {
        throw new Error('Invalid hexadecimal input');
      }
    },
    canDecode: true
  },
  {
    id: 'binary',
    name: 'Binary',
    description: 'Convert text to binary representation',
    encode: (input: string) => {
      const bytes = toBytes(input);
      return Array.from(bytes)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ');
    },
    decode: (input: string) => {
      try {
        const binaryBytes = input.replace(/\s+/g, '').match(/.{1,8}/g) || [];
        const bytes = binaryBytes.map(binary => parseInt(binary, 2));
        return fromBytes(new Uint8Array(bytes));
      } catch {
        throw new Error('Invalid binary input');
      }
    },
    canDecode: true
  },
  {
    id: 'unicode',
    name: 'Unicode Escape',
    description: 'Convert to Unicode escape sequences',
    encode: (input: string) => {
      return input
        .split('')
        .map(char => {
          const code = char.charCodeAt(0);
          if (code > 127) {
            return '\\u' + code.toString(16).padStart(4, '0');
          }
          return char;
        })
        .join('');
    },
    decode: (input: string) => {
      try {
        return input.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => 
          String.fromCharCode(parseInt(hex, 16))
        );
      } catch {
        throw new Error('Invalid Unicode escape sequence');
      }
    },
    canDecode: true
  }
];

export default function TextEncoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(ENCODING_METHODS[0].id);
  const [isEncoding, setIsEncoding] = useState(true);
  const { toast } = useToast();

  const currentMethod = ENCODING_METHODS.find(method => method.id === selectedMethod) || ENCODING_METHODS[0];

  useSEO({
    title: 'Text Encoder/Decoder - Word Counter Plus',
    description: 'Encode and decode text using various methods including Base64, URL encoding, HTML entities, and more.',
    keywords: 'text encoder, text decoder, base64, url encoding, html entities, hex, binary, unicode'
  });

  const processText = (encode: boolean = true) => {
    if (!inputText.trim()) {
      toast({
        title: "No Input",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = encode 
        ? currentMethod.encode(inputText)
        : currentMethod.decode(inputText);
      
      setOutputText(result);
      
      toast({
        title: `Text ${encode ? 'Encoded' : 'Decoded'}`,
        description: `Successfully ${encode ? 'encoded' : 'decoded'} using ${currentMethod.name}.`,
      });
    } catch (error) {
      toast({
        title: `${encode ? 'Encoding' : 'Decoding'} Failed`,
        description: error instanceof Error ? error.message : `Failed to ${encode ? 'encode' : 'decode'} text.`,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Text Copied",
        description: "Output text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const swapInputOutput = () => {
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
      setIsEncoding(!isEncoding);
      toast({
        title: "Input/Output Swapped",
        description: "Swapped input and output text.",
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setIsEncoding(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type - allow text/* MIME types OR specific extensions
    const allowedExtensions = [/\.txt$/i, /\.md$/i, /\.csv$/i, /\.log$/i, /\.json$/i];
    const isTextMime = file.type.startsWith('text/');
    const hasAllowedExtension = allowedExtensions.some(regex => regex.test(file.name));
    
    if (!isTextMime && !hasAllowedExtension) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a text file (.txt, .md, .csv, .log, .json, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputText(content);
      setOutputText(''); // Reset output when new file is loaded
      
      toast({
        title: "File Uploaded",
        description: `Successfully loaded ${file.name} (${content.length} characters)`,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Unable to read the file. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input to allow same file upload again
  };

  const downloadResult = (useOutput: boolean = true) => {
    const textToDownload = useOutput && outputText ? outputText : inputText;
    
    if (!textToDownload.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some text or process the input first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filePrefix = useOutput && outputText 
        ? `${currentMethod.name.toLowerCase().replace(/\s+/g, '-')}-${isEncoding ? 'encoded' : 'decoded'}` 
        : 'text-encoder-input';
      link.download = `${filePrefix}-${Date.now()}.txt`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "File Downloaded",
        description: useOutput && outputText
          ? "Processed text has been saved to your device."
          : "Input text has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaCode className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Text Encoder/Decoder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encode and decode text using various methods including Base64, URL encoding, HTML entities, hexadecimal, and more.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCode className="text-primary" />
                Encoding Method
              </CardTitle>
              <CardDescription>
                Select the encoding/decoding method to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger data-testid="select-method">
                      <SelectValue placeholder="Select encoding method" />
                    </SelectTrigger>
                    <SelectContent 
                      side="bottom" 
                      position="popper"
                      align="start"
                      avoidCollisions={true}
                      className="max-h-96 z-50 bg-background border border-border shadow-lg"
                    >
                      {ENCODING_METHODS.map((method) => (
                        <SelectItem 
                          key={method.id} 
                          value={method.id}
                          className="cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentMethod.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Input Text */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Input Text</CardTitle>
                <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset">
                  <FaRedo className="mr-2" />
                  Reset
                </Button>
              </div>
              <CardDescription>
                Enter the text you want to {isEncoding ? 'encode' : 'decode'}, or upload a text file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                id="text-encoder-file-upload"
                accept=".txt,.md,.csv,.log,.json,text/*"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
              <div className="mb-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => document.getElementById('text-encoder-file-upload')?.click()}
                  data-testid="button-upload"
                >
                  <FaUpload className="mr-2" />
                  Upload File
                </Button>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px] resize-none"
                placeholder={`Enter text to ${isEncoding ? 'encode' : 'decode'}...`}
                data-testid="textarea-input"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                {inputText.length} characters
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Button 
              onClick={() => { processText(true); setIsEncoding(true); }} 
              variant={isEncoding ? "default" : "outline"}
              data-testid="button-encode"
            >
              <FaLock className="mr-2" />
              Encode
            </Button>
            
            {currentMethod.canDecode && (
              <Button 
                onClick={() => { processText(false); setIsEncoding(false); }} 
                variant={!isEncoding ? "default" : "outline"}
                data-testid="button-decode"
              >
                <FaUnlock className="mr-2" />
                Decode
              </Button>
            )}
            
            {outputText && (
              <Button onClick={swapInputOutput} variant="outline" data-testid="button-swap">
                <FaExchangeAlt className="mr-2" />
                Swap
              </Button>
            )}
          </div>

          {/* Output Text */}
          {outputText && (
            <Card>
              <CardHeader>
                <CardTitle>Output Text</CardTitle>
                <CardDescription>
                  Result of {isEncoding ? 'encoding' : 'decoding'} using {currentMethod.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => downloadResult(true)}
                    data-testid="button-download-output"
                  >
                    <FaDownload className="mr-2" />
                    Download Result
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                    <FaCopy className="mr-2" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="min-h-[150px] resize-none"
                  placeholder="Output will appear here..."
                  data-testid="textarea-output"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {outputText.length} characters
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card>
            <CardHeader>
              <CardTitle>Encoding Methods Guide</CardTitle>
              <CardDescription>
                Learn about different encoding methods and their uses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {ENCODING_METHODS.map((method) => (
                    <div key={method.id} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}