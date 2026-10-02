import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('#root ?붿냼媛 index.html???놁뒿?덈떎.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
