/**
 * Dark Mode Fix
 * Fixes issues with dark mode toggle
 */
(function() {
  console.log('Installing Dark Mode Fix');
  
  // Define variables
  let isDarkMode = false;
  const STORAGE_KEY = 'darkMode';
  const DARK_MODE_CLASS = 'dark-mode';
  
  // Function to enable dark mode
  function enableDarkMode() {
    console.log('Enabling dark mode');
    
    // Update state
    isDarkMode = true;
    
    // Add class to body
    document.body.classList.add(DARK_MODE_CLASS);
    
    // Update buttons
    updateToggleButtons(true);
    
    // Store preference
    localStorage.setItem(STORAGE_KEY, 'true');
    
    // Update charts if SimpleCharts is available
    updateCharts(true);
  }
  
  // Function to disable dark mode
  function disableDarkMode() {
    console.log('Disabling dark mode');
    
    // Update state
    isDarkMode = false;
    
    // Remove class from body
    document.body.classList.remove(DARK_MODE_CLASS);
    
    // Update buttons
    updateToggleButtons(false);
    
    // Store preference
    localStorage.setItem(STORAGE_KEY, 'false');
    
    // Update charts if SimpleCharts is available
    updateCharts(false);
  }
  
  // Function to toggle dark mode
  function toggleDarkMode() {
    if (isDarkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }
  
  // Function to update toggle buttons
  function updateToggleButtons(enabled) {
    // Find all toggle buttons
    const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
    
    // Update each button
    toggleButtons.forEach(button => {
      if (enabled) {
        button.innerHTML = '<i class="fas fa-sun"></i>';
        button.setAttribute('title', 'Switch to Light Mode');
      } else {
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.setAttribute('title', 'Switch to Dark Mode');
      }
    });
  }
  
  // Function to update charts
  function updateCharts(isDark) {
    // Try different approaches to update charts for dark mode
    
    // Approach 1: SimpleCharts
    if (window.SimpleCharts) {
      // Nothing to do here, SimpleCharts handles dark mode automatically
      console.log('SimpleCharts found, dark mode handled automatically');
    }
    
    // Approach 2: ModernCharts
    else if (window.ModernCharts && typeof window.ModernCharts.updateDarkMode === 'function') {
      try {
        window.ModernCharts.updateDarkMode(isDark);
        console.log('Updated ModernCharts for dark mode');
      } catch (error) {
        console.warn('Error updating ModernCharts for dark mode:', error);
      }
    }
    
    // Approach 3: Chart.js defaults
    else if (window.Chart) {
      try {
        // Set default colors based on theme
        if (isDark) {
          Chart.defaults.color = '#e5e7eb';
          Chart.defaults.borderColor = '#374151';
        } else {
          Chart.defaults.color = '#4b5563';
          Chart.defaults.borderColor = '#e5e7eb';
        }
        
        // Update existing charts
        if (window.chartRegistry) {
          Object.values(window.chartRegistry).forEach(chart => {
            try {
              chart.update();
            } catch (error) {
              console.warn('Error updating chart:', error);
            }
          });
        }
        
        console.log('Updated Chart.js defaults for dark mode');
      } catch (error) {
        console.warn('Error updating Chart.js defaults for dark mode:', error);
      }
    }
  }
  
  // Function to initialize dark mode
  function initDarkMode() {
    console.log('Initializing dark mode');
    
    // Check for system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for stored preference
    const storedPreference = localStorage.getItem(STORAGE_KEY);
    
    // Set initial state
    if (storedPreference === 'true' || (storedPreference === null && prefersDarkMode)) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    
    // Find all toggle buttons
    const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
    
    // Add event listener to each button
    toggleButtons.forEach(button => {
      button.addEventListener('click', toggleDarkMode);
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only change if no user preference is stored
      if (localStorage.getItem(STORAGE_KEY) === null) {
        if (e.matches) {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
      }
    });
    
    console.log('Dark mode initialization complete');
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initDarkMode);
  } else {
    initDarkMode();
  }
  
  console.log('Dark Mode Fix installed');
})();
