import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCheck, FaEraser, FaHighlighter, FaPaste, FaTrash, FaUpload, FaCopy, FaSync, FaSort, FaBook, FaClock, FaInfoCircle, FaCalendar } from "@/components/common/Icons";
import { parseFile, getFileInputAccept, type FileParseProgress } from '@/lib/fileImport';

// Case conversion functions - standalone and reusable
export const textCaseConverters = {
  uppercase: (text: string) => text.toUpperCase(),
  lowercase: (text: string) => text.toLowerCase(),
  titleCase: (text: string) => 
    text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
  sentenceCase: (text: string) => 
    text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => 
      c.toUpperCase()
    ),
  camelCase: (text: string) => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  },
  pascalCase: (text: string) => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  },
  kebabCase: (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  snakeCase: (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  constantCase: (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toUpperCase();
  },
  dotCase: (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .replace(/[\s_-]+/g, '.')
      .toLowerCase();
  },
  alternatingCase: (text: string) => {
    return text
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  },
  reverseCase: (text: string) => {
    return text
      .split('')
      .map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  }
};

// Case conversion options with metadata
const caseOptions = [
  {
    key: 'uppercase' as keyof typeof textCaseConverters,
    name: 'UPPERCASE',
    description: 'Convert all letters to uppercase',
    example: 'HELLO WORLD',
    category: 'basic'
  },
  {
    key: 'lowercase' as keyof typeof textCaseConverters,
    name: 'lowercase',
    description: 'Convert all letters to lowercase',
    example: 'hello world',
    category: 'basic'
  },
  {
    key: 'titleCase' as keyof typeof textCaseConverters,
    name: 'Title Case',
    description: 'Capitalize the first letter of each word',
    example: 'Hello World',
    category: 'basic'
  },
  {
    key: 'sentenceCase' as keyof typeof textCaseConverters,
    name: 'Sentence case',
    description: 'Capitalize first letter of sentences',
    example: 'Hello world. How are you?',
    category: 'basic'
  },
  {
    key: 'camelCase' as keyof typeof textCaseConverters,
    name: 'camelCase',
    description: 'First word lowercase, others capitalized, no spaces',
    example: 'helloWorld',
    category: 'programming'
  },
  {
    key: 'pascalCase' as keyof typeof textCaseConverters,
    name: 'PascalCase',
    description: 'All words capitalized, no spaces',
    example: 'HelloWorld',
    category: 'programming'
  },
  {
    key: 'kebabCase' as keyof typeof textCaseConverters,
    name: 'kebab-case',
    description: 'Lowercase with hyphens between words',
    example: 'hello-world',
    category: 'programming'
  },
  {
    key: 'snakeCase' as keyof typeof textCaseConverters,
    name: 'snake_case',
    description: 'Lowercase with underscores between words',
    example: 'hello_world',
    category: 'programming'
  },
  {
    key: 'constantCase' as keyof typeof textCaseConverters,
    name: 'CONSTANT_CASE',
    description: 'Uppercase with underscores between words',
    example: 'HELLO_WORLD',
    category: 'programming'
  },
  {
    key: 'dotCase' as keyof typeof textCaseConverters,
    name: 'dot.case',
    description: 'Lowercase with dots between words',
    example: 'hello.world',
    category: 'other'
  },
  {
    key: 'alternatingCase' as keyof typeof textCaseConverters,
    name: 'aLtErNaTiNg CaSe',
    description: 'Alternating uppercase and lowercase letters',
    example: 'hElLo WoRlD',
    category: 'other'
  },
  {
    key: 'reverseCase' as keyof typeof textCaseConverters,
    name: 'rEVERSE cASE',
    description: 'Reverse the case of each letter',
    example: 'hELLO wORLD',
    category: 'other'
  }
];

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('textCaseConverter_text');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('textCaseConverter_text', text);
  }, [text]);

  const clearText = () => {
    setText('');
    setUploadedFileInfo(null);
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Text Pasted",
        description: "Text has been pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be uploaded again if needed
    event.target.value = '';

    setIsUploading(true);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    
    try {
      // Use the centralized file parser - no progress callback to prevent toast spam
      const result = await parseFile(file);
      
      setText(result.text);
      
      // Store file information for display
      setUploadedFileInfo({
        name: result.fileName,
        size: result.fileSize,
        type: result.fileType
      });
      
      // Show success message with file details
      const wordCount = result.text.split(/\s+/).filter(word => word.length > 0).length;
      toast({
        title: "File Processed Successfully!",
        description: `"${result.fileName}" processed successfully. Found ${wordCount.toLocaleString()} words.`,
      });
      
    } catch (error: any) {
      console.error('File upload error:', error);
      
      // Show error message using toast
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = async (text: string, caseName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: `${caseName} text copied successfully.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadText = (text: string, caseName: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${caseName.toLowerCase().replace(/\s+/g, '-')}-converted-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Started",
      description: `${caseName} text file download started.`,
    });
  };

  const getStatsText = () => {
    if (!text.trim()) return 'Enter text to see statistics';
    
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split('\n').length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    return `${charCount} characters • ${charCountNoSpaces} without spaces • ${wordCount} words • ${sentenceCount} sentences • ${lineCount} lines`;
  };

  // ✅ Always Visible Scrollbar Text Display 
  const ScrollableResult = ({ convertedText }: { convertedText: string }) => {
    // Force content to always need scrolling
    const paddedContent = convertedText + '\n\n\n\n\n\n\n\n'; // Lots of extra lines

    return (
      <div className="mb-3 relative">
        <div 
          className="bg-muted/50 rounded-md p-3 font-mono text-sm break-all"
          style={{
            height: '150px', // Small fixed height
            overflowY: 'scroll',
            border: '1px solid #94a3b8', // Thick visible border
            scrollbarWidth: 'auto',
            // scrollbarColor: '#f59e0b #e5e7eb' // Bright orange scrollbar
          } as React.CSSProperties}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {paddedContent}
          </pre>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ↑ Scroll to see more content
        </div>
      </div>
    );
  };

  // Group options by category
  const basicOptions = caseOptions.filter(opt => opt.category === 'basic');
  const programmingOptions = caseOptions.filter(opt => opt.category === 'programming');
  const otherOptions = caseOptions.filter(opt => opt.category === 'other');

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Text Case Converter Plus
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Convert text between different case formats with file upload support
            </p>
          </div>

          {/* File Information Display */}
          {uploadedFileInfo && (
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-4">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                <FaUpload className="mr-2" />
                File Processing Complete
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">File:</span>
                  <p className="text-green-800 dark:text-green-200 break-all" data-testid="text-uploaded-filename">{uploadedFileInfo.name}</p>
                </div>
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Size:</span>
                  <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filesize">
                    {Math.round(uploadedFileInfo.size / 1024)}KB ({uploadedFileInfo.size} bytes)
                  </p>
                </div>
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Type:</span>
                  <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filetype">{uploadedFileInfo.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Text Input Area */}
          <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                <label htmlFor="textInput" className="text-base sm:text-lg font-semibold text-foreground">Enter Your Text</label>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* File Upload */}
                  <label className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-sm transition-colors text-center ${
                    isUploading 
                      ? 'bg-primary/50 text-primary-foreground cursor-wait' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer'
                  }`}
                         data-testid="button-upload-file"
                         title="Upload files: Text (.txt, .md, .html, .rtf, .csv), PDF (.pdf), or Word documents (.docx)">
                    {isUploading ? (
                      <>
                        <div className="inline-block w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                        <span className="hidden sm:inline">Uploading...</span>
                        <span className="sm:hidden">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="inline mr-1" aria-hidden="true" />
                        <span className="hidden sm:inline">Upload</span>
                        <span className="sm:hidden">Upload File</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept={getFileInputAccept()} 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="sr-only"
                      aria-label="Upload files: Text (.txt, .md, .html, .rtf, .csv), PDF (.pdf), or Word documents (.docx)"
                    />
                  </label>

                  {/* Clear Button */}
                  <button 
                    onClick={clearText}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    data-testid="button-clear-text"
                    title="Clear all text and reset"
                  >
                    <FaEraser className="inline mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Clear</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              </div>
              
              <textarea
                id="textInput"
                className="w-full min-h-[200px] sm:min-h-[250px] p-3 border border-border rounded-lg resize-y bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your text here to convert between different cases... You can also upload files (TXT, HTML, RTF, Markdown, CSV) using the upload button above."
                aria-describedby="textHelp"
                value={text}
                onChange={(e) => setText(e.target.value)}
                data-testid="input-text-converter"
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground" data-testid="text-stats">
                  {getStatsText()}
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={pasteText}
                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors flex items-center"
                    data-testid="button-paste-text"
                    title="Paste text from clipboard"
                  >
                    <FaPaste className="mr-1" aria-hidden="true" />
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Case Conversion Results */}
          {text.trim() && (
            <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic" data-testid="tab-basic-cases">Basic Cases</TabsTrigger>
                  <TabsTrigger value="programming" data-testid="tab-programming-cases">Programming</TabsTrigger>
                  <TabsTrigger value="other" data-testid="tab-other-cases">Creative</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {basicOptions.map((option) => (
                      <div key={option.key} className="border border-border rounded-lg p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-foreground mb-1">{option.name}</h3>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <ScrollableResult 
                          convertedText={textCaseConverters[option.key](text)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(textCaseConverters[option.key](text), option.name)}
                            className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 transition-colors flex items-center justify-center"
                            data-testid={`button-copy-${option.key}`}
                          >
                            <FaCopy className="mr-1" />
                            Copy
                          </button>
                          <button
                            onClick={() => downloadText(textCaseConverters[option.key](text), option.name)}
                            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                            data-testid={`button-download-${option.key}`}
                            title="Download as text file"
                          >
                            📥
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="programming" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programmingOptions.map((option) => (
                      <div key={option.key} className="border border-border rounded-lg p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-foreground mb-1">{option.name}</h3>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <ScrollableResult 
                          convertedText={textCaseConverters[option.key](text)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(textCaseConverters[option.key](text), option.name)}
                            className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 transition-colors flex items-center justify-center"
                            data-testid={`button-copy-${option.key}`}
                          >
                            <FaCopy className="mr-1" />
                            Copy
                          </button>
                          <button
                            onClick={() => downloadText(textCaseConverters[option.key](text), option.name)}
                            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                            data-testid={`button-download-${option.key}`}
                            title="Download as text file"
                          >
                            📥
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="other" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherOptions.map((option) => (
                      <div key={option.key} className="border border-border rounded-lg p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-foreground mb-1">{option.name}</h3>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <ScrollableResult 
                          convertedText={textCaseConverters[option.key](text)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(textCaseConverters[option.key](text), option.name)}
                            className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 transition-colors flex items-center justify-center"
                            data-testid={`button-copy-${option.key}`}
                          >
                            <FaCopy className="mr-1" />
                            Copy
                          </button>
                          <button
                            onClick={() => downloadText(textCaseConverters[option.key](text), option.name)}
                            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                            data-testid={`button-download-${option.key}`}
                            title="Download as text file"
                          >
                            📥
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* How to Use Section */}
          {!text.trim() && (
            <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">How to Use the Text Case Converter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Basic Cases</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>UPPERCASE:</strong> ALL CAPITAL LETTERS</li>
                    <li>• <strong>lowercase:</strong> all small letters</li>
                    <li>• <strong>Title Case:</strong> First Letter Of Each Word</li>
                    <li>• <strong>Sentence case:</strong> First letter of sentence</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Programming Cases</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>camelCase:</strong> variableName</li>
                    <li>• <strong>PascalCase:</strong> ClassName</li>
                    <li>• <strong>kebab-case:</strong> file-name</li>
                    <li>• <strong>snake_case:</strong> variable_name</li>
                    <li>• <strong>CONSTANT_CASE:</strong> MAX_VALUE</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Creative Cases</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>dot.case:</strong> config.file.name</li>
                    <li>• <strong>aLtErNaTiNg:</strong> mixed case</li>
                    <li>• <strong>rEVERSE cASE:</strong> inverted case</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 text-foreground">File Upload Support</h4>
                <p className="text-sm text-muted-foreground">
                  Upload text files (TXT, HTML, RTF, Markdown, CSV) to quickly convert large amounts of text. 
                  The tool will extract the text content and allow you to convert it to any case format.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Quick Stats */}
          {text.trim() && (
            <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-3">Text Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-medium" data-testid="stat-characters">{text.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Words:</span>
                  <span className="font-medium" data-testid="stat-words">{text.trim().split(/\s+/).filter(word => word.length > 0).length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lines:</span>
                  <span className="font-medium" data-testid="stat-lines">{text.split('\n').length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentences:</span>
                  <span className="font-medium" data-testid="stat-sentences">{text.split(/[.!?]+/).filter(s => s.trim().length > 0).length.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <FaCheck className="text-primary mr-2 flex-shrink-0" />
                12 case conversion types
              </li>
              <li className="flex items-center">
                <FaCheck className="text-primary mr-2 flex-shrink-0" />
                File upload support
              </li>
              <li className="flex items-center">
                <FaCheck className="text-primary mr-2 flex-shrink-0" />
                Copy & download results
              </li>
              <li className="flex items-center">
                <FaCheck className="text-primary mr-2 flex-shrink-0" />
                Real-time conversion
              </li>
              <li className="flex items-center">
                <FaCheck className="text-primary mr-2 flex-shrink-0" />
                Auto-save your work
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// Export the case options for reuse
export { caseOptions };