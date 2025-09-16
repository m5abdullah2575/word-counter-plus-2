import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaUpload, 
  FaDownload,
  FaFileAlt,
  FaHashtag,
  FaFont,
  FaListOl,
  FaParagraph,
  FaEye,
  FaClock,
  FaGlobe,
  FaKeyboard,
  FaSmile,
  FaSearch,
  FaBullseye,
  FaTags,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaPenFancy
} from 'react-icons/fa';
import { parseFile, getFileInputAccept } from '@/lib/fileImport';
import { Link } from 'wouter';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{name: string, size: number, type: string} | null>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const lastKeyTimeRef = useRef<number>(0);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'Character Counter - Advanced Text Analysis with SEO Checker | Word Counter Plus',
    description: 'Free advanced character counter with keyword density analysis, SEO optimization checker, emoji counter, language detection, and typing speed tracker. Perfect for content creators, SEO professionals, and writers.',
    keywords: 'character counter, character count, keyword density, SEO checker, text analysis, emoji counter, language detection, typing speed, content optimization, social media character limit, twitter character count, facebook character limit, meta description checker'
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('characterCounterText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('characterCounterText', text);
  }, [text]);

  // Advanced text analysis with unique features
  const stats = useMemo(() => {
    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    
    // Consolidated tokenization with Unicode-aware regex
    const normalizedText = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const allWords = normalizedText.split(/\s+/).filter(word => word.length > 0);
    const words = allWords.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const lines = text.split('\n').length;
    
    // Emoji and special character analysis with proper Unicode support
    const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
    const emojis = text.match(emojiRegex) || [];
    const specialChars = text.match(/[^\w\s]/g) || [];
    const numbers = text.match(/\d/g) || [];
    const upperCaseLetters = text.match(/[A-Z]/g) || [];
    const lowerCaseLetters = text.match(/[a-z]/g) || [];
    
    // Advanced language detection with better Unicode support
    const detectLanguage = () => {
      if (!text.trim()) return 'Unknown';
      
      const stopwords = {
        english: ['the', 'and', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'this', 'that', 'they', 'them', 'their', 'there', 'then', 'than', 'or', 'but', 'not', 'can', 'all', 'any', 'may', 'say', 'said', 'each', 'which', 'she', 'her', 'him', 'his', 'how', 'its', 'our', 'out', 'day', 'get', 'use', 'man', 'new', 'now', 'way', 'who', 'boy', 'did', 'what', 'come', 'work', 'life', 'time', 'year', 'look', 'just', 'like', 'over', 'also', 'back', 'after', 'first', 'well', 'water', 'little', 'only', 'know', 'place', 'years', 'live', 'me', 'give', 'most', 'very', 'still', 'see', 'own', 'under', 'last'],
        spanish: ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'las', 'los', 'una', 'todo', 'le', 'su', 'tiene', 'como', 'me', 'si', 'ya', 'pero', 'más', 'este', 'ser', 'uno', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo', 'nosotros', 'mi', 'mis', 'tú', 'te', 'ti', 'tu', 'tus', 'ellas', 'nosotras', 'vosotros', 'vosotras', 'os', 'mío', 'mía', 'míos', 'mías'],
        french: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus', 'par', 'grand', 'un', 'si', 'me', 'mais', 'du', 'au', 'nous', 'comme', 'ou', 'si', 'leur', 'y', 'dire', 'elle', 'très', 'ce', 'de', 'nouveau', 'savoir', 'être', 'autre', 'après', 'sans', 'sous', 'peut', 'pendant', 'encore', 'place', 'aller', 'venir', 'à', 'celui', 'faire', 'vous', 'cela', 'je', 'celui', 'où', 'voie', 'là', 'les', 'ces', 'entre', 'cette', 'tous', 'ses', 'peu', 'elle', 'nos', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'leurs', 'notre', 'votre', 'moi', 'toi', 'lui', 'eux', 'elles']
      };
      
      // Use the same tokenization pattern for consistency
      const textNormalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
      const textWords = textNormalized.split(/\s+/).filter(word => word.length > 0);
      
      const englishMatches = textWords.filter(word => stopwords.english.includes(word)).length;
      const spanishMatches = textWords.filter(word => stopwords.spanish.includes(word)).length;
      const frenchMatches = textWords.filter(word => stopwords.french.includes(word)).length;
      
      const totalWords = textWords.length;
      if (totalWords === 0) return 'Unknown';
      
      // Calculate percentage matches
      const englishPercentage = (englishMatches / totalWords) * 100;
      const spanishPercentage = (spanishMatches / totalWords) * 100;
      const frenchPercentage = (frenchMatches / totalWords) * 100;
      
      // Require at least 5% match for detection
      const threshold = 5;
      
      if (englishPercentage >= threshold && englishPercentage > spanishPercentage && englishPercentage > frenchPercentage) return 'English';
      if (spanishPercentage >= threshold && spanishPercentage > englishPercentage && spanishPercentage > frenchPercentage) return 'Spanish';
      if (frenchPercentage >= threshold && frenchPercentage > englishPercentage && frenchPercentage > spanishPercentage) return 'French';
      return 'Mixed/Other';
    };
    
    // Text complexity score
    const calculateComplexity = () => {
      if (words === 0) return 0;
      const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
      const avgCharsPerWord = charactersWithoutSpaces / words;
      const complexityScore = (avgWordsPerSentence * 0.4) + (avgCharsPerWord * 0.6);
      return Math.min(Math.round(complexityScore), 100);
    };
    
    return {
      charactersWithSpaces,
      charactersWithoutSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      emojis: emojis.length,
      specialChars: specialChars.length,
      numbers: numbers.length,
      upperCaseLetters: upperCaseLetters.length,
      lowerCaseLetters: lowerCaseLetters.length,
      averageWordsPerSentence: sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0,
      averageCharsPerWord: words > 0 ? Math.round((charactersWithoutSpaces / words) * 10) / 10 : 0,
      readingTime: words > 0 ? Math.ceil(words / 200) : 0,
      speakingTime: words > 0 ? Math.ceil(words / 150) : 0,
      detectedLanguage: detectLanguage(),
      complexityScore: calculateComplexity()
    };
  }, [text])

  // Social media character limits
  const socialLimits = {
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
    youtube: 5000,
    tiktok: 300
  };

  // Advanced keyword density analysis with language-specific stopword filtering
  const keywordAnalysis = useMemo(() => {
    if (!text.trim()) return [];
    
    // Reuse the consolidated tokenization and language detection from stats
    const normalizedText = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const allWords = normalizedText.split(/\s+/).filter(word => word.length > 2);
    
    // Get detected language to apply appropriate stopword filtering
    const detectedLang = stats.detectedLanguage?.toLowerCase();
    
    // Language-specific stopwords
    const stopwords = {
      english: ['the', 'and', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'this', 'that', 'they', 'them', 'their', 'there', 'then', 'than', 'or', 'but', 'not', 'can', 'all', 'any', 'may', 'say', 'said', 'each', 'which', 'she', 'her', 'him', 'his', 'how', 'its', 'our', 'out', 'day', 'get', 'use', 'man', 'new', 'now', 'way', 'who', 'boy', 'did', 'what', 'come', 'work', 'life', 'time', 'year', 'look', 'just', 'like', 'over', 'also', 'back', 'after', 'first', 'well', 'water', 'little', 'only', 'know', 'place', 'years', 'live', 'me', 'give', 'most', 'very', 'still', 'see', 'own', 'under', 'last'],
      spanish: ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'las', 'los', 'una', 'todo', 'le', 'su', 'tiene', 'como', 'me', 'si', 'ya', 'pero', 'más', 'este', 'ser', 'uno', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo', 'nosotros', 'mi', 'mis', 'tú', 'te', 'ti', 'tu', 'tus'],
      french: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus', 'par', 'grand', 'un', 'si', 'me', 'mais', 'du', 'au', 'nous', 'comme', 'ou', 'si', 'leur', 'y', 'dire', 'elle', 'très', 'ce', 'de', 'nouveau', 'savoir', 'être', 'autre', 'après', 'sans', 'sous', 'peut', 'pendant', 'encore', 'place', 'aller', 'venir', 'à', 'celui', 'faire', 'vous', 'cela', 'je', 'celui', 'où', 'voie', 'là', 'les', 'ces', 'entre', 'cette', 'tous', 'ses', 'peu', 'elle', 'nos', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes', 'tes']
    };
    
    // Filter out stopwords based on detected language
    let filteredWords = allWords;
    if (detectedLang === 'english') {
      filteredWords = allWords.filter(word => !stopwords.english.includes(word));
    } else if (detectedLang === 'spanish') {
      filteredWords = allWords.filter(word => !stopwords.spanish.includes(word));
    } else if (detectedLang === 'french') {
      filteredWords = allWords.filter(word => !stopwords.french.includes(word));
    }
    
    const wordCount = filteredWords.length;
    if (wordCount === 0) return [];
    
    const frequency: Record<string, number> = {};
    
    filteredWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / wordCount) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 keywords
  }, [text, stats.detectedLanguage]);
  
  // SEO optimization checker with proper heuristics
  const seoCheck = useMemo(() => {
    // Extract potential title (first line) and meta description (first 160 chars)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const potentialTitle = lines[0]?.trim() || '';
    const potentialMeta = text.trim().substring(0, 160);
    
    const titleLength = potentialTitle.length;
    const metaLength = potentialMeta.length;
    
    const titleOptimal = titleLength >= 30 && titleLength <= 60;
    const metaOptimal = metaLength >= 120 && metaLength <= 160;
    const keywordDensityOptimal = keywordAnalysis.length > 0 && parseFloat(keywordAnalysis[0]?.density || '0') >= 1 && parseFloat(keywordAnalysis[0]?.density || '0') <= 3;
    
    return {
      titleTag: {
        optimal: titleOptimal,
        content: potentialTitle,
        length: titleLength,
        message: !potentialTitle ? 'No title detected (use first line)' :
          titleOptimal ? `Perfect title length (${titleLength} chars)` : 
          titleLength < 30 ? `Title too short (${titleLength}/30-60 chars)` : 
          `Title too long (${titleLength}/30-60 chars)`
      },
      metaDescription: {
        optimal: metaOptimal,
        content: potentialMeta,
        length: metaLength,
        message: !potentialMeta ? 'No content for meta description' :
          metaOptimal ? `Perfect meta description length (${metaLength} chars)` :
          metaLength < 120 ? `Meta description too short (${metaLength}/120-160 chars)` :
          `Meta description too long (${metaLength}/120-160 chars)`
      },
      keywordDensity: {
        optimal: keywordDensityOptimal,
        topKeyword: keywordAnalysis[0]?.word || '',
        density: keywordAnalysis[0]?.density || '0',
        message: keywordAnalysis.length === 0 ? 'No keywords detected' :
          keywordDensityOptimal ? `Good keyword density: "${keywordAnalysis[0].word}" (${keywordAnalysis[0].density}%)` :
          parseFloat(keywordAnalysis[0]?.density || '0') < 1 ? `Keyword density too low: "${keywordAnalysis[0].word}" (${keywordAnalysis[0].density}% - aim for 1-3%)` :
          `Keyword density too high: "${keywordAnalysis[0].word}" (${keywordAnalysis[0].density}% - aim for 1-3%)`
      }
    };
  }, [text, keywordAnalysis]);
  
  // Typing speed calculation
  const typingSpeed = useMemo(() => {
    if (!typingStartTime || keystrokeCount === 0) return 0;
    const timeElapsed = (Date.now() - typingStartTime) / 60000; // minutes
    return timeElapsed > 0 ? Math.round(keystrokeCount / timeElapsed) : 0;
  }, [typingStartTime, keystrokeCount]);

  const clearText = () => {
    setText('');
    setUploadedFileInfo(null);
    setTypingStartTime(null);
    setKeystrokeCount(0);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text Copied",
        description: "Text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast({
        title: "Text Pasted",
        description: "Text has been pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-count-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your text has been downloaded as a TXT file.",
    });
  };

  // File upload functionality
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';
    setIsUploading(true);
    
    try {
      const result = await parseFile(file);
      setText(result.text);
      
      setUploadedFileInfo({
        name: result.fileName,
        size: result.fileSize,
        type: result.fileType
      });
      
      toast({
        title: "File Processed Successfully!",
        description: `"${result.fileName}" analyzed successfully.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Character limit helper function
  const getCharacterLimitStatus = (limit: number) => {
    const remaining = limit - stats.charactersWithSpaces;
    const percentage = (stats.charactersWithSpaces / limit) * 100;
    
    if (percentage >= 100) return { color: 'bg-red-500', status: 'Over limit' };
    if (percentage >= 90) return { color: 'bg-orange-500', status: 'Near limit' };
    if (percentage >= 70) return { color: 'bg-yellow-500', status: 'Approaching limit' };
    return { color: 'bg-green-500', status: 'Within limit' };
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Tool Area */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Character Counter
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Count characters, words, sentences, and analyze your text in real-time
            </p>
          </div>

          {/* File Information Display */}
          {uploadedFileInfo && (
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-4">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                <FaUpload className="mr-2" />
                File Analysis Complete
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">File:</span>
                  <p className="text-green-800 dark:text-green-200 break-all" data-testid="text-uploaded-filename">{uploadedFileInfo.name}</p>
                </div>
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Size:</span>
                  <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filesize">
                    {Math.round(uploadedFileInfo.size / 1024)}KB
                  </p>
                </div>
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Type:</span>
                  <p className="text-green-800 dark:text-green-200" data-testid="text-uploaded-filetype">{uploadedFileInfo.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Text Input Area */}
          <div className="bg-card rounded-lg p-3 sm:p-6 shadow-sm border border-border">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                <label htmlFor="textInput" className="text-base sm:text-lg font-semibold text-foreground">Enter Your Text</label>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* File Upload */}
                  <label className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-sm transition-colors text-center ${
                    isUploading 
                      ? 'bg-primary/50 text-primary-foreground cursor-wait' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer'
                  }`}
                         data-testid="button-upload-file"
                         title="Upload files: Text (.txt, .md, .html, .rtf, .csv), PDF (.pdf), or Word documents (.docx)">
                    {isUploading ? (
                      <>
                        <div className="inline-block w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                        <span className="hidden sm:inline">Uploading...</span>
                        <span className="sm:hidden">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="inline mr-1" aria-hidden="true" />
                        <span className="hidden sm:inline">Upload</span>
                        <span className="sm:hidden">Upload File</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept={getFileInputAccept()} 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="sr-only"
                      aria-label="Upload files: Text (.txt, .md, .html, .rtf, .csv), PDF (.pdf), or Word documents (.docx)"
                    />
                  </label>

                  {/* Paste Button */}
                  <button 
                    onClick={pasteText}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    data-testid="button-paste-text"
                    aria-label="Paste text from clipboard"
                  >
                    Paste
                  </button>

                  {/* Clear Button */}
                  <button 
                    onClick={clearText}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    data-testid="button-clear-text"
                    aria-label="Clear all text"
                  >
                    <FaEraser className="inline mr-1" aria-hidden="true" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
            
            {/* Hidden label for screen readers */}
            <textarea 
              id="textInput"
              aria-describedby="textHelp"
              value={text}
              onChange={(e) => {
                const newText = e.target.value;
                setText(newText);
                
                // Track typing speed with improved logic
                const now = Date.now();
                const lastKeyTime = lastKeyTimeRef.current;
                
                if (!typingStartTime && newText.length > 0) {
                  setTypingStartTime(now);
                  setKeystrokeCount(1);
                } else if (newText.length > 0) {
                  // Only count if typing within reasonable time
                  if (now - lastKeyTime < 1000) {
                    setKeystrokeCount(prev => prev + 1);
                  } else {
                    // Reset if more than 1 second gap
                    setTypingStartTime(now);
                    setKeystrokeCount(1);
                  }
                }
                
                lastKeyTimeRef.current = now;
              }}
              className="w-full h-48 sm:h-64 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm sm:text-base" 
              placeholder="Start typing or paste your text here for advanced character analysis with SEO insights, keyword density, emoji counting, and more..."
              data-testid="textarea-character-input"
            />

            {/* Helper text (screen readers کے لیے) */}
            <p id="textHelp" className="sr-only">
              Paste or type your text here. The tool will count characters, words, sentences, and show analysis in real-time.
            </p>
            
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="px-2 sm:px-3 py-1.5 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700 transition-colors"
                  data-testid="button-copy-text"
                >
                  <FaCopy className="inline mr-1" />
                  Copy
                </button>
                <button 
                  onClick={downloadText}
                  className="px-2 sm:px-3 py-1.5 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                  data-testid="button-download-text"
                >
                  <FaDownload className="inline mr-1" />
                  Download
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.charactersWithSpaces} characters • {stats.words} words • {stats.detectedLanguage}
              </div>
            </div>
          </div>

          {/* Advanced Statistics Panel */}
          <div className="space-y-4">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                {/* Character Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaHashtag className="mr-2 text-primary" />
                      Character Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">With spaces:</span>
                      <span className="font-bold text-2xl text-primary" data-testid="text-chars-with-spaces">
                        {stats.charactersWithSpaces}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Without spaces:</span>
                      <span className="font-bold text-xl" data-testid="text-chars-without-spaces">
                        {stats.charactersWithoutSpaces}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Text Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaFileAlt className="mr-2 text-primary" />
                      Text Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center">
                        <FaFont className="mr-1" /> Words:
                      </span>
                      <span className="font-semibold" data-testid="text-word-count">{stats.words}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center">
                        <FaListOl className="mr-1" /> Sentences:
                      </span>
                      <span className="font-semibold" data-testid="text-sentence-count">{stats.sentences}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center">
                        <FaParagraph className="mr-1" /> Paragraphs:
                      </span>
                      <span className="font-semibold" data-testid="text-paragraph-count">{stats.paragraphs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines:</span>
                      <span className="font-semibold" data-testid="text-line-count">{stats.lines}</span>
                    </div>
                    {stats.averageWordsPerSentence > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg words/sentence:</span>
                        <span className="font-semibold">{stats.averageWordsPerSentence}</span>
                      </div>
                    )}
                    {stats.averageCharsPerWord > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg chars/word:</span>
                        <span className="font-semibold">{stats.averageCharsPerWord}</span>
                      </div>
                    )}
                    {stats.readingTime > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center">
                          <FaClock className="mr-1" /> Reading time:
                        </span>
                        <span className="font-semibold">{stats.readingTime} min</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Media Limits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaEye className="mr-2 text-primary" />
                      Social Media Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(socialLimits).map(([platform, limit]) => {
                      const status = getCharacterLimitStatus(limit);
                      const remaining = limit - stats.charactersWithSpaces;
                      const percentage = Math.min((stats.charactersWithSpaces / limit) * 100, 100);
                      
                      return (
                        <div key={platform} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{platform}:</span>
                            <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                              {remaining < 0 ? `${Math.abs(remaining)} over` : `${remaining} left`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${status.color}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                {/* Character Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaSmile className="mr-2 text-primary" />
                      Character Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center">
                        <FaSmile className="mr-1" /> Emojis:
                      </span>
                      <span className="font-semibold" data-testid="text-emoji-count">{stats.emojis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Special characters:</span>
                      <span className="font-semibold">{stats.specialChars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Numbers:</span>
                      <span className="font-semibold">{stats.numbers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uppercase letters:</span>
                      <span className="font-semibold">{stats.upperCaseLetters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowercase letters:</span>
                      <span className="font-semibold">{stats.lowerCaseLetters}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Language & Complexity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaGlobe className="mr-2 text-primary" />
                      Text Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center">
                        <FaGlobe className="mr-1" /> Detected language:
                      </span>
                      <span className="font-semibold">{stats.detectedLanguage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complexity score:</span>
                      <span className="font-semibold">{stats.complexityScore}/100</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Text Complexity</span>
                        <span>{stats.complexityScore}%</span>
                      </div>
                      <Progress value={stats.complexityScore} className="h-2" />
                    </div>
                    {stats.speakingTime > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center">
                          <FaClock className="mr-1" /> Speaking time:
                        </span>
                        <span className="font-semibold">{stats.speakingTime} min</span>
                      </div>
                    )}
                    {typingSpeed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center">
                          <FaKeyboard className="mr-1" /> Typing speed:
                        </span>
                        <span className="font-semibold">{typingSpeed} CPM</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                {/* SEO Optimization Checker */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaSearch className="mr-2 text-primary" />
                      SEO Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto overscroll-contain scroll-smooth">
                      <div className="space-y-4 pr-2">
                        <Alert className={seoCheck.titleTag.optimal ? 'border-green-500' : 'border-orange-500'}>
                          <div className="flex items-center gap-3">
                            {seoCheck.titleTag.optimal ? (
                              <FaCheckCircle className="text-green-500 shrink-0" />
                            ) : (
                              <FaExclamationTriangle className="text-orange-500 shrink-0" />
                            )}
                            <AlertDescription className="min-w-0 break-words">
                              <strong>Title Tag:</strong> {seoCheck.titleTag.message}
                            </AlertDescription>
                          </div>
                        </Alert>
                        
                        <Alert className={seoCheck.metaDescription.optimal ? 'border-green-500' : 'border-orange-500'}>
                          <div className="flex items-center gap-3">
                            {seoCheck.metaDescription.optimal ? (
                              <FaCheckCircle className="text-green-500 shrink-0" />
                            ) : (
                              <FaExclamationTriangle className="text-orange-500 shrink-0" />
                            )}
                            <AlertDescription className="min-w-0 break-words">
                              <strong>Meta Description:</strong> {seoCheck.metaDescription.message}
                            </AlertDescription>
                          </div>
                        </Alert>
                        
                        <Alert className={seoCheck.keywordDensity.optimal ? 'border-green-500' : 'border-orange-500'}>
                          <div className="flex items-center gap-3">
                            {seoCheck.keywordDensity.optimal ? (
                              <FaCheckCircle className="text-green-500 shrink-0" />
                            ) : (
                              <FaInfoCircle className="text-orange-500 shrink-0" />
                            )}
                            <AlertDescription className="min-w-0 break-words">
                              <strong>Keyword Density:</strong> {seoCheck.keywordDensity.message}
                            </AlertDescription>
                          </div>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keywords" className="space-y-4">
                {/* Keyword Density Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaTags className="mr-2 text-primary" />
                      Keyword Density
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {keywordAnalysis.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto overscroll-contain scroll-smooth">
                        <div className="space-y-3 pr-2">
                          {keywordAnalysis.map((keyword, index) => (
                            <div key={keyword.word} className="flex items-center justify-between gap-4">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <Badge variant={index < 3 ? 'default' : 'secondary'} className="shrink-0">
                                  #{index + 1}
                                </Badge>
                                <span className="font-medium break-all overflow-hidden text-ellipsis">{keyword.word}</span>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {keyword.count} times
                                </span>
                                <Badge 
                                  variant={parseFloat(keyword.density) >= 1 && parseFloat(keyword.density) <= 3 ? 'default' : 'outline'}
                                  className="shrink-0"
                                >
                                  {keyword.density}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Enter text to see keyword density analysis
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 lg:sticky lg:top-4 lg:h-fit">
          {/* Related Tools */}
          <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Related Tools</h3>
            <div className="grid grid-cols-1 gap-3">
              {/* Word Counter */}
              <Link href="/" 
                    className="group flex items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" 
                    data-testid="link-word-counter"
                    aria-label="Go to Word Counter tool">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <FaPenFancy className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Word Counter</h4>
                  <p className="text-xs text-muted-foreground">Count words & analyze text</p>
                </div>
              </Link>

              {/* Text Case Converter */}
              <Link href="/text-case-convert" 
                    className="group flex items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" 
                    data-testid="link-text-case-converter"
                    aria-label="Go to Text Case Converter tool">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <FaFont className="text-green-600 dark:text-green-400 text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Case Converter</h4>
                  <p className="text-xs text-muted-foreground">Change text case format</p>
                </div>
              </Link>

              {/* Reading Time Calculator */}
              <Link href="/reading-time-calculator" 
                    className="group flex items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" 
                    data-testid="link-reading-time"
                    aria-label="Go to Reading Time Calculator tool">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <FaClock className="text-purple-600 dark:text-purple-400 text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Reading Time</h4>
                  <p className="text-xs text-muted-foreground">Calculate read duration</p>
                </div>
              </Link>

              {/* Line Counter */}
              <Link href="/line-counter" 
                    className="group flex items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" 
                    data-testid="link-line-counter"
                    aria-label="Go to Line Counter tool">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <FaListOl className="text-orange-600 dark:text-orange-400 text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Line Counter</h4>
                  <p className="text-xs text-muted-foreground">Count text lines</p>
                </div>
              </Link>
            </div>
            
            <div className="mt-4 pt-3 border-t border-border">
              <Link href="/tools" 
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center py-2 hover:bg-primary/5 rounded focus-visible:ring-2 focus-visible:ring-primary" 
                    data-testid="link-more-tools">
                More Text Tools →
              </Link>
            </div>
          </div>

          {/* Other Tools Category */}
          <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Other Tools</h3>
            <div className="space-y-3">
              <a href="/lorem-generator" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" data-testid="link-lorem-generator">
                Lorem Ipsum Generator
              </a>
              <a href="/password-generator" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" data-testid="link-password-generator">
                Password Generator
              </a>
              <a href="/text-encoder" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" data-testid="link-text-encoder">
                Text Encoder/Decoder
              </a>
              <a href="/qr-code-generator" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" data-testid="link-qr-generator">
                QR Code Generator
              </a>
              <a href="/json-formatter" className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors" data-testid="link-json-formatter">
                JSON Formatter
              </a>
            </div>
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center text-sm text-muted-foreground">
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-48 flex items-center justify-center mb-2">
                <span className="text-gray-500 dark:text-gray-400">Advertisement Space</span>
              </div>
              <p className="text-xs">Promote your business here</p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">💡 Writing Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
                Keep sentences under 20 words for better readability
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
                Use social media character limits: Twitter 280, Instagram 2200
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
                Meta descriptions should be 120-160 characters
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-600 mr-2 mt-0.5 flex-shrink-0" aria-label="Check Icon" />
                Use emojis sparingly for professional content
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced Character Counter Features Section - Full Width at Bottom */}
      <div className="mt-12 bg-muted/50 rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Advanced Character Counter Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3">
            <FaHashtag className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Real-time Analysis</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Advanced character counting with emoji detection and typing speed tracking
            </p>
          </div>
          <div className="text-center p-3">
            <FaSearch className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">SEO Optimization</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Check title tags, meta descriptions, and keyword density for better ranking
            </p>
          </div>
          <div className="text-center p-3">
            <FaTags className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Keyword Density</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Analyze keyword frequency and density for content optimization
            </p>
          </div>
          <div className="text-center p-3">
            <FaGlobe className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Language Detection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Automatic language detection with complexity scoring
            </p>
          </div>
          <div className="text-center p-3">
            <FaSmile className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Character Breakdown</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Count emojis, special characters, numbers, and case analysis
            </p>
          </div>
          <div className="text-center p-3">
            <FaUpload className="text-primary text-xl sm:text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">File Support</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upload TXT, PDF, Word documents, and more file formats
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}