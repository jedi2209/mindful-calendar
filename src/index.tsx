import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './css/index.css';
import App from './App';
import { enableMockMode } from "./mock/mock-utils";

// Initialize mock utilities for development

const rootElement = document.getElementById('eventCalendar');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement as any);

enableMockMode();

root.render(
  <StrictMode>
    <App />
  </StrictMode>
); 