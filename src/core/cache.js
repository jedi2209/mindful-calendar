const CACHE_TTL = 4 * 60 * 1000; // Cache Time-To-Live (TTL) in milliseconds (e.g., 5 minutes)

const getCache = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

const setCache = (key, data) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export { getCache, setCache };