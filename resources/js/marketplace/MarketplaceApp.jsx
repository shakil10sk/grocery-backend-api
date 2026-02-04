import { StrictMode } from 'react'
import App from './App.jsx'

export default function MarketplaceApp() {
  return (
    <StrictMode>
      {/* We need to inject the route into the App router, but App.jsx uses <Router>. 
            Wait, App.jsx handles routing. MarketplaceApp just wraps App with StrictMode. 
            I need to modify App.jsx actually to add the route. 
        */}
      <App />
    </StrictMode>
  );
}