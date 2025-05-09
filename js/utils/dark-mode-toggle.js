/**
 * Dark Mode Toggle Component for NAC Architecture Designer Pro
 * Implements a toggle for switching between light and dark themes
 */

const DarkModeToggle = (function() {
  // Configuration
  let config = {
    toggleSelector: '#dark-mode-toggle',
    darkModeClass: 'dark-mode',
    localStorageKey: 'darkMode',
    onToggle: null
  };
  
  // State
  let state = {
    isDarkMode: false,
    isInitialized: false
  };
  
  // Initialize the component
  function init(options = {}) {
    // Apply custom configuration
    config = { ...config, ...options };
    
    // Get toggle element
    const toggleElement = document.querySelector(config.toggleSelector);
    if (!toggleElement) {
      console.warn('Dark mode toggle element not found');
      return false;
    }
    
    // Check for existing preference
    checkStoredPreference();
    
    // Add event listener
    toggleElement.addEventListener('click', toggle);
    
    // Initialize icon
    updateToggleIcon(toggleElement);
    
    state.isInitialized = true;
    
    return true;
  }
  
  // Check for stored dark mode preference
  function checkStoredPreference() {
    const storedPreference = localStorage.getItem(config.localStorageKey);
    
    if (storedPreference !== null) {
      state.isDarkMode = storedPreference === 'true';
      applyDarkMode(state.isDarkMode);
    } else {
      // Check system preference
      checkSystemPreference();
    }
  }
  
  // Check system color scheme preference
  function checkSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.isDarkMode = true;
      applyDarkMode(true);
    }
    
    // Listen for changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newDarkMode = e.matches;
        state.isDarkMode = newDarkMode;
        applyDarkMode(newDarkMode);
        savePreference(newDarkMode);
      });
    }
  }
  
  // Toggle dark mode
  function toggle() {
    const newDarkMode = !state.isDarkMode;
    state.isDarkMode = newDarkMode;
    
    applyDarkMode(newDarkMode);
    savePreference(newDarkMode);
    
    // Call onToggle callback if provided
    if (typeof config.onToggle === 'function') {
      config.onToggle(newDarkMode);
    }
  }
  
  // Apply dark mode to the document
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.documentElement.classList.add(config.darkModeClass);
      document.body.classList.add(config.darkModeClass);
    } else {
      document.documentElement.classList.remove(config.darkModeClass);
      document.body.classList.remove(config.darkModeClass);
    }
    
    // Update toggle icon
    const toggleElement = document.querySelector(config.toggleSelector);
    if (toggleElement) {
      updateToggleIcon(toggleElement);
    }
    
    // Dispatch event for other components
    const event = new CustomEvent('darkModeChanged', {
      detail: { isDarkMode: isDarkMode }
    });
    
    document.dispatchEvent(event);
  }
  
  // Update toggle icon
  function updateToggleIcon(toggleElement) {
    const icon = toggleElement.querySelector('i');
    if (!icon) return;
    
    if (state.isDarkMode) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      toggleElement.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      toggleElement.setAttribute('title', 'Switch to Dark Mode');
    }
  }
  
  // Save preference to localStorage
  function savePreference(isDarkMode) {
    localStorage.setItem(config.localStorageKey, isDarkMode);
  }
  
  // Public API
  return {
    init: init,
    toggle: toggle,
    isDarkMode: () => state.isDarkMode,
    setDarkMode: (isDarkMode) => {
      state.isDarkMode = isDarkMode;
      applyDarkMode(isDarkMode);
      savePreference(isDarkMode);
    }
  };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  DarkModeToggle.init({
    toggleSelector: '#dark-mode-toggle',
    onToggle: function(isDarkMode) {
      console.log('Dark mode toggled:', isDarkMode);
    }
  });
});
