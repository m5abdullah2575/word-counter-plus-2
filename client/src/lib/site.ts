// Site configuration for multi-domain support
// Main domain serves Word Counter, subdomain serves Text Case Converter

export const MAIN_HOST = import.meta.env.VITE_MAIN_HOST || 'wordcounterplusapp.com';
export const CASE_HOST = import.meta.env.VITE_CASE_HOST || 'textcase.wordcounterplusapp.com';

export const MAIN_ORIGIN = `https://${MAIN_HOST}`;
export const CASE_ORIGIN = `https://${CASE_HOST}`;

// Host detection helpers
export const getCurrentHost = (): string => {
  if (typeof window === 'undefined') return MAIN_HOST;
  return window.location.host;
};

export const getCurrentOrigin = (): string => {
  if (typeof window === 'undefined') return MAIN_ORIGIN;
  return window.location.origin;
};

// Development mode detection
export const isDevelopment = (): boolean => {
  const host = getCurrentHost();
  return host.includes('localhost') || host.includes('127.0.0.1') || host.includes('replit') || host.includes('.dev');
};

// Check for development mode case testing via query parameter
export const isDevelopmentCaseMode = (): boolean => {
  if (!isDevelopment()) return false;
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('tool=case') || window.location.pathname.startsWith('/text-case');
};

export const isMainHost = (): boolean => {
  const host = getCurrentHost();
  // In development, check for case mode override
  if (isDevelopment()) {
    return !isDevelopmentCaseMode();
  }
  return host === MAIN_HOST;
};

export const isCaseHost = (): boolean => {
  const host = getCurrentHost();
  // In development, check for case mode override
  if (isDevelopment()) {
    return isDevelopmentCaseMode();
  }
  return host === CASE_HOST;
};

export const getOtherOrigin = (): string => {
  // In development, use query parameters for navigation
  if (isDevelopment()) {
    const currentOrigin = getCurrentOrigin();
    return isMainHost() ? `${currentOrigin}?tool=case` : currentOrigin;
  }
  return isMainHost() ? CASE_ORIGIN : MAIN_ORIGIN;
};

export const getDomainUrl = (domain: 'main' | 'case'): string => {
  // In development, use query parameters
  if (isDevelopment()) {
    const currentOrigin = getCurrentOrigin();
    return domain === 'main' ? currentOrigin : `${currentOrigin}?tool=case`;
  }
  return domain === 'main' ? MAIN_ORIGIN : CASE_ORIGIN;
};

// Tool-specific configurations
export const getToolConfig = () => {
  const isMain = isMainHost();
  const currentOrigin = getCurrentOrigin();
  
  return {
    isMainDomain: isMain,
    isCaseDomain: !isMain,
    currentOrigin: currentOrigin,
    mainOrigin: isDevelopment() ? currentOrigin : MAIN_ORIGIN,
    caseOrigin: isDevelopment() ? `${currentOrigin}?tool=case` : CASE_ORIGIN,
    wordCounterUrl: isDevelopment() ? `${currentOrigin}/` : `${MAIN_ORIGIN}/`,
    textCaseUrl: isDevelopment() ? `${currentOrigin}?tool=case` : `${CASE_ORIGIN}/`,
  };
};

// Brand configuration (shared across both tools)
export const BRAND_CONFIG = {
  name: 'Word Counter Plus',
  logo: {
    text: 'Word Counter Plus',
    icon: 'FaPenNib' // Reference to the icon component
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981'
  }
};