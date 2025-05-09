/**
 * Help functionality for sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add Parameters Help button
  const headerActions = document.querySelector('.header-actions');
  
  if (headerActions) {
    // Create help button if it doesn't exist
    if (!document.getElementById('sensitivity-help-btn')) {
      const helpButton = document.createElement('button');
      helpButton.id = 'sensitivity-help-btn';
      helpButton.className = 'btn btn-outline btn-sm';
      helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Parameters Help';
      
      // Add to header actions before other buttons
      if (headerActions.firstChild) {
        headerActions.insertBefore(helpButton, headerActions.firstChild);
      } else {
        headerActions.appendChild(helpButton);
      }
    }
    
    // Add click handler for the button
    const helpButton = document.getElementById('sensitivity-help-btn');
    helpButton.addEventListener('click', showSensitivityHelp);
  }
  
  /**
   * Show sensitivity help dialog
   */
  function showSensitivityHelp() {
    // Check if documentation is available
    if (typeof window.getSensitivityDocumentation !== 'function') {
      console.error('Documentation not available');
      return;
    }
    
    // Get documentation
    const helpDocs = window.getSensitivityDocumentation();
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    
    // Create help dialog
    modal.innerHTML = `
      <div class="help-dialog">
        <div class="help-dialog-header">
          <h3>${helpDocs.title}</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="help-dialog-content">
          <p>${helpDocs.description}</p>
          <p>${helpDocs.usage}</p>
          
          <h4>Parameters</h4>
          <ul id="parameters-list"></ul>
          
          <h4>Interpretation</h4>
          <p><strong>Breakeven Points:</strong> ${helpDocs.interpretation.breakeven}</p>
          <p><strong>Cost Drivers:</strong> ${helpDocs.interpretation.costDrivers}</p>
          <p><strong>Recommendations:</strong> ${helpDocs.interpretation.recommendations}</p>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add parameter items
    const parametersList = modal.querySelector('#parameters-list');
    Object.entries(helpDocs.parameters).forEach(([id, param]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${param.title}</strong>: ${param.description}<br>Impact: ${param.impact}`;
      parametersList.appendChild(li);
    });
    
    // Add close button handler
    modal.querySelector('.close-btn').addEventListener('click', function() {
      document.body.removeChild(modal);
    });
    
    // Add styles
    addHelpStyles();
  }
  
  /**
   * Add help dialog styles
   */
  function addHelpStyles() {
    // Add styles if not already added
    if (!document.getElementById('help-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'help-modal-styles';
      styles.textContent = `
        .help-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .help-dialog {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          width: 80%;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .help-dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #ddd;
        }
        
        .help-dialog-header h3 {
          margin: 0;
          color: #1B67B2;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .help-dialog-content {
          padding: 24px;
          overflow-y: auto;
        }
        
        .help-dialog-content ul {
          padding-left: 20px;
        }
        
        .help-dialog-content li {
          margin-bottom: 12px;
        }
      `;
      document.head.appendChild(styles);
    }
  }
});
