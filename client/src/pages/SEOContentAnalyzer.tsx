import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Search, TrendingUp, CheckCircle, AlertCircle, Target, Zap } from 'lucide-react';
import { FaChartLine, FaSearch, FaBullseye, FaCheckCircle, FaLightbulb, FaChartBar } from 'react-icons/fa';

export default function SEOContentAnalyzer() {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "SEO Content Analyzer 2025 - Advanced Content Optimization Tool",
    "alternateName": ["SEO Content Analyzer", "Content Optimization Tool", "Keyword Density Checker", "SEO Analyzer"],
    "url": "https://wordcounterplusapp.com/seo-content-analyzer",
    "description": "Advanced SEO content optimization tool with keyword density analysis, LSI keyword suggestions, readability scoring, meta tag generator, and heading hierarchy checker for better search rankings.",
    "applicationCategory": ["Productivity", "SEO Tools", "Content Marketing", "Digital Marketing"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Word Counter Plus"
    },
    "featureList": [
      "Keyword density analysis",
      "LSI keyword suggestions",
      "Readability scoring for SEO",
      "Meta title and description optimizer",
      "Heading hierarchy checker (H1-H6)",
      "Content length recommendations",
      "Keyword prominence analysis",
      "Internal linking opportunities",
      "Competitive content metrics"
    ]
  };

  useSEO({
    title: 'SEO Content Analyzer 2025 - Keyword Density & Content Optimization Tool',
    description: 'Advanced SEO content optimization tool with keyword density analysis, LSI keyword suggestions, readability scoring, meta tag generator, heading hierarchy checker, and competitor comparison for better search engine rankings and organic traffic.',
    keywords: 'seo content analyzer, keyword density checker, content optimization tool, seo analyzer, keyword research tool, meta tag generator, readability checker, heading analyzer, lsi keywords, search engine optimization, content marketing tool, seo writing tool, keyword prominence, content seo score',
    canonical: 'https://wordcounterplusapp.com/seo-content-analyzer',
    structuredData: seoSchema
  });

  // SEO Analysis functions
  const analyzeSEO = () => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Keyword analysis
    const targetKeywordLower = targetKeyword.toLowerCase();
    const textLower = text.toLowerCase();
    const keywordCount = targetKeywordLower ? (textLower.match(new RegExp(targetKeywordLower, 'g')) || []).length : 0;
    const keywordDensity = words.length > 0 && targetKeywordLower ? (keywordCount / words.length) * 100 : 0;

    // LSI Keywords (Latent Semantic Indexing) - related terms
    const lsiKeywordSuggestions = generateLSIKeywords(targetKeyword);

    // Heading analysis
    const headings = {
      h1: (text.match(/^#\s.+$/gm) || []).length,
      h2: (text.match(/^##\s.+$/gm) || []).length,
      h3: (text.match(/^###\s.+$/gm) || []).length,
      total: (text.match(/^#{1,6}\s.+$/gm) || []).length
    };

    // Readability (Flesch Reading Ease approximation)
    const avgWordsPerSentence = sentences > 0 ? words.length / sentences : 0;
    const avgSyllablesPerWord = 1.5; // Simplified estimation
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

    // Keyword prominence (appears in first 100 words)
    const first100Words = words.slice(0, 100).join(' ').toLowerCase();
    const keywordInIntro = targetKeywordLower && first100Words.includes(targetKeywordLower);

    // Extract common words for internal linking opportunities
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 4) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

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
      topWords,
      avgWordsPerSentence
    };
  };

  const generateLSIKeywords = (keyword: string): string[] => {
    if (!keyword) return [];
    
    const lsiMap: Record<string, string[]> = {
      'seo': ['search engine optimization', 'search rankings', 'organic traffic', 'serp', 'google ranking'],
      'content': ['content marketing', 'content strategy', 'blog posts', 'articles', 'copywriting'],
      'marketing': ['digital marketing', 'online marketing', 'marketing strategy', 'brand awareness', 'customer engagement'],
      'resume': ['cv', 'curriculum vitae', 'job application', 'professional profile', 'career summary'],
      'writing': ['content writing', 'copywriting', 'creative writing', 'blog writing', 'article writing']
    };

    const keyLower = keyword.toLowerCase();
    for (const [key, suggestions] of Object.entries(lsiMap)) {
      if (keyLower.includes(key)) {
        return suggestions;
      }
    }
    
    return [`${keyword} tips`, `${keyword} guide`, `best ${keyword}`, `${keyword} strategy`, `${keyword} tutorial`];
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
    if (score >= 90) return { grade: 'Very Easy', color: 'text-green-600' };
    if (score >= 80) return { grade: 'Easy', color: 'text-green-500' };
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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FaChartLine className="text-4xl sm:text-5xl text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              SEO Content Analyzer
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimize your content for search engines with AI-powered keyword analysis and SEO scoring
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-lg border-2 mb-6">
            <CardHeader>
              <CardTitle>Content & Keyword Settings</CardTitle>
              <CardDescription>
                Paste your content and set your target keyword for comprehensive SEO analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Keyword */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Keyword</label>
                <Input
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g., SEO content optimization"
                  data-testid="input-target-keyword"
                />
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Title ({metaTitle.length}/60)</label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Your optimized page title (50-60 characters recommended)"
                  maxLength={70}
                  data-testid="input-meta-title"
                />
                <Progress 
                  value={(metaTitle.length / 60) * 100} 
                  className={`h-1 ${metaTitle.length >= 50 && metaTitle.length <= 60 ? 'bg-green-500' : ''}`} 
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description ({metaDescription.length}/160)</label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Your meta description (150-160 characters recommended)"
                  maxLength={170}
                  rows={3}
                  data-testid="textarea-meta-description"
                />
                <Progress 
                  value={(metaDescription.length / 160) * 100} 
                  className={`h-1 ${metaDescription.length >= 150 && metaDescription.length <= 160 ? 'bg-green-500' : ''}`} 
                />
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild data-testid="button-upload-content">
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Text
                      <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
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
                  placeholder="Paste your article or blog content here... Include headings with # syntax (# for H1, ## for H2, etc.)"
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
                        <p className="text-sm text-muted-foreground">
                          {analysis.seoScore >= 80 
                            ? 'Your content is well-optimized for search engines!'
                            : 'Follow the recommendations below to improve your SEO score.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="keywords" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="keywords" data-testid="tab-keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="readability" data-testid="tab-readability">Readability</TabsTrigger>
                      <TabsTrigger value="structure" data-testid="tab-structure">Structure</TabsTrigger>
                      <TabsTrigger value="opportunities" data-testid="tab-opportunities">Tips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="keywords" className="space-y-4">
                      {/* Keyword Density */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Keyword Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {targetKeyword ? (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-2xl font-bold" data-testid="text-keyword-count">{analysis.keywordCount}</div>
                                  <div className="text-xs text-muted-foreground">Keyword Occurrences</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold" data-testid="text-keyword-density">{analysis.keywordDensity.toFixed(2)}%</div>
                                  <div className="text-xs text-muted-foreground">Keyword Density</div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    {analysis.keywordInIntro ? (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    )}
                                    <span className="text-sm">{analysis.keywordInIntro ? 'In intro' : 'Not in intro'}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Keyword Prominence</div>
                                </div>
                              </div>
                              
                              <div>
                                <Progress value={analysis.keywordDensityScore} className="h-2" />
                                <p className="text-sm text-muted-foreground mt-2">
                                  {analysis.keywordDensity < 1 && 'Keyword density is low. Consider using your target keyword more (1-3% is ideal).'}
                                  {analysis.keywordDensity >= 1 && analysis.keywordDensity <= 3 && 'Perfect keyword density for SEO!'}
                                  {analysis.keywordDensity > 3 && 'Keyword density is high. Reduce usage to avoid keyword stuffing penalties.'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Enter a target keyword to see keyword analysis.</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* LSI Keywords */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">LSI Keyword Suggestions</CardTitle>
                          <CardDescription>Related terms to include for better SEO</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.lsiKeywordSuggestions.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Include these related terms naturally in your content to improve topical relevance and ranking potential.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="readability" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Readability Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-2xl font-bold">{Math.round(analysis.readabilityScore)}</div>
                              <div className="text-xs text-muted-foreground">Flesch Score</div>
                            </div>
                            <div>
                              <div className={`text-lg font-bold ${getReadabilityGrade(analysis.readabilityScore).color}`}>
                                {getReadabilityGrade(analysis.readabilityScore).grade}
                              </div>
                              <div className="text-xs text-muted-foreground">Reading Level</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{analysis.avgWordsPerSentence.toFixed(1)}</div>
                              <div className="text-xs text-muted-foreground">Words/Sentence</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{analysis.paragraphCount}</div>
                              <div className="text-xs text-muted-foreground">Paragraphs</div>
                            </div>
                          </div>
                          <Progress value={analysis.readabilityScore} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Aim for a Flesch score of 60-70 for general audiences. Use shorter sentences and simpler words to improve readability.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="structure" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Content Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-2xl font-bold" data-testid="text-word-count-seo">{analysis.wordCount}</div>
                              <div className="text-xs text-muted-foreground">Total Words</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{analysis.headings.h1}</div>
                              <div className="text-xs text-muted-foreground">H1 Headings</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{analysis.headings.h2}</div>
                              <div className="text-xs text-muted-foreground">H2 Headings</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{analysis.headings.total}</div>
                              <div className="text-xs text-muted-foreground">Total Headings</div>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Content Length Score</label>
                            <Progress value={analysis.contentLengthScore} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-2">
                              {analysis.wordCount < 600 && 'Content is short. Aim for 1000-2500 words for better SEO performance.'}
                              {analysis.wordCount >= 600 && analysis.wordCount < 1000 && 'Good length, but consider expanding to 1000+ words.'}
                              {analysis.wordCount >= 1000 && 'Excellent content length for SEO!'}
                            </p>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Heading Best Practices</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                {analysis.headings.h1 === 1 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                <span>Use exactly one H1 heading {analysis.headings.h1 === 1 ? '✓' : `(found ${analysis.headings.h1})`}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {analysis.headings.h2 > 0 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                <span>Include H2 subheadings {analysis.headings.h2 > 0 ? '✓' : '(none found)'}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="opportunities" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Internal Linking Opportunities</CardTitle>
                          <CardDescription>Frequently used words that could link to other pages</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.topWords.map((word, idx) => (
                              <Badge key={idx} variant="secondary">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">SEO Optimization Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>{analysis.metaTitleScore < 80 ? 'Optimize your meta title to 50-60 characters' : 'Meta title is well-optimized ✓'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>{analysis.metaDescScore < 80 ? 'Improve your meta description to 150-160 characters' : 'Meta description is well-optimized ✓'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>{!analysis.keywordInIntro ? 'Include your target keyword in the first 100 words' : 'Target keyword appears early in content ✓'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>Add more LSI keywords naturally throughout your content</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>Include images with alt text containing your target keyword</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Zap className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span>Add internal links to related content on your website</span>
                            </li>
                          </ul>
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
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Powerful SEO Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <FaSearch className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Keyword Density Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track your target keyword usage and maintain the optimal 1-3% density range for best SEO performance without keyword stuffing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaBullseye className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">LSI Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered LSI (Latent Semantic Indexing) keyword suggestions to improve topical relevance and ranking potential.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaChartBar className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Content Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Analyze heading hierarchy, content length, and readability to ensure your content is perfectly structured for search engines and readers.
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
          <h2>Advanced SEO Content Analyzer for US, UK, and Canada Markets</h2>
          <p>
            Our SEO Content Analyzer is specifically designed for content creators, marketers, and businesses targeting high-value English-speaking markets including the United States, United Kingdom, and Canada. Optimize your content for Google and other search engines with advanced keyword analysis and actionable SEO recommendations.
          </p>

          <h3>Unique Features That Set Us Apart</h3>
          <p>
            Unlike basic keyword density checkers, our comprehensive SEO analyzer provides:
          </p>
          <ul>
            <li><strong>Real-Time SEO Scoring:</strong> Instant overall score based on multiple SEO factors including keyword usage, content length, readability, and structure</li>
            <li><strong>LSI Keyword Suggestions:</strong> AI-powered related keyword recommendations to improve topical authority and semantic relevance</li>
            <li><strong>Meta Tag Optimization:</strong> Live character count and scoring for title tags and meta descriptions with best practice guidelines</li>
            <li><strong>Heading Hierarchy Analysis:</strong> Ensure proper H1-H6 structure for both SEO and accessibility</li>
            <li><strong>Internal Linking Opportunities:</strong> Identify frequently used terms that could link to other valuable pages on your site</li>
            <li><strong>Keyword Prominence Detection:</strong> Verify your target keyword appears early in your content for maximum SEO impact</li>
          </ul>

          <h3>Optimize Content for Search Engines</h3>
          <p>
            Content is king in SEO, but only when it's properly optimized. Our analyzer helps you achieve the perfect balance between writing for humans and optimizing for search engines. With features like Flesch reading ease scoring, keyword density tracking, and content length recommendations, you can ensure your content ranks well while providing genuine value to readers.
          </p>

          <h3>Built for Professional Content Marketers</h3>
          <p>
            Whether you're a blogger, digital marketer, SEO specialist, or business owner, this tool provides professional-grade insights typically found in expensive SEO software. All features are free and accessible directly in your browser, with no signup required and complete privacy for your content.
          </p>
        </div>
      </section>
    </>
  );
}
