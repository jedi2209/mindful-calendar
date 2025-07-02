import { mockApiResponses } from '../mock/mock-data';
import { isMockMode, isProgrammaticMockMode } from '../mock/mock-utils';

/**
 * Makes an API call to the specified URL.
 * @param url - The URL to make the API call to.
 * @returns A promise that resolves to the JSON response from the API call.
 */
const apiCall = async <T = any>(url: string): Promise<T> => {
  // Check if mock mode is enabled
  const useMockData = isMockMode() || isProgrammaticMockMode();
  
  if (useMockData) {
    console.info(`🔧 Mock API call: ${url}`);
    
    // Simulate network delay for more realistic testing
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Return mock data based on the URL
    if (url in mockApiResponses) {
      return mockApiResponses[url as keyof typeof mockApiResponses] as T;
    } else {
      console.warn(`No mock data found for endpoint: ${url}`);
      throw new Error(`Mock data not available for endpoint: ${url}`);
    }
  }
  
  // Original API call logic
  console.info(`🌐 Live API call: ${url}`);
  const host = 'https://XXXX';
  
  try {
    const response = await fetch(host + url, {
      method: 'GET',
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json: T = await response.json();
    return json;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export { apiCall }; 