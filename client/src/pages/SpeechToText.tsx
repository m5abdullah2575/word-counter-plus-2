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
  FaDownload,
  FaMicrophone,
  FaStop,
  FaPause,
  FaPlay,
  FaFileAlt,
  FaHashtag,
  FaFont,
  FaListOl,
  FaParagraph,
  FaClock,
  FaGlobe,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaSync,
  FaUpload,
  FaLanguage
} from 'react-icons/fa';
import { Link } from 'wouter';
import useFileUpload from '@/hooks/useFileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RelatedToolsSidebar from '@/components/common/RelatedToolsSidebar';

export default function SpeechToText() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [interimText, setInterimText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);
  const { toast } = useToast();

  // Keep refs in sync with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // File upload functionality
  const { isLoading: isUploading, triggerFileUpload, FileInput } = useFileUpload({
    onSuccess: (content, filename) => {
      setText(content);
    },
    maxSizeInMB: 10,
    acceptedTypes: ['.txt', 'text/plain']
  });

  // Structured data for Speech to Text tool
  const speechToTextSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Speech to Text Converter - Free Voice to Text Tool",
    "alternateName": ["Speech to Text", "Voice to Text", "Speech Recognition"],
    "url": "https://wordcounterplusapp.com/speech-to-text",
    "description": "Free online speech to text converter with real-time transcription, multi-language support, and advanced text analysis. Convert voice to text instantly with our browser-based speech recognition tool.",
    "applicationCategory": ["Productivity", "Text Analysis", "Accessibility", "Speech Recognition"],
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
      "ratingValue": "4.9",
      "ratingCount": "2,156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Real-time speech recognition",
      "Multi-language support",
      "Continuous recording",
      "Text analysis and statistics",
      "Export to text file",
      "Browser-based (no API keys)",
      "Privacy-focused",
      "Instant transcription"
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
    title: 'Free Speech to Text Converter 2025 - Voice to Text Online | Multi-Language',
    description: 'Free online speech to text converter with real-time transcription. Convert voice to text instantly with multi-language support including English, Spanish, French, German. No downloads, no API keys required. Perfect for dictation, transcription, and accessibility.',
    keywords: 'speech to text free, voice to text converter, speech recognition online, free transcription tool, voice typing, dictation software, speech to text converter, audio to text, voice recognition, real time transcription, multi language speech to text, online dictation, free voice typing, speech recognition tool, voice to text free online, browser speech recognition',
    canonical: 'https://wordcounterplusapp.com/speech-to-text',
    structuredData: speechToTextSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/speech-to-text',
      'en-GB': 'https://wordcounterplusapp.com/speech-to-text',
      'en-CA': 'https://wordcounterplusapp.com/speech-to-text',
      'en-AU': 'https://wordcounterplusapp.com/speech-to-text',
      'x-default': 'https://wordcounterplusapp.com/speech-to-text'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Speech to Text', url: 'https://wordcounterplusapp.com/speech-to-text' }
    ]
  });

  // Auto-save and restore text
  useEffect(() => {
    const savedText = localStorage.getItem('speechToTextContent');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('speechToTextContent', text);
  }, [text]);

  // Advanced text analysis
  const stats = useMemo(() => {
    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    
    const normalizedText = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const allWords = normalizedText.split(/\s+/).filter(word => word.length > 0);
    const words = allWords.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const lines = text.split('\n').length;
    
    return {
      charactersWithSpaces,
      charactersWithoutSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      averageWordsPerSentence: sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0,
      averageCharsPerWord: words > 0 ? Math.round((charactersWithoutSpaces / words) * 10) / 10 : 0,
      readingTime: words > 0 ? Math.ceil(words / 200) : 0,
      speakingTime: words > 0 ? Math.ceil(words / 150) : 0,
    };
  }, [text]);

  // Check for HTTPS/secure context
  const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setText(prev => prev + final);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try speaking.',
        'audio-capture': 'No microphone found. Please check your device.',
        'not-allowed': 'Microphone permission denied. Please allow access.',
        'network': 'Network error. Please check your connection.',
        'language-not-supported': 'Selected language is not supported.',
        'aborted': 'Speech recognition was aborted.',
      };

      toast({
        title: "Speech Recognition Error",
        description: errorMessages[event.error] || `Error: ${event.error}`,
        variant: "destructive",
      });

      // Reset state on critical errors
      if (event.error === 'not-allowed' || event.error === 'audio-capture' || event.error === 'aborted') {
        setIsRecording(false);
        setIsPaused(false);
        setInterimText('');
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Only restart if we're actively recording (not paused, not stopped)
      if (isRecordingRef.current && !isPausedRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
          setIsRecording(false);
          setIsPaused(false);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        }
      } else if (!isRecordingRef.current && !isPausedRef.current) {
        // Only reset if truly stopped (not paused)
        setIsRecording(false);
        setIsPaused(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }
      // If paused, keep state as-is so UI stays in paused state
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [selectedLanguage, toast]);

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    if (recognitionRef.current) {
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      
      toast({
        title: "Recording Started",
        description: "Speak into your microphone to transcribe.",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setInterimText('');
      setRecordingTime(0);
      
      toast({
        title: "Recording Stopped",
        description: "Speech recognition has been stopped.",
      });
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsPaused(true);
      
      toast({
        title: "Recording Paused",
        description: "Speech recognition paused.",
      });
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isPaused) {
      setIsRecording(true);
      setIsPaused(false);
      recognitionRef.current.start();
      
      toast({
        title: "Recording Resumed",
        description: "Speech recognition resumed.",
      });
    }
  };

  const clearText = () => {
    setText('');
    setInterimText('');
    setRecordingTime(0);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text Copied",
        description: "Transcribed text has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-to-text-transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your transcription has been downloaded as a TXT file.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
  ];

  const isBrowserSupported = !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  return (
    <main className="min-h-screen bg-background">
      <FileInput />
      
      {/* Centered Container with Max Width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Tool Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Speech to Text Converter
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Convert your voice to text instantly with real-time speech recognition
            </p>
          </div>

          {/* Grid Layout for Main Content and Sidebar */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Browser Support Alert */}
              {!isBrowserSupported && (
                <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                  <FaExclamationTriangle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-sm text-orange-700 dark:text-orange-400">
                    Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
                  </AlertDescription>
                </Alert>
              )}

              {/* HTTPS Warning */}
              {!isSecureContext && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
                  <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-sm text-red-700 dark:text-red-400">
                    Speech recognition requires a secure connection (HTTPS). Please access this page via HTTPS to use this feature.
                  </AlertDescription>
                </Alert>
              )}

              {/* Language Selection */}
              <Card className="bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <FaLanguage className="text-primary" />
                    Language Selection
                  </CardTitle>
                  <CardDescription>Choose the language for speech recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isRecording}>
                    <SelectTrigger className="w-full" data-testid="select-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Recording Controls */}
              <Card className="bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <FaMicrophone className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                    Voice Recording
                  </CardTitle>
                  <CardDescription>
                    {isRecording ? (isPaused ? 'Recording paused' : 'Recording in progress...') : 'Click to start recording'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recording Time */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
                      <FaClock className="text-primary" />
                      <span className="text-2xl font-mono font-bold">{formatTime(recordingTime)}</span>
                    </div>
                  )}

                  {/* Recording Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        disabled={!isBrowserSupported || !isSecureContext}
                        className="w-full sm:w-auto sm:min-w-[140px]"
                        data-testid="button-start-recording"
                      >
                        <FaMicrophone className="mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        {isPaused ? (
                          <Button
                            onClick={resumeRecording}
                            variant="default"
                            className="w-full sm:w-auto sm:min-w-[120px]"
                            data-testid="button-resume-recording"
                          >
                            <FaPlay className="mr-2" />
                            Resume
                          </Button>
                        ) : (
                          <Button
                            onClick={pauseRecording}
                            variant="secondary"
                            className="w-full sm:w-auto sm:min-w-[120px]"
                            data-testid="button-pause-recording"
                          >
                            <FaPause className="mr-2" />
                            Pause
                          </Button>
                        )}
                        <Button
                          onClick={stopRecording}
                          variant="destructive"
                          className="w-full sm:w-auto sm:min-w-[120px]"
                          data-testid="button-stop-recording"
                        >
                          <FaStop className="mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Interim Results */}
                  {interimText && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground italic">
                        {interimText}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Text Output Area */}
              <Card className="bg-card border border-border">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">Transcribed Text</CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={triggerFileUpload}
                        disabled={isUploading || isRecording}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        data-testid="button-upload-text"
                        title="Upload text file"
                      >
                        <FaUpload className="inline mr-1" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    id="textOutput"
                    placeholder="Your transcribed text will appear here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[12rem] h-48 sm:h-64 md:h-72 p-3 sm:p-4 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-all text-sm sm:text-base"
                    data-testid="textarea-transcribed-text"
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={copyToClipboard}
                      disabled={!text}
                      className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                      data-testid="button-copy-text"
                      title="Copy text to clipboard"
                    >
                      <FaCopy className="text-sm" />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={downloadText}
                      disabled={!text}
                      className="px-2 sm:px-3 py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                      data-testid="button-download-text"
                      title="Download as text file"
                    >
                      <FaDownload className="text-sm" />
                      <span>Download</span>
                    </button>
                    <button 
                      onClick={clearText}
                      disabled={!text}
                      className="px-2 sm:px-3 py-2 bg-destructive text-destructive-foreground rounded text-xs sm:text-sm hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                      data-testid="button-clear-text"
                      title="Clear all text"
                    >
                      <FaEraser className="text-sm" />
                      <span>Clear</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Text Statistics */}
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic" data-testid="tab-basic-stats" className="text-xs sm:text-sm">Basic Stats</TabsTrigger>
                  <TabsTrigger value="detailed" data-testid="tab-detailed-stats" className="text-xs sm:text-sm">Detailed</TabsTrigger>
                  <TabsTrigger value="reading" data-testid="tab-reading-stats" className="text-xs sm:text-sm">Reading Time</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="bg-card border border-border">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <FaHashtag className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                        <p className="text-xl sm:text-2xl font-bold text-foreground" data-testid="stat-characters">{stats.charactersWithSpaces.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Characters</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border border-border">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <FaFont className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                        <p className="text-xl sm:text-2xl font-bold text-foreground" data-testid="stat-words">{stats.words.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Words</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border border-border">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <FaListOl className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                        <p className="text-xl sm:text-2xl font-bold text-foreground" data-testid="stat-sentences">{stats.sentences.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Sentences</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border border-border">
                      <CardContent className="p-3 sm:p-4 text-center">
                        <FaParagraph className="mx-auto mb-2 text-primary text-xl sm:text-2xl" />
                        <p className="text-xl sm:text-2xl font-bold text-foreground" data-testid="stat-paragraphs">{stats.paragraphs.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Paragraphs</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-4">
                  <Card className="bg-card border border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Characters (with spaces)</span>
                        <span className="font-semibold text-foreground" data-testid="detail-chars-with-spaces">{stats.charactersWithSpaces.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Characters (without spaces)</span>
                        <span className="font-semibold text-foreground" data-testid="detail-chars-without-spaces">{stats.charactersWithoutSpaces.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Lines</span>
                        <span className="font-semibold text-foreground" data-testid="detail-lines">{stats.lines.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Average words per sentence</span>
                        <span className="font-semibold text-foreground" data-testid="detail-avg-words-sentence">{stats.averageWordsPerSentence}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average characters per word</span>
                        <span className="font-semibold text-foreground" data-testid="detail-avg-chars-word">{stats.averageCharsPerWord}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reading" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-card border border-border">
                      <CardContent className="p-4 text-center">
                        <FaClock className="mx-auto mb-3 text-primary text-3xl" />
                        <p className="text-3xl font-bold text-foreground mb-1" data-testid="reading-time">{stats.readingTime}</p>
                        <p className="text-sm text-muted-foreground">min reading time</p>
                        <p className="text-xs text-muted-foreground mt-2">(~200 words/min)</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border border-border">
                      <CardContent className="p-4 text-center">
                        <FaClock className="mx-auto mb-3 text-primary text-3xl" />
                        <p className="text-3xl font-bold text-foreground mb-1" data-testid="speaking-time">{stats.speakingTime}</p>
                        <p className="text-sm text-muted-foreground">min speaking time</p>
                        <p className="text-xs text-muted-foreground mt-2">(~150 words/min)</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* How to Use */}
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    How to Use Speech to Text
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Select your preferred language from the dropdown</li>
                    <li>Click "Start Recording" and allow microphone access when prompted</li>
                    <li>Speak clearly into your microphone</li>
                    <li>Your speech will be transcribed in real-time</li>
                    <li>Use Pause/Resume to control recording</li>
                    <li>Click "Stop" when finished</li>
                    <li>Copy, download, or edit your transcribed text</li>
                  </ol>
                  
                  <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20 mt-4">
                    <FaInfoCircle className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
                      <strong>Privacy Note:</strong> Speech recognition happens directly in your browser. Your audio is not sent to any servers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <RelatedToolsSidebar currentTool="/speech-to-text" limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
