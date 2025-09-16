import TextCaseConverter from '@/components/text-tools/TextCaseConverter';
import { useSEO } from '@/hooks/useSEO';
import { getCurrentOrigin } from '@/lib/site';
import { getTextCaseSEO } from '@/lib/seo-config';
import RelatedBlogPosts from '@/components/common/RelatedBlogPosts';

export default function TextCaseConverterPage() {
  const currentOrigin = getCurrentOrigin();
  const seoConfig = getTextCaseSEO();
  
  useSEO({
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    canonical: seoConfig.canonical,
    ogImage: seoConfig.ogImage,
    ogType: 'website',
    structuredData: seoConfig.structuredData,
    breadcrumbs: seoConfig.breadcrumbs
  });

  // SEO configuration with structured data is now handled by the useSEO hook

  return (
    <>
      <TextCaseConverter />
      
      {/* Related Blog Posts */}
      <div className="container mx-auto px-4">
        <RelatedBlogPosts toolId="text-case-converter" />
      </div>
      
      {/* Structured data is now handled by the useSEO hook */}
    </>
  );
}