import { LeaguesList } from '../components/LeaguesList';

export const LeaguesPage = () => {
  return (
    <div className="page leagues-page">
      <header>
        <h1>Sports Leagues Directory</h1>
        <p>Browse all available sports leagues from around the world</p>
      </header>
      <main>
        <LeaguesList />
      </main>
    </div>
  );
};
