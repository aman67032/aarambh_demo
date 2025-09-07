// Utility function to create API URLs without double slashes
export const createApiUrl = (endpoint) => {
  //get url from .env file

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Check if baseUrl is defined
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_API_URL is not defined. Using fallback URL.');
    // You can provide a fallback URL or return a placeholder
    // For development, you might want to use localhost
    const fallbackUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
    const cleanFallbackUrl = fallbackUrl.endsWith('/') ? fallbackUrl.slice(0, -1) : fallbackUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanFallbackUrl}${cleanEndpoint}`;
  }
  
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
  console.log('API URL created:', fullUrl); // Debug log
  return fullUrl;
};

export default createApiUrl;
