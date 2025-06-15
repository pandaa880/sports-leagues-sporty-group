import './App.css'
import { LeaguesPage } from './pages/LeaguesPage'
import { clearAllCaches } from './utils/cacheUtils'

function App() {
  return (
    <div className="app-container">
        <button onClick={clearAllCaches}>Clear Cache & Reload</button>
      <LeaguesPage />
    </div>
  )
}

export default App
