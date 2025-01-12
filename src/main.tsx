import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StockAnalysis from './components/StockAnalysis.tsx';
import './index.css';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const App = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  // Redirect to dashboard after login
  useEffect(() => {
    if (isLoaded && user) {
      navigate('/dashboard');
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<StockAnalysis />} />
      <Route path="/" element={<RedirectToSignIn />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Router>
        <App />
      </Router>
    </ClerkProvider>
  </React.StrictMode>
);