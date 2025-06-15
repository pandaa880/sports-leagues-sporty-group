import { useState } from 'react';
import { sportsService } from '../services/api/sportsService';
import { useImageCache } from './useImageCache';

export function useSeasonBadge(leagueId: string) {
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Use the image cache hook for the badge URL
  const { imageSrc: seasonBadge, loading: imageLoading, error: imageError } = useImageCache(badgeUrl);
  
  // Combined loading and error states
  const loading = fetchLoading || imageLoading;
  const error = fetchError || imageError;

  const fetchSeasonBadge = async () => {
    if (badgeUrl) {
      setBadgeUrl(null);
      return;
    }

    setFetchLoading(true);
    setFetchError(null);
    
    try {
      const data = await sportsService.getLeagueSeasons(leagueId);
      
      if (data.seasons && data.seasons.length > 0) {
        const seasonWithBadge = data.seasons.find(season => season.strBadge);
        if (seasonWithBadge) {
          setBadgeUrl(seasonWithBadge.strBadge);
        } else {
          setFetchError("No season badge found");
        }
      } else {
        setFetchError("No seasons found");
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFetchLoading(false);
    }
  };

  return {
    seasonBadge,
    loading,
    error,
    fetchSeasonBadge
  };
}
