import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import ModernToolsSidebar from '@/components/common/ModernToolsSidebar';
import { FaSort, FaCopy, FaRedo, FaCog, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaRandom } from 'react-icons/fa';

type SortType = 'alphabetical' | 'reverse-alphabetical' | 'length-ascending' | 'length-descending' | 'numerical' | 'reverse-numerical' | 'random' | 'reverse';

export default function TextSortingTool() {
  const [inputText, setInputText] = useState('');
  const [sortType, setSortType] = useState<SortType>('alphabetical');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: 'Text Sorting Tool - Word Counter Plus',
    description: 'Sort text lines alphabetically, by length, numerically, or in reverse order. Organize and arrange your text content efficiently.',
    keywords: 'sort text, alphabetical sort, line sorting, text organization, arrange text, sort lines'
  });

  const sortedResult = useMemo(() => {
    if (!inputText.trim()) {
      return { sortedText: '', stats: { originalLines: 0, sortedLines: 0, removedDuplicates: 0, removedEmpty: 0 } };
    }

    let lines = inputText.split('\n');
    const originalCount = lines.length;
    let removedEmpty = 0;
    let removedDuplicates = 0;

    // Process lines based on options
    if (trimWhitespace) {
      lines = lines.map(line => line.trim());
    }

    if (removeEmptyLines) {
      const beforeEmpty = lines.length;
      lines = lines.filter(line => line.length > 0);
      removedEmpty = beforeEmpty - lines.length;
    }

    if (removeDuplicates) {
      const beforeDuplicates = lines.length;
      const seen = new Set<string>();
      lines = lines.filter(line => {
        const key = caseSensitive ? line : line.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      removedDuplicates = beforeDuplicates - lines.length;
    }

    // Sort based on selected type
    let sortedLines = [...lines];
    
    switch (sortType) {
      case 'alphabetical':
        sortedLines.sort(caseSensitive 
          ? (a, b) => a.localeCompare(b)
          : (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
        );
        break;
        
      case 'reverse-alphabetical':
        sortedLines.sort(caseSensitive 
          ? (a, b) => b.localeCompare(a)
          : (a, b) => b.toLowerCase().localeCompare(a.toLowerCase())
        );
        break;
        
      case 'length-ascending':
        sortedLines.sort((a, b) => a.length - b.length);
        break;
        
      case 'length-descending':
        sortedLines.sort((a, b) => b.length - a.length);
        break;
        
      case 'numerical':
        sortedLines.sort((a, b) => {
          const numA = parseFloat(a.match(/^-?\d*\.?\d+/) ? a.match(/^-?\d*\.?\d+/)![0] : '0') || 0;
          const numB = parseFloat(b.match(/^-?\d*\.?\d+/) ? b.match(/^-?\d*\.?\d+/)![0] : '0') || 0;
          return numA - numB;
        });
        break;
        
      case 'reverse-numerical':
        sortedLines.sort((a, b) => {
          const numA = parseFloat(a.match(/^-?\d*\.?\d+/) ? a.match(/^-?\d*\.?\d+/)![0] : '0') || 0;
          const numB = parseFloat(b.match(/^-?\d*\.?\d+/) ? b.match(/^-?\d*\.?\d+/)![0] : '0') || 0;
          return numB - numA;
        });
        break;
        
      case 'random':
        for (let i = sortedLines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sortedLines[i], sortedLines[j]] = [sortedLines[j], sortedLines[i]];
        }
        break;
        
      case 'reverse':
        sortedLines.reverse();
        break;
        
      default:
        break;
    }

    return {
      sortedText: sortedLines.join('\n'),
      stats: {
        originalLines: originalCount,
        sortedLines: sortedLines.length,
        removedDuplicates,
        removedEmpty
      }
    };
  }, [inputText, sortType, caseSensitive, removeEmptyLines, trimWhitespace, removeDuplicates]);

  const sortText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to sort.",
        variant: "destructive",
      });
      return;
    }

    const { stats } = sortedResult;
    let message = `Sorted ${stats.sortedLines} lines`;
    
    if (stats.removedEmpty > 0) {
      message += `, removed ${stats.removedEmpty} empty lines`;
    }
    if (stats.removedDuplicates > 0) {
      message += `, removed ${stats.removedDuplicates} duplicates`;
    }

    toast({
      title: "Text Sorted",
      description: message + ".",
    });
  };

  const copySortedText = async () => {
    if (!sortedResult.sortedText) {
      toast({
        title: "No Sorted Text",
        description: "Please sort some text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(sortedResult.sortedText);
      toast({
        title: "Sorted Text Copied",
        description: "Sorted text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const applySortedText = () => {
    setInputText(sortedResult.sortedText);
    toast({
      title: "Text Updated",
      description: "Input text has been replaced with the sorted version.",
    });
  };

  const handleReset = () => {
    setInputText('');
    setSortType('alphabetical');
    setCaseSensitive(false);
    setRemoveEmptyLines(false);
    setTrimWhitespace(true);
    setRemoveDuplicates(false);
  };

  const getSortIcon = (type: SortType) => {
    switch (type) {
      case 'alphabetical': return <FaSortAlphaDown className="mr-2" />;
      case 'reverse-alphabetical': return <FaSortAlphaUp className="mr-2" />;
      case 'numerical': case 'reverse-numerical': return <FaSortNumericDown className="mr-2" />;
      case 'random': return <FaRandom className="mr-2" />;
      default: return <FaSort className="mr-2" />;
    }
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Text Sorting Tool
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Sort your text lines in various orders: alphabetical, by length, numerical, or random. Perfect for organizing lists and data.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>
                Paste your text here. Each line will be sorted individually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter text to sort, one item per line..."
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
                Sorting Options
              </CardTitle>
              <CardDescription>
                Choose how to sort and process your text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sort Type Selection */}
              <div>
                <Label>Sort Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={sortType === 'alphabetical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('alphabetical')}
                    data-testid="button-sort-alphabetical"
                  >
                    <FaSortAlphaDown className="mr-2" />
                    A-Z (Alphabetical)
                  </Button>
                  <Button
                    variant={sortType === 'reverse-alphabetical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('reverse-alphabetical')}
                    data-testid="button-sort-reverse-alphabetical"
                  >
                    <FaSortAlphaUp className="mr-2" />
                    Z-A (Reverse Alphabetical)
                  </Button>
                  <Button
                    variant={sortType === 'length-ascending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('length-ascending')}
                    data-testid="button-sort-length-asc"
                  >
                    <FaSort className="mr-2" />
                    Length (Short to Long)
                  </Button>
                  <Button
                    variant={sortType === 'length-descending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('length-descending')}
                    data-testid="button-sort-length-desc"
                  >
                    <FaSort className="mr-2" />
                    Length (Long to Short)
                  </Button>
                  <Button
                    variant={sortType === 'numerical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('numerical')}
                    data-testid="button-sort-numerical"
                  >
                    <FaSortNumericDown className="mr-2" />
                    Numerical (1-9)
                  </Button>
                  <Button
                    variant={sortType === 'reverse-numerical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('reverse-numerical')}
                    data-testid="button-sort-reverse-numerical"
                  >
                    <FaSortNumericDown className="mr-2" />
                    Numerical (9-1)
                  </Button>
                  <Button
                    variant={sortType === 'random' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('random')}
                    data-testid="button-sort-random"
                  >
                    <FaRandom className="mr-2" />
                    Random Shuffle
                  </Button>
                  <Button
                    variant={sortType === 'reverse' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortType('reverse')}
                    data-testid="button-sort-reverse"
                  >
                    <FaSort className="mr-2" />
                    Reverse Order
                  </Button>
                </div>
              </div>

              {/* Processing Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="caseSensitive"
                      checked={caseSensitive}
                      onCheckedChange={(checked) => setCaseSensitive(checked === true)}
                      data-testid="checkbox-case-sensitive"
                    />
                    <Label htmlFor="caseSensitive">Case sensitive sorting</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trimWhitespace"
                      checked={trimWhitespace}
                      onCheckedChange={(checked) => setTrimWhitespace(checked === true)}
                      data-testid="checkbox-trim-whitespace"
                    />
                    <Label htmlFor="trimWhitespace">Trim whitespace</Label>
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
                      id="removeDuplicates"
                      checked={removeDuplicates}
                      onCheckedChange={(checked) => setRemoveDuplicates(checked === true)}
                      data-testid="checkbox-remove-duplicates"
                    />
                    <Label htmlFor="removeDuplicates">Remove duplicates</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={sortText} data-testid="button-sort">
                  {getSortIcon(sortType)}
                  Sort Text
                </Button>
                <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                  <FaRedo className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {sortedResult.sortedText && (
            <div className="grid gap-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaSort className="text-primary" />
                    Sorting Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-muted/50 p-3 rounded" data-testid="stat-original-lines">
                      <div className="font-semibold">Original Lines</div>
                      <div className="text-2xl font-bold text-muted-foreground">{sortedResult.stats.originalLines}</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded" data-testid="stat-sorted-lines">
                      <div className="font-semibold text-primary">Sorted Lines</div>
                      <div className="text-2xl font-bold text-primary">{sortedResult.stats.sortedLines}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded" data-testid="stat-empty-removed">
                      <div className="font-semibold text-red-800 dark:text-red-200">Empty Removed</div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{sortedResult.stats.removedEmpty}</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded" data-testid="stat-duplicates-removed">
                      <div className="font-semibold text-yellow-800 dark:text-yellow-200">Duplicates Removed</div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{sortedResult.stats.removedDuplicates}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sorted Text Output */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Sorted Text</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={applySortedText} data-testid="button-apply">
                        <FaSort className="mr-2" />
                        Apply to Input
                      </Button>
                      <Button variant="outline" size="sm" onClick={copySortedText} data-testid="button-copy">
                        <FaCopy className="mr-2" />
                        Copy Sorted Text
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Your text sorted using {sortType.replace('-', ' ')} method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={sortedResult.sortedText}
                    readOnly
                    className="min-h-[200px] resize-vertical font-mono text-sm"
                    placeholder="Sorted text will appear here..."
                    data-testid="textarea-sorted-text"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Usage Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaSort className="text-primary" />
                Sorting Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Alphabetical sorting respects locale-specific character ordering</li>
                <li>• Numerical sorting extracts numbers from the beginning of each line</li>
                <li>• Length sorting organizes lines from shortest to longest (or vice versa)</li>
                <li>• Random shuffle generates a different order each time you sort</li>
                <li>• Case sensitive option affects alphabetical and duplicate detection</li>
                <li>• Perfect for organizing todo lists, sorting data files, or arranging content</li>
              </ul>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:sticky lg:top-4 lg:h-fit">
          <ModernToolsSidebar currentTool="/text-sorting-tool" />
        </div>
      </div>
    </main>
  );
}