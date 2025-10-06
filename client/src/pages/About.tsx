import { Link } from "wouter";
import { Target, Users, Award, Zap, Shield, Globe } from "lucide-react";
import useSEO from '@/hooks/useSEO';

export default function About() {
  useSEO({
    title: "About Word Counter Plus 2025 | Free Text Analysis Tools | Upload TXT, Export PDF/CSV | US, UK, CA, AU",
    description: "Word Counter Plus: 100% free text analysis platform with 9 specialized tools. Upload TXT/DOC/PDF files (10MB), export to PDF/CSV/TXT/JSON. No limits, no registration. Privacy-first, offline-capable. Trusted by writers, students, and content creators in US, UK, Canada, Australia, and 200+ countries worldwide.",
    keywords: "about word counter plus, free text analysis tools, upload txt files, export pdf csv, word counter character counter, plagiarism checker, resume ats checker, seo analyzer, case converter, word frequency counter, us uk canada australia, global writing tools",
    canonical: "https://wordcounterplusapp.com/about"
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          About Word Counter Plus
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The world's most comprehensive free text analysis platform with 9 specialized tools. 
          Upload files, analyze content, and export professional reports—all 100% free with no limits. 
          Trusted by millions in the US, UK, Canada, Australia, and 200+ countries worldwide.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        
        {/* Our Story */}
        <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
              <p className="text-lg leading-relaxed">
                Word Counter Plus was born from a simple idea: every writer deserves access to professional-grade 
                text analysis tools without the complexity or cost barriers. Whether you're a student working on an essay, 
                a blogger crafting the perfect post, a job seeker optimizing your resume, or a professional writer meeting strict guidelines, 
                we believe you should have the tools to succeed—completely free, with no registration, and unlimited usage.
              </p>
              <p className="text-lg leading-relaxed">
                What started as a basic word counting tool has evolved into a comprehensive suite of 9 specialized tools 
                including advanced plagiarism detection, ATS resume optimization, SEO content analysis, and more. Today, we help 
                millions of users worldwide—from students and freelancers in the US, UK, Canada, and Australia to content creators 
                across 200+ countries—improve their writing, meet requirements, and create more engaging content.
              </p>
              <p className="text-lg leading-relaxed">
                Our commitment remains unwavering: provide the most powerful text analysis tools, absolutely free, with complete privacy protection, 
                and no artificial limits on usage. Your success is our success.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              To democratize access to powerful writing tools and help every writer, student, professional, and content creator 
              achieve their best work. We believe that great writing shouldn't be limited by expensive software, complex platforms, 
              usage limits, or geographic location. That's why we offer enterprise-grade text analysis tools—completely free, 
              with unlimited usage, and accessible to users worldwide in the US, UK, Canada, Australia, and 200+ countries.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Accessibility First</h3>
                  <p className="text-muted-foreground">Free, fast, and easy-to-use tools for everyone</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Privacy Focused</h3>
                  <p className="text-muted-foreground">All text processing happens in your browser - we never see your content</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Lightning Fast</h3>
                  <p className="text-muted-foreground">Real-time analysis with instant results as you type</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Why Choose Us?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Upload TXT/DOC/PDF files up to 10MB</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Export to PDF, CSV, TXT, and JSON</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">9 specialized tools in one platform</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">100% free with unlimited usage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Privacy-first (browser-based processing)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Works offline after loading</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">No registration or login required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">GDPR, CCPA compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid - 9 Specialized Tools */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">9 Specialized Tools in One Platform</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Every tool includes file upload (TXT/DOC/PDF up to 10MB) and export options (PDF, CSV, TXT, JSON). 
            All completely free with unlimited usage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Word Counter</h3>
              <p className="text-muted-foreground">
                Real-time word, character, sentence, and paragraph counting with Flesch-Kincaid readability scores, 
                typing speed tracking, and reading/speaking time estimates.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Character Counter</h3>
              <p className="text-muted-foreground">
                Character count with/without spaces, emoji detection, language detection, and platform-specific limits 
                for Twitter/X, Facebook, Instagram, LinkedIn, TikTok, YouTube.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Text Case Converter</h3>
              <p className="text-muted-foreground">
                Convert text to 12 formats: UPPERCASE, lowercase, Title Case, camelCase, PascalCase, kebab-case, 
                snake_case, CONSTANT_CASE, dot.case, and more. Perfect for developers.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Word Frequency Counter</h3>
              <p className="text-muted-foreground">
                Analyze single keywords, 2-word and 3-word phrases with density percentages. Includes stop word filtering, 
                visual charts, and CSV/JSON export for SEO analysis.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Random Word Generator</h3>
              <p className="text-muted-foreground">
                Generate 1-1000 random words with customizable options: word type (nouns, verbs, adjectives), length, 
                separator, and case format. Great for creative writing and brainstorming.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Words Per Page Calculator</h3>
              <p className="text-muted-foreground">
                Convert words to pages and vice versa with settings for font, size, spacing, margins, and paper size 
                (Letter/US, A4, Legal). Includes academic essay and novel presets.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Plagiarism Checker</h3>
              <p className="text-muted-foreground">
                Upload TXT/DOC/DOCX files for plagiarism scanning. Choose scan mode (Quick/Standard/Deep), get originality score, 
                detect paraphrasing, view source URLs, and download comprehensive reports.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Resume/CV Checker</h3>
              <p className="text-muted-foreground">
                ATS optimization score, quantifiable achievements detection, buzzword analysis, action verb identification, 
                skills analysis, and salary range estimation. Perfect for job seekers.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">SEO Content Analyzer</h3>
              <p className="text-muted-foreground">
                SERP preview, social media cards, keyword density analysis (1-3% optimal), LSI keyword suggestions, 
                featured snippet optimization, FAQ schema generator, and competitor analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Global Reach & Trust */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 shadow-sm border border-primary/20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Trusted Worldwide</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Used by millions of writers, students, professionals, and content creators across 200+ countries. 
              Optimized for users in the US, UK, Canada, Australia, and international markets. Our tools work anywhere, 
              support all English variants, and comply with GDPR (Europe) and CCPA (California) privacy standards.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">9</div>
                <div className="text-sm text-muted-foreground">Specialized Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10MB</div>
                <div className="text-sm text-muted-foreground">Max File Upload</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Countries Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Support */}
        <section className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Community</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're more than just a tool - we're a community of writers helping writers. 
              Whether you're a student in the US, a freelancer in the UK, a blogger in Canada, a professional in Australia, 
              or a content creator anywhere else, we're here to support you with powerful, free tools and helpful resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors" data-testid="button-contact">
                  Get in Touch
                </button>
              </Link>
              <Link href="/faq">
                <button className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/50 transition-colors" data-testid="button-faq">
                  View FAQ
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary/5 rounded-lg p-8 text-center border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Improve Your Writing?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Access 9 professional text analysis tools—completely free, no registration required, unlimited usage. 
            Upload files, analyze content, export reports. Start creating better content today.
          </p>
          <Link href="/">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors" data-testid="button-start">
              Start Analyzing Your Text - Free
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}