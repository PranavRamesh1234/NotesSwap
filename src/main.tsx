import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add the `js-enabled` class to the HTML element
document.documentElement.classList.add('js-enabled');

// Scroll animation logic
const handleScrollAnimations = () => {
  const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-up');
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('animate');
    }
  });
};

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
