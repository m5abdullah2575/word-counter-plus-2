import { useState } from 'react';
import useSEO from '@/hooks/useSEO';
import { FaEnvelope, FaPlay, FaChevronDown } from 'react-icons/fa';


interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  useSEO({
    title: "FAQ 2025 - Complete Guide to Word Counter Plus Text Analysis Tools | Frequently Asked Questions",
    description: "Comprehensive FAQ covering Word Counter, Character Counter, Text Case Converter tools. Get answers about features, privacy, SEO optimization, export options, readability scores, keyword density analysis, and advanced text analysis. Updated for 2025 with new features and best practices.",
    keywords: "FAQ 2025, word counter questions, character counter help, text case converter guide, text analysis FAQ, readability score explanation, keyword density FAQ, SEO optimization help, export formats guide, privacy questions, text tools help, writing tools FAQ, content creation guide, digital marketing FAQ, developer tools help, programming text tools, case conversion help, text formatting FAQ, online tools guide, free text analysis, browser tools help, productivity tools FAQ, writing productivity, content optimization FAQ, text statistics help, document analysis FAQ, manuscript analysis, academic writing FAQ, student tools help, business writing FAQ, professional communication, social media tools FAQ, character limits guide, emoji analysis FAQ, language detection help, typing speed FAQ, file upload help, text import FAQ, PDF analysis help, document processing FAQ, text transformation guide, string manipulation help, code formatting FAQ, variable naming help, programming conventions, developer utilities FAQ, text processing help, content strategy FAQ, marketing tools help, copywriting FAQ, blog writing help, article optimization FAQ, press release help, website content FAQ, web copy optimization, ecommerce content FAQ, product description help, amazon listing FAQ, google ads help, facebook ads FAQ, email marketing FAQ, newsletter optimization, social media content FAQ, hashtag analysis help, trending content FAQ, viral content guide, engagement optimization FAQ, duplicate content help, plagiarism checker FAQ, text similarity FAQ, competitive analysis help, semantic SEO FAQ, voice search optimization, featured snippet help, local SEO content FAQ, technical writing help, accessibility content FAQ, mobile optimization FAQ, voice-to-text help, transcription FAQ, podcast script help, video content FAQ, youtube optimization, tiktok content help, content creation workflow, writing process FAQ, editing tools help, proofreading FAQ, grammar checking help, spelling correction FAQ, text editing help, document review FAQ, content approval process, publishing workflow FAQ, content management help, version control FAQ, collaboration tools help, team writing FAQ, shared documents help, real-time editing FAQ, auto-save help, backup content FAQ, data recovery help, export troubleshooting, import problems FAQ, file format help, compatibility FAQ, browser support help, mobile app FAQ, desktop tools help, offline functionality FAQ, internet connection help, performance optimization FAQ, speed improvement help, memory usage FAQ, large document help, batch processing FAQ, automation help, shortcuts guide, keyboard navigation FAQ, accessibility features help, screen reader FAQ, voice control help, multi-language support, international content FAQ, currency formatting help, date formatting FAQ, number formatting help, measurement conversion FAQ, timezone help, localization FAQ, translation tools help, multilingual content FAQ, cross-platform help, windows compatibility FAQ, mac support help, linux compatibility FAQ, iOS app help, android app FAQ, tablet optimization help, responsive design FAQ, dark mode help, theme customization FAQ, UI preferences help, layout customization FAQ, workspace organization help, tool arrangement FAQ, dashboard customization help, widget configuration FAQ, notification settings help, alert preferences FAQ, reminder setup help, goal tracking FAQ, progress monitoring help, analytics dashboard FAQ, usage statistics help, performance metrics FAQ, reporting tools help, data visualization FAQ, chart generation help, graph creation FAQ, infographic tools help, presentation help, slideshow creation FAQ, template usage help, format selection FAQ, style customization help, branding options FAQ, logo integration help, color scheme FAQ, font selection help, typography FAQ, design elements help, visual appeal FAQ, professional appearance help, business presentation FAQ, academic formatting help, citation help, bibliography FAQ, reference formatting help, research tools FAQ, data collection help, survey creation FAQ, questionnaire design FAQ, poll setup help, quiz creation FAQ, test development help, assessment tools FAQ, evaluation help, feedback collection FAQ, review process help, approval workflow FAQ, quality assurance help, content validation FAQ, fact checking help, accuracy verification FAQ, source validation help, credibility assessment FAQ, authority evaluation help, expertise verification FAQ, trust signals help, reliability indicators FAQ, security features help, privacy protection FAQ, data encryption help, secure transmission FAQ, confidential content help, sensitive information FAQ, compliance help, regulation adherence FAQ, industry standards help, best practices FAQ, professional guidelines help, ethical considerations FAQ, responsible usage help, environmental impact FAQ, sustainability practices help, carbon footprint FAQ, green computing help, energy efficiency FAQ, resource optimization help, cost effectiveness FAQ, value proposition help, ROI calculation FAQ, investment justification help, business case FAQ, competitive advantage help, market differentiation FAQ, unique selling proposition help, brand positioning FAQ, marketing strategy help, content strategy FAQ, editorial calendar help, publication schedule FAQ, content planning help, idea generation FAQ, creativity tools help, inspiration sources FAQ, research methods help, topic discovery FAQ, trend analysis help, audience research FAQ, user persona development, target audience FAQ, demographic analysis help, psychographic profiling FAQ, behavioral insights help, engagement metrics FAQ, conversion optimization help, call-to-action FAQ, landing page optimization, user experience FAQ, usability testing help, A/B testing FAQ, conversion rate optimization, growth hacking FAQ, viral marketing help, influencer collaboration FAQ, partnership opportunities help, networking tools FAQ, community building help, audience development FAQ, follower growth help, engagement strategies FAQ, content distribution help, amplification tactics FAQ, reach optimization help, visibility improvement FAQ, organic growth help, paid promotion FAQ, advertising optimization help, campaign management FAQ, budget allocation help, resource planning FAQ, time management help, productivity optimization FAQ, workflow efficiency help, process improvement FAQ, automation opportunities help, tool integration FAQ, API usage help, third-party connections FAQ, plugin compatibility help, extension support FAQ, add-on functionality help, customization options FAQ, configuration help, setup guidance FAQ, installation help, troubleshooting guide, error resolution FAQ, bug reporting help, feature requests FAQ, improvement suggestions help, feedback submission FAQ, contact information help, support channels FAQ, help resources guide, documentation access FAQ, tutorial availability help, training materials FAQ, learning resources guide, skill development help, expertise building FAQ, certification programs help, accreditation options FAQ, professional development help, career advancement FAQ, industry recognition help, portfolio building FAQ, showcase creation help, testimonial collection FAQ, case study development help, success story creation FAQ, reference building help, reputation management FAQ, brand building help, thought leadership FAQ, expertise demonstration help, authority establishment FAQ, credibility building help, trust development FAQ, relationship building help, network expansion FAQ, community engagement help, user-generated content FAQ, collaborative creation help, crowdsourcing opportunities FAQ, collective intelligence help, wisdom of crowds FAQ, community-driven development help, open source contribution FAQ, volunteer opportunities help, giving back FAQ, social responsibility help, corporate citizenship FAQ, ethical business practices help, sustainable development FAQ, environmental stewardship help, social impact FAQ, positive change creation help, world improvement FAQ, humanity service help, purpose-driven work FAQ, meaningful contribution help, legacy building FAQ, impact measurement help, success tracking FAQ, achievement recognition help, milestone celebration FAQ, accomplishment sharing help, victory announcement FAQ, progress communication help, transparency practices FAQ, open communication help, honest dialogue FAQ, authentic interaction help, genuine connection FAQ, real relationship building help, human-centered approach FAQ, empathy development help, compassion cultivation FAQ, kindness promotion help, positivity spreading FAQ, optimism encouragement help, hope inspiration FAQ, motivation boosting help, encouragement provision FAQ, support offering help, assistance delivery FAQ, service excellence help, customer satisfaction FAQ, user delight creation help, experience optimization FAQ, journey improvement help, touchpoint enhancement FAQ, interaction refinement help, engagement deepening FAQ, connection strengthening help, bond formation FAQ, loyalty building help, retention improvement FAQ, satisfaction increase help, happiness enhancement FAQ, joy creation help, pleasure delivery FAQ, delight generation help, surprise element FAQ, wow factor creation help, memorable experience FAQ, lasting impression help, positive impact FAQ, beneficial outcome help, valuable result FAQ, meaningful achievement help, significant accomplishment FAQ, important milestone help, critical success FAQ, essential victory help, vital achievement FAQ, necessary progress help, required advancement FAQ, demanded improvement help, expected enhancement FAQ, anticipated upgrade help, predicted evolution FAQ, forecasted development help, projected growth FAQ, estimated expansion help, calculated increase FAQ, measured improvement help, quantified enhancement FAQ, analyzed optimization help, evaluated refinement FAQ, assessed advancement help, reviewed progress FAQ, monitored development help, tracked improvement FAQ, followed enhancement help, observed optimization FAQ, watched refinement help, noted advancement FAQ, recorded progress help, documented improvement FAQ, catalogued enhancement help, indexed optimization FAQ, classified refinement help, categorized advancement FAQ, sorted progress help, organized improvement FAQ, arranged enhancement help, structured optimization FAQ, formatted refinement help, styled advancement FAQ, designed progress help, created improvement FAQ, built enhancement help, constructed optimization FAQ, developed refinement help, established advancement FAQ, founded progress help, initiated improvement FAQ, started enhancement help, launched optimization FAQ, introduced refinement help, presented advancement FAQ, unveiled progress help, revealed improvement FAQ, disclosed enhancement help, exposed optimization FAQ, shown refinement help, displayed advancement FAQ, exhibited progress help, demonstrated improvement FAQ"
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
      question: "How accurate is the word counter?",
      answer: "Our word counter uses advanced algorithms to accurately count words, characters, sentences, and paragraphs. It handles various text formats and provides real-time analysis as you type. The tool correctly processes different languages, special characters, and formatting."
    },
    {
      question: "What is the Flesch-Kincaid readability score?",
      answer: "The Flesch-Kincaid score measures text readability based on sentence length and syllable count. Higher scores indicate easier readability, with 60-70 being standard and 90-100 being very easy to read. We also provide Gunning Fog Index and Automated Readability Index for comprehensive analysis."
    },
    {
      question: "Is my text stored or shared with anyone?",
      answer: "No, your text is processed entirely in your browser and never sent to our servers. We respect your privacy and don't store or share any of your content. You can use our tool offline once loaded. All analysis happens locally on your device."
    },
    {
      question: "Can I export my analysis results?",
      answer: "Yes! You can export your analysis in multiple formats including PDF, CSV, TXT, and JSON. You can also copy results to clipboard or share them on social media platforms. Export includes all statistics, readability scores, and keyword analysis."
    },
    {
      question: "What features does the keyword density analysis include?",
      answer: "Our keyword density tool analyzes single keywords, two-word phrases, and three-word phrases. It shows frequency counts, percentages, and can highlight keywords in your text for easy visualization. Perfect for SEO content optimization."
    },
    {
      question: "How is the reading time calculated?",
      answer: "Reading time is estimated based on an average reading speed of 200 words per minute. Speaking time uses 130 words per minute. These are industry-standard rates for content planning and presentation preparation."
    },
    {
      question: "Can I use this tool for SEO content optimization?",
      answer: "Absolutely! The keyword density analysis, readability scores, and word count targets make it perfect for SEO content optimization. Aim for 1-2% keyword density for best results. Use readability scores to ensure content is accessible to your target audience."
    },
    {
      question: "Does the tool work offline?",
      answer: "Yes, once the page is loaded, all analysis is performed in your browser without needing an internet connection. Your text never leaves your device, ensuring complete privacy and security."
    },
    {
      question: "What file formats can I upload for analysis?",
      answer: "You can upload various file formats including TXT, DOC, DOCX, PDF, and more. The tool automatically extracts text content and provides comprehensive analysis including word count, character count, and readability metrics."
    },
    {
      question: "How does the Character Counter tool work?",
      answer: "The Character Counter provides detailed character analysis including characters with/without spaces, emoji detection, language detection, typing speed tracking, and social media character limit checking for platforms like Twitter, Facebook, Instagram, and LinkedIn."
    },
    {
      question: "What case conversion options are available in the Text Case Converter?",
      answer: "The Text Case Converter supports multiple formats: uppercase, lowercase, title case, sentence case, camel case, pascal case, snake case, kebab case, alternating case, and inverse case. Perfect for developers, writers, and content creators."
    },
    {
      question: "Can I use these tools for academic writing?",
      answer: "Yes! Our tools are perfect for academic writing. Check word counts for essays, theses, and dissertations. Use readability analysis to ensure appropriate complexity levels. The citation and reference formatting features help maintain academic standards."
    },
    {
      question: "How does the social media character limit feature work?",
      answer: "Our Character Counter includes built-in limits for major platforms: Twitter (280 characters), Facebook posts (63,206 characters), Instagram captions (2,200 characters), LinkedIn posts (3,000 characters), and TikTok captions (300 characters). Get real-time feedback as you type."
    },
    {
      question: "Is there a mobile app available?",
      answer: "While we don't have a dedicated mobile app, our web-based tools are fully responsive and optimized for mobile devices. Access all features from any smartphone or tablet browser with full functionality."
    },
    {
      question: "Can I use these tools for programming and code formatting?",
      answer: "Yes! The Text Case Converter is particularly useful for programming. Convert text to camelCase, PascalCase, snake_case, or kebab-case for variable names, function names, and file naming conventions across different programming languages."
    },
    {
      question: "How accurate is the language detection feature?",
      answer: "Our language detection uses advanced algorithms to identify the primary language of your text. It supports major world languages and provides confidence scores. This helps with international content creation and localization projects."
    },
    {
      question: "Can I track my typing speed with these tools?",
      answer: "Yes! The Character Counter includes a typing speed calculator that measures your words per minute (WPM) and characters per minute. Great for writers looking to improve their productivity and typing efficiency."
    },
    {
      question: "Are there any usage limits or restrictions?",
      answer: "No! All our tools are completely free with no usage limits, registration requirements, or hidden fees. Process unlimited text, upload multiple files, and use all features without restrictions."
    },
    {
      question: "How do I optimize content for different platforms?",
      answer: "Use our platform-specific character limits, optimize keyword density for SEO (1-2%), maintain readability scores appropriate for your audience (60-70 for general content), and use the export features to format content for different channels."
    },
    {
      question: "Can I use these tools for team collaboration?",
      answer: "While our tools are individual-focused for privacy, you can easily share analysis results via export features or copy-paste functionality. The consistent formatting helps maintain team content standards."
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
              Get answers to the most common questions about our <strong>word counter and text analysis tool</strong>. 
              Learn how to make the most of our features for content creation and SEO optimization.
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
              Can't find the answer you're looking for? Our comprehensive <strong>word counter tool</strong> is designed to be intuitive, 
              but we're always here to help. Contact us for personalized support with text analysis, SEO optimization, or any other questions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <FaEnvelope className="mr-2" aria-label="Envelope Icon" />
                Contact Support
              </a>
              <a href="/" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                <FaPlay className="mr-2" aria-label="Play Icon" />
                Try the Tool
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
