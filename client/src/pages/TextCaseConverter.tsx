import TextCaseConverter from '@/components/text-tools/TextCaseConverter';
import { useSEO } from '@/hooks/useSEO';
import { getCurrentOrigin } from '@/lib/site';

export default function TextCaseConverterPage() {
  const currentOrigin = getCurrentOrigin();
  
  useSEO({
    title: 'Text Case Converter - Convert Text Cases Online | Word Counter Plus',
    description: 'Free online text case converter tool. Convert text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case and more. Perfect for developers and writers.',
    keywords: 'text case converter, uppercase, lowercase, title case, camelCase, snake_case, kebab-case, PascalCase, text formatting, case conversion tool',
    canonical: `${currentOrigin}/`,
    ogType: 'website'
  });

  // ✅ Text Case Converter Page Structured Data Schema
  const textCaseConverterSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${currentOrigin}/#webapplication`,
    "name": "Text Case Converter",
    "url": `${currentOrigin}/`,
    "description": "Free online text case converter tool. Convert text between 12 different case formats including camelCase, PascalCase, snake_case, UPPERCASE, lowercase, and more with file upload support.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "camelCase Conversion",
      "PascalCase Conversion", 
      "snake_case Conversion",
      "kebab-case Conversion",
      "CONSTANT_CASE Conversion",
      "UPPERCASE Conversion",
      "lowercase Conversion",
      "Title Case Conversion",
      "Sentence case Conversion",
      "dot.case Conversion",
      "Alternating Case",
      "Reverse Case",
      "File Upload Support",
      "Copy to Clipboard",
      "Download Results"
    ],
    "keywords": "text case converter, camelcase converter, uppercase converter, lowercase converter, snake case converter, kebab case converter, pascal case converter, text formatter, case converter online, text transformation tool",
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.8",
      "bestRating": "5",
      "ratingCount": "89"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${currentOrigin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Text Case Converter",
        "item": `${currentOrigin}/`
      }
    ]
  };

  return (
    <>
      <TextCaseConverter />
      
      {/* ✅ Inject Text Case Converter Structured Data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(textCaseConverterSchema) }}
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}