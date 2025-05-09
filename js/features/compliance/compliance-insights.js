/**
 * Enhanced Compliance Insights Component
 * Displays detailed industry-specific compliance information and recommendations
 */
class ComplianceInsights {
  constructor() {
    this.activeIndustry = null;
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Listen for industry template changes
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', () => {
        this.updateComplianceInsights(industrySelector.value);
      });
    }
    
    // Listen for tab changes to update content when compliance tab is shown
    if (window.tabManager) {
      window.tabManager.on('tabChanged', (data) => {
        if (data.tabId === 'compliance-tab') {
          this.refreshComplianceInsights();
        }
      });
    }
  }
  
  updateComplianceInsights(industryKey) {
    if (!industryKey || industryKey === 'none' || !window.enhancedIndustryTemplates) {
      return;
    }
    
    this.activeIndustry = industryKey;
    
    // Create or update compliance info
    const industry = window.enhancedIndustryTemplates[industryKey];
    if (!industry) return;
    
    // Update complianceInfo in the UI
    this.updateComplianceInfo(industry);
    
    // Update regulatory details
    this.updateRegulatoryDetails(industry);
    
    // Update industry challenges and solutions
    this.updateChallengesMitigated(industry);
    
    // Show compliance tab if available
    this.showComplianceTab();
  }
  
  refreshComplianceInsights() {
    if (this.activeIndustry) {
      this.updateComplianceInsights(this.activeIndustry);
    }
  }
  
  updateComplianceInfo(industry) {
    const container = document.getElementById('compliance-info-container');
    if (!container) return;
    
    const complianceInfo = industry.complianceInfo;
    if (!complianceInfo) return;
    
    // Create compliance info card
    let html = `
      <div class="compliance-info-card">
        <h3>${complianceInfo.title}</h3>
        <p>${complianceInfo.details}</p>
        <h4>Key Requirements</h4>
        <ul class="compliance-requirements">
    `;
    
    // Add requirements
    complianceInfo.keyRequirements.forEach(req => {
      html += `<li>${req}</li>`;
    });
    
    html += `
        </ul>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  updateRegulatoryDetails(industry) {
    const container = document.getElementById('regulatory-details-container');
    if (!container) return;
    
    const complianceInfo = industry.complianceInfo;
    if (!complianceInfo || !complianceInfo.regulations) return;
    
    // Create regulations card
    let html = `
      <div class="result-card">
        <h3>Regulatory Framework Details</h3>
        <div class="regulations-grid">
    `;
    
    // Add regulations
    complianceInfo.regulations.forEach(reg => {
      html += `
        <div class="regulation-card">
          <h4>${reg.name}</h4>
          <p>${reg.description}</p>
          <div class="regulation-relevance">
            <h5>NAC Relevance</h5>
            <p>${reg.relevance}</p>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
    
    // Add specialized HIPAA details if available
    if (industry.hipaaDetails) {
      this.updateHIPAADetails(industry.hipaaDetails);
    }
  }
  
  updateHIPAADetails(hipaaDetails) {
    const container = document.getElementById('hipaa-details-container');
    if (!container) return;
    
    // Create HIPAA details card
    let html = `
      <div class="result-card">
        <h3>HIPAA Technical Safeguards Analysis</h3>
        <p>${hipaaDetails.riskAnalysis}</p>
        <p>${hipaaDetails.documentationSupport}</p>
        
        <h4>HIPAA Security Rule Controls</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Control</th>
                <th>HIPAA Requirement</th>
                <th>NAC Implementation</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    // Add technical controls
    hipaaDetails.technicalControls.forEach(control => {
      html += `
        <tr>
          <td>${control.control}</td>
          <td>${control.requirement}</td>
          <td>${control.implementation}</td>
        </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  updateChallengesMitigated(industry) {
    const container = document.getElementById('challenges-mitigated-container');
    if (!container) return;
    
    if (!industry.challengesMitigated) return;
    
    // Create challenges card
    let html = `
      <div class="result-card">
        <h3>${industry.name} Industry Challenges</h3>
        <div class="challenges-grid">
    `;
    
    // Add challenges
    industry.challengesMitigated.forEach(item => {
      html += `
        <div class="challenge-card">
          <div class="challenge-content">
            <h4 class="challenge-title">Challenge: ${item.challenge}</h4>
            <div class="challenge-solution">
              <h5>Solution</h5>
              <p>${item.mitigation}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  showComplianceTab() {
    // Check if compliance tab exists
    const complianceTab = document.querySelector('.tab-button[data-tab="compliance-tab"]');
    if (!complianceTab) {
      // Create compliance tab if needed
      this.createComplianceTab();
    } else {
      // Show existing tab
      complianceTab.style.display = '';
    }
  }
  
  createComplianceTab() {
    // Find tabs container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    // Create new tab button
    const newTab = document.createElement('button');
    newTab.className = 'tab-button';
    newTab.setAttribute('role', 'tab');
    newTab.setAttribute('aria-selected', 'false');
    newTab.setAttribute('data-tab', 'compliance-tab');
    newTab.setAttribute('tabindex', '-1');
    newTab.innerHTML = 'Compliance';
    
    // Insert after implementation tab
    const implementationTab = document.querySelector('.tab-button[data-tab="implementation-tab"]');
    if (implementationTab) {
      tabsContainer.insertBefore(newTab, implementationTab.nextSibling);
    } else {
      tabsContainer.appendChild(newTab);
    }
    
    // Create tab content
    const tabContent = document.querySelector('.tab-content');
    if (!tabContent) return;
    
    const newTabPane = document.createElement('div');
    newTabPane.id = 'compliance-tab';
    newTabPane.className = 'tab-pane';
    newTabPane.setAttribute('role', 'tabpanel');
    newTabPane.setAttribute('aria-hidden', 'true');
    
    // Add content structure
    newTabPane.innerHTML = `
      <h3>Industry Compliance Analysis</h3>
      
      <div id="compliance-info-container" class="compliance-info-container"></div>
      
      <div id="regulatory-details-container" class="regulatory-details-container"></div>
      
      <div id="hipaa-details-container" class="hipaa-details-container hidden"></div>
      
      <div id="challenges-mitigated-container" class="challenges-mitigated-container"></div>
    `;
    
    // Add to tab content
    tabContent.appendChild(newTabPane);
    
    // Add event listener
    newTab.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.tabManager) {
        window.tabManager.setActiveTab('compliance-tab');
      }
    });
    
    // Add keyboard accessibility
    newTab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.tabManager) {
          window.tabManager.setActiveTab('compliance-tab');
        }
      }
    });
  }
}

// Initialize and make globally available
window.complianceInsights = new ComplianceInsights();
