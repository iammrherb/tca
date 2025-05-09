/**
 * Dark Mode Toggle
 * Handles toggling between light and dark themes with proper state management
 */
(function() {
  console.log('Initializing Dark Mode Toggle (Fixed)');
  
  // Dark mode state
  let isDarkMode = false;
  
  // Element selectors
  const selectors = {
    toggleButton: '#dark-mode-toggle',
    toggleButtonHeader: '#dark-mode-toggle-header',
    body: 'body'
  };
  
  // Class names
  const classes = {
    darkMode: 'dark-mode',
    enabled: 'enabled'
  };
  
  // Storage keys
  const storage = {
    darkMode: 'darkMode'
  };
  
  // Initialize
  function init() {
    // Find toggle buttons
    const toggleButton = document.querySelector(selectors.toggleButton);
    const toggleButtonHeader = document.querySelector(selectors.toggleButtonHeader);
    
    // Check if any button exists
    if (!toggleButton && !toggleButtonHeader) {
      console.warn('Dark mode toggle button not found');
      return;
    }
    
    // Check for system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for stored preference
    const storedPreference = localStorage.getItem(storage.darkMode);
    
    // Set initial state
    if (storedPreference === 'true' || (storedPreference === null && prefersDarkMode)) {
      enableDarkMode(false);
    } else {
      disableDarkMode(false);
    }
    
    // Add click handlers to buttons
    if (toggleButton) {
      toggleButton.addEventListener('click', toggle);
    }
    
    if (toggleButtonHeader) {
      toggleButtonHeader.addEventListener('click', toggle);
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only change if no user preference is stored
      if (localStorage.getItem(storage.darkMode) === null) {
        if (e.matches) {
          enableDarkMode(true);
        } else {
          disableDarkMode(true);
        }
      }
    });
    
    console.log('Dark mode toggle initialized');
  }
  
  // Toggle dark mode
  function toggle() {
    if (isDarkMode) {
      disableDarkMode(true);
    } else {
      enableDarkMode(true);
    }
    
    console.log('Dark mode toggled:', isDarkMode);
  }
  
  // Enable dark mode
  function enableDarkMode(storePreference = true) {
    // Update state
    isDarkMode = true;
    
    // Add class to body
    document.body.classList.add(classes.darkMode);
    
    // Update toggle buttons
    const toggleButtons = [
      document.querySelector(selectors.toggleButton),
      document.querySelector(selectors.toggleButtonHeader)
    ];
    
    toggleButtons.forEach(button => {
      if (button) {
        button.classList.add(classes.enabled);
        button.innerHTML = '<i class="fas fa-sun"></i>';
        button.setAttribute('title', 'Switch to Light Mode');
      }
    });
    
    // Store preference
    if (storePreference) {
      localStorage.setItem(storage.darkMode, 'true');
    }
    
    // Update charts for dark mode
    updateCharts(true);
  }
  
  // Disable dark mode
  function disableDarkMode(storePreference = true) {
    // Update state
    isDarkMode = false;
    
    // Remove class from body
    document.body.classList.remove(classes.darkMode);
    
    // Update toggle buttons
    const toggleButtons = [
      document.querySelector(selectors.toggleButton),
      document.querySelector(selectors.toggleButtonHeader)
    ];
    
    toggleButtons.forEach(button => {
      if (button) {
        button.classList.remove(classes.enabled);
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.setAttribute('title', 'Switch to Dark Mode');
      }
    });
    
    // Store preference
    if (storePreference) {
      localStorage.setItem(storage.darkMode, 'false');
    }
    
    // Update charts for light mode
    updateCharts(false);
  }
  
  // Update charts for theme
  function updateCharts(isDark) {
    // Use ModernCharts if available
    if (window.ModernCharts && typeof window.ModernCharts.updateDarkMode === 'function') {
      try {
        window.ModernCharts.updateDarkMode(isDark);
      } catch (error) {
        console.warn('Error updating charts for dark mode:', error);
      }
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})();
