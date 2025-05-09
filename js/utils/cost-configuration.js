/**
 * Cost Configuration Manager
 * Handles advanced cost configuration settings
 */
class CostConfigurationManager {
  constructor() {
    this.defaultValues = {
      // Hardware cost multipliers by vendor
      hardwareCostMultipliers: {
        cisco: 1.0,
        aruba: 1.0,
        forescout: 1.0,
        nps: 0.8,
        fortinac: 0.9,
        securew2: 0.7,
        portnox: 0.0 // Cloud solution - no hardware
      },
      
      // Licensing cost multipliers
      licensingCostMultipliers: {
        cisco: 1.0,
        aruba: 0.95,
        forescout: 1.1,
        nps: 0.7,
        fortinac: 0.85,
        securew2: 0.8,
        portnox: 0.75
      },
      
      // Maintenance cost multipliers
      maintenanceCostMultipliers: {
        cisco: 1.0,
        aruba: 0.95,
        forescout: 1.05,
        nps: 0.8,
        fortinac: 0.9,
        securew2: 0.85,
        portnox: 0.7
      },
      
      // Implementation cost multipliers
      implementationCostMultipliers: {
        cisco: 1.0,
        aruba: 0.9,
        forescout: 1.1,
        nps: 0.85,
        fortinac: 0.95,
        securew2: 0.8,
        portnox: 0.6
      },
      
      // Training cost multipliers
      trainingCostMultipliers: {
        cisco: 1.0,
        aruba: 0.95,
        forescout: 1.05,
        nps: 0.9,
        fortinac: 0.95,
        securew2: 0.85,
        portnox: 0.7
      },
      
      // FTE salaries
      fteSalaries: {
        networkAdmin: 120000,
        securityAdmin: 135000,
        systemAdmin: 110000,
        helpDesk: 75000
      },
      
      // Downtime costs
      downtimeCost: 5000 // $ per hour
    };
    
    // Initialize the UI
    this.initUI();
  }
  
  /**
   * Initialize the UI components for cost configuration
   */
  initUI() {
    // Check if the custom costs section exists
    const customCostsSection = document.getElementById('custom-costs-section');
    if (!customCostsSection) {
      // Create the custom costs section if it doesn't exist
      this.createCustomCostsSection();
    }
    
    // Add event listener to show/hide custom costs section
    const advancedOptionsToggle = document.querySelector('.advanced-options-toggle');
    if (advancedOptionsToggle) {
      const customCostsToggle = document.createElement('button');
      customCostsToggle.type = 'button';
      customCostsToggle.className = 'btn btn-text';
      customCostsToggle.setAttribute('aria-expanded', 'false');
      customCostsToggle.setAttribute('aria-controls', 'custom-costs-section');
      customCostsToggle.innerHTML = '<i class="fas fa-angle-down"></i> Cost Configuration';
      
      customCostsToggle.addEventListener('click', function() {
        const panel = document.getElementById('custom-costs-section');
        if (panel) {
          const isHidden = panel.classList.toggle('hidden');
          this.setAttribute('aria-expanded', !isHidden);
          
          // Toggle icon
          const icon = this.querySelector('i');
          if (icon) {
            icon.classList.toggle('fa-angle-down', isHidden);
            icon.classList.toggle('fa-angle-up', !isHidden);
          }
        }
      });
      
      advancedOptionsToggle.appendChild(customCostsToggle);
    }
    
    // Initialize tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
    
    // Add event listeners to cost factor inputs
    document.querySelectorAll('[data-cost-factor]').forEach(input => {
      input.addEventListener('change', this.handleCostFactorChange.bind(this));
    });
  }
  
  /**
   * Create the custom costs section
   */
  createCustomCostsSection() {
    // Find the location to add the custom costs section
    const organizationInputs = document.getElementById('organization-inputs');
    if (!organizationInputs) return;
    
    // Create the custom costs section
    const customCostsSection = document.createElement('div');
    customCostsSection.id = 'custom-costs-section';
    customCostsSection.className = 'advanced-settings-section hidden';
    
    // Add section title
    const title = document.createElement('h4');
    title.textContent = 'Advanced Cost Configuration';
    customCostsSection.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Fine-tune cost factors to match your specific environment.';
    description.style.marginBottom = '15px';
    customCostsSection.appendChild(description);
    
    // Create cost multipliers section
    customCostsSection.appendChild(this.createCostMultipliersSection());
    
    // Create FTE costs section
    customCostsSection.appendChild(this.createFTECostsSection());
    
    // Create downtime costs section
    customCostsSection.appendChild(this.createDowntimeCostsSection());
    
    // Add the custom costs section after the organization inputs
    organizationInputs.parentNode.insertBefore(customCostsSection, organizationInputs.nextSibling);
  }
  
  /**
   * Create the cost multipliers section
   */
  createCostMultipliersSection() {
    const section = document.createElement('div');
    
    // Add section title
    const title = document.createElement('h5');
    title.textContent = 'Cost Multipliers';
    section.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Adjust multipliers to reflect your cost structure. Default value: 1.0';
    description.style.fontSize = '0.9rem';
    description.style.marginBottom = '15px';
    section.appendChild(description);
    
    // Create cost factors grid
    const grid = document.createElement('div');
    grid.className = 'cost-factor-grid';
    
    // Add hardware cost multiplier
    grid.appendChild(this.createCostFactorInput(
      'custom-hardware-cost',
      'Hardware Cost Multiplier',
      '1.0',
      'Adjust the hardware acquisition cost across all vendors.'
    ));
    
    // Add licensing cost multiplier
    grid.appendChild(this.createCostFactorInput(
      'custom-licensing-cost',
      'Licensing Cost Multiplier',
      '1.0',
      'Adjust the software licensing cost across all vendors.'
    ));
    
    // Add maintenance cost multiplier
    grid.appendChild(this.createCostFactorInput(
      'custom-maintenance-cost',
      'Maintenance Cost Multiplier',
      '1.0',
      'Adjust the annual maintenance cost across all vendors.'
    ));
    
    // Add implementation cost multiplier
    grid.appendChild(this.createCostFactorInput(
      'custom-implementation-cost',
      'Implementation Cost Multiplier',
      '1.0',
      'Adjust the professional services cost for implementation.'
    ));
    
    // Add training cost multiplier
    grid.appendChild(this.createCostFactorInput(
      'training-cost-multiplier',
      'Training Cost Multiplier',
      '1.0',
      'Adjust the cost for staff training across all vendors.'
    ));
    
    section.appendChild(grid);
    return section;
  }
  
  /**
   * Create the FTE costs section
   */
  createFTECostsSection() {
    const section = document.createElement('div');
    section.style.marginTop = '20px';
    
    // Add section title
    const title = document.createElement('h5');
    title.textContent = 'Personnel Costs';
    section.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Customize yearly salaries for different IT roles.';
    description.style.fontSize = '0.9rem';
    description.style.marginBottom = '15px';
    section.appendChild(description);
    
    // Create cost factors grid
    const grid = document.createElement('div');
    grid.className = 'cost-factor-grid';
    
    // Add Network Admin salary
    grid.appendChild(this.createCostFactorInput(
      'network-admin-salary',
      'Network Admin Salary',
      '120000',
      'Annual fully-loaded cost for Network Administrators.'
    ));
    
    // Add Security Admin salary
    grid.appendChild(this.createCostFactorInput(
      'security-admin-salary',
      'Security Admin Salary',
      '135000',
      'Annual fully-loaded cost for Security Administrators.'
    ));
    
    // Add System Admin salary
    grid.appendChild(this.createCostFactorInput(
      'system-admin-salary',
      'System Admin Salary',
      '110000',
      'Annual fully-loaded cost for System Administrators.'
    ));
    
    // Add Help Desk salary
    grid.appendChild(this.createCostFactorInput(
      'helpdesk-salary',
      'Help Desk Salary',
      '75000',
      'Annual fully-loaded cost for Help Desk personnel.'
    ));
    
    section.appendChild(grid);
    return section;
  }
  
  /**
   * Create the downtime costs section
   */
  createDowntimeCostsSection() {
    const section = document.createElement('div');
    section.style.marginTop = '20px';
    
    // Add section title
    const title = document.createElement('h5');
    title.textContent = 'Downtime Costs';
    section.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Set the hourly cost of network downtime for your organization.';
    description.style.fontSize = '0.9rem';
    description.style.marginBottom = '15px';
    section.appendChild(description);
    
    // Create cost factors grid
    const grid = document.createElement('div');
    grid.className = 'cost-factor-grid';
    
    // Add downtime cost
    grid.appendChild(this.createCostFactorInput(
      'downtime-cost',
      'Cost per Hour of Downtime',
      '5000',
      'Estimated cost per hour when the network is unavailable.'
    ));
    
    section.appendChild(grid);
    return section;
  }
  
  /**
   * Create a cost factor input
   */
  createCostFactorInput(id, label, defaultValue, tooltip) {
    const container = document.createElement('div');
    container.className = 'cost-factor';
    
    // Create label with tooltip
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.textContent = label;
    
    if (tooltip) {
      const tooltipIcon = document.createElement('i');
      tooltipIcon.className = 'fas fa-info-circle cost-factor-tooltip';
      tooltipIcon.setAttribute('data-bs-toggle', 'tooltip');
      tooltipIcon.setAttribute('data-bs-placement', 'top');
      tooltipIcon.setAttribute('title', tooltip);
      
      labelElement.appendChild(tooltipIcon);
    }
    
    container.appendChild(labelElement);
    
    // Create input
    const input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    input.name = id;
    input.className = 'form-control';
    input.value = defaultValue;
    input.min = '0';
    input.step = '0.01';
    input.setAttribute('data-cost-factor', id);
    
    container.appendChild(input);
    
    return container;
  }
  
  /**
   * Handle cost factor change
   */
  handleCostFactorChange(event) {
    const input = event.target;
    const factor = input.getAttribute('data-cost-factor');
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < 0) {
      input.value = this.getDefaultValue(factor);
      return;
    }
    
    // Run calculation if calculator is available
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      window.calculator.calculate();
    }
  }
  
  /**
   * Get default value for a cost factor
   */
  getDefaultValue(factor) {
    switch (factor) {
      case 'custom-hardware-cost':
      case 'custom-licensing-cost':
      case 'custom-maintenance-cost':
      case 'custom-implementation-cost':
      case 'training-cost-multiplier':
        return '1.0';
      case 'network-admin-salary':
        return '120000';
      case 'security-admin-salary':
        return '135000';
      case 'system-admin-salary':
        return '110000';
      case 'helpdesk-salary':
        return '75000';
      case 'downtime-cost':
        return '5000';
      default:
        return '1.0';
    }
  }
  
  /**
   * Get the current value for a cost factor
   */
  getCostFactorValue(factor) {
    const input = document.getElementById(factor);
    if (input) {
      return parseFloat(input.value) || this.getDefaultValue(factor);
    }
    return this.getDefaultValue(factor);
  }
  
  /**
   * Reset all cost factors to default values
   */
  resetToDefaults() {
    document.querySelectorAll('[data-cost-factor]').forEach(input => {
      const factor = input.getAttribute('data-cost-factor');
      input.value = this.getDefaultValue(factor);
    });
    
    // Run calculation if calculator is available
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      window.calculator.calculate();
    }
    
    // Show notification if available
    if (window.notificationManager) {
      window.notificationManager.success('Cost factors reset to default values');
    }
  }
}

// Initialize and make globally available
window.costConfigurationManager = new CostConfigurationManager();
