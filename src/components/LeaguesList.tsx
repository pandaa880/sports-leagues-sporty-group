import { useLeagues } from '../hooks/useLeagues';
import './LeaguesList.css';

export const LeaguesList = () => {
  const { leagues, loading, error, refetch } = useLeagues();

  if (loading) {
    return <div className="loading">Loading leagues...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading leagues: {error.message}</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="leagues-container">
      <h2>Sports Leagues</h2>
      <div className="leagues-grid">
        {leagues.map((league) => (
          <div key={league.idLeague} className="league-card">
            <h3>{league.strLeague}</h3>
            <p>Sport: {league.strSport}</p>
            {league.strLeagueAlternate && (
              <p>Also known as: {league.strLeagueAlternate}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
