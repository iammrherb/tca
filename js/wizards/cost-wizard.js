/**
 * Cost Wizard Component
 * Direct implementation of the Cost Wizard UI and functionality
 */
(function() {
  console.log('Installing Cost Wizard Component...');
  
  // Create the wizard HTML and add it to the page
  function createWizard() {
    // Create the wizard container
    const wizardContainer = document.createElement('div');
    wizardContainer.id = 'cost-wizard-container';
    wizardContainer.className = 'modal';
    
    // Create wizard HTML
    wizardContainer.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cost Configuration Wizard</h2>
          <span class="close-button" id="close-wizard">&times;</span>
        </div>
        <div class="modal-body">
          <p>Customize cost factors to see how they affect your Total Cost of Ownership.</p>
          
          <div class="wizard-section">
            <h3>Hardware & Software Costs</h3>
            <div class="wizard-grid">
              <div class="wizard-input-group">
                <label for="hardware-multiplier">Hardware Cost Multiplier</label>
                <input type="range" id="hardware-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
              
              <div class="wizard-input-group">
                <label for="software-multiplier">Software Cost Multiplier</label>
                <input type="range" id="software-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
            </div>
          </div>
          
          <div class="wizard-section">
            <h3>Annual Costs</h3>
            <div class="wizard-grid">
              <div class="wizard-input-group">
                <label for="licensing-multiplier">Licensing Cost Multiplier</label>
                <input type="range" id="licensing-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
              
              <div class="wizard-input-group">
                <label for="maintenance-multiplier">Maintenance Cost Multiplier</label>
                <input type="range" id="maintenance-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
              
              <div class="wizard-input-group">
                <label for="support-multiplier">Support Cost Multiplier</label>
                <input type="range" id="support-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
              
              <div class="wizard-input-group">
                <label for="personnel-multiplier">Personnel Cost Multiplier</label>
                <input type="range" id="personnel-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
            </div>
          </div>
          
          <div class="wizard-section">
            <h3>Implementation Factors</h3>
            <div class="wizard-grid">
              <div class="wizard-input-group">
                <label for="implementation-multiplier">Implementation Cost Multiplier</label>
                <input type="range" id="implementation-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
              
              <div class="wizard-input-group">
                <label for="implementation-time-multiplier">Implementation Time Multiplier</label>
                <input type="range" id="implementation-time-multiplier" min="0" max="2" step="0.1" value="1">
                <div class="range-value">1.0x</div>
              </div>
            </div>
          </div>
          
          <div class="wizard-section">
            <h3>Additional Factors</h3>
            <div class="wizard-grid">
              <div class="wizard-input-group">
                <label for="downtime-cost">Downtime Cost ($ per hour)</label>
                <input type="number" id="downtime-cost" min="0" value="1000">
              </div>
              
              <div class="wizard-input-group">
                <label for="complexity-factor">Environment Complexity Factor</label>
                <select id="complexity-factor" class="form-select">
                  <option value="0.8">Simple (0.8x)</option>
                  <option value="1.0" selected>Average (1.0x)</option>
                  <option value="1.2">Complex (1.2x)</option>
                  <option value="1.5">Very Complex (1.5x)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button id="reset-wizard" class="btn btn-outline">Reset to Defaults</button>
          <button id="apply-wizard" class="btn btn-primary">Apply Changes</button>
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(wizardContainer);
    
    // Add wizard button to the sidebar
    const wizardButton = document.createElement('button');
    wizardButton.id = 'open-wizard-btn';
    wizardButton.className = 'btn btn-primary';
    wizardButton.innerHTML = '<i class="fas fa-sliders-h"></i> Cost Configuration Wizard';
    
    // Add button before the calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn && calculateBtn.parentNode) {
      calculateBtn.parentNode.insertBefore(wizardButton, calculateBtn);
    } else {
      // Fallback to adding it to the organization inputs
      const orgInputs = document.querySelector('.organization-inputs');
      if (orgInputs) {
        orgInputs.appendChild(wizardButton);
      }
    }
    
    // Add CSS
    addWizardCSS();
    
    // Add event listeners
    setupWizardEvents();
  }
  
  // Add wizard CSS
  function addWizardCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Cost Wizard Styles */
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
      }
      
      .modal.show {
        display: flex;
      }
      
      .modal-content {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .modal-header h2 {
        margin: 0;
        color: #1B67B2;
        font-size: 1.5rem;
      }
      
      .close-button {
        font-size: 1.8rem;
        color: #666;
        cursor: pointer;
      }
      
      .modal-body {
        padding: 24px;
      }
      
      .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
      }
      
      .wizard-section {
        margin-bottom: 24px;
      }
      
      .wizard-section h3 {
        color: #1B67B2;
        font-size: 1.2rem;
        margin-bottom: 16px;
      }
      
      .wizard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .wizard-input-group {
        margin-bottom: 16px;
      }
      
      .wizard-input-group label {
        display: block;
        margin-bottom: 8px;
        color: #505050;
        font-weight: 500;
      }
      
      .wizard-input-group input[type="range"] {
        width: 100%;
      }
      
      .wizard-input-group .range-value {
        text-align: right;
        color: #2BD25B;
        font-weight: 500;
        margin-top: 4px;
      }
      
      #open-wizard-btn {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 16px;
        background-color: #2BD25B;
        border-color: #1ca343;
      }
      
      #open-wizard-btn:hover {
        background-color: #1ca343;
      }
      
      @media (max-width: 768px) {
        .wizard-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Set up wizard events
  function setupWizardEvents() {
    // Open wizard button
    const openButton = document.getElementById('open-wizard-btn');
    if (openButton) {
      openButton.addEventListener('click', function() {
        const modal = document.getElementById('cost-wizard-container');
        if (modal) modal.classList.add('show');
      });
    }
    
    // Close button
    const closeButton = document.getElementById('close-wizard');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        const modal = document.getElementById('cost-wizard-container');
        if (modal) modal.classList.remove('show');
      });
    }
    
    // Update range values
    const rangeInputs = document.querySelectorAll('.wizard-input-group input[type="range"]');
    rangeInputs.forEach(function(input) {
      const valueDisplay = input.nextElementSibling;
      if (valueDisplay && valueDisplay.className === 'range-value') {
        // Update initial value
        valueDisplay.textContent = input.value + 'x';
        
        // Update on input
        input.addEventListener('input', function() {
          valueDisplay.textContent = input.value + 'x';
        });
      }
    });
    
    // Reset button
    const resetButton = document.getElementById('reset-wizard');
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        // Reset all range inputs
        rangeInputs.forEach(function(input) {
          input.value = 1.0;
          const valueDisplay = input.nextElementSibling;
          if (valueDisplay && valueDisplay.className === 'range-value') {
            valueDisplay.textContent = '1.0x';
          }
        });
        
        // Reset other inputs
        document.getElementById('downtime-cost').value = 1000;
        document.getElementById('complexity-factor').value = 1.0;
      });
    }
    
    // Apply button
    const applyButton = document.getElementById('apply-wizard');
    if (applyButton) {
      applyButton.addEventListener('click', function() {
        // Collect values
        const wizardValues = {
          hardwareMultiplier: parseFloat(document.getElementById('hardware-multiplier').value),
          softwareMultiplier: parseFloat(document.getElementById('software-multiplier').value),
          licensingMultiplier: parseFloat(document.getElementById('licensing-multiplier').value),
          maintenanceMultiplier: parseFloat(document.getElementById('maintenance-multiplier').value),
          supportMultiplier: parseFloat(document.getElementById('support-multiplier').value),
          personnelMultiplier: parseFloat(document.getElementById('personnel-multiplier').value),
          implementationMultiplier: parseFloat(document.getElementById('implementation-multiplier').value),
          implementationTimeMultiplier: parseFloat(document.getElementById('implementation-time-multiplier').value),
          downtimeCost: parseFloat(document.getElementById('downtime-cost').value),
          complexityFactor: parseFloat(document.getElementById('complexity-factor').value)
        };
        
        // Store values globally
        window.costWizardValues = wizardValues;
        
        // Close modal
        const modal = document.getElementById('cost-wizard-container');
        if (modal) modal.classList.remove('show');
        
        // Apply the values to the calculator
        applyWizardValues(wizardValues);
        
        // Show notification
        showNotification('Cost configuration applied successfully!');
      });
    }
  }
  
  // Apply wizard values
  function applyWizardValues(values) {
    // Trigger calculation with new values
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
      calculateBtn.click();
    }
  }
  
  // Show notification
  function showNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }
  
  // Initialize wizard when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWizard);
  } else {
    // DOM already loaded, create wizard now
    createWizard();
  }
  
  console.log('Cost Wizard Component installed successfully!');
})();
