/**
 * Ultimate Cost Configuration
 * Provides detailed dollar-value inputs and industry-specific defaults
 */
(function() {
  console.log('Installing Ultimate Cost Configuration...');
  
  // Industry-specific default costs
  const industryDefaults = {
    healthcare: {
      hardwareCost: 12000,
      licensingCost: 30000,
      maintenanceCost: 18000,
      implementationCost: 35000,
      downtimeCost: 7500,
      personnelCost: 120000
    },
    financial: {
      hardwareCost: 15000,
      licensingCost: 40000,
      maintenanceCost: 25000,
      implementationCost: 45000,
      downtimeCost: 9000,
      personnelCost: 135000
    },
    education: {
      hardwareCost: 8000,
      licensingCost: 22000,
      maintenanceCost: 12000,
      implementationCost: 25000,
      downtimeCost: 3500,
      personnelCost: 90000
    },
    government: {
      hardwareCost: 10000,
      licensingCost: 35000,
      maintenanceCost: 20000,
      implementationCost: 40000,
      downtimeCost: 6000,
      personnelCost: 110000
    },
    manufacturing: {
      hardwareCost: 14000,
      licensingCost: 28000,
      maintenanceCost: 16000,
      implementationCost: 32000,
      downtimeCost: 8000,
      personnelCost: 105000
    },
    default: {
      hardwareCost: 10000,
      licensingCost: 25000,
      maintenanceCost: 15000,
      implementationCost: 30000,
      downtimeCost: 5000,
      personnelCost: 100000
    }
  };
  
  // Vendor-specific default costs
  const vendorDefaults = {
    cisco: {
      solutionCost: 40000,
      implementationCost: 35000,
      trainingCost: 7500,
      fteCost: 1.2,
      discount: 0
    },
    aruba: {
      solutionCost: 38000,
      implementationCost: 32000,
      trainingCost: 7000,
      fteCost: 1.1,
      discount: 0
    },
    forescout: {
      solutionCost: 42000,
      implementationCost: 34000,
      trainingCost: 8000,
      fteCost: 1.2,
      discount: 0
    },
    nps: {
      solutionCost: 15000,
      implementationCost: 25000,
      trainingCost: 6000,
      fteCost: 0.9,
      discount: 0
    },
    fortinac: {
      solutionCost: 36000,
      implementationCost: 30000,
      trainingCost: 7000,
      fteCost: 1.0,
      discount: 0
    },
    securew2: {
      solutionCost: 28000,
      implementationCost: 20000,
      trainingCost: 5000,
      fteCost: 0.8,
      discount: 0
    },
    portnox: {
      solutionCost: 20000,
      implementationCost: 15000,
      trainingCost: 3500,
      fteCost: 0.5,
      discount: 25
    }
  };
  
  // Detailed cost descriptions
  const costDescriptions = {
    hardwareCost: {
      title: "Hardware Costs",
      description: "Base cost for servers, appliances, and network equipment needed to run NAC.",
      details: "On-premises NAC solutions typically require dedicated hardware appliances and servers. Cloud solutions eliminate most hardware requirements.",
      impactScale: "High for on-prem, Low for cloud",
      examples: [
        "Cisco ISE: Dedicated appliances at each major network site",
        "Aruba ClearPass: Physical or virtual appliances",
        "Portnox Cloud: No hardware required except for optional on-prem connectors"
      ]
    },
    licensingCost: {
      title: "Licensing Costs",
      description: "Annual licensing fees per device, user, or capacity tier.",
      details: "Traditional NAC has perpetual licenses plus maintenance, while cloud solutions use subscription model.",
      impactScale: "High",
      examples: [
        "Per-device licensing: $20-50 per device annually",
        "Per-user licensing: $5-15 per user monthly",
        "Enterprise tiers based on total device count"
      ]
    },
    maintenanceCost: {
      title: "Maintenance Costs",
      description: "Annual costs for support, updates, and routine maintenance.",
      details: "On-premises solutions require dedicated IT staff time for patching, updates, and troubleshooting. Cloud solutions include maintenance in subscription fee.",
      impactScale: "Medium-High for on-prem, Low for cloud",
      examples: [
        "Support contracts: 15-25% of initial license cost annually",
        "System updates and patches: IT staff time",
        "Hardware replacement/upgrades: Every 3-5 years"
      ]
    },
    implementationCost: {
      title: "Implementation Costs",
      description: "One-time costs for installation, configuration, and deployment.",
      details: "Traditional NAC deployments often require professional services and can take months. Cloud solutions have simpler deployment models.",
      impactScale: "High for initial deployment",
      examples: [
        "Professional services: $150-250/hour",
        "Project timeline: 30-120 days depending on complexity",
        "Implementation costs typically 1-2x licensing costs for on-prem solutions"
      ]
    },
    personnelCost: {
      title: "Personnel Costs",
      description: "Annual cost for IT staff to manage and maintain NAC solution.",
      details: "On-premises solutions require dedicated personnel for daily operations, while cloud solutions reduce this burden significantly.",
      impactScale: "Very High for on-prem, Low-Medium for cloud",
      examples: [
        "Dedicated NAC administrator: 0.5-2 FTEs depending on organization size",
        "Average FTE cost: $80,000-120,000 annually plus benefits",
        "Cloud solutions typically reduce personnel requirements by 50-70%"
      ]
    },
    downtimeCost: {
      title: "Downtime Cost ($/hour)",
      description: "Cost impact per hour when NAC system is unavailable.",
      details: "Includes lost productivity, potential security incidents, and business impact during outages.",
      impactScale: "High for critical environments",
      examples: [
        "Healthcare: $5,000-15,000/hour",
        "Financial services: $7,500-25,000/hour",
        "Manufacturing: $5,000-10,000/hour",
        "Education: $2,500-5,000/hour"
      ]
    }
  };
  
  // Add styles for enhanced cost configuration
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Cost Configuration Modal Styling */
      .modal-container {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }
      
      .modal-container.visible {
        display: flex;
      }
      
      .cost-analysis-modal {
        background: white;
        width: 90%;
        max-width: 1200px;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .cost-modal-header {
        background: #1B67B2;
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      
      .cost-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      .cost-modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }
      
      .cost-modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(90vh - 136px);
      }
      
      .cost-modal-footer {
        padding: 15px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #ddd;
      }
      
      .wizard-container {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      
      .wizard-steps {
        display: flex;
        margin-bottom: 20px;
      }
      
      .wizard-step {
        flex: 1;
        padding: 15px;
        text-align: center;
        background: #f8f9fa;
        border-bottom: 3px solid #ddd;
        position: relative;
        cursor: pointer;
      }
      
      .wizard-step.active {
        border-bottom-color: #2BD25B;
      }
      
      .wizard-step.completed {
        border-bottom-color: #1B67B2;
      }
      
      .wizard-step-number {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ddd;
        color: #505050;
        margin-right: 10px;
      }
      
      .wizard-step.active .wizard-step-number {
        background: #2BD25B;
        color: white;
      }
      
      .wizard-step.completed .wizard-step-number {
        background: #1B67B2;
        color: white;
      }
      
      .wizard-step-title {
        font-weight: 600;
      }
      
      .wizard-content {
        flex: 1;
        padding: 20px 0;
      }
      
      .wizard-panel {
        display: none;
      }
      
      .wizard-panel.active {
        display: block;
      }
      
      .template-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }
      
      .template-button {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      
      .template-button:hover {
        background: #e9ecef;
      }
      
      .template-button.active {
        background: #1B67B2;
        color: white;
        border-color: #1B67B2;
      }
      
      .vendor-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .vendor-card {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .vendor-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .vendor-card.selected {
        border-color: #2BD25B;
        background-color: rgba(43, 210, 91, 0.05);
      }
      
      .vendor-card img {
        max-width: 100%;
        height: 40px;
        object-fit: contain;
        margin-bottom: 10px;
      }
      
      .vendor-card span {
        display: block;
        font-weight: 500;
      }
      
      .cost-config-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .cost-config-item {
        margin-bottom: 10px;
      }
      
      .cost-config-item label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .cost-config-item input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .cost-config-item input:focus {
        border-color: #1B67B2;
        outline: none;
        box-shadow: 0 0 0 2px rgba(27, 103, 178, 0.2);
      }
      
      .cost-help {
        font-size: 12px;
        color: #707070;
        margin-top: 5px;
        margin-bottom: 0;
      }
      
      .cost-details-toggle {
        background: none;
        border: none;
        color: #1B67B2;
        cursor: pointer;
        font-size: 12px;
        padding: 0;
        margin-top: 5px;
        display: block;
        text-align: left;
      }
      
      .cost-details {
        display: none;
        background: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
        font-size: 12px;
      }
      
      .cost-details.visible {
        display: block;
        animation: fadeIn 0.3s ease-out;
      }
      
      .cost-impact {
        font-weight: 600;
        margin-top: 5px;
        color: #303030;
      }
      
      .cost-examples {
        margin-top: 10px;
        padding-left: 15px;
      }
      
      .cost-examples li {
        margin-bottom: 3px;
      }
      
      .compliance-selection {
        margin-top: 20px;
      }
      
      .compliance-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
      }
      
      .compliance-option {
        flex: 1;
        min-width: 200px;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .compliance-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .compliance-option.selected {
        border-color: #2BD25B;
        background-color: rgba(43, 210, 91, 0.05);
      }
      
      .compliance-option h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #1B67B2;
      }
      
      .compliance-option p {
        color: #505050;
        font-size: 0.9rem;
        margin-bottom: 10px;
      }
      
      .compliance-option ul {
        padding-left: 15px;
        margin-bottom: 0;
        color: #505050;
      }
      
      .sensitivity-controls {
        margin-top: 20px;
      }
      
      .sensitivity-sliders {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 15px;
      }
      
      .sensitivity-slider {
        margin-bottom: 15px;
      }
      
      .sensitivity-slider label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .sensitivity-slider .slider-container {
        position: relative;
      }
      
      .sensitivity-slider input[type="range"] {
        width: 100%;
        margin: 0;
      }
      
      .sensitivity-slider .slider-values {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #707070;
        margin-top: 5px;
      }
      
      .sensitivity-slider .slider-value {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: #1B67B2;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
      }
      
      .sensitivity-info {
        background: #f8f9fa;
        border-left: 4px solid #1B67B2;
        padding: 15px;
        margin-top: 20px;
        font-size: 0.9rem;
      }
      
      .results-preview {
        margin-top: 30px;
      }
      
      .results-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 15px;
      }
      
      .results-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
        padding: 20px;
        transition: all 0.3s ease;
      }
      
      .results-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 14px rgba(0,0,0,0.1);
      }
      
      .results-card h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1B67B2;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        padding-bottom: 10px;
      }
      
      .results-metric {
        margin-bottom: 15px;
      }
      
      .results-metric .metric-label {
        font-size: 0.9rem;
        color: #505050;
        margin-bottom: 3px;
      }
      
      .results-metric .metric-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2BD25B;
      }
      
      .results-metric .metric-comparison {
        font-size: 0.8rem;
        color: #707070;
      }
      
      .discount-badge {
        background: #2BD25B;
        color: white;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 600;
      }
      
      .audience-selection {
        margin-top: 20px;
      }
      
      .audience-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
      }
      
      .audience-option {
        flex: 1;
        min-width: 150px;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .audience-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .audience-option.selected {
        border-color: #2BD25B;
        background-color: rgba(43, 210, 91, 0.05);
      }
      
      .audience-option i {
        font-size: 2rem;
        color: #1B67B2;
        margin-bottom: 10px;
      }
      
      .audience-option h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #1B67B2;
      }
      
      .audience-option p {
        color: #505050;
        font-size: 0.9rem;
        margin-bottom: 0;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Create the cost analysis modal and button
  function createCostAnalyzerModal() {
    // Create cost analyzer button in header
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const costAnalyzerBtn = document.createElement('button');
    costAnalyzerBtn.id = 'cost-analyzer-btn';
    costAnalyzerBtn.className = 'btn btn-primary';
    costAnalyzerBtn.innerHTML = '<i class="fas fa-dollar-sign"></i> Cost Analysis Wizard';
    
    // Insert before the last button
    headerActions.insertBefore(costAnalyzerBtn, headerActions.lastElementChild);
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.id = 'cost-analysis-modal-container';
    
    modalContainer.innerHTML = `
      <div class="cost-analysis-modal">
        <div class="cost-modal-header">
          <h2><i class="fas fa-dollar-sign"></i> Advanced Cost Analysis Wizard</h2>
          <button type="button" class="cost-modal-close">&times;</button>
        </div>
        <div class="cost-modal-body">
          <div class="wizard-container">
            <div class="wizard-steps">
              <div class="wizard-step active" data-step="1">
                <span class="wizard-step-number">1</span>
                <span class="wizard-step-title">Industry Selection</span>
              </div>
              <div class="wizard-step" data-step="2">
                <span class="wizard-step-number">2</span>
                <span class="wizard-step-title">Vendor Selection</span>
              </div>
              <div class="wizard-step" data-step="3">
                <span class="wizard-step-number">3</span>
                <span class="wizard-step-title">Compliance Requirements</span>
              </div>
              <div class="wizard-step" data-step="4">
                <span class="wizard-step-number">4</span>
                <span class="wizard-step-title">Cost Configuration</span>
              </div>
              <div class="wizard-step" data-step="5">
                <span class="wizard-step-number">5</span>
                <span class="wizard-step-title">Sensitivity Analysis</span>
              </div>
              <div class="wizard-step" data-step="6">
                <span class="wizard-step-number">6</span>
                <span class="wizard-step-title">Results Preview</span>
              </div>
            </div>
            
            <div class="wizard-content">
              <!-- Step 1: Industry Selection -->
              <div class="wizard-panel active" data-step="1">
                <h3>Select Your Industry</h3>
                <p>Choose your industry to apply optimized cost parameters and compliance requirements.</p>
                
                <div class="template-buttons">
                  <button class="template-button" data-template="default">General Enterprise</button>
                  <button class="template-button" data-template="healthcare">Healthcare</button>
                  <button class="template-button" data-template="financial">Financial Services</button>
                  <button class="template-button" data-template="education">Education</button>
                  <button class="template-button" data-template="government">Government</button>
                  <button class="template-button" data-template="manufacturing">Manufacturing</button>
                  <button class="template-button" data-template="retail">Retail</button>
                </div>
                
                <div class="industry-details">
                  <h4>Industry-Specific Considerations</h4>
                  <p id="industry-description">Select an industry to see specific information.</p>
                  
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">Average TCO</div>
                      <div class="metric-value" id="industry-tco">$0</div>
                      <div class="metric-description">Typical 3-year TCO for on-premises NAC</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">Implementation</div>
                      <div class="metric-value" id="industry-implementation">0 days</div>
                      <div class="metric-description">Average on-premises deployment time</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">IT Resources</div>
                      <div class="metric-value" id="industry-fte">0 FTE</div>
                      <div class="metric-description">Required personnel for maintenance</div>
                    </div>
                    
                    <div class="metric-card">
                      <div class="metric-label">Cloud Savings</div>
                      <div class="metric-value" id="industry-savings">0%</div>
                      <div class="metric-description">Average TCO reduction with cloud</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 2: Vendor Selection -->
              <div class="wizard-panel" data-step="2">
                <h3>Select NAC Vendors to Compare</h3>
                <p>Choose your current or preferred NAC vendor to compare with Portnox Cloud.</p>
                
                <div class="vendor-cards">
                  <div class="vendor-card" data-vendor="cisco">
                    <img src="img/cisco-logo.png" alt="Cisco Logo">
                    <span>Cisco ISE</span>
                  </div>
                  <div class="vendor-card" data-vendor="aruba">
                    <img src="img/aruba-logo.png" alt="Aruba Logo">
                    <span>Aruba ClearPass</span>
                  </div>
                  <div class="vendor-card" data-vendor="forescout">
                    <img src="img/forescout-logo.png" alt="Forescout Logo">
                    <span>Forescout</span>
                  </div>
                  <div class="vendor-card" data-vendor="nps">
                    <img src="img/microsoft-logo.png" alt="Microsoft Logo">
                    <span>Microsoft NPS</span>
                  </div>
                  <div class="vendor-card" data-vendor="fortinac">
                    <img src="img/fortinac-logo.png" alt="FortiNAC Logo">
                    <span>FortiNAC</span>
                  </div>
                  <div class="vendor-card" data-vendor="securew2">
                    <img src="img/securew2-logo.png" alt="SecureW2 Logo">
                    <span>SecureW2</span>
                  </div>
                </div>
                
                <h4>Selected Vendor Details</h4>
                <div id="vendor-details">
                  <p>Select a vendor to see detailed information.</p>
                </div>
                
                <div class="checkbox-option">
                  <input type="checkbox" id="compare-all-vendors">
                  <label for="compare-all-vendors">Include all vendors in comparison</label>
                </div>
              </div>
              
              <!-- Step 3: Compliance Requirements -->
              <div class="wizard-panel" data-step="3">
                <h3>Compliance Requirements</h3>
                <p>Select the compliance regulations that apply to your organization.</p>
                
                <div class="compliance-selection">
                  <div class="compliance-options" id="compliance-options">
                    <!-- Will be populated dynamically based on industry selection -->
                  </div>
                </div>
                
                <div id="compliance-details">
                  <p>Select compliance requirements to see how they impact NAC implementation.</p>
                </div>
              </div>
              
              <!-- Step 4: Cost Configuration -->
              <div class="wizard-panel" data-step="4">
                <h3>Advanced Cost Configuration</h3>
                <p>Customize detailed cost parameters to tailor the analysis to your organization's specific needs.</p>
                
                <div class="cost-config-section">
                  <h4>Organization Costs</h4>
                  
                  <div class="cost-config-grid">
                    <div class="cost-config-item">
                      <label for="cost-hardware">Hardware Costs ($)</label>
                      <input type="number" id="cost-hardware" min="0" step="1000" value="10000">
                      <p class="cost-help">Base hardware cost for on-premises deployment</p>
                      <button type="button" class="cost-details-toggle" data-cost="hardwareCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-hardwareCost">
                        <p>${costDescriptions.hardwareCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.hardwareCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.hardwareCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="cost-licensing">Licensing Costs ($)</label>
                      <input type="number" id="cost-licensing" min="0" step="1000" value="25000">
                      <p class="cost-help">Annual licensing fees per vendor</p>
                      <button type="button" class="cost-details-toggle" data-cost="licensingCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-licensingCost">
                        <p>${costDescriptions.licensingCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.licensingCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.licensingCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="cost-maintenance">Maintenance Costs ($)</label>
                      <input type="number" id="cost-maintenance" min="0" step="1000" value="15000">
                      <p class="cost-help">Annual maintenance and support costs</p>
                      <button type="button" class="cost-details-toggle" data-cost="maintenanceCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-maintenanceCost">
                        <p>${costDescriptions.maintenanceCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.maintenanceCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.maintenanceCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="cost-implementation">Implementation ($)</label>
                      <input type="number" id="cost-implementation" min="0" step="5000" value="30000">
                      <p class="cost-help">Base implementation and professional services costs</p>
                      <button type="button" class="cost-details-toggle" data-cost="implementationCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-implementationCost">
                        <p>${costDescriptions.implementationCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.implementationCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.implementationCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="cost-personnel">Personnel Costs ($)</label>
                      <input type="number" id="cost-personnel" min="0" step="10000" value="100000">
                      <p class="cost-help">Annual cost per full-time equivalent (FTE)</p>
                      <button type="button" class="cost-details-toggle" data-cost="personnelCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-personnelCost">
                        <p>${costDescriptions.personnelCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.personnelCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.personnelCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="cost-downtime">Downtime Cost ($/hour)</label>
                      <input type="number" id="cost-downtime" min="0" step="1000" value="5000">
                      <p class="cost-help">Cost per hour of system downtime</p>
                      <button type="button" class="cost-details-toggle" data-cost="downtimeCost">
                        <i class="fas fa-info-circle"></i> Show more details
                      </button>
                      <div class="cost-details" id="details-downtimeCost">
                        <p>${costDescriptions.downtimeCost.details}</p>
                        <div class="cost-impact">Impact: ${costDescriptions.downtimeCost.impactScale}</div>
                        <ul class="cost-examples">
                          ${costDescriptions.downtimeCost.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <h4 style="margin-top: 20px;">Vendor-Specific Adjustments</h4>
                  
                  <div class="cost-config-grid">
                    <div class="cost-config-item">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <label for="portnox-discount">Portnox Discount (%)</label>
                        <span class="discount-badge">Recommended</span>
                      </div>
                      
                      <div class="slider-container">
                        <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25">
                        <div class="slider-value">
                          <span id="portnox-discount-value">25%</span>
                        </div>
                        <div class="slider-labels">
                          <span>0%</span>
                          <span>40%</span>
                        </div>
                      </div>
                      <p class="cost-help">Apply volume or promotional discount to Portnox subscription</p>
                    </div>
                    
                    <div class="cost-config-item">
                      <label for="competitor-discount">Competitor Discount (%)</label>
                      
                      <div class="slider-container">
                        <input type="range" id="competitor-discount" min="0" max="25" step="5" value="0">
                        <div class="slider-value">
                          <span id="competitor-discount-value">0%</span>
                        </div>
                        <div class="slider-labels">
                          <span>0%</span>
                          <span>25%</span>
                        </div>
                      </div>
                      <p class="cost-help">Apply potential discount to competitor solutions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 5: Sensitivity Analysis -->
              <div class="wizard-panel" data-step="5">
                <h3>Sensitivity Analysis</h3>
                <p>Adjust key parameters to see how changes impact the overall ROI and TCO results.</p>
                
                <div class="sensitivity-controls">
                  <div class="sensitivity-sliders">
                    <div class="sensitivity-slider">
                      <label for="devices-slider">Number of Devices</label>
                      <div class="slider-container">
                        <input type="range" id="devices-slider" min="100" max="10000" step="100" value="1000">
                        <div class="slider-value" id="devices-value">1,000 devices</div>
                      </div>
                      <div class="slider-values">
                        <span>100</span>
                        <span>10,000</span>
                      </div>
                    </div>
                    
                    <div class="sensitivity-slider">
                      <label for="locations-slider">Number of Locations</label>
                      <div class="slider-container">
                        <input type="range" id="locations-slider" min="1" max="50" step="1" value="3">
                        <div class="slider-value" id="locations-value">3 locations</div>
                      </div>
                      <div class="slider-values">
                        <span>1</span>
                        <span>50</span>
                      </div>
                    </div>
                    
                    <div class="sensitivity-slider">
                      <label for="implementation-slider">Implementation Complexity</label>
                      <div class="slider-container">
                        <input type="range" id="implementation-slider" min="1" max="5" step="1" value="3">
                        <div class="slider-value" id="implementation-value">Medium (3/5)</div>
                      </div>
                      <div class="slider-values">
                        <span>Simple</span>
                        <span>Complex</span>
                      </div>
                    </div>
                    
                    <div class="sensitivity-slider">
                      <label for="staff-slider">IT Staff Cost ($/yr)</label>
                      <div class="slider-container">
                        <input type="range" id="staff-slider" min="50000" max="200000" step="10000" value="100000">
                        <div class="slider-value" id="staff-value">$100,000</div>
                      </div>
                      <div class="slider-values">
                        <span>$50K</span>
                        <span>$200K</span>
                      </div>
                    </div>
                    
                    <div class="sensitivity-slider">
                      <label for="years-slider">Projection Years</label>
                      <div class="slider-container">
                        <input type="range" id="years-slider" min="1" max="7" step="1" value="3">
                        <div class="slider-value" id="years-value">3 years</div>
                      </div>
                      <div class="slider-values">
                        <span>1</span>
                        <span>7</span>
                      </div>
                    </div>
                    
                    <div class="sensitivity-slider">
                      <label for="compliance-slider">Compliance Complexity</label>
                      <div class="slider-container">
                        <input type="range" id="compliance-slider" min="1" max="5" step="1" value="3">
                        <div class="slider-value" id="compliance-value">Medium (3/5)</div>
                      </div>
                      <div class="slider-values">
                        <span>Basic</span>
                        <span>Stringent</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="sensitivity-info">
                    <p><strong>How Sensitivity Analysis Works:</strong> Each parameter adjustment recalculates the TCO and ROI based on industry models. Higher device counts and locations increase hardware costs for on-premises solutions exponentially, while cloud solutions scale more efficiently. Implementation complexity significantly impacts professional services costs and project timelines. Compliance requirements add overhead to both solutions but impact on-premises deployments more heavily.</p>
                  </div>
                  
                  <div class="sensitivity-impact">
                    <h4>Sensitivity Impact Preview</h4>
                    <div id="sensitivity-impact-chart" class="chart-container" style="height: 300px;">
                      <canvas id="sensitivity-chart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Step 6: Results Preview -->
              <div class="wizard-panel" data-step="6">
                <h3>Results Preview</h3>
                <p>Review your customized analysis results before applying them to the main calculator.</p>
                
                <div class="results-preview">
                  <div class="results-cards">
                    <div class="results-card">
                      <h4>TCO Analysis</h4>
                      <div class="results-metric">
                        <div class="metric-label">3-Year TCO Savings</div>
                        <div class="metric-value" id="preview-tco-savings">$120,000</div>
                        <div class="metric-comparison">vs. on-premises solution</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">Percentage Savings</div>
                        <div class="metric-value" id="preview-percentage-savings">35%</div>
                        <div class="metric-comparison">reduction in total cost</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">ROI Timeline</div>
                        <div class="metric-value" id="preview-roi-timeline">9 months</div>
                        <div class="metric-comparison">to positive return</div>
                      </div>
                    </div>
                    
                    <div class="results-card">
                      <h4>Implementation Impact</h4>
                      <div class="results-metric">
                        <div class="metric-label">Deployment Time</div>
                        <div class="metric-value" id="preview-deployment-time">80% faster</div>
                        <div class="metric-comparison">10 days vs. 90 days</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">IT Resource Reduction</div>
                        <div class="metric-value" id="preview-resource-reduction">70%</div>
                        <div class="metric-comparison">0.5 FTE vs. 1.7 FTE</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">Hardware Elimination</div>
                        <div class="metric-value" id="preview-hardware-savings">100%</div>
                        <div class="metric-comparison">zero hardware footprint</div>
                      </div>
                    </div>
                    
                    <div class="results-card">
                      <h4>Compliance & Management</h4>
                      <div class="results-metric">
                        <div class="metric-label">Compliance Integration</div>
                        <div class="metric-value" id="preview-compliance-rating">Excellent</div>
                        <div class="metric-comparison">built-in frameworks</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">Maintenance Overhead</div>
                        <div class="metric-value" id="preview-maintenance-savings">90%</div>
                        <div class="metric-comparison">reduction in maintenance time</div>
                      </div>
                      <div class="results-metric">
                        <div class="metric-label">Multi-Site Management</div>
                        <div class="metric-value" id="preview-multisite">Centralized</div>
                        <div class="metric-comparison">vs. distributed appliances</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="audience-selection">
                    <h4>Select Intended Audience</h4>
                    <p>Choose which audience view you'd like to apply this analysis to.</p>
                    
                    <div class="audience-options">
                      <div class="audience-option" data-audience="executive">
                        <i class="fas fa-chart-pie"></i>
                        <h4>Executive</h4>
                        <p>High-level overview with strategic recommendations</p>
                      </div>
                      <div class="audience-option" data-audience="financial">
                        <i class="fas fa-dollar-sign"></i>
                        <h4>Financial</h4>
                        <p>Detailed cost analysis and ROI projections</p>
                      </div>
                      <div class="audience-option" data-audience="technical">
                        <i class="fas fa-tools"></i>
                        <h4>Technical</h4>
                        <p>Implementation details and technical requirements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cost-modal-footer">
          <button id="wizard-prev-btn" class="btn btn-outline">Previous</button>
          <button id="wizard-next-btn" class="btn btn-primary">Next</button>
          <button id="wizard-apply-btn" class="btn btn-success" style="display: none;">Apply Analysis</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Set up event listeners for the modal
    setupModalEventListeners();
  }
  
  // Setup event listeners for the modal
  function setupModalEventListeners() {
    // Modal open/close
    const modalBtn = document.getElementById('cost-analyzer-btn');
    const modalContainer = document.getElementById('cost-analysis-modal-container');
    const closeBtn = document.querySelector('.cost-modal-close');
    
    if (modalBtn && modalContainer) {
      modalBtn.addEventListener('click', () => {
        modalContainer.classList.add('visible');
      });
    }
    
    if (closeBtn && modalContainer) {
      closeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
      });
    }
    
    // Click outside to close
    if (modalContainer) {
      modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
          modalContainer.classList.remove('visible');
        }
      });
    }
    
    // Wizard navigation
    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const applyBtn = document.getElementById('wizard-apply-btn');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    
    let currentStep = 1;
    const totalSteps = wizardSteps.length;
    
    if (prevBtn && nextBtn && applyBtn) {
      // Initialize Previous button visibility
      prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
      
      // Next button click handler
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          // Hide current panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
          
          // Update step indicator
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('completed');
          
          // Increment step
          currentStep++;
          
          // Show new panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
          
          // Update button visibility
          prevBtn.style.display = 'block';
          
          if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            applyBtn.style.display = 'block';
          }
        }
      });
      
      // Previous button click handler
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          // Hide current panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
          
          // Update step indicator
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
          
          // Decrement step
          currentStep--;
          
          // Show new panel
          document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
          document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('completed');
          
          // Update button visibility
          nextBtn.style.display = 'block';
          applyBtn.style.display = 'none';
          
          if (currentStep === 1) {
            prevBtn.style.display = 'none';
          }
        }
      });
      
      // Step click navigation
      wizardSteps.forEach(step => {
        step.addEventListener('click', () => {
          const stepNum = parseInt(step.getAttribute('data-step'));
          
          // Only allow navigating to completed steps or the next step
          if (stepNum < currentStep || stepNum === currentStep || stepNum === currentStep + 1) {
            // Hide current panel
            document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.remove('active');
            document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
            
            if (stepNum < currentStep) {
              document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('completed');
            } else if (stepNum > currentStep) {
              document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('completed');
            }
            
            // Update current step
            currentStep = stepNum;
            
            // Show new panel
            document.querySelector(`.wizard-panel[data-step="${currentStep}"]`).classList.add('active');
            document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.add('active');
            
            // Update button visibility
            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            
            if (currentStep === totalSteps) {
              nextBtn.style.display = 'none';
              applyBtn.style.display = 'block';
            } else {
              nextBtn.style.display = 'block';
              applyBtn.style.display = 'none';
            }
          }
        });
      });
    }
    
    // Industry template buttons
    const templateButtons = document.querySelectorAll('.template-button');
    
    if (templateButtons) {
      templateButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          templateButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Apply template
          const template = button.getAttribute('data-template');
          applyIndustryTemplate(template);
        });
      });
    }
    
    // Vendor card selection
    const vendorCards = document.querySelectorAll('.vendor-card');
    
    if (vendorCards) {
      vendorCards.forEach(card => {
        card.addEventListener('click', () => {
          // Toggle selected class
          card.classList.toggle('selected');
          
          // Update vendor details
          updateVendorDetails();
        });
      });
    }
    
    // Cost details toggles
    const detailToggles = document.querySelectorAll('.cost-details-toggle');
    
    if (detailToggles) {
      detailToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          const costType = toggle.getAttribute('data-cost');
          const detailsElement = document.getElementById(`details-${costType}`);
          
          if (detailsElement) {
            detailsElement.classList.toggle('visible');
            
            if (detailsElement.classList.contains('visible')) {
              toggle.innerHTML = '<i class="fas fa-info-circle"></i> Hide details';
            } else {
              toggle.innerHTML = '<i class="fas fa-info-circle"></i> Show more details';
            }
          }
        });
      });
    }
    
    // Slider updates
    const portnoxSlider = document.getElementById('portnox-discount');
    const portnoxValue = document.getElementById('portnox-discount-value');
    
    if (portnoxSlider && portnoxValue) {
      portnoxSlider.addEventListener('input', function() {
        portnoxValue.textContent = this.value + '%';
      });
    }
    
    const competitorSlider = document.getElementById('competitor-discount');
    const competitorValue = document.getElementById('competitor-discount-value');
    
    if (competitorSlider && competitorValue) {
      competitorSlider.addEventListener('input', function() {
        competitorValue.textContent = this.value + '%';
      });
    }
    
    // Sensitivity analysis sliders
    setupSensitivitySliders();
    
    // Audience selection
    const audienceOptions = document.querySelectorAll('.audience-option');
    
    if (audienceOptions) {
      audienceOptions.forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          audienceOptions.forEach(opt => opt.classList.remove('selected'));
          
          // Add selected class to clicked option
          option.classList.add('selected');
        });
      });
    }
    
    // Apply button handler
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applyConfiguration();
        
        // Close modal
        modalContainer.classList.remove('visible');
      });
    }
  }
  
  // Apply industry template
  function applyIndustryTemplate(template) {
    const defaults = industryDefaults[template] || industryDefaults.default;
    
    // Update form inputs
    document.getElementById('cost-hardware').value = defaults.hardwareCost;
    document.getElementById('cost-licensing').value = defaults.licensingCost;
    document.getElementById('cost-maintenance').value = defaults.maintenanceCost;
    document.getElementById('cost-implementation').value = defaults.implementationCost;
    document.getElementById('cost-personnel').value = defaults.personnelCost;
    document.getElementById('cost-downtime').value = defaults.downtimeCost;
    
    // Update industry description and metrics
    const industryDescriptions = {
      healthcare: "Healthcare organizations face unique challenges in securing sensitive patient data while providing flexible access for clinical workflows across diverse device types.",
      financial: "Financial institutions must balance robust security with frictionless customer and employee experiences while meeting stringent regulatory requirements.",
      education: "Educational institutions face unique security challenges with diverse user populations, high device turnover, and open campus networks.",
      government: "Government agencies require robust security controls with strict compliance requirements while supporting both modern and legacy systems.",
      manufacturing: "Manufacturing environments must secure both IT and OT (Operational Technology) networks with zero tolerance for production disruption.",
      retail: "Retail organizations face unique security challenges with distributed store locations, seasonal workforce, and PCI compliance requirements.",
      default: "Enterprise organizations require secure network access control that balances security with usability while managing diverse device types and user access requirements."
    };
    
    const industryMetrics = {
      healthcare: { tco: 3500000, days: 90, fte: 2.5, savings: 38 },
      financial: { tco: 4200000, days: 120, fte: 2.8, savings: 35 },
      education: { tco: 2500000, days: 75, fte: 1.8, savings: 40 },
      government: { tco: 4800000, days: 150, fte: 3.0, savings: 32 },
      manufacturing: { tco: 3100000, days: 95, fte: 2.2, savings: 36 },
      retail: { tco: 2900000, days: 85, fte: 2.0, savings: 38 },
      default: { tco: 3000000, days: 80, fte: 2.0, savings: 35 }
    };
    
    document.getElementById('industry-description').textContent = industryDescriptions[template] || industryDescriptions.default;
    
    const metrics = industryMetrics[template] || industryMetrics.default;
    document.getElementById('industry-tco').textContent = `$${metrics.tco.toLocaleString()}`;
    document.getElementById('industry-implementation').textContent = `${metrics.days} days`;
    document.getElementById('industry-fte').textContent = `${metrics.fte} FTE`;
    document.getElementById('industry-savings').textContent = `${metrics.savings}%`;
    
    // Update compliance options based on industry
    updateComplianceOptions(template);
    
    // Trigger calculation update if calculator exists
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      window.calculator.calculate();
    }
  }
  
  // Update vendor details
  function updateVendorDetails() {
    const selectedVendors = document.querySelectorAll('.vendor-card.selected');
    const vendorDetailsContainer = document.getElementById('vendor-details');
    
    if (!vendorDetailsContainer) return;
    
    if (selectedVendors.length === 0) {
      vendorDetailsContainer.innerHTML = `<p>Select a vendor to see detailed information.</p>`;
      return;
    }
    
    if (selectedVendors.length === 1) {
      const vendorId = selectedVendors[0].getAttribute('data-vendor');
      const vendorData = vendorDefaults[vendorId] || {};
      const vendorName = selectedVendors[0].querySelector('span').textContent;
      
      vendorDetailsContainer.innerHTML = `
        <div class="vendor-detail-card">
          <h4>${vendorName}</h4>
          <div class="vendor-metrics">
            <div class="vendor-metric">
              <div class="metric-label">Solution Cost:</div>
              <div class="metric-value">$${vendorData.solutionCost?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="vendor-metric">
              <div class="metric-label">Implementation:</div>
              <div class="metric-value">$${vendorData.implementationCost?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="vendor-metric">
              <div class="metric-label">Training:</div>
              <div class="metric-value">$${vendorData.trainingCost?.toLocaleString() || 'N/A'}</div>
            </div>
            <div class="vendor-metric">
              <div class="metric-label">IT Resources:</div>
              <div class="metric-value">${vendorData.fteCost || 'N/A'} FTE</div>
            </div>
          </div>
          ${getVendorSpecificDetails(vendorId)}
        </div>
      `;
    } else {
      vendorDetailsContainer.innerHTML = `
        <div class="vendor-multi-select">
          <h4>${selectedVendors.length} vendors selected for comparison</h4>
          <ul>
            ${Array.from(selectedVendors).map(vendor => 
              `<li>${vendor.querySelector('span').textContent}</li>`
            ).join('')}
          </ul>
          <p>All selected vendors will be included in the TCO comparison.</p>
        </div>
      `;
    }
  }
  
  // Get vendor-specific details
  function getVendorSpecificDetails(vendorId) {
    const vendorDetails = {
      cisco: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> On-premises appliances with distributed deployment model.</p>
          <p><strong>Typical Deployment Time:</strong> 90-120 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Complex implementation requiring specialized expertise, hardware at each site, significant maintenance overhead.</p>
        </div>
      `,
      aruba: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> On-premises virtual or physical appliances.</p>
          <p><strong>Typical Deployment Time:</strong> 60-90 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Strong multi-vendor support, complex setup process, requires ongoing maintenance and updates.</p>
        </div>
      `,
      forescout: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> On-premises appliances with agentless approach.</p>
          <p><strong>Typical Deployment Time:</strong> 60-120 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Strong visibility capabilities, hardware-intensive deployment, complex integration with security systems.</p>
        </div>
      `,
      nps: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> Windows Server role with limited NAC capabilities.</p>
          <p><strong>Typical Deployment Time:</strong> 30-60 days for basic implementation.</p>
          <p><strong>Key Considerations:</strong> Limited feature set, requires significant customization, integrated with Microsoft ecosystem.</p>
        </div>
      `,
      fortinac: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> On-premises appliances integrated with Fortinet ecosystem.</p>
          <p><strong>Typical Deployment Time:</strong> 60-90 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Strong integration with Fortinet products, hardware-based deployment, complex setup.</p>
        </div>
      `,
      securew2: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> Cloud-based with focus on certificate management.</p>
          <p><strong>Typical Deployment Time:</strong> 30-60 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Certificate-focused approach, limited full NAC capabilities, integrates with existing RADIUS.</p>
        </div>
      `,
      portnox: `
        <div class="vendor-specific-details">
          <p><strong>Architecture:</strong> True cloud-native with zero hardware footprint.</p>
          <p><strong>Typical Deployment Time:</strong> 10-15 days for full implementation.</p>
          <p><strong>Key Considerations:</strong> Rapid deployment, no hardware required, automatic updates, subscription-based pricing model.</p>
          <p><strong>Special:</strong> <span class="discount-badge">25% Discount Available</span></p>
        </div>
      `
    };
    
    return vendorDetails[vendorId] || '';
  }
  
  // Update compliance options based on industry
  function updateComplianceOptions(industry) {
    const container = document.getElementById('compliance-options');
    if (!container) return;
    
    const industryCompliance = {
      healthcare: [
        { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act' },
        { id: 'hitech', name: 'HITECH', description: 'Health Information Technology for Economic and Clinical Health Act' },
        { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' }
      ],
      financial: [
        { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
        { id: 'glba', name: 'GLBA', description: 'Gramm-Leach-Bliley Act' },
        { id: 'sox', name: 'SOX', description: 'Sarbanes-Oxley Act' },
        { id: 'ffiec', name: 'FFIEC', description: 'Federal Financial Institutions Examination Council' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' }
      ],
      education: [
        { id: 'ferpa', name: 'FERPA', description: 'Family Educational Rights and Privacy Act' },
        { id: 'coppa', name: 'COPPA', description: 'Children\'s Online Privacy Protection Act' },
        { id: 'cipa', name: 'CIPA', description: 'Children\'s Internet Protection Act' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' }
      ],
      government: [
        { id: 'fisma', name: 'FISMA', description: 'Federal Information Security Modernization Act' },
        { id: 'nist', name: 'NIST 800-53', description: 'Security Controls for Federal Information Systems' },
        { id: 'cmmc', name: 'CMMC', description: 'Cybersecurity Maturity Model Certification' },
        { id: 'fedramp', name: 'FedRAMP', description: 'Federal Risk and Authorization Management Program' }
      ],
      manufacturing: [
        { id: 'iec62443', name: 'IEC 62443', description: 'Industrial Automation and Control Systems Security' },
        { id: 'nist', name: 'NIST CSF', description: 'Cybersecurity Framework' },
        { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management System Standard' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' }
      ],
      retail: [
        { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
        { id: 'ccpa', name: 'CCPA/CPRA', description: 'California Consumer Privacy Act/Privacy Rights Act' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' },
        { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management System Standard' }
      ],
      default: [
        { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
        { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management System Standard' },
        { id: 'nist', name: 'NIST CSF', description: 'Cybersecurity Framework' },
        { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' },
        { id: 'soc2', name: 'SOC 2', description: 'Service Organization Control 2' }
      ]
    };
    
    const complianceOptions = industryCompliance[industry] || industryCompliance.default;
    
    container.innerHTML = complianceOptions.map(compliance => `
      <div class="compliance-option" data-compliance="${compliance.id}">
        <h4>${compliance.name}</h4>
        <p>${compliance.description}</p>
        <ul>
          <li>Enhanced access controls</li>
          <li>Security monitoring</li>
          <li>User authentication</li>
        </ul>
      </div>
    `).join('');
    
    // Add click handler for compliance options
    document.querySelectorAll('.compliance-option').forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('selected');
        updateComplianceDetails();
      });
    });
  }
  
  // Update compliance details based on selected options
  function updateComplianceDetails() {
    const selectedOptions = document.querySelectorAll('.compliance-option.selected');
    const detailsContainer = document.getElementById('compliance-details');
    
    if (!detailsContainer) return;
    
    if (selectedOptions.length === 0) {
      detailsContainer.innerHTML = `<p>Select compliance requirements to see how they impact NAC implementation.</p>`;
      return;
    }
    
    const complianceDetails = {
      hipaa: {
        requirements: [
          "Access control mechanisms to restrict system access to authorized users only",
          "Audit controls that record and examine activity in systems containing ePHI",
          "Integrity controls to ensure ePHI is not improperly altered or destroyed",
          "Transmission security measures to protect ePHI when transmitted over networks"
        ],
        portnoxAdvantage: "Built-in HIPAA compliance templates with one-click reporting and continuous monitoring to simplify regulatory audits."
      },
      hitech: {
        requirements: [
          "Enhanced breach notification requirements",
          "Increased penalties for non-compliance",
          "Requirements for data encryption and destruction",
          "More stringent access control and authentication provisions"
        ],
        portnoxAdvantage: "Cloud-native architecture with end-to-end encryption and automated compliance monitoring reduces breach risks and simplifies reporting."
      },
      pci: {
        requirements: [
          "Network segmentation to isolate cardholder data environments",
          "Strong access control measures for systems with cardholder data",
          "Continuous monitoring and regular testing of security systems",
          "Maintenance of information security policies and procedures"
        ],
        portnoxAdvantage: "PCI-ready security with network segmentation and continuous compliance monitoring for cardholder data environments."
      },
      gdpr: {
        requirements: [
          "Lawful basis for processing personal data",
          "Data protection by design and by default",
          "Consumer rights regarding personal data",
          "Security of processing requirements"
        ],
        portnoxAdvantage: "Granular policy controls with comprehensive logging and monitoring to demonstrate compliance with GDPR principles."
      },
      ferpa: {
        requirements: [
          "Controls on disclosure of student information",
          "Protection of educational records from unauthorized access",
          "Secure authentication for systems containing student records",
          "Parental/student control over disclosure of information"
        ],
        portnoxAdvantage: "Role-based access control with detailed audit trails helps ensure only authorized users can access protected student information."
      },
      fisma: {
        requirements: [
          "Security categorization of information systems",
          "Security controls based on risk assessment",
          "Continuous monitoring of security controls",
          "Security authorization process for information systems"
        ],
        portnoxAdvantage: "Built-in monitoring with automated continuous assessment to meet FISMA continuous monitoring requirements."
      },
      nist: {
        requirements: [
          "Comprehensive catalog of security controls",
          "Control selection based on impact level",
          "Continuous monitoring requirements",
          "Implementation guidance for security controls"
        ],
        portnoxAdvantage: "Aligns with NIST security controls for access management and provides continuous monitoring capabilities."
      },
      iso27001: {
        requirements: [
          "Risk assessment and treatment",
          "Security policy development",
          "Asset management controls",
          "Access control implementation"
        ],
        portnoxAdvantage: "Comprehensive policy controls and access management features mapped to ISO 27001 control requirements."
      },
      default: {
        requirements: [
          "Strong authentication and access controls",
          "Regular security assessments",
          "Detailed audit logging",
          "Security incident response capabilities"
        ],
        portnoxAdvantage: "Cloud-native architecture with automatic updates and built-in security controls to maintain continuous compliance."
      }
    };
    
    detailsContainer.innerHTML = `
      <div class="compliance-impact">
        <h4>Compliance Impact on NAC Implementation</h4>
        
        <ul class="compliance-requirements-list">
          ${Array.from(selectedOptions).map(option => {
            const complianceId = option.getAttribute('data-compliance');
            const complianceName = option.querySelector('h4').textContent;
            const details = complianceDetails[complianceId] || complianceDetails.default;
            
            return `
              <li>
                <strong>${complianceName}:</strong>
                <ul>
                  ${details.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
                <div class="compliance-advantage">
                  <strong>Portnox Advantage:</strong> ${details.portnoxAdvantage}
                </div>
              </li>
            `;
          }).join('')}
        </ul>
        
        <div class="compliance-summary">
          <p><strong>Summary Impact:</strong> The selected compliance requirements add ${selectedOptions.length > 2 ? 'significant' : 'moderate'} complexity to NAC implementation. Cloud-native solutions like Portnox typically reduce compliance overhead by 40-60% compared to traditional on-premises alternatives, primarily through automated monitoring, built-in compliance frameworks, and simplified reporting capabilities.</p>
        </div>
      </div>
    `;
  }
  
  // Setup sensitivity analysis sliders
  function setupSensitivitySliders() {
    const slidersData = [
      { id: 'devices-slider', valueId: 'devices-value', format: (val) => `${parseInt(val).toLocaleString()} devices` },
      { id: 'locations-slider', valueId: 'locations-value', format: (val) => `${val} location${val > 1 ? 's' : ''}` },
      { id: 'staff-slider', valueId: 'staff-value', format: (val) => `$${parseInt(val).toLocaleString()}` },
      { id: 'years-slider', valueId: 'years-value', format: (val) => `${val} year${val > 1 ? 's' : ''}` },
      { 
        id: 'implementation-slider', 
        valueId: 'implementation-value', 
        format: (val) => {
          const labels = ['Very Simple', 'Simple', 'Medium', 'Complex', 'Very Complex'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      },
      { 
        id: 'compliance-slider', 
        valueId: 'compliance-value', 
        format: (val) => {
          const labels = ['Basic', 'Standard', 'Medium', 'Advanced', 'Stringent'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      }
    ];
    
    slidersData.forEach(sliderData => {
      const slider = document.getElementById(sliderData.id);
      const valueEl = document.getElementById(sliderData.valueId);
      
      if (slider && valueEl) {
        // Set initial value
        valueEl.textContent = sliderData.format(slider.value);
        
        // Add input event listener
        slider.addEventListener('input', function() {
          valueEl.textContent = sliderData.format(this.value);
          updateSensitivityPreview();
        });
      }
    });
    
    // Initialize sensitivity analysis chart
    setTimeout(initSensitivityChart, 500);
  }
  
  // Initialize sensitivity analysis chart
  function initSensitivityChart() {
    const canvas = document.getElementById('sensitivity-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [
          {
            label: 'On-Premises TCO (Base)',
            data: [150000, 225000, 300000, 375000, 450000],
            borderColor: 'rgba(27, 103, 178, 1)',
            backgroundColor: 'rgba(27, 103, 178, 0.1)',
            borderWidth: 2,
            fill: true
          },
          {
            label: 'On-Premises TCO (Adjusted)',
            data: [180000, 270000, 360000, 450000, 540000],
            borderColor: 'rgba(27, 103, 178, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false
          },
          {
            label: 'Portnox Cloud TCO (Base)',
            data: [75000, 150000, 225000, 300000, 375000],
            borderColor: 'rgba(43, 210, 91, 1)',
            backgroundColor: 'rgba(43, 210, 91, 0.1)',
            borderWidth: 2,
            fill: true
          },
          {
            label: 'Portnox Cloud TCO (Adjusted)',
            data: [90000, 180000, 270000, 360000, 450000],
            borderColor: 'rgba(43, 210, 91, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + context.raw.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cumulative Cost ($)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
    
    // Store chart reference
    window._sensitivityChart = chart;
    
    // Initial update
    updateSensitivityPreview();
  }
  
  // Update sensitivity preview based on slider values
  function updateSensitivityPreview() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('staff-slider')?.value || 100000);
    const years = parseInt(document.getElementById('years-slider')?.value || 3);
    const complianceComplexity = parseInt(document.getElementById('compliance-slider')?.value || 3);
    
    // Calculate adjusted costs
    const deviceScaleFactor = 1 + (deviceCount - 1000) / 9000 * 0.5; // 0% to 50% increase for 1K to 10K devices
    const locationScaleFactor = 1 + (locationCount - 1) / 49 * 0.8; // 0% to 80% increase for 1 to 50 locations
    const implementationScaleFactor = 0.7 + implementationComplexity * 0.2; // 0.9 to 1.7 based on complexity
    const staffScaleFactor = staffCost / 100000; // Scale based on staff cost relative to $100K
    const complianceScaleFactor = 0.8 + complianceComplexity * 0.1; // 0.9 to 1.3 based on compliance complexity
    
    // Apply scale factors differently to on-prem vs cloud
    // On-prem is more affected by device count, locations, and implementation complexity
    const onPremScaleFactor = deviceScaleFactor * locationScaleFactor * implementationScaleFactor * staffScaleFactor * complianceScaleFactor;
    
    // Cloud is less affected by device count, locations, and implementation complexity
    const cloudScaleFactor = 
      (1 + (deviceScaleFactor - 1) * 0.3) * // Device scale reduced by 70%
      (1 + (locationScaleFactor - 1) * 0.1) * // Location scale reduced by 90%
      (1 + (implementationScaleFactor - 1) * 0.3) * // Implementation scale reduced by 70%
      staffScaleFactor * 
      (1 + (complianceScaleFactor - 1) * 0.5); // Compliance scale reduced by 50%
    
    // Base costs per year
    const onPremYearlyCosts = [150000, 75000, 75000, 75000, 75000];
    const cloudYearlyCosts = [75000, 75000, 75000, 75000, 75000];
    
    // Calculate cumulative costs for base scenario
    const onPremBaseCumulative = onPremYearlyCosts.map((cost, index) => 
      onPremYearlyCosts.slice(0, index + 1).reduce((sum, c) => sum + c, 0)
    ).slice(0, years);
    
    const cloudBaseCumulative = cloudYearlyCosts.map((cost, index) => 
      cloudYearlyCosts.slice(0, index + 1).reduce((sum, c) => sum + c, 0)
    ).slice(0, years);
    
    // Calculate adjusted costs
    const onPremAdjustedYearly = onPremYearlyCosts.map(cost => cost * onPremScaleFactor);
    const cloudAdjustedYearly = cloudYearlyCosts.map(cost => cost * cloudScaleFactor);
    
    // Calculate cumulative adjusted costs
    const onPremAdjustedCumulative = onPremAdjustedYearly.map((cost, index) => 
      onPremAdjustedYearly.slice(0, index + 1).reduce((sum, c) => sum + c, 0)
    ).slice(0, years);
    
    const cloudAdjustedCumulative = cloudAdjustedYearly.map((cost, index) => 
      cloudAdjustedYearly.slice(0, index + 1).reduce((sum, c) => sum + c, 0)
    ).slice(0, years);
    
    // Update sensitivity chart
    if (window._sensitivityChart) {
      // Update data
      window._sensitivityChart.data.labels = Array.from({length: years}, (_, i) => `Year ${i + 1}`);
      
      window._sensitivityChart.data.datasets[0].data = onPremBaseCumulative;
      window._sensitivityChart.data.datasets[1].data = onPremAdjustedCumulative;
      window._sensitivityChart.data.datasets[2].data = cloudBaseCumulative;
      window._sensitivityChart.data.datasets[3].data = cloudAdjustedCumulative;
      
      // Update chart
      window._sensitivityChart.update();
    }
    
    // Update preview metrics
    // Calculate three-year values for preview
    const threeYearOnPremBase = onPremYearlyCosts.slice(0, 3).reduce((sum, cost) => sum + cost, 0);
    const threeYearCloudBase = cloudYearlyCosts.slice(0, 3).reduce((sum, cost) => sum + cost, 0);
    const threeYearOnPremAdjusted = onPremAdjustedYearly.slice(0, 3).reduce((sum, cost) => sum + cost, 0);
    const threeYearCloudAdjusted = cloudAdjustedYearly.slice(0, 3).reduce((sum, cost) => sum + cost, 0);
    
    // Calculate savings
    const baseSavings = threeYearOnPremBase - threeYearCloudBase;
    const adjustedSavings = threeYearOnPremAdjusted - threeYearCloudAdjusted;
    const savingsPercentage = Math.round((adjustedSavings / threeYearOnPremAdjusted) * 100);
    
    // Update preview values
    document.getElementById('preview-tco-savings').textContent = `$${Math.round(adjustedSavings).toLocaleString()}`;
    document.getElementById('preview-percentage-savings').textContent = `${savingsPercentage}%`;
    
    // ROI timeline - simplified calculation
    const monthlyOnPremCost = threeYearOnPremAdjusted / 36;
    const monthlyCloudCost = threeYearCloudAdjusted / 36;
    const monthlySavings = monthlyOnPremCost - monthlyCloudCost;
    const initialInvestment = cloudAdjustedYearly[0] - onPremAdjustedYearly[0]; // Can be negative
    
    let roiMonths = 0;
    if (initialInvestment > 0) {
      roiMonths = Math.ceil(initialInvestment / monthlySavings);
    }
    
    document.getElementById('preview-roi-timeline').textContent = roiMonths <= 0 ? 'Immediate' : 
      (roiMonths <= 36 ? `${roiMonths} month${roiMonths > 1 ? 's' : ''}` : 'Extended');
    
    // Implementation impact
    const implementationTimeOnPrem = 60 + (implementationComplexity * 15) + (locationCount * 5);
    const implementationTimeCloud = 5 + (implementationComplexity * 2) + (locationCount * 0.5);
    const implementationReduction = Math.round(((implementationTimeOnPrem - implementationTimeCloud) / implementationTimeOnPrem) * 100);
    
    document.getElementById('preview-deployment-time').textContent = `${implementationReduction}% faster`;
    
    // Resource reduction
    const fteOnPrem = 0.5 + (deviceCount / 2000 * 0.5) + (locationCount / 10 * 0.5) + (implementationComplexity * 0.2);
    const fteCloud = 0.2 + (deviceCount / 5000 * 0.2) + (locationCount / 20 * 0.1) + (implementationComplexity * 0.05);
    const fteReduction = Math.round(((fteOnPrem - fteCloud) / fteOnPrem) * 100);
    
    document.getElementById('preview-resource-reduction').textContent = `${fteReduction}%`;
    
    // Maintenance savings
    const maintenanceHoursOnPrem = 10 + (deviceCount / 500) + (locationCount * 2) + (complianceComplexity * 5);
    const maintenanceHoursCloud = 1 + (deviceCount / 5000) + (locationCount * 0.2) + (complianceComplexity * 0.5);
    const maintenanceSavings = Math.round(((maintenanceHoursOnPrem - maintenanceHoursCloud) / maintenanceHoursOnPrem) * 100);
    
    document.getElementById('preview-maintenance-savings').textContent = `${maintenanceSavings}%`;
    
    // Compliance rating
    let complianceRating = 'Good';
    if (complianceComplexity <= 2) {
      complianceRating = 'Good';
    } else if (complianceComplexity <= 4) {
      complianceRating = 'Excellent';
    } else {
      complianceRating = 'Superior';
    }
    
    document.getElementById('preview-compliance-rating').textContent = complianceRating;
  }
  
  // Apply configuration from wizard to calculator
  function applyConfiguration() {
    // Get selected industry
    const selectedIndustry = document.querySelector('.template-button.active')?.getAttribute('data-template') || 'default';
    
    // Get selected vendors
    const selectedVendors = Array.from(document.querySelectorAll('.vendor-card.selected'))
      .map(vendor => vendor.getAttribute('data-vendor'));
    
    // Get cost values
    const hardwareCost = parseInt(document.getElementById('cost-hardware').value) || 10000;
    const licensingCost = parseInt(document.getElementById('cost-licensing').value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('cost-maintenance').value) || 15000;
    const implementationCost = parseInt(document.getElementById('cost-implementation').value) || 30000;
    const personnelCost = parseInt(document.getElementById('cost-personnel').value) || 100000;
    const downtimeCost = parseInt(document.getElementById('cost-downtime').value) || 5000;
    
    // Get discounts
    const portnoxDiscount = parseInt(document.getElementById('portnox-discount').value) || 0;
    const competitorDiscount = parseInt(document.getElementById('competitor-discount').value) || 0;
    
    // Get compliance requirements
    const selectedCompliance = Array.from(document.querySelectorAll('.compliance-option.selected'))
      .map(option => option.getAttribute('data-compliance'));
    
    // Get sensitivity analysis values
    const deviceCount = parseInt(document.getElementById('devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('staff-slider')?.value || 100000);
    const years = parseInt(document.getElementById('years-slider')?.value || 3);
    const complianceComplexity = parseInt(document.getElementById('compliance-slider')?.value || 3);
    
    // Get selected audience
    const selectedAudience = document.querySelector('.audience-option.selected')?.getAttribute('data-audience') || 'executive';
    
    // Apply to calculator
    if (window.calculator) {
      // Update industry
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector && selectedIndustry !== 'default') {
        industrySelector.value = selectedIndustry;
        // Trigger industry change event
        const event = new Event('change');
        industrySelector.dispatchEvent(event);
      }
      
      // Update vendor
      if (selectedVendors.length > 0) {
        const vendorCards = document.querySelectorAll('.vendor-selection-card .vendor-card');
        vendorCards.forEach(card => {
          const vendor = card.getAttribute('data-vendor');
          if (selectedVendors.includes(vendor)) {
            // Simulate click if not already selected
            if (!card.classList.contains('selected')) {
              card.click();
            }
          }
        });
      }
      
      // Update device count
      const deviceCountInput = document.getElementById('device-count');
      if (deviceCountInput) {
        deviceCountInput.value = deviceCount;
      }
      
      // Update organization size based on device count
      const orgSizeSelect = document.getElementById('organization-size');
      if (orgSizeSelect) {
        if (deviceCount <= 1000) {
          orgSizeSelect.value = 'small';
        } else if (deviceCount <= 5000) {
          orgSizeSelect.value = 'medium';
        } else {
          orgSizeSelect.value = 'large';
        }
      }
      
      // Update years to project
      const yearsInput = document.getElementById('years-to-project');
      if (yearsInput) {
        yearsInput.value = years;
      }
      
      // Update multiple locations
      const multipleLocationsCheckbox = document.getElementById('multiple-locations');
      if (multipleLocationsCheckbox) {
        multipleLocationsCheckbox.checked = locationCount > 1;
        
        // Trigger change event
        const event = new Event('change');
        multipleLocationsCheckbox.dispatchEvent(event);
        
        // Update location count if checkbox is checked
        if (locationCount > 1) {
          const locationCountInput = document.getElementById('location-count');
          if (locationCountInput) {
            locationCountInput.value = locationCount;
          }
        }
      }
      
      // Update audience selector
      const audienceSelect = document.getElementById('audience-selector');
      if (audienceSelect) {
        audienceSelect.value = selectedAudience;
        
        // Trigger change event
        const event = new Event('change');
        audienceSelect.dispatchEvent(event);
      }
      
      // Update calculator metrics
      if (typeof window.calculator.setCustomMetrics === 'function') {
        window.calculator.setCustomMetrics({
          hardwareCost,
          licensingCost,
          maintenanceCost,
          implementationCost,
          personnelCost,
          downtimeCost,
          portnoxDiscount,
          competitorDiscount,
          complianceRequirements: selectedCompliance,
          complianceComplexity
        });
      }
      
      // Run calculation
      if (typeof window.calculator.calculate === 'function') {
        window.calculator.calculate();
      }
    }
  }
  
  // Initialize the enhanced cost configuration
  function init() {
    // Add styles
    addStyles();
    
    // Create cost analyzer modal
    createCostAnalyzerModal();
    
    console.log('Ultimate Cost Configuration initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Ultimate Cost Configuration setup complete');
})();
