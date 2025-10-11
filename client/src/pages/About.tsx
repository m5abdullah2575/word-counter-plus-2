import { Link } from "wouter";
import { Target, Users, Award, Zap, Shield, Globe, CheckCircle, TrendingUp, FileText, Sparkles } from "lucide-react";
import useSEO from '@/hooks/useSEO';

export default function About() {
  useSEO({
    title: "About Word Counter Plus 2025 | Free Text Analysis Tools | Upload TXT, Export PDF/CSV | US, UK, CA, AU",
    description: "Word Counter Plus: 100% free text analysis platform with 9 specialized tools. Upload TXT/DOC/PDF files (10MB), export to PDF/CSV/TXT/JSON. No limits, no registration. Privacy-first, offline-capable. Trusted by writers, students, and content creators in US, UK, Canada, Australia, and 200+ countries worldwide.",
    keywords: "about word counter plus, free text analysis tools, upload txt files, export pdf csv, word counter character counter, plagiarism checker, resume ats checker, seo analyzer, case converter, word frequency counter, us uk canada australia, global writing tools",
    canonical: "https://wordcounterplusapp.com/about"
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6" data-testid="badge-tagline">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by millions worldwide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text" data-testid="heading-about">
              About Word Counter Plus
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              The world's most comprehensive free text analysis platform with 9 specialized tools. 
              Upload files, analyze content, and export professional reports—all 100% free with no limits. 
              Trusted by millions in the US, UK, Canada, Australia, and 200+ countries worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 space-y-20">
        
        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-free">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Free Forever</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-tools">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">9</div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Specialized Tools</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-upload">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10MB</div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Max File Upload</div>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-countries">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">Countries Served</div>
          </div>
        </section>

        {/* Our Story */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-story">Our Story</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
            <div className="prose prose-gray max-w-none text-muted-foreground space-y-6">
              <p className="text-lg leading-relaxed" data-testid="text-story-1">
                Word Counter Plus was born from a simple idea: every writer deserves access to professional-grade 
                text analysis tools without the complexity or cost barriers. Whether you're a student working on an essay, 
                a blogger crafting the perfect post, a job seeker optimizing your resume, or a professional writer meeting strict guidelines, 
                we believe you should have the tools to succeed—completely free, with no registration, and unlimited usage.
              </p>
              <p className="text-lg leading-relaxed" data-testid="text-story-2">
                What started as a basic word counting tool has evolved into a comprehensive suite of 9 specialized tools 
                including advanced plagiarism detection, ATS resume optimization, SEO content analysis, and more. Today, we help 
                millions of users worldwide—from students and freelancers in the US, UK, Canada, and Australia to content creators 
                across 200+ countries—improve their writing, meet requirements, and create more engaging content.
              </p>
              <p className="text-lg leading-relaxed" data-testid="text-story-3">
                Our commitment remains unwavering: provide the most powerful text analysis tools, absolutely free, with complete privacy protection, 
                and no artificial limits on usage. Your success is our success.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="heading-mission">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-mission">
                To democratize access to powerful writing tools and help every writer, student, professional, and content creator 
                achieve their best work. We believe that great writing shouldn't be limited by expensive software, complex platforms, 
                usage limits, or geographic location. That's why we offer enterprise-grade text analysis tools—completely free, 
                with unlimited usage, and accessible to users worldwide in the US, UK, Canada, Australia, and 200+ countries.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors" data-testid="value-accessibility">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Accessibility First</h3>
                  <p className="text-muted-foreground">Free, fast, and easy-to-use tools for everyone</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors" data-testid="value-privacy">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Privacy Focused</h3>
                  <p className="text-muted-foreground">All text processing happens in your browser - we never see your content</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors" data-testid="value-speed">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Lightning Fast</h3>
                  <p className="text-muted-foreground">Real-time analysis with instant results as you type</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-accent/5 rounded-2xl p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center" data-testid="heading-why-choose">Why Choose Us?</h3>
            <div className="space-y-4">
              {[
                "Upload TXT/DOC/PDF files up to 10MB",
                "Export to PDF, CSV, TXT, and JSON",
                "9 specialized tools in one platform",
                "100% free with unlimited usage",
                "Privacy-first (browser-based processing)",
                "Works offline after loading",
                "No registration or login required",
                "GDPR, CCPA compliant"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group" data-testid={`feature-${index}`}>
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9 Specialized Tools */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-tools">9 Specialized Tools in One Platform</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground max-w-3xl mx-auto" data-testid="text-tools-description">
              Every tool includes file upload (TXT/DOC/PDF up to 10MB) and export options (PDF, CSV, TXT, JSON). 
              All completely free with unlimited usage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-word-counter">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Word Counter</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Real-time word, character, sentence, and paragraph counting with Flesch-Kincaid readability scores, 
                typing speed tracking, and reading/speaking time estimates.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-character-counter">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Character Counter</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Character count with/without spaces, emoji detection, language detection, and platform-specific limits 
                for Twitter/X, Facebook, Instagram, LinkedIn, TikTok, YouTube.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-case-converter">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Text Case Converter</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Convert text to 12 formats: UPPERCASE, lowercase, Title Case, camelCase, PascalCase, kebab-case, 
                snake_case, CONSTANT_CASE, dot.case, and more. Perfect for developers.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-word-frequency">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Word Frequency Counter</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Analyze single keywords, 2-word and 3-word phrases with density percentages. Includes stop word filtering, 
                visual charts, and CSV/JSON export for SEO analysis.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-random-word">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Random Word Generator</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Generate 1-1000 random words with customizable options: word type (nouns, verbs, adjectives), length, 
                separator, and case format. Great for creative writing and brainstorming.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-words-per-page">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Words Per Page Calculator</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Convert words to pages and vice versa with settings for font, size, spacing, margins, and paper size 
                (Letter/US, A4, Legal). Includes academic essay and novel presets.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-plagiarism">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Plagiarism Checker</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload TXT/DOC/DOCX files for plagiarism scanning. Choose scan mode (Quick/Standard/Deep), get originality score, 
                detect paraphrasing, view source URLs, and download comprehensive reports.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-resume-checker">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Resume/CV Checker</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                ATS optimization score, quantifiable achievements detection, buzzword analysis, action verb identification, 
                skills analysis, and salary range estimation. Perfect for job seekers.
              </p>
            </div>

            <div className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300" data-testid="tool-seo-analyzer">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">SEO Content Analyzer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SERP preview, social media cards, keyword density analysis (1-3% optimal), LSI keyword suggestions, 
                featured snippet optimization, FAQ schema generator, and competitor analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Global Reach */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-2xl p-8 md:p-12 shadow-xl border border-primary/20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="heading-global">Trusted Worldwide</h2>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-global">
              Used by millions of writers, students, professionals, and content creators across 200+ countries. 
              Optimized for users in the US, UK, Canada, Australia, and international markets. Our tools work anywhere, 
              support all English variants, and comply with GDPR (Europe) and CCPA (California) privacy standards.
            </p>
          </div>
        </section>

        {/* Community & Support */}
        <section className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="heading-community">Join Our Community</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-community">
              We're more than just a tool - we're a community of writers helping writers. 
              Whether you're a student in the US, a freelancer in the UK, a blogger in Canada, a professional in Australia, 
              or a content creator anywhere else, we're here to support you with powerful, free tools and helpful resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl" data-testid="button-contact">
                  Get in Touch
                </button>
              </Link>
              <Link href="/faq">
                <button className="border-2 border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted/50 transition-all hover:scale-105" data-testid="button-faq">
                  View FAQ
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="heading-cta">Ready to Improve Your Writing?</h2>
          <p className="text-lg text-white/95 mb-8 max-w-3xl mx-auto" data-testid="text-cta">
            Access 9 professional text analysis tools—completely free, no registration required, unlimited usage. 
            Upload files, analyze content, export reports. Start creating better content today.
          </p>
          <Link href="/">
            <button className="bg-white text-primary px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/95 transition-all hover:scale-105 shadow-2xl" data-testid="button-start">
              Start Analyzing Your Text - Free
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
