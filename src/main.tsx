import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StockAnalysis from './components/StockAnalysis.tsx';
// import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StockAnalysis/>
    {/* <App/> */}
  </StrictMode>
);