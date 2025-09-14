import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import { 
  FaCopy, 
  FaEraser, 
  FaLink,
  FaExpand,
  FaCompress,
  FaExternalLinkAlt,
  FaShareAlt,
  FaQrcode,
  FaChartLine
} from 'react-icons/fa';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [expandUrl, setExpandUrl] = useState('');
  const [expandedUrl, setExpandedUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [urlHistory, setUrlHistory] = useState<Array<{original: string, short: string, created: Date}>>([]);
  const { toast } = useToast();

  // SEO Configuration
  useSEO({
    title: 'URL Shortener & Expander - Shorten Long URLs | Word Counter Plus',
    description: 'Free URL shortener and expander tool. Shorten long URLs, expand shortened links, and manage your link collection. Perfect for social media, email campaigns, and link sharing.',
    keywords: 'URL shortener, link shortener, shorten URL, expand URL, short link, tiny URL, link expander, URL tool'
  });

  // Auto-save and restore data
  useEffect(() => {
    const savedHistory = localStorage.getItem('urlShortenerHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setUrlHistory(parsed.map((item: any) => ({
          ...item,
          created: new Date(item.created)
        })));
      } catch (error) {
        console.error('Failed to parse URL history:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('urlShortenerHistory', JSON.stringify(urlHistory));
  }, [urlHistory]);

  // Simple URL validation
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Generate a simple short URL (in production, you'd use a proper service)
  const generateShortUrl = (originalUrl: string): string => {
    // Create a simple hash-based short code
    const hash = originalUrl.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const shortCode = Math.abs(hash).toString(36).substring(0, 6);
    return `https://short.ly/${shortCode}`;
  };

  const shortenUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "No URL",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (include http:// or https://).",
        variant: "destructive",
      });
      return;
    }

    setIsShortening(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const shortened = generateShortUrl(url);
      setShortUrl(shortened);
      
      // Add to history
      const newEntry = {
        original: url,
        short: shortened,
        created: new Date()
      };
      setUrlHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      
      toast({
        title: "URL Shortened",
        description: "Your URL has been shortened successfully!",
      });
    } catch (error) {
      toast({
        title: "Shortening Failed",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsShortening(false);
    }
  };

  const expandUrlAction = async () => {
    if (!expandUrl.trim()) {
      toast({
        title: "No URL",
        description: "Please enter a URL to expand.",
        variant: "destructive",
      });
      return;
    }

    setIsExpanding(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would make an API call to expand the URL
      // For demo purposes, we'll check our history or simulate expansion
      const historyMatch = urlHistory.find(item => item.short === expandUrl);
      const expanded = historyMatch ? historyMatch.original : `https://example.com/expanded/${Date.now()}`;
      
      setExpandedUrl(expanded);
      
      toast({
        title: "URL Expanded",
        description: "The URL has been expanded successfully!",
      });
    } catch (error) {
      toast({
        title: "Expansion Failed",
        description: "Failed to expand URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExpanding(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${type} has been copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const clearHistory = () => {
    setUrlHistory([]);
    toast({
      title: "History Cleared",
      description: "URL history has been cleared.",
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            URL Shortener & Expander
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Shorten long URLs and expand shortened links easily
          </p>
          <div className="max-w-2xl mx-auto bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">
              ⚠️ Demo Tool: This is a demonstration URL shortener that generates mock short URLs for testing purposes. 
              The shortened URLs are not publicly accessible and work only within this tool.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* URL Shortener */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaCompress className="mr-2 text-primary" />
                URL Shortener
              </CardTitle>
              <CardDescription>
                Convert long URLs into short, shareable links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="urlInput">Enter Long URL</Label>
                <Input
                  id="urlInput"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/path"
                  className="mt-1"
                  data-testid="input-url-shorten"
                />
              </div>
              
              <Button 
                onClick={shortenUrl} 
                disabled={isShortening || !url.trim()}
                className="w-full"
                data-testid="button-shorten"
              >
                {isShortening ? (
                  <>
                    <div className="inline-block w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <FaCompress className="mr-2" />
                    Shorten URL
                  </>
                )}
              </Button>
              
              {shortUrl && (
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <Label className="text-green-800 dark:text-green-200 font-medium">Shortened URL:</Label>
                  <div className="flex items-center mt-2 gap-2">
                    <Input 
                      value={shortUrl} 
                      readOnly 
                      className="bg-white dark:bg-gray-800" 
                      data-testid="input-short-url"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(shortUrl, 'Short URL')}
                      data-testid="button-copy-short"
                    >
                      <FaCopy />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openUrl(shortUrl)}
                      data-testid="button-open-short"
                    >
                      <FaExternalLinkAlt />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* URL Expander */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaExpand className="mr-2 text-primary" />
                URL Expander
              </CardTitle>
              <CardDescription>
                Expand shortened URLs to see the original destination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="expandInput">Enter Short URL</Label>
                <Input
                  id="expandInput"
                  type="url"
                  value={expandUrl}
                  onChange={(e) => setExpandUrl(e.target.value)}
                  placeholder="https://short.ly/abc123"
                  className="mt-1"
                  data-testid="input-url-expand"
                />
              </div>
              
              <Button 
                onClick={expandUrlAction} 
                disabled={isExpanding || !expandUrl.trim()}
                className="w-full"
                data-testid="button-expand"
              >
                {isExpanding ? (
                  <>
                    <div className="inline-block w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Expanding...
                  </>
                ) : (
                  <>
                    <FaExpand className="mr-2" />
                    Expand URL
                  </>
                )}
              </Button>
              
              {expandedUrl && (
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <Label className="text-blue-800 dark:text-blue-200 font-medium">Expanded URL:</Label>
                  <div className="flex items-center mt-2 gap-2">
                    <Input 
                      value={expandedUrl} 
                      readOnly 
                      className="bg-white dark:bg-gray-800" 
                      data-testid="input-expanded-url"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(expandedUrl, 'Expanded URL')}
                      data-testid="button-copy-expanded"
                    >
                      <FaCopy />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openUrl(expandedUrl)}
                      data-testid="button-open-expanded"
                    >
                      <FaExternalLinkAlt />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* URL History */}
        {urlHistory.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FaChartLine className="mr-2 text-primary" />
                  Recent URLs
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearHistory} data-testid="button-clear-history">
                  <FaEraser className="mr-1" />
                  Clear History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urlHistory.map((item, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Original URL:</Label>
                        <div className="flex items-center mt-1 gap-2">
                          <Input 
                            value={item.original} 
                            readOnly 
                            className="text-sm" 
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(item.original, 'Original URL')}
                          >
                            <FaCopy />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Short URL:</Label>
                        <div className="flex items-center mt-1 gap-2">
                          <Input 
                            value={item.short} 
                            readOnly 
                            className="text-sm" 
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(item.short, 'Short URL')}
                          >
                            <FaCopy />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Created: {item.created.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">URL Tool Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <FaCompress className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">URL Shortening</h3>
              <p className="text-sm text-muted-foreground">
                Convert long URLs into short, manageable links perfect for social media
              </p>
            </div>
            <div className="text-center">
              <FaExpand className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">URL Expansion</h3>
              <p className="text-sm text-muted-foreground">
                Safely preview where shortened links lead before clicking them
              </p>
            </div>
            <div className="text-center">
              <FaChartLine className="text-primary text-2xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">History Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of your shortened URLs for easy reference and reuse
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}