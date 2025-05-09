/**
 * Tab Organization Enhancement
 * Reorganizes tabs and enhances content organization
 */
(function() {
  console.log('Applying tab organization enhancement...');
  
  // Define tab structure
  const tabStructure = [
    {
      id: 'summary-tab',
      title: 'Executive Summary',
      icon: 'chart-pie',
      sections: ['overview', 'key-metrics', 'vendor-comparison', 'recommendation']
    },
    {
      id: 'financial-tab',
      title: 'Financial Analysis',
      icon: 'dollar-sign',
      sections: ['tco-comparison', 'roi-analysis', 'cost-breakdown', 'savings-projection']
    },
    {
      id: 'technical-tab',
      title: 'Technical Comparison',
      icon: 'tools',
      sections: ['features-comparison', 'architecture', 'implementation', 'maintenance']
    },
    {
      id: 'industry-tab',
      title: 'Industry & Compliance',
      icon: 'building',
      sections: ['industry-overview', 'compliance-requirements', 'challenges', 'solutions']
    }
  ];
  
  // Create or update tabs based on structure
  function updateTabStructure() {
    // Find tabs container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    // Clear existing tabs
    tabsContainer.innerHTML = '';
    
    // Create new tabs
    tabStructure.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = 'tab-button';
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tabButton.setAttribute('data-tab', tab.id);
      tabButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
      tabButton.innerHTML = `<i class="fas fa-${tab.icon}"></i> ${tab.title}`;
      
      if (index === 0) {
        tabButton.classList.add('active');
      }
      
      tabButton.addEventListener('click', function() {
        // Deactivate all tabs
        document.querySelectorAll('.tab-button').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });
        
        // Activate this tab
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');
        
        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Show selected tab pane
        const tabPane = document.getElementById(this.getAttribute('data-tab'));
        if (tabPane) {
          tabPane.classList.add('active');
        }
      });
      
      tabsContainer.appendChild(tabButton);
    });
  }
  
  // Initialize
  function init() {
    console.log('Initializing tab organization...');
    
    updateTabStructure();
    
    console.log('Tab organization complete');
  }
  
  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
