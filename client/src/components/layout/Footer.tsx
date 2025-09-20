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
  FaHeart
} from "react-icons/fa";

export default function Footer() {

  return (
    <footer className="bg-white dark:bg-white border-t-2 border-primary/20 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <FaPenNib className="text-white text-xl" aria-label="Word Counter Logo" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-900">
                  Word Counter Plus
                </h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">(4.9)</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-700 text-sm mb-4 leading-relaxed">
              The most comprehensive word counting and text analysis tool trusted by writers, students, and content creators worldwide.
            </p>
            
            {/* Features Highlight */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                <FaLightbulb className="w-3 h-3 mr-1" />
                AI-Powered
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                <FaUsers className="w-3 h-3 mr-1" />
                2M+ Users
              </span>
            </div>
          </div>

          {/* Text Analysis Tools */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-4 flex items-center">
              <FaCode className="w-4 h-4 mr-2 text-primary" />
              Text Analysis Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/character-counter" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Character Counter
                </Link>
              </li>
              <li>
                <Link href="/text-case-convert" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Text Case Converter
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Learning */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-4 flex items-center">
              <FaBookOpen className="w-4 h-4 mr-2 text-primary" />
              Resources & Learning
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Writing Tips Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-900 mb-4 flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-primary" />
              Legal & Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-700 hover:text-slate-900 transition-colors duration-200">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

        </div>

        
        {/* Social Media & Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-700">
              <p>
                © {new Date().getFullYear()} Word Counter Plus. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
              <p className="flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> for writers worldwide
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 mr-2">Follow Us:</p>
              <a
                href="https://facebook.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                data-testid="link-facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                data-testid="link-twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity duration-200"
                data-testid="link-instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/wordcounterplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200"
                data-testid="link-linkedin"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}