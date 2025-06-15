import { useState, useEffect } from 'react';
import { sportsService } from '../services/api/sportsService';
import type { League } from '../types/sportsService';

interface UseLeaguesResult {
  leagues: League[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLeagues(): UseLeaguesResult {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await sportsService.getAllLeagues();
      setLeagues(response.leagues);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch leagues'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  return {
    leagues,
    loading,
    error,
    refetch: fetchLeagues
  };
}
