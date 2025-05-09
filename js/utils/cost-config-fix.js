/**
 * Fix for cost configuration in advanced settings
 */
(function() {
  // Function to fix the cost configuration
  function fixCostConfiguration() {
    console.log('Fixing cost configuration in advanced settings');
    
    // Find the advanced options panel
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel) {
      console.warn('Advanced options panel not found');
      return;
    }
    
    // Check if cost configuration section already exists
    if (document.getElementById('cost-config-section')) {
      console.log('Cost configuration section already exists');
      return;
    }
    
    // Create cost configuration section
    const costConfigSection = document.createElement('div');
    costConfigSection.id = 'cost-config-section';
    costConfigSection.className = 'advanced-settings-section';
    
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
    
    // Add event listeners to update calculator
    const costInputs = costConfigSection.querySelectorAll('input');
    costInputs.forEach(input => {
      input.addEventListener('change', function() {
        // Trigger calculator update if available
        if (window.calculator && typeof window.calculator.calculate === 'function') {
          window.calculator.calculate();
        }
      });
    });
    
    // Add CSS to style the section
    const style = document.createElement('style');
    style.textContent = `
      #cost-config-section {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e0e0e0;
      }
      
      #cost-config-section h5 {
        margin-bottom: 10px;
        color: #1B67B2;
      }
      
      .options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }
    `;
    document.head.appendChild(style);
    
    console.log('Cost configuration section added successfully');
  }
  
  // Apply fix when advanced options panel is available
  function waitForAdvancedPanel() {
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (advancedPanel) {
      fixCostConfiguration();
    } else {
      // Check again in 500ms
      setTimeout(waitForAdvancedPanel, 500);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForAdvancedPanel);
  } else {
    waitForAdvancedPanel();
  }
  
  // Also fix when advanced options toggle is clicked
  document.addEventListener('click', function(event) {
    if (event.target.closest('.advanced-options-toggle')) {
      // Wait a bit for panel to show
      setTimeout(fixCostConfiguration, 100);
    }
  });
  
  console.log('Cost configuration fix installed');
})();
