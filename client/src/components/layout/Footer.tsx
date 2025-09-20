import { Link } from "wouter";
import {
  FaPenNib,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { 
  FaStar,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaBookOpen,
  FaCode,
  FaLightbulb,
  FaUsers,
  FaHeart
} from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log("Newsletter signup for:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-border/50 mt-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-60"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <FaPenNib className="text-white text-xl" aria-label="Word Counter Logo" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  Word Counter Plus
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(4.9/5)</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The most comprehensive word counting and text analysis tool trusted by over 100,000+ writers, bloggers, and content creators worldwide.
            </p>
            
            {/* Features Highlight */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                <FaLightbulb className="w-3 h-3 mr-1" />
                AI-Powered
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                <FaUsers className="w-3 h-3 mr-1" />
                100k+ Users
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                Free Forever
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
              <FaBookOpen className="w-4 h-4 mr-2 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog & Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
              <FaCode className="w-4 h-4 mr-2 text-primary" />
              Legal & Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
              <FaEnvelope className="w-4 h-4 mr-2 text-primary" />
              Stay Connected
            </h4>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-muted-foreground text-sm mb-3">
                Get writing tips and updates delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  data-testid="input-newsletter-email"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  data-testid="button-newsletter-signup"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Follow Us</p>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/wordcounterplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/wordcounterplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-black hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/wordcounterplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-400/25 transition-all duration-300"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/company/wordcounterplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
              <p className="flex items-center">
                © {new Date().getFullYear()} Word Counter Plus. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
              <p className="flex items-center">
                Made with <FaHeart className="text-red-500 mx-1 animate-pulse" /> for writers worldwide
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-muted-foreground">
                <FaMapMarkerAlt className="w-3 h-3 mr-2" />
                Global Service
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
