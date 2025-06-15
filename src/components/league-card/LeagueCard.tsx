import { useState } from 'react';
import type { League } from '../../types/sportsService';
import { useSeasonContext } from '../../store/SeasonContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LeagueCard({ league }: { league: League }) {
  const { fetchSeasonBadge, getBadgeStatus } = useSeasonContext();
  const { badgeUrl, loading, error } = getBadgeStatus(league.idLeague);

  const [showBadge, setShowBadge] = useState(false);

  const handleCardClick = () => {
    fetchSeasonBadge(league.idLeague);
    setShowBadge((prev) => !prev);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {showBadge ? (
        <CardHeader className="p-4 flex items-center justify-center h-30 bg-gray-50">
          {loading && <p className="text-sm text-gray-500">Loading season badge...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {badgeUrl ? (
            <img
              src={badgeUrl}
              alt={`${league.strLeague} badge`}
              className="max-h-full max-w-full object-contain"
            />
          ) : null}
        </CardHeader>
      ) : (
        <CardContent className="p-4 h-30">
          <CardTitle className="text-lg mb-1">{league.strLeague}</CardTitle>
          <p className="text-sm text-gray-500">Sport: {league.strSport}</p>
        </CardContent>
      )}

      <CardFooter className="px-4 py-2 text-xs text-gray-500 border-t">
        Also known as: {league.strLeagueAlternate || 'N/A'}
      </CardFooter>
    </Card>
  );
}
