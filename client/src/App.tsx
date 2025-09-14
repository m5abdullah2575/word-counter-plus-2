import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import { OptimizedLoader } from '@/components/ui/optimized-loader';
import { lazy, Suspense, useEffect } from "react";
import { isMainHost, isCaseHost } from "@/lib/site";

// Lazy load non-critical pages
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Disclaimer = lazy(() => import("@/pages/Disclaimer"));
const Contact = lazy(() => import("@/pages/Contact"));
const Tools = lazy(() => import("@/pages/Tools"));
const TextCaseConverterPage = lazy(() => import("@/pages/TextCaseConverter"));
const LoremGenerator = lazy(() => import("@/pages/LoremGenerator"));
const PasswordGenerator = lazy(() => import("@/pages/PasswordGenerator"));
const FindReplace = lazy(() => import("@/pages/FindReplace"));
const TextEncoder = lazy(() => import("@/pages/TextEncoder"));
const TextSummarizer = lazy(() => import("@/pages/TextSummarizer"));
const WordFrequencyAnalyzer = lazy(() => import("@/pages/WordFrequencyAnalyzer"));
const TextDiffChecker = lazy(() => import("@/pages/TextDiffChecker"));
const DuplicateLineRemover = lazy(() => import("@/pages/DuplicateLineRemover"));
const TextSortingTool = lazy(() => import("@/pages/TextSortingTool"));
const CharacterCounter = lazy(() => import("@/pages/CharacterCounter"));
const LineCounter = lazy(() => import("@/pages/LineCounter"));
const ReadingTimeCalculator = lazy(() => import("@/pages/ReadingTimeCalculator"));
const HashGenerator = lazy(() => import("@/pages/HashGenerator"));
const QRCodeGenerator = lazy(() => import("@/pages/QRCodeGenerator"));
const URLShortener = lazy(() => import("@/pages/URLShortener"));
const JSONFormatter = lazy(() => import("@/pages/JSONFormatter"));
const WhitespaceRemover = lazy(() => import("@/pages/WhitespaceRemover"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <OptimizedLoader />
  </div>
);

function Router() {
  const currentIsMainHost = isMainHost();
  const currentIsCaseHost = isCaseHost();

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Host-specific routing */}
        {currentIsMainHost && (
          <>
            <Route path="/" component={Home} />
            <Route path="/text-case-convert" component={TextCaseConverterPage} />
            <Route path="/tools" component={Tools} />
            <Route path="/lorem-generator" component={LoremGenerator} />
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/find-replace" component={FindReplace} />
            <Route path="/text-encoder" component={TextEncoder} />
            <Route path="/text-summarizer" component={TextSummarizer} />
            <Route path="/word-frequency-analyzer" component={WordFrequencyAnalyzer} />
            <Route path="/text-diff-checker" component={TextDiffChecker} />
            <Route path="/duplicate-line-remover" component={DuplicateLineRemover} />
            <Route path="/text-sorting-tool" component={TextSortingTool} />
            <Route path="/character-counter" component={CharacterCounter} />
            <Route path="/line-counter" component={LineCounter} />
            <Route path="/reading-time-calculator" component={ReadingTimeCalculator} />
            <Route path="/hash-generator" component={HashGenerator} />
            <Route path="/qr-code-generator" component={QRCodeGenerator} />
            <Route path="/url-shortener" component={URLShortener} />
            <Route path="/json-formatter" component={JSONFormatter} />
            <Route path="/whitespace-remover" component={WhitespaceRemover} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/blog" component={Blog} />
            <Route path="/faq" component={FAQ} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/disclaimer" component={Disclaimer} />
          </>
        )}
        
        {currentIsCaseHost && (
          <>
            <Route path="/" component={TextCaseConverterPage} />
            <Route path="/tools" component={Tools} />
            <Route path="/lorem-generator" component={LoremGenerator} />
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/find-replace" component={FindReplace} />
            <Route path="/text-encoder" component={TextEncoder} />
            <Route path="/text-summarizer" component={TextSummarizer} />
            <Route path="/word-frequency-analyzer" component={WordFrequencyAnalyzer} />
            <Route path="/text-diff-checker" component={TextDiffChecker} />
            <Route path="/duplicate-line-remover" component={DuplicateLineRemover} />
            <Route path="/text-sorting-tool" component={TextSortingTool} />
            <Route path="/character-counter" component={CharacterCounter} />
            <Route path="/line-counter" component={LineCounter} />
            <Route path="/reading-time-calculator" component={ReadingTimeCalculator} />
            <Route path="/hash-generator" component={HashGenerator} />
            <Route path="/qr-code-generator" component={QRCodeGenerator} />
            <Route path="/url-shortener" component={URLShortener} />
            <Route path="/json-formatter" component={JSONFormatter} />
            <Route path="/whitespace-remover" component={WhitespaceRemover} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/blog" component={Blog} />
            <Route path="/faq" component={FAQ} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/disclaimer" component={Disclaimer} />
          </>
        )}
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function BackwardCompatibilityHandler() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tool') === 'case') {
        // Clean the URL and navigate using wouter
        const newUrl = new URL(window.location.href);
        newUrl.search = '';
        window.history.replaceState({}, '', newUrl.toString());
        
        // Navigate using wouter to trigger SPA routing
        setLocation('/text-case-convert');
      }
    }
  }, [setLocation]);

  return null;
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BackwardCompatibilityHandler />
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <ScrollToTop /> 
            <Router />
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
