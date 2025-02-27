import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { DarkModeContextProvider } from 'context/DarkModeContext'
import { LoadingContextProvider } from 'context/LoadingContext';
import 'style/index.scss';

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <DarkModeContextProvider>
      <LoadingContextProvider>
        <App />
      </LoadingContextProvider>
    </DarkModeContextProvider>
  </HashRouter>,
)