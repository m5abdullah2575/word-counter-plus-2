import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { FaQuoteLeft, FaCopy, FaRedo, FaCog, FaDownload } from 'react-icons/fa';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'accusantium',
  'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt',
  'explicabo', 'nemo', 'enim', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
  'odit', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos', 'qui', 'ratione'
];

export default function LoremGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const { toast } = useToast();

  useSEO({
    title: 'Lorem Ipsum Generator - Word Counter Plus',
    description: 'Generate placeholder Lorem Ipsum text for your designs and layouts. Customize paragraph count and words per paragraph.',
    keywords: 'lorem ipsum generator, placeholder text, dummy text, design text, filler text'
  });

  const generateRandomWords = (count: number, startWithClassic: boolean = false): string[] => {
    const words: string[] = [];
    
    if (startWithClassic && count >= 5) {
      words.push('lorem', 'ipsum', 'dolor', 'sit', 'amet');
      count -= 5;
    }
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * LOREM_WORDS.length);
      words.push(LOREM_WORDS[randomIndex]);
    }
    
    return words;
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const generateLorem = () => {
    const paragraphs: string[] = [];
    
    for (let p = 0; p < paragraphCount; p++) {
      const words = generateRandomWords(wordsPerParagraph, startWithLorem && p === 0);
      
      // Capitalize first word
      if (words.length > 0) {
        words[0] = capitalizeFirstLetter(words[0]);
      }
      
      // Add some random sentence breaks
      let paragraph = '';
      let currentSentence = '';
      
      words.forEach((word, index) => {
        currentSentence += (currentSentence ? ' ' : '') + word;
        
        // Randomly end sentences (roughly every 8-15 words)
        const shouldEndSentence = index > 0 && 
          (Math.random() < 0.15 || currentSentence.split(' ').length > 12) && 
          index < words.length - 1;
        
        if (shouldEndSentence) {
          paragraph += currentSentence + '. ';
          currentSentence = '';
          // Capitalize next word
          if (index + 1 < words.length) {
            words[index + 1] = capitalizeFirstLetter(words[index + 1]);
          }
        } else if (index === words.length - 1) {
          paragraph += currentSentence + '.';
        }
      });
      
      paragraphs.push(paragraph);
    }
    
    setGeneratedText(paragraphs.join('\n\n'));
    
    toast({
      title: "Lorem Ipsum Generated",
      description: `Generated ${paragraphCount} paragraph${paragraphCount !== 1 ? 's' : ''} with ${wordsPerParagraph} words each.`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "Text Copied",
        description: "Lorem ipsum text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = () => {
    if (!generatedText.trim()) {
      toast({
        title: "No Content",
        description: "Please generate some text first before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = new Blob([generatedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lorem-ipsum-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "File Downloaded",
        description: "Lorem ipsum text has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setGeneratedText('');
    setParagraphCount(3);
    setWordsPerParagraph(50);
    setStartWithLorem(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FaQuoteLeft className="text-3xl text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Lorem Ipsum Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate placeholder text for your designs and layouts. Perfect for mockups, prototypes, and content planning.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCog className="text-primary" />
                Generation Settings
              </CardTitle>
              <CardDescription>
                Customize your Lorem Ipsum text generation options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paragraphs" data-testid="label-paragraphs">
                    Number of Paragraphs
                  </Label>
                  <Input
                    id="paragraphs"
                    type="number"
                    min="1"
                    max="20"
                    value={paragraphCount}
                    onChange={(e) => setParagraphCount(Math.max(1, parseInt(e.target.value) || 1))}
                    data-testid="input-paragraph-count"
                  />
                </div>
                <div>
                  <Label htmlFor="words" data-testid="label-words">
                    Words per Paragraph
                  </Label>
                  <Input
                    id="words"
                    type="number"
                    min="10"
                    max="200"
                    value={wordsPerParagraph}
                    onChange={(e) => setWordsPerParagraph(Math.max(10, parseInt(e.target.value) || 50))}
                    data-testid="input-words-per-paragraph"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="startWithLorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-border"
                  data-testid="checkbox-start-with-lorem"
                />
                <Label htmlFor="startWithLorem">Start with "Lorem ipsum dolor sit amet"</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateLorem} data-testid="button-generate">
                  <FaQuoteLeft className="mr-2" />
                  Generate Lorem Ipsum
                </Button>
                <Button variant="outline" onClick={handleReset} data-testid="button-reset">
                  <FaRedo className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Text */}
          {generatedText && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Generated Lorem Ipsum Text</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} data-testid="button-copy">
                      <FaCopy className="mr-2" />
                      Copy Text
                    </Button>
                    <Button variant="destructive" size="sm" onClick={downloadFile} data-testid="button-download">
                      <FaDownload className="mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {paragraphCount} paragraph{paragraphCount !== 1 ? 's' : ''}, approximately {paragraphCount * wordsPerParagraph} words total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="min-h-[300px] resize-none"
                  placeholder="Your generated Lorem Ipsum text will appear here..."
                  data-testid="textarea-generated-text"
                />
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold">Words:</span> {generatedText.split(/\s+/).filter(w => w.length > 0).length}
                  </div>
                  <div>
                    <span className="font-semibold">Characters:</span> {generatedText.length}
                  </div>
                  <div>
                    <span className="font-semibold">Paragraphs:</span> {generatedText.split('\n\n').filter(p => p.trim().length > 0).length}
                  </div>
                  <div>
                    <span className="font-semibold">Sentences:</span> {(generatedText.match(/\./g) || []).length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}