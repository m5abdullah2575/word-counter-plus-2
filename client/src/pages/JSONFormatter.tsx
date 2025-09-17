import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaCode,
  FaCompress,
  FaExpand,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';
import ModernToolsSidebar from '@/components/common/ModernToolsSidebar';

export default function JSONFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [minifiedJson, setMinifiedJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [jsonStats, setJsonStats] = useState<{
    keys: number;
    values: number;
    objects: number;
    arrays: number;
    size: number;
    depth: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'JSON Formatter & Validator - Format, Minify & Validate JSON | Word Counter Plus',
    description: 'Free JSON formatter, validator, and minifier tool. Format messy JSON, validate JSON syntax, minify JSON for production, and analyze JSON structure.',
    keywords: 'JSON formatter, JSON validator, JSON minifier, JSON beautifier, JSON parser, format JSON, validate JSON, minify JSON'
  });

  // Auto-save and restore JSON
  useEffect(() => {
    const savedJson = localStorage.getItem('jsonFormatterInput');
    if (savedJson) {
      setJsonInput(savedJson);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jsonFormatterInput', jsonInput);
  }, [jsonInput]);

  // Process JSON when input changes
  useEffect(() => {
    if (jsonInput.trim()) {
      processJson(jsonInput);
    } else {
      resetState();
    }
  }, [jsonInput]);

  const resetState = () => {
    setFormattedJson('');
    setMinifiedJson('');
    setIsValid(null);
    setError('');
    setJsonStats(null);
  };

  const processJson = (input: string) => {
    try {
      // Parse JSON to validate
      const parsed = JSON.parse(input);
      
      // Format JSON with 2-space indentation
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      
      // Minify JSON
      const minified = JSON.stringify(parsed);
      setMinifiedJson(minified);
      
      // Calculate statistics
      const stats = calculateJsonStats(parsed, input);
      setJsonStats(stats);
      
      setIsValid(true);
      setError('');
    } catch (err: any) {
      setIsValid(false);
      setError(err.message);
      setFormattedJson('');
      setMinifiedJson('');
      setJsonStats(null);
    }
  };

  const calculateJsonStats = (parsed: any, originalInput: string) => {
    let keys = 0;
    let values = 0;
    let objects = 0;
    let arrays = 0;
    let maxDepth = 0;

    const traverse = (obj: any, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);
      
      if (Array.isArray(obj)) {
        arrays++;
        obj.forEach(item => traverse(item, depth + 1));
        values += obj.length;
      } else if (obj !== null && typeof obj === 'object') {
        objects++;
        Object.keys(obj).forEach(key => {
          keys++;
          traverse(obj[key], depth + 1);
        });
        values += Object.keys(obj).length;
      } else {
        values++;
      }
    };

    traverse(parsed);

    return {
      keys,
      values,
      objects,
      arrays,
      size: new Blob([originalInput]).size,
      depth: maxDepth
    };
  };

  const clearJson = () => {
    setJsonInput('');
    resetState();
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${type} has been copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const pasteJson = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setJsonInput(clipboardText);
      toast({
        title: "JSON Pasted",
        description: "JSON has been pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const downloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON Downloaded",
      description: `${filename} has been downloaded.`,
    });
  };

  // Sample JSON for demo
  const insertSampleJson = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true,
      "lastLogin": null
    };
    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  // File upload functionality
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';
    setIsUploading(true);
    
    try {
      const result = await parseFile(file);
      setJsonInput(result.text);
      
      toast({
        title: "File Loaded Successfully!",
        description: `"${result.fileName}" has been loaded.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to load the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            JSON Formatter & Validator
          </h1>
          <p className="text-xl text-muted-foreground">
            Format, validate, minify, and analyze JSON data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>JSON Input</CardTitle>
                    <CardDescription>
                      Paste, upload, or type JSON data to format and validate
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* File Upload */}
                    <label className={`px-3 py-2 rounded text-sm transition-colors ${
                      isUploading 
                        ? 'bg-primary/50 text-primary-foreground cursor-wait' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer'
                    }`}
                           data-testid="button-upload-file">
                      {isUploading ? (
                        <>
                          <div className="inline-block w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="inline mr-1" />
                          Upload
                        </>
                      )}
                      <input 
                        type="file" 
                        accept=".json,.txt"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="sr-only"
                      />
                    </label>
                    
                    <Button variant="outline" size="sm" onClick={pasteJson} data-testid="button-paste">
                      Paste
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearJson} data-testid="button-clear">
                      <FaEraser className="mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Enter JSON data here..."
                  className="min-h-[300px] resize-none font-mono text-sm"
                  data-testid="textarea-json-input"
                />
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={insertSampleJson}
                    data-testid="button-sample-json"
                  >
                    <FaCode className="mr-1" />
                    Insert Sample JSON
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {isValid !== null && (
                      <Badge variant={isValid ? "default" : "destructive"}>
                        {isValid ? (
                          <>
                            <FaCheckCircle className="mr-1" />
                            Valid JSON
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="mr-1" />
                            Invalid JSON
                          </>
                        )}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {jsonInput.length} characters
                    </span>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">Validation Error:</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* JSON Statistics */}
            {jsonStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaInfoCircle className="mr-2 text-primary" />
                    JSON Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{jsonStats.keys}</p>
                      <p className="text-sm text-muted-foreground">Keys</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{jsonStats.objects}</p>
                      <p className="text-sm text-muted-foreground">Objects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{jsonStats.arrays}</p>
                      <p className="text-sm text-muted-foreground">Arrays</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{jsonStats.depth}</p>
                      <p className="text-sm text-muted-foreground">Max Depth</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{jsonStats.size}</p>
                      <p className="text-sm text-muted-foreground">Bytes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">{jsonStats.values}</p>
                      <p className="text-sm text-muted-foreground">Values</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Area */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>JSON Output</CardTitle>
              </CardHeader>
              <CardContent>
                {isValid ? (
                  <Tabs defaultValue="formatted" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="formatted">Formatted</TabsTrigger>
                      <TabsTrigger value="minified">Minified</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="formatted" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Formatted JSON</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(formattedJson, 'Formatted JSON')}
                            data-testid="button-copy-formatted"
                          >
                            <FaCopy className="mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadJson(formattedJson, 'formatted.json')}
                            data-testid="button-download-formatted"
                          >
                            <FaDownload className="mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={formattedJson}
                        readOnly
                        className="min-h-[300px] resize-none font-mono text-sm bg-muted"
                        data-testid="textarea-formatted-output"
                      />
                    </TabsContent>
                    
                    <TabsContent value="minified" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Minified JSON</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(minifiedJson, 'Minified JSON')}
                            data-testid="button-copy-minified"
                          >
                            <FaCopy className="mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadJson(minifiedJson, 'minified.json')}
                            data-testid="button-download-minified"
                          >
                            <FaDownload className="mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={minifiedJson}
                        readOnly
                        className="min-h-[300px] resize-none font-mono text-sm bg-muted"
                        data-testid="textarea-minified-output"
                      />
                      <div className="text-sm text-muted-foreground">
                        Size reduction: {jsonInput.length > 0 ? Math.round((1 - minifiedJson.length / jsonInput.length) * 100) : 0}%
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <FaCode className="text-6xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Enter valid JSON to see formatted and minified output
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar and Related Tools */}
        <div className="mt-8">
          <div className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
            <ModernToolsSidebar currentTool="/json-formatter" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">JSON Tool Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <FaExpand className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Format & Beautify</h3>
              <p className="text-sm text-muted-foreground">
                Make JSON readable with proper indentation and formatting
              </p>
            </div>
            <div className="text-center">
              <FaCheckCircle className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Validate JSON</h3>
              <p className="text-sm text-muted-foreground">
                Check JSON syntax and identify validation errors
              </p>
            </div>
            <div className="text-center">
              <FaCompress className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Minify JSON</h3>
              <p className="text-sm text-muted-foreground">
                Remove whitespace to reduce file size for production
              </p>
            </div>
            <div className="text-center">
              <FaInfoCircle className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">JSON Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed statistics about your JSON structure
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}