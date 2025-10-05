import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Search, TrendingUp, CheckCircle, AlertCircle, Target, Zap, Share2, Image as ImageIcon, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { FaChartLine, FaSearch, FaBullseye, FaCheckCircle, FaLightbulb, FaChartBar, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function SEOContentAnalyzer() {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [competitorWordCount, setCompetitorWordCount] = useState('');

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "SEO Content Analyzer 2025 - Advanced Content Optimization Tool",
    "alternateName": ["SEO Content Analyzer", "Content Optimization Tool", "SERP Preview", "Meta Tag Optimizer"],
    "url": "https://wordcounterplusapp.com/seo-content-analyzer",
    "description": "Advanced SEO tool with SERP preview, social media cards, LSI keywords, featured snippet optimizer, FAQ schema generator, and competitor analysis for better rankings.",
    "applicationCategory": ["Productivity", "SEO Tools", "Content Marketing", "Digital Marketing"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Word Counter Plus"
    },
    "featureList": [
      "SERP preview simulator",
      "Social media card preview",
      "Keyword density analysis",
      "LSI keyword suggestions",
      "Featured snippet optimizer",
      "FAQ schema generator",
      "Title A/B testing",
      "Image alt text suggestions",
      "Competitor analysis"
    ]
  };

  useSEO({
    title: 'SEO Content Analyzer 2025 - SERP Preview, Social Cards & Keyword Optimizer',
    description: 'Professional SEO analyzer with SERP preview simulator, Twitter/Facebook card preview, LSI keywords, featured snippet optimization, FAQ schema generator, and competitor content analysis. Free advanced tool for content marketers.',
    keywords: 'seo content analyzer, serp preview, social media cards, keyword density, content optimization tool, meta tag generator, lsi keywords, featured snippets, faq schema, title optimizer, alt text generator, competitor analysis',
    canonical: 'https://wordcounterplusapp.com/seo-content-analyzer',
    structuredData: seoSchema
  });

  // Enhanced SEO Analysis
  const analyzeSEO = () => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Keyword analysis
    const targetKeywordLower = targetKeyword.toLowerCase();
    const textLower = text.toLowerCase();
    const keywordCount = targetKeywordLower ? (textLower.match(new RegExp(targetKeywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length : 0;
    const keywordDensity = words.length > 0 && targetKeywordLower ? (keywordCount / words.length) * 100 : 0;

    // LSI Keywords (expanded)
    const lsiKeywordSuggestions = generateLSIKeywords(targetKeyword);

    // Heading analysis (supports markdown and HTML)
    const headings = {
      h1: (text.match(/^#\s.+$/gm) || []).length + (text.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length,
      h2: (text.match(/^##\s.+$/gm) || []).length + (text.match(/<h2[^>]*>.*?<\/h2>/gi) || []).length,
      h3: (text.match(/^###\s.+$/gm) || []).length + (text.match(/<h3[^>]*>.*?<\/h3>/gi) || []).length,
      total: (text.match(/^#{1,6}\s.+$/gm) || []).length + (text.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []).length
    };

    // Extract actual headings for FAQ schema
    const h2Headings = text.match(/^##\s(.+)$/gm)?.map(h => h.replace(/^##\s/, '')) || [];
    const questions = h2Headings.filter(h => h.includes('?') || h.toLowerCase().includes('how') || h.toLowerCase().includes('what') || h.toLowerCase().includes('why'));

    // Readability (Flesch Reading Ease)
    const avgWordsPerSentence = sentences > 0 ? words.length / sentences : 0;
    const avgSyllablesPerWord = 1.5;
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    const readabilityScore = Math.max(0, Math.min(100, fleschScore));

    // Content length scoring
    const contentLengthScore = 
      words.length < 300 ? 30 :
      words.length < 600 ? 60 :
      words.length < 1000 ? 80 :
      words.length < 2500 ? 100 :
      90;

    // Keyword density scoring (ideal 1-3%)
    const keywordDensityScore = 
      !targetKeyword ? 0 :
      keywordDensity < 0.5 ? 40 :
      keywordDensity >= 1 && keywordDensity <= 3 ? 100 :
      keywordDensity < 5 ? 70 :
      40;

    // Meta title scoring
    const metaTitleScore = 
      !metaTitle ? 0 :
      metaTitle.length < 30 ? 40 :
      metaTitle.length >= 50 && metaTitle.length <= 60 ? 100 :
      metaTitle.length <= 70 ? 80 :
      50;

    // Meta description scoring
    const metaDescScore = 
      !metaDescription ? 0 :
      metaDescription.length < 120 ? 40 :
      metaDescription.length >= 150 && metaDescription.length <= 160 ? 100 :
      metaDescription.length <= 170 ? 80 :
      50;

    // Overall SEO Score
    const seoScore = Math.round(
      (contentLengthScore * 0.25) +
      (keywordDensityScore * 0.25) +
      (readabilityScore * 0.2) +
      (metaTitleScore * 0.15) +
      (metaDescScore * 0.15)
    );

    // Keyword prominence
    const first100Words = words.slice(0, 100).join(' ').toLowerCase();
    const keywordInIntro = targetKeywordLower && first100Words.includes(targetKeywordLower);
    const keywordInTitle = targetKeywordLower && metaTitle.toLowerCase().includes(targetKeywordLower);
    const keywordInDescription = targetKeywordLower && metaDescription.toLowerCase().includes(targetKeywordLower);

    // Extract common words for internal linking
    const wordFrequency: Record<string, number> = {};
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 4 && !stopWords.includes(cleanWord)) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Featured snippet optimization
    const hasListFormat = /^(\d+\.|-|\*)\s/gm.test(text);
    const hasTable = /\|.*\|/g.test(text);
    const hasBulletPoints = text.includes('•') || text.includes('-') || text.includes('*');
    
    // Image detection and alt text analysis
    const imageCount = (text.match(/!\[.*?\]\(.*?\)/g) || []).length + (text.match(/<img[^>]+>/gi) || []).length;
    const imagesWithAlt = (text.match(/!\[.+?\]\(.*?\)/g) || []).length + (text.match(/<img[^>]+alt=['""][^'""]+['""][^>]*>/gi) || []).length;
    const missingAltText = imageCount - imagesWithAlt;

    // Internal/External link detection
    const internalLinks = (text.match(/\[.*?\]\(\/.*?\)/g) || []).length;
    const externalLinks = (text.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;

    // Competitor comparison
    const competitorWords = parseInt(competitorWordCount) || 0;
    const competitorComparison = competitorWords > 0 ? 
      {
        difference: words.length - competitorWords,
        percentage: ((words.length / competitorWords) * 100 - 100).toFixed(1),
        status: words.length > competitorWords ? 'longer' : words.length < competitorWords ? 'shorter' : 'equal'
      } : null;

    // Generate title variations for A/B testing
    const titleVariations = generateTitleVariations(metaTitle, targetKeyword);

    // FAQ Schema generation
    const faqSchema = questions.length > 0 ? generateFAQSchema(questions) : null;

    // Image alt text suggestions
    const altTextSuggestions = generateAltTextSuggestions(targetKeyword, imageCount);

    return {
      wordCount: words.length,
      charCount: chars,
      sentenceCount: sentences,
      paragraphCount: paragraphs,
      keywordCount,
      keywordDensity,
      lsiKeywordSuggestions,
      headings,
      readabilityScore,
      contentLengthScore,
      keywordDensityScore,
      metaTitleScore,
      metaDescScore,
      seoScore,
      keywordInIntro,
      keywordInTitle,
      keywordInDescription,
      topWords,
      avgWordsPerSentence,
      hasListFormat,
      hasTable,
      hasBulletPoints,
      imageCount,
      imagesWithAlt,
      missingAltText,
      internalLinks,
      externalLinks,
      competitorComparison,
      titleVariations,
      faqSchema,
      altTextSuggestions,
      questions: questions.length
    };
  };

  const generateLSIKeywords = (keyword: string): string[] => {
    if (!keyword) return [];
    
    const lsiMap: Record<string, string[]> = {
      'seo': ['search engine optimization', 'search rankings', 'organic traffic', 'serp position', 'google ranking', 'on-page seo', 'off-page seo', 'technical seo'],
      'content': ['content marketing', 'content strategy', 'blog posts', 'articles', 'copywriting', 'content creation', 'editorial calendar', 'content planning'],
      'marketing': ['digital marketing', 'online marketing', 'marketing strategy', 'brand awareness', 'customer engagement', 'marketing automation', 'email marketing', 'social media marketing'],
      'resume': ['cv', 'curriculum vitae', 'job application', 'professional profile', 'career summary', 'cover letter', 'job search', 'career development'],
      'writing': ['content writing', 'copywriting', 'creative writing', 'blog writing', 'article writing', 'technical writing', 'business writing', 'web content']
    };

    const keyLower = keyword.toLowerCase();
    for (const [key, suggestions] of Object.entries(lsiMap)) {
      if (keyLower.includes(key)) {
        return suggestions;
      }
    }
    
    return [`${keyword} tips`, `${keyword} guide`, `best ${keyword}`, `${keyword} strategy`, `${keyword} tutorial`, `how to ${keyword}`, `${keyword} examples`, `${keyword} best practices`];
  };

  const generateTitleVariations = (title: string, keyword: string): string[] => {
    if (!title || !keyword) return [];
    
    const variations: string[] = [];
    const year = new Date().getFullYear();
    
    variations.push(`${keyword} - ${title}`);
    variations.push(`${title} | ${keyword} Guide ${year}`);
    variations.push(`Ultimate ${keyword} Guide: ${title}`);
    variations.push(`${title} - Complete ${keyword} Tutorial`);
    variations.push(`${keyword}: ${title} [${year} Update]`);
    
    return variations.filter(v => v.length <= 70);
  };

  const generateFAQSchema = (questions: string[]): string => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.slice(0, 5).map(q => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "[Add your answer here]"
        }
      }))
    };
    
    return JSON.stringify(schema, null, 2);
  };

  const generateAltTextSuggestions = (keyword: string, count: number): string[] => {
    if (!keyword || count === 0) return [];
    
    return [
      `${keyword} - infographic`,
      `${keyword} - step by step guide`,
      `${keyword} - example screenshot`,
      `${keyword} - comparison chart`,
      `${keyword} - statistics and data`
    ].slice(0, count);
  };

  const analysis = text ? analyzeSEO() : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const getReadabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'Very Easy', color: 'text-green-600 dark:text-green-400' };
    if (score >= 80) return { grade: 'Easy', color: 'text-green-500 dark:text-green-300' };
    if (score >= 70) return { grade: 'Fairly Easy', color: 'text-blue-500' };
    if (score >= 60) return { grade: 'Standard', color: 'text-yellow-500' };
    if (score >= 50) return { grade: 'Fairly Difficult', color: 'text-orange-500' };
    return { grade: 'Difficult', color: 'text-red-500' };
  };

  return (
    <>
      {/* Main Tool Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 px-2">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <FaChartLine className="text-3xl sm:text-4xl md:text-5xl text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              Advanced SEO Content Analyzer & SERP Preview
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Get SERP previews, social media cards, LSI keywords, FAQ schemas, and competitor analysis
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-lg border-2 mb-6">
            <CardHeader>
              <CardTitle>Content & Keyword Settings</CardTitle>
              <CardDescription>
                Complete SEO analysis with SERP preview and social media card simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Keyword */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Target Keyword</label>
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g., SEO content optimization"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  data-testid="input-target-keyword"
                />
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Meta Title ({metaTitle.length}/60)</label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Your optimized page title (50-60 characters recommended)"
                  maxLength={70}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  data-testid="input-meta-title"
                />
                <Progress 
                  value={(metaTitle.length / 60) * 100} 
                  className={`h-2 ${metaTitle.length >= 50 && metaTitle.length <= 60 ? 'bg-green-500' : ''}`} 
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Meta Description ({metaDescription.length}/160)</label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Your meta description (150-160 characters recommended)"
                  maxLength={170}
                  rows={3}
                  className="text-sm sm:text-base"
                  data-testid="textarea-meta-description"
                />
                <Progress 
                  value={(metaDescription.length / 160) * 100} 
                  className={`h-2 ${metaDescription.length >= 150 && metaDescription.length <= 160 ? 'bg-green-500' : ''}`} 
                />
              </div>

              {/* Competitor Word Count */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Competitor Average Word Count (Optional)</label>
                <Input
                  type="number"
                  value={competitorWordCount}
                  onChange={(e) => setCompetitorWordCount(e.target.value)}
                  placeholder="e.g., 1500"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  data-testid="input-competitor-words"
                />
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="default" className="w-full sm:w-auto h-10 sm:h-10" asChild data-testid="button-upload-content">
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Upload Text</span>
                      <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="default"
                    className="w-full sm:w-auto h-10 sm:h-10 text-sm sm:text-base"
                    onClick={() => setText('')}
                    data-testid="button-clear-content"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your article or blog content here... Use # for H1, ## for H2, ### for H3. Add questions in headings for FAQ schema generation."
                  className="min-h-[300px] font-mono text-sm"
                  data-testid="textarea-content-input"
                />
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6">
                  {/* SEO Score */}
                  <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Overall SEO Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-bold" data-testid="text-seo-score">{analysis.seoScore}%</span>
                          <Badge variant={analysis.seoScore >= 80 ? 'default' : analysis.seoScore >= 60 ? 'secondary' : 'destructive'}>
                            {analysis.seoScore >= 80 ? 'Excellent' : analysis.seoScore >= 60 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>
                        <Progress value={analysis.seoScore} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* SERP Preview */}
                  <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Google SERP Preview
                      </CardTitle>
                      <CardDescription>How your page will appear in Google search results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">https://yourwebsite.com/article</div>
                        <div className="text-xl text-blue-800 dark:text-blue-400 hover:underline mb-1 cursor-pointer">
                          {metaTitle || 'Your Page Title Goes Here'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {metaDescription || 'Your meta description will appear here. Make it compelling to increase click-through rates!'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="social" className="w-full">
                    <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start sm:justify-center gap-1 h-auto p-1">
                      <TabsTrigger value="social" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-social">Social</TabsTrigger>
                      <TabsTrigger value="keywords" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="snippets" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-snippets">Snippets</TabsTrigger>
                      <TabsTrigger value="titles" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-titles">Titles</TabsTrigger>
                      <TabsTrigger value="images" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-images">Images</TabsTrigger>
                      <TabsTrigger value="competitor" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-competitor">Competitor</TabsTrigger>
                      <TabsTrigger value="schema" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-schema">Schema</TabsTrigger>
                    </TabsList>

                    <TabsContent value="social" className="space-y-4">
                      {/* Twitter Card Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <FaTwitter className="h-5 w-5 text-blue-400" />
                            Twitter Card Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg overflow-hidden max-w-md">
                            <div className="bg-gray-200 dark:bg-gray-700 h-32 flex items-center justify-center text-gray-500">
                              [Featured Image]
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 border-t">
                              <div className="text-sm font-semibold line-clamp-1">{metaTitle || 'Your Title'}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                {metaDescription || 'Your description'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">yourwebsite.com</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Facebook Card Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <FaFacebook className="h-5 w-5 text-blue-600" />
                            Facebook Card Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-lg overflow-hidden max-w-lg">
                            <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center text-gray-500">
                              [Featured Image 1200x630]
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t">
                              <div className="text-xs text-gray-500 uppercase mb-1">yourwebsite.com</div>
                              <div className="text-base font-semibold line-clamp-1">{metaTitle || 'Your Title'}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                {metaDescription || 'Your description'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="keywords" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Keyword Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {targetKeyword ? (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                <div>
                                  <div className="text-2xl font-bold" data-testid="text-keyword-count">{analysis.keywordCount}</div>
                                  <div className="text-xs text-muted-foreground">Occurrences</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold" data-testid="text-keyword-density">{analysis.keywordDensity.toFixed(2)}%</div>
                                  <div className="text-xs text-muted-foreground">Density</div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    {analysis.keywordInTitle ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                  </div>
                                  <div className="text-xs text-muted-foreground">In Title</div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    {analysis.keywordInDescription ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                  </div>
                                  <div className="text-xs text-muted-foreground">In Description</div>
                                </div>
                              </div>

                              {/* LSI Keywords */}
                              <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-2">LSI Keywords to Include:</p>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.lsiKeywordSuggestions.map((keyword, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Enter a target keyword to see analysis.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="snippets" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Featured Snippet Optimization</CardTitle>
                          <CardDescription>Increase chances of appearing in Google's featured snippets</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="text-center">
                              {analysis.hasListFormat ? <CheckCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-green-500" /> : <AlertCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-yellow-500" />}
                              <div className="text-xs sm:text-sm mt-2">List Format</div>
                            </div>
                            <div className="text-center">
                              {analysis.hasTable ? <CheckCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-green-500" /> : <AlertCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-yellow-500" />}
                              <div className="text-xs sm:text-sm mt-2">Table</div>
                            </div>
                            <div className="text-center">
                              {analysis.questions > 0 ? <CheckCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-green-500" /> : <AlertCircle className="h-6 sm:h-8 w-6 sm:w-8 mx-auto text-yellow-500" />}
                              <div className="text-xs sm:text-sm mt-2">Q&A Format</div>
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Featured Snippet Tips:</p>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Use numbered or bulleted lists for "how-to" content</li>
                              <li>• Answer questions directly in the first paragraph</li>
                              <li>• Keep answers concise (40-60 words for best results)</li>
                              <li>• Use tables for comparisons and data</li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="titles" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Title A/B Testing Variations</CardTitle>
                          <CardDescription>Alternative title formats to test for better CTR</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {analysis.titleVariations.length > 0 ? (
                            <div className="space-y-2">
                              {analysis.titleVariations.map((title, idx) => (
                                <div key={idx} className="p-3 bg-muted rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <span className="text-sm font-medium">{title}</span>
                                    <Badge variant="outline" className="text-xs">{title.length} chars</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Enter both meta title and target keyword to generate variations.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Image SEO Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-2xl font-bold">{analysis.imageCount}</div>
                              <div className="text-xs text-muted-foreground">Total Images</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-600">{analysis.imagesWithAlt}</div>
                              <div className="text-xs text-muted-foreground">With Alt Text</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-600">{analysis.missingAltText}</div>
                              <div className="text-xs text-muted-foreground">Missing Alt</div>
                            </div>
                          </div>

                          {analysis.altTextSuggestions.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Alt Text Suggestions:</p>
                              <div className="space-y-2">
                                {analysis.altTextSuggestions.map((suggestion, idx) => (
                                  <div key={idx} className="p-2 bg-muted rounded text-sm font-mono">
                                    alt="{suggestion}"
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="competitor" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Competitor Content Analysis</CardTitle>
                          <CardDescription>Compare your content length with competitors</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {analysis.competitorComparison ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-primary/10 rounded-lg">
                                  <div className="text-2xl sm:text-3xl font-bold">{analysis.wordCount}</div>
                                  <div className="text-sm text-muted-foreground">Your Content</div>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                  <div className="text-2xl sm:text-3xl font-bold">{competitorWordCount}</div>
                                  <div className="text-sm text-muted-foreground">Competitor Avg</div>
                                </div>
                              </div>

                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Your content is</div>
                                <div className={`text-2xl sm:text-3xl font-bold ${analysis.competitorComparison.status === 'longer' ? 'text-green-600' : 'text-orange-600'}`}>
                                  {Math.abs(analysis.competitorComparison.difference)} words {analysis.competitorComparison.status}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  ({analysis.competitorComparison.percentage}% {analysis.competitorComparison.status === 'longer' ? 'more' : 'less'})
                                </div>
                              </div>

                              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  💡 {analysis.competitorComparison.status === 'longer' 
                                    ? 'Great! Longer content typically ranks better. Ensure quality matches quantity.' 
                                    : 'Consider expanding your content to be more comprehensive than competitors.'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Enter competitor average word count to see comparison.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="schema" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            FAQ Schema Generator
                          </CardTitle>
                          <CardDescription>
                            {analysis.questions > 0 ? `Found ${analysis.questions} questions in your content` : 'Add questions in headings to generate FAQ schema'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {analysis.faqSchema ? (
                            <div>
                              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                <pre>{analysis.faqSchema}</pre>
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">
                                💡 Copy this JSON-LD schema and add it to your page's &lt;head&gt; section to enable FAQ rich results in Google.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                To generate FAQ schema, add questions as H2 headings (##) in your content. Example:<br/>
                                <code className="block mt-2 font-mono text-xs">## What is SEO content optimization?</code>
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Advanced SEO Features Not Found Elsewhere</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <Search className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">SERP Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See exactly how your page will appear in Google search results before publishing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Share2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Social Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Preview your content as Twitter and Facebook cards to optimize social media sharing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Competitor Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare your content length with competitors to ensure you're providing comprehensive coverage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <HelpCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">FAQ Schema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Auto-generate JSON-LD FAQ schema markup from your content for rich search results.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto prose dark:prose-invert">
          <h2>Professional SEO Content Analyzer with SERP Preview for Content Marketers</h2>
          <p>
            Our SEO Content Analyzer is the most comprehensive free tool available for content optimization. Unlike basic keyword density checkers, we provide SERP preview simulation, social media card preview, competitor analysis, FAQ schema generation, and advanced SEO recommendations that help you rank #1 in Google search results.
          </p>

          <h3>Features That Make Us Unique</h3>
          <ul>
            <li><strong>Google SERP Preview:</strong> See exactly how your title and description appear in search results</li>
            <li><strong>Social Media Card Preview:</strong> Preview Twitter and Facebook cards to optimize social sharing</li>
            <li><strong>Competitor Content Analysis:</strong> Compare your word count vs. competitors for comprehensive coverage</li>
            <li><strong>FAQ Schema Generator:</strong> Auto-create JSON-LD schema markup for FAQ rich results</li>
            <li><strong>Title A/B Testing:</strong> Get 5 optimized title variations to test for better CTR</li>
            <li><strong>Image Alt Text Suggestions:</strong> SEO-optimized alt text recommendations for better image search rankings</li>
            <li><strong>Featured Snippet Optimization:</strong> Analysis of list formats, tables, and Q&A structure</li>
          </ul>

          <h3>Perfect for US, UK, and Canada Markets</h3>
          <p>
            Content marketing professionals in high-CPC markets need every advantage. Our tool provides insights that help you create content that ranks in competitive English-speaking markets where search visibility directly impacts revenue.
          </p>
        </div>
      </section>
    </>
  );
}
