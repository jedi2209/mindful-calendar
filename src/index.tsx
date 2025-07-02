import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';

const rootElement = document.getElementById('eventCalendar');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 