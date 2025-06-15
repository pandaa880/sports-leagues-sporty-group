import { LeaguesPage } from './pages/LeaguesPage';
import { LeaguesProvider } from './store/LeaguesContext';
import { SeasonProvider } from './store/SeasonContext';

function App() {
  return (
    <LeaguesProvider>
      <SeasonProvider>
        <div className="w-screen min-h-screen p-4 app-container">
          <LeaguesPage />
        </div>
      </SeasonProvider>
    </LeaguesProvider>
  );
}

export default App;
