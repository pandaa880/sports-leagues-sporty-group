import { useState } from 'react';
import { sportsService } from '../services/api/sportsService';

export function useSeasonBadge(leagueId: string) {
  const [seasonBadge, setSeasonBadge] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasonBadge = async () => {
    if (seasonBadge) {
      setSeasonBadge(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await sportsService.getLeagueSeasons(leagueId);
      
      if (data.seasons && data.seasons.length > 0) {
        const seasonWithBadge = data.seasons.find(season => season.strBadge);
        if (seasonWithBadge) {
          setSeasonBadge(seasonWithBadge.strBadge);
        } else {
          setError("No season badge found");
        }
      } else {
        setError("No seasons found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    seasonBadge,
    loading,
    error,
    fetchSeasonBadge
  };
}
