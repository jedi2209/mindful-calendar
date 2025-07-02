import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './css/index.css';
import App from './App';

// Initialize mock utilities for development

const rootElement = document.getElementById('eventCalendar');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement as any);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
); 