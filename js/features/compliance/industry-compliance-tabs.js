/**
 * Industry and Compliance Tab Component
 * Provides detailed industry benchmarks, compliance requirements, and security incidents
 */
class IndustryComplianceTabManager {
  constructor() {
    this.activeIndustry = null;
    this.activeCompliance = null;
    
    // Initialize tabs when the industry selector changes
    this._initializeTabListeners();
  }
  
  /**
   * Initialize tab listeners
   */
  _initializeTabListeners() {
    // Listen for industry selector changes
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', (event) => {
        this.setActiveIndustry(event.target.value);
      });
    }
    
    // Check if industry tab exists and add it to the main tabs
    this._addIndustryTab();
  }
  
  /**
   * Add industry tab to main tabs if not present
   */
  _addIndustryTab() {
    const tabsContainer = document.querySelector('.tabs');
    const industryTab = document.getElementById('tab-industry');
    
    if (tabsContainer && !industryTab) {
      console.log("Adding industry and compliance tab...");
      
      // Create industry tab button
      const industryTabButton = document.createElement('button');
      industryTabButton.className = 'tab-button';
      industryTabButton.id = 'tab-industry';
      industryTabButton.setAttribute('role', 'tab');
      industryTabButton.setAttribute('aria-selected', 'false');
      industryTabButton.setAttribute('aria-controls', 'industry-tab');
      industryTabButton.setAttribute('data-tab', 'industry-tab');
      industryTabButton.setAttribute('tabindex', '-1');
      industryTabButton.textContent = 'Industry & Compliance';
      
      // Create industry tab content
      const tabContent = document.querySelector('.tab-content');
      if (!tabContent) {
        console.warn("Tab content container not found");
        return;
      }
      
      const industryTabContent = document.createElement('div');
      industryTabContent.id = 'industry-tab';
      industryTabContent.className = 'tab-pane';
      industryTabContent.setAttribute('role', 'tabpanel');
      industryTabContent.setAttribute('aria-labelledby', 'tab-industry');
      
      // Add initial content
      industryTabContent.innerHTML = `
        <div class="industry-compliance-container">
          <div class="industry-selector-container">
            <label for="industry-selector-tab">Industry:</label>
            <select id="industry-selector-tab" class="form-select">
              <option value="none">Select industry...</option>
              <option value="healthcare">Healthcare</option>
              <option value="financial">Financial Services</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="education">Education</option>
              <option value="government">Government</option>
            </select>
            
            <label for="compliance-selector" class="ml-1">Compliance Framework:</label>
            <select id="compliance-selector" class="form-select">
              <option value="none">Select framework...</option>
              <option value="hipaa">HIPAA</option>
              <option value="pci">PCI DSS</option>
              <option value="gdpr">GDPR</option>
              <option value="cmmc">CMMC 2.0</option>
            </select>
          </div>
          
          <div class="industry-content" id="industry-content">
            <div class="placeholder-message">
              <p>Select an industry to view detailed benchmarks, requirements, and security considerations.</p>
            </div>
          </div>
          
          <div class="compliance-content hidden" id="compliance-content">
            <div class="placeholder-message">
              <p>Select a compliance framework to view detailed requirements and NAC impact analysis.</p>
            </div>
          </div>
          
          <div class="breach-content" id="breach-incidents-content">
            <h3>Security Incidents by Category</h3>
            <div class="breach-incidents-container" id="breach-incidents-container">
              <!-- Incidents will be populated here -->
            </div>
          </div>
        </div>
      `;
      
      // Add tab button to tabs container
      tabsContainer.appendChild(industryTabButton);
      
      // Add tab content to tab content container
      tabContent.appendChild(industryTabContent);
      
      // Initialize industry selector in tab
      const industryTabSelector = document.getElementById('industry-selector-tab');
      if (industryTabSelector) {
        // Sync with main industry selector
        const mainIndustrySelector = document.getElementById('industry-selector');
        if (mainIndustrySelector && mainIndustrySelector.value !== 'none') {
          industryTabSelector.value = mainIndustrySelector.value;
          this.setActiveIndustry(mainIndustrySelector.value);
        }
        
        // Add change listener
        industryTabSelector.addEventListener('change', (event) => {
          // Update main industry selector
          if (mainIndustrySelector) {
            mainIndustrySelector.value = event.target.value;
            mainIndustrySelector.dispatchEvent(new Event('change'));
          } else {
            this.setActiveIndustry(event.target.value);
          }
        });
      }
      
      // Add event listener to tab button
      industryTabButton.addEventListener('click', () => {
        console.log("Industry tab clicked");
        
        // Get currently selected industry
        const industry = industryTabSelector.value;
        if (industry !== 'none') {
          this.setActiveIndustry(industry);
        }
        
        // Get currently selected compliance
        const compliance = document.getElementById('compliance-selector');
        if (compliance && compliance.value !== 'none') {
          this.setActiveCompliance(compliance.value);
        }
        
        // Add security incidents
        this._populateSecurityIncidents();
      });
      
      // Add event listener to compliance selector
      const complianceSelector = document.getElementById('compliance-selector');
      if (complianceSelector) {
        complianceSelector.addEventListener('change', (event) => {
          this.setActiveCompliance(event.target.value);
        });
      }
      
      // Populate security incidents
      this._populateSecurityIncidents();
      
      console.log("Industry and compliance tab added successfully");
    } else {
      console.log("Industry tab already exists or tabs container not found");
    }
  }
  
  /**
   * Set active industry and update UI
   * @param {string} industryId - Industry identifier
   */
  setActiveIndustry(industryId) {
    console.log("Setting active industry:", industryId);
    
    this.activeIndustry = industryId === 'none' ? null : industryId;
    
    // Update industry content
    this._updateIndustryContent();
    
    // Update compliance options based on industry
    this._updateComplianceOptions();
  }
  
  /**
   * Set active compliance framework and update UI
   * @param {string} complianceId - Compliance identifier
   */
  setActiveCompliance(complianceId) {
    console.log("Setting active compliance:", complianceId);
    
    this.activeCompliance = complianceId === 'none' ? null : complianceId;
    
    // Update compliance content
    this._updateComplianceContent();
  }
  
  /**
   * Update industry content with detailed information
   */
  _updateIndustryContent() {
    const industryContent = document.getElementById('industry-content');
    if (!industryContent) {
      console.warn("Industry content container not found");
      return;
    }
    
    if (!this.activeIndustry || !window.nacDocumentation?.industries?.[this.activeIndustry]) {
      industryContent.innerHTML = `
        <div class="placeholder-message">
          <p>Select an industry to view detailed benchmarks, requirements, and security considerations.</p>
        </div>
      `;
      return;
    }
    
    const industry = window.nacDocumentation.industries[this.activeIndustry];
    
    // Create industry content
    industryContent.innerHTML = `
      <h3>${industry.title}</h3>
      <p>${industry.description}</p>
      
      <div class="results-grid">
        <div class="result-card">
          <h4>Key Requirements</h4>
          <ul class="requirements-list">
            ${industry.keyRequirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        
        <div class="result-card">
          <h4>Industry Benchmarks</h4>
          <div class="table-container">
            <table class="data-table">
              <tbody>
                <tr>
                  <td>Average Breach Cost</td>
                  <td>${industry.benchmarks.breachCost}</td>
                </tr>
                <tr>
                  <td>Implementation Timeline</td>
                  <td>${industry.benchmarks.implementationTime}</td>
                </tr>
                <tr>
                  <td>IT Staffing Requirements</td>
                  <td>${industry.benchmarks.fteCost}</td>
                </tr>
                <tr>
                  <td>Downtime Business Impact</td>
                  <td>${industry.benchmarks.downtimeImpact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h4>Security Considerations</h4>
        <p>${industry.recommendations}</p>
        
        <div class="vendor-recommendations">
          <h5>Solution Recommendations for ${industry.title}</h5>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Solution Type</th>
                  <th>Advantages</th>
                  <th>Disadvantages</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cloud-Native NAC<br>(e.g., Portnox Cloud)</td>
                  <td>
                    <ul>
                      <li>Rapid deployment</li>
                      <li>Low infrastructure requirements</li>
                      <li>Automatic updates</li>
                      <li>Flexible scaling</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Cloud connectivity dependency</li>
                      <li>Less hardware control</li>
                    </ul>
                  </td>
                  <td>
                    Organizations with distributed locations, limited IT staffing, or need for rapid deployment
                  </td>
                </tr>
                <tr>
                  <td>On-Premises NAC<br>(e.g., Cisco ISE, Aruba)</td>
                  <td>
                    <ul>
                      <li>Complete control over infrastructure</li>
                      <li>Local processing</li>
                      <li>Potentially lower latency</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Higher implementation costs</li>
                      <li>Longer deployment times</li>
                      <li>Hardware refresh cycles</li>
                    </ul>
                  </td>
                  <td>
                    Organizations with strict data locality requirements, dedicated security teams, or specialized infrastructure needs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Update compliance options based on industry
   */
  _updateComplianceOptions() {
    const complianceSelector = document.getElementById('compliance-selector');
    if (!complianceSelector) {
      console.warn("Compliance selector not found");
      return;
    }
    
    // Reset selector
    complianceSelector.innerHTML = `
      <option value="none">Select framework...</option>
      <option value="hipaa">HIPAA</option>
      <option value="pci">PCI DSS</option>
      <option value="gdpr">GDPR</option>
      <option value="cmmc">CMMC 2.0</option>
    `;
    
    // Highlight relevant frameworks based on industry
    if (this.activeIndustry) {
      let relevantFrameworks = [];
      
      switch (this.activeIndustry) {
        case 'healthcare':
          relevantFrameworks = ['hipaa', 'gdpr'];
          break;
        case 'financial':
          relevantFrameworks = ['pci', 'gdpr'];
          break;
        case 'manufacturing':
          relevantFrameworks = ['cmmc', 'nist'];
          break;
        case 'retail':
          relevantFrameworks = ['pci', 'gdpr'];
          break;
        case 'education':
          relevantFrameworks = ['gdpr', 'ferpa'];
          break;
        case 'government':
          relevantFrameworks = ['cmmc', 'fisma'];
          break;
      }
      
      // Add recommended labels to relevant frameworks
      if (relevantFrameworks.length > 0) {
        for (const framework of relevantFrameworks) {
          const option = complianceSelector.querySelector(`option[value="${framework}"]`);
          if (option) {
            option.textContent += ' (Recommended)';
          }
        }
      }
    }
    
    // Reset compliance content
    this.setActiveCompliance('none');
  }
  
  /**
   * Update compliance content with detailed information
   */
  _updateComplianceContent() {
    const complianceContent = document.getElementById('compliance-content');
    if (!complianceContent) {
      console.warn("Compliance content container not found");
      return;
    }
    
    if (!this.activeCompliance || !window.nacDocumentation?.compliance?.[this.activeCompliance]) {
      complianceContent.classList.add('hidden');
      return;
    }
    
    const compliance = window.nacDocumentation.compliance[this.activeCompliance];
    
    // Create compliance content
    complianceContent.innerHTML = `
      <h3>${compliance.title}</h3>
      <p>${compliance.description}</p>
      
      <div class="result-card">
        <h4>Relevant Controls</h4>
        <ul class="controls-list">
          ${compliance.relevantControls.map(ctrl => `<li>${ctrl}</li>`).join('')}
        </ul>
      </div>
      
      <div class="result-card">
        <h4>NAC Implementation Impact</h4>
        <p>${compliance.nacImpact}</p>
        
        <div class="compliance-matrix">
          <h5>NAC Solution Compliance Matrix for ${compliance.title}</h5>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Requirement Area</th>
                  <th>On-Premises NAC</th>
                  <th>Cloud-Native NAC</th>
                  <th>Implementation Considerations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Access Controls</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Both solution types provide robust access control capabilities. Focus on policy granularity and enforcement mechanisms.</td>
                </tr>
                <tr>
                  <td>Audit Logging</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Ensure log retention policies meet compliance requirements. Cloud solutions typically include built-in log management.</td>
                </tr>
                <tr>
                  <td>Data Protection</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-exclamation-triangle"></i> Requires BAA/DPA</td>
                  <td>Cloud solutions require appropriate Business Associate Agreements or Data Processing Agreements.</td>
                </tr>
                <tr>
                  <td>Device Authentication</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Implement multi-factor authentication where applicable. Both solution types provide similar capabilities.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Show compliance content
    complianceContent.classList.remove('hidden');
  }
  
  /**
   * Populate security incidents section
   */
  _populateSecurityIncidents() {
    const incidentsContainer = document.getElementById('breach-incidents-container');
    if (!incidentsContainer) {
      console.warn("Breach incidents container not found");
      return;
    }
    
    if (!window.nacDocumentation?.securityIncidents) {
      incidentsContainer.innerHTML = `
        <div class="placeholder-message">
          <p>Security incident information not available.</p>
        </div>
      `;
      return;
    }
    
    const incidents = window.nacDocumentation.securityIncidents;
    let incidentsHTML = '';
    
    // Add network access incidents
    if (incidents.networkAccess && incidents.networkAccess.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Network Access Incidents</h4>
          <div class="incidents-list">
            ${incidents.networkAccess.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add lateral movement incidents
    if (incidents.lateralMovement && incidents.lateralMovement.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Lateral Movement Incidents</h4>
          <div class="incidents-list">
            ${incidents.lateralMovement.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add compliance incidents
    if (incidents.compliance && incidents.compliance.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Compliance-Related Incidents</h4>
          <div class="incidents-list">
            ${incidents.compliance.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add response incidents
    if (incidents.response && incidents.response.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Incident Response Challenges</h4>
          <div class="incidents-list">
            ${incidents.response.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    incidentsContainer.innerHTML = incidentsHTML;
    
    // Add CSS styles for incidents
    const style = document.createElement('style');
    style.textContent = `
      .incidents-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: var(--spacing-md);
      }
      
      .incident-item {
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-md);
        background-color: rgba(27, 103, 178, 0.05);
      }
      
      .incident-item h5 {
        color: var(--primary-color);
        margin-top: 0;
        margin-bottom: var(--spacing-sm);
      }
      
      .incident-item p {
        margin: var(--spacing-xs) 0;
        font-size: var(--font-size-sm);
      }
      
      .industry-compliance-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }
      
      .industry-selector-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
        flex-wrap: wrap;
      }
      
      .industry-selector-container label {
        margin-bottom: 0;
      }
      
      .industry-selector-container .form-select {
        width: auto;
      }
      
      .ml-1 {
        margin-left: var(--spacing-md);
      }
      
      .requirements-list li, .controls-list li {
        margin-bottom: var(--spacing-sm);
      }
      
      .compliance-matrix h5, .vendor-recommendations h5 {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
      }
      
      .placeholder-message {
        padding: var(--spacing-lg);
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--border-radius-md);
        text-align: center;
        color: var(--text-light);
      }
    `;
    
    if (!document.getElementById('industry-compliance-styles')) {
      style.id = 'industry-compliance-styles';
      document.head.appendChild(style);
    }
  }
}

// Initialize the industry and compliance tab manager
document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing industry and compliance tab manager");
  window.industryComplianceTabManager = new IndustryComplianceTabManager();
});
