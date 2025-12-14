import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './redux/store';
import './index.css';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'placeholder-client-id';

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HelmetProvider>
        <App />
        <Toaster
          position="top-right"
          containerStyle={{ top: 80 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155'
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f1f5f9' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' }
            }
          }}
        />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {googleClientId !== 'placeholder-client-id' ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppWrapper />
      </GoogleOAuthProvider>
    ) : (
      <AppWrapper />
    )}
  </React.StrictMode>
);
