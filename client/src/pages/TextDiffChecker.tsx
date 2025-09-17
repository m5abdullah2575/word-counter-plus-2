import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaExchangeAlt, FaCopy, FaRedo, FaCog, FaCheck } from 'react-icons/fa';
import ModernToolsSidebar from '@/components/common/ModernToolsSidebar';

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumber?: number;
}

export default function TextDiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const { toast } = useToast();

  useSEO({
    title: 'Text Diff Checker - Word Counter Plus',
    description: 'Compare two texts and highlight differences. Find added, removed, and changed content between text versions.',
    keywords: 'text diff, text comparison, compare text, text differences, document comparison'
  });

  const processText = (text: string): string => {
    let processed = text;
    if (ignoreCase) {
      processed = processed.toLowerCase();
    }
    if (ignoreWhitespace) {
      // Preserve newlines but normalize other whitespace
      processed = processed.split('\n').map(line => line.replace(/[ \t]+/g, ' ').trim()).join('\n');
    }
    return processed;
  };

  const diffResults = useMemo(() => {
    if (!text1.trim() && !text2.trim()) return [];

    const lines1 = processText(text1).split('\n');
    const lines2 = processText(text2).split('\n');
    const originalLines1 = text1.split('\n');
    const originalLines2 = text2.split('\n');

    const results: DiffResult[] = [];
    
    // Simple line-by-line comparison
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      const originalLine1 = originalLines1[i] || '';
      const originalLine2 = originalLines2[i] || '';

      if (line1 === line2) {
        if (originalLine1) {
          results.push({
            type: 'unchanged',
            value: originalLine1,
            lineNumber: i + 1
          });
        }
      } else {
        if (originalLine1 && !originalLine2) {
          results.push({
            type: 'removed',
            value: originalLine1,
            lineNumber: i + 1
          });
        } else if (!originalLine1 && originalLine2) {
          results.push({
            type: 'added',
            value: originalLine2,
            lineNumber: i + 1
          });
        } else if (originalLine1 && originalLine2) {
          results.push({
            type: 'removed',
            value: originalLine1,
            lineNumber: i + 1
          });
          results.push({
            type: 'added',
            value: originalLine2,
            lineNumber: i + 1
          });
        }
      }
    }

    return results;
  }, [text1, text2, ignoreCase, ignoreWhitespace]);

  const stats = useMemo(() => {
    const added = diffResults.filter(r => r.type === 'added').length;
    const removed = diffResults.filter(r => r.type === 'removed').length;
    const unchanged = diffResults.filter(r => r.type === 'unchanged').length;
    
    return { added, removed, unchanged, total: added + removed + unchanged };
  }, [diffResults]);

  const compareTexts = () => {
    if (!text1.trim() && !text2.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter text in both fields to compare.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comparison Complete",
      description: `Found ${stats.added} additions, ${stats.removed} deletions, and ${stats.unchanged} unchanged lines.`,
    });
  };

  const copyDiff = async () => {
    if (diffResults.length === 0) {
      toast({
        title: "No Comparison Results",
        description: "Please compare texts first.",
        variant: "destructive",
      });
      return;
    }

    const diffText = diffResults
      .map(result => {
        const prefix = result.type === 'added' ? '+ ' : result.type === 'removed' ? '- ' : '  ';
        const lineNum = showLineNumbers && result.lineNumber ? `${result.lineNumber}: ` : '';
        return `${prefix}${lineNum}${result.value}`;
      })
      .join('\n');

    try {
      await navigator.clipboard.writeText(diffText);
      toast({
        title: "Diff Copied",
        description: "Text comparison results have been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy diff to clipboard.",
        variant: "destructive",
      });
    }
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    
    toast({
      title: "Texts Swapped",
      description: "Left and right text areas have been swapped.",
    });
  };

  const handleReset = () => {
    setText1('');
    setText2('');
    setIgnoreCase(false);
    setIgnoreWhitespace(false);
    setShowLineNumbers(true);
  };

  const getLineStyle = (type: DiffResult['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-800 dark:text-green-200';
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-200';
      default:
        return 'bg-background border-l-4 border-transparent';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaExchangeAlt className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Text Diff Checker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare two texts side by side and highlight the differences. Perfect for comparing document versions and tracking changes.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Texts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>
                  Paste the first version of your text here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter the original text here..."
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  className="min-h-[200px] resize-vertical font-mono text-sm"
                  data-testid="textarea-text1"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modified Text</CardTitle>
                <CardDescription>
                  Paste the second version of your text here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter the modified text here..."
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  className="min-h-[200px] resize-vertical font-mono text-sm"
                  data-testid="textarea-text2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Settings and Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCog className="text-primary" />
                Comparison Settings
              </CardTitle>
              <CardDescription>
                Customize how the texts are compared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ignoreCase"
                      checked={ignoreCase}
                      onCheckedChange={(checked) => setIgnoreCase(checked === true)}
                      data-testid="checkbox-ignore-case"
                    />
                    <Label htmlFor="ignoreCase">Ignore case differences</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ignoreWhitespace"
                      checked={ignoreWhitespace}
                      onCheckedChange={(checked) => setIgnoreWhitespace(checked === true)}
                      data-testid="checkbox-ignore-whitespace"
                    />
                    <Label htmlFor="ignoreWhitespace">Ignore whitespace differences</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showLineNumbers"
                      checked={showLineNumbers}
                      onCheckedChange={(checked) => setShowLineNumbers(checked === true)}
                      data-testid="checkbox-show-line-numbers"
                    />
                    <Label htmlFor="showLineNumbers">Show line numbers</Label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={compareTexts} data-testid="button-compare">
                    <FaCheck className="mr-2" />
                    Compare Texts
                  </Button>
                  <Button variant="outline" onClick={swapTexts} data-testid="button-swap">
                    <FaExchangeAlt className="mr-2" />
                    Swap Texts
                  </Button>
                  <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                    <FaRedo className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diff Results */}
          {diffResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FaExchangeAlt className="text-primary" />
                    Comparison Results
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={copyDiff} data-testid="button-copy">
                    <FaCopy className="mr-2" />
                    Copy Diff
                  </Button>
                </div>
                <CardDescription>
                  Lines highlighted in green are additions, lines in red are deletions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border-l-4 border-green-500" data-testid="stat-added">
                    <div className="font-semibold text-green-800 dark:text-green-200">Added</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.added}</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-500" data-testid="stat-removed">
                    <div className="font-semibold text-red-800 dark:text-red-200">Removed</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.removed}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded border-l-4 border-muted-foreground" data-testid="stat-unchanged">
                    <div className="font-semibold">Unchanged</div>
                    <div className="text-2xl font-bold text-muted-foreground">{stats.unchanged}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded border-l-4 border-primary" data-testid="stat-total">
                    <div className="font-semibold text-primary">Total Lines</div>
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  </div>
                </div>

                {/* Diff Display */}
                <div className="max-h-96 overflow-y-auto border rounded-md">
                  {diffResults.map((result, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 font-mono text-sm ${getLineStyle(result.type)}`}
                      data-testid={`diff-line-${index}`}
                    >
                      <span className="inline-block w-6 text-xs text-muted-foreground mr-2">
                        {result.type === 'added' ? '+' : result.type === 'removed' ? '-' : ' '}
                      </span>
                      {showLineNumbers && result.lineNumber && (
                        <span className="inline-block w-8 text-xs text-muted-foreground mr-2">
                          {result.lineNumber}:
                        </span>
                      )}
                      <span className="whitespace-pre-wrap">{result.value || ' '}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar and Related Tools */}
        <div className="mt-8">
          <div className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
            <ModernToolsSidebar currentTool="/text-diff-checker" />
          </div>
        </div>
      </div>
    </div>
  );
}