import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { FaEraser, FaDownload, FaUpload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import useFileUpload from '@/hooks/useFileUpload';

type SortDirection = 'asc' | 'desc';
type SortField = 'word' | 'frequency';

interface WordFrequency {
  word: string;
  frequency: number;
}

export default function WordFrequencyCounter() {
  const [text, setText] = useState('');
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
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

  // Calculate word frequency
  const wordFrequencies = useMemo(() => {
    if (!text.trim()) return [];

    // Normalize text: convert to lowercase and remove special characters
    const normalizedText = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    
    // Split into words and filter out empty strings
    const words = normalizedText.split(/\s+/).filter(word => word.length > 0);
    
    // Count frequency
    const frequencyMap: Record<string, number> = {};
    words.forEach(word => {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });

    // Convert to array of objects
    const frequencies: WordFrequency[] = Object.entries(frequencyMap).map(([word, frequency]) => ({
      word,
      frequency
    }));

    // Sort based on current sort settings
    return frequencies.sort((a, b) => {
      if (sortField === 'frequency') {
        return sortDirection === 'desc' ? b.frequency - a.frequency : a.frequency - b.frequency;
      } else {
        return sortDirection === 'desc' ? b.word.localeCompare(a.word) : a.word.localeCompare(b.word);
      }
    });
  }, [text, sortField, sortDirection]);

  const totalWords = useMemo(() => {
    return wordFrequencies.reduce((sum, item) => sum + item.frequency, 0);
  }, [wordFrequencies]);

  const uniqueWords = wordFrequencies.length;

  const clearText = () => {
    setText('');
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

    // Create CSV content
    const csvHeader = 'Word,Frequency\n';
    const csvRows = wordFrequencies.map(item => `${item.word},${item.frequency}`).join('\n');
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

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Word Frequency Counter
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Count how many times each unique word appears in your text
            </p>
          </div>

          {/* Text Input Area */}
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
                    title="Upload text file"
                  >
                    <FaUpload className="inline mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <span className="sm:hidden">{isUploading ? 'Up...' : 'Upload'}</span>
                  </button>
                  <button 
                    onClick={clearText}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    title="Clear all text"
                  >
                    <FaEraser className="inline mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Clear</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              </div>
              
              <Textarea
                id="textInput"
                placeholder="Type or paste your text here to analyze word frequency..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 sm:h-64 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Statistics Summary */}
          {text.trim() && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total Words</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{totalWords}</div>
              </div>
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Unique Words</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{uniqueWords}</div>
              </div>
              <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border border-border col-span-2 sm:col-span-1">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Diversity Ratio</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {totalWords > 0 ? ((uniqueWords / totalWords) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          )}

          {/* Word Frequency Table */}
          {wordFrequencies.length > 0 && (
            <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Word Frequency Results
                </h2>
                <button 
                  onClick={downloadResults}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 transition-colors"
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wordFrequencies.map((item, index) => (
                      <TableRow key={`${item.word}-${index}`}>
                        <TableCell className="font-medium">{item.word}</TableCell>
                        <TableCell className="text-right">{item.frequency}</TableCell>
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
          )}

          {/* Empty State */}
          {!text.trim() && (
            <div className="bg-card rounded-lg p-8 sm:p-12 shadow-sm border border-border text-center">
              <div className="text-muted-foreground">
                <p className="text-base sm:text-lg mb-2">Enter text above to see word frequency analysis</p>
                <p className="text-xs sm:text-sm">The tool will count how many times each unique word appears in your text</p>
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
