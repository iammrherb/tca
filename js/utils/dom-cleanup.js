/**
 * DOM Cleanup Script
 * Removes any elements that might be conflicting with the layout
 */
(function() {
  console.log("Starting DOM Cleanup");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to make sure all content is loaded
    setTimeout(cleanupDOM, 500);
    setTimeout(cleanupDOM, 1500);
    setTimeout(cleanupDOM, 3000);
  });
  
  // Function to clean up the DOM
  function cleanupDOM() {
    console.log("Cleaning up the DOM...");
    
    // Remove any duplicate vendor sections
    const vendorSections = document.querySelectorAll('.vendor-selection-section');
    if (vendorSections.length > 1) {
      for (let i = 1; i < vendorSections.length; i++) {
        vendorSections[i].remove();
      }
    }
    
    // Remove any duplicated tabs
    const tabSets = document.querySelectorAll('.tabs');
    if (tabSets.length > 1) {
      for (let i = 1; i < tabSets.length; i++) {
        tabSets[i].remove();
      }
    }
    
    // Hide all wizard-related elements
    document.querySelectorAll('.wizard-nav, .wizard-content, #wizard-error-container').forEach(el => {
      el.style.display = 'none';
    });
    
    // Ensure the results container is visible
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
    }
    
    // Hide any other containers or elements that might be interfering
    const otherContainers = document.querySelectorAll('.sensitivity-container, .comparison-container');
    otherContainers.forEach(container => {
      if (container.parentElement !== resultsContainer) {
        container.style.display = 'none';
      }
    });
    
    // Ensure the tab content and tabs are in the right place
    const calculatorContainer = document.querySelector('.calculator-container');
    const vendorSection = document.querySelector('.vendor-selection-section');
    const tabs = document.querySelector('.tabs');
    const tabContent = document.querySelector('.tab-content');
    
    if (calculatorContainer && vendorSection && tabs && tabContent) {
      // Create a specific results container if it doesn't exist
      let resultsDiv = document.getElementById('results-container');
      if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'results-container';
        resultsDiv.className = 'results-container';
        calculatorContainer.appendChild(resultsDiv);
      }
      
      // Order elements correctly
      calculatorContainer.innerHTML = '';
      calculatorContainer.appendChild(vendorSection);
      calculatorContainer.appendChild(resultsDiv);
      resultsDiv.appendChild(tabs);
      resultsDiv.appendChild(tabContent);
    }
    
    console.log("DOM cleaned up");
  }
})();
