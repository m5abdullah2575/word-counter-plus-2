import { useState, useEffect, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { FaEraser, FaDownload, FaUpload, FaSort, FaSortUp, FaSortDown, FaChartBar, FaHighlighter } from 'react-icons/fa';
import useFileUpload from '@/hooks/useFileUpload';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SortDirection = 'asc' | 'desc';
type SortField = 'word' | 'frequency';

interface WordFrequency {
  word: string;
  frequency: number;
  density: number;
}

// Common stop words in English
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'having',
  'may', 'should', 'am', 'does', 'being'
]);

export default function WordFrequencyCounter() {
  const [text, setText] = useState('');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [ignoreStopWords, setIgnoreStopWords] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [minWordLength, setMinWordLength] = useState(1);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const { toast } = useToast();

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setText(content);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain']
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('wordFrequencyText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wordFrequencyText', text);
  }, [text]);

  // Calculate word frequency with all filters
  const wordFrequencies = useMemo(() => {
    if (!text.trim()) return [];

    // Normalize text: handle case sensitivity and remove special characters
    const normalizedText = caseSensitive 
      ? text.replace(/[^\p{L}\p{N}\s]/gu, ' ')
      : text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    
    // Split into words and filter out empty strings
    let words = normalizedText.split(/\s+/).filter(word => word.length > 0);
    
    // Apply minimum length filter
    if (minWordLength > 1) {
      words = words.filter(word => word.length >= minWordLength);
    }
    
    // Apply stop words filter
    if (ignoreStopWords) {
      words = words.filter(word => !STOP_WORDS.has(word.toLowerCase()));
    }
    
    const totalWords = words.length;
    if (totalWords === 0) return [];

    // Count frequency
    const frequencyMap: Record<string, number> = {};
    words.forEach(word => {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });

    // Convert to array of objects with density
    const frequencies: WordFrequency[] = Object.entries(frequencyMap).map(([word, frequency]) => ({
      word,
      frequency,
      density: (frequency / totalWords) * 100
    }));

    // Sort based on current sort settings
    return frequencies.sort((a, b) => {
      if (sortField === 'frequency') {
        return sortDirection === 'desc' ? b.frequency - a.frequency : a.frequency - b.frequency;
      } else {
        return sortDirection === 'desc' ? b.word.localeCompare(a.word) : a.word.localeCompare(b.word);
      }
    });
  }, [text, sortField, sortDirection, ignoreStopWords, caseSensitive, minWordLength]);

  const totalWords = useMemo(() => {
    return wordFrequencies.reduce((sum, item) => sum + item.frequency, 0);
  }, [wordFrequencies]);

  const uniqueWords = wordFrequencies.length;

  // Get top 20 words for chart - always sorted by frequency regardless of table sort
  const top20Words = useMemo(() => {
    const sortedByFrequency = [...wordFrequencies].sort((a, b) => b.frequency - a.frequency);
    return sortedByFrequency.slice(0, 20);
  }, [wordFrequencies]);

  // Safe highlight word in text using React nodes instead of dangerouslySetInnerHTML
  const renderHighlightedText = () => {
    if (!highlightedWord || !text) return text;
    
    try {
      const escapedWord = highlightedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedWord}\\b`, caseSensitive ? 'gu' : 'giu');
      
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      let keyIndex = 0;
      
      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add highlighted match
        parts.push(
          <mark key={`highlight-${keyIndex++}`} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
            {match[0]}
          </mark>
        );
        lastIndex = regex.lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts.length > 0 ? parts : text;
    } catch (error) {
      // If regex fails, return original text
      return text;
    }
  };

  const clearText = () => {
    setText('');
    setHighlightedWord(null);
    toast({
      title: "Text Cleared",
      description: "All text has been cleared.",
    });
  };

  const downloadResults = () => {
    if (wordFrequencies.length === 0) {
      toast({
        title: "No Data",
        description: "Please enter some text to download results.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content with density
    const csvHeader = 'Word,Frequency,Density (%)\n';
    const csvRows = wordFrequencies.map(item => `${item.word},${item.frequency},${item.density.toFixed(2)}`).join('\n');
    const csvContent = csvHeader + csvRows;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-frequency.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded",
      description: "Word frequency results have been downloaded as CSV.",
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="inline ml-1 text-muted-foreground" />;
    return sortDirection === 'desc' ? 
      <FaSortDown className="inline ml-1" /> : 
      <FaSortUp className="inline ml-1" />;
  };

  const handleWordClick = (word: string) => {
    if (highlightedWord === word) {
      setHighlightedWord(null);
    } else {
      setHighlightedWord(word);
      toast({
        title: "Word Highlighted",
        description: `All occurrences of "${word}" are highlighted in the text.`,
      });
    }
  };

  const chartConfig = {
    frequency: {
      label: "Frequency",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Word Frequency Counter
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Analyze word frequency, density, and patterns in your text
            </p>
          </div>

          {/* Text Input Area with Highlighting */}
          <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                <label htmlFor="textInput" className="text-base sm:text-lg font-semibold text-foreground">
                  Enter Your Text
                </label>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="button-upload-text"
                    title="Upload text file"
                  >
                    <FaUpload className="inline mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <span className="sm:hidden">{isUploading ? 'Up...' : 'Upload'}</span>
                  </button>
                  <button 
                    onClick={clearText}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    data-testid="button-clear-text"
                    title="Clear all text"
                  >
                    <FaEraser className="inline mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Clear</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              </div>
              
              {highlightedWord ? (
                <div className="mb-3">
                  <div className="flex items-center justify-between p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700">
                    <span className="text-sm text-yellow-900 dark:text-yellow-200">
                      <FaHighlighter className="inline mr-2" />
                      Highlighting: <strong>{highlightedWord}</strong>
                    </span>
                    <button
                      onClick={() => setHighlightedWord(null)}
                      className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded hover:bg-yellow-300 dark:hover:bg-yellow-700"
                      data-testid="button-clear-highlight"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : null}
              
              <Textarea
                id="textInput"
                placeholder="Type or paste your text here to analyze word frequency..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 sm:h-64 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm sm:text-base"
                data-testid="textarea-text-input"
              />
              
              {highlightedWord && (
                <div 
                  className="mt-3 p-3 bg-muted rounded border border-border max-h-32 overflow-y-auto text-sm"
                  data-testid="div-highlighted-text"
                >
                  {renderHighlightedText()}
                </div>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {text.trim() && (
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border border-border">
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Filter Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Stop Words Toggle */}
                <div className="flex items-center justify-between space-x-2 p-3 bg-muted/50 rounded">
                  <Label htmlFor="stop-words" className="text-sm font-medium cursor-pointer">
                    Ignore Stop Words
                  </Label>
                  <Switch
                    id="stop-words"
                    checked={ignoreStopWords}
                    onCheckedChange={setIgnoreStopWords}
                    data-testid="switch-stop-words"
                  />
                </div>

                {/* Case Sensitivity Toggle */}
                <div className="flex items-center justify-between space-x-2 p-3 bg-muted/50 rounded">
                  <Label htmlFor="case-sensitive" className="text-sm font-medium cursor-pointer">
                    Case Sensitive
                  </Label>
                  <Switch
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={setCaseSensitive}
                    data-testid="switch-case-sensitive"
                  />
                </div>

                {/* Minimum Word Length */}
                <div className="p-3 bg-muted/50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="min-length" className="text-sm font-medium">
                      Min Length: {minWordLength}
                    </Label>
                  </div>
                  <Slider
                    id="min-length"
                    min={1}
                    max={10}
                    step={1}
                    value={[minWordLength]}
                    onValueChange={(value) => setMinWordLength(value[0])}
                    className="w-full"
                    data-testid="slider-min-length"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Statistics Summary */}
          {text.trim() && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border" data-testid="card-total-words">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total Words (Filtered)</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-total-words">{totalWords}</div>
              </div>
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border" data-testid="card-unique-words">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Unique Words</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-unique-words">{uniqueWords}</div>
              </div>
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border col-span-2 sm:col-span-1" data-testid="card-diversity-ratio">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Diversity Ratio</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-diversity-ratio">
                  {totalWords > 0 ? ((uniqueWords / totalWords) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          )}

          {/* Tabs for Table and Chart View */}
          {wordFrequencies.length > 0 && (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="table" data-testid="tab-table">Table View</TabsTrigger>
                <TabsTrigger value="chart" data-testid="tab-chart">Chart View</TabsTrigger>
              </TabsList>

              {/* Table View */}
              <TabsContent value="table" className="mt-4">
                <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">
                      Word Frequency Results
                    </h2>
                    <button 
                      onClick={downloadResults}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 transition-colors"
                      data-testid="button-download-csv"
                    >
                      <FaDownload className="inline mr-1" aria-hidden="true" />
                      Download CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                            onClick={() => handleSort('word')}
                          >
                            Word {getSortIcon('word')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer select-none hover:bg-muted/50 transition-colors text-right"
                            onClick={() => handleSort('frequency')}
                          >
                            Frequency {getSortIcon('frequency')}
                          </TableHead>
                          <TableHead className="text-right">
                            Density (%)
                          </TableHead>
                          <TableHead className="text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wordFrequencies.map((item, index) => (
                          <TableRow 
                            key={`${item.word}-${index}`}
                            className={highlightedWord === item.word ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                            data-testid={`row-word-${index}`}
                          >
                            <TableCell className="font-medium" data-testid={`cell-word-${index}`}>{item.word}</TableCell>
                            <TableCell className="text-right" data-testid={`cell-frequency-${index}`}>{item.frequency}</TableCell>
                            <TableCell className="text-right" data-testid={`cell-density-${index}`}>{item.density.toFixed(2)}%</TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => handleWordClick(item.word)}
                                className="px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors"
                                data-testid={`button-highlight-${index}`}
                                title="Highlight in text"
                              >
                                <FaHighlighter className="inline" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {wordFrequencies.length > 10 && (
                    <div className="mt-3 text-xs sm:text-sm text-muted-foreground text-center">
                      Showing all {wordFrequencies.length} unique words
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Chart View */}
              <TabsContent value="chart" className="mt-4">
                <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">
                      <FaChartBar className="inline mr-2" />
                      Top 20 Words - Visual Distribution
                    </h2>
                  </div>

                  <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart data={top20Words} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="word" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded p-2 shadow-lg">
                                <p className="font-semibold text-sm">{data.word}</p>
                                <p className="text-xs">Frequency: {data.frequency}</p>
                                <p className="text-xs text-muted-foreground">
                                  Density: {data.density.toFixed(2)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="frequency" 
                        fill="var(--color-frequency)" 
                        radius={[4, 4, 0, 0]}
                        onClick={({payload}) => payload && handleWordClick(payload.word)}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ChartContainer>

                  <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
                    Showing top 20 most frequent words. Click on any bar to highlight in text.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Empty State */}
          {!text.trim() && (
            <div className="bg-card rounded-lg p-8 sm:p-12 shadow-sm border border-border text-center">
              <div className="text-muted-foreground">
                <p className="text-base sm:text-lg mb-2">Enter text above to see word frequency analysis</p>
                <p className="text-xs sm:text-sm">
                  The tool will count how many times each unique word appears and show density percentages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <FileInput />
    </main>
  );
}
