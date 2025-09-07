// Utility function to create API URLs without double slashes
export const createApiUrl = (endpoint) => {
  //get url from .env file

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
  console.log('API URL created:', fullUrl); // Debug log
  return fullUrl;
};

export default createApiUrl;
