// Utility function to create API URLs without double slashes
export const createApiUrl = (endpoint) => {
  //get url from .env file
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Handle case where baseUrl is undefined (during build/SSG)
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_API_URL is not set, using fallback');
    // Return a fallback URL or just the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return cleanEndpoint;
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
