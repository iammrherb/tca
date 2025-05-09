/**
 * Direct Layout Script
 * Forcibly corrects the layout to put all content under NAC vendor selection
 */
(function() {
  console.log("Starting Direct Layout Script");
  
  // Execute immediately and also when DOM is loaded
  forceLayout();
  document.addEventListener('DOMContentLoaded', forceLayout);
  
  // Also run after delays to catch dynamically created elements
  setTimeout(forceLayout, 500);
  setTimeout(forceLayout, 1000);
  setTimeout(forceLayout, 2000);
  
  // Function to force the correct layout
  function forceLayout() {
    console.log("Forcing correct layout...");
    
    // Get container elements
    const calculatorContainer = document.querySelector('.calculator-container');
    const vendorSection = document.querySelector('.vendor-selection-section');
    const resultsContainer = document.getElementById('results-container');
    
    if (!calculatorContainer || !vendorSection || !resultsContainer) {
      console.log("Required containers not found, retrying...");
      return; // Exit and wait for next timeout
    }
    
    // First, ensure vendor section is at the top
    if (calculatorContainer.firstChild !== vendorSection) {
      calculatorContainer.prepend(vendorSection);
    }
    
    // Make sure results container is directly after vendor section
    if (vendorSection.nextSibling !== resultsContainer) {
      vendorSection.after(resultsContainer);
    }
    
    // Force display of results container
    resultsContainer.classList.remove('hidden');
    resultsContainer.style.display = 'block';
    resultsContainer.style.visibility = 'visible';
    resultsContainer.style.opacity = '1';
    
    // Get tabs and tab content
    const tabs = document.querySelector('.tabs');
    const tabContent = document.querySelector('.tab-content');
    
    if (!tabs || !tabContent) {
      console.log("Tabs or tab content not found, retrying...");
      return; // Exit and wait for next timeout
    }
    
    // Move tabs and tab content to the beginning of results container
    resultsContainer.prepend(tabContent);
    resultsContainer.prepend(tabs);
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Hide any wizard elements
    const wizardElements = document.querySelectorAll('.wizard-nav, .wizard-content, #wizard-error-container');
    wizardElements.forEach(el => {
      el.style.display = 'none';
    });
    
    // Force all chart containers to be visible
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.height = '400px';
    });
    
    // Force all canvases to be visible
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
    });
    
    console.log("Layout has been forced");
  }
  
  // Initialize tab navigation
  function initTabNavigation() {
    // Main tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      // Clear existing event listeners (not perfect but helps)
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add new event listener
      newButton.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update button states
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Update tab pane visibility
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
    
    // Sub-tabs
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    subTabButtons.forEach(button => {
      // Clear existing event listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add new event listener
      newButton.addEventListener('click', function() {
        const subtabId = this.getAttribute('data-subtab');
        
        // Update button states
        subTabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Update sub-tab pane visibility
        subTabPanes.forEach(pane => {
          if (pane.id === subtabId) {
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
  }
})();
