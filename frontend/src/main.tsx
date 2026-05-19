import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { appTheme } from './app/theme';
import './style.css';
import {AuthSessionProvider} from "./features/auth/AuthSessionContext";

const appRoot = document.querySelector<HTMLDivElement>('#app');

if (!appRoot) {
  throw new Error('App root was not found.');
}

createRoot(appRoot).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthSessionProvider>
        <App />
      </AuthSessionProvider>
    </ThemeProvider>
  </StrictMode>,
);
