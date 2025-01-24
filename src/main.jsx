import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx' 
import { AppContextV2Provider } from './context/AppContextV2.jsx'
import './index.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <AppContextV2Provider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode> 
    </AppContextV2Provider>
  </AppContextProvider>, 
)
