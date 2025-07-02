import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './css/index.css';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  console.log = console.info = console.warn = console.error = function () {};
}

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