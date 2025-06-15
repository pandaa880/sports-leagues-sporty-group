import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import font styles before other styles
import './index.css'
import './styles/fonts.css'

import App from './App.tsx'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'

// Register service worker for caching
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
