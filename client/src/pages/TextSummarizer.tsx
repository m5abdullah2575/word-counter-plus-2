import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaCompress, FaCopy, FaRedo, FaCog, FaBullseye } from 'react-icons/fa';

export default function TextSummarizer() {
  const [inputText, setInputText] = useState('');
  const [summarizedText, setSummarizedText] = useState('');
  const [sentenceCount, setSentenceCount] = useState([3]);
  const { toast } = useToast();

  useSEO({
    title: 'Text Summarizer - Word Counter Plus',
    description: 'Summarize long text into key sentences and main points. Extract the most important information from articles and documents.',
    keywords: 'text summarizer, text summary, key points, text extraction, document summarizer'
  });

  const summarizeText = () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }

    // Split text into sentences
    const sentences = inputText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out very short sentences

    if (sentences.length === 0) {
      toast({
        title: "No Valid Sentences",
        description: "Please provide text with complete sentences.",
        variant: "destructive",
      });
      return;
    }

    // Simple scoring algorithm based on word frequency and sentence position
    const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq: Record<string, number> = {};
    
    // Count word frequencies
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences based on word frequency and position
    const scoredSentences = sentences.map((sentence, index) => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      let score = 0;
      
      // Score based on word frequency
      sentenceWords.forEach(word => {
        if (wordFreq[word]) {
          score += wordFreq[word];
        }
      });
      
      // Boost score for sentences at the beginning (usually important)
      if (index < sentences.length * 0.3) {
        score *= 1.5;
      }
      
      // Normalize by sentence length to avoid bias towards long sentences
      score = score / sentenceWords.length;
      
      return { sentence: sentence.trim() + '.', score, index };
    });

    // Select top sentences based on desired count
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(sentenceCount[0], sentences.length))
      .sort((a, b) => a.index - b.index) // Maintain original order
      .map(s => s.sentence);

    setSummarizedText(topSentences.join(' '));
    
    toast({
      title: "Text Summarized",
      description: `Extracted ${topSentences.length} key sentences from ${sentences.length} total sentences.`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summarizedText);
      toast({
        title: "Summary Copied",
        description: "Summarized text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setSummarizedText('');
    setSentenceCount([3]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaCompress className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Text Summarizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract key sentences and main points from long text. Perfect for summarizing articles, documents, and research papers.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCog className="text-primary" />
                Text Input & Settings
              </CardTitle>
              <CardDescription>
                Paste your text below and adjust summarization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inputText">Text to Summarize</Label>
                <Textarea
                  id="inputText"
                  placeholder="Paste the text you want to summarize here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-vertical"
                  data-testid="textarea-input-text"
                />
              </div>

              {/* Summary Settings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Number of Summary Sentences</Label>
                  <span className="text-sm text-muted-foreground font-mono" data-testid="text-sentence-count">
                    {sentenceCount[0]} sentence{sentenceCount[0] !== 1 ? 's' : ''}
                  </span>
                </div>
                <Slider
                  value={sentenceCount}
                  onValueChange={setSentenceCount}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="slider-sentence-count"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={summarizeText} data-testid="button-summarize">
                  <FaCompress className="mr-2" />
                  Summarize Text
                </Button>
                <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                  <FaRedo className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Result */}
          {summarizedText && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FaBullseye className="text-primary" />
                    Text Summary
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                    <FaCopy className="mr-2" />
                    Copy Summary
                  </Button>
                </div>
                <CardDescription>
                  Key sentences extracted from your text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm leading-relaxed" data-testid="text-summary">
                    {summarizedText}
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div data-testid="stat-original-words">
                    <span className="font-semibold">Original Words:</span> {inputText.split(/\s+/).filter(w => w.trim().length > 0).length}
                  </div>
                  <div data-testid="stat-summary-words">
                    <span className="font-semibold">Summary Words:</span> {summarizedText.split(/\s+/).filter(w => w.trim().length > 0).length}
                  </div>
                  <div data-testid="stat-compression">
                    <span className="font-semibold">Compression:</span> {Math.round((1 - summarizedText.length / inputText.length) * 100)}%
                  </div>
                  <div data-testid="stat-sentences">
                    <span className="font-semibold">Sentences:</span> {sentenceCount[0]}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBullseye className="text-primary" />
                Summarization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Works best with well-structured text containing complete sentences</li>
                <li>• Algorithm prioritizes sentences with frequently used keywords</li>
                <li>• Earlier sentences in the text are given slight preference</li>
                <li>• Adjust sentence count based on your original text length</li>
                <li>• For best results, use text with clear main points and topics</li>
                <li>• Short paragraphs and clear structure improve summary quality</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}