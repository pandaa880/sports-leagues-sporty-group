import { useEffect, useMemo } from 'react';
import { useLeaguesContext } from '../store/LeaguesContext';
import { LeagueCard } from './league-card/LeagueCard';
import type { League } from '../types/sportsService';

export const LeaguesList = () => {
    const { state, fetchLeagues, getFilteredLeagues } = useLeaguesContext();
    const { loading, error } = state;

    useEffect(() => {
        fetchLeagues();
    }, [fetchLeagues]);

    // Get filtered leagues from context using useMemo to prevent infinite updates
    const filteredLeagues = useMemo(() => {
        if (loading || error) return [];
        return getFilteredLeagues();
    }, [getFilteredLeagues, loading, error]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 w-full h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p className="font-medium">Error loading leagues</p>
                <p className="text-sm">{error.message}</p>
                <button 
                    onClick={() => fetchLeagues()}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            {filteredLeagues.length === 0 ? (
                <div className="text-center p-8">
                    <p className="text-gray-500">No leagues found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {filteredLeagues.map((league: League) => (
                        <LeagueCard key={league.idLeague} league={league} />
                    ))}
                </div>
            )}
        </div>
    );
};