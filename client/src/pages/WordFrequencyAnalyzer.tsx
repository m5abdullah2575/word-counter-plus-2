import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaChartBar, FaCopy, FaRedo, FaCog, FaSort } from 'react-icons/fa';
import RelatedBlogPosts from '@/components/common/RelatedBlogPosts';

interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export default function WordFrequencyAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [sortBy, setSortBy] = useState<'frequency' | 'alphabetical'>('frequency');
  const { toast } = useToast();

  useSEO({
    title: 'Word Frequency Analyzer - Word Counter Plus',
    description: 'Analyze word frequency in your text. Get detailed statistics on word usage, frequency distribution, and keyword density.',
    keywords: 'word frequency, word analysis, keyword density, text analysis, word statistics'
  });

  const wordFrequencies = useMemo(() => {
    if (!inputText.trim()) return [];

    // Extract words based on settings
    let text = caseSensitive ? inputText : inputText.toLowerCase();
    
    // Remove punctuation but keep numbers if requested
    const wordRegex = includeNumbers ? /\b[\w]+\b/g : /\b[a-zA-Z]+\b/g;
    const words = text.match(wordRegex) || [];
    
    // Filter by minimum length
    const filteredWords = words.filter(word => word.length >= minLength);
    
    // Count frequencies
    const frequency: Record<string, number> = {};
    filteredWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Convert to array with percentages
    const totalWords = filteredWords.length;
    const frequencies: WordFrequency[] = Object.entries(frequency).map(([word, count]) => ({
      word,
      count,
      percentage: (count / totalWords) * 100
    }));

    // Sort based on selected method
    if (sortBy === 'frequency') {
      frequencies.sort((a, b) => b.count - a.count);
    } else {
      frequencies.sort((a, b) => a.word.localeCompare(b.word));
    }

    return frequencies;
  }, [inputText, minLength, caseSensitive, includeNumbers, sortBy]);

  const analyzeText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Complete",
      description: `Found ${wordFrequencies.length} unique words meeting your criteria.`,
    });
  };

  const copyResults = async () => {
    if (wordFrequencies.length === 0) {
      toast({
        title: "No Results",
        description: "Please analyze some text first.",
        variant: "destructive",
      });
      return;
    }

    const results = wordFrequencies
      .map((item, index) => 
        `${index + 1}. ${item.word} - ${item.count} occurrences (${item.percentage.toFixed(2)}%)`
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(results);
      toast({
        title: "Results Copied",
        description: "Word frequency analysis has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy results to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setMinLength(3);
    setCaseSensitive(false);
    setIncludeNumbers(false);
    setSortBy('frequency');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaChartBar className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Word Frequency Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze word frequency and distribution in your text. Identify the most commonly used words and keyword density.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input and Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Text Input */}
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
                <CardDescription>
                  Paste your text here for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter the text you want to analyze for word frequency..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-vertical"
                  data-testid="textarea-input-text"
                />
              </CardContent>
            </Card>

            {/* Analysis Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaCog className="text-primary" />
                  Analysis Settings
                </CardTitle>
                <CardDescription>
                  Customize how words are counted and displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="minLength">Minimum Word Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="1"
                    max="20"
                    value={minLength}
                    onChange={(e) => setMinLength(Math.max(1, parseInt(e.target.value) || 3))}
                    data-testid="input-min-length"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="caseSensitive"
                      checked={caseSensitive}
                      onCheckedChange={(checked) => setCaseSensitive(checked === true)}
                      data-testid="checkbox-case-sensitive"
                    />
                    <Label htmlFor="caseSensitive">Case sensitive</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeNumbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                      data-testid="checkbox-include-numbers"
                    />
                    <Label htmlFor="includeNumbers">Include numbers</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sortBy">Sort Results By</Label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'frequency' | 'alphabetical')}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background"
                    data-testid="select-sort-by"
                  >
                    <option value="frequency">Frequency (most common first)</option>
                    <option value="alphabetical">Alphabetical order</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={analyzeText} data-testid="button-analyze">
                    <FaChartBar className="mr-2" />
                    Analyze Text
                  </Button>
                  <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                    <FaRedo className="mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {wordFrequencies.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FaSort className="text-primary" />
                    Word Frequency Results
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={copyResults} data-testid="button-copy">
                    <FaCopy className="mr-2" />
                    Copy Results
                  </Button>
                </div>
                <CardDescription data-testid="text-results-description">
                  {wordFrequencies.length} unique words found (sorted by {sortBy})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-2">Rank</th>
                        <th className="text-left p-2">Word</th>
                        <th className="text-right p-2">Count</th>
                        <th className="text-right p-2">Percentage</th>
                        <th className="text-left p-2">Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wordFrequencies.slice(0, 100).map((item, index) => (
                        <tr key={item.word} className="border-b border-border/50" data-testid={`row-word-${index}`}>
                          <td className="p-2 text-muted-foreground">#{index + 1}</td>
                          <td className="p-2 font-mono">{item.word}</td>
                          <td className="p-2 text-right font-semibold">{item.count}</td>
                          <td className="p-2 text-right text-muted-foreground">{item.percentage.toFixed(2)}%</td>
                          <td className="p-2">
                            <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(item.percentage * 5, 2)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {wordFrequencies.length > 100 && (
                    <p className="text-center text-muted-foreground mt-4">
                      Showing top 100 results. Total: {wordFrequencies.length} unique words.
                    </p>
                  )}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded" data-testid="stat-total-words">
                    <div className="font-semibold">Total Words</div>
                    <div className="text-2xl font-bold text-primary">
                      {inputText.match(includeNumbers ? /\b[\w]+\b/g : /\b[a-zA-Z]+\b/g)?.length || 0}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded" data-testid="stat-unique-words">
                    <div className="font-semibold">Unique Words</div>
                    <div className="text-2xl font-bold text-primary">{wordFrequencies.length}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded" data-testid="stat-most-common">
                    <div className="font-semibold">Most Common</div>
                    <div className="text-lg font-bold text-primary">
                      {wordFrequencies[0]?.word || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded" data-testid="stat-vocabulary-richness">
                    <div className="font-semibold">Vocabulary Richness</div>
                    <div className="text-2xl font-bold text-primary">
                      {wordFrequencies.length > 0 
                        ? ((wordFrequencies.length / (inputText.match(includeNumbers ? /\b[\w]+\b/g : /\b[a-zA-Z]+\b/g)?.length || 1)) * 100).toFixed(1) + '%'
                        : '0%'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Blog Posts */}
        <RelatedBlogPosts toolId="word-frequency-analyzer" />
      </div>
    </div>
  );
}