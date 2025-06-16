import { LeaguesPage } from './pages/LeaguesPage';
import { LeaguesProvider } from './store/LeaguesContext';
import { SeasonProvider } from './store/SeasonContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LeaguesProvider>
        <SeasonProvider>
          <div className="w-screen min-h-screen p-4 app-container">
            <ErrorBoundary>
              <LeaguesPage />
            </ErrorBoundary>
          </div>
        </SeasonProvider>
      </LeaguesProvider>
    </ErrorBoundary>
  );
}

export default App;
