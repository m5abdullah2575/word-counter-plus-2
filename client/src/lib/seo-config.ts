// Comprehensive SEO configuration for both Word Counter and Text Case Converter
import { getCurrentOrigin, isMainHost, isCaseHost } from './site';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  structuredData: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

// Word Counter Tool SEO Configuration (Main Domain)
export const getWordCounterSEO = (): SEOConfig => {
  const origin = getCurrentOrigin();
  
  return {
    title: "Free Word Counter, Character Counter & Text Counter Online - Word Counter Plus",
    description: "Free online word counter, character counter, and text counter tool. Count words, characters, paragraphs, sentences instantly. Best text analysis tool with readability scores, keyword density, and export options for writers, students, and content creators. No registration required.",
    keywords: "word counter, character counter, text counter, count words, count characters, free word counter, online word counter, text analysis, word count tool, character count tool, text count tool, paragraph counter, sentence counter, readability score, keyword density, SEO tool, writing tool, content analysis, text statistics, word frequency, character frequency, text counter online, free character counter, count text, word counter online free, character counter online, text counter free, writing analysis, document word count, essay word counter, blog word counter, social media character counter, twitter character counter, facebook character counter, instagram character counter, letter counter, symbol counter, space counter, line counter, page counter, text length checker, word limit checker, character limit checker, text editor, writing assistant, content writing tool, copywriting tool, academic writing, student writing tool, author tool, blogger tool, journalist tool, content creator tool, marketing tool, digital marketing tool, social media tool, email marketing tool, content marketing tool, writing productivity, text processing, document analysis, manuscript analysis, thesis word count, dissertation word count, research paper word count, article word count, story word count, novel word count, book word count, script word count, screenplay word count, poetry word count, lyrics word count, speech word count, presentation word count, report word count, proposal word count, resume word count, cover letter word count, press release word count, website content analysis, web copy analysis, ad copy analysis, product description analysis, meta description counter, title tag counter, heading counter, alt text counter, caption counter, subtitle counter, translation word count, proofreading tool, editing tool, revision tool, draft analysis, final copy analysis, word tracker, character tracker, text tracker, writing goal tracker, daily word count, weekly word count, monthly word count, annual word count, writing stats, writing metrics, writing analytics, text insights, content insights, writing performance, productivity tracker, writing efficiency, content optimization, SEO optimization, content strategy, content planning, content creation, content development, content management, content marketing strategy, digital content, online content, web content, blog content, article content, social content, email content, marketing content, advertising content, copywriting content, technical writing, creative writing, academic writing, business writing, professional writing, freelance writing, content writing services, writing tools, writing software, writing apps, text tools, text software, text apps, online tools, web tools, browser tools, free tools, productivity tools, efficiency tools, optimization tools, analysis tools, measurement tools, tracking tools, monitoring tools, reporting tools, export tools, import tools, file tools, document tools, office tools, writing suite, text suite, content suite, analysis suite, SEO suite, marketing suite, productivity suite, business tools, student tools, academic tools, research tools, professional tools",
    canonical: `${origin}/`,
    ogImage: `${origin}/og-image.png`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": "Word Counter Plus - Free Word Counter, Character Counter & Text Counter",
      "alternateName": ["Word Counter", "Character Counter", "Text Counter", "Word Count Tool", "Character Count Tool"],
      "url": `${origin}`,
      "logo": `${origin}/word-counter-plus-logo.png`,
      "description": "Free online word counter, character counter, and text counter tool. Count words, characters, paragraphs, sentences instantly. Best text analysis tool with readability scores, keyword density, and export options for writers, students, and content creators.",
      "keywords": "word counter, character counter, text counter, count words, count characters, free word counter, online word counter, text analysis, word count tool, character count tool, text count tool, paragraph counter, sentence counter, readability score, keyword density",
      "applicationCategory": ["Productivity", "Education", "Writing", "Text Analysis"],
      "operatingSystem": ["Web Browser", "Windows", "macOS", "Linux", "iOS", "Android"],
      "browserRequirements": "Requires JavaScript. Works with Chrome, Firefox, Safari, Edge.",
      "softwareVersion": "2.0",
      "datePublished": "2024-01-01",
      "dateModified": "2025-09-12",
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "isFamilyFriendly": true,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250",
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
      "creator": {
        "@type": "Organization",
        "name": "Word Counter Plus",
        "url": `${origin}`,
        "logo": `${origin}/word-counter-plus-logo.png`
      },
      "publisher": {
        "@type": "Organization",
        "name": "Word Counter Plus",
        "url": `${origin}`
      },
      "audience": {
        "@type": "Audience",
        "audienceType": ["Writers", "Students", "Content Creators", "Bloggers", "Authors", "Journalists", "Marketers", "Educators", "Researchers", "Social Media Managers"]
      },
      "featureList": [
        "Real-time word counting",
        "Character counting with and without spaces",
        "Paragraph counter",
        "Sentence counter", 
        "Text analysis and statistics",
        "Readability analysis and scoring",
        "Keyword density analysis",
        "Export to PDF, CSV, TXT formats",
        "Reading time estimation",
        "Speaking time calculator",
        "Writing goal tracking",
        "File upload support",
        "Copy and paste functionality",
        "Mobile responsive design",
        "Dark mode support",
        "No registration required",
        "Privacy focused - no data storage",
        "Works offline",
        "Free to use",
        "Cross-platform compatibility"
      ],
      "potentialAction": {
        "@type": "UseAction",
        "target": `${origin}`,
        "object": {
          "@type": "WebPage",
          "name": "Word Counter Plus Tool"
        }
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I count words in a text?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply paste or type your text into the text area and Word Counter Plus will automatically count words, characters, paragraphs, and sentences in real-time."
            }
          },
          {
            "@type": "Question", 
            "name": "Is Word Counter Plus free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Word Counter Plus is completely free to use with no registration required. All features including export options are available at no cost."
            }
          },
          {
            "@type": "Question",
            "name": "Can I export my text analysis results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can export your text analysis results to PDF, CSV, or TXT formats with detailed statistics and readability scores."
            }
          }
        ]
      }
    },
    breadcrumbs: [
      { name: "Word Counter", url: `${origin}/` }
    ]
  };
};

// Text Case Converter Tool SEO Configuration (Case Subdomain)
export const getTextCaseSEO = (): SEOConfig => {
  const origin = getCurrentOrigin();
  
  return {
    title: "Free Text Case Converter - Convert to Upper, Lower, Title, Camel Case Online",
    description: "Free online text case converter tool. Convert text to uppercase, lowercase, title case, camel case, snake case, kebab case, and more. Perfect for developers, writers, and content creators. Instant case conversion with copy-paste functionality. No registration required.",
    keywords: "text case converter, case converter, convert text case, uppercase converter, lowercase converter, title case converter, camel case converter, snake case converter, kebab case converter, pascal case converter, sentence case converter, alternating case converter, inverse case converter, text transformation, text manipulation, string converter, text formatter, case changer, text case tool, online case converter, free case converter, text converter online, case conversion tool, programming text tools, developer tools, coding tools, text processing, string processing, text utility, case utility, format text, text formatting tool, convert uppercase, convert lowercase, convert title case, convert camel case, convert snake case, convert kebab case, text editor, string editor, text modifier, case modifier, programming helper, coding helper, development tools, web development, software development, text editor online, string manipulation, character case, letter case, text style, writing tools, content tools, formatting tools, developer utilities, programmer tools, code formatting, variable naming, function naming, file naming, url formatting, css class naming, javascript naming, python naming, java naming, c++ naming, php naming, ruby naming, go naming, rust naming, swift naming, kotlin naming, typescript naming, react naming, vue naming, angular naming, html formatting, xml formatting, json formatting, yaml formatting, configuration file formatting, environment variable formatting, database naming, table naming, column naming, api naming, endpoint naming, method naming, property naming, constant naming, enum naming, interface naming, class naming, namespace naming, module naming, package naming, library naming, framework naming, plugin naming, extension naming, component naming, service naming, controller naming, model naming, view naming, template naming, stylesheet naming, script naming, image naming, asset naming, resource naming, documentation formatting, readme formatting, markdown formatting, comment formatting, annotation formatting, label formatting, tag formatting, slug formatting, seo friendly urls, permalink formatting, breadcrumb formatting, navigation formatting, menu formatting, link formatting, anchor formatting, title formatting, heading formatting, subtitle formatting, caption formatting, description formatting, summary formatting, abstract formatting, excerpt formatting, teaser formatting",
    canonical: `${origin}/`,
    ogImage: `${origin}/og-image.png`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": "Text Case Converter - Convert to Upper, Lower, Title, Camel Case Online",
      "alternateName": ["Case Converter", "Text Case Tool", "Case Changer", "Text Transformer", "String Converter"],
      "url": `${origin}`,
      "logo": `${origin}/word-counter-plus-logo.png`,
      "description": "Free online text case converter tool. Convert text to uppercase, lowercase, title case, camel case, snake case, kebab case, and more. Perfect for developers, writers, and content creators.",
      "keywords": "text case converter, case converter, convert text case, uppercase converter, lowercase converter, title case converter, camel case converter, snake case converter, kebab case converter, text transformation, text manipulation, string converter, developer tools, programming tools",
      "applicationCategory": ["Productivity", "Developer Tools", "Text Processing", "Utilities"],
      "operatingSystem": ["Web Browser", "Windows", "macOS", "Linux", "iOS", "Android"],
      "browserRequirements": "Requires JavaScript. Works with Chrome, Firefox, Safari, Edge.",
      "softwareVersion": "2.0",
      "datePublished": "2024-01-01",
      "dateModified": "2025-09-12",
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "isFamilyFriendly": true,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "890",
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
      "creator": {
        "@type": "Organization",
        "name": "Word Counter Plus",
        "url": "https://wordcounterplusapp.com",
        "logo": "https://wordcounterplusapp.com/word-counter-plus-logo.png"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Word Counter Plus",
        "url": "https://wordcounterplusapp.com"
      },
      "audience": {
        "@type": "Audience",
        "audienceType": ["Developers", "Programmers", "Writers", "Content Creators", "Students", "Web Developers", "Software Engineers", "Designers", "Marketers"]
      },
      "featureList": [
        "Convert to uppercase (UPPER CASE)",
        "Convert to lowercase (lower case)",
        "Convert to title case (Title Case)",
        "Convert to camel case (camelCase)",
        "Convert to pascal case (PascalCase)",
        "Convert to snake case (snake_case)",
        "Convert to kebab case (kebab-case)",
        "Convert to sentence case (Sentence case)",
        "Convert to alternating case (aLtErNaTiNg CaSe)",
        "Convert to inverse case (iNVERSE cASE)",
        "Instant real-time conversion",
        "Copy to clipboard functionality",
        "Batch text processing",
        "Mobile responsive design",
        "Dark mode support",
        "No registration required",
        "Privacy focused - no data storage",
        "Works offline",
        "Free to use",
        "Cross-platform compatibility"
      ],
      "potentialAction": {
        "@type": "UseAction",
        "target": `${origin}`,
        "object": {
          "@type": "WebPage",
          "name": "Text Case Converter Tool"
        }
      },
      "mainEntity": {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I convert text case online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply paste or type your text into the input field and select the desired case conversion option. The text will be instantly converted to uppercase, lowercase, title case, camel case, or any other supported format."
            }
          },
          {
            "@type": "Question",
            "name": "What case conversion options are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our tool supports uppercase, lowercase, title case, sentence case, camel case, pascal case, snake case, kebab case, alternating case, and inverse case conversions."
            }
          },
          {
            "@type": "Question",
            "name": "Is the text case converter free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our text case converter is completely free to use with no registration required. All conversion features are available at no cost."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use this tool for programming variable names?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Our case converter is perfect for converting text to programming-friendly formats like camelCase, PascalCase, snake_case, and kebab-case for variable names, function names, and file names."
            }
          }
        ]
      }
    },
    breadcrumbs: [
      { name: "Text Case Converter", url: `${origin}/` }
    ]
  };
};

// Dynamic SEO getter based on current domain
export const getCurrentSEOConfig = (): SEOConfig => {
  if (isCaseHost()) {
    return getTextCaseSEO();
  }
  return getWordCounterSEO();
};

// Additional SEO utility functions
export const generateSitemap = () => {
  const mainOrigin = "https://wordcounterplusapp.com";
  const caseOrigin = "https://textcase.wordcounterplusapp.com";
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${mainOrigin}/</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${mainOrigin}/" />
  </url>
  <url>
    <loc>${caseOrigin}/</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${caseOrigin}/" />
  </url>
  <url>
    <loc>${mainOrigin}/about</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${mainOrigin}/contact</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${mainOrigin}/privacy</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${mainOrigin}/terms</loc>
    <lastmod>2025-09-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Main sitemap
Sitemap: https://wordcounterplusapp.com/sitemap.xml

# Case converter sitemap
Sitemap: https://textcase.wordcounterplusapp.com/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Block access to admin or sensitive areas (if any)
Disallow: /admin/
Disallow: /api/internal/
Disallow: /.well-known/
Disallow: /tmp/
Disallow: /logs/

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot  
Allow: /

User-agent: Slurp
Allow: /
`;
};