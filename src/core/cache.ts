import { CacheData } from '../types';

const CACHE_TTL = 4 * 60 * 1000; // Cache Time-To-Live (TTL) in milliseconds (e.g., 4 minutes)

const getCache = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp }: CacheData<T> = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error parsing cache data:', error);
    localStorage.removeItem(key);
    return null;
  }
};

const setCache = <T>(key: string, data: T): void => {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache data:', error);
  }
};

export { getCache, setCache }; 