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

export const isMainHost = (): boolean => {
  const host = getCurrentHost();
  return host === MAIN_HOST || host.includes('localhost') || host.includes('127.0.0.1') || host.includes('replit');
};

export const isCaseHost = (): boolean => {
  const host = getCurrentHost();
  return host === CASE_HOST;
};

export const getOtherOrigin = (): string => {
  return isMainHost() ? CASE_ORIGIN : MAIN_ORIGIN;
};

// Tool-specific configurations
export const getToolConfig = () => {
  const isMain = isMainHost();
  
  return {
    isMainDomain: isMain,
    isCaseDomain: !isMain,
    currentOrigin: getCurrentOrigin(),
    mainOrigin: MAIN_ORIGIN,
    caseOrigin: CASE_ORIGIN,
    wordCounterUrl: `${MAIN_ORIGIN}/`,
    textCaseUrl: `${CASE_ORIGIN}/`,
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