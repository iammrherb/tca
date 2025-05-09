/**
 * Ultimate Industry Display
 * Moves industry information to a dedicated tab with enhanced visualization
 */
(function() {
  console.log('Installing Ultimate Industry Display...');
  
  // Add custom styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .industry-tab {
        padding: 20px 0;
      }
      
      .industry-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .industry-metric {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .industry-metric-value {
        font-size: 24px;
        font-weight: bold;
        color: #1B67B2;
        margin: 10px 0;
      }
      
      .industry-metric-label {
        font-size: 14px;
        color: #505050;
      }
      
      .compliance-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .compliance-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-top: 4px solid #1B67B2;
      }
      
      .compliance-card h4 {
        margin-top: 0;
        color: #1B67B2;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      
      .compliance-card h4 i {
        margin-right: 8px;
      }
      
      .compliance-card p {
        font-size: 14px;
        color: #505050;
        margin-bottom: 15px;
      }
      
      .regulation-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .regulation-item {
        padding: 10px;
        background: #f8f9fa;
        margin-bottom: 8px;
        border-radius: 4px;
        font-size: 13px;
      }
      
      .regulation-item strong {
        display: block;
        margin-bottom: 3px;
      }
      
      .regulation-relevance {
        color: #1B67B2;
        font-style: italic;
        font-size: 12px;
        display: block;
        margin-top: 5px;
      }
      
      .industry-challenges {
        margin-top: 30px;
      }
      
      .challenge-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .challenge-card {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
      }
      
      .challenge-header {
        color: #1B67B2;
        font-weight: 600;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .challenge-header i {
        margin-right: 8px;
        color: #2BD25B;
      }
      
      .challenge-solution {
        font-size: 14px;
        color: #505050;
        border-left: 3px solid #2BD25B;
        padding-left: 15px;
        margin-top: 10px;
      }
      
      .industry-selector-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .industry-icon {
        font-size: 24px;
        margin-right: 10px;
        color: #2BD25B;
      }
      
      .industry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .industry-title {
        font-size: 24px;
        color: #1B67B2;
        margin: 0;
      }
      
      /* Animation for tab transition */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .tab-pane.active {
        animation: fadeIn 0.3s ease-out;
      }
      
      /* Enhanced sidebar view */
      .sidebar-industry-preview {
        background: white;
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .sidebar-industry-preview h4 {
        color: #1B67B2;
        margin-top: 0;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      
      .sidebar-industry-preview h4 i {
        margin-right: 8px;
      }
      
      .sidebar-industry-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      
      .sidebar-stat {
        flex: 1 1 calc(50% - 10px);
        background: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
      }
      
      .sidebar-stat-value {
        font-weight: bold;
        font-size: 18px;
        color: #1B67B2;
      }
      
      .sidebar-stat-label {
        font-size: 12px;
        color: #505050;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Get industry icon based on industry type
  function getIndustryIcon(industry) {
    const icons = {
      healthcare: 'fa-heartbeat',
      financial: 'fa-university',
      education: 'fa-graduation-cap',
      government: 'fa-landmark',
      manufacturing: 'fa-industry',
      retail: 'fa-shopping-cart',
      energy: 'fa-bolt',
      default: 'fa-building'
    };
    
    return icons[industry] || icons.default;
  }
  
  // Create industry tab in main navigation
  function createIndustryTab() {
    // Check if tab already exists
    if (document.querySelector('[data-tab="industry-tab"]')) {
      console.log('Industry tab already exists');
      return;
    }
    
    // Find tab container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
      console.warn('Tabs container not found');
      return;
    }
    
    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', 'false');
    tabButton.setAttribute('data-tab', 'industry-tab');
    tabButton.setAttribute('tabindex', '-1');
    tabButton.innerHTML = '<i class="fas fa-building"></i> Industry';
    
    // Insert after implementation tab
    const implementationTab = document.querySelector('[data-tab="implementation-tab"]');
    if (implementationTab && implementationTab.nextSibling) {
      tabsContainer.insertBefore(tabButton, implementationTab.nextSibling);
    } else {
      tabsContainer.appendChild(tabButton);
    }
    
    // Create tab content container
    const tabContentContainer = document.querySelector('.tab-content');
    if (!tabContentContainer) {
      console.warn('Tab content container not found');
      return;
    }
    
    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.id = 'industry-tab';
    tabContent.className = 'tab-pane industry-tab';
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-hidden', 'true');
    
    // Add initial content
    tabContent.innerHTML = `
      <div class="industry-selector-container">
        <label for="industry-tab-selector"><b>Select Industry:</b></label>
        <select id="industry-tab-selector" class="form-select" style="margin-left: 15px; max-width: 300px;">
          <option value="none">Choose an industry to view analysis...</option>
        </select>
      </div>
      
      <div id="industry-content">
        <div class="no-industry-selected">
          <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
        </div>
      </div>
    `;
    
    // Add to container
    tabContentContainer.appendChild(tabContent);
    
    // Setup tab click event
    tabButton.addEventListener('click', function() {
      // Deactivate all tabs
      document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });
      
      // Deactivate all tab panes
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        pane.setAttribute('aria-hidden', 'true');
      });
      
      // Activate this tab
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      this.setAttribute('tabindex', '0');
      
      // Show tab content
      const tabId = this.getAttribute('data-tab');
      const tabPane = document.getElementById(tabId);
      
      if (tabPane) {
        tabPane.classList.add('active');
        tabPane.setAttribute('aria-hidden', 'false');
      }
    });
    
    console.log('Industry tab created');
  }
  
  // Initialize industry selectors
  function initIndustrySelectors() {
    const mainSelector = document.getElementById('industry-selector');
    const tabSelector = document.getElementById('industry-tab-selector');
    
    if (!mainSelector || !tabSelector) {
      console.warn('Industry selectors not found');
      return;
    }
    
    // Copy options from main selector to tab selector
    Array.from(mainSelector.options).forEach((option, index) => {
      if (index > 0) { // Skip the first "Select an industry" option
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.textContent;
        tabSelector.appendChild(newOption);
      }
    });
    
    // Sync selections between selectors
    mainSelector.addEventListener('change', function() {
      tabSelector.value = this.value;
      updateIndustryContent(this.value);
    });
    
    tabSelector.addEventListener('change', function() {
      mainSelector.value = this.value;
      // Trigger change event on main selector to apply templates
      const event = new Event('change');
      mainSelector.dispatchEvent(event);
    });
    
    console.log('Industry selectors initialized');
  }
  
  // Update industry content in the tab
  function updateIndustryContent(industryId) {
    const contentContainer = document.getElementById('industry-content');
    if (!contentContainer || !window.industryTemplates) {
      return;
    }
    
    if (industryId === 'none' || !window.industryTemplates[industryId]) {
      contentContainer.innerHTML = `
        <div class="no-industry-selected">
          <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
        </div>
      `;
      return;
    }
    
    const industry = window.industryTemplates[industryId];
    const icon = getIndustryIcon(industryId);
    
    // Create detailed industry content
    const content = `
      <div class="industry-header">
        <h2 class="industry-title"><i class="fas ${icon} industry-icon"></i>${industry.name} Industry Analysis</h2>
      </div>
      
      <p class="industry-description">
        This analysis provides industry-specific insights, compliance requirements, and cost benchmarks
        for ${industry.name} organizations deploying NAC solutions.
      </p>
      
      <div class="industry-dashboard">
        <div class="industry-metric">
          <div class="industry-metric-label">Average TCO (Industry)</div>
          <div class="industry-metric-value">$${(industry.benchmarks?.averageTCO || 0).toLocaleString()}</div>
          <div class="industry-metric-description">Typical 3-year TCO for on-premises NAC</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Implementation Time</div>
          <div class="industry-metric-value">${industry.benchmarks?.implementationTime || 0} days</div>
          <div class="industry-metric-description">Average implementation time</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Annual Personnel Cost</div>
          <div class="industry-metric-value">$${(industry.benchmarks?.fteCost || 0).toLocaleString()}</div>
          <div class="industry-metric-description">Typical annual IT staff cost</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Cloud NAC Savings</div>
          <div class="industry-metric-value">35-45%</div>
          <div class="industry-metric-description">Average TCO reduction</div>
        </div>
      </div>
      
      <h3>Compliance Requirements</h3>
      <div class="compliance-cards">
        <div class="compliance-card">
          <h4><i class="fas fa-shield-alt"></i> Regulatory Overview</h4>
          <p>${industry.complianceInfo?.details || 'No compliance information available'}</p>
          
          <h5>Key Requirements</h5>
          <ul class="key-requirements">
            ${(industry.complianceInfo?.keyRequirements || []).map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        
        <div class="compliance-card">
          <h4><i class="fas fa-clipboard-check"></i> Key Regulations</h4>
          <ul class="regulation-list">
            ${(industry.complianceInfo?.regulations || []).map(reg => `
              <li class="regulation-item">
                <strong>${reg.name}</strong>
                ${reg.description}
                <span class="regulation-relevance">Relevance: ${reg.relevance}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      
      <div class="industry-challenges">
        <h3>Industry-Specific Challenges & Solutions</h3>
        <div class="challenge-grid">
          ${(industry.challengesMitigated || []).map(challenge => `
            <div class="challenge-card">
              <div class="challenge-header">
                <i class="fas fa-exclamation-triangle"></i>
                ${challenge.challenge}
              </div>
              <div class="challenge-solution">
                <strong>Solution:</strong> ${challenge.mitigation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    contentContainer.innerHTML = content;
  }
  
  // Enhance sidebar industry preview
  function enhanceSidebarIndustryPreview() {
    // Monitor for industry selection
    const industrySelector = document.getElementById('industry-selector');
    if (!industrySelector) return;
    
    // Create preview container if needed
    let previewContainer = document.getElementById('sidebar-industry-preview');
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.id = 'sidebar-industry-preview';
      previewContainer.className = 'sidebar-industry-preview hidden';
      
      // Find industry templates card to insert after
      const templatesCard = document.querySelector('.industry-templates-card');
      if (templatesCard) {
        templatesCard.after(previewContainer);
      }
    }
    
    // Watch for industry selection changes
    industrySelector.addEventListener('change', function() {
      const industryId = this.value;
      
      if (industryId === 'none' || !window.industryTemplates || !window.industryTemplates[industryId]) {
        previewContainer.classList.add('hidden');
        return;
      }
      
      const industry = window.industryTemplates[industryId];
      const icon = getIndustryIcon(industryId);
      
      // Update preview content
      previewContainer.innerHTML = `
        <h4><i class="fas ${icon}"></i> ${industry.name} Industry</h4>
        <div class="sidebar-industry-stats">
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">$${(industry.benchmarks?.averageTCO / 1000000 || 0).toFixed(1)}M</div>
            <div class="sidebar-stat-label">Avg. TCO (3yr)</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-value">${industry.benchmarks?.implementationTime || 0}</div>
            <div class="sidebar-stat-label">Impl. Days</div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm mt-2" id="view-industry-details-btn" style="width: 100%; margin-top: 10px;">
          <i class="fas fa-external-link-alt"></i> View Full Analysis
        </button>
      `;
      
      // Add event listener to the details button
      const detailsBtn = document.getElementById('view-industry-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          // Activate industry tab
          const industryTab = document.querySelector('[data-tab="industry-tab"]');
          if (industryTab) {
            industryTab.click();
          }
        });
      }
      
      previewContainer.classList.remove('hidden');
    });
  }
  
  // Initialize enhancements
  function init() {
    // Only run on index.html
    if (!document.querySelector('.tabs')) {
      console.log('Not on main page, skipping industry tab creation');
      return;
    }
    
    // Add styles
    addStyles();
    
    // Create industry tab
    createIndustryTab();
    
    // Initialize industry selectors after a slight delay
    setTimeout(() => {
      initIndustrySelectors();
      enhanceSidebarIndustryPreview();
    }, 1000);
    
    console.log('Ultimate Industry Display initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Ultimate Industry Display setup complete');
})();
