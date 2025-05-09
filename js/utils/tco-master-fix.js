/**
 * TCO Master Fix - Main installation file that coordinates all fixes
 */
(function() {
  console.log('=== TCO MASTER FIX (Horizontal Layout) ===');
  console.log('Initializing master fix...');
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasterFix);
  } else {
    initMasterFix();
  }
  
  function initMasterFix() {
    console.log('Applying all fixes...');
    
    // Show loading overlay
    showLoadingOverlay('Applying TCO Analyzer fixes...');
    
    // Apply fixes in sequence with slight delays to ensure proper initialization
    setTimeout(() => {
      applyCalculatorFix();
      
      setTimeout(() => {
        applyChartFix();
        
        setTimeout(() => {
          applyUIWorkflowFix();
          
          setTimeout(() => {
            hideLoadingOverlay();
            showSuccessNotification();
          }, 500);
        }, 500);
      }, 500);
    }, 100);
  }
  
  // Apply calculator fix
  function applyCalculatorFix() {
    console.log('Applying calculator fix...');
    
    const script = document.createElement('script');
    script.src = 'js/fixes/calculator-fix.js';
    document.body.appendChild(script);
  }
  
  // Apply chart fix
  function applyChartFix() {
    console.log('Applying chart fix...');
    
    const script = document.createElement('script');
    script.src = 'js/fixes/chart-fix.js';
    document.body.appendChild(script);
  }
  
  // Apply UI workflow fix
  function applyUIWorkflowFix() {
    console.log('Applying UI workflow fix (horizontal layout)...');
    
    const script = document.createElement('script');
    script.src = 'js/fixes/ui-workflow-fix.js';
    document.body.appendChild(script);
  }
  
  // Show loading overlay
  function showLoadingOverlay(message) {
    let overlay = document.querySelector('.loading-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      
      const text = document.createElement('div');
      text.className = 'loading-text';
      
      overlay.appendChild(spinner);
      overlay.appendChild(text);
      document.body.appendChild(overlay);
    }
    
    overlay.querySelector('.loading-text').textContent = message || 'Loading...';
    overlay.style.display = 'flex';
  }
  
  // Hide loading overlay
  function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
  // Show success notification
  function showSuccessNotification() {
    console.log('Showing success notification...');
    
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.innerHTML = `
      <i class="fas fa-check-circle notification-icon"></i>
      <div class="notification-message">Total Cost Analyzer fixes applied successfully! New horizontal layout enabled.</div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
      notification.classList.remove('show');
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notificationContainer.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }
  
  console.log('TCO Master Fix (Horizontal Layout) initialized successfully');
})();
