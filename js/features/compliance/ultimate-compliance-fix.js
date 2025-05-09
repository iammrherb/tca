/**
 * Ultimate Compliance Fix
 * Handles ComplianceInsights class redeclaration and provides enhanced functionality
 */
(function() {
  console.log('Applying Ultimate Compliance Fix...');
  
  // First, remove any existing ComplianceInsights class/instances to prevent redeclaration errors
  if (window.ComplianceInsights) {
    console.log('Found existing ComplianceInsights, removing...');
    delete window.ComplianceInsights;
    delete window.complianceInsights;
  }
  
  // Create a single definitive implementation of ComplianceInsights
  window.ComplianceInsights = class {
    constructor() {
      this.industryData = {};
      this.currentIndustry = null;
      
      // Initialize once the DOM is ready
      this._init();
      
      console.log('ComplianceInsights initialized correctly');
    }
    
    _init() {
      // Load industry data if available
      if (window.industryTemplates) {
        this.industryData = window.industryTemplates;
      }
      
      // Setup event listener for industry selector
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector) {
        industrySelector.addEventListener('change', () => {
          this.currentIndustry = industrySelector.value;
          this.updateComplianceInsights();
        });
      }
    }
    
    updateComplianceInsights() {
      if (!this.currentIndustry || this.currentIndustry === 'none' || !this.industryData[this.currentIndustry]) {
        this.clearComplianceInsights();
        return;
      }
      
      const industry = this.industryData[this.currentIndustry];
      const complianceInfo = industry.complianceInfo;
      
      if (!complianceInfo) {
        this.clearComplianceInsights();
        return;
      }
      
      // Update compliance container
      const container = document.getElementById('compliance-info-container');
      if (!container) return;
      
      container.innerHTML = '';
      const card = document.createElement('div');
      card.className = 'compliance-info-card';
      
      card.innerHTML = `
        <h3>${complianceInfo.title || industry.name + ' Compliance Requirements'}</h3>
        <p>${complianceInfo.details}</p>
        <h4>Key Requirements</h4>
        <ul class="compliance-requirements">
          ${(complianceInfo.keyRequirements || []).map(req => `<li>${req}</li>`).join('')}
        </ul>
        <button class="btn btn-outline btn-sm view-details-btn" id="view-compliance-details-btn">
          <i class="fas fa-external-link-alt"></i> View Detailed Analysis
        </button>
      `;
      
      container.appendChild(card);
      container.classList.remove('hidden');
      
      // Add event listener to the details button
      const detailsBtn = document.getElementById('view-compliance-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          // Try to activate industry tab if it exists
          const industryTab = document.querySelector('[data-tab="industry-tab"]');
          if (industryTab) {
            industryTab.click();
          }
        });
      }
    }
    
    clearComplianceInsights() {
      const container = document.getElementById('compliance-info-container');
      if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
      }
    }
    
    refreshComplianceInsights() {
      this.updateComplianceInsights();
    }
  };
  
  // Create singleton instance after a slight delay to ensure DOM is ready
  setTimeout(() => {
    if (!window.complianceInsights) {
      window.complianceInsights = new window.ComplianceInsights();
    }
  }, 1000);
  
  console.log('Ultimate Compliance Fix setup complete');
})();
