/**
 * Combined specific fixes for:
 * 1. Logo replacement with official logo only
 * 2. Title change from "Portnox Total Cost Analysis" to "Total Cost Analysis"
 * 3. Cost configuration in advanced settings
 */

// 1. Official logo enforcement
(function() {
  // Official Portnox logo URL
  const OFFICIAL_LOGO_URL = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
  window.officialPortnoxLogo = OFFICIAL_LOGO_URL;
  
  // Replace all logo images
  function replaceAllLogos() {
    document.querySelectorAll('img').forEach(img => {
      if (img.className && img.className.includes('logo') || 
          (img.src && img.src.toLowerCase().includes('portnox'))) {
        img.src = OFFICIAL_LOGO_URL;
        img.alt = 'Portnox Logo';
        img.removeAttribute('onerror');
      }
    });
    
    document.querySelectorAll('.vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = OFFICIAL_LOGO_URL;
      img.alt = 'Portnox Logo';
      img.removeAttribute('onerror');
    });
  }
  
  // Apply immediately and periodically
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceAllLogos);
  } else {
    replaceAllLogos();
  }
  
  setInterval(replaceAllLogos, 1000);
  
  console.log('Logo fix applied');
})();

// 2. Title change
(function() {
  function updateAllTitles() {
    // Update document title
    if (document.title.includes('Portnox Total Cost')) {
      document.title = document.title.replace('Portnox Total Cost', 'Total Cost');
    }
    
    // Update main heading
    document.querySelectorAll('.logo h1').forEach(heading => {
      if (heading.textContent.includes('Portnox Total Cost')) {
        heading.textContent = heading.textContent.replace('Portnox Total Cost', 'Total Cost');
      }
    });
    
    // Update all headings and text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToUpdate = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.nodeValue && node.nodeValue.includes('Portnox Total Cost')) {
        nodesToUpdate.push(node);
      }
    }
    
    nodesToUpdate.forEach(node => {
      node.nodeValue = node.nodeValue.replace(/Portnox Total Cost/g, 'Total Cost');
    });
  }
  
  // Apply title updates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllTitles);
  } else {
    updateAllTitles();
  }
  
  setInterval(updateAllTitles, 2000);
  
  console.log('Title fix applied');
})();

// 3. Fix cost configuration
(function() {
  function fixCostConfiguration() {
    // Find the advanced options panel
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel || document.getElementById('cost-config-section')) {
      return;
    }
    
    // Create cost configuration section
    const costConfigSection = document.createElement('div');
    costConfigSection.id = 'cost-config-section';
    
    costConfigSection.innerHTML = `
      <h5>Cost Configuration</h5>
      <div class="options-grid">
        <div class="input-group">
          <label for="cost-hardware">Hardware Costs</label>
          <input type="number" id="cost-hardware" min="0.1" max="5" step="0.1" value="1.0">
        </div>
        <div class="input-group">
          <label for="cost-licensing">Licensing Costs</label>
          <input type="number" id="cost-licensing" min="0.1" max="5" step="0.1" value="1.0">
        </div>
        <div class="input-group">
          <label for="cost-maintenance">Maintenance Costs</label>
          <input type="number" id="cost-maintenance" min="0.1" max="5" step="0.1" value="1.0">
        </div>
        <div class="input-group">
          <label for="cost-implementation">Implementation Costs</label>
          <input type="number" id="cost-implementation" min="0.1" max="5" step="0.1" value="1.0">
        </div>
        <div class="input-group">
          <label for="cost-personnel">Personnel Costs</label>
          <input type="number" id="cost-personnel" min="0.1" max="5" step="0.1" value="1.0">
        </div>
        <div class="input-group">
          <label for="cost-downtime">Downtime Cost ($/hour)</label>
          <input type="number" id="cost-downtime" min="100" max="10000" step="100" value="1000">
        </div>
      </div>
    `;
    
    // Add to advanced options panel
    advancedPanel.appendChild(costConfigSection);
    
    // Add event listeners
    costConfigSection.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', function() {
        if (window.calculator && typeof window.calculator.calculate === 'function') {
          window.calculator.calculate();
        }
      });
    });
    
    console.log('Cost configuration added');
  }
  
  // Check for advanced panel when it might be visible
  function checkForAdvancedPanel() {
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (advancedPanel && !advancedPanel.classList.contains('hidden')) {
      fixCostConfiguration();
    }
  }
  
  // Apply on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Initial check
      setTimeout(checkForAdvancedPanel, 500);
      
      // Watch for panel toggle
      document.addEventListener('click', function(event) {
        if (event.target.closest('.advanced-options-toggle')) {
          setTimeout(checkForAdvancedPanel, 100);
        }
      });
    });
  } else {
    setTimeout(checkForAdvancedPanel, 500);
    
    document.addEventListener('click', function(event) {
      if (event.target.closest('.advanced-options-toggle')) {
        setTimeout(checkForAdvancedPanel, 100);
      }
    });
  }
  
  console.log('Cost configuration fix ready');
})();
