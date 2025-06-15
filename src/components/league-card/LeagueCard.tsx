import type { League } from "../../types/sportsService";
import { useSeasonContext } from "../../store/SeasonContext";
import "./LeagueCard.css";

export function LeagueCard({ league }: { league: League }) {
    const { fetchSeasonBadge, getBadgeStatus } = useSeasonContext();
    const { badgeUrl, loading, error } = getBadgeStatus(league.idLeague);

    const handleCardClick = () => {
        fetchSeasonBadge(league.idLeague);
    };

    return (
        <div className="league-card" onClick={handleCardClick}>
            <h3>{league.strLeague}</h3>
            <p>Sport: {league.strSport}</p>
            {league.strLeagueAlternate && (
                <p>Also known as: {league.strLeagueAlternate}</p>
            )}
            
            {loading && <p className="loading">Loading season badge...</p>}
            {error && <p className="error">{error}</p>}
            
            {badgeUrl && (
                <div className="season-badge">
                    <img src={badgeUrl} alt={`${league.strLeague} badge`} />
                </div>
            )}
        </div>
    );
}