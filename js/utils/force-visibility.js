/**
 * Force Visibility Script
 * This script ensures all charts and tabs are visible
 */
(function() {
  console.log("Starting Force Visibility Script");
  
  // Execute immediately and also when DOM is loaded
  forceElementsVisible();
  document.addEventListener('DOMContentLoaded', forceElementsVisible);
  
  // Also run after a short delay to catch dynamically created elements
  setTimeout(forceElementsVisible, 500);
  setTimeout(forceElementsVisible, 1000);
  setTimeout(forceElementsVisible, 2000);
  
  // Function to force all elements to be visible
  function forceElementsVisible() {
    console.log("Forcing elements to be visible...");
    
    // Show results container
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
      resultsContainer.style.visibility = 'visible';
      resultsContainer.style.opacity = '1';
    }
    
    // Force all tab panes to be visible
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
      pane.style.display = 'block';
      pane.style.visibility = 'visible';
      pane.style.opacity = '1';
    });
    
    // Ensure tabs are visible and appear below vendor selection
    const tabs = document.querySelector('.tabs');
    if (tabs) {
      tabs.style.display = 'flex';
      tabs.style.visibility = 'visible';
      tabs.style.opacity = '1';
      
      // Move tabs directly after vendor selection section
      const vendorSection = document.querySelector('.vendor-selection-section');
      if (vendorSection && tabs.parentNode !== vendorSection.nextSibling) {
        vendorSection.parentNode.insertBefore(tabs, vendorSection.nextSibling);
      }
    }
    
    // Ensure tab content appears after tabs
    const tabContent = document.querySelector('.tab-content');
    if (tabContent && tabs) {
      tabContent.style.display = 'block';
      tabContent.style.visibility = 'visible';
      tabContent.style.opacity = '1';
      
      // Move tab content after tabs
      if (tabContent.parentNode !== tabs.nextSibling) {
        tabs.parentNode.insertBefore(tabContent, tabs.nextSibling);
      }
    }
    
    // Make all chart containers visible
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.height = '400px';
    });
    
    // Make all canvases visible
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
      canvas.style.height = '100%';
    });
    
    // Hide wizard elements
    const wizardElements = [
      '.wizard-nav',
      '.wizard-content',
      '#wizard-error-container'
    ];
    
    wizardElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
      });
    });
    
    console.log("Elements visibility enforced");
  }
  
  // Function to initialize all tabs
  function initializeTabs() {
    console.log("Initializing tabs...");
    
    // Set up main tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active state for buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update active state for panes
        tabPanes.forEach(pane => {
          if (pane.id === tabId) {
            pane.classList.add('active');
            pane.style.display = 'block';
          } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
          }
        });
      });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
      tabButtons[0].click();
    }
    
    // Set up sub-tabs
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    subTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const subTabId = this.getAttribute('data-subtab');
        
        // Update active state for buttons
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update active state for panes
        subTabPanes.forEach(pane => {
          if (pane.id === subTabId) {
            pane.classList.add('active');
            pane.style.display = 'block';
          } else {
            pane.classList.remove('active');
            pane.style.display = 'none';
          }
        });
      });
    });
    
    // Activate first sub-tab by default
    if (subTabButtons.length > 0) {
      subTabButtons[0].click();
    }
    
    console.log("Tabs initialized");
  }
  
  // Initialize tabs after a delay to ensure DOM is fully loaded
  setTimeout(initializeTabs, 1000);
})();
