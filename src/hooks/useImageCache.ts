import { useState, useEffect } from 'react';

// Cache name for storing images - use versioned name to match service worker
const IMAGE_CACHE_NAME = 'sports-league-images-v1';

/**
 * Custom hook for loading and caching images using Cache Storage API
 * @param src The source URL of the image
 * @param fallbackSrc Optional fallback image URL if the main one fails
 * @param cacheDuration How long to cache the image in seconds (default: 1 day)
 */
export function useImageCache(src: string | null, fallbackSrc?: string, cacheDuration = 86400) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setImageSrc(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadImage() {
      try {
        // Try to get from cache first
        if ('caches' in window && src) {
          const cache = await caches.open(IMAGE_CACHE_NAME);
          const cachedResponse = await cache.match(src);
          
          if (cachedResponse) {
            // We found it in the cache! Set it directly
            if (isMounted) {
              setImageSrc(src);
              setLoading(false);
            }
            return;
          }
        }

        // Not in cache, load it normally
        const img = new Image();
        
        img.onload = async () => {
          // Image loaded successfully
          if (isMounted) {
            setImageSrc(src);
            setLoading(false);
          }
          
          // Cache the image for future use
          if ('caches' in window && src) {
            try {
              const cache = await caches.open(IMAGE_CACHE_NAME);
              const response = await fetch(src);
              
              if (response.ok) {
                // Create a new response with custom cache headers
                const headers = new Headers(response.headers);
                headers.set('x-cache-expiration', String(Date.now() + (cacheDuration * 1000)));
                
                const cachedResponse = new Response(response.body, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: headers
                });
                
                await cache.put(src, cachedResponse);
              }
            } catch (cacheError) {
              console.error('Error caching image:', cacheError);
            }
          }
        };
        
        img.onerror = () => {
          if (isMounted) {
            setError(`Failed to load image: ${src}`);
            setLoading(false);
            
            // Try fallback if provided
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
            } else {
              setImageSrc(null);
            }
          }
        };
        
        img.src = src || '';
      } catch (err) {
        if (isMounted) {
          setError(`Error loading image: ${err instanceof Error ? err.message : String(err)}`);
          setLoading(false);
        }
      }
    }

    loadImage();
    
    return () => {
      // Mark component as unmounted
      isMounted = false;
    };
  }, [src, fallbackSrc, cacheDuration]);

  return { imageSrc, loading, error };
}

/**
 * Preload an image into the cache
 * @param src Image URL to preload
 * @param cacheDuration How long to cache the image in seconds (default: 1 day)
 */
export async function preloadImage(src: string, cacheDuration = 86400): Promise<void> {
  if (!src || !('caches' in window)) return;
  
  try {
    // Check if already in cache
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(src);
    
    if (cachedResponse) {
      // Already cached, check if expired
      const expiration = cachedResponse.headers.get('x-cache-expiration');
      if (expiration && parseInt(expiration) > Date.now()) {
        // Still valid
        return;
      }
    }
    
    // Fetch and cache the image
    const response = await fetch(src);
    
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('x-cache-expiration', String(Date.now() + (cacheDuration * 1000)));
      
      const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      await cache.put(src, cachedResponse);
    }
  } catch (error) {
    console.error('Error preloading image:', error);
  }
}

/**
 * Clear the image cache
 */
export async function clearImageCache(): Promise<void> {
  if ('caches' in window) {
    try {
      await caches.delete(IMAGE_CACHE_NAME);
    } catch (error) {
      console.error('Error clearing image cache:', error);
    }
  }
}
