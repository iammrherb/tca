/**
 * Industry Selector Component
 * Handles industry template selection and application
 */
class IndustrySelectorComponent {
  constructor() {
    this.templates = window.industryTemplates || {};
    this.initEventListeners();
    this.populateIndustrySelector();
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', this.handleIndustryChange.bind(this));
    }
  }
  
  /**
   * Populate industry selector with available templates
   */
  populateIndustrySelector() {
    const selector = document.getElementById('industry-selector');
    if (!selector) return;
    
    // Clear existing options except the default
    while (selector.options.length > 1) {
      selector.remove(1);
    }
    
    // Add industry options
    Object.entries(this.templates).forEach(([id, industry]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = industry.name;
      selector.appendChild(option);
    });
  }
  
  /**
   * Handle industry change event
   */
  handleIndustryChange(event) {
    const industryId = event.target.value;
    if (industryId === 'none') {
      // Clear industry-specific content
      this.clearIndustryContent();
      return;
    }
    
    const industry = this.templates[industryId];
    if (!industry) return;
    
    // Apply industry defaults to form
    this.applyIndustryDefaults(industry.defaults);
    
    // Display industry-specific compliance information
    this.displayComplianceInfo(industry.complianceInfo);
    
    // Display industry benchmarks
    this.displayIndustryBenchmarks(industry.benchmarks);
    
    // Display challenges mitigated
    this.displayChallengesMitigated(industry.challengesMitigated);
    
    // Show notification if notification manager is available
    if (window.notificationManager) {
      window.notificationManager.success(`Applied ${industry.name} industry template`);
    }
  }
  
  /**
   * Apply industry defaults to form inputs
   */
  applyIndustryDefaults(defaults) {
    if (!defaults) return;
    
    // Helper function to set input value based on type
    const setInputValue = (id, value) => {
      const input = document.getElementById(id);
      if (!input) return;
      
      if (input.type === 'checkbox') {
        input.checked = value;
        
        // Trigger change event to show dependent fields
        const event = new Event('change');
        input.dispatchEvent(event);
      } else {
        input.value = value;
        
        // For range inputs, update the displayed value
        if (input.type === 'range') {
          const valueDisplay = document.getElementById(`${id}-value`);
          if (valueDisplay) {
            valueDisplay.textContent = value + '%';
          }
        }
      }
    };
    
    // Apply each default value
    Object.entries(defaults).forEach(([key, value]) => {
      setInputValue(key, value);
    });
  }
  
  /**
   * Display industry-specific compliance information
   */
  displayComplianceInfo(complianceInfo) {
    const container = document.getElementById('compliance-info-container');
    if (!container || !complianceInfo) {
      if (container) container.classList.add('hidden');
      return;
    }
    
    // Create compliance info card
    let html = `
      <div class="compliance-info-card">
        <h3>${complianceInfo.title}</h3>
        <p>${complianceInfo.details}</p>
        <h4>Key Requirements</h4>
        <ul class="compliance-requirements">
    `;
    
    // Add requirements
    complianceInfo.keyRequirements.forEach(requirement => {
      html += `<li>${requirement}</li>`;
    });
    
    html += `
        </ul>
        <h4>Applicable Regulations</h4>
        <ul class="compliance-requirements">
    `;
    
    // Add regulations
    complianceInfo.regulations.forEach(regulation => {
      html += `<li><strong>${regulation.name}</strong>: ${regulation.description}</li>`;
    });
    
    html += `
        </ul>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  /**
   * Display industry benchmarks
   */
  displayIndustryBenchmarks(benchmarks) {
    const container = document.getElementById('industry-benchmarks-container');
    if (!container || !benchmarks) {
      if (container) container.classList.add('hidden');
      return;
    }
    
    // Create benchmarks card
    let html = `
      <div class="benchmarks-card">
        <h3>Industry Benchmarks</h3>
        <div class="benchmarks-grid">
    `;
    
    // Add benchmark metrics
    if (benchmarks.averageTCO) {
      html += `
        <div class="industry-metric">
          <h4>Average TCO</h4>
          <div class="metric-value">${window.formatCurrency(benchmarks.averageTCO)}</div>
          <div class="metric-description">Industry average for similar-sized deployments</div>
        </div>
      `;
    }
    
    if (benchmarks.implementationTime) {
      html += `
        <div class="industry-metric">
          <h4>Implementation Time</h4>
          <div class="metric-value">${benchmarks.implementationTime} days</div>
          <div class="metric-description">Average deployment timeline</div>
        </div>
      `;
    }
    
    if (benchmarks.fteCost) {
      html += `
        <div class="industry-metric">
          <h4>IT Staff Cost</h4>
          <div class="metric-value">${window.formatCurrency(benchmarks.fteCost)}</div>
          <div class="metric-description">Average annual personnel costs</div>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  /**
   * Display industry-specific challenges mitigated
   */
  displayChallengesMitigated(challenges) {
    const container = document.getElementById('spotlight-insights');
    if (!container || !challenges || challenges.length === 0) return;
    
    // Create challenges content
    let html = `
      <h3>Industry-Specific Challenges Addressed</h3>
      <div class="challenges-grid">
    `;
    
    // Add each challenge
    challenges.forEach(challenge => {
      html += `
        <div class="challenge-item">
          <h4>${challenge.challenge}</h4>
          <p>${challenge.mitigation}</p>
        </div>
      `;
    });
    
    html += `</div>`;
    
    // Update container
    container.innerHTML = html;
  }
  
  /**
   * Clear industry-specific content
   */
  clearIndustryContent() {
    // Clear compliance info
    const complianceContainer = document.getElementById('compliance-info-container');
    if (complianceContainer) {
      complianceContainer.innerHTML = '';
      complianceContainer.classList.add('hidden');
    }
    
    // Clear benchmarks
    const benchmarksContainer = document.getElementById('industry-benchmarks-container');
    if (benchmarksContainer) {
      benchmarksContainer.innerHTML = '';
      benchmarksContainer.classList.add('hidden');
    }
    
    // Clear spotlight insights
    const spotlightContainer = document.getElementById('spotlight-insights');
    if (spotlightContainer) {
      spotlightContainer.innerHTML = '';
    }
  }
}

// Initialize and make globally available
window.industrySelectorComponent = new IndustrySelectorComponent();
