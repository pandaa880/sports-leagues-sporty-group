import { ApiService } from './apiService';

/**
 * Enhanced API service with caching capabilities using the Cache Storage API
 */
export class CachedApiService extends ApiService {
  private readonly cacheName: string;
  private readonly maxAge: number;

  constructor(baseUrl: string, maxAge = 900, cacheName = 'api-cache') {
    super(baseUrl);
    this.maxAge = maxAge; // Default 15 minutes (in seconds)
    this.cacheName = cacheName;
  }

  /**
   * Override get method to include caching
   */
  async get<T>(endpoint: string, skipCache = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Skip cache if requested
    if (skipCache) {
      return this.fetchFromNetwork<T>(url);
    }

    // Try to get from cache first
    try {
      // Check if Cache API is available
      if ('caches' in window) {
        const cache = await caches.open(this.cacheName);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          // Check if the cached response is still valid
          const cachedData = await cachedResponse.json();
          const cacheControl = cachedResponse.headers.get('x-cache-control');

          if (cacheControl) {
            const cacheData = JSON.parse(cacheControl);
            const expirationTime = cacheData.timestamp;

            // If cache is still valid, return it
            if (Date.now() < expirationTime) {
              return cachedData as T;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
      // Continue to network request if cache read fails
    }

    // If not in cache or expired, fetch from network
    return this.fetchFromNetwork<T>(url);
  }

  /**
   * Fetch data from network and update cache
   */
  private async fetchFromNetwork<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response if Cache API is available
      if ('caches' in window) {
        try {
          const cache = await caches.open(this.cacheName);

          // Create a new response with custom headers for cache control
          const expirationTime = Date.now() + this.maxAge * 1000;
          const headers = new Headers(response.headers);

          // Store cache control info in a custom header
          headers.set(
            'x-cache-control',
            JSON.stringify({
              timestamp: expirationTime,
              maxAge: this.maxAge,
            })
          );

          const cachedResponse = new Response(JSON.stringify(data), {
            headers: headers,
            status: response.status,
            statusText: response.statusText,
          });

          await cache.put(url, cachedResponse);
        } catch (error) {
          console.error('Error writing to cache:', error);
        }
      }

      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Invalidate cache for a specific endpoint
   */
  async invalidateCache(endpoint: string): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName);
        await cache.delete(`${this.baseUrl}${endpoint}`);
      } catch (error) {
        console.error('Error invalidating cache:', error);
      }
    }
  }

  /**
   * Clear all API cache
   */
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      try {
        await caches.delete(this.cacheName);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  }
}
