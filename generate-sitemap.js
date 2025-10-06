import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://wordcounterplusapp.com';
const DIST_PUBLIC_PATH = join(__dirname, 'dist', 'public');

function getStaticPages() {
  const staticRoutes = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    
    { url: '/seo-content-analyzer', priority: 0.95, changefreq: 'weekly' },
    { url: '/plagiarism-checker', priority: 0.95, changefreq: 'weekly' },
    { url: '/resume-cv-checker', priority: 0.95, changefreq: 'weekly' },
    
    { url: '/tools', priority: 0.9, changefreq: 'weekly' },
    { url: '/character-counter', priority: 0.9, changefreq: 'weekly' },
    { url: '/text-case-convert', priority: 0.9, changefreq: 'weekly' },
    { url: '/word-frequency-counter', priority: 0.85, changefreq: 'weekly' },
    { url: '/random-word-generator', priority: 0.85, changefreq: 'weekly' },
    { url: '/words-per-page', priority: 0.85, changefreq: 'weekly' },
    
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/faq', priority: 0.7, changefreq: 'monthly' },
    
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
    { url: '/terms', priority: 0.5, changefreq: 'yearly' },
    { url: '/disclaimer', priority: 0.5, changefreq: 'yearly' },
    { url: '/cookies', priority: 0.5, changefreq: 'yearly' }
  ];

  return staticRoutes.map(route => ({
    url: route.url,
    changefreq: route.changefreq,
    priority: route.priority
  }));
}

async function getBlogPosts() {
  try {
    console.log('Reading blog data from all category files...');
    
    const allBlogs = [];
    
    const blogFiles = [
      'client/src/data/blogData.ts',
      'client/src/data/blogs/character-counter-blogs.ts',
      'client/src/data/blogs/text-case-converter-blogs.ts',
      'client/src/data/blogs/word-frequency-counter-blogs.ts',
      'client/src/data/blogs/random-word-generator-blogs.ts',
      'client/src/data/blogs/words-per-page-blogs.ts',
      'client/src/data/blogs/plagiarism-checker-blogs.ts',
      'client/src/data/blogs/resume-cv-blogs.ts',
      'client/src/data/blogs/seo-content-analyzer-blogs.ts'
    ];
    
    for (const filePath of blogFiles) {
      const fullPath = join(__dirname, filePath);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf8');
        
        const slugMatches = content.match(/slug:\s*["']([^"']+)["']/g);
        const publishDateMatches = content.match(/publishDate:\s*["']([^"']+)["']/g);
        
        if (slugMatches) {
          const slugs = slugMatches.map(match => match.match(/["']([^"']+)["']/)[1]);
          const dates = publishDateMatches ? publishDateMatches.map(match => match.match(/["']([^"']+)["']/)[1]) : [];
          
          slugs.forEach((slug, index) => {
            allBlogs.push({
              url: `/blog/${slug}`,
              changefreq: 'monthly',
              priority: 0.6,
              lastmod: dates[index] ? new Date(dates[index]).toISOString() : new Date().toISOString()
            });
          });
        }
      }
    }
    
    console.log(`✅ Found ${allBlogs.length} blog posts from all category files`);
    return allBlogs;
    
  } catch (error) {
    console.error('❌ Error reading blog posts:', error);
    return [];
  }
}

function generateRobotsTxt() {
  const robotsContent = `# Robots.txt for Word Counter Plus
# Optimized for search engines (Google, Bing, Yahoo, DuckDuckGo)

User-agent: *
Allow: /
Allow: /seo-content-analyzer
Allow: /plagiarism-checker
Allow: /resume-cv-checker
Allow: /character-counter
Allow: /text-case-convert
Allow: /word-frequency-counter
Allow: /random-word-generator
Allow: /words-per-page
Allow: /blog

Disallow: /admin/
Disallow: /api/
Disallow: /drafts/
Disallow: /*.pdf$
Disallow: /private/
Disallow: /.local/
Disallow: /server/

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  writeFileSync(join(DIST_PUBLIC_PATH, 'robots.txt'), robotsContent);
  console.log('✅ Generated robots.txt');
}

async function generateSitemap() {
  try {
    console.log('🚀 Generating sitemap and robots.txt...');

    const staticPages = getStaticPages();
    const blogPosts = await getBlogPosts();
    const allUrls = [...staticPages, ...blogPosts];

    console.log(`📄 Found ${staticPages.length} static pages`);
    console.log(`📝 Found ${blogPosts.length} blog posts`);
    console.log(`🔗 Total URLs: ${allUrls.length}`);

    const sitemapStream = new SitemapStream({ hostname: SITE_URL });
    const writeStream = createWriteStream(join(DIST_PUBLIC_PATH, 'sitemap.xml'));
    
    sitemapStream.pipe(writeStream);

    allUrls.forEach(urlData => {
      sitemapStream.write(urlData);
    });

    sitemapStream.end();

    await streamToPromise(sitemapStream);
    
    console.log('✅ Generated sitemap.xml');

    generateRobotsTxt();

    console.log('🎉 Sitemap generation completed successfully!');
    console.log(`📍 Files generated in: ${DIST_PUBLIC_PATH}`);
    console.log(`\n📋 Summary:`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`   - Total URLs in sitemap: ${allUrls.length}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
