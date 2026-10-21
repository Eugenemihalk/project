import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { DocumentsProvider } from './store/DocumentsContext';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><DocumentsProvider><App /></DocumentsProvider></BrowserRouter></StrictMode>,
);
