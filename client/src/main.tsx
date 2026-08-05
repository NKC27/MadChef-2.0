import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles/globals.scss';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
