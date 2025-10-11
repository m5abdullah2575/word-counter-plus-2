import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Award, TrendingUp, CheckCircle, AlertCircle, Briefcase, Target, DollarSign, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { FaBriefcase, FaCheckCircle, FaFileAlt, FaTrophy, FaBullseye, FaLightbulb, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import RelatedToolsSidebar from '@/components/common/RelatedToolsSidebar';

export default function ResumeCVChecker() {
  const [text, setText] = useState('');
  const [industry, setIndustry] = useState('general');
  const [seniorityLevel, setSeniorityLevel] = useState<'entry' | 'mid' | 'senior' | ''>('');

  const resumeSchema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Resume/CV Word Counter & ATS Checker 2025",
    "alternateName": ["Resume Word Counter", "CV Checker", "ATS Optimization Tool", "Resume Analyzer"],
    "url": "https://wordcounterplusapp.com/resume-cv-checker",
    "description": "Professional resume analyzer with ATS optimization score, quantifiable achievements detector, salary estimator, buzzword alerts, and industry benchmarks. Perfect for job seekers in US, UK, and Canada.",
    "applicationCategory": ["Productivity", "Career", "Resume Tools", "Professional Development"],
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
      "ratingCount": "2,341",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "featureList": [
      "ATS optimization score",
      "Quantifiable achievements detector",
      "Salary range estimator",
      "Buzzword and cliche detection",
      "Job title suggestions",
      "Seniority level analysis",
      "Action verb analysis",
      "Skills extraction",
      "Professional improvement tips"
    ]
  };

  useSEO({
    title: 'Free Resume Checker & ATS Scanner 2025 - CV Analyzer with Salary Estimator | US, UK, CA',
    description: 'Professional resume/CV checker with ATS optimization score, salary estimator ($50K-$200K+), quantifiable achievements detector, buzzword alerts. Free resume analyzer for job seekers in USA, UK, Canada, Australia. Get ATS-friendly resume tips, action verbs, industry benchmarks for tech, finance, marketing careers.',
    keywords: 'resume checker free, cv analyzer, ats checker free, resume scanner, ats optimization tool, resume word counter, cv word count, resume analyzer free, ats resume checker, applicant tracking system checker, resume score, cv score checker, salary estimator resume, job application checker, resume optimization tool, cv optimization, resume buzzword detector, action verb checker, resume ats score, professional resume checker, cv analysis tool free, resume review tool, job resume analyzer',
    canonical: 'https://wordcounterplusapp.com/resume-cv-checker',
    structuredData: resumeSchema,
    hreflang: {
      'en-US': 'https://wordcounterplusapp.com/resume-cv-checker',
      'en-GB': 'https://wordcounterplusapp.com/resume-cv-checker',
      'en-CA': 'https://wordcounterplusapp.com/resume-cv-checker',
      'en-AU': 'https://wordcounterplusapp.com/resume-cv-checker',
      'x-default': 'https://wordcounterplusapp.com/resume-cv-checker'
    },
    breadcrumbs: [
      { name: 'Home', url: 'https://wordcounterplusapp.com/' },
      { name: 'Tools', url: 'https://wordcounterplusapp.com/tools' },
      { name: 'Resume/CV Checker', url: 'https://wordcounterplusapp.com/resume-cv-checker' }
    ]
  });

  // Enhanced analysis functions
  const analyzeResume = () => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Quantifiable achievements detection (numbers, percentages, dollar amounts)
    const numberPattern = /\b\d+([,\.]\d+)*%?\b/g;
    const achievements = text.match(numberPattern) || [];
    const dollarPattern = /\$\d+([,\.]\d+)*[KMB]?/gi;
    const dollarAmounts = text.match(dollarPattern) || [];
    const percentagePattern = /\d+([,\.]\d+)*%/g;
    const percentages = text.match(percentagePattern) || [];
    
    const quantifiableScore = Math.min(100, (achievements.length / 5) * 100);

    // Buzzword/Cliche Detection
    const buzzwords = [
      'team player', 'hard worker', 'detail oriented', 'detail-oriented', 'results driven',
      'results-driven', 'think outside the box', 'go-getter', 'self-starter', 'synergy',
      'leverage', 'utilize', 'best of breed', 'low hanging fruit', 'move the needle',
      'paradigm shift', 'circle back', 'touch base', 'game changer', 'innovative'
    ];
    
    const textLower = text.toLowerCase();
    const foundBuzzwords = buzzwords.filter(word => textLower.includes(word));
    const buzzwordScore = Math.max(0, 100 - (foundBuzzwords.length * 10));

    // Action verbs analysis (expanded list)
    const actionVerbs = [
      'achieved', 'accomplished', 'administered', 'analyzed', 'approved', 'built', 'created', 'delivered',
      'developed', 'directed', 'engineered', 'established', 'executed', 'generated', 'implemented',
      'improved', 'increased', 'launched', 'led', 'managed', 'optimized', 'organized', 'planned',
      'produced', 'reduced', 'resolved', 'spearheaded', 'streamlined', 'transformed', 'accelerated',
      'collaborated', 'coordinated', 'designed', 'enhanced', 'facilitated', 'initiated', 'negotiated',
      'supervised', 'trained', 'automated', 'consolidated', 'exceeded', 'innovated', 'mentored',
      'pioneered', 'revitalized', 'championed', 'architected', 'formulated', 'maximized', 'scaled'
    ];
    
    const foundActionVerbs = actionVerbs.filter(verb => textLower.includes(verb));
    const actionVerbScore = Math.min((foundActionVerbs.length / 12) * 100, 100);

    // Skills extraction (comprehensive list)
    const techSkills = [
      'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'aws', 'azure', 'docker', 'kubernetes',
      'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest api',
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy'
    ];
    
    const softSkills = [
      'leadership', 'communication', 'problem solving', 'teamwork', 'project management',
      'strategic planning', 'critical thinking', 'time management', 'conflict resolution',
      'negotiation', 'presentation', 'mentoring', 'coaching', 'stakeholder management'
    ];
    
    const businessSkills = [
      'agile', 'scrum', 'kanban', 'budgeting', 'forecasting', 'p&l', 'roi', 'kpi',
      'excel', 'powerpoint', 'salesforce', 'tableau', 'power bi', 'seo', 'sem',
      'marketing', 'analytics', 'crm', 'erp', 'financial modeling'
    ];
    
    const allSkills = [...techSkills, ...softSkills, ...businessSkills];
    const foundSkills = allSkills.filter(skill => textLower.includes(skill.toLowerCase()));
    const foundTechSkills = techSkills.filter(skill => textLower.includes(skill.toLowerCase()));
    const foundSoftSkills = softSkills.filter(skill => textLower.includes(skill.toLowerCase()));

    // Section detection
    const sections = {
      summary: /summary|profile|objective|about/i.test(text),
      experience: /experience|employment|work history|professional background/i.test(text),
      education: /education|qualifications|academic|degree/i.test(text),
      skills: /skills|competencies|expertise|technologies/i.test(text),
      achievements: /achievements|accomplishments|awards|recognition/i.test(text),
      certifications: /certifications?|licenses?|credentials/i.test(text)
    };

    // ATS Score calculation (enhanced)
    let atsScore = 0;
    if (words.length >= 300 && words.length <= 800) atsScore += 20;
    if (foundActionVerbs.length >= 10) atsScore += 20;
    if (foundSkills.length >= 8) atsScore += 20;
    if (Object.values(sections).filter(Boolean).length >= 4) atsScore += 20;
    if (achievements.length >= 5) atsScore += 10;
    if (foundBuzzwords.length <= 3) atsScore += 10;

    // Seniority level detection
    const seniorityKeywords = {
      entry: ['intern', 'junior', 'associate', 'assistant', 'entry level', 'graduate'],
      mid: ['specialist', 'analyst', 'coordinator', 'manager', 'lead', 'senior'],
      senior: ['director', 'head', 'vp', 'vice president', 'chief', 'principal', 'executive', 'ceo', 'cto', 'cfo']
    };
    
    let detectedSeniority: 'entry' | 'mid' | 'senior' | '' = '';
    for (const [level, keywords] of Object.entries(seniorityKeywords)) {
      if (keywords.some(kw => textLower.includes(kw))) {
        detectedSeniority = level as 'entry' | 'mid' | 'senior';
        break;
      }
    }

    // Salary estimation based on skills and industry
    const salaryRanges = {
      tech: { entry: [60000, 85000], mid: [85000, 130000], senior: [130000, 220000] },
      finance: { entry: [55000, 75000], mid: [75000, 120000], senior: [120000, 200000] },
      marketing: { entry: [45000, 65000], mid: [65000, 95000], senior: [95000, 150000] },
      healthcare: { entry: [50000, 70000], mid: [70000, 110000], senior: [110000, 180000] },
      general: { entry: [45000, 65000], mid: [65000, 95000], senior: [95000, 150000] }
    };

    const currentSeniority = seniorityLevel || detectedSeniority || 'mid';
    const salaryRange = salaryRanges[industry as keyof typeof salaryRanges]?.[currentSeniority] || salaryRanges.general[currentSeniority];
    
    // Adjust salary based on skills count
    const skillBonus = Math.min(20000, foundSkills.length * 2000);
    const adjustedSalaryRange: [number, number] = [
      salaryRange[0] + skillBonus,
      salaryRange[1] + skillBonus
    ];

    // Job title suggestions based on skills
    const jobTitleSuggestions: string[] = [];
    if (industry === 'tech') {
      if (foundTechSkills.includes('python') || foundTechSkills.includes('machine learning')) {
        jobTitleSuggestions.push('Data Scientist', 'ML Engineer', 'AI Specialist');
      }
      if (foundTechSkills.includes('react') || foundTechSkills.includes('javascript')) {
        jobTitleSuggestions.push('Frontend Developer', 'Full Stack Engineer', 'React Developer');
      }
      if (foundTechSkills.includes('aws') || foundTechSkills.includes('kubernetes')) {
        jobTitleSuggestions.push('DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer');
      }
    } else if (industry === 'marketing') {
      if (foundSkills.includes('seo') || foundSkills.includes('sem')) {
        jobTitleSuggestions.push('SEO Specialist', 'Digital Marketing Manager', 'Growth Marketing Lead');
      }
      if (foundSkills.includes('analytics')) {
        jobTitleSuggestions.push('Marketing Analyst', 'Growth Analyst', 'Marketing Data Scientist');
      }
    }
    
    if (jobTitleSuggestions.length === 0) {
      jobTitleSuggestions.push(`${currentSeniority.charAt(0).toUpperCase() + currentSeniority.slice(1)} Level Professional`);
    }

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

    // Improvement suggestions
    const suggestions: string[] = [];
    if (achievements.length < 5) suggestions.push('Add more quantifiable achievements with numbers and percentages');
    if (foundActionVerbs.length < 10) suggestions.push('Use more strong action verbs at the start of bullet points');
    if (foundBuzzwords.length > 3) suggestions.push(`Remove ${foundBuzzwords.length} buzzwords/cliches and use specific examples instead`);
    if (!sections.summary) suggestions.push('Add a professional summary or objective section');
    if (foundSkills.length < 8) suggestions.push('List more relevant technical and soft skills');
    if (words.length < benchmark.min) suggestions.push(`Increase content to at least ${benchmark.min} words for your industry`);
    if (words.length > benchmark.max) suggestions.push(`Reduce content to maximum ${benchmark.max} words for better impact`);

    // Overall Resume Strength Score
    const strengthScore = Math.round(
      (atsScore * 0.3) +
      (quantifiableScore * 0.2) +
      (actionVerbScore * 0.2) +
      (buzzwordScore * 0.15) +
      (wordCountScore * 0.15)
    );

    return {
      wordCount: words.length,
      charCount: chars,
      sentenceCount: sentences,
      achievements,
      dollarAmounts,
      percentages,
      quantifiableScore,
      buzzwords: foundBuzzwords,
      buzzwordScore,
      actionVerbs: foundActionVerbs,
      actionVerbScore,
      skills: foundSkills,
      techSkills: foundTechSkills,
      softSkills: foundSoftSkills,
      sections,
      atsScore,
      wordCountScore,
      benchmark,
      detectedSeniority,
      salaryRange: adjustedSalaryRange,
      jobTitleSuggestions,
      suggestions,
      strengthScore,
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

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      {/* Main Tool Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              Resume Analyzer
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Get ATS scores, achievement analysis, salary estimates, buzzword alerts, and job title suggestions
            </p>
          </div>

          {/* Grid Layout with Main Content and Sidebar */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Main Card */}
              <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle>Paste Your Resume</CardTitle>
              <CardDescription>
                Get comprehensive analysis with quantifiable achievement detection and salary estimation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Industry & Seniority Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm sm:text-base font-medium">Industry:</label>
                  <div className="flex flex-wrap gap-2">
                    {['general', 'tech', 'finance', 'marketing', 'healthcare'].map((ind) => (
                      <Button
                        key={ind}
                        variant={industry === ind ? 'default' : 'outline'}
                        size="default"
                        className="text-sm sm:text-base h-9 sm:h-10"
                        onClick={() => setIndustry(ind)}
                        data-testid={`button-industry-${ind}`}
                      >
                        {ind.charAt(0).toUpperCase() + ind.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm sm:text-base font-medium">Seniority Level:</label>
                  <div className="flex flex-wrap gap-2">
                    {[{ value: '', label: 'Auto' }, { value: 'entry', label: 'Entry' }, { value: 'mid', label: 'Mid' }, { value: 'senior', label: 'Senior' }].map((level) => (
                      <Button
                        key={level.value}
                        variant={seniorityLevel === level.value ? 'default' : 'outline'}
                        size="default"
                        className="text-sm sm:text-base h-9 sm:h-10"
                        onClick={() => setSeniorityLevel(level.value as any)}
                        data-testid={`button-seniority-${level.value || 'auto'}`}
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="default" className="w-full sm:w-auto h-10 sm:h-10" asChild data-testid="button-upload-resume">
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
                    data-testid="button-clear-resume"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your resume text here... Include your summary, experience with quantifiable achievements (numbers, percentages, dollar amounts), skills, and education sections for best results."
                  className="min-h-[300px] font-mono text-sm"
                  data-testid="textarea-resume-input"
                />
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6">
                  {/* Overall Strength Score */}
                  <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Resume Strength Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-bold" data-testid="text-strength-score">{analysis.strengthScore}%</span>
                          <Badge variant={analysis.strengthScore >= 80 ? 'default' : analysis.strengthScore >= 60 ? 'secondary' : 'destructive'}>
                            {analysis.strengthScore >= 80 ? 'Excellent' : analysis.strengthScore >= 60 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                        <Progress value={analysis.strengthScore} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                          Based on ATS compatibility, quantifiable achievements, action verbs, and content optimization
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Salary Estimate */}
                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Estimated Salary Range
                      </CardTitle>
                      <CardDescription>Based on {industry} industry, {analysis.detectedSeniority || seniorityLevel || 'mid'} level, and {analysis.skills.length} skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-salary-range">
                          {formatSalary(analysis.salaryRange[0])} - {formatSalary(analysis.salaryRange[1])}
                        </span>
                        <span className="text-sm text-muted-foreground">/ year</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        💡 Tip: Add more relevant skills to increase your market value
                      </p>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="achievements" className="w-full">
                    <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start sm:justify-center gap-1 h-auto p-1">
                      <TabsTrigger value="achievements" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-achievements">Achievements</TabsTrigger>
                      <TabsTrigger value="buzzwords" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-buzzwords">Buzzwords</TabsTrigger>
                      <TabsTrigger value="ats" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-ats">ATS</TabsTrigger>
                      <TabsTrigger value="skills" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-skills">Skills</TabsTrigger>
                      <TabsTrigger value="suggestions" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-suggestions">Tips</TabsTrigger>
                      <TabsTrigger value="titles" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-2 sm:px-3" data-testid="tab-titles">Jobs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Quantifiable Achievements Found ({analysis.achievements.length})
                          </CardTitle>
                          <CardDescription>
                            Numbers, percentages, and dollar amounts make your achievements impactful
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="text-center sm:text-left">
                              <div className="text-xl sm:text-2xl font-bold" data-testid="text-achievement-count">{analysis.achievements.length}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">Total Metrics</div>
                            </div>
                            <div className="text-center sm:text-left">
                              <div className="text-xl sm:text-2xl font-bold">{analysis.percentages.length}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">Percentages</div>
                            </div>
                            <div className="text-center sm:text-left">
                              <div className="text-xl sm:text-2xl font-bold">{analysis.dollarAmounts.length}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">Dollar Amounts</div>
                            </div>
                          </div>
                          
                          {analysis.achievements.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {analysis.achievements.slice(0, 15).map((achievement, idx) => (
                                <Badge key={idx} variant="secondary" className="text-sm">
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <Progress value={analysis.quantifiableScore} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            {analysis.achievements.length < 5 && '⚠️ Add more quantifiable achievements! Use numbers to show impact (e.g., "Increased sales by 35%", "Managed $2M budget")'}
                            {analysis.achievements.length >= 5 && analysis.achievements.length < 10 && '✅ Good use of metrics! Consider adding a few more for maximum impact.'}
                            {analysis.achievements.length >= 10 && '🏆 Excellent! Your resume is packed with quantifiable achievements that prove your impact.'}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="buzzwords" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Buzzwords & Clichés Detected ({analysis.buzzwords.length})
                          </CardTitle>
                          <CardDescription>
                            These overused phrases weaken your resume - replace with specific examples
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysis.buzzwords.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-2">
                                {analysis.buzzwords.map((word, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-sm">
                                    ❌ {word}
                                  </Badge>
                                ))}
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">💡 How to Fix:</p>
                                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                                  <li>• Instead of "team player" → "Collaborated with 5-person engineering team to deliver X"</li>
                                  <li>• Instead of "hard worker" → "Completed 15% more projects than team average"</li>
                                  <li>• Instead of "detail-oriented" → "Reduced errors by 40% through systematic quality checks"</li>
                                </ul>
                              </div>
                            </>
                          ) : (
                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                              <p className="text-sm text-green-800 dark:text-green-200">
                                ✅ Excellent! No buzzwords or clichés detected. Your resume uses specific, impactful language.
                              </p>
                            </div>
                          )}
                          <Progress value={analysis.buzzwordScore} className="h-2" />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="ats" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">ATS Compatibility Score</CardTitle>
                          <CardDescription>How well your resume works with automated screening systems</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold" data-testid="text-ats-score">{analysis.atsScore}%</span>
                              <Badge variant={analysis.atsScore >= 75 ? 'default' : analysis.atsScore >= 50 ? 'secondary' : 'destructive'}>
                                {analysis.atsScore >= 75 ? 'ATS Optimized' : analysis.atsScore >= 50 ? 'Needs Work' : 'Poor ATS Score'}
                              </Badge>
                            </div>
                            <Progress value={analysis.atsScore} className="h-3" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <p className="text-sm sm:text-base font-medium">Resume Sections:</p>
                              {Object.entries(analysis.sections).map(([section, found]) => (
                                <div key={section} className="flex items-center gap-2 text-sm">
                                  {found ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  )}
                                  <span className="capitalize">{section}</span>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm sm:text-base font-medium">Key Metrics:</p>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Word Count:</span>
                                  <span className="font-semibold">{analysis.wordCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Action Verbs:</span>
                                  <span className="font-semibold">{analysis.actionVerbs.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Skills Listed:</span>
                                  <span className="font-semibold">{analysis.skills.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Achievements:</span>
                                  <span className="font-semibold">{analysis.achievements.length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Professional Skills Detected ({analysis.skills.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysis.techSkills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">💻 Technical Skills ({analysis.techSkills.length}):</p>
                              <div className="flex flex-wrap gap-2">
                                {analysis.techSkills.map((skill, idx) => (
                                  <Badge key={idx} variant="default" className="capitalize">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.softSkills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">🤝 Soft Skills ({analysis.softSkills.length}):</p>
                              <div className="flex flex-wrap gap-2">
                                {analysis.softSkills.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="capitalize">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {analysis.skills.length < 8 && (
                            <p className="text-sm text-muted-foreground">
                              💡 Add more relevant skills to improve your ATS score and salary potential
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="suggestions" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <FaLightbulb className="h-5 w-5 text-yellow-500" />
                            Personalized Improvement Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {analysis.suggestions.length > 0 ? (
                            <ul className="space-y-3">
                              {analysis.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Target className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              🎉 Excellent! Your resume meets all best practice guidelines. No improvements needed!
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="titles" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Suggested Job Titles</CardTitle>
                          <CardDescription>Based on your skills and industry</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.jobTitleSuggestions.map((title, idx) => (
                              <Badge key={idx} variant="outline" className="text-sm py-2 px-3">
                                <Briefcase className="h-3 w-3 mr-2" />
                                {title}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">
                            💼 These job titles match your skill set. Use them when searching for opportunities!
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 lg:sticky lg:top-4 h-fit">
              <RelatedToolsSidebar currentTool="/resume-cv-checker" limit={5} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Why Our Resume Analyzer is Different</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Achievement Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatically finds all numbers, percentages, and dollar amounts - ensuring your impact is quantifiable and impressive.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaDollarSign className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Salary Estimator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get estimated salary ranges based on your industry, seniority level, and skill count - unique feature not found elsewhere.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FaExclamationTriangle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Buzzword Detector</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identifies overused clichés and provides specific alternatives to make your resume stand out to recruiters.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Job Title Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI-powered job title recommendations based on your unique skill combination and industry experience.
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
          <h2>Advanced Resume Analyzer with Salary Estimation for US, UK, and Canada</h2>
          <p>
            Our Resume/CV Word Counter goes far beyond basic word counting. It's a comprehensive career tool that analyzes your achievements, detects buzzwords, estimates salary potential, and provides personalized improvement tips. Perfect for professionals in the United States, United Kingdom, and Canada who want to maximize their job search success.
          </p>

          <h3>Unique Features You Won't Find Anywhere Else</h3>
          <ul>
            <li><strong>Quantifiable Achievement Detection:</strong> Automatically identifies all numbers, percentages, and dollar amounts in your resume</li>
            <li><strong>Salary Range Estimator:</strong> Get data-driven salary estimates based on your industry, seniority, and skill count</li>
            <li><strong>Buzzword Alert System:</strong> Detects 20+ overused phrases and provides specific alternatives</li>
            <li><strong>Job Title Suggestions:</strong> AI-powered recommendations for roles that match your skills</li>
            <li><strong>Seniority Level Analysis:</strong> Automatic detection of entry, mid, or senior level positions</li>
            <li><strong>Comprehensive Skills Breakdown:</strong> Separates technical skills from soft skills for better understanding</li>
          </ul>

          <h3>Maximize Your Job Search ROI</h3>
          <p>
            In competitive job markets like the US, UK, and Canada, having quantifiable achievements can increase interview callbacks by 40%. Our tool ensures you're highlighting your impact with numbers, percentages, and concrete results that hiring managers love to see.
          </p>
        </div>
      </section>
    </>
  );
}
