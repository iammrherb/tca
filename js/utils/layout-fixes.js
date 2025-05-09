/**
 * Layout Fixes for NAC Architecture Designer Pro
 * Fixes DOM hierarchy issues and layout problems
 */

// Execute after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Applying layout fixes...');
  
  // Fix DOM hierarchy errors
  fixDOMHierarchy();
  
  // Fix vendor section visibility
  fixVendorSection();
  
  // Fix chart container layout
  fixChartContainers();
  
  // Fix tab navigation
  fixTabNavigation();
  
  console.log('Layout fixes applied');
});

/**
 * Fix DOM hierarchy issues
 */
function fixDOMHierarchy() {
  // Fix direct-layout.js issues by implementing a safer approach
  // Instead of using prepend which can cause hierarchy issues, use insertBefore
  const originalPrepend = Element.prototype.prepend;
  Element.prototype.prepend = function(...nodes) {
    try {
      // Check for circular references
      for (const node of nodes) {
        if (node === this || (node instanceof Node && node.contains(this))) {
          console.warn('Prevented circular DOM reference');
          return;
        }
      }
      originalPrepend.apply(this, nodes);
    } catch (error) {
      console.warn('Error in prepend operation:', error);
      
      // Fallback: try insertBefore on valid nodes
      for (const node of nodes) {
        if (node instanceof Node && node !== this && !node.contains(this)) {
          try {
            this.insertBefore(node, this.firstChild);
          } catch (innerError) {
            console.warn('Error in fallback insertBefore:', innerError);
          }
        }
      }
    }
  };
  
  // Also fix appendChild for similar issues
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    try {
      // Check for circular references
      if (node === this || (node instanceof Node && node.contains(this))) {
        console.warn('Prevented circular DOM reference in appendChild');
        return node;
      }
      return originalAppendChild.call(this, node);
    } catch (error) {
      console.warn('Error in appendChild operation:', error);
      return node;
    }
  };
}

/**
 * Fix vendor section visibility
 */
function fixVendorSection() {
  // Ensure the vendor selection section is visible
  setTimeout(() => {
    const vendorSection = document.querySelector('.vendor-selection-section') || 
                         document.querySelector('.vendors-section') ||
                         document.querySelector('.vendor-cards');
                         
    if (vendorSection) {
      // Make sure it's visible
      vendorSection.style.display = 'block';
      
      // Move it to a more visible position if needed
      const topContainer = document.querySelector('.calculator-container') || 
                          document.querySelector('.tco-calculator') ||
                          document.querySelector('.app-container');
                          
      if (topContainer && !topContainer.contains(vendorSection)) {
        // If it's not already in the container, move it near the top
        const target = topContainer.querySelector('.section-header') || 
                      topContainer.querySelector('h1') || 
                      topContainer.firstElementChild;
                      
        if (target) {
          try {
            topContainer.insertBefore(vendorSection, target.nextSibling);
            console.log('Moved vendor section to improve visibility');
          } catch (error) {
            console.warn('Could not move vendor section:', error);
          }
        }
      }
      
      // Ensure it's properly styled
      vendorSection.style.marginTop = '20px';
      vendorSection.style.marginBottom = '20px';
    } else {
      console.log('Vendor section not found');
    }
  }, 500);
}

/**
 * Fix chart container layout
 */
function fixChartContainers() {
  setTimeout(() => {
    // Ensure chart containers are visible and properly sized
    const chartContainers = document.querySelectorAll('.chart-container, [id$="-chart"]');
    
    chartContainers.forEach(container => {
      // Ensure minimum height for charts
      container.style.minHeight = '300px';
      
      // Make sure it's visible
      container.style.display = 'block';
      
      // Fix any parent containers
      const parent = container.parentElement;
      if (parent && parent.classList.contains('result-card')) {
        parent.style.display = 'block';
        parent.style.marginBottom = '20px';
      }
    });
    
    // Fix results container if it exists
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
    }
  }, 1000);
}

/**
 * Fix tab navigation
 */
function fixTabNavigation() {
  setTimeout(() => {
    // Fix tab navigation if it exists
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      // Ensure it's visible
      tabNavigation.style.display = 'flex';
      
      // Fix tab content
      const tabs = tabNavigation.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          if (!tabId) return;
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          
          // Update tab content
          const tabContents = document.querySelectorAll('.tab-content');
          tabContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
          });
          
          const activeContent = document.getElementById(`${tabId}-tab`);
          if (activeContent) {
            activeContent.style.display = 'block';
            activeContent.classList.add('active');
          }
        });
      });
    }
  }, 1500);
}
