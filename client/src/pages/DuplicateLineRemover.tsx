import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import RelatedToolsSidebar from '@/components/common/RelatedToolsSidebar';
import { FaFilter, FaCopy, FaRedo, FaCog, FaTrash } from 'react-icons/fa';

export default function DuplicateLineRemover() {
  const [inputText, setInputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [keepFirstOccurrence, setKeepFirstOccurrence] = useState(true);
  const { toast } = useToast();

  useSEO({
    title: 'Duplicate Line Remover - Word Counter Plus',
    description: 'Remove duplicate lines from your text efficiently. Clean up lists, data files, and documents by eliminating redundant lines.',
    keywords: 'remove duplicates, duplicate lines, clean text, unique lines, text cleanup'
  });

  const processedResult = useMemo(() => {
    if (!inputText.trim()) {
      return { cleanText: '', stats: { original: 0, duplicates: 0, unique: 0, empty: 0 } };
    }

    const lines = inputText.split('\n');
    const seen = new Set<string>();
    const duplicateLines: string[] = [];
    const cleanLines: string[] = [];
    let emptyCount = 0;

    lines.forEach((line, index) => {
      let processedLine = line;
      
      if (trimWhitespace) {
        processedLine = line.trim();
      }
      
      // Handle empty lines
      if (!processedLine) {
        emptyCount++;
        if (!removeEmptyLines) {
          if (keepFirstOccurrence && !seen.has('')) {
            cleanLines.push(line);
            seen.add('');
          } else if (!keepFirstOccurrence) {
            cleanLines.push(line);
          }
        }
        return;
      }

      const keyLine = caseSensitive ? processedLine : processedLine.toLowerCase();
      
      if (seen.has(keyLine)) {
        duplicateLines.push(`Line ${index + 1}: ${line}`);
        if (!keepFirstOccurrence) {
          cleanLines.push(line);
        }
      } else {
        seen.add(keyLine);
        cleanLines.push(line);
      }
    });

    return {
      cleanText: cleanLines.join('\n'),
      stats: {
        original: lines.length,
        duplicates: duplicateLines.length,
        unique: cleanLines.length,
        empty: emptyCount
      },
      duplicateLines
    };
  }, [inputText, caseSensitive, trimWhitespace, removeEmptyLines, keepFirstOccurrence]);

  const processText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    const { stats } = processedResult;
    
    toast({
      title: "Duplicates Removed",
      description: `Removed ${stats.duplicates} duplicate lines. ${stats.unique} unique lines remaining.`,
    });
  };

  const copyCleanText = async () => {
    if (!processedResult.cleanText) {
      toast({
        title: "No Processed Text",
        description: "Please process some text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(processedResult.cleanText);
      toast({
        title: "Clean Text Copied",
        description: "Text with duplicates removed has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyDuplicates = async () => {
    const duplicates = processedResult.duplicateLines?.join('\n') || '';
    
    if (!duplicates) {
      toast({
        title: "No Duplicates Found",
        description: "No duplicate lines were found to copy.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(duplicates);
      toast({
        title: "Duplicate Lines Copied",
        description: "List of duplicate lines has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy duplicate lines to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setCaseSensitive(true);
    setTrimWhitespace(true);
    setRemoveEmptyLines(false);
    setKeepFirstOccurrence(true);
  };

  const applyCleanText = () => {
    setInputText(processedResult.cleanText);
    toast({
      title: "Text Updated",
      description: "Input text has been replaced with the cleaned version.",
    });
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="flex justify-center mb-2 sm:mb-4">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10">
                <FaFilter className="text-2xl sm:text-3xl text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Duplicate Line Remover
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Remove duplicate lines from your text efficiently. Perfect for cleaning up lists, data files, and removing redundant content.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>
                Paste your text with potential duplicate lines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your text here. Each line will be checked for duplicates..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-vertical font-mono text-sm"
                data-testid="textarea-input-text"
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCog className="text-primary" />
                Processing Options
              </CardTitle>
              <CardDescription>
                Customize how duplicates are identified and handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="caseSensitive"
                      checked={caseSensitive}
                      onCheckedChange={(checked) => setCaseSensitive(checked === true)}
                      data-testid="checkbox-case-sensitive"
                    />
                    <Label htmlFor="caseSensitive">Case sensitive comparison</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trimWhitespace"
                      checked={trimWhitespace}
                      onCheckedChange={(checked) => setTrimWhitespace(checked === true)}
                      data-testid="checkbox-trim-whitespace"
                    />
                    <Label htmlFor="trimWhitespace">Trim whitespace before comparing</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeEmptyLines"
                      checked={removeEmptyLines}
                      onCheckedChange={(checked) => setRemoveEmptyLines(checked === true)}
                      data-testid="checkbox-remove-empty"
                    />
                    <Label htmlFor="removeEmptyLines">Remove empty lines</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keepFirstOccurrence"
                      checked={keepFirstOccurrence}
                      onCheckedChange={(checked) => setKeepFirstOccurrence(checked === true)}
                      data-testid="checkbox-keep-first"
                    />
                    <Label htmlFor="keepFirstOccurrence">Keep first occurrence of duplicates</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={processText} data-testid="button-process">
                  <FaFilter className="mr-2" />
                  Remove Duplicates
                </Button>
                <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                  <FaRedo className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {processedResult.cleanText !== '' && (
            <div className="grid gap-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaTrash className="text-primary" />
                    Processing Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-muted/50 p-3 rounded" data-testid="stat-original-lines">
                      <div className="font-semibold">Original Lines</div>
                      <div className="text-2xl font-bold text-muted-foreground">{processedResult.stats.original}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded" data-testid="stat-duplicates-found">
                      <div className="font-semibold text-red-800 dark:text-red-200">Duplicates Found</div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{processedResult.stats.duplicates}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded" data-testid="stat-unique-lines">
                      <div className="font-semibold text-green-800 dark:text-green-200">Unique Lines</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{processedResult.stats.unique}</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded" data-testid="stat-empty-lines">
                      <div className="font-semibold text-blue-800 dark:text-blue-200">Empty Lines</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{processedResult.stats.empty}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clean Text Output */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Cleaned Text</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={applyCleanText} data-testid="button-apply">
                        <FaFilter className="mr-2" />
                        Apply to Input
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyCleanText} data-testid="button-copy-clean">
                        <FaCopy className="mr-2" />
                        Copy Clean Text
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Text with duplicate lines removed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={processedResult.cleanText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-vertical font-mono text-sm"
                    placeholder="Cleaned text will appear here..."
                    data-testid="textarea-clean-text"
                  />
                </CardContent>
              </Card>

              {/* Duplicate Lines List */}
              {processedResult.duplicateLines && processedResult.duplicateLines.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <FaTrash className="text-primary" />
                        Duplicate Lines Found
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={copyDuplicates} data-testid="button-copy-duplicates">
                        <FaCopy className="mr-2" />
                        Copy List
                      </Button>
                    </div>
                    <CardDescription>
                      Lines that were identified as duplicates ({processedResult.duplicateLines.length} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto bg-muted/20 p-3 rounded font-mono text-sm">
                      {processedResult.duplicateLines.map((line, index) => (
                        <div key={index} className="text-red-600 dark:text-red-400 py-1" data-testid={`duplicate-line-${index}`}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaFilter className="text-primary" />
                Usage Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Case sensitive mode treats "Hello" and "hello" as different lines</li>
                <li>• Trim whitespace option ignores leading/trailing spaces when comparing</li>
                <li>• Remove empty lines will eliminate all blank lines from the result</li>
                <li>• Keep first occurrence preserves the first instance of duplicate lines</li>
                <li>• Perfect for cleaning email lists, removing duplicate URLs, or data cleanup</li>
                <li>• Use "Apply to Input" to continue processing the cleaned text</li>
              </ul>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:sticky lg:top-4 lg:h-fit">
          <RelatedToolsSidebar currentTool="/duplicate-line-remover" />
        </div>
      </div>
    </main>
  );
}