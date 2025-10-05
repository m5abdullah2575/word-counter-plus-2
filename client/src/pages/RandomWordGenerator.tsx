import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaDownload,
  FaRandom,
  FaRedoAlt,
  FaListUl,
  FaFont,
  FaCog
} from 'react-icons/fa';

// Comprehensive word lists by category
const WORD_LISTS = {
  nouns: [
    'airplane', 'airport', 'album', 'alphabet', 'apple', 'arm', 'army', 'baby', 'backpack', 'balloon',
    'banana', 'bank', 'barbecue', 'bathroom', 'beach', 'beard', 'bed', 'bedroom', 'bee', 'bicycle',
    'bird', 'birthday', 'blanket', 'blood', 'board', 'boat', 'book', 'border', 'bottle', 'brain',
    'branch', 'bread', 'breakfast', 'bridge', 'brother', 'building', 'butterfly', 'button', 'cake', 'camera',
    'candle', 'car', 'carpet', 'carrot', 'cat', 'chair', 'cheese', 'chicken', 'children', 'chocolate',
    'church', 'city', 'clock', 'cloud', 'coffee', 'computer', 'country', 'crayon', 'crowd', 'crown',
    'desk', 'diamond', 'dinner', 'doctor', 'dog', 'door', 'dragon', 'dress', 'duck', 'ear',
    'earth', 'egg', 'elephant', 'energy', 'engine', 'evening', 'eye', 'family', 'finger', 'fire',
    'fish', 'flag', 'flower', 'football', 'forest', 'fork', 'fountain', 'friend', 'garden', 'ghost',
    'glass', 'gold', 'guitar', 'hammer', 'hand', 'heart', 'helicopter', 'hill', 'home', 'honey',
    'horse', 'hospital', 'house', 'ice', 'island', 'jacket', 'jewel', 'journey', 'juice', 'kangaroo',
    'key', 'king', 'kitchen', 'kite', 'knife', 'ladder', 'lake', 'lamp', 'laptop', 'lemon',
    'letter', 'library', 'light', 'lion', 'lizard', 'lock', 'london', 'machine', 'magazine', 'magic',
    'market', 'memory', 'message', 'mirror', 'money', 'monkey', 'moon', 'morning', 'mountain', 'mouse',
    'music', 'nail', 'nature', 'needle', 'network', 'news', 'night', 'notebook', 'ocean', 'office',
    'orange', 'oxygen', 'painting', 'palace', 'paper', 'park', 'party', 'pencil', 'phone', 'piano',
    'picture', 'planet', 'plastic', 'playground', 'pocket', 'police', 'potato', 'prince', 'princess', 'prison',
    'project', 'puzzle', 'queen', 'question', 'rabbit', 'radio', 'rainbow', 'raincoat', 'river', 'rocket',
    'roof', 'room', 'rose', 'sandwich', 'school', 'science', 'scissors', 'shadow', 'ship', 'shirt',
    'shoe', 'sister', 'sky', 'snake', 'snow', 'soccer', 'society', 'soldier', 'spider', 'spoon',
    'star', 'station', 'stone', 'storm', 'story', 'street', 'sugar', 'summer', 'sun', 'sunset',
    'table', 'teacher', 'telephone', 'television', 'temple', 'theater', 'thunder', 'tiger', 'tomato', 'tower',
    'train', 'tree', 'triangle', 'truck', 'turtle', 'umbrella', 'unicorn', 'universe', 'valley', 'vampire',
    'village', 'violin', 'volcano', 'water', 'weather', 'wedding', 'weekend', 'whale', 'wheel', 'window',
    'winter', 'wizard', 'world', 'yesterday', 'zebra', 'zoo'
  ],
  verbs: [
    'accept', 'achieve', 'admire', 'agree', 'allow', 'answer', 'appear', 'arrange', 'arrive', 'ask',
    'attack', 'believe', 'belong', 'break', 'breathe', 'bring', 'build', 'burn', 'buy', 'call',
    'carry', 'catch', 'celebrate', 'change', 'choose', 'clean', 'climb', 'close', 'collect', 'come',
    'complete', 'consider', 'continue', 'cook', 'count', 'cover', 'create', 'cross', 'cry', 'cut',
    'dance', 'decide', 'deliver', 'describe', 'design', 'destroy', 'develop', 'discover', 'discuss', 'divide',
    'draw', 'dream', 'drink', 'drive', 'drop', 'eat', 'enjoy', 'enter', 'escape', 'examine',
    'explain', 'explore', 'fall', 'feed', 'feel', 'fight', 'fill', 'find', 'finish', 'fix',
    'fly', 'follow', 'forget', 'forgive', 'freeze', 'gather', 'give', 'glow', 'grab', 'grow',
    'happen', 'hate', 'hear', 'help', 'hide', 'hold', 'hope', 'hurry', 'imagine', 'improve',
    'include', 'increase', 'inspire', 'invent', 'invite', 'join', 'jump', 'keep', 'kick', 'kill',
    'kiss', 'know', 'laugh', 'lead', 'learn', 'leave', 'lend', 'listen', 'live', 'look',
    'lose', 'love', 'make', 'march', 'measure', 'meet', 'melt', 'memorize', 'miss', 'mix',
    'move', 'need', 'notice', 'obey', 'observe', 'offer', 'open', 'organize', 'own', 'paint',
    'pass', 'perform', 'plan', 'plant', 'play', 'point', 'practice', 'prepare', 'present', 'press',
    'pretend', 'prevent', 'promise', 'protect', 'provide', 'pull', 'push', 'question', 'rain', 'reach',
    'read', 'realize', 'receive', 'recognize', 'reduce', 'reflect', 'refuse', 'remember', 'remove', 'repeat',
    'replace', 'reply', 'report', 'represent', 'require', 'rescue', 'return', 'reveal', 'ride', 'rise',
    'run', 'save', 'say', 'search', 'see', 'seem', 'sell', 'send', 'serve', 'share',
    'shine', 'shoot', 'shout', 'show', 'sing', 'sink', 'sit', 'sleep', 'slide', 'smell',
    'smile', 'solve', 'speak', 'spend', 'stand', 'start', 'stay', 'steal', 'stop', 'study',
    'succeed', 'suggest', 'support', 'surprise', 'survive', 'swim', 'take', 'talk', 'teach', 'tell',
    'thank', 'think', 'throw', 'touch', 'train', 'travel', 'trust', 'try', 'turn', 'understand',
    'unite', 'use', 'visit', 'wait', 'wake', 'walk', 'want', 'warn', 'wash', 'watch',
    'wave', 'wear', 'whisper', 'win', 'wish', 'wonder', 'work', 'worry', 'write', 'yawn'
  ],
  adjectives: [
    'able', 'active', 'adorable', 'adventurous', 'afraid', 'agreeable', 'alert', 'alive', 'amazing', 'ancient',
    'angry', 'anxious', 'awesome', 'beautiful', 'better', 'big', 'bitter', 'black', 'blue', 'bold',
    'brave', 'bright', 'brilliant', 'broken', 'brown', 'busy', 'calm', 'careful', 'cheerful', 'clean',
    'clear', 'clever', 'cloudy', 'cold', 'colorful', 'comfortable', 'confident', 'cool', 'courageous', 'creative',
    'crowded', 'curious', 'cute', 'dangerous', 'dark', 'deep', 'delicate', 'delicious', 'delightful', 'different',
    'difficult', 'distant', 'dry', 'eager', 'early', 'easy', 'elegant', 'empty', 'enchanting', 'energetic',
    'enthusiastic', 'excellent', 'exciting', 'expensive', 'famous', 'fancy', 'fantastic', 'fast', 'fierce', 'fine',
    'foolish', 'foreign', 'fortunate', 'fragile', 'free', 'friendly', 'funny', 'gentle', 'giant', 'gifted',
    'glamorous', 'glorious', 'golden', 'good', 'gorgeous', 'graceful', 'grand', 'grateful', 'great', 'green',
    'happy', 'hard', 'healthy', 'heavy', 'helpful', 'hidden', 'high', 'hollow', 'honest', 'hot',
    'huge', 'humble', 'hungry', 'important', 'impossible', 'incredible', 'innocent', 'intelligent', 'interesting', 'jolly',
    'joyful', 'kind', 'large', 'late', 'lazy', 'light', 'lively', 'lonely', 'long', 'loud',
    'lovely', 'low', 'lucky', 'magic', 'magnificent', 'massive', 'modern', 'mysterious', 'narrow', 'natural',
    'nervous', 'new', 'nice', 'noble', 'noisy', 'odd', 'old', 'open', 'orange', 'ordinary',
    'peaceful', 'perfect', 'pink', 'pleasant', 'poor', 'popular', 'powerful', 'precious', 'pretty', 'proud',
    'purple', 'quick', 'quiet', 'rapid', 'rare', 'ready', 'real', 'red', 'rich', 'right',
    'rough', 'round', 'royal', 'sad', 'safe', 'scary', 'secret', 'serious', 'sharp', 'shiny',
    'short', 'shy', 'silent', 'silly', 'simple', 'slow', 'small', 'smart', 'smooth', 'soft',
    'special', 'splendid', 'square', 'steep', 'sticky', 'strange', 'strong', 'stunning', 'successful', 'sunny',
    'super', 'sweet', 'tall', 'terrible', 'thick', 'thin', 'tiny', 'tough', 'true', 'ugly',
    'unique', 'unusual', 'useful', 'vast', 'victorious', 'warm', 'weak', 'wealthy', 'weird', 'wet',
    'white', 'wide', 'wild', 'wise', 'wonderful', 'wooden', 'wrong', 'yellow', 'young', 'zealous'
  ],
  adverbs: [
    'absolutely', 'actually', 'always', 'almost', 'also', 'amazingly', 'angrily', 'anxiously', 'awkwardly', 'badly',
    'barely', 'beautifully', 'boldly', 'bravely', 'briefly', 'brightly', 'calmly', 'carefully', 'cheerfully', 'clearly',
    'cleverly', 'closely', 'completely', 'constantly', 'correctly', 'courageously', 'curiously', 'daily', 'deeply', 'definitely',
    'deliberately', 'eagerly', 'early', 'easily', 'elegantly', 'enormously', 'enthusiastically', 'equally', 'especially', 'even',
    'eventually', 'exactly', 'extremely', 'fairly', 'faithfully', 'far', 'fast', 'fiercely', 'finally', 'fondly',
    'fortunately', 'frankly', 'freely', 'frequently', 'gently', 'gladly', 'gracefully', 'gratefully', 'greatly', 'happily',
    'hardly', 'hastily', 'honestly', 'hopelessly', 'hungrily', 'immediately', 'instantly', 'joyfully', 'kindly', 'lazily',
    'likely', 'loudly', 'lovingly', 'loyally', 'mysteriously', 'naturally', 'nearly', 'neatly', 'nervously', 'never',
    'nicely', 'normally', 'obviously', 'occasionally', 'often', 'only', 'openly', 'painfully', 'patiently', 'peacefully',
    'perfectly', 'politely', 'poorly', 'positively', 'possibly', 'powerfully', 'probably', 'proudly', 'quickly', 'quietly',
    'rapidly', 'rarely', 'really', 'recently', 'reluctantly', 'repeatedly', 'rightfully', 'roughly', 'safely', 'seldom',
    'seriously', 'sharply', 'silently', 'simply', 'slowly', 'smoothly', 'softly', 'solemnly', 'sometimes', 'soon',
    'speedily', 'suddenly', 'surprisingly', 'swiftly', 'tenderly', 'terribly', 'thoughtfully', 'tightly', 'today', 'together',
    'tomorrow', 'truly', 'ultimately', 'unexpectedly', 'unfortunately', 'urgently', 'usually', 'utterly', 'very', 'violently',
    'warmly', 'weakly', 'well', 'wildly', 'wisely', 'wonderfully', 'wrongly', 'yesterday', 'zealously'
  ],
  mixed: [] as string[] // Will be populated by combining all types
};

// Populate mixed category
WORD_LISTS.mixed = [
  ...WORD_LISTS.nouns,
  ...WORD_LISTS.verbs,
  ...WORD_LISTS.adjectives,
  ...WORD_LISTS.adverbs
];

export default function RandomWordGenerator() {
  const [numberOfWords, setNumberOfWords] = useState(10);
  const [wordType, setWordType] = useState<keyof typeof WORD_LISTS>('mixed');
  const [wordLength, setWordLength] = useState<'any' | 'short' | 'medium' | 'long'>('any');
  const [separator, setSeparator] = useState<'space' | 'comma' | 'newline' | 'hyphen'>('space');
  const [textCase, setTextCase] = useState<'lowercase' | 'uppercase' | 'capitalize' | 'original'>('original');
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const { toast } = useToast();

  // Structured data for Random Word Generator tool
  const randomWordGeneratorSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Random Word Generator - Creative Writing Tool",
    "alternateName": ["Random Word Generator", "Word Generator Tool", "Random Words"],
    "url": "https://wordcounterplusapp.com/random-word-generator",
    "description": "Generate random words with customizable options for creative writing, brainstorming, and word games. Choose word types, length, count, and formatting options.",
    "applicationCategory": ["Productivity", "Writing", "Creative", "Education"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization", 
      "name": "Word Counter Plus"
    },
    "featureList": [
      "Generate random words",
      "Multiple word types (nouns, verbs, adjectives, adverbs)",
      "Word length filtering",
      "Custom word count",
      "Multiple separator options",
      "Case formatting",
      "Copy to clipboard",
      "Download as text file",
      "Instant regeneration"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // SEO Configuration
  useSEO({
    title: 'Random Word Generator 2025 - Creative Writing & Brainstorming Tool | Word Counter Plus',
    description: 'Free random word generator with customizable options. Generate random nouns, verbs, adjectives, or mixed words for creative writing, brainstorming, word games, and language learning. Choose word count, length, type, and formatting. Perfect for writers, students, and educators.',
    keywords: 'random word generator, random words, word generator, random noun generator, random verb generator, random adjective generator, creative writing tool, brainstorming tool, word game generator, language learning tool, vocabulary builder, writing prompts, random word list, word inspiration, creative writing prompts, writing exercises, random word picker, word randomizer, free word generator, online word generator',
    canonical: 'https://wordcounterplusapp.com/random-word-generator',
    structuredData: randomWordGeneratorSchema
  });

  // Filter words by length
  const filterByLength = (words: string[]) => {
    if (wordLength === 'any') return words;
    
    return words.filter(word => {
      if (wordLength === 'short') return word.length <= 5;
      if (wordLength === 'medium') return word.length > 5 && word.length <= 8;
      if (wordLength === 'long') return word.length > 8;
      return true;
    });
  };

  // Apply case transformation
  const applyCase = (word: string) => {
    if (textCase === 'uppercase') return word.toUpperCase();
    if (textCase === 'lowercase') return word.toLowerCase();
    if (textCase === 'capitalize') return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word;
  };

  // Generate random words
  const generateWords = () => {
    const wordList = WORD_LISTS[wordType];
    const filteredWords = filterByLength(wordList);
    
    if (filteredWords.length === 0) {
      toast({
        title: "No Words Available",
        description: "No words match the selected length criteria. Try different settings.",
        variant: "destructive",
      });
      return;
    }

    const selected: string[] = [];
    const count = Math.min(numberOfWords, filteredWords.length);

    // Use Set to avoid duplicates
    const usedIndices = new Set<number>();
    
    while (selected.length < count) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selected.push(applyCase(filteredWords[randomIndex]));
      }
    }

    setGeneratedWords(selected);
    
    toast({
      title: "Words Generated",
      description: `Successfully generated ${selected.length} random word${selected.length !== 1 ? 's' : ''}.`,
    });
  };

  // Auto-generate on mount
  useEffect(() => {
    generateWords();
  }, []);

  // Format output text
  const formattedOutput = useMemo(() => {
    if (generatedWords.length === 0) return '';
    
    const separatorMap = {
      space: ' ',
      comma: ', ',
      newline: '\n',
      hyphen: '-'
    };
    
    return generatedWords.join(separatorMap[separator]);
  }, [generatedWords, separator]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutput);
      toast({
        title: "Words Copied",
        description: "Generated words have been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadWords = () => {
    const blob = new Blob([formattedOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-words-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your random words have been downloaded.",
    });
  };

  const clearWords = () => {
    setGeneratedWords([]);
    toast({
      title: "Words Cleared",
      description: "All generated words have been cleared.",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Random Word Generator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Generate random words for creative writing, brainstorming, and word games
            </p>
          </div>

          {/* Options Panel */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCog className="text-primary" />
                Generator Options
              </CardTitle>
              <CardDescription>Customize your random word generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Words */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfWords">Number of Words</Label>
                  <Input
                    id="numberOfWords"
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfWords}
                    onChange={(e) => setNumberOfWords(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full"
                    data-testid="input-number-of-words"
                  />
                </div>

                {/* Word Type */}
                <div className="space-y-2">
                  <Label htmlFor="wordType">Word Type</Label>
                  <Select value={wordType} onValueChange={(value) => setWordType(value as keyof typeof WORD_LISTS)}>
                    <SelectTrigger id="wordType" data-testid="select-word-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed (All Types)</SelectItem>
                      <SelectItem value="nouns">Nouns</SelectItem>
                      <SelectItem value="verbs">Verbs</SelectItem>
                      <SelectItem value="adjectives">Adjectives</SelectItem>
                      <SelectItem value="adverbs">Adverbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Word Length */}
                <div className="space-y-2">
                  <Label htmlFor="wordLength">Word Length</Label>
                  <Select value={wordLength} onValueChange={(value) => setWordLength(value as any)}>
                    <SelectTrigger id="wordLength" data-testid="select-word-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Length</SelectItem>
                      <SelectItem value="short">Short (≤5 letters)</SelectItem>
                      <SelectItem value="medium">Medium (6-8 letters)</SelectItem>
                      <SelectItem value="long">Long (&gt;8 letters)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Separator */}
                <div className="space-y-2">
                  <Label htmlFor="separator">Separator</Label>
                  <Select value={separator} onValueChange={(value) => setSeparator(value as any)}>
                    <SelectTrigger id="separator" data-testid="select-separator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="comma">Comma</SelectItem>
                      <SelectItem value="newline">New Line</SelectItem>
                      <SelectItem value="hyphen">Hyphen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Case */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="textCase">Text Case</Label>
                  <Select value={textCase} onValueChange={(value) => setTextCase(value as any)}>
                    <SelectTrigger id="textCase" data-testid="select-text-case">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="lowercase">lowercase</SelectItem>
                      <SelectItem value="uppercase">UPPERCASE</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateWords} 
                className="w-full" 
                size="lg"
                data-testid="button-generate-words"
              >
                <FaRandom className="mr-2" />
                Generate Random Words
              </Button>
            </CardContent>
          </Card>

          {/* Output Display */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FaListUl className="text-primary" />
                    Generated Words
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {generatedWords.length} word{generatedWords.length !== 1 ? 's' : ''} generated
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={generateWords} 
                    variant="secondary" 
                    size="sm"
                    className="flex-1 sm:flex-none"
                    data-testid="button-regenerate"
                  >
                    <FaRedoAlt className="mr-1" />
                    <span className="hidden sm:inline">Regenerate</span>
                    <span className="sm:hidden">Regen</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={formattedOutput}
                readOnly
                className="w-full h-48 sm:h-64 p-3 sm:p-4 bg-background border border-border rounded-lg font-mono text-sm sm:text-base"
                placeholder="Click 'Generate Random Words' to create your word list..."
                data-testid="textarea-generated-words"
              />

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={copyToClipboard}
                  disabled={!generatedWords.length}
                  size="sm"
                  className="flex-1 sm:flex-none"
                  data-testid="button-copy-words"
                >
                  <FaCopy className="mr-1" />
                  Copy
                </Button>
                
                <Button 
                  onClick={downloadWords}
                  disabled={!generatedWords.length}
                  variant="secondary"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  data-testid="button-download-words"
                >
                  <FaDownload className="mr-1" />
                  Download
                </Button>
                
                <Button 
                  onClick={clearWords}
                  disabled={!generatedWords.length}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  data-testid="button-clear-words"
                >
                  <FaEraser className="mr-1" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {generatedWords.length > 0 && (
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaFont className="text-primary" />
                  Word Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-word-count">{generatedWords.length}</div>
                    <div className="text-xs text-muted-foreground">Total Words</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-avg-length">
                      {Math.round(generatedWords.reduce((sum, word) => sum + word.length, 0) / generatedWords.length)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Length</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-shortest">
                      {Math.min(...generatedWords.map(w => w.length))}
                    </div>
                    <div className="text-xs text-muted-foreground">Shortest</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-longest">
                      {Math.max(...generatedWords.map(w => w.length))}
                    </div>
                    <div className="text-xs text-muted-foreground">Longest</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className="bg-muted/50 border border-border">
            <CardHeader>
              <CardTitle className="text-lg">How to Use the Random Word Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Number of Words:</strong> Choose how many random words to generate (1-100)</p>
              <p><strong>Word Type:</strong> Select specific word types (nouns, verbs, adjectives, adverbs) or mixed</p>
              <p><strong>Word Length:</strong> Filter words by length - short, medium, long, or any</p>
              <p><strong>Separator:</strong> Choose how words are separated in the output</p>
              <p><strong>Text Case:</strong> Apply formatting - original, lowercase, uppercase, or capitalize</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
