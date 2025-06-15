import type { League } from "../../types/sportsService";
import { useSeasonBadge } from "../../hooks/useSeasonBadge";
import "./LeagueCard.css";

export function LeagueCard({ league }: { league: League }) {
    const { seasonBadge, loading, error, fetchSeasonBadge } = useSeasonBadge(league.idLeague);

    return (
        <div className="league-card" onClick={fetchSeasonBadge}>
            <h3>{league.strLeague}</h3>
            <p>Sport: {league.strSport}</p>
            {league.strLeagueAlternate && (
                <p>Also known as: {league.strLeagueAlternate}</p>
            )}
            
            {loading && <p className="loading">Loading season badge...</p>}
            {error && <p className="error">{error}</p>}
            
            {seasonBadge && (
                <div className="season-badge">
                    <img src={seasonBadge} alt={`${league.strLeague} badge`} />
                </div>
            )}
        </div>
    );
}