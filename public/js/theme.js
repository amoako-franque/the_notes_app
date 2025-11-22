// Theme Toggle Functionality
(function() {
  'use strict';

  // Get theme from localStorage or default to light
  const getTheme = () => {
    return localStorage.getItem('theme') || 'light';
  };

  // Set theme
  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Initialize theme on page load
  const initTheme = () => {
    const theme = getTheme();
    setTheme(theme);
    updateToggleButton(theme);
  };

  // Update toggle button icon
  const updateToggleButton = (theme) => {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i') || toggleBtn.querySelector('span');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          icon.textContent = '☀️';
        } else {
          icon.className = 'bi bi-moon-fill';
          icon.textContent = '🌙';
        }
      }
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateToggleButton(newTheme);
  };

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Export for global access
  window.toggleTheme = toggleTheme;
  window.getTheme = getTheme;
  window.setTheme = setTheme;
})();

