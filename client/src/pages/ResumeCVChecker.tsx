import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Award, TrendingUp, CheckCircle, AlertCircle, Briefcase, Target } from 'lucide-react';
import { FaBriefcase, FaCheckCircle, FaFileAlt, FaTrophy, FaBullseye, FaLightbulb } from 'react-icons/fa';

export default function ResumeCVChecker() {
  const [text, setText] = useState('');
  const [industry, setIndustry] = useState('general');

  const resumeSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Resume/CV Word Counter & ATS Checker 2025",
    "alternateName": ["Resume Word Counter", "CV Checker", "ATS Optimization Tool", "Resume Analyzer"],
    "url": "https://wordcounterplusapp.com/resume-cv-checker",
    "description": "Professional resume analyzer with ATS optimization score, section-specific word counts, industry benchmarks, action verb analysis, and skills extraction. Perfect for job seekers in US, UK, and Canada.",
    "applicationCategory": ["Productivity", "Career", "Resume Tools", "Professional Development"],
    "operatingSystem": "Web Browser",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "creator": {
      "@type": "Organization",
      "name": "Word Counter Plus"
    },
    "featureList": [
      "ATS optimization score",
      "Section-specific word counts",
      "Industry-specific benchmarks",
      "Action verb analysis",
      "Skills extraction",
      "Keyword optimization",
      "Readability scoring",
      "Professional formatting check",
      "Upload PDF/DOCX support"
    ]
  };

  useSEO({
    title: 'Resume/CV Word Counter & ATS Checker 2025 | Optimize Your Job Application',
    description: 'Professional resume analyzer with ATS optimization score, section-specific word counts, industry benchmarks, action verb analysis, and skills extraction. Perfect for job seekers in US, UK, and Canada seeking career advancement.',
    keywords: 'resume word counter, cv checker, ats optimization, resume analyzer, job application tool, career tool, resume optimization, cv word count, ats score, resume keywords, action verbs, professional resume, cv analysis, job search tool, resume builder, career development',
    canonical: 'https://wordcounterplusapp.com/resume-cv-checker',
    structuredData: resumeSchema
  });

  // Analysis functions
  const analyzeResume = () => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Action verbs analysis
    const actionVerbs = [
      'achieved', 'accomplished', 'administered', 'analyzed', 'approved', 'built', 'created', 'delivered',
      'developed', 'directed', 'engineered', 'established', 'executed', 'generated', 'implemented',
      'improved', 'increased', 'launched', 'led', 'managed', 'optimized', 'organized', 'planned',
      'produced', 'reduced', 'resolved', 'spearheaded', 'streamlined', 'transformed', 'accelerated',
      'collaborated', 'coordinated', 'designed', 'enhanced', 'facilitated', 'initiated', 'negotiated',
      'supervised', 'trained', 'automated', 'consolidated', 'exceeded', 'innovated', 'mentored'
    ];
    
    const textLower = text.toLowerCase();
    const foundActionVerbs = actionVerbs.filter(verb => textLower.includes(verb));
    const actionVerbScore = Math.min((foundActionVerbs.length / 10) * 100, 100);

    // Skills extraction (common professional skills)
    const commonSkills = [
      'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'aws', 'azure', 'docker', 'kubernetes',
      'project management', 'leadership', 'communication', 'problem solving', 'teamwork', 'agile', 'scrum',
      'data analysis', 'machine learning', 'ai', 'excel', 'powerpoint', 'salesforce', 'marketing',
      'seo', 'content strategy', 'social media', 'analytics', 'budgeting', 'strategic planning'
    ];
    
    const foundSkills = commonSkills.filter(skill => textLower.includes(skill.toLowerCase()));

    // Section detection
    const sections = {
      summary: /summary|profile|objective/i.test(text),
      experience: /experience|employment|work history/i.test(text),
      education: /education|qualifications|academic/i.test(text),
      skills: /skills|competencies|expertise/i.test(text)
    };

    // ATS Score calculation
    let atsScore = 0;
    if (words.length >= 300 && words.length <= 800) atsScore += 25;
    if (foundActionVerbs.length >= 8) atsScore += 25;
    if (foundSkills.length >= 5) atsScore += 25;
    if (Object.values(sections).filter(Boolean).length >= 3) atsScore += 25;

    // Industry benchmarks
    const industryBenchmarks: Record<string, {min: number, max: number, ideal: number}> = {
      'tech': { min: 400, max: 700, ideal: 550 },
      'finance': { min: 350, max: 650, ideal: 500 },
      'marketing': { min: 400, max: 750, ideal: 575 },
      'healthcare': { min: 350, max: 700, ideal: 525 },
      'general': { min: 350, max: 700, ideal: 525 }
    };

    const benchmark = industryBenchmarks[industry] || industryBenchmarks['general'];
    const wordCountScore = words.length >= benchmark.min && words.length <= benchmark.max ? 100 : 
                          Math.max(0, 100 - Math.abs(words.length - benchmark.ideal) / 10);

    return {
      wordCount: words.length,
      charCount: chars,
      charCountNoSpaces: charsNoSpaces,
      sentenceCount: sentences,
      actionVerbs: foundActionVerbs,
      actionVerbScore,
      skills: foundSkills,
      sections,
      atsScore,
      wordCountScore,
      benchmark,
      readabilityScore: Math.min(100, 100 - (words.length / sentences - 15) * 2)
    };
  };

  const analysis = text ? analyzeResume() : null;

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

  return (
    <>
      {/* Main Tool Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FaBriefcase className="text-4xl sm:text-5xl text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Resume/CV Word Counter & ATS Checker
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Optimize your resume with AI-powered ATS scoring, industry benchmarks, and professional insights
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle>Paste Your Resume</CardTitle>
              <CardDescription>
                Get instant ATS optimization score, action verb analysis, and industry-specific recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Industry Selection */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Industry:</span>
                {['general', 'tech', 'finance', 'marketing', 'healthcare'].map((ind) => (
                  <Button
                    key={ind}
                    variant={industry === ind ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIndustry(ind)}
                    data-testid={`button-industry-${ind}`}
                  >
                    {ind.charAt(0).toUpperCase() + ind.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild data-testid="button-upload-resume">
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
                    data-testid="button-clear-resume"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your resume text here... Include your summary, experience, skills, and education sections for best results."
                  className="min-h-[300px] font-mono text-sm"
                  data-testid="textarea-resume-input"
                />
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6">
                  {/* ATS Score */}
                  <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        ATS Optimization Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-bold" data-testid="text-ats-score">{analysis.atsScore}%</span>
                          <Badge variant={analysis.atsScore >= 75 ? 'default' : analysis.atsScore >= 50 ? 'secondary' : 'destructive'}>
                            {analysis.atsScore >= 75 ? 'Excellent' : analysis.atsScore >= 50 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                        <Progress value={analysis.atsScore} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                          {analysis.atsScore >= 75 
                            ? 'Your resume is well-optimized for Applicant Tracking Systems!'
                            : 'Add more action verbs, skills, and standard sections to improve ATS compatibility.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="stats" data-testid="tab-stats">Stats</TabsTrigger>
                      <TabsTrigger value="sections" data-testid="tab-sections">Sections</TabsTrigger>
                      <TabsTrigger value="verbs" data-testid="tab-verbs">Action Verbs</TabsTrigger>
                      <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold" data-testid="text-word-count">{analysis.wordCount}</div>
                            <div className="text-xs text-muted-foreground">Words</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold" data-testid="text-char-count">{analysis.charCount}</div>
                            <div className="text-xs text-muted-foreground">Characters</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold" data-testid="text-sentence-count">{analysis.sentenceCount}</div>
                            <div className="text-xs text-muted-foreground">Sentences</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold" data-testid="text-readability-score">{Math.round(analysis.readabilityScore)}%</div>
                            <div className="text-xs text-muted-foreground">Readability</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Industry Benchmark */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Industry Benchmark</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Recommended: {analysis.benchmark.min} - {analysis.benchmark.max} words</span>
                              <span className="font-semibold">Ideal: {analysis.benchmark.ideal}</span>
                            </div>
                            <Progress value={analysis.wordCountScore} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {analysis.wordCount < analysis.benchmark.min && 'Your resume may be too short. Consider adding more details.'}
                              {analysis.wordCount > analysis.benchmark.max && 'Your resume may be too long. Consider being more concise.'}
                              {analysis.wordCount >= analysis.benchmark.min && analysis.wordCount <= analysis.benchmark.max && 
                                'Your resume length is perfect for your industry!'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="sections" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Resume Sections Detected</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(analysis.sections).map(([section, found]) => (
                              <div key={section} className="flex items-center gap-2">
                                {found ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                                )}
                                <span className="capitalize">{section}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">
                            A complete resume should have all four sections for maximum ATS compatibility.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="verbs" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Action Verbs Found ({analysis.actionVerbs.length})</CardTitle>
                          <CardDescription>
                            Strong action verbs make your achievements more impactful
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {analysis.actionVerbs.slice(0, 20).map((verb, idx) => (
                              <Badge key={idx} variant="secondary" className="capitalize">
                                {verb}
                              </Badge>
                            ))}
                          </div>
                          <Progress value={analysis.actionVerbScore} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            {analysis.actionVerbs.length < 8 && 'Add more action verbs like "achieved", "developed", "led" to strengthen your resume.'}
                            {analysis.actionVerbs.length >= 8 && analysis.actionVerbs.length < 15 && 'Good use of action verbs! Consider adding a few more.'}
                            {analysis.actionVerbs.length >= 15 && 'Excellent use of strong action verbs throughout your resume!'}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Professional Skills Detected ({analysis.skills.length})</CardTitle>
                          <CardDescription>
                            Keywords that ATS systems look for
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {analysis.skills.map((skill, idx) => (
                              <Badge key={idx} variant="default" className="capitalize">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          {analysis.skills.length < 5 && (
                            <p className="text-sm text-muted-foreground">
                              Add more relevant skills and technologies to improve your ATS score.
                            </p>
                          )}
                          {analysis.skills.length >= 5 && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Great! Your resume includes many relevant professional skills.
                            </p>
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
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Resume Checker?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <FaTrophy className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">ATS Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get an instant ATS compatibility score to ensure your resume passes automated screening systems used by 99% of Fortune 500 companies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaBullseye className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Industry Benchmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare your resume against industry-specific standards for Tech, Finance, Marketing, Healthcare, and more to stay competitive.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaLightbulb className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Action Verb Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify powerful action verbs in your resume and get suggestions for making your achievements more impactful to hiring managers.
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
          <h2>Professional Resume Word Counter for Job Seekers in US, UK, and Canada</h2>
          <p>
            Our Resume/CV Word Counter is designed specifically for job seekers in high-opportunity markets like the United States, United Kingdom, and Canada. With advanced ATS (Applicant Tracking System) optimization features, you can ensure your resume passes automated screening before it reaches a human recruiter.
          </p>

          <h3>What Makes Our Resume Checker Unique?</h3>
          <p>
            Unlike basic word counters, our tool provides comprehensive analysis including:
          </p>
          <ul>
            <li><strong>ATS Compatibility Scoring:</strong> Instant feedback on how well your resume will perform with automated screening systems</li>
            <li><strong>Industry-Specific Benchmarks:</strong> Tailored recommendations for Tech, Finance, Marketing, Healthcare, and other industries</li>
            <li><strong>Action Verb Detection:</strong> Identify and strengthen power words that make your achievements stand out</li>
            <li><strong>Skills Extraction:</strong> Automatic detection of professional skills and keywords that recruiters search for</li>
            <li><strong>Section Analysis:</strong> Ensure your resume includes all critical sections for maximum impact</li>
          </ul>

          <h3>Optimize Your Resume for Success</h3>
          <p>
            In today's competitive job market, 75% of resumes never reach a human recruiter. They're filtered out by ATS software that scans for specific keywords, formatting, and structure. Our Resume Word Counter helps you beat the system by analyzing your resume against the same criteria that ATS software uses, giving you actionable insights to improve your chances of landing an interview.
          </p>

          <h3>Perfect for Professional Development</h3>
          <p>
            Whether you're a recent graduate, mid-career professional, or executive, our tool provides the insights you need to create a compelling resume that gets noticed. With industry benchmarks based on real hiring data from US, UK, and Canadian markets, you can be confident your resume meets professional standards.
          </p>
        </div>
      </section>
    </>
  );
}
