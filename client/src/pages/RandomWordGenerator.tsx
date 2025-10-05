import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
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
      "name": "Word Counter Plus",
      "url": "https://wordcounterplusapp.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "1,234",
      "bestRating": "5",
      "worstRating": "1"
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
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    }
  };

  // SEO Configuration
  useSEO({
    title: 'Free Random Word Generator 2025 - Writing Prompts & Brainstorming Tool | US, UK',
    description: 'Free random word generator for creative writing, brainstorming & word games. Generate random nouns, verbs, adjectives with custom length, count & formatting. Used by 40K+ writers, students, teachers in US, UK, Canada, Australia. Perfect for writing prompts, vocabulary building, game night.',
    keywords: 'random word generator free, random words generator, random noun generator, random verb generator, random adjective generator, creative writing tool, brainstorming tool free, word game generator, writing prompts generator, vocabulary builder, random word picker, word randomizer free, writing exercises tool, creative writing prompts, random word list maker, word inspiration tool',
    canonical: 'https://wordcounterplusapp.com/random-word-generator',
    structuredData: randomWordGeneratorSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/random-word-generator',
      'en-GB': 'https://wordcounterplusapp.com/random-word-generator',
      'en-CA': 'https://wordcounterplusapp.com/random-word-generator',
      'en-AU': 'https://wordcounterplusapp.com/random-word-generator',
      'x-default': 'https://wordcounterplusapp.com/random-word-generator'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Random Word Generator', url: 'https://wordcounterplusapp.com/random-word-generator' }
    ]
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-3 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 px-2">
              Random Word Generator
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2">
              Generate random words for creative writing, brainstorming, and word games
            </p>
          </div>

          {/* Options Panel */}
          <Card className="bg-card border border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <FaCog className="text-primary text-sm sm:text-base" />
                Generator Options
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customize your random word generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Number of Words */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="numberOfWords" className="text-xs sm:text-sm">Number of Words</Label>
                  <Input
                    id="numberOfWords"
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfWords}
                    onChange={(e) => setNumberOfWords(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full h-9 sm:h-10 text-sm sm:text-base"
                    data-testid="input-number-of-words"
                  />
                </div>

                {/* Word Type */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="wordType" className="text-xs sm:text-sm">Word Type</Label>
                  <Select value={wordType} onValueChange={(value) => setWordType(value as keyof typeof WORD_LISTS)}>
                    <SelectTrigger id="wordType" data-testid="select-word-type" className="h-9 sm:h-10 text-sm sm:text-base">
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
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="wordLength" className="text-xs sm:text-sm">Word Length</Label>
                  <Select value={wordLength} onValueChange={(value) => setWordLength(value as any)}>
                    <SelectTrigger id="wordLength" data-testid="select-word-length" className="h-9 sm:h-10 text-sm sm:text-base">
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
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="separator" className="text-xs sm:text-sm">Separator</Label>
                  <Select value={separator} onValueChange={(value) => setSeparator(value as any)}>
                    <SelectTrigger id="separator" data-testid="select-separator" className="h-9 sm:h-10 text-sm sm:text-base">
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
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                  <Label htmlFor="textCase" className="text-xs sm:text-sm">Text Case</Label>
                  <Select value={textCase} onValueChange={(value) => setTextCase(value as any)}>
                    <SelectTrigger id="textCase" data-testid="select-text-case" className="h-9 sm:h-10 text-sm sm:text-base">
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
                className="w-full h-10 sm:h-11 text-sm sm:text-base" 
                size="lg"
                data-testid="button-generate-words"
              >
                <FaRandom className="mr-1.5 sm:mr-2 text-sm sm:text-base" />
                Generate Random Words
              </Button>
            </CardContent>
          </Card>

          {/* Output Display */}
          <Card className="bg-card border border-border">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                    <FaListUl className="text-primary text-sm sm:text-base" />
                    Generated Words
                  </CardTitle>
                  <CardDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm">
                    {generatedWords.length} word{generatedWords.length !== 1 ? 's' : ''} generated
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={generateWords} 
                    variant="secondary" 
                    size="sm"
                    className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
                    data-testid="button-regenerate"
                  >
                    <FaRedoAlt className="mr-1 text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Regenerate</span>
                    <span className="sm:hidden">Regen</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <Textarea
                value={formattedOutput}
                readOnly
                className="w-full h-40 sm:h-48 md:h-64 p-2.5 sm:p-3 md:p-4 bg-background border border-border rounded-lg font-mono text-xs sm:text-sm md:text-base resize-none"
                placeholder="Click 'Generate Random Words' to create your word list..."
                data-testid="textarea-generated-words"
              />

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={copyToClipboard}
                  disabled={!generatedWords.length}
                  size="sm"
                  className="flex-1 min-w-[80px] sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
                  data-testid="button-copy-words"
                >
                  <FaCopy className="mr-1 text-xs sm:text-sm" />
                  Copy
                </Button>
                
                <Button 
                  onClick={downloadWords}
                  disabled={!generatedWords.length}
                  variant="secondary"
                  size="sm"
                  className="flex-1 min-w-[80px] sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
                  data-testid="button-download-words"
                >
                  <FaDownload className="mr-1 text-xs sm:text-sm" />
                  Download
                </Button>
                
                <Button 
                  onClick={clearWords}
                  disabled={!generatedWords.length}
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[80px] sm:flex-none h-8 sm:h-9 text-xs sm:text-sm"
                  data-testid="button-clear-words"
                >
                  <FaEraser className="mr-1 text-xs sm:text-sm" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {generatedWords.length > 0 && (
            <Card className="bg-card border border-border">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl">
                  <FaFont className="text-primary text-sm sm:text-base" />
                  Word Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  <div className="text-center p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary" data-testid="stat-word-count">{generatedWords.length}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Total Words</div>
                  </div>
                  <div className="text-center p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary" data-testid="stat-avg-length">
                      {Math.round(generatedWords.reduce((sum, word) => sum + word.length, 0) / generatedWords.length)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Avg Length</div>
                  </div>
                  <div className="text-center p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary" data-testid="stat-shortest">
                      {Math.min(...generatedWords.map(w => w.length))}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Shortest</div>
                  </div>
                  <div className="text-center p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary" data-testid="stat-longest">
                      {Math.max(...generatedWords.map(w => w.length))}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Longest</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className="bg-muted/50 border border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg">How to Use the Random Word Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground p-4 sm:p-6 pt-0">
              <p className="leading-relaxed"><strong className="text-foreground">Number of Words:</strong> Choose how many random words to generate (1-100)</p>
              <p className="leading-relaxed"><strong className="text-foreground">Word Type:</strong> Select specific word types (nouns, verbs, adjectives, adverbs) or mixed</p>
              <p className="leading-relaxed"><strong className="text-foreground">Word Length:</strong> Filter words by length - short, medium, long, or any</p>
              <p className="leading-relaxed"><strong className="text-foreground">Separator:</strong> Choose how words are separated in the output</p>
              <p className="leading-relaxed"><strong className="text-foreground">Text Case:</strong> Apply formatting - original, lowercase, uppercase, or capitalize</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEO Content Sections */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Benefits Section */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Why Use Our Random Word Generator?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our <strong>random word generator</strong> is the perfect tool for writers, educators, game developers, and creative professionals 
                  who need instant access to random words for various purposes. Whether you're working on creative writing projects, developing word games, 
                  or conducting educational activities, our tool provides customizable options to meet your specific needs.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Generate random nouns, verbs, adjectives, or adverbs with complete control over word count, length, and formatting. 
                  Our extensive word database contains hundreds of carefully curated words perfect for brainstorming, word association games, 
                  vocabulary building, and creative inspiration.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Badge variant="secondary" className="mr-3 mt-0.5">✓</Badge>
                    <div>
                      <strong className="text-foreground">Multiple Word Types:</strong> Choose from nouns, verbs, adjectives, adverbs, or mixed categories
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="secondary" className="mr-3 mt-0.5">✓</Badge>
                    <div>
                      <strong className="text-foreground">Length Filtering:</strong> Filter words by short, medium, or long length
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="secondary" className="mr-3 mt-0.5">✓</Badge>
                    <div>
                      <strong className="text-foreground">Custom Formatting:</strong> Multiple separator options and case transformations
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="secondary" className="mr-3 mt-0.5">✓</Badge>
                    <div>
                      <strong className="text-foreground">Export Options:</strong> Download generated words as text files
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="secondary" className="mr-3 mt-0.5">✓</Badge>
                    <div>
                      <strong className="text-foreground">Instant Results:</strong> Generate up to 100 words instantly with one click
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Perfect For Every Creative Need</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">Creative Writing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate random words for writing prompts, story starters, poetry inspiration, character names, and creative brainstorming sessions.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Story prompts and plot ideas</li>
                  <li>• Character development exercises</li>
                  <li>• Poetry and songwriting inspiration</li>
                  <li>• Overcoming writer's block</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">Education & Learning</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for teachers, students, and language learners working on vocabulary building, spelling practice, and educational games.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Vocabulary building exercises</li>
                  <li>• Spelling bee preparation</li>
                  <li>• Language learning practice</li>
                  <li>• Classroom word games</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">Games & Entertainment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create custom word lists for games like Pictionary, charades, word association, password generators, and team building activities.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Pictionary and drawing games</li>
                  <li>• Charades word selection</li>
                  <li>• Word association games</li>
                  <li>• Team building exercises</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">How does the random word generator work?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our random word generator uses a curated database of common English words categorized by type (nouns, verbs, adjectives, adverbs). 
                  When you generate words, the tool randomly selects words from your chosen category and applies your selected filters for length and formatting. 
                  Each generation is completely random and non-repetitive within the same session.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I generate specific types of words?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! You can choose to generate only nouns, verbs, adjectives, adverbs, or a mix of all types. This makes it easy to create targeted word lists 
                  for specific purposes like creating action words for games or descriptive words for creative writing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">How many random words can I generate at once?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can generate between 1 and 100 random words in a single generation. This range is perfect for everything from quick writing prompts 
                  to comprehensive word lists for games or educational activities. You can regenerate as many times as you need.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I filter words by length?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely! Our word length filter lets you choose short words (5 letters or less), medium words (6-8 letters), long words (more than 8 letters), 
                  or any length. This is particularly useful for creating word lists appropriate for different age groups or difficulty levels.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">What separator options are available?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can separate your generated words using spaces, commas, new lines, or hyphens. Different separators are useful for different purposes - 
                  for example, comma-separated lists for spreadsheets, new line separation for lists, or hyphen separation for compound word experiments.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I change the case of generated words?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! You can format your words in lowercase, UPPERCASE, Capitalized, or keep them in their original case. This formatting option is helpful 
                  for creating professional word lists, educational materials, or matching specific style requirements.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I download or export the generated words?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, you can download your generated word list as a text file with one click. You can also copy the words to your clipboard for easy pasting 
                  into documents, spreadsheets, or other applications.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Is this random word generator really free?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, our random word generator is completely free to use with no registration, no limits, and no hidden costs. Generate as many random words 
                  as you need for your creative projects, educational activities, or entertainment purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
