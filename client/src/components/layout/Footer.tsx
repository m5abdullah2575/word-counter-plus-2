import { Link } from "wouter";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { 
  FaPenNib,
  FaStar,
  FaMapMarkerAlt,
  FaBookOpen,
  FaCode,
  FaLightbulb,
  FaUsers,
  FaHeart,
  FaEnvelope,
  FaShieldAlt
} from "react-icons/fa";

export default function Footer() {

  return (
    <footer className="bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-card dark:to-muted/10 border-t border-border/40 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <FaPenNib className="text-white text-xl" aria-label="Word Counter Logo" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Word Counter Plus
                </h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The most comprehensive word counting and text analysis tool trusted by writers, students, and content creators worldwide.
            </p>
            
            {/* Features Highlight */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                <FaLightbulb className="w-3 h-3 mr-1.5" />
                AI-Powered
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                <FaUsers className="w-3 h-3 mr-1.5" />
                2M+ Users
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                <FaShieldAlt className="w-3 h-3 mr-1.5" />
                Secure & Private
              </span>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 border border-border/50">
              <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                <FaEnvelope className="w-3 h-3 mr-2 text-primary" />
                Stay Updated
              </h5>
              <p className="text-xs text-muted-foreground mb-3">Get writing tips and tool updates</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="flex-1 text-xs px-3 py-2 bg-background border border-border/60 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  data-testid="input-newsletter-email"
                />
                <button className="px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2" data-testid="button-newsletter-subscribe">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Text Analysis Tools */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 flex items-center">
              <FaCode className="w-4 h-4 mr-2 text-primary" />
              Text Analysis Tools
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-word-counter">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/character-counter" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-character-counter">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Character Counter
                </Link>
              </li>
              <li>
                <Link href="/text-case-convert" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-text-case-converter">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Text Case Converter
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-all-tools">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Learning */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 flex items-center">
              <FaBookOpen className="w-4 h-4 mr-2 text-primary" />
              Resources & Learning
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-blog">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Writing Tips Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-about">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-faq">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-contact">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-primary" />
              Legal & Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-privacy">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-terms">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-cookies">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center group" data-testid="link-disclaimer">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground order-2 lg:order-1">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} Word Counter Plus. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
              <p className="flex items-center text-center sm:text-left">
                Made with <FaHeart className="text-red-500 mx-1.5 animate-pulse" /> for writers worldwide
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-1 order-1 lg:order-2">
              <p className="text-sm text-muted-foreground mr-4 hidden sm:block">Follow Us:</p>
              <a
                href="https://facebook.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                data-testid="link-facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter / X"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                data-testid="link-twitter"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                data-testid="link-instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                data-testid="link-linkedin"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}