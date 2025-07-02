/**
 * Makes an API call to the specified URL.
 * @param url - The URL to make the API call to.
 * @returns A promise that resolves to the JSON response from the API call.
 */
const apiCall = async <T = any>(url: string): Promise<T> => {
  // const host = 'XXXX';
  const host = 'https://api.mindful-studio.com/v1';
  
  try {
    const response = await fetch(host + url, {
      method: 'GET',
      redirect: 'follow',
    });
    
    const json: T = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { apiCall }; 