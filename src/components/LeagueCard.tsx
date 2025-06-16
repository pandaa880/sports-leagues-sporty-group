import type { League } from '../types/sportsService';

import { useSeasonContext } from '../store/SeasonContext';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LeagueCard({ league }: { league: League }) {
  const { fetchSeasonBadge, toggleBadge, getBadgeStatus } = useSeasonContext();
  const { badgeUrl, loading, error } = getBadgeStatus(league.idLeague);

  const handleCardClick = () => {
    if (badgeUrl || error) {
      toggleBadge(league.idLeague);
    } else {
      fetchSeasonBadge(league.idLeague);
    }
  };

  const isLoadingBadge = loading && !badgeUrl;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {badgeUrl ? (
        <CardHeader className="p-4 flex items-center justify-center h-30 bg-gray-50">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-24">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-2"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <img
              src={badgeUrl}
              alt={`${league.strLeague} badge`}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </CardHeader>
      ) : isLoadingBadge ? (
        <CardHeader className="p-4 flex items-center justify-center h-30 bg-gray-50">
          <div className="flex flex-col items-center justify-center w-full h-24">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-2"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
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
