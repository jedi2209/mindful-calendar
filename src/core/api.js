/**
 * Makes an API call to the specified URL.
 * @param {string} url - The URL to make the API call to.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the API call.
 */
const apiCall = async (url) => {
  // const host = 'XXXX';
  const host = 'https://XXXX'
  return fetch(host + url, {
    method: 'GET',
    redirect: 'follow',
  })
  .then(async response => {
    const json = await response.json();
    return json;
  })
  .catch(error => console.error(error));
};

export { apiCall };