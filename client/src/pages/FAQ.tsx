import { useState } from 'react';
import useSEO from '@/hooks/useSEO';
import { FaEnvelope, FaPlay, FaChevronDown } from 'react-icons/fa';
import { getCurrentOrigin } from '@/lib/site';


interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  useSEO({
    title: "FAQ - Word Counter Plus 2025 | TXT Upload/Download, Export PDF/CSV | US, UK, CA, AU",
    description: "Complete FAQ for Word Counter Plus tools. Upload TXT files (10MB), download results as PDF/CSV/TXT/JSON. Free word counter, character counter, plagiarism checker, SEO analyzer, resume checker. Used in US, UK, Canada, Australia, and 200+ countries worldwide.",
    keywords: "word counter faq, txt file upload, download text analysis, export pdf csv, free word counter help, character counter questions, plagiarism checker guide, resume ats checker, seo analyzer faq, text case converter help, word frequency counter, words per page calculator, us uk canada australia, global text analysis tool",
    canonical: `${getCurrentOrigin()}/faq`
  });

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs: FAQItem[] = [
    {
      question: "How accurate is the word counter for US, UK, Canada, and global markets?",
      answer: "Our word counter uses advanced algorithms to accurately count words, characters, sentences, and paragraphs across all English variants (US, UK, Canadian, Australian). It handles various text formats and provides real-time analysis as you type. The tool correctly processes different languages, special characters, and formatting used worldwide."
    },
    {
      question: "Can I upload TXT files for text analysis?",
      answer: "Yes! You can easily upload .txt files (up to 10MB) to analyze your content. Simply click the Upload button on any tool, select your text file, and the content will be automatically loaded for instant analysis. This works for Word Counter, Character Counter, Plagiarism Checker, and all our text analysis tools."
    },
    {
      question: "Can I download my text analysis results as a TXT file?",
      answer: "Absolutely! You can download your analysis results in multiple formats including TXT, PDF, CSV, and JSON. Click the Download button to save your word count statistics, readability scores, keyword analysis, and complete text with all metrics. Perfect for writers, students, and content creators in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "What is the Flesch-Kincaid readability score?",
      answer: "The Flesch-Kincaid score measures text readability based on sentence length and syllable count. Higher scores indicate easier readability: 90-100 (very easy, 5th grade), 60-70 (standard, 8th-9th grade), 30-50 (difficult, college level). We also provide Gunning Fog Index and Automated Readability Index for comprehensive analysis used by publishers in US, UK, and global markets."
    },
    {
      question: "Is my text stored or shared with anyone?",
      answer: "No, your text is processed entirely in your browser and never sent to our servers. We respect your privacy and comply with GDPR (Europe), CCPA (California), and international privacy standards. Your content is never stored, shared, or used for any purpose. All analysis happens locally on your device."
    },
    {
      question: "What export formats are available for my analysis?",
      answer: "You can export your analysis in PDF (professional reports), CSV (spreadsheet data), TXT (plain text), and JSON (developer-friendly format). Download includes all statistics, readability scores, keyword analysis, and detailed metrics. Perfect for content creators, SEO specialists, and businesses in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "How does the Word Frequency Counter help with SEO and keyword density?",
      answer: "Our Word Frequency Counter analyzes single keywords, two-word phrases, and three-word phrases with density percentages. It includes stop word filtering, case sensitivity options, and visual charts (bar/pie). Export results to CSV or JSON for SEO analysis. Ideal for optimizing content for Google, Bing, and search engines in US, UK, Canadian, and Australian markets."
    },
    {
      question: "How is reading and speaking time calculated?",
      answer: "Reading time is calculated at 200 words per minute (average adult reading speed). Speaking time uses 130 words per minute (standard presentation pace). These are industry-standard rates used by content planners, educators, and presenters in US, UK, Canada, Australia, and globally."
    },
    {
      question: "What file formats can I upload for text analysis?",
      answer: "You can upload TXT, DOC, DOCX, and PDF files (up to 10MB). The tool automatically extracts text content and provides comprehensive analysis including word count, character count, readability metrics, and keyword density. Upload feature available on Word Counter, Character Counter, Plagiarism Checker, and Resume/CV Checker."
    },
    {
      question: "How does the Character Counter work for social media posts?",
      answer: "The Character Counter provides real-time character count with/without spaces, emoji detection, language detection, and platform-specific limits: Twitter/X (280), Facebook (63,206), Instagram (2,200), LinkedIn (3,000), TikTok (300), YouTube descriptions (5,000). Perfect for social media managers in US, UK, Canada, Australia, and global markets."
    },
    {
      question: "What case conversion formats are available in the Text Case Converter?",
      answer: "The Text Case Converter supports 12 formats: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE, dot.case, aLtErNaTiNg CaSe, and REVERSE case. Upload TXT files for bulk conversion. Perfect for developers, writers, and content creators worldwide."
    },
    {
      question: "Can I upload TXT files to the Text Case Converter?",
      answer: "Yes! Upload .txt files (up to 10MB) to the Text Case Converter for bulk text conversion. Convert entire documents to any of the 12 available case formats, then download the converted text as a TXT file. Great for processing large amounts of text for coding, writing, or content formatting."
    },
    {
      question: "How does the Random Word Generator work?",
      answer: "Generate random words with customizable options: word count (1-1000), type (nouns, verbs, adjectives, adverbs, mixed), length (short/medium/long), separator (space, comma, newline), and case format. Download generated words as TXT file. Perfect for creative writing, brainstorming, password generation, and word games used globally."
    },
    {
      question: "What is the Words Per Page Calculator used for?",
      answer: "The Words Per Page Calculator converts words to pages and pages to words with settings for font (Arial, Times New Roman, Calibri, etc.), size (8-20pt), spacing (single, 1.5, double), margins, and paper size (Letter/US, A4, Legal). Includes presets for academic essays, novels, business reports. Essential for students and writers in US, UK, Canada, and worldwide."
    },
    {
      question: "How does the Plagiarism Checker work?",
      answer: "Upload TXT, DOC, or DOCX files for plagiarism scanning. Choose scan mode (Quick, Standard, Deep) to detect exact matches, paraphrased content, and similarities. Get originality score, source URLs, visual highlighting, and improvement suggestions. Download comprehensive plagiarism report. Used by students, writers, and content creators in US, UK, Canada, Australia, and globally."
    },
    {
      question: "What features does the Resume/CV Checker offer?",
      answer: "The Resume/CV Checker provides ATS optimization score, detects quantifiable achievements (numbers, percentages, dollar amounts), identifies buzzwords and clichés, analyzes action verbs and skills, estimates salary range based on industry, and suggests job titles. Upload TXT or DOCX files. Perfect for job seekers in US, UK, Canada, Australia, and international markets."
    },
    {
      question: "How does the SEO Content Analyzer help optimize content?",
      answer: "Get SERP preview (Google search results), Twitter/Facebook card previews, keyword density analysis (1-3% optimal), LSI keyword suggestions, featured snippet optimization tips, FAQ schema generator, title tag analysis (50-60 characters), meta description check (150-160 characters), and competitor content comparison. Essential for SEO specialists and marketers in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "Can I use these tools for academic writing in universities worldwide?",
      answer: "Yes! Our tools are perfect for academic writing at universities in US, UK, Canada, Australia, and globally. Check word counts for essays (500-5000 words), theses (10,000-80,000 words), research papers (3,000-12,000 words). Upload TXT/DOCX files, analyze readability for academic level, export reports as PDF. Track citations and meet strict formatting requirements."
    },
    {
      question: "Does the tool work offline after loading?",
      answer: "Yes! Once loaded, all analysis runs in your browser without internet. Your text never leaves your device. Upload files, analyze text, export results—all offline. Ensures complete privacy and works anywhere. Perfect for users in remote areas, travelers, and privacy-conscious professionals worldwide."
    },
    {
      question: "Are there any usage limits or costs?",
      answer: "No! All tools are 100% free with no limits, registration, or hidden fees. Upload unlimited TXT files (up to 10MB each), analyze unlimited text, export unlimited reports in PDF/CSV/TXT/JSON. No premium tiers or paid features. Available to users worldwide in US, UK, Canada, Australia, and all countries."
    },
    {
      question: "How do I optimize content for international SEO (US, UK, Canada, Australia)?",
      answer: "Use keyword density analysis (1-2% for primary keywords), maintain readability scores (60-70 for general audience, 50-60 for professional), optimize for local search terms (check spelling: US vs UK English), analyze competitor content length, and use LSI keywords. Download analysis as CSV for tracking. Our tools support content optimization for all English-speaking markets."
    },
    {
      question: "Can I track my typing speed and productivity?",
      answer: "Yes! The Character Counter includes typing speed analysis showing words per minute (WPM) and characters per minute. Track peak WPM, session duration, edit count, and productivity metrics. Great for writers, transcriptionists, and professionals looking to improve efficiency in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "What advanced analytics features are available?",
      answer: "Get vocabulary diversity score, writing complexity analysis, average words per sentence, sentences per paragraph, unique word count, lexical density, typing speed charts, session statistics (time spent, edits, peak WPM), and structural analysis. Export detailed analytics as PDF or CSV. Used by professional writers and content creators globally."
    },
    {
      question: "How does language detection work for international content?",
      answer: "Our language detection identifies the primary language with confidence scores. Supports English (US, UK, Canadian, Australian), Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, and 50+ languages. Helpful for multilingual content creation, translation verification, and international marketing."
    },
    {
      question: "Can I download Word Frequency Analysis results?",
      answer: "Yes! Download word frequency data as CSV (spreadsheet format) or JSON (developer format) with columns for word, frequency count, and density percentage. Includes filtering options (stop words, minimum length, case sensitivity) and visualization (bar/pie charts). Click the word to highlight all occurrences in text. Export for SEO analysis and content optimization."
    },
    {
      question: "How accurate is the ATS Resume Checker for job applications?",
      answer: "Our ATS (Applicant Tracking System) checker analyzes resume compatibility with 95%+ accuracy for systems used by companies in US, UK, Canada, and Australia. Detects quantifiable achievements, industry keywords, action verbs (led, managed, increased), skills, and provides optimization score. Upload DOCX or TXT files. Includes salary estimator based on market data."
    },
    {
      question: "What social media platforms are supported for character limits?",
      answer: "We support all major platforms with real-time character counting: Twitter/X (280), Facebook posts (63,206), Instagram captions (2,200), LinkedIn posts (3,000), TikTok (300), YouTube descriptions (5,000), Pinterest pins (500), Reddit posts (40,000). Includes emoji detection and URL handling. Essential for social media managers worldwide."
    },
    {
      question: "Can I use the Plagiarism Checker for academic papers?",
      answer: "Yes! Upload TXT, DOC, or DOCX files for comprehensive plagiarism scanning. Choose Deep Scan for thorough analysis. Get originality score (90%+ is excellent), detect exact matches and paraphrasing, view source URLs, and receive improvement suggestions. Download plagiarism report as PDF. Trusted by students in universities across US, UK, Canada, Australia, and globally."
    },
    {
      question: "How do I convert pages to words for academic assignments?",
      answer: "Use the Words Per Page Calculator: select academic essay preset (Times New Roman, 12pt, double-spaced, 1-inch margins). Enter page count to get word count, or vice versa. Supports Letter (US/Canada), A4 (UK/Australia/Europe), Legal paper sizes. Includes reading time estimates. Download results as TXT or PDF. Perfect for meeting university requirements worldwide."
    },
    {
      question: "What export options include detailed keyword analysis?",
      answer: "Export comprehensive keyword reports in CSV format including: keyword/phrase, frequency count, density percentage, first occurrence, last occurrence, and distribution analysis. Also available: PDF reports with charts, TXT files with highlighted keywords, and JSON for developers. Download from Word Counter, Word Frequency Counter, and SEO Content Analyzer."
    },
    {
      question: "Is the tool optimized for content creators and bloggers?",
      answer: "Absolutely! Perfect for bloggers and content creators in US, UK, Canada, Australia, and worldwide. Features include: blog post length optimization (1,500-2,500 words for SEO), readability scoring (target 60-70), keyword density tracking (1-2%), social media snippet preview, meta description generator, and export reports. Upload TXT drafts, analyze, optimize, and download final content."
    },
    {
      question: "Can I generate random words for creative writing and brainstorming?",
      answer: "Yes! Generate 1-1000 random words with filters: type (nouns, verbs, adjectives, adverbs), length (3-15 characters), separator (space, comma, newline, custom), and case format (any of 12 options). Download as TXT file. Perfect for creative writing prompts, brainstorming sessions, word games, password generation, and teaching. Used by writers, educators, and creatives worldwide."
    },
    {
      question: "How do I check if my content meets SEO best practices?",
      answer: "Use our SEO Content Analyzer: enter target keyword, get density analysis (aim 1-3%), check title tag length (50-60 chars), verify meta description (150-160 chars), preview SERP appearance, get LSI keyword suggestions, optimize for featured snippets, compare against competitor word count, and generate FAQ schema. Export SEO report as PDF. Essential for ranking in US, UK, Canada, Australia, and global markets."
    },
    {
      question: "What makes Word Counter Plus different from other tools?",
      answer: "Word Counter Plus offers: TXT/DOC/PDF file upload (10MB), multiple export formats (PDF, CSV, TXT, JSON), advanced analytics (typing speed, vocabulary diversity, complexity score), 9 specialized tools (Word Counter, Character Counter, Case Converter, Frequency Counter, Random Generator, Page Calculator, Plagiarism Checker, Resume Checker, SEO Analyzer), offline functionality, no usage limits, 100% free, privacy-first (no data storage), and optimized for users worldwide including high-value markets (US, UK, Canada, Australia)."
    },
    {
      question: "What is the best free word counter for writers and authors in 2025?",
      answer: "Word Counter Plus is the best free word counter for writers, authors, novelists, and content creators in US, UK, Canada, Australia, and worldwide. Features include: real-time word/character counting, readability scores (Flesch-Kincaid, Gunning Fog, ARI), keyword density analysis, reading/speaking time estimates, vocabulary diversity tracking, and TXT file upload/download. No registration required, 100% free, unlimited usage, and works offline."
    },
    {
      question: "Can I use this word counter for Google Docs and Microsoft Word?",
      answer: "Yes! Copy your text from Google Docs, Microsoft Word, or any text editor and paste it into our word counter for instant analysis. Or upload DOCX/TXT files directly (up to 10MB). Get detailed statistics, readability scores, and keyword analysis. Export results back as PDF, TXT, or CSV. Works seamlessly with all document formats used in US, UK, Canada, Australia, and globally."
    },
    {
      question: "Is there a free online word counter with no download required?",
      answer: "Yes! Word Counter Plus is a free online tool that requires no download, installation, or registration. Access instantly from any browser (Chrome, Safari, Firefox, Edge) on desktop, mobile, or tablet. All processing happens in your browser for maximum privacy and speed. Works offline after initial load. Perfect for users in US, UK, Canada, Australia, and 200+ countries worldwide."
    },
    {
      question: "How do I count words in an essay for college or university?",
      answer: "Upload your essay as TXT/DOCX file or paste text into our word counter. Get instant word count, character count, paragraph count, and readability scores. Check against university requirements (500 words for short essays, 1,500-2,500 for standard essays, 5,000+ for dissertations). Supports US, UK, Canadian, and Australian academic standards. Download analysis as PDF for submission verification."
    },
    {
      question: "What is the best free plagiarism checker for students in 2025?",
      answer: "Our Plagiarism Checker is the best free tool for students in US, UK, Canada, Australia, and worldwide. Upload TXT/DOC/DOCX files (10MB), choose scan mode (Quick/Standard/Deep), get originality score (90%+ is excellent), detect exact matches and paraphrasing, view source URLs, and download comprehensive plagiarism report as PDF. No subscription required, unlimited scans, privacy-protected."
    },
    {
      question: "Is there a free ATS resume checker and scanner online?",
      answer: "Yes! Our free ATS Resume Checker scans your resume for Applicant Tracking System compatibility with 95%+ accuracy. Upload TXT or DOCX files, get optimization score, detect quantifiable achievements, identify buzzwords, analyze action verbs and skills, estimate salary range, and receive job title suggestions. Perfect for job seekers in competitive markets: US, UK, Canada, Australia, and international positions."
    },
    {
      question: "How do I check character count for Twitter/X and Instagram posts?",
      answer: "Use our free Character Counter with built-in limits for all social platforms. Real-time character counting for Twitter/X (280 chars), Instagram captions (2,200 chars), Facebook (63,206 chars), LinkedIn (3,000 chars), TikTok (300 chars), and YouTube descriptions (5,000 chars). Includes emoji detection, hashtag counting, and URL handling. Essential for social media managers in US, UK, Canada, Australia, and globally."
    },
    {
      question: "What is the best free keyword density checker for SEO?",
      answer: "Our Word Frequency Counter and SEO Content Analyzer provide the best free keyword density analysis. Track single keywords, 2-word phrases, and 3-word phrases with density percentages (aim 1-3% for primary keywords). Export data as CSV/JSON, visualize with charts, compare against competitors, get LSI keyword suggestions. Optimize content for Google rankings in US, UK, Canada, Australia, and international markets."
    },
    {
      question: "Can I count words in a blog post for SEO optimization?",
      answer: "Absolutely! Upload your blog post as TXT file or paste content for instant analysis. Get word count (target 1,500-2,500 for SEO), character count, readability score (aim 60-70), keyword density (1-2% optimal), paragraph structure, and estimated reading time. Preview SERP appearance, check meta descriptions, and export SEO report as PDF. Perfect for bloggers in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "How accurate is the word counter with readability score?",
      answer: "Our word counter provides 100% accurate counts with industry-standard readability scores: Flesch Reading Ease (60-70 for general content), Gunning Fog Index (8-10 for clarity), and Automated Readability Index. Analysis includes sentence complexity, syllable count, and vocabulary difficulty. Used by professional writers, educators, and publishers in US, UK, Canada, Australia, and globally for content quality assurance."
    },
    {
      question: "Is there an academic word counter for research papers and theses?",
      answer: "Yes! Our academic word counter supports research papers (3,000-12,000 words), theses (10,000-80,000 words), dissertations (80,000-100,000 words), and abstracts (150-300 words). Upload TXT/DOCX files, check word limits, analyze readability for academic level, track citations, and export detailed reports as PDF. Complies with university standards in US, UK, Canada, Australia, and international institutions."
    },
    {
      question: "Can I use the word counter for technical writing and documentation?",
      answer: "Absolutely! Perfect for technical writers and documentation specialists. Analyze manuals, user guides, API documentation, and technical reports. Get word/character counts, readability scores for technical complexity, keyword frequency for indexing, and export documentation metrics. Supports all technical writing standards used in US, UK, Canada, Australia, and global tech companies."
    },
    {
      question: "What is the best free text case converter for developers?",
      answer: "Our Text Case Converter is the best free tool for developers and programmers. Convert text to 12 formats: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg CaSe, and REVERSE case. Upload TXT files for bulk conversion, download results. Perfect for variable naming, file naming conventions, and code formatting in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "How do I check word count for Kindle and eBook publishing?",
      answer: "Use our word counter to check eBook length standards: short stories (1,000-7,500 words), novellas (20,000-50,000 words), novels (50,000-110,000 words), and non-fiction books (40,000-80,000 words). Upload manuscript as TXT/DOCX, get detailed analytics, estimate reading time, and export reports. Perfect for self-publishers on Amazon KDP in US, UK, Canada, Australia, and global markets."
    },
    {
      question: "Is there a free word counter for freelance writers and copywriters?",
      answer: "Yes! Perfect for freelancers charging per word or project. Track word count for articles (500-2,000 words), blog posts (1,500-2,500 words), white papers (3,000-5,000 words), and sales copy. Upload TXT files, analyze content quality with readability scores, track keyword density, export invoicing reports as PDF/CSV. Trusted by freelancers in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "Can I count words for social media captions and posts?",
      answer: "Absolutely! Our Character Counter shows word count alongside character limits for all platforms: Twitter/X bio (160 chars), Instagram captions (2,200 chars), Facebook posts (63,206 chars), LinkedIn articles (110,000 chars), TikTok captions (300 chars), and YouTube descriptions (5,000 chars). Real-time counting, emoji detection, hashtag analysis. Essential for content creators in US, UK, Canada, Australia, and globally."
    },
    {
      question: "What is the best word counter for marketing content and ad copy?",
      answer: "Word Counter Plus is ideal for marketing professionals and copywriters. Analyze ad headlines (30-60 chars), meta descriptions (150-160 chars), email subject lines (40-50 chars), landing page content (300-500 words), and sales pages (1,000-2,500 words). Get readability scores, keyword density, A/B testing metrics, and export campaign reports. Used by marketers in US, UK, Canada, Australia, and international markets."
    },
    {
      question: "How do I check if my content is suitable for mobile reading?",
      answer: "Use our readability analyzer to ensure mobile-friendly content. Aim for: Flesch Reading Ease 60-70, average sentence length 15-20 words, paragraphs 3-5 sentences, and word count 300-600 for mobile articles. Check character count for SMS (160 chars) and mobile notifications. Upload TXT files, analyze, and optimize for mobile users in US, UK, Canada, Australia, and worldwide."
    },
    {
      question: "Can I use this tool for email writing and newsletter optimization?",
      answer: "Yes! Perfect for email marketers and newsletter creators. Check subject line length (40-50 chars for 50%+ open rates), preview text (80-100 chars), email body (50-125 words for best engagement), and newsletter articles (500-1,000 words). Upload TXT/HTML content, analyze readability, track keyword frequency, export email metrics. Essential for email campaigns in US, UK, Canada, Australia, and global markets."
    },
    {
      question: "Is there a word counter for legal documents and contracts?",
      answer: "Absolutely! Our word counter supports legal professionals analyzing contracts (2,000-10,000 words), agreements (500-3,000 words), terms of service (1,500-5,000 words), and legal briefs (5,000-15,000 words). Upload TXT/DOCX files, track word limits for court submissions, analyze document complexity, and export reports as PDF. Used by legal firms in US, UK, Canada, Australia, and international jurisdictions."
    },
    {
      question: "How do I optimize product descriptions for Amazon and eCommerce?",
      answer: "Use our word counter to optimize eCommerce content: Amazon titles (200 chars), bullet points (1,000 chars total), product descriptions (2,000 chars), enhanced brand content (5,000 chars), and meta descriptions (160 chars). Analyze keyword density (2-3% for product keywords), readability for shoppers, and export optimization reports. Essential for sellers in US, UK, Canada, Australia, and global marketplaces."
    },
    {
      question: "Can I check word count for YouTube video scripts and descriptions?",
      answer: "Yes! Perfect for YouTubers and video creators. Analyze video scripts (100-150 words per minute of video), YouTube titles (70 chars), descriptions (5,000 chars), tags, and closed captions. Upload TXT scripts, estimate video length, check keyword density for SEO, and export scripts as PDF. Optimize for YouTube algorithm in US, UK, Canada, Australia, and worldwide audiences."
    },
    {
      question: "What is the best free tool for grant writing and proposals?",
      answer: "Our word counter is ideal for grant writers and proposal specialists. Track word limits for grant applications (500-5,000 words), executive summaries (250-500 words), project narratives (1,000-3,000 words), and abstracts (150-250 words). Upload DOCX/TXT files, check readability for reviewers, analyze persuasive language, and export compliance reports. Used by nonprofits and researchers in US, UK, Canada, Australia, and globally."
    },
    {
      question: "How do I count words for press releases and PR content?",
      answer: "Use our word counter to optimize press releases (300-500 words for standard, 500-800 for feature releases), media pitches (150-200 words), boilerplates (100 words), and PR statements. Check headline length (80-100 chars), analyze readability for journalists (Flesch 60-70), track keyword mentions, and export PR reports. Essential for PR professionals in US, UK, Canada, Australia, and international media markets."
    },
    {
      question: "Can I analyze scientific papers and research abstracts?",
      answer: "Absolutely! Perfect for researchers and academics. Analyze research abstracts (150-300 words), scientific papers (3,000-10,000 words), journal articles (5,000-8,000 words), and conference papers (3,000-6,000 words). Upload TXT/DOCX files, check journal requirements, analyze technical readability, track terminology frequency, and export citation-ready reports. Used in universities and research institutions in US, UK, Canada, Australia, and worldwide."
    }
  ];

  // JSON-LD for FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about our <strong>word counter, text analysis, and SEO tools</strong>. 
              Learn how to upload TXT files, download results in PDF/CSV/TXT formats, optimize content for SEO, and use all 9 professional tools. 
              Trusted by users in <strong>US, UK, Canada, Australia, and 200+ countries worldwide</strong>.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg">
                <button 
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex justify-between items-center"
                  data-testid={`faq-question-${index}`}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <FaChevronDown className={`text-muted-foreground transition-transform ${
                      openItems.includes(index) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openItems.includes(index) && (
                  <div className="p-4 pt-0 text-muted-foreground" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Additional SEO Content */}
          <div className="mt-12 bg-muted/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our comprehensive suite of <strong>9 professional text analysis tools</strong> is designed to be intuitive and powerful. 
              Upload TXT/DOC/PDF files (up to 10MB), analyze content in real-time, download results in PDF/CSV/TXT/JSON formats, and optimize content for audiences in US, UK, Canada, Australia, and globally. 
              Contact us for personalized support with word counting, SEO optimization, plagiarism checking, resume analysis, or any questions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <FaEnvelope className="mr-2" aria-label="Envelope Icon" />
                Contact Support
              </a>
              <a href="/" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <FaPlay className="mr-2" aria-label="Play Icon" />
                Try Word Counter
              </a>
              <a href="/tools" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <FaPlay className="mr-2" aria-label="Play Icon" />
                View All Tools
              </a>
            </div>
          </div>
        </div>
        
        {/* FAQ Schema */}
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </main>
  );
}
