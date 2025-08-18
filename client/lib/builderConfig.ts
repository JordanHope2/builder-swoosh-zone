// Builder.io Configuration for JobEqual
export const builderConfig = {
  // Your Builder.io API key
  apiKey: import.meta.env.VITE_PUBLIC_BUILDER_KEY || 'a8a771bec0f40debf22ee94a25cce67',
  
  // Production domains that should be allowed
  allowedDomains: [
    'https://jobequal.ch',
    'https://www.jobequal.ch',
    'http://localhost:8080', // Development
    'http://localhost:3000', // Alternative dev port
    'https://preview-*.netlify.app', // Netlify previews
    'https://*.vercel.app' // Vercel previews
  ],
  
  // Builder.io model configurations
  models: {
    page: 'page',
    header: 'header',
    footer: 'footer',
    blog: 'blog-post',
    job: 'job-listing'
  },
  
  // Preview settings
  preview: {
    enabled: true,
    url: 'https://jobequal.ch',
    fallbackUrl: 'http://localhost:8080'
  },
  
  // Content settings
  content: {
    includeRefs: true,
    cachebust: true,
    noCache: process.env.NODE_ENV === 'development'
  }
};

// Initialize Builder.io with proper domain configuration
export const initializeBuilder = () => {
  if (typeof window !== 'undefined') {
    // Ensure Builder.io recognizes the production domains
    const currentHost = window.location.origin;
    
    // Check if current domain is in allowed list
    const isAllowedDomain = builderConfig.allowedDomains.some(domain => 
      currentHost.includes(domain.replace(/https?:\/\//, '').replace(/\*\./g, ''))
    );
    
    if (!isAllowedDomain && !currentHost.includes('localhost')) {
      console.warn(`Current domain ${currentHost} not in Builder.io allowed domains list`);
    }
    
    return {
      apiKey: builderConfig.apiKey,
      currentHost,
      isAllowedDomain
    };
  }
  
  return {
    apiKey: builderConfig.apiKey,
    currentHost: null,
    isAllowedDomain: true
  };
};

export default builderConfig;
