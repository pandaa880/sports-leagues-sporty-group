import './App.css'
import { LeaguesPage } from './pages/LeaguesPage'
import { clearAllCaches } from './utils/cacheUtils'
import { LeaguesProvider } from './store/LeaguesContext'
import { SeasonProvider } from './store/SeasonContext'

function App() {
  return (
    <LeaguesProvider>
      <SeasonProvider>
        <div className="app-container">
          <button onClick={clearAllCaches}>Clear Cache & Reload</button>
          <LeaguesPage />
        </div>
      </SeasonProvider>
    </LeaguesProvider>
  )
}

export default App
