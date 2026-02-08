import { useState, useEffect, useRef } from 'react';

const CACHE_PREFIX = 'easy_pip_cache_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

const getCacheKey = (key) => `${CACHE_PREFIX}${key}`;

export const setCache = (key, data, duration = DEFAULT_CACHE_DURATION) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      duration
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Failed to set cache:', error);
    return false;
  }
};

export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;

    const { data, timestamp, duration } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > duration;

    if (isExpired) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get cache:', error);
    return null;
  }
};

export const clearCache = (key) => {
  try {
    localStorage.removeItem(getCacheKey(key));
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
};

export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to clear all cache:', error);
    return false;
  }
};

export const useDataCache = (key, fetchFn, options = {}) => {
  const {
    cacheDuration = DEFAULT_CACHE_DURATION,
    enabled = true,
    autoRefresh = false,
    refreshInterval = null,
    onCacheHit = null,
    onCacheMiss = null,
    onError = null
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const refreshTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchData = async (forceRefresh = false) => {
    if (!isMountedRef.current) return;

    if (!forceRefresh && enabled) {
      const cached = getCache(key);
      if (cached) {
        setData(cached);
        setIsFromCache(true);
        setLastUpdated(new Date(getCache(key + '_timestamp') || Date.now()));
        if (onCacheHit) onCacheHit(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      const result = await fetchFn();
      
      if (isMountedRef.current) {
        setData(result);
        setLastUpdated(Date.now());
        
        if (enabled) {
          setCache(key, result, cacheDuration);
          setCache(key + '_timestamp', Date.now(), cacheDuration);
        }
        
        if (onCacheMiss) onCacheMiss(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMsg = err.message || String(err);
        setError(errorMsg);
        if (onError) onError(errorMsg);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refresh = () => fetchData(true);

  const clear = () => {
    clearCache(key);
    setData(null);
    setError(null);
    setLastUpdated(null);
    setIsFromCache(false);
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    if (autoRefresh && refreshInterval) {
      refreshTimerRef.current = setInterval(() => {
        refresh();
      }, refreshInterval);
    }

    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [key, autoRefresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isFromCache,
    refresh,
    clear,
    isStale: lastUpdated && (Date.now() - lastUpdated) > cacheDuration
  };
};

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const useRetry = (fn, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry = null
  } = options;

  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const execute = async (...args) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        setRetryCount(i);
        setIsRetrying(i > 0);
        
        const result = await fn(...args);
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries - 1) {
          if (onRetry) onRetry(i + 1, maxRetries, error);
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
        }
      }
    }

    setIsRetrying(false);
    throw lastError;
  };

  return { execute, retryCount, isRetrying };
};