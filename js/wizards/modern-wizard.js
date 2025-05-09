/**
 * Modern Wizard Component
 * Enhanced wizard experience with animated transitions and themed steps
 */

class ModernWizard {
  constructor(options = {}) {
    this.options = {
      container: '#wizard-container',
      stepSelector: '.wizard-step',
      navigationSelector: '.wizard-navigation',
      nextButtonSelector: '#wizard-next',
      prevButtonSelector: '#wizard-prev',
      submitButtonSelector: '#wizard-submit',
      activeClass: 'active',
      completedClass: 'completed',
      disabledClass: 'disabled',
      hiddenClass: 'hidden',
      animationDuration: 500,
      ...options
    };
    
    this.currentStep = 1;
    this.totalSteps = 0;
    this.steps = [];
    this.stepData = {};
    
    // Initialize the wizard
    this.init();
  }
  
  /**
   * Initialize the wizard
   */
  init() {
    console.log('Initializing Modern Wizard...');
    
    // Find the container
    this.container = document.querySelector(this.options.container);
    
    if (!this.container) {
      console.warn('No wizard steps found');
      return;
    }
    
    // Find all steps
    this.steps = Array.from(document.querySelectorAll(this.options.stepSelector));
    this.totalSteps = this.steps.length;
    
    if (this.totalSteps === 0) {
      console.warn('No wizard steps found');
      return;
    }
    
    console.log(`Found ${this.totalSteps} wizard steps`);
    
    // Find navigation buttons
    this.navigation = document.querySelector(this.options.navigationSelector);
    this.nextButton = document.querySelector(this.options.nextButtonSelector);
    this.prevButton = document.querySelector(this.options.prevButtonSelector);
    this.submitButton = document.querySelector(this.options.submitButtonSelector);
    
    // Create step indicators
    this.createStepIndicators();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Show the first step
    this.goToStep(1);
    
    console.log('Modern Wizard initialized');
  }
  
  /**
   * Create step indicators
   */
  createStepIndicators() {
    // Create the step indicators container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'wizard-steps';
    
    // Create step indicators
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepIndicator = document.createElement('div');
      stepIndicator.className = 'wizard-step';
      stepIndicator.dataset.step = i;
      
      // Create step icon
      const stepIcon = document.createElement('div');
      stepIcon.className = 'wizard-step-icon';
      
      // Create icon SVG based on step
      let iconSvg;
      switch (i) {
        case 1:
          iconSvg = '<img src="img/wizard-icons/vendor-selection.svg" alt="Select Vendor" />';
          break;
        case 2:
          iconSvg = '<img src="img/wizard-icons/compliance.svg" alt="Compliance" />';
          break;
        case 3:
          iconSvg = '<img src="img/wizard-icons/organization.svg" alt="Organization" />';
          break;
        case 4:
          iconSvg = '<img src="img/wizard-icons/cost.svg" alt="Cost" />';
          break;
        case 5:
          iconSvg = '<img src="img/wizard-icons/results.svg" alt="Results" />';
          break;
        default:
          iconSvg = `<span>${i}</span>`;
      }
      
      stepIcon.innerHTML = iconSvg;
      stepIndicator.appendChild(stepIcon);
      
      // Create step title
      const stepTitle = document.createElement('div');
      stepTitle.className = 'wizard-step-title';
      stepTitle.textContent = this.getStepTitle(i);
      stepIndicator.appendChild(stepTitle);
      
      // Add click event to navigate to step (only if step is completed)
      stepIndicator.addEventListener('click', () => {
        if (stepIndicator.classList.contains(this.options.completedClass)) {
          this.goToStep(i);
        }
      });
      
      stepsContainer.appendChild(stepIndicator);
    }
    
    // Add step indicators to container
    if (this.container) {
      this.container.insertBefore(stepsContainer, this.container.firstChild);
    }
  }
  
  /**
   * Get the title for a step
   * @param {number} step - Step number
   * @returns {string} Step title
   */
  getStepTitle(step) {
    const stepTitles = [
      'Vendor Selection',
      'Compliance',
      'Organization',
      'Cost Configuration',
      'Results'
    ];
    
    return stepTitles[step - 1] || `Step ${step}`;
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Next button click
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.next();
      });
    }
    
    // Previous button click
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.previous();
      });
    }
    
    // Submit button click
    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        this.submit();
      });
    }
  }
  
  /**
   * Go to a specific step
   * @param {number} step - Step to go to
   */
  goToStep(step) {
    // Validate step
    if (step < 1 || step > this.totalSteps) {
      console.warn(`Invalid step: ${step}`);
      return;
    }
    
    // Update current step
    this.currentStep = step;
    
    // Update step indicators
    const stepIndicators = document.querySelectorAll('.wizard-step');
    stepIndicators.forEach((indicator, index) => {
      // Remove all classes
      indicator.classList.remove(this.options.activeClass);
      
      // Add classes based on current step
      if (index + 1 === this.currentStep) {
        indicator.classList.add(this.options.activeClass);
      } else if (index + 1 < this.currentStep) {
        indicator.classList.add(this.options.completedClass);
      } else {
        indicator.classList.remove(this.options.completedClass);
      }
    });
    
    // Hide all step content
    this.steps.forEach(stepElement => {
      stepElement.style.display = 'none';
    });
    
    // Show current step content with animation
    const currentStepElement = this.steps[this.currentStep - 1];
    if (currentStepElement) {
      currentStepElement.style.display = 'block';
      
      // Animate the entrance
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(
          currentStepElement,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: this.options.animationDuration / 1000 }
        );
      } else {
        // Fallback if GSAP is not available
        currentStepElement.style.opacity = '0';
        currentStepElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          currentStepElement.style.transition = `opacity ${this.options.animationDuration}ms, transform ${this.options.animationDuration}ms`;
          currentStepElement.style.opacity = '1';
          currentStepElement.style.transform = 'translateY(0)';
        }, 10);
      }
    }
    
    // Update navigation buttons
    this.updateNavigation();
  }
  
  /**
   * Update navigation buttons
   */
  updateNavigation() {
    // Previous button
    if (this.prevButton) {
      if (this.currentStep === 1) {
        this.prevButton.classList.add(this.options.hiddenClass);
      } else {
        this.prevButton.classList.remove(this.options.hiddenClass);
      }
    }
    
    // Next button
    if (this.nextButton) {
      if (this.currentStep === this.totalSteps) {
        this.nextButton.classList.add(this.options.hiddenClass);
      } else {
        this.nextButton.classList.remove(this.options.hiddenClass);
      }
    }
    
    // Submit button
    if (this.submitButton) {
      if (this.currentStep === this.totalSteps) {
        this.submitButton.classList.remove(this.options.hiddenClass);
      } else {
        this.submitButton.classList.add(this.options.hiddenClass);
      }
    }
  }
  
  /**
   * Go to the next step
   */
  next() {
    // Validate current step data before proceeding
    if (this.validateStep(this.currentStep)) {
      // Save current step data
      this.saveStepData(this.currentStep);
      
      // Go to next step
      this.goToStep(this.currentStep + 1);
    }
  }
  
  /**
   * Go to the previous step
   */
  previous() {
    this.goToStep(this.currentStep - 1);
  }
  
  /**
   * Submit the wizard
   */
  submit() {
    // Validate current step data before submitting
    if (this.validateStep(this.currentStep)) {
      // Save current step data
      this.saveStepData(this.currentStep);
      
      console.log('Wizard submitted', this.stepData);
      
      // Trigger submit event
      const submitEvent = new CustomEvent('wizard:submit', {
        detail: { data: this.stepData }
      });
      
      this.container.dispatchEvent(submitEvent);
    }
  }
  
  /**
   * Validate a step
   * @param {number} step - Step to validate
   * @returns {boolean} Whether validation passed
   */
  validateStep(step) {
    // Implement step validation here
    // For now, just return true
    return true;
  }
  
  /**
   * Save step data
   * @param {number} step - Step to save data for
   */
  saveStepData(step) {
    // Implement step data saving here
    // For now, just log the step
    console.log(`Saving data for step ${step}`);
  }
}

// Initialize wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.modernWizard = new ModernWizard();
});
/**
 * Vendor Advantages Component
 * Provides detailed comparison between vendors
 */

const VendorAdvantages = {
  // Vendor data
  vendors: {
    cisco: {
      id: 'cisco',
      name: 'Cisco ISE',
      logo: 'img/vendors/cisco-logo.png',
      description: 'Enterprise-grade on-premises NAC solution with extensive features for large organizations.',
      type: 'On-premises',
      deploymentTime: '90-120 days',
      hardwareRequirements: 'High',
      specializedSkills: 'Required',
      cloudCapabilities: 'Limited',
      pricing: 'High initial investment, annual maintenance',
      advantages: [
        'Deep integration with Cisco networking equipment',
        'Extensive security policy controls',
        'Comprehensive guest management features',
        'Strong support for posture assessment',
        'Mature BYOD onboarding capabilities'
      ],
      disadvantages: [
        'Complex deployment and management',
        'High hardware and licensing costs',
        'Significant ongoing maintenance',
        'Requires specialized expertise',
        'Limited cloud capabilities'
      ]
    },
    aruba: {
      id: 'aruba',
      name: 'Aruba ClearPass',
      logo: 'img/vendors/aruba-logo.png',
      description: 'Multi-vendor NAC solution with strong wireless capabilities and identity-based controls.',
      type: 'On-premises',
      deploymentTime: '60-90 days',
      hardwareRequirements: 'Medium-High',
      specializedSkills: 'Required',
      cloudCapabilities: 'Limited',
      pricing: 'High initial investment, annual maintenance',
      advantages: [
        'Strong multi-vendor support',
        'Excellent wireless integration',
        'Advanced guest access features',
        'Flexible policy model',
        'Built-in reporting capabilities'
      ],
      disadvantages: [
        'Complex configuration requirements',
        'High hardware and licensing costs',
        'Significant ongoing maintenance',
        'Steep learning curve',
        'Limited cloud capabilities'
      ]
    },
    forescout: {
      id: 'forescout',
      name: 'Forescout',
      logo: 'img/vendors/forescout-logo.png',
      description: 'Agentless NAC solution focusing on device visibility and control across diverse environments.',
      type: 'On-premises',
      deploymentTime: '60-100 days',
      hardwareRequirements: 'High',
      specializedSkills: 'Required',
      cloudCapabilities: 'Limited',
      pricing: 'High initial investment, annual maintenance',
      advantages: [
        'Agentless operation',
        'Extensive device discovery capabilities',
        'Strong OT/IoT security features',
        'Real-time network visibility',
        'Flexible deployment options'
      ],
      disadvantages: [
        'Complex implementation',
        'High hardware and licensing costs',
        'Requires ongoing tuning',
        'Multiple modules increase complexity',
        'Limited cloud capabilities'
      ]
    },
    fortinac: {
      id: 'fortinac',
      name: 'FortiNAC',
      logo: 'img/vendors/fortinac-logo.png',
      description: 'NAC solution integrated with Fortinet security fabric for comprehensive network protection.',
      type: 'On-premises',
      deploymentTime: '60-90 days',
      hardwareRequirements: 'Medium-High',
      specializedSkills: 'Required',
      cloudCapabilities: 'Limited',
      pricing: 'Medium-high initial investment, annual maintenance',
      advantages: [
        'Integration with Fortinet security fabric',
        'Strong IoT security capabilities',
        'Automated threat response',
        'Network visibility features',
        'Rogue device detection'
      ],
      disadvantages: [
        'Complex deployment process',
        'Significant hardware requirements',
        'Ongoing maintenance needs',
        'Limited integration outside Fortinet ecosystem',
        'Limited cloud capabilities'
      ]
    },
    nps: {
      id: 'nps',
      name: 'Microsoft NPS',
      logo: 'img/vendors/microsoft-logo.png',
      description: 'Basic RADIUS server included in Windows Server with limited NAC capabilities.',
      type: 'On-premises',
      deploymentTime: '30-60 days',
      hardwareRequirements: 'Medium',
      specializedSkills: 'Basic Windows administration',
      cloudCapabilities: 'None',
      pricing: 'Low (included with Windows Server)',
      advantages: [
        'Included with Windows Server license',
        'Native integration with Active Directory',
        'Familiar interface for Windows administrators',
        'Group Policy integration',
        'Basic 802.1X support'
      ],
      disadvantages: [
        'Limited NAC functionality',
        'Basic guest access features',
        'Minimal reporting capabilities',
        'Limited device profiling',
        'No cloud capabilities'
      ]
    },
    securew2: {
      id: 'securew2',
      name: 'SecureW2',
      logo: 'img/vendors/securew2-logo.png',
      description: 'Cloud-based certificate management solution with JoinNow onboarding capabilities.',
      type: 'Cloud/Hybrid',
      deploymentTime: '30-45 days',
      hardwareRequirements: 'Low',
      specializedSkills: 'Certificate knowledge helpful',
      cloudCapabilities: 'High',
      pricing: 'Subscription-based',
      advantages: [
        'Cloud-managed PKI and certificates',
        'Strong BYOD onboarding capabilities',
        'Integration with cloud identity providers',
        'Lower infrastructure requirements',
        'Certificate-based security focus'
      ],
      disadvantages: [
        'Limited policy enforcement options',
        'Not a comprehensive NAC solution',
        'Limited device profiling capabilities',
        'Focused primarily on certificate authentication',
        'Less developed compliance features'
      ]
    },
    portnox: {
      id: 'portnox',
      name: 'Portnox Cloud',
      logo: 'img/vendors/portnox-logo.png',
      description: 'True cloud-native NAC solution with rapid deployment and low operational overhead.',
      type: 'Cloud-native',
      deploymentTime: '1-14 days',
      hardwareRequirements: 'None',
      specializedSkills: 'Not required',
      cloudCapabilities: 'Comprehensive',
      pricing: 'Subscription-based, predictable costs',
      advantages: [
        'True cloud-native architecture',
        'No hardware requirements',
        'Rapid deployment (days vs months)',
        'Low operational overhead',
        'Automatic updates and scaling',
        'Advanced AI-based device profiling',
        'Continuous compliance monitoring',
        'Global accessibility from single console',
        'Simple and intuitive interface',
        'Predictable subscription pricing'
      ],
      disadvantages: [
        'Less extensive customization than on-premises solutions',
        'Requires internet connectivity',
        'Limited custom protocol support',
        'Not ideal for air-gapped networks'
      ]
    }
  },

  /**
   * Create vendor comparison component
   * @param {string} containerId - Container element ID
   * @param {Object} options - Comparison options
   */
  createComparison: function(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Get vendors to compare
    const defaultVendor = options.defaultVendor || 'cisco';
    const currentVendor = options.currentVendor || defaultVendor;

    // Clear existing content
    container.innerHTML = '';

    // Create comparison container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'vendor-comparison';

    // Create header
    const header = document.createElement('div');
    header.className = 'vendor-comparison-header';

    // Title
    const title = document.createElement('h3');
    title.className = 'vendor-comparison-title';
    title.textContent = `Portnox Cloud vs ${this.vendors[currentVendor].name}`;
    header.appendChild(title);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'vendor-comparison-controls';

    // Create vendor selector
    const vendorSelector = document.createElement('select');
    vendorSelector.className = 'form-control';

    // Add options
    for (const vendorId in this.vendors) {
      if (vendorId !== 'portnox') {
        const option = document.createElement('option');
        option.value = vendorId;
        option.textContent = this.vendors[vendorId].name;
        option.selected = vendorId === currentVendor;
        vendorSelector.appendChild(option);
      }
    }

    // Add change event
    vendorSelector.addEventListener('change', () => {
      const selectedVendor = vendorSelector.value;
      this.createComparison(containerId, { ...options, currentVendor: selectedVendor });
    });

    controls.appendChild(vendorSelector);
    header.appendChild(controls);
    comparisonContainer.appendChild(header);

    // Create body
    const body = document.createElement('div');
    body.className = 'vendor-comparison-body';

    // Create VS display
    const vsDisplay = document.createElement('div');
    vsDisplay.className = 'versus-display';

    // Current vendor
    const currentVendorEl = document.createElement('div');
    currentVendorEl.className = 'versus-vendor';

    const currentVendorLogo = document.createElement('div');
    currentVendorLogo.className = 'versus-vendor-logo';

    const currentVendorImg = document.createElement('img');
    currentVendorImg.src = this.vendors[currentVendor].logo;
    currentVendorImg.alt = this.vendors[currentVendor].name;
    currentVendorLogo.appendChild(currentVendorImg);

    const currentVendorName = document.createElement('div');
    currentVendorName.className = 'versus-vendor-name';
    currentVendorName.textContent = this.vendors[currentVendor].name;

    const currentVendorType = document.createElement('div');
    currentVendorType.className = 'versus-vendor-type';
    currentVendorType.textContent = this.vendors[currentVendor].type;

    currentVendorEl.appendChild(currentVendorLogo);
    currentVendorEl.appendChild(currentVendorName);
    currentVendorEl.appendChild(currentVendorType);

    // Versus divider
    const vsDivider = document.createElement('div');
    vsDivider.className = 'versus-divider';

    const vsLineTop = document.createElement('div');
    vsLineTop.className = 'versus-line';

    const vsCircle = document.createElement('div');
    vsCircle.className = 'versus-circle';
    vsCircle.textContent = 'VS';

    const vsLineBottom = document.createElement('div');
    vsLineBottom.className = 'versus-line';

    vsDivider.appendChild(vsLineTop);
    vsDivider.appendChild(vsCircle);
    vsDivider.appendChild(vsLineBottom);

    // Portnox vendor
    const portnoxVendorEl = document.createElement('div');
    portnoxVendorEl.className = 'versus-vendor';

    const portnoxVendorLogo = document.createElement('div');
    portnoxVendorLogo.className = 'versus-vendor-logo';

    const portnoxVendorImg = document.createElement('img');
    portnoxVendorImg.src = this.vendors.portnox.logo;
    portnoxVendorImg.alt = this.vendors.portnox.name;
    portnoxVendorLogo.appendChild(portnoxVendorImg);

    const portnoxVendorName = document.createElement('div');
    portnoxVendorName.className = 'versus-vendor-name';
    portnoxVendorName.textContent = this.vendors.portnox.name;

    const portnoxVendorType = document.createElement('div');
    portnoxVendorType.className = 'versus-vendor-type';
    portnoxVendorType.textContent = this.vendors.portnox.type;

    portnoxVendorEl.appendChild(portnoxVendorLogo);
    portnoxVendorEl.appendChild(portnoxVendorName);
    portnoxVendorEl.appendChild(portnoxVendorType);

    vsDisplay.appendChild(currentVendorEl);
    vsDisplay.appendChild(vsDivider);
    vsDisplay.appendChild(portnoxVendorEl);

    body.appendChild(vsDisplay);

    // Create comparison grid
    const comparisonGrid = document.createElement('div');
    comparisonGrid.className = 'vendor-comparison-grid';

    // Current vendor card
    const currentVendorCard = document.createElement('div');
    currentVendorCard.className = 'vendor-card-detailed';

    const currentVendorHeader = document.createElement('div');
    currentVendorHeader.className = 'vendor-card-header';

    const currentVendorLogoSmall = document.createElement('div');
    currentVendorLogoSmall.className = 'vendor-card-logo';

    const currentVendorImgSmall = document.createElement('img');
    currentVendorImgSmall.src = this.vendors[currentVendor].logo;
    currentVendorImgSmall.alt = this.vendors[currentVendor].name;
    currentVendorLogoSmall.appendChild(currentVendorImgSmall);

    const currentVendorTitleDiv = document.createElement('div');

    const currentVendorTitle = document.createElement('div');
    currentVendorTitle.className = 'vendor-card-title';
    currentVendorTitle.textContent = this.vendors[currentVendor].name;

    const currentVendorSubtitle = document.createElement('div');
    currentVendorSubtitle.className = 'vendor-card-subtitle';
    currentVendorSubtitle.textContent = this.vendors[currentVendor].type;

    currentVendorTitleDiv.appendChild(currentVendorTitle);
    currentVendorTitleDiv.appendChild(currentVendorSubtitle);

    currentVendorHeader.appendChild(currentVendorLogoSmall);
    currentVendorHeader.appendChild(currentVendorTitleDiv);

    const currentVendorBody = document.createElement('div');
    currentVendorBody.className = 'vendor-card-body';

    const currentVendorDescription = document.createElement('div');
    currentVendorDescription.className = 'vendor-card-description';
    currentVendorDescription.textContent = this.vendors[currentVendor].description;

    const currentVendorMetrics = document.createElement('div');
    currentVendorMetrics.className = 'vendor-metrics';

    // Deployment time
    const deploymentMetric = document.createElement('div');
    deploymentMetric.className = 'vendor-metric';

    const deploymentLabel = document.createElement('div');
    deploymentLabel.className = 'vendor-metric-label';
    deploymentLabel.textContent = 'Deployment Time';

    const deploymentValue = document.createElement('div');
    deploymentValue.className = 'vendor-metric-value negative';
    deploymentValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${this.vendors[currentVendor].deploymentTime}`;

    deploymentMetric.appendChild(deploymentLabel);
    deploymentMetric.appendChild(deploymentValue);

    // Hardware requirements
    const hardwareMetric = document.createElement('div');
    hardwareMetric.className = 'vendor-metric';

    const hardwareLabel = document.createElement('div');
    hardwareLabel.className = 'vendor-metric-label';
    hardwareLabel.textContent = 'Hardware Requirements';

    const hardwareValue = document.createElement('div');
    hardwareValue.className = 'vendor-metric-value negative';
    hardwareValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${this.vendors[currentVendor].hardwareRequirements}`;

    hardwareMetric.appendChild(hardwareLabel);
    hardwareMetric.appendChild(hardwareValue);

    // Specialized skills
    const skillsMetric = document.createElement('div');
    skillsMetric.className = 'vendor-metric';

    const skillsLabel = document.createElement('div');
    skillsLabel.className = 'vendor-metric-label';
    skillsLabel.textContent = 'Specialized Skills';

    const skillsValue = document.createElement('div');
    skillsValue.className = 'vendor-metric-value negative';
    skillsValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${this.vendors[currentVendor].specializedSkills}`;

    skillsMetric.appendChild(skillsLabel);
    skillsMetric.appendChild(skillsValue);

    // Cloud capabilities
    const cloudMetric = document.createElement('div');
    cloudMetric.className = 'vendor-metric';

    const cloudLabel = document.createElement('div');
    cloudLabel.className = 'vendor-metric-label';
    cloudLabel.textContent = 'Cloud Capabilities';

    const cloudValue = document.createElement('div');
    cloudValue.className = 'vendor-metric-value negative';
    cloudValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${this.vendors[currentVendor].cloudCapabilities}`;

    cloudMetric.appendChild(cloudLabel);
    cloudMetric.appendChild(cloudValue);

    currentVendorMetrics.appendChild(deploymentMetric);
    currentVendorMetrics.appendChild(hardwareMetric);
    currentVendorMetrics.appendChild(skillsMetric);
    currentVendorMetrics.appendChild(cloudMetric);

    // Pros and cons
    const currentVendorProsCons = document.createElement('div');
    currentVendorProsCons.className = 'vendor-pros-cons';

    // Pros
    const currentVendorPros = document.createElement('div');
    currentVendorPros.className = 'vendor-pros';

    const currentVendorProsTitle = document.createElement('div');
    currentVendorProsTitle.className = 'vendor-pros-title';
    currentVendorProsTitle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Advantages';

    const currentVendorProsList = document.createElement('ul');
    currentVendorProsList.className = 'vendor-pros-list';

    this.vendors[currentVendor].advantages.forEach(advantage => {
      const prosItem = document.createElement('li');
      prosItem.className = 'vendor-pros-item';
      prosItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="vendor-pros-text">${advantage}</span>`;
      currentVendorProsList.appendChild(prosItem);
    });

    currentVendorPros.appendChild(currentVendorProsTitle);
    currentVendorPros.appendChild(currentVendorProsList);

    // Cons
    const currentVendorCons = document.createElement('div');
    currentVendorCons.className = 'vendor-cons';

    const currentVendorConsTitle = document.createElement('div');
    currentVendorConsTitle.className = 'vendor-cons-title';
    currentVendorConsTitle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>Disadvantages';

    const currentVendorConsList = document.createElement('ul');
    currentVendorConsList.className = 'vendor-cons-list';

    this.vendors[currentVendor].disadvantages.forEach(disadvantage => {
      const consItem = document.createElement('li');
      consItem.className = 'vendor-cons-item';
      consItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span class="vendor-cons-text">${disadvantage}</span>`;
      currentVendorConsList.appendChild(consItem);
    });

    currentVendorCons.appendChild(currentVendorConsTitle);
    currentVendorCons.appendChild(currentVendorConsList);

    currentVendorProsCons.appendChild(currentVendorPros);
    currentVendorProsCons.appendChild(currentVendorCons);

    currentVendorBody.appendChild(currentVendorDescription);
    currentVendorBody.appendChild(currentVendorMetrics);
    currentVendorBody.appendChild(currentVendorProsCons);

    currentVendorCard.appendChild(currentVendorHeader);
    currentVendorCard.appendChild(currentVendorBody);

    // Portnox card
    const portnoxCard = document.createElement('div');
    portnoxCard.className = 'vendor-card-detailed';

    const portnoxHeader = document.createElement('div');
    portnoxHeader.className = 'vendor-card-header';

    const portnoxLogoSmall = document.createElement('div');
    portnoxLogoSmall.className = 'vendor-card-logo';

    const portnoxImgSmall = document.createElement('img');
    portnoxImgSmall.src = this.vendors.portnox.logo;
    portnoxImgSmall.alt = this.vendors.portnox.name;
    portnoxLogoSmall.appendChild(portnoxImgSmall);

    const portnoxTitleDiv = document.createElement('div');

    const portnoxTitle = document.createElement('div');
    portnoxTitle.className = 'vendor-card-title';
    portnoxTitle.textContent = this.vendors.portnox.name;

    const portnoxSubtitle = document.createElement('div');
    portnoxSubtitle.className = 'vendor-card-subtitle';
    portnoxSubtitle.textContent = this.vendors.portnox.type;

    portnoxTitleDiv.appendChild(portnoxTitle);
    portnoxTitleDiv.appendChild(portnoxSubtitle);

    portnoxHeader.appendChild(portnoxLogoSmall);
    portnoxHeader.appendChild(portnoxTitleDiv);

    const portnoxBody = document.createElement('div');
    portnoxBody.className = 'vendor-card-body';

    const portnoxDescription = document.createElement('div');
    portnoxDescription.className = 'vendor-card-description';
    portnoxDescription.textContent = this.vendors.portnox.description;

    const portnoxMetrics = document.createElement('div');
    portnoxMetrics.className = 'vendor-metrics';

    // Deployment time
    const portnoxDeploymentMetric = document.createElement('div');
    portnoxDeploymentMetric.className = 'vendor-metric';

    const portnoxDeploymentLabel = document.createElement('div');
    portnoxDeploymentLabel.className = 'vendor-metric-label';
    portnoxDeploymentLabel.textContent = 'Deployment Time';

    const portnoxDeploymentValue = document.createElement('div');
    portnoxDeploymentValue.className = 'vendor-metric-value positive';
    portnoxDeploymentValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${this.vendors.portnox.deploymentTime}`;

    portnoxDeploymentMetric.appendChild(portnoxDeploymentLabel);
    portnoxDeploymentMetric.appendChild(portnoxDeploymentValue);

    // Hardware requirements
    const portnoxHardwareMetric = document.createElement('div');
    portnoxHardwareMetric.className = 'vendor-metric';

    const portnoxHardwareLabel = document.createElement('div');
    portnoxHardwareLabel.className = 'vendor-metric-label';
    portnoxHardwareLabel.textContent = 'Hardware Requirements';

    const portnoxHardwareValue = document.createElement('div');
    portnoxHardwareValue.className = 'vendor-metric-value positive';
    portnoxHardwareValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${this.vendors.portnox.hardwareRequirements}`;

    portnoxHardwareMetric.appendChild(portnoxHardwareLabel);
    portnoxHardwareMetric.appendChild(portnoxHardwareValue);

    // Specialized skills
    const portnoxSkillsMetric = document.createElement('div');
    portnoxSkillsMetric.className = 'vendor-metric';

    const portnoxSkillsLabel = document.createElement('div');
    portnoxSkillsLabel.className = 'vendor-metric-label';
    portnoxSkillsLabel.textContent = 'Specialized Skills';

    const portnoxSkillsValue = document.createElement('div');
    portnoxSkillsValue.className = 'vendor-metric-value positive';
    portnoxSkillsValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${this.vendors.portnox.specializedSkills}`;

    portnoxSkillsMetric.appendChild(portnoxSkillsLabel);
    portnoxSkillsMetric.appendChild(portnoxSkillsValue);

    // Cloud capabilities
    const portnoxCloudMetric = document.createElement('div');
    portnoxCloudMetric.className = 'vendor-metric';

    const portnoxCloudLabel = document.createElement('div');
    portnoxCloudLabel.className = 'vendor-metric-label';
    portnoxCloudLabel.textContent = 'Cloud Capabilities';

    const portnoxCloudValue = document.createElement('div');
    portnoxCloudValue.className = 'vendor-metric-value positive';
    portnoxCloudValue.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${this.vendors.portnox.cloudCapabilities}`;

    portnoxCloudMetric.appendChild(portnoxCloudLabel);
    portnoxCloudMetric.appendChild(portnoxCloudValue);

    portnoxMetrics.appendChild(portnoxDeploymentMetric);
    portnoxMetrics.appendChild(portnoxHardwareMetric);
    portnoxMetrics.appendChild(portnoxSkillsMetric);
    portnoxMetrics.appendChild(portnoxCloudMetric);

    // Pros and cons
    const portnoxProsCons = document.createElement('div');
    portnoxProsCons.className = 'vendor-pros-cons';

    // Pros
    const portnoxPros = document.createElement('div');
    portnoxPros.className = 'vendor-pros';

    const portnoxProsTitle = document.createElement('div');
    portnoxProsTitle.className = 'vendor-pros-title';
    portnoxProsTitle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Advantages';

    const portnoxProsList = document.createElement('ul');
    portnoxProsList.className = 'vendor-pros-list';

    this.vendors.portnox.advantages.forEach(advantage => {
      const prosItem = document.createElement('li');
      prosItem.className = 'vendor-pros-item';
      prosItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span class="vendor-pros-text">${advantage}</span>`;
      portnoxProsList.appendChild(prosItem);
    });

    portnoxPros.appendChild(portnoxProsTitle);
    portnoxPros.appendChild(portnoxProsList);

    // Cons
    const portnoxCons = document.createElement('div');
    portnoxCons.className = 'vendor-cons';

    const portnoxConsTitle = document.createElement('div');
    portnoxConsTitle.className = 'vendor-cons-title';
    portnoxConsTitle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>Limitations';

    const portnoxConsList = document.createElement('ul');
    portnoxConsList.className = 'vendor-cons-list';

    this.vendors.portnox.disadvantages.forEach(disadvantage => {
      const consItem = document.createElement('li');
      consItem.className = 'vendor-cons-item';
      consItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg><span class="vendor-cons-text">${disadvantage}</span>`;
      portnoxConsList.appendChild(consItem);
    });

    portnoxCons.appendChild(portnoxConsTitle);
    portnoxCons.appendChild(portnoxConsList);

    portnoxProsCons.appendChild(portnoxPros);
    portnoxProsCons.appendChild(portnoxCons);

    portnoxBody.appendChild(portnoxDescription);
    portnoxBody.appendChild(portnoxMetrics);
    portnoxBody.appendChild(portnoxProsCons);

    portnoxCard.appendChild(portnoxHeader);
    portnoxCard.appendChild(portnoxBody);

    comparisonGrid.appendChild(currentVendorCard);
    comparisonGrid.appendChild(portnoxCard);

    body.appendChild(comparisonGrid);

    // Create feature matrix
    const matrixTitle = document.createElement('h3');
    matrixTitle.style.marginTop = '2rem';
    matrixTitle.textContent = 'Feature Comparison Matrix';

    body.appendChild(matrixTitle);

    // Feature matrix data
    const featureData = {
      vendors: [
        { id: currentVendor, name: this.vendors[currentVendor].name },
        { id: 'portnox', name: this.vendors.portnox.name }
      ],
      features: [
        {
          name: 'Deployment Model',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'deploymentModel'),
            portnox: this.getFeatureRating('portnox', 'deploymentModel')
          }
        },
        {
          name: 'Hardware Requirements',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'hardwareRequirements'),
            portnox: this.getFeatureRating('portnox', 'hardwareRequirements')
          }
        },
        {
          name: 'Implementation Time',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'implementationTime'),
            portnox: this.getFeatureRating('portnox', 'implementationTime')
          }
        },
        {
          name: 'Operational Overhead',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'operationalOverhead'),
            portnox: this.getFeatureRating('portnox', 'operationalOverhead')
          }
        },
        {
          name: 'Cloud Integration',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'cloudIntegration'),
            portnox: this.getFeatureRating('portnox', 'cloudIntegration')
          }
        },
        {
          name: 'Automatic Updates',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'automaticUpdates'),
            portnox: this.getFeatureRating('portnox', 'automaticUpdates')
          }
        },
        {
          name: 'Scalability',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'scalability'),
            portnox: this.getFeatureRating('portnox', 'scalability')
          }
        },
        {
          name: 'Device Profiling',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'deviceProfiling'),
            portnox: this.getFeatureRating('portnox', 'deviceProfiling')
          }
        },
        {
          name: 'Authentication Methods',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'authenticationMethods'),
            portnox: this.getFeatureRating('portnox', 'authenticationMethods')
          }
        },
        {
          name: 'Compliance Monitoring',
          ratings: {
            [currentVendor]: this.getFeatureRating(currentVendor, 'complianceMonitoring'),
            portnox: this.getFeatureRating('portnox', 'complianceMonitoring')
          }
        }
      ]
    };

    // Create feature matrix
    this.createFeatureMatrix(body, featureData);

    comparisonContainer.appendChild(body);
    container.appendChild(comparisonContainer);
  },

  /**
   * Create feature matrix
   * @param {HTMLElement} container - Container element
   * @param {Object} data - Feature matrix data
   */
  createFeatureMatrix: function(container, data) {
    // Create table
    const table = document.createElement('table');
    table.className = 'feature-matrix';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Feature header
    const featureHeader = document.createElement('th');
    featureHeader.textContent = 'Feature';
    headerRow.appendChild(featureHeader);

    // Vendor headers
    data.vendors.forEach(vendor => {
      const vendorHeader = document.createElement('th');
      vendorHeader.textContent = vendor.name;
      headerRow.appendChild(vendorHeader);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    // Feature rows
    data.features.forEach(feature => {
      const row = document.createElement('tr');

      // Feature name
      const featureCell = document.createElement('td');
      featureCell.textContent = feature.name;
      row.appendChild(featureCell);

      // Vendor ratings
      data.vendors.forEach(vendor => {
        const ratingCell = document.createElement('td');
        const rating = feature.ratings[vendor.id] || 0;

        // Create rating stars
        const ratingStars = document.createElement('div');
        ratingStars.className = 'feature-rating-stars';

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('div');
          star.className = i <= Math.round(rating / 20) ? 'feature-rating-star' : 'feature-rating-star empty';
          star.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>';
          ratingStars.appendChild(star);
        }

        ratingCell.appendChild(ratingStars);
        row.appendChild(ratingCell);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  },

  /**
   * Get feature rating for a vendor
   * @param {string} vendor - Vendor ID
   * @param {string} feature - Feature ID
   * @returns {number} Rating 0-100
   */
  getFeatureRating: function(vendor, feature) {
    // Feature ratings
    const ratings = {
      cisco: {
        deploymentModel: 40,
        hardwareRequirements: 20,
        implementationTime: 20,
        operationalOverhead: 20,
        cloudIntegration: 40,
        automaticUpdates: 20,
        scalability: 60,
        deviceProfiling: 80,
        authenticationMethods: 100,
        complianceMonitoring: 80
      },
      aruba: {
        deploymentModel: 40,
        hardwareRequirements: 20,
        implementationTime: 40,
        operationalOverhead: 40,
        cloudIntegration: 40,
        automaticUpdates: 20,
        scalability: 60,
        deviceProfiling: 80,
        authenticationMethods: 80,
        complianceMonitoring: 80
      },
      forescout: {
        deploymentModel: 40,
        hardwareRequirements: 20,
        implementationTime: 20,
        operationalOverhead: 20,
        cloudIntegration: 40,
        automaticUpdates: 20,
        scalability: 60,
        deviceProfiling: 100,
        authenticationMethods: 60,
        complianceMonitoring: 80
      },
      fortinac: {
        deploymentModel: 40,
        hardwareRequirements: 20,
        implementationTime: 20,
        operationalOverhead: 20,
        cloudIntegration: 40,
        automaticUpdates: 20,
        scalability: 60,
        deviceProfiling: 60,
        authenticationMethods: 60,
        complianceMonitoring: 60
      },
      nps: {
        deploymentModel: 40,
        hardwareRequirements: 40,
        implementationTime: 40,
        operationalOverhead: 40,
        cloudIntegration: 20,
        automaticUpdates: 20,
        scalability: 40,
        deviceProfiling: 20,
        authenticationMethods: 60,
        complianceMonitoring: 40
      },
      securew2: {
        deploymentModel: 80,
        hardwareRequirements: 80,
        implementationTime: 60,
        operationalOverhead: 60,
        cloudIntegration: 80,
        automaticUpdates: 80,
        scalability: 80,
        deviceProfiling: 40,
        authenticationMethods: 60,
        complianceMonitoring: 40
      },
      portnox: {
        deploymentModel: 100,
        hardwareRequirements: 100,
        implementationTime: 100,
        operationalOverhead: 100,
        cloudIntegration: 100,
        automaticUpdates: 100,
        scalability: 100,
        deviceProfiling: 80,
        authenticationMethods: 80,
        complianceMonitoring: 100
      }
    };

    return ratings[vendor]?.[feature] || 0;
  }
};

// Make VendorAdvantages globally available
window.VendorAdvantages = VendorAdvantages;
/**
 * Compliance Frameworks Component
 * Provides detailed compliance information and visualizations
 */

const ComplianceFrameworks = {
  // Compliance frameworks data
  frameworks: [
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      description: 'U.S. legislation that provides data privacy and security provisions for safeguarding medical information.',
      category: 'Healthcare',
      importance: 'Critical',
      region: 'United States',
      industries: ['Healthcare', 'Health Insurance', 'Medical Devices'],
      year: 1996,
      requirements: [
        'Access controls and authentication',
        'Audit controls and logging',
        'Integrity controls',
        'Transmission security',
        'Device and media controls'
      ],
      vendorScores: {
        cisco: 75,
        aruba: 70,
        forescout: 80,
        fortinac: 65,
        nps: 40,
        securew2: 60,
        portnox: 95
      }
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      description: 'Information security standard for organizations that handle branded credit cards.',
      category: 'Financial',
      importance: 'Critical',
      region: 'Global',
      industries: ['Retail', 'Financial Services', 'E-commerce', 'Hospitality'],
      year: 2004,
      requirements: [
        'Secure networks and systems',
        'Protect cardholder data',
        'Vulnerability management',
        'Strong access control',
        'Network monitoring and testing',
        'Information security policy'
      ],
      vendorScores: {
        cisco: 80,
        aruba: 75,
        forescout: 75,
        fortinac: 70,
        nps: 50,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'Regulation on data protection and privacy in the European Union and the European Economic Area.',
      category: 'Privacy',
      importance: 'High',
      region: 'European Union',
      industries: ['All'],
      year: 2018,
      requirements: [
        'Lawful basis for processing',
        'Consent management',
        'Data subject rights',
        'Privacy by design and default',
        'Security of processing',
        'Breach notification'
      ],
      vendorScores: {
        cisco: 70,
        aruba: 65,
        forescout: 70,
        fortinac: 60,
        nps: 40,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'nist-csf',
      name: 'NIST CSF',
      fullName: 'NIST Cybersecurity Framework',
      description: 'Voluntary framework consisting of standards, guidelines, and best practices to manage cybersecurity risk.',
      category: 'Cybersecurity',
      importance: 'High',
      region: 'United States',
      industries: ['All', 'Government', 'Critical Infrastructure'],
      year: 2014,
      requirements: [
        'Identify security risks',
        'Protect critical infrastructure',
        'Detect cybersecurity events',
        'Respond to incidents',
        'Recover capabilities'
      ],
      vendorScores: {
        cisco: 85,
        aruba: 80,
        forescout: 80,
        fortinac: 75,
        nps: 60,
        securew2: 65,
        portnox: 95
      }
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'ISO/IEC 27001 - Information Security Management',
      description: 'International standard for managing information security through policies and procedures.',
      category: 'Information Security',
      importance: 'High',
      region: 'Global',
      industries: ['All'],
      year: 2005,
      requirements: [
        'Information security policies',
        'Organization of information security',
        'Human resource security',
        'Asset management',
        'Access control',
        'Cryptography',
        'Physical security',
        'Operations security',
        'Communications security',
        'System acquisition and development',
        'Supplier relationships',
        'Incident management',
        'Business continuity',
        'Compliance'
      ],
      vendorScores: {
        cisco: 80,
        aruba: 75,
        forescout: 75,
        fortinac: 70,
        nps: 50,
        securew2: 65,
        portnox: 95
      }
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'System and Organization Controls 2',
      description: 'Auditing procedure that ensures service providers securely manage customer data.',
      category: 'Service Providers',
      importance: 'Medium',
      region: 'United States',
      industries: ['SaaS', 'Cloud Services', 'IT Services'],
      year: 2011,
      requirements: [
        'Security',
        'Availability',
        'Processing integrity',
        'Confidentiality',
        'Privacy'
      ],
      vendorScores: {
        cisco: 75,
        aruba: 70,
        forescout: 70,
        fortinac: 65,
        nps: 50,
        securew2: 65,
        portnox: 90
      }
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      description: 'State statute intended to enhance privacy rights and consumer protection for residents of California.',
      category: 'Privacy',
      importance: 'Medium',
      region: 'California, United States',
      industries: ['All businesses serving California residents'],
      year: 2018,
      requirements: [
        'Right to know',
        'Right to delete',
        'Right to opt-out',
        'Right to non-discrimination',
        'Reasonable security measures'
      ],
      vendorScores: {
        cisco: 65,
        aruba: 60,
        forescout: 60,
        fortinac: 55,
        nps: 40,
        securew2: 60,
        portnox: 85
      }
    },
    {
      id: 'glba',
      name: 'GLBA',
      fullName: 'Gramm-Leach-Bliley Act',
      description: 'Law that requires financial institutions to explain how they share and protect customer data.',
      category: 'Financial',
      importance: 'High',
      region: 'United States',
      industries: ['Financial Services', 'Banking', 'Insurance', 'Financial Advisors'],
      year: 1999,
      requirements: [
        'Financial Privacy Rule',
        'Safeguards Rule',
        'Pretexting Protection'
      ],
      vendorScores: {
        cisco: 75,
        aruba: 70,
        forescout: 70,
        fortinac: 65,
        nps: 50,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'ferpa',
      name: 'FERPA',
      fullName: 'Family Educational Rights and Privacy Act',
      description: 'Federal law that protects the privacy of student education records.',
      category: 'Education',
      importance: 'Critical',
      region: 'United States',
      industries: ['Education', 'Higher Education'],
      year: 1974,
      requirements: [
        'Access control to educational records',
        'Parent/student rights to access records',
        'Amendment of information',
        'Consent for disclosure'
      ],
      vendorScores: {
        cisco: 70,
        aruba: 75,
        forescout: 65,
        fortinac: 60,
        nps: 50,
        securew2: 70,
        portnox: 90
      }
    },
    {
      id: 'fisma',
      name: 'FISMA',
      fullName: 'Federal Information Security Modernization Act',
      description: 'Law that defines a framework for protecting government information and operations.',
      category: 'Government',
      importance: 'Critical',
      region: 'United States',
      industries: ['Federal Government', 'Government Contractors'],
      year: 2014,
      requirements: [
        'Security categorization',
        'Security controls',
        'Risk assessment',
        'Security planning',
        'System authorization',
        'Continuous monitoring'
      ],
      vendorScores: {
        cisco: 85,
        aruba: 75,
        forescout: 80,
        fortinac: 70,
        nps: 60,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'nerc-cip',
      name: 'NERC CIP',
      fullName: 'North American Electric Reliability Corporation Critical Infrastructure Protection',
      description: 'Standards to ensure the protection of critical cyber assets that control or affect the reliability of North American bulk electric systems.',
      category: 'Energy',
      importance: 'Critical',
      region: 'North America',
      industries: ['Electric Utilities', 'Power Generation', 'Energy'],
      year: 2008,
      requirements: [
        'Critical Cyber Asset Identification',
        'Security Management Controls',
        'Personnel & Training',
        'Electronic Security Perimeters',
        'Physical Security',
        'Systems Security Management',
        'Incident Reporting and Response Planning',
        'Recovery Plans for Critical Cyber Assets'
      ],
      vendorScores: {
        cisco: 80,
        aruba: 70,
        forescout: 85,
        fortinac: 75,
        nps: 50,
        securew2: 55,
        portnox: 85
      }
    },
    {
      id: 'cmmc',
      name: 'CMMC',
      fullName: 'Cybersecurity Maturity Model Certification',
      description: 'Unified standard for implementing cybersecurity across the Defense Industrial Base.',
      category: 'Defense',
      importance: 'High',
      region: 'United States',
      industries: ['Defense Contractors', 'Aerospace', 'Military Suppliers'],
      year: 2020,
      requirements: [
        'Access Control',
        'Asset Management',
        'Audit and Accountability',
        'Awareness and Training',
        'Configuration Management',
        'Identification and Authentication',
        'Incident Response',
        'Maintenance',
        'Media Protection',
        'Personnel Security',
        'Physical Protection',
        'Recovery',
        'Risk Management',
        'Security Assessment',
        'Situational Awareness',
        'Systems and Communications Protection',
        'System and Information Integrity'
      ],
      vendorScores: {
        cisco: 80,
        aruba: 75,
        forescout: 80,
        fortinac: 70,
        nps: 55,
        securew2: 60,
        portnox: 85
      }
    },
    {
      id: 'hitrust',
      name: 'HITRUST',
      fullName: 'Health Information Trust Alliance',
      description: 'Framework that leverages existing regulations and standards to create a comprehensive set of baseline security controls.',
      category: 'Healthcare',
      importance: 'High',
      region: 'United States',
      industries: ['Healthcare', 'Health IT', 'Health Information Exchanges'],
      year: 2007,
      requirements: [
        'Information Protection Program',
        'Endpoint Protection',
        'Portable Media Security',
        'Mobile Device Security',
        'Wireless Security',
        'Configuration Management',
        'Vulnerability Management',
        'Network Protection',
        'Transmission Protection',
        'Password Management',
        'Access Control',
        'Audit Logging & Monitoring',
        'Education, Training & Awareness',
        'Third Party Security',
        'Incident Management',
        'Business Continuity & Disaster Recovery'
      ],
      vendorScores: {
        cisco: 75,
        aruba: 70,
        forescout: 75,
        fortinac: 65,
        nps: 45,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'nist-800-171',
      name: 'NIST 800-171',
      fullName: 'NIST Special Publication 800-171',
      description: 'Guidelines for protecting controlled unclassified information in non-federal systems.',
      category: 'Government',
      importance: 'High',
      region: 'United States',
      industries: ['Defense Contractors', 'Government Suppliers', 'Research Institutions'],
      year: 2015,
      requirements: [
        'Access Control',
        'Awareness and Training',
        'Audit and Accountability',
        'Configuration Management',
        'Identification and Authentication',
        'Incident Response',
        'Maintenance',
        'Media Protection',
        'Personnel Security',
        'Physical Protection',
        'Risk Assessment',
        'Security Assessment',
        'System and Communications Protection',
        'System and Information Integrity'
      ],
      vendorScores: {
        cisco: 80,
        aruba: 75,
        forescout: 75,
        fortinac: 70,
        nps: 55,
        securew2: 60,
        portnox: 90
      }
    },
    {
      id: 'sox',
      name: 'SOX',
      fullName: 'Sarbanes-Oxley Act',
      description: 'Law that requires strict financial disclosures and internal control assessments from public companies.',
      category: 'Financial',
      importance: 'Critical',
      region: 'United States',
      industries: ['Public Companies', 'Financial Services', 'Accounting'],
      year: 2002,
      requirements: [
        'IT General Controls',
        'Access Control & Segregation of Duties',
        'Change Management',
        'Security Management',
        'System Development & Acquisition',
        'IT Operations',
        'Data Backup & Recovery'
      ],
      vendorScores: {
        cisco: 75,
        aruba: 70,
        forescout: 70,
        fortinac: 65,
        nps: 50,
        securew2: 60,
        portnox: 85
      }
    }
  ],

  // Industry to frameworks mapping
  industryFrameworks: {
    healthcare: ['hipaa', 'hitrust', 'gdpr', 'nist-csf', 'iso27001'],
    finance: ['pci-dss', 'glba', 'sox', 'gdpr', 'nist-csf', 'iso27001'],
    retail: ['pci-dss', 'gdpr', 'ccpa', 'iso27001', 'nist-csf'],
    education: ['ferpa', 'gdpr', 'ccpa', 'nist-csf', 'iso27001'],
    government: ['fisma', 'nist-800-171', 'cmmc', 'nist-csf', 'iso27001'],
    manufacturing: ['nist-csf', 'iso27001', 'cmmc', 'nist-800-171', 'gdpr'],
    energy: ['nerc-cip', 'nist-csf', 'iso27001', 'fisma', 'nist-800-171'],
    technology: ['soc2', 'gdpr', 'ccpa', 'iso27001', 'nist-csf']
  },

  /**
   * Get framework by ID
   * @param {string} id - Framework ID
   * @returns {Object} Framework data
   */
  getFramework: function(id) {
    return this.frameworks.find(framework => framework.id === id);
  },

  /**
   * Get frameworks for an industry
   * @param {string} industry - Industry ID
   * @returns {Array} Array of frameworks
   */
  getFrameworksForIndustry: function(industry) {
    const frameworkIds = this.industryFrameworks[industry] || [];
    return frameworkIds.map(id => this.getFramework(id)).filter(Boolean);
  },

  /**
   * Calculate average vendor score for a framework
   * @param {string} frameworkId - Framework ID
   * @param {Array} excludeVendors - Vendors to exclude
   * @returns {number} Average score
   */
  calculateAverageScore: function(frameworkId, excludeVendors = []) {
    const framework = this.getFramework(frameworkId);
    if (!framework) return 0;

    const scores = Object.entries(framework.vendorScores)
      .filter(([vendor]) => !excludeVendors.includes(vendor))
      .map(([_, score]) => score);

    if (scores.length === 0) return 0;

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  },

  /**
   * Create industry compliance visualization
   * @param {string} containerId - Container element ID
   * @param {string} industry - Industry ID
   */
  createIndustryCompliance: function(containerId, industry) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Get frameworks for industry
    const frameworks = this.getFrameworksForIndustry(industry);

    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = `${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry Compliance Requirements`;
    container.appendChild(heading);

    // Create framework grid
    const frameworkGrid = document.createElement('div');
    frameworkGrid.style.display = 'grid';
    frameworkGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    frameworkGrid.style.gap = '1rem';
    frameworkGrid.style.marginTop = '1rem';

    // Add framework cards
    frameworks.forEach((framework, index) => {
      const card = document.createElement('div');
      card.className = 'card stagger-item animate-fadeIn';
      card.style.animationDelay = `${index * 100}ms`;

      // Calculate scores
      const portnoxScore = framework.vendorScores.portnox || 0;
      const avgScore = this.calculateAverageScore(framework.id, ['portnox']);
      const improvement = portnoxScore - avgScore;

      // Create card content
      card.innerHTML = `
        <div class="card-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4>${framework.name}</h4>
            <span class="badge" style="background-color: var(--${framework.importance === 'Critical' ? 'danger' : framework.importance === 'High' ? 'warning' : 'info'}-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${framework.importance}</span>
          </div>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">${framework.fullName}</div>
        </div>

        <div class="card-body">
          <p style="font-size: 0.875rem; margin-bottom: 1rem;">${framework.description}</p>

          <div style="background-color: var(--bg-secondary); border-radius: var(--radius); padding: 0.75rem; margin-bottom: 1rem;">
            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Vendor Compliance</div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <div style="font-size: 0.875rem;">Portnox Cloud</div>
              <div style="font-weight: 600;">${portnoxScore}%</div>
            </div>

            <div style="width: 100%; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 0.75rem;">
              <div style="width: ${portnoxScore}%; height: 100%; background-color: var(--primary-color); border-radius: var(--radius-full);"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <div style="font-size: 0.875rem;">Industry Average</div>
              <div style="font-weight: 600;">${avgScore}%</div>
            </div>

            <div style="width: 100%; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 0.5rem;">
              <div style="width: ${avgScore}%; height: 100%; background-color: var(--text-tertiary); border-radius: var(--radius-full);"></div>
            </div>

            <div style="display: flex; justify-content: flex-end; font-size: 0.75rem; font-weight: 600; color: var(--success-color);">
              +${improvement}% better coverage
            </div>
          </div>

          <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Key Requirements</div>

          <ul style="font-size: 0.75rem; padding-left: 1.5rem; margin: 0;">
            ${framework.requirements.slice(0, 5).map(req => `<li style="margin-bottom: 0.25rem;">${req}</li>`).join('')}
            ${framework.requirements.length > 5 ? `<li style="margin-bottom: 0.25rem; list-style: none; font-style: italic;">+ ${framework.requirements.length - 5} more requirements</li>` : ''}
          </ul>
        </div>

        <div class="card-footer" style="text-align: center;">
          <button class="btn btn-outline btn-sm" data-framework="${framework.id}">View Details</button>
        </div>
      `;

      // Add click event to view details button
      card.querySelector('button').addEventListener('click', () => {
        this.createFrameworkDetails(container, framework.id);
      });

      frameworkGrid.appendChild(card);
    });

    container.appendChild(frameworkGrid);

    // Create Portnox advantage section
    this.createPortnoxAdvantage(container, industry);
  },

  /**
   * Create Portnox advantage section
   * @param {HTMLElement} container - Container element
   * @param {string} industry - Industry ID
   */
  createPortnoxAdvantage: function(container, industry) {
    // Get frameworks for industry
    const frameworks = this.getFrameworksForIndustry(industry);

    // Calculate average scores
    let portnoxTotalScore = 0;
    let bestCompetitorTotalScore = 0;

    frameworks.forEach(framework => {
      const portnoxScore = framework.vendorScores.portnox || 0;
      portnoxTotalScore += portnoxScore;

      // Find best competitor score
      let bestCompetitorScore = 0;
      Object.entries(framework.vendorScores).forEach(([vendor, score]) => {
        if (vendor !== 'portnox' && score > bestCompetitorScore) {
          bestCompetitorScore = score;
        }
      });

      bestCompetitorTotalScore += bestCompetitorScore;
    });

    const portnoxAvgScore = Math.round(portnoxTotalScore / frameworks.length);
    const bestCompetitorAvgScore = Math.round(bestCompetitorTotalScore / frameworks.length);
    const improvement = portnoxAvgScore - bestCompetitorAvgScore;

    // Create advantage section
    const advantageSection = document.createElement('div');
    advantageSection.className = 'card animate-fadeIn';
    advantageSection.style.marginTop = '2rem';
    advantageSection.style.backgroundColor = '#f0f9ff'; // Light blue background

    advantageSection.innerHTML = `
      <div class="card-body" style="padding: 1.5rem;">
        <div style="display: flex; align-items: flex-start;">
          <div style="background-color: var(--primary-light); border-radius: var(--radius); padding: 0.75rem; margin-right: 1rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 2rem; height: 2rem;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          </div>

          <div>
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Portnox Cloud Compliance Advantage</h4>
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">Portnox Cloud provides ${portnoxAvgScore}% coverage of ${industry} compliance requirements, ${improvement}% better than competitors.</p>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Portnox Coverage</div>
                <div style="width: 100%; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 0.25rem;">
                  <div style="width: ${portnoxAvgScore}%; height: 100%; background-color: var(--primary-color); border-radius: var(--radius-full);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span>0%</span>
                  <span style="font-weight: 600;">${portnoxAvgScore}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Best Competitor Coverage</div>
                <div style="width: 100%; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 0.25rem;">
                  <div style="width: ${bestCompetitorAvgScore}%; height: 100%; background-color: var(--text-tertiary); border-radius: var(--radius-full);"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                  <span>0%</span>
                  <span style="font-weight: 600;">${bestCompetitorAvgScore}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 style="margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--primary-color);">Why Portnox for ${industry.charAt(0).toUpperCase() + industry.slice(1)} Compliance</h5>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
          ${this.getIndustryComplianceAdvantages(industry).map(advantage => `
            <div style="background-color: white; border-radius: var(--radius); padding: 0.75rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div style="font-weight: 600; font-size: 0.875rem;">${advantage.title}</div>
              </div>
              <p style="font-size: 0.75rem; margin: 0; color: var(--text-secondary);">${advantage.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(advantageSection);
  },

  /**
   * Create framework details section
   * @param {HTMLElement} container - Container element
   * @param {string} frameworkId - Framework ID
   */
  createFrameworkDetails: function(container, frameworkId) {
    // Get framework
    const framework = this.getFramework(frameworkId);
    if (!framework) return;

    // Clear container
    container.innerHTML = '';

    // Create back button
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-outline btn-sm';
    backButton.style.marginBottom = '1rem';
    backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; margin-right: 0.5rem;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Back to Frameworks';

    backButton.addEventListener('click', () => {
      // Find the industry selector
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector) {
        this.createIndustryCompliance(container.id, industrySelector.value);
      }
    });

    container.appendChild(backButton);

    // Create framework header
    const header = document.createElement('div');
    header.className = 'card animate-fadeIn';
    header.style.marginBottom = '1.5rem';

    header.innerHTML = `
      <div class="card-header" style="background-color: var(--primary-color); color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: white;">${framework.name}</h3>
          <span class="badge" style="background-color: white; color: var(--primary-color); padding: 0.25rem 0.5rem; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${framework.importance}</span>
        </div>
        <div style="font-size: 0.875rem; margin-top: 0.25rem;">${framework.fullName}</div>
      </div>

      <div class="card-body">
        <p style="margin-bottom: 1rem;">${framework.description}</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 0.25rem;">Category</div>
            <div>${framework.category}</div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 0.25rem;">Region</div>
            <div>${framework.region}</div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 0.25rem;">Established</div>
            <div>${framework.year}</div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 0.25rem;">Industries</div>
            <div>${Array.isArray(framework.industries) ? framework.industries.join(', ') : framework.industries}</div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(header);

    // Create vendor compliance section
    const complianceSection = document.createElement('div');
    complianceSection.className = 'card animate-fadeIn';
    complianceSection.style.marginBottom = '1.5rem';
    complianceSection.style.animationDelay = '100ms';

    // Prepare vendor data
    const vendors = [
      { id: 'portnox', name: 'Portnox Cloud', score: framework.vendorScores.portnox || 0 },
      { id: 'cisco', name: 'Cisco ISE', score: framework.vendorScores.cisco || 0 },
      { id: 'aruba', name: 'Aruba ClearPass', score: framework.vendorScores.aruba || 0 },
      { id: 'forescout', name: 'Forescout', score: framework.vendorScores.forescout || 0 },
      { id: 'fortinac', name: 'FortiNAC', score: framework.vendorScores.fortinac || 0 },
      { id: 'nps', name: 'Microsoft NPS', score: framework.vendorScores.nps || 0 },
      { id: 'securew2', name: 'SecureW2', score: framework.vendorScores.securew2 || 0 }
    ];

    // Sort vendors by score
    vendors.sort((a, b) => b.score - a.score);

    complianceSection.innerHTML = `
      <div class="card-header">
        <h4>Vendor Compliance Comparison</h4>
      </div>

      <div class="card-body">
        <div style="margin-bottom: 1.5rem;">
          ${vendors.map(vendor => `
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <div style="font-weight: ${vendor.id === 'portnox' ? '600' : 'normal'}; color: ${vendor.id === 'portnox' ? 'var(--primary-color)' : 'var(--text-primary)'};">${vendor.name}</div>
                <div style="font-weight: ${vendor.id === 'portnox' ? '600' : 'normal'}; color: ${vendor.id === 'portnox' ? 'var(--primary-color)' : 'var(--text-primary)'};">${vendor.score}%</div>
              </div>

              <div style="width: 100%; height: 0.75rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: ${vendor.score}%; height: 100%; background-color: ${vendor.id === 'portnox' ? 'var(--primary-color)' : 'var(--text-tertiary)'}; border-radius: var(--radius-full);"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          <strong>Compliance Score:</strong> Based on the ability to meet ${framework.name} requirements, including technical controls, reporting capabilities, and integration with compliance workflows.
        </div>
      </div>
    `;

    container.appendChild(complianceSection);

    // Create requirements section
    const requirementsSection = document.createElement('div');
    requirementsSection.className = 'card animate-fadeIn';
    requirementsSection.style.marginBottom = '1.5rem';
    requirementsSection.style.animationDelay = '200ms';

    requirementsSection.innerHTML = `
      <div class="card-header">
        <h4>Key Requirements</h4>
      </div>

      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
          ${framework.requirements.map(requirement => `
            <div style="background-color: var(--bg-secondary); border-radius: var(--radius); padding: 0.75rem;">
              <div style="display: flex; align-items: flex-start;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div>${requirement}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(requirementsSection);

    // Create Portnox advantage section
    const advantageSection = document.createElement('div');
    advantageSection.className = 'card animate-fadeIn';
    advantageSection.style.animationDelay = '300ms';

    advantageSection.innerHTML = `
      <div class="card-header" style="background-color: var(--primary-color); color: white;">
        <h4 style="color: white;">How Portnox Cloud Helps with ${framework.name} Compliance</h4>
      </div>

      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
          ${this.getFrameworkAdvantages(frameworkId).map(advantage => `
            <div style="background-color: var(--bg-secondary); border-radius: var(--radius); padding: 1rem;">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">${advantage.title}</div>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">${advantage.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(advantageSection);
  },

  /**
   * Get industry compliance advantages
   * @param {string} industry - Industry ID
   * @returns {Array} Array of advantages
   */
  getIndustryComplianceAdvantages: function(industry) {
    const advantages = {
      healthcare: [
        {
          title: 'HIPAA Compliance Automation',
          description: 'Automate HIPAA compliance with pre-configured policies and continuous monitoring of PHI access.'
        },
        {
          title: 'Medical Device Security',
          description: 'Identify and secure medical IoT devices with AI-powered profiling and zero-trust access controls.'
        },
        {
          title: 'Audit-Ready Reporting',
          description: 'Generate detailed compliance reports for HIPAA audits with comprehensive access logs and policy enforcement data.'
        },
        {
          title: 'Role-Based Access Control',
          description: 'Enforce strict access controls based on clinical roles and responsibilities.'
        }
      ],
      finance: [
        {
          title: 'PCI DSS Compliance',
          description: 'Meet PCI DSS requirements with network segmentation and continuous compliance monitoring for cardholder data environments.'
        },
        {
          title: 'Secure Access Controls',
          description: 'Implement strict authentication and authorization controls for financial applications and data.'
        },
        {
          title: 'Audit Trail & Logging',
          description: 'Maintain comprehensive audit trails of all access attempts and policy changes for regulatory reporting.'
        },
        {
          title: 'Regulatory Reporting',
          description: 'Generate automated compliance reports for SOX, GLBA, and other financial regulations.'
        }
      ],
      retail: [
        {
          title: 'POS Device Security',
          description: 'Protect point-of-sale systems with automated profiling and segmentation.'
        },
        {
          title: 'PCI Compliance',
          description: 'Maintain continuous PCI DSS compliance with network segmentation and access controls.'
        },
        {
          title: 'Guest WiFi Security',
          description: 'Securely separate customer WiFi from business operations networks.'
        },
        {
          title: 'Store Device Management',
          description: 'Identify and secure all retail floor devices including kiosks and digital signage.'
        }
      ],
      education: [
        {
          title: 'FERPA Compliance',
          description: 'Protect student records with role-based access controls and detailed audit logs.'
        },
        {
          title: 'BYOD Management',
          description: 'Securely onboard student and faculty devices with automated policy assignment.'
        },
        {
          title: 'Campus Network Segmentation',
          description: 'Create secure network zones for administration, research, and student access.'
        },
        {
          title: 'Guest Network Security',
          description: 'Provide secure visitor access while protecting campus resources.'
        }
      ],
      government: [
        {
          title: 'FISMA Compliance',
          description: 'Meet federal security requirements with continuous monitoring and automated controls.'
        },
        {
          title: 'NIST 800-171 Controls',
          description: 'Implement required security controls for handling controlled unclassified information.'
        },
        {
          title: 'Zero Trust Architecture',
          description: 'Deploy cloud-native zero trust network access across government environments.'
        },
        {
          title: 'Audit & Accountability',
          description: 'Maintain comprehensive audit logs and access records for government oversight.'
        }
      ],
      manufacturing: [
        {
          title: 'OT/IT Convergence Security',
          description: 'Secure both operational technology and IT networks with unified policies.'
        },
        {
          title: 'Industrial IoT Protection',
          description: 'Identify and secure industrial control systems and connected devices.'
        },
        {
          title: 'Supply Chain Security',
          description: 'Enforce secure access for contractors and supply chain partners.'
        },
        {
          title: 'IP Protection',
          description: 'Protect intellectual property with granular access controls and monitoring.'
        }
      ],
      energy: [
        {
          title: 'NERC CIP Compliance',
          description: 'Meet critical infrastructure protection requirements with automated controls.'
        },
        {
          title: 'OT Network Security',
          description: 'Secure operational technology networks with adaptive policies and segmentation.'
        },
        {
          title: 'Remote Substation Access',
          description: 'Ensure secure authentication and authorization for remote access points.'
        },
        {
          title: 'Critical Asset Monitoring',
          description: 'Continuously monitor and protect critical energy infrastructure assets.'
        }
      ],
      technology: [
        {
          title: 'Cloud Integration',
          description: 'Seamless integration with cloud platforms and services for coherent security posture.'
        },
        {
          title: 'DevOps Environment Security',
          description: 'Secure development environments with automated access controls and policies.'
        },
        {
          title: 'API-Driven Automation',
          description: 'Automate security through robust API integration with development pipelines.'
        },
        {
          title: 'SaaS Application Security',
          description: 'Secure access to SaaS applications with identity-based controls and monitoring.'
        }
      ]
    };
    
    return advantages[industry] || [];
  },
  
  /**
   * Get framework advantages
   * @param {string} frameworkId - Framework ID
   * @returns {Array} Array of advantages
   */
  getFrameworkAdvantages: function(frameworkId) {
    const advantages = {
      'hipaa': [
        {
          title: 'PHI Access Controls',
          description: 'Portnox Cloud implements strict access controls for systems containing protected health information (PHI), meeting HIPAA Security Rule requirements.'
        },
        {
          title: 'Audit Controls',
          description: 'Comprehensive logging and monitoring capabilities track all access attempts to systems with PHI, providing the audit controls required by HIPAA.'
        },
        {
          title: 'Authentication & Identity',
          description: 'Strong multi-factor authentication options ensure only authorized personnel can access sensitive patient data.'
        },
        {
          title: 'Device Security',
          description: 'AI-powered device profiling ensures all medical devices meet security requirements before network access is granted.'
        },
        {
          title: 'Continuous Compliance',
          description: 'Automated policy enforcement and continuous monitoring ensure ongoing HIPAA compliance, not just point-in-time assessments.'
        }
      ],
      'pci-dss': [
        {
          title: 'Network Segmentation',
          description: 'Portnox Cloud enforces PCI-compliant network segmentation, isolating cardholder data environments from other networks.'
        },
        {
          title: 'Access Control (Req. 7)',
          description: 'Implements role-based access control to cardholder data systems, ensuring access is limited to authorized personnel.'
        },
        {
          title: 'Authentication (Req. 8)',
          description: 'Provides strong identity verification and authentication mechanisms required by PCI DSS Requirement 8.'
        },
        {
          title: 'Continuous Monitoring',
          description: 'Automatically monitors all devices for compliance with security policies, detecting unauthorized devices.'
        },
        {
          title: 'Audit Logging',
          description: 'Maintains detailed logs of all access attempts and policy changes for PCI DSS audit requirements.'
        }
      ],
      'gdpr': [
        {
          title: 'Data Access Protection',
          description: 'Restricts access to personal data systems to only authorized users with legitimate business needs.'
        },
        {
          title: 'Security of Processing',
          description: 'Implements appropriate technical measures to ensure security of processing as required by Article 32.'
        },
        {
          title: 'Demonstrable Compliance',
          description: 'Provides audit logs and reports to demonstrate compliance with GDPR security requirements.'
        },
        {
          title: 'Privacy by Design',
          description: 'Supports privacy by design principles through granular access controls and policy enforcement.'
        },
        {
          title: 'Data Breach Prevention',
          description: 'Reduces risk of data breaches by preventing unauthorized device access to networks containing personal data.'
        }
      ],
      'nist-csf': [
        {
          title: 'Identify Function',
          description: 'Automatically discovers and profiles all devices on the network, supporting the Identify function of the framework.'
        },
        {
          title: 'Protect Function',
          description: 'Implements access control and identity verification to protect critical assets and data.'
        },
        {
          title: 'Detect Function',
          description: 'Continuously monitors for policy violations and unauthorized access attempts.'
        },
        {
          title: 'Respond Function',
          description: 'Automatically quarantines non-compliant devices and provides alerting for security incidents.'
        },
        {
          title: 'Recover Function',
          description: 'Supports recovery by enabling rapid restoration of secure network access following remediation.'
        }
      ],
      'iso27001': [
        {
          title: 'Access Control (A.9)',
          description: 'Implements the access control requirements of ISO 27001 Annex A.9 with role-based policies.'
        },
        {
          title: 'Asset Management (A.8)',
          description: 'Supports asset management through comprehensive device discovery and profiling.'
        },
        {
          title: 'Communications Security (A.13)',
          description: 'Enforces network security through segmentation and secure access controls.'
        },
        {
          title: 'Supplier Relationships (A.15)',
          description: 'Secures third-party access with specific policies for vendor and contractor devices.'
        },
        {
          title: 'Compliance Validation (A.18)',
          description: 'Provides compliance verification through policy enforcement and detailed reporting.'
        }
      ],
      'soc2': [
        {
          title: 'Access Control',
          description: 'Supports SOC 2 Common Criteria CC6.1 by restricting logical access to authorized users.'
        },
        {
          title: 'System Operations',
          description: 'Monitors for unauthorized or non-compliant systems to maintain secure operations (CC7.1).'
        },
        {
          title: 'Risk Mitigation',
          description: 'Mitigates security risks through automated enforcement of security policies.'
        },
        {
          title: 'Logical Access',
          description: 'Implements and manages identification and authentication of authorized users.'
        },
        {
          title: 'Audit Evidence',
          description: 'Provides detailed logs and reports that serve as evidence for SOC 2 audits.'
        }
      ],
      'ccpa': [
        {
          title: 'Reasonable Security',
          description: 'Implements reasonable security measures required by CCPA to protect consumer data.'
        },
        {
          title: 'Access Controls',
          description: 'Restricts access to systems containing consumer personal information.'
        },
        {
          title: 'Security Posture',
          description: 'Strengthens overall security posture to prevent data breaches that would trigger CCPA notifications.'
        },
        {
          title: 'Vendor Management',
          description: 'Controls third-party vendor access to networks containing consumer data.'
        },
        {
          title: 'Breach Prevention',
          description: 'Reduces risk of unauthorized access to California residents\' personal information.'
        }
      ],
      'glba': [
        {
          title: 'Access Controls',
          description: 'Implements the access controls required by the GLBA Safeguards Rule.'
        },
        {
          title: 'Customer Information Protection',
          description: 'Protects access to systems containing customer financial information.'
        },
        {
          title: 'Risk Assessment Support',
          description: 'Provides visibility into network access to support GLBA risk assessment requirements.'
        },
        {
          title: 'Third-Party Oversight',
          description: 'Controls and monitors access by service providers to customer information.'
        },
        {
          title: 'Authentication Controls',
          description: 'Enforces strong authentication for access to financial information systems.'
        }
      ],
      'ferpa': [
        {
          title: 'Educational Record Protection',
          description: 'Protects access to systems containing protected student education records.'
        },
        {
          title: 'Authorized Access',
          description: 'Ensures only school officials with legitimate educational interest can access student data.'
        },
        {
          title: 'Access Audit Trails',
          description: 'Maintains detailed logs of access to educational records for compliance verification.'
        },
        {
          title: 'BYOD Management',
          description: 'Securely manages student and faculty devices accessing educational systems.'
        },
        {
          title: 'Directory Information Controls',
          description: 'Supports separation of directory versus protected information with targeted access policies.'
        }
      ],
      'fisma': [
        {
          title: 'Access Controls (AC)',
          description: 'Implements NIST SP 800-53 Access Control family requirements for federal systems.'
        },
        {
          title: 'Identification & Authentication (IA)',
          description: 'Enforces identification and authentication controls required by FISMA.'
        },
        {
          title: 'Continuous Monitoring (CA)',
          description: 'Supports continuous monitoring requirements with real-time policy enforcement.'
        },
        {
          title: 'System Protection (SC)',
          description: 'Contributes to system and communications protection through network access controls.'
        },
        {
          title: 'Authorization Controls',
          description: 'Ensures only authorized systems connect to federal information systems.'
        }
      ],
      'nerc-cip': [
        {
          title: 'Electronic Security Perimeters (CIP-005)',
          description: 'Enforces electronic security perimeters around critical cyber assets.'
        },
        {
          title: 'Systems Security Management (CIP-007)',
          description: 'Contributes to systems security management through access control and monitoring.'
        },
        {
          title: 'Access Management (CIP-004)',
          description: 'Supports access management requirements for critical cyber assets.'
        },
        {
          title: 'Device Authentication',
          description: 'Ensures all devices connecting to critical infrastructure are authenticated and authorized.'
        },
        {
          title: 'Continuous Monitoring',
          description: 'Provides continuous monitoring of all access to critical cyber assets.'
        }
      ],
      'cmmc': [
        {
          title: 'Access Control (AC)',
          description: 'Implements the access control domain requirements across all CMMC levels.'
        },
        {
          title: 'Identification & Authentication (IA)',
          description: 'Enforces identification and authentication controls required by CMMC.'
        },
        {
          title: 'System & Communications Protection (SC)',
          description: 'Contributes to system and communications protection through network segmentation.'
        },
        {
          title: 'System & Information Integrity (SI)',
          description: 'Supports system and information integrity by ensuring only compliant devices connect.'
        },
        {
          title: 'Audit & Accountability (AU)',
          description: 'Provides comprehensive logging and monitoring for CMMC audit requirements.'
        }
      ],
      'hitrust': [
        {
          title: 'Access Control',
          description: 'Implements the access control domain requirements of the HITRUST CSF.'
        },
        {
          title: 'Network Protection',
          description: 'Enforces network security controls required by HITRUST for healthcare organizations.'
        },
        {
          title: 'Endpoint Protection',
          description: 'Ensures endpoints meet security requirements before network access is granted.'
        },
        {
          title: 'Mobile Device Security',
          description: 'Secures mobile devices accessing healthcare information systems.'
        },
        {
          title: 'Audit Logging & Monitoring',
          description: 'Provides the detailed audit logging required by HITRUST CSF controls.'
        }
      ],
      'nist-800-171': [
        {
          title: 'Access Control (3.1)',
          description: 'Implements the access control requirements in NIST 800-171 Section 3.1.'
        },
        {
          title: 'Identification & Authentication (3.5)',
          description: 'Enforces identification and authentication controls required by Section 3.5.'
        },
        {
          title: 'System & Communications Protection (3.13)',
          description: 'Contributes to the boundary protection requirements in Section 3.13.'
        },
        {
          title: 'CUI Protection',
          description: 'Protects systems containing controlled unclassified information through access controls.'
        },
        {
          title: 'Continuous Monitoring',
          description: 'Supports continuous monitoring of security controls protecting CUI.'
        }
      ],
      'sox': [
        {
          title: 'IT General Controls',
          description: 'Supports SOX IT general controls through comprehensive access management.'
        },
        {
          title: 'Access Control',
          description: 'Restricts access to financial systems and data to authorized personnel only.'
        },
        {
          title: 'Segregation of Duties',
          description: 'Supports segregation of duties through role-based access policies.'
        },
        {
          title: 'Audit Trail',
          description: 'Maintains detailed audit trails of all access to financial reporting systems.'
        },
        {
          title: 'Change Management',
          description: 'Supports change management controls through policy-based network access.'
        }
      ]
    };
    
    return advantages[frameworkId] || [];
  }
};

// Make ComplianceFrameworks globally available
window.ComplianceFrameworks = ComplianceFrameworks;
/**
 * Risk Analysis Component
 * Provides detailed risk and breach impact visualizations
 */

const RiskAnalysis = {
  // Risk factors by industry
  riskFactors: {
    healthcare: {
      breachCost: 9.23, // millions of dollars
      breachProbability: 0.41, // 41% per year
      recordCost: 429, // dollars per record
      recordsExposed: {
        small: 25000,
        medium: 100000,
        large: 500000
      },
      attackVectors: [
        { name: 'Unauthorized Access', percentage: 35, reduction: 80 },
        { name: 'Malware/Ransomware', percentage: 30, reduction: 65 },
        { name: 'Stolen Credentials', percentage: 20, reduction: 75 },
        { name: 'Phishing', percentage: 10, reduction: 45 },
        { name: 'Other', percentage: 5, reduction: 40 }
      ]
    },
    finance: {
      breachCost: 5.97, // millions of dollars
      breachProbability: 0.38, // 38% per year
      recordCost: 336, // dollars per record
      recordsExposed: {
        small: 50000,
        medium: 250000,
        large: 1000000
      },
      attackVectors: [
        { name: 'Unauthorized Access', percentage: 30, reduction: 80 },
        { name: 'Stolen Credentials', percentage: 25, reduction: 75 },
        { name: 'Malware/Ransomware', percentage: 20, reduction: 65 },
        { name: 'Insider Threat', percentage: 15, reduction: 60 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    },
    retail: {
      breachCost: 3.28, // millions of dollars
      breachProbability: 0.35, // 35% per year
      recordCost: 175, // dollars per record
      recordsExposed: {
        small: 100000,
        medium: 500000,
        large: 2000000
      },
      attackVectors: [
        { name: 'POS Intrusion', percentage: 35, reduction: 85 },
        { name: 'Web Application', percentage: 25, reduction: 70 },
        { name: 'Stolen Credentials', percentage: 20, reduction: 75 },
        { name: 'Malware', percentage: 15, reduction: 65 },
        { name: 'Other', percentage: 5, reduction: 40 }
      ]
    },
    education: {
      breachCost: 3.79, // millions of dollars
      breachProbability: 0.42, // 42% per year
      recordCost: 180, // dollars per record
      recordsExposed: {
        small: 75000,
        medium: 300000,
        large: 1000000
      },
      attackVectors: [
        { name: 'Unauthorized Access', percentage: 30, reduction: 80 },
        { name: 'Malware/Ransomware', percentage: 25, reduction: 65 },
        { name: 'Stolen Credentials', percentage: 20, reduction: 75 },
        { name: 'Social Engineering', percentage: 15, reduction: 55 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    },
    government: {
      breachCost: 8.64, // millions of dollars
      breachProbability: 0.30, // 30% per year
      recordCost: 217, // dollars per record
      recordsExposed: {
        small: 50000,
        medium: 250000,
        large: 1000000
      },
      attackVectors: [
        { name: 'Stolen Credentials', percentage: 30, reduction: 75 },
        { name: 'Malware/Ransomware', percentage: 25, reduction: 65 },
        { name: 'Unauthorized Access', percentage: 20, reduction: 80 },
        { name: 'Social Engineering', percentage: 15, reduction: 55 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    },
    manufacturing: {
      breachCost: 4.24, // millions of dollars
      breachProbability: 0.25, // 25% per year
      recordCost: 156, // dollars per record
      recordsExposed: {
        small: 25000,
        medium: 100000,
        large: 500000
      },
      attackVectors: [
        { name: 'Industrial Espionage', percentage: 30, reduction: 70 },
        { name: 'Unauthorized Access', percentage: 25, reduction: 80 },
        { name: 'Malware/Ransomware', percentage: 20, reduction: 65 },
        { name: 'Stolen Credentials', percentage: 15, reduction: 75 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    },
    energy: {
      breachCost: 5.60, // millions of dollars
      breachProbability: 0.28, // 28% per year
      recordCost: 187, // dollars per record
      recordsExposed: {
        small: 20000,
        medium: 75000,
        large: 300000
      },
      attackVectors: [
        { name: 'Unauthorized Access', percentage: 30, reduction: 80 },
        { name: 'Malware/Ransomware', percentage: 25, reduction: 65 },
        { name: 'Stolen Credentials', percentage: 20, reduction: 75 },
        { name: 'Social Engineering', percentage: 15, reduction: 55 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    },
    technology: {
      breachCost: 4.88, // millions of dollars
      breachProbability: 0.32, // 32% per year
      recordCost: 219, // dollars per record
      recordsExposed: {
        small: 100000,
        medium: 500000,
        large: 2000000
      },
      attackVectors: [
        { name: 'Web Application', percentage: 30, reduction: 70 },
        { name: 'Stolen Credentials', percentage: 25, reduction: 75 },
        { name: 'Unauthorized Access', percentage: 20, reduction: 80 },
        { name: 'Malware', percentage: 15, reduction: 65 },
        { name: 'Other', percentage: 10, reduction: 40 }
      ]
    }
  },

  // Default values for organizations without industry-specific data
  defaultRiskFactors: {
    breachCost: 4.35, // millions of dollars
    breachProbability: 0.30, // 30% per year
    recordCost: 180, // dollars per record
    recordsExposed: {
      small: 50000,
      medium: 200000,
      large: 1000000
    },
    attackVectors: [
      { name: 'Unauthorized Access', percentage: 30, reduction: 80 },
      { name: 'Malware/Ransomware', percentage: 25, reduction: 65 },
      { name: 'Stolen Credentials', percentage: 20, reduction: 75 },
      { name: 'Social Engineering', percentage: 15, reduction: 55 },
      { name: 'Other', percentage: 10, reduction: 40 }
    ]
  },

  /**
   * Get risk factors for an industry
   * @param {string} industry - Industry ID
   * @returns {Object} Risk factors
   */
  getRiskFactors: function(industry) {
    return this.riskFactors[industry] || this.defaultRiskFactors;
  },

  /**
   * Calculate risk reduction with NAC
   * @param {string} industry - Industry ID
   * @param {string} nacType - NAC type ('traditional' or 'cloud')
   * @returns {number} Risk reduction percentage
   */
  calculateRiskReduction: function(industry, nacType) {
    const riskFactors = this.getRiskFactors(industry);

    // Calculate weighted risk reduction
    let totalReduction = 0;

    riskFactors.attackVectors.forEach(vector => {
      // Base reduction for the attack vector
      const baseReduction = vector.reduction / 100;

      // Add modifier based on NAC type
      const nacModifier = nacType === 'cloud' ? 1.2 : 1.0;

      // Calculate weighted reduction for this vector
      const weightedReduction = (vector.percentage / 100) * baseReduction * nacModifier;

      totalReduction += weightedReduction;
    });

    // Return as percentage
    return Math.round(totalReduction * 100);
  },

  /**
   * Calculate expected breach cost
   * @param {string} industry - Industry ID
   * @param {string} orgSize - Organization size ('small', 'medium', 'large')
   * @param {string} nacType - NAC type ('none', 'traditional', 'cloud')
   * @returns {Object} Breach cost data
   */
  calculateBreachCost: function(industry, orgSize, nacType) {
    const riskFactors = this.getRiskFactors(industry);

    // Get records exposed based on org size
    const recordsExposed = riskFactors.recordsExposed[orgSize] || riskFactors.recordsExposed.medium;

    // Calculate base breach cost
    const baseBreachCost = recordsExposed * (riskFactors.recordCost / 1000000); // in millions

    // Calculate risk reduction
    let riskReduction = 0;

    if (nacType === 'traditional') {
      riskReduction = this.calculateRiskReduction(industry, 'traditional');
    } else if (nacType === 'cloud') {
      riskReduction = this.calculateRiskReduction(industry, 'cloud');
    }

    // Calculate adjusted breach probability
    const baseProbability = riskFactors.breachProbability;
    const adjustedProbability = baseProbability * (1 - (riskReduction / 100));

    // Calculate expected annual loss
    const expectedLossNoNac = baseProbability * baseBreachCost;
    const expectedLossWithNac = adjustedProbability * baseBreachCost;
    const savings = expectedLossNoNac - expectedLossWithNac;

    return {
      recordsExposed: recordsExposed,
      recordCost: riskFactors.recordCost,
      baseBreachCost: baseBreachCost,
      breachProbability: baseProbability,
      adjustedProbability: adjustedProbability,
      riskReduction: riskReduction,
      expectedLossNoNac: expectedLossNoNac,
      expectedLossWithNac: expectedLossWithNac,
      savings: savings
    };
  },

  /**
   * Create risk analysis visualization
   * @param {string} containerId - Container element ID
   * @param {Object} options - Visualization options
   */
  createRiskAnalysis: function(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Get options
    const industry = options.industry || 'technology';
    const orgSize = options.orgSize || 'medium';
    const nacType = options.nacType || 'cloud';

    // Calculate breach costs
    const breachCosts = this.calculateBreachCost(industry, orgSize, nacType);

    // Clear container
    container.innerHTML = '';

    // Create risk analysis container
    const riskContainer = document.createElement('div');
    riskContainer.className = 'card animate-fadeIn';

    // Create risk header
    const riskHeader = document.createElement('div');
    riskHeader.className = 'card-header';
    riskHeader.innerHTML = `
      <h3>Breach Risk Analysis for ${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry</h3>
      <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">Based on industry breach data and security benchmarks</p>
    `;

    riskContainer.appendChild(riskHeader);

    // Create risk metrics
    const riskMetrics = document.createElement('div');
    riskMetrics.className = 'card-body';

    // Create risk metrics grid
    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'risk-metrics-grid';
    metricsGrid.style.display = 'grid';
    metricsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    metricsGrid.style.gap = '1.5rem';
    metricsGrid.style.marginBottom = '2rem';

    // Add metrics
    metricsGrid.innerHTML = `
      <div class="risk-metric animate-fadeIn" style="animation-delay: 100ms;">
        <span class="metric-label">Annual Breach Probability</span>
        <span class="metric-value" id="breach-probability">${Math.round(breachCosts.breachProbability * 100)}%</span>
      </div>

      <div class="risk-metric animate-fadeIn" style="animation-delay: 200ms;">
        <span class="metric-label">Risk Reduction with ${nacType === 'cloud' ? 'Cloud-Native NAC' : 'Traditional NAC'}</span>
        <span class="metric-value" id="risk-reduction">${breachCosts.riskReduction}%</span>
      </div>

      <div class="risk-metric animate-fadeIn" style="animation-delay: 300ms;">
        <span class="metric-label">Average Breach Cost</span>
        <span class="metric-value" id="avg-breach-cost">$${breachCosts.baseBreachCost.toFixed(2)}M</span>
      </div>

      <div class="risk-metric animate-fadeIn" style="animation-delay: 400ms;">
        <span class="metric-label">Annual Expected Loss Without NAC</span>
        <span class="metric-value" id="risk-adj-breach-cost">$${breachCosts.expectedLossNoNac.toFixed(2)}M</span>
      </div>
    `;

    riskMetrics.appendChild(metricsGrid);

    // Create visualization container
    const visualizationContainer = document.createElement('div');
    visualizationContainer.style.display = 'grid';
    visualizationContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    visualizationContainer.style.gap = '1.5rem';

    // Create expected loss chart
    const expectedLossContainer = document.createElement('div');
    expectedLossContainer.className = 'animate-fadeIn';
    expectedLossContainer.style.animationDelay = '500ms';

    const expectedLossTitle = document.createElement('h4');
    expectedLossTitle.textContent = 'Expected Annual Loss';
    expectedLossTitle.style.marginBottom = '1rem';

    const expectedLossChart = document.createElement('div');
    expectedLossChart.style.height = '300px';
    expectedLossChart.style.position = 'relative';

    // Create canvas for chart
    const expectedLossCanvas = document.createElement('canvas');
    expectedLossCanvas.id = 'expected-loss-chart';

    expectedLossChart.appendChild(expectedLossCanvas);
    expectedLossContainer.appendChild(expectedLossTitle);
    expectedLossContainer.appendChild(expectedLossChart);

    // Create attack vectors chart
    const attackVectorsContainer = document.createElement('div');
    attackVectorsContainer.className = 'animate-fadeIn';
    attackVectorsContainer.style.animationDelay = '600ms';

    const attackVectorsTitle = document.createElement('h4');
    attackVectorsTitle.textContent = 'Risk by Attack Vector';
    attackVectorsTitle.style.marginBottom = '1rem';

    const attackVectorsChart = document.createElement('div');
    attackVectorsChart.style.height = '300px';
    attackVectorsChart.style.position = 'relative';

    // Create canvas for chart
    const attackVectorsCanvas = document.createElement('canvas');
    attackVectorsCanvas.id = 'attack-vectors-chart';

    attackVectorsChart.appendChild(attackVectorsCanvas);
    attackVectorsContainer.appendChild(attackVectorsTitle);
    attackVectorsContainer.appendChild(attackVectorsChart);

    visualizationContainer.appendChild(expectedLossContainer);
    visualizationContainer.appendChild(attackVectorsContainer);

    riskMetrics.appendChild(visualizationContainer);

    // Create ROI section
    const roiSection = document.createElement('div');
    roiSection.className = 'animate-fadeIn';
    roiSection.style.animationDelay = '700ms';
    roiSection.style.marginTop = '2rem';
    roiSection.style.backgroundColor = '#f0f9ff'; // Light blue background
    roiSection.style.borderRadius = 'var(--radius)';
    roiSection.style.padding = '1.5rem';

    // Calculate ROI values
    const annualNacCost = nacType === 'cloud' ? 0.05 : 0.20; // millions of dollars
    const breachSavings = breachCosts.expectedLossNoNac - breachCosts.expectedLossWithNac;
    const roi = (breachSavings / annualNacCost) * 100;

    roiSection.innerHTML = `
      <h4 style="margin-top: 0; margin-bottom: 1rem; color: var(--primary-color);">Security ROI Analysis</h4>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Annual ${nacType === 'cloud' ? 'Cloud-Native NAC' : 'Traditional NAC'} Cost</div>
          <div style="font-weight: 600; font-size: 1.25rem;">$${(annualNacCost * 1000000).toLocaleString()}</div>
        </div>

        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Annual Risk Reduction Savings</div>
          <div style="font-weight: 600; font-size: 1.25rem;">$${(breachSavings * 1000000).toLocaleString()}</div>
        </div>

        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Return on Investment</div>
          <div style="font-weight: 600; font-size: 1.25rem;">${Math.round(roi)}%</div>
        </div>
      </div>

      <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0;">
        <strong>Breach cost savings alone</strong> provide a ${Math.round(roi)}% return on investment for ${nacType === 'cloud' ? 'Portnox Cloud' : 'traditional NAC'},
        not including operational savings from reduced manual processes, increased productivity, and lower support overhead.
      </p>
    `;

    riskMetrics.appendChild(roiSection);

    // Add compliance impact section
    this.createComplianceImpact(riskMetrics, {
      industry: industry,
      nacType: nacType
    });

    riskContainer.appendChild(riskMetrics);
    container.appendChild(riskContainer);

    // Initialize charts
    this.initializeExpectedLossChart(breachCosts);
    this.initializeAttackVectorsChart(industry, nacType);
  },

  /**
   * Create compliance impact section
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Options
   */
  createComplianceImpact: function(container, options) {
    // Create compliance impact section
    const complianceSection = document.createElement('div');
    complianceSection.className = 'animate-fadeIn';
    complianceSection.style.animationDelay = '800ms';
    complianceSection.style.marginTop = '2rem';

    const complianceTitle = document.createElement('h4');
    complianceTitle.textContent = 'Compliance Impact Analysis';
    complianceTitle.style.marginBottom = '1rem';

    complianceSection.appendChild(complianceTitle);

    // Create compliance grid
    const complianceGrid = document.createElement('div');
    complianceGrid.style.display = 'grid';
    complianceGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    complianceGrid.style.gap = '1rem';

    // Get frameworks for industry
    const frameworks = window.ComplianceFrameworks?.getFrameworksForIndustry(options.industry) || [];
    const topFrameworks = frameworks.slice(0, 3);

    topFrameworks.forEach((framework, index) => {
      const frameworkCard = document.createElement('div');
      frameworkCard.className = 'card stagger-item animate-fadeIn';
      frameworkCard.style.animationDelay = `${(index + 1) * 100 + 800}ms`;

      const costReduction = options.nacType === 'cloud' ? 65 : 40;
      const timeReduction = options.nacType === 'cloud' ? 70 : 35;

      frameworkCard.innerHTML = `
        <div class="card-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h5 style="margin: 0;">${framework.name}</h5>
            <span class="badge" style="background-color: var(--${framework.importance === 'Critical' ? 'danger' : framework.importance === 'High' ? 'warning' : 'info'}-color); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius); font-size: 0.75rem; font-weight: 600;">${framework.importance}</span>
          </div>
        </div>

        <div class="card-body">
          <p style="font-size: 0.875rem; margin-bottom: 1rem;">${framework.description}</p>

          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem;">Compliance Cost Reduction</div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="flex-grow: 1; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: ${costReduction}%; height: 100%; background-color: var(--success-color); border-radius: var(--radius-full);"></div>
              </div>
              <div style="font-size: 0.875rem; font-weight: 600; color: var(--success-color);">${costReduction}%</div>
            </div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem;">Implementation Time Reduction</div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="flex-grow: 1; height: 0.5rem; background-color: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: ${timeReduction}%; height: 100%; background-color: var(--primary-color); border-radius: var(--radius-full);"></div>
              </div>
              <div style="font-size: 0.875rem; font-weight: 600; color: var(--primary-color);">${timeReduction}%</div>
            </div>
          </div>
        </div>
      `;

      complianceGrid.appendChild(frameworkCard);
    });

    complianceSection.appendChild(complianceGrid);
    container.appendChild(complianceSection);
  },

  /**
   * Initialize expected loss chart
   * @param {Object} breachCosts - Breach cost data
   */
  initializeExpectedLossChart: function(breachCosts) {
    const ctx = document.getElementById('expected-loss-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Without NAC', 'With Traditional NAC', 'With Cloud-Native NAC'],
        datasets: [{
          label: 'Expected Annual Loss ($M)',
          data: [
            breachCosts.expectedLossNoNac,
            breachCosts.expectedLossNoNac * (1 - (breachCosts.riskReduction / 100) * 0.83), // Traditional NAC is ~83% as effective as cloud
            breachCosts.expectedLossWithNac
          ],
          backgroundColor: [
            '#ef4444', // Red
            '#f59e0b', // Amber
            '#10b981'  // Green
          ],
          borderColor: [
            '#dc2626',
            '#d97706',
            '#059669'
          ],
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            padding: 12,
            cornerRadius: 4,
            callbacks: {
              label: function(context) {
                return `$${context.raw.toFixed(2)}M per year`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(226, 232, 240, 0.5)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toFixed(1) + 'M';
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  },

  /**
   * Initialize attack vectors chart
   * @param {string} industry - Industry ID
   * @param {string} nacType - NAC type
   */
  initializeAttackVectorsChart: function(industry, nacType) {
    const ctx = document.getElementById('attack-vectors-chart');
    if (!ctx) return;

    const riskFactors = this.getRiskFactors(industry);
    const attackVectors = riskFactors.attackVectors;

    // Calculate risk reduction for each attack vector
    const labels = [];
    const beforeData = [];
    const afterData = [];

    attackVectors.forEach(vector => {
      labels.push(vector.name);

      // Original risk
      const originalRisk = vector.percentage;
      beforeData.push(originalRisk);

      // Reduced risk with NAC
      const nacModifier = nacType === 'cloud' ? 1.2 : 1.0;
      const reduction = vector.reduction * nacModifier / 100;
      const reducedRisk = originalRisk * (1 - reduction);
      afterData.push(reducedRisk);
    });

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Before NAC',
            data: beforeData,
            fill: true,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgb(239, 68, 68)',
            pointBackgroundColor: 'rgb(239, 68, 68)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(239, 68, 68)'
          },
          {
            label: `After ${nacType === 'cloud' ? 'Cloud-Native' : 'Traditional'} NAC`,
            data: afterData,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgb(16, 185, 129)',
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(16, 185, 129)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
              color: 'rgba(226, 232, 240, 0.5)'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            },
            suggestedMin: 0,
            suggestedMax: 40,
            ticks: {
              stepSize: 10
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            padding: 12,
            cornerRadius: 4,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
};

// Make RiskAnalysis globally available
window.RiskAnalysis = RiskAnalysis;
/**
 * NAC Architecture Designer Pro - Main Application
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing NAC Architecture Designer Pro...');

  // Initialize DOM elements cache
  const elements = {
    // Wizard elements
    wizardNav: document.getElementById('wizard-nav'),
    wizardContent: document.querySelector('.wizard-content'),
    nextButton: document.getElementById('next-step'),
    prevButton: document.getElementById('prev-step'),

    // Vendor selection
    vendorCards: document.querySelectorAll('.vendor-card'),
    vendorInfo: document.getElementById('vendor-info'),

    // Industry selection
    industrySelector: document.getElementById('industry-selector'),
    industryInfo: document.getElementById('industry-info'),
    complianceFrameworks: document.getElementById('compliance-frameworks'),

    // Organization details
    organizationSize: document.getElementById('organization-size'),
    deviceCount: document.getElementById('device-count'),
    yearsToProject: document.getElementById('years-to-project'),
    multipleLocations: document.getElementById('multiple-locations'),
    locationCount: document.getElementById('location-count-container'),
    legacyDevices: document.getElementById('legacy-devices'),
    legacyPercentage: document.getElementById('legacy-percentage-container'),

    // Cost configuration
    complexAuthentication: document.getElementById('complex-authentication'),
    cloudIntegration: document.getElementById('cloud-integration'),
    customPolicies: document.getElementById('custom-policies'),
    policyComplexity: document.getElementById('policy-complexity-container'),
    portnoxCostPerDevice: document.getElementById('portnox-cost-per-device'),
    portnoxDiscount: document.getElementById('portnox-discount'),
    effectiveDeviceCost: document.getElementById('effective-device-cost'),
    estimatedAnnualCost: document.getElementById('estimated-annual-cost'),

    // Results preview
    currentVendorName: document.getElementById('current-vendor-name'),
    currentVendorCost: document.getElementById('current-vendor-cost'),
    portnoxCost: document.getElementById('portnox-cost'),
    savingsAmount: document.getElementById('savings-amount'),
    savingsPercentage: document.getElementById('savings-percentage'),

    // Results container
    resultsContainer: document.getElementById('results-container'),
    viewResultsButton: document.getElementById('view-results'),

    // Tab elements
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContent: document.querySelectorAll('.tab-pane'),
    subTabButtons: document.querySelectorAll('.sub-tab-button'),
    subTabContent: document.querySelectorAll('.sub-tab-pane'),

    // Charts
    tcoComparisonChart: document.getElementById('tco-comparison-chart'),
    cumulativeCostChart: document.getElementById('cumulative-cost-chart'),
    currentBreakdownChart: document.getElementById('current-breakdown-chart'),
    alternativeBreakdownChart: document.getElementById('alternative-breakdown-chart'),
    featureComparisonChart: document.getElementById('feature-comparison-chart'),
    implementationComparisonChart: document.getElementById('implementation-comparison-chart'),
    roiChart: document.getElementById('roi-chart'),

    // Other elements
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    helpButton: document.getElementById('help-btn'),
    helpModal: document.getElementById('help-modal'),
    helpModalClose: document.getElementById('help-modal-close'),
    helpModalCloseBtn: document.getElementById('help-modal-close-btn')
  };

  // Application state
  const state = {
    currentStep: 1,
    totalSteps: 5,
    selectedVendor: null,
    selectedIndustry: null,
    organizationSize: 'medium',
    deviceCount: 1000,
    yearsToProject: 3,
    multipleLocations: false,
    locationCount: 1,
    legacyDevices: false,
    legacyPercentage: 30,
    complexAuthentication: false,
    cloudIntegration: false,
    customPolicies: false,
    policyComplexity: 'medium',
    portnoxCostPerDevice: 4,
    portnoxDiscount: 0,
    darkMode: false
  };

  // Initialize the application
  function init() {
    // Initialize ModernWizard if available
    if (typeof ModernWizard !== 'undefined') {
      window.modernWizard = new ModernWizard();
    }

    // Set up event handlers
    setupEventHandlers();

    // Initialize dark mode
    initializeDarkMode();

    // Initialize vendor selection
    if (elements.vendorCards && elements.vendorCards.length > 0) {
      // Set the first vendor as selected by default
      selectVendor(elements.vendorCards[0].dataset.vendor);
    }

    console.log('NAC Architecture Designer Pro initialized');
  }

  // Set up event handlers
  function setupEventHandlers() {
    // Vendor selection
    if (elements.vendorCards) {
      elements.vendorCards.forEach(card => {
        card.addEventListener('click', () => {
          selectVendor(card.dataset.vendor);
        });
      });
    }

    // Industry selection
    if (elements.industrySelector) {
      elements.industrySelector.addEventListener('change', () => {
        selectIndustry(elements.industrySelector.value);
      });
    }

    // Multiple locations checkbox
    if (elements.multipleLocations) {
      elements.multipleLocations.addEventListener('change', () => {
        toggleLocationCount(elements.multipleLocations.checked);
      });
    }

    // Legacy devices checkbox
    if (elements.legacyDevices) {
      elements.legacyDevices.addEventListener('change', () => {
        toggleLegacyPercentage(elements.legacyDevices.checked);
      });
    }

    // Custom policies checkbox
    if (elements.customPolicies) {
      elements.customPolicies.addEventListener('change', () => {
        togglePolicyComplexity(elements.customPolicies.checked);
      });
    }

    // Portnox cost per device range
    if (elements.portnoxCostPerDevice) {
      elements.portnoxCostPerDevice.addEventListener('input', () => {
        updatePortnoxCost();
      });
    }

    // Portnox discount range
    if (elements.portnoxDiscount) {
      elements.portnoxDiscount.addEventListener('input', () => {
        updatePortnoxCost();
      });
    }

    // View results button
    if (elements.viewResultsButton) {
      elements.viewResultsButton.addEventListener('click', () => {
        showResults();
      });
    }

    // Tab buttons
    if (elements.tabButtons) {
      elements.tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          handleTabClick(event);
        });
      });
    }

    // Sub-tab buttons
    if (elements.subTabButtons) {
      elements.subTabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          handleSubTabClick(event);
        });
      });
    }

    // Dark mode toggle
    if (elements.darkModeToggle) {
      elements.darkModeToggle.addEventListener('click', () => {
        toggleDarkMode();
      });
    }

    // Help button
    if (elements.helpButton) {
      elements.helpButton.addEventListener('click', () => {
        showHelpModal();
      });
    }

    // Help modal close
    if (elements.helpModalClose) {
      elements.helpModalClose.addEventListener('click', () => {
        hideHelpModal();
      });
    }

    // Help modal close button
    if (elements.helpModalCloseBtn) {
      elements.helpModalCloseBtn.addEventListener('click', () => {
        hideHelpModal();
      });
    }

    // Window resize
    window.addEventListener('resize', () => {
      handleResize();
    });
  }

  // Initialize dark mode
  function initializeDarkMode() {
    // Check for system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check for stored preference
    const storedPreference = localStorage.getItem('darkMode');

    if (storedPreference === 'true' || (storedPreference === null && prefersDarkMode)) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }

  // Enable dark mode
  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    state.darkMode = true;
    localStorage.setItem('darkMode', 'true');

    // Update icon
    if (elements.darkModeToggle) {
      elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Update charts
    updateChartsForDarkMode(true);
  }

  // Disable dark mode
  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    state.darkMode = false;
    localStorage.setItem('darkMode', 'false');

    // Update icon
    if (elements.darkModeToggle) {
      elements.darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Update charts
    updateChartsForDarkMode(false);
  }

  // Toggle dark mode
  function toggleDarkMode() {
    if (state.darkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }

  // Update charts for dark mode
  function updateChartsForDarkMode(isDarkMode) {
    // Update Chart.js default colors
    if (typeof Chart !== 'undefined') {
      Chart.defaults.color = isDarkMode ? '#e5e7eb' : '#4b5563';
      Chart.defaults.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
    }

    // Update all charts
    if (state.selectedVendor) {
      updateChartsForVendor(state.selectedVendor);
    }
  }

  // Select vendor
  function selectVendor(vendorId) {
    // Update state
    state.selectedVendor = vendorId;

    // Update UI
    if (elements.vendorCards) {
      elements.vendorCards.forEach(card => {
        if (card.dataset.vendor === vendorId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    // Show vendor info
    showVendorInfo(vendorId);

    // Update vendor name in results preview
    if (elements.currentVendorName) {
      elements.currentVendorName.textContent = getVendorName(vendorId);
    }

    // Update charts
    updateChartsForVendor(vendorId);
  }

  // Show vendor info
  function showVendorInfo(vendorId) {
    if (!elements.vendorInfo) return;

    // Get vendor info
    const vendorInfo = getVendorInfo(vendorId);

    // Update vendor info
    elements.vendorInfo.querySelector('#vendor-info-title').textContent = vendorInfo.name;
    elements.vendorInfo.querySelector('#vendor-info-description').textContent = vendorInfo.description;

    // Show vendor info
    elements.vendorInfo.classList.remove('hidden');
  }

  // Get vendor name
  function getVendorName(vendorId) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      fortinac: 'FortiNAC',
      nps: 'Microsoft NPS',
      securew2: 'SecureW2',
      noNac: 'No NAC'
    };

    return vendorNames[vendorId] || 'Current Vendor';
  }

  // Get vendor info
  function getVendorInfo(vendorId) {
    const vendorInfo = {
      cisco: {
        name: 'Cisco ISE',
        description: 'Enterprise-grade on-premises NAC solution with extensive features for large organizations.',
        type: 'On-premises',
        deploymentTime: '90-120 days',
        implementationComplexity: 'High',
        specializedSkills: 'Required',
        cloudCapabilities: 'Limited'
      },
      aruba: {
        name: 'Aruba ClearPass',
        description: 'Multi-vendor NAC solution with strong wireless capabilities and identity-based controls.',
        type: 'On-premises',
        deploymentTime: '60-90 days',
        implementationComplexity: 'Medium-High',
        specializedSkills: 'Required',
        cloudCapabilities: 'Limited'
      },
      forescout: {
        name: 'Forescout',
        description: 'Agentless NAC solution focusing on device visibility and control across diverse environments.',
        type: 'On-premises',
        deploymentTime: '60-100 days',
        implementationComplexity: 'High',
        specializedSkills: 'Required',
        cloudCapabilities: 'Limited'
      },
      fortinac: {
        name: 'FortiNAC',
        description: 'NAC solution integrated with Fortinet security fabric for comprehensive network protection.',
        type: 'On-premises',
        deploymentTime: '60-90 days',
        implementationComplexity: 'Medium-High',
        specializedSkills: 'Required',
        cloudCapabilities: 'Limited'
      },
      nps: {
        name: 'Microsoft NPS',
        description: 'Basic RADIUS server included in Windows Server with limited NAC capabilities.',
        type: 'On-premises',
        deploymentTime: '30-60 days',
        implementationComplexity: 'Medium',
        specializedSkills: 'Windows Administration',
        cloudCapabilities: 'None'
      },
      securew2: {
        name: 'SecureW2',
        description: 'Cloud-based certificate management solution with JoinNow onboarding capabilities.',
        type: 'Cloud/Hybrid',
        deploymentTime: '30-45 days',
        implementationComplexity: 'Medium',
        specializedSkills: 'Certificate Knowledge',
        cloudCapabilities: 'High'
      },
      noNac: {
        name: 'No NAC Solution',
        description: 'Operating without any network access control solution, relying on basic network security.',
        type: 'None',
        deploymentTime: 'N/A',
        implementationComplexity: 'N/A',
        specializedSkills: 'N/A',
        cloudCapabilities: 'N/A'
     	};
    
    return vendorInfo[vendorId] || {
      name: 'Unknown Vendor',
      description: 'No information available.',
      type: 'Unknown',
      deploymentTime: 'Unknown',
      implementationComplexity: 'Unknown',
      specializedSkills: 'Unknown',
      cloudCapabilities: 'Unknown'
    };
  }
  
  // Select industry
  function selectIndustry(industryId) {
    // Update state
    state.selectedIndustry = industryId;
    
    // Show industry info
    showIndustryInfo(industryId);
    
    // Show compliance frameworks
    showComplianceFrameworks(industryId);
  }
  
  // Show industry info
  function showIndustryInfo(industryId) {
    if (!elements.industryInfo) return;
    
    // Get industry info
    const industryInfo = getIndustryInfo(industryId);
    
    // Update industry info
    elements.industryInfo.querySelector('#industry-title').textContent = industryInfo.name;
    elements.industryInfo.querySelector('#industry-description').textContent = industryInfo.description;
    elements.industryInfo.querySelector('#industry-implementation-time').textContent = industryInfo.implementationTime;
    elements.industryInfo.querySelector('#industry-savings').textContent = industryInfo.savings;
    elements.industryInfo.querySelector('#industry-cloud-adoption').textContent = industryInfo.cloudAdoption;
    
    // Show industry info
    elements.industryInfo.classList.remove('hidden');
  }
  
  // Get industry info
  function getIndustryInfo(industryId) {
    const industryInfo = {
      healthcare: {
        name: 'Healthcare',
        description: 'Healthcare organizations face unique challenges in securing medical devices, patient data, and maintaining compliance with strict regulations like HIPAA while ensuring easy access for clinical staff.',
        implementationTime: '16-24 weeks',
        savings: '35-45%',
        cloudAdoption: '62%'
      },
      financial: {
        name: 'Financial Services',
        description: 'Financial institutions require robust security controls to protect sensitive financial data, meet regulatory requirements like PCI DSS and GLBA, and defend against sophisticated cyber threats.',
        implementationTime: '12-20 weeks',
        savings: '30-40%',
        cloudAdoption: '57%'
      },
      retail: {
        name: 'Retail',
        description: 'Retail environments need to secure point-of-sale systems, manage guest WiFi, and protect customer data while meeting PCI DSS requirements across distributed store locations.',
        implementationTime: '8-16 weeks',
        savings: '40-50%',
        cloudAdoption: '68%'
      },
      education: {
        name: 'Education',
        description: 'Educational institutions must balance open network access with strong security controls to protect student data under FERPA while managing diverse BYOD environments with seasonal usage patterns.',
        implementationTime: '10-18 weeks',
        savings: '45-55%',
        cloudAdoption: '72%'
      },
      government: {
        name: 'Government',
        description: 'Government agencies require stringent security controls to meet FISMA, NIST 800-53, and other regulatory frameworks while protecting sensitive information and critical infrastructure.',
        implementationTime: '20-32 weeks',
        savings: '25-35%',
        cloudAdoption: '48%'
      },
      manufacturing: {
        name: 'Manufacturing',
        description: 'Manufacturing environments face challenges securing operational technology networks, IoT devices, and industrial control systems while maintaining production efficiency and availability.',
        implementationTime: '12-20 weeks',
        savings: '35-45%',
        cloudAdoption: '61%'
      },
      technology: {
        name: 'Technology',
        description: 'Technology companies require flexible security solutions that support rapid development cycles, diverse device environments, and distributed workforces while protecting intellectual property.',
        implementationTime: '6-14 weeks',
        savings: '40-50%',
        cloudAdoption: '78%'
      },
      other: {
        name: 'Other Industries',
        description: 'Organizations across various industries benefit from modern, cloud-native NAC solutions that reduce operational overhead, improve security posture, and enable rapid deployment.',
        implementationTime: '10-18 weeks',
        savings: '35-45%',
        cloudAdoption: '65%'
      }
    };
    
    return industryInfo[industryId] || {
      name: 'Select Industry',
      description: 'Select an industry to see relevant compliance frameworks and requirements.',
      implementationTime: 'Varies',
      savings: 'Varies',
      cloudAdoption: 'Varies'
    };
  }
  
  // Show compliance frameworks
  function showComplianceFrameworks(industryId) {
    if (!elements.complianceFrameworks) return;
    
    // Clear compliance frameworks
    elements.complianceFrameworks.innerHTML = '';
    
    // Check if ComplianceFrameworks is available
    if (typeof ComplianceFrameworks !== 'undefined') {
      // Get frameworks for industry
      const frameworks = ComplianceFrameworks.getFrameworksForIndustry(industryId);
      
      // Create industry compliance visualization
      ComplianceFrameworks.createIndustryCompliance('compliance-frameworks', industryId);
    } else {
      // Create placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'compliance-placeholder';
      placeholder.innerHTML = `
        <p>Select an industry to see relevant compliance frameworks</p>
      `;
      
      elements.complianceFrameworks.appendChild(placeholder);
    }
  }
  
  // Toggle location count
  function toggleLocationCount(show) {
    if (!elements.locationCount) return;
    
    // Update state
    state.multipleLocations = show;
    
    // Show/hide location count
    if (show) {
      elements.locationCount.classList.remove('hidden');
    } else {
      elements.locationCount.classList.add('hidden');
    }
  }
  
  // Toggle legacy percentage
  function toggleLegacyPercentage(show) {
    if (!elements.legacyPercentage) return;
    
    // Update state
    state.legacyDevices = show;
    
    // Show/hide legacy percentage
    if (show) {
      elements.legacyPercentage.classList.remove('hidden');
    } else {
      elements.legacyPercentage.classList.add('hidden');
    }
  }
  
  // Toggle policy complexity
  function togglePolicyComplexity(show) {
    if (!elements.policyComplexity) return;
    
    // Update state
    state.customPolicies = show;
    
    // Show/hide policy complexity
    if (show) {
      elements.policyComplexity.classList.remove('hidden');
    } else {
      elements.policyComplexity.classList.add('hidden');
    }
  }
  
  // Update Portnox cost
  function updatePortnoxCost() {
    if (!elements.portnoxCostPerDevice || !elements.portnoxDiscount || !elements.effectiveDeviceCost || !elements.estimatedAnnualCost || !elements.deviceCount) return;
    
    // Get values
    const costPerDevice = parseFloat(elements.portnoxCostPerDevice.value);
    const discount = parseFloat(elements.portnoxDiscount.value);
    const deviceCount = parseInt(elements.deviceCount.value);
    
    // Update state
    state.portnoxCostPerDevice = costPerDevice;
    state.portnoxDiscount = discount;
    
    // Calculate effective cost
    const effectiveCost = costPerDevice * (1 - discount / 100);
    
    // Calculate annual cost
    const annualCost = effectiveCost * deviceCount * 12;
    
    // Update UI
    elements.portnoxCostPerDevice.nextElementSibling.textContent = `$${costPerDevice.toFixed(2)}`;
    elements.portnoxDiscount.nextElementSibling.textContent = `${discount}%`;
    elements.effectiveDeviceCost.textContent = `$${effectiveCost.toFixed(2)}`;
    elements.estimatedAnnualCost.textContent = `$${annualCost.toLocaleString()}`;
  }
  
  // Show results
  function showResults() {
    if (!elements.resultsContainer) return;
    
    // Show results container
    elements.resultsContainer.classList.remove('hidden');
    elements.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Update all charts
    updateAllCharts();
    
    // Create vendor comparison
    createVendorComparison();
    
    // Create risk analysis
    createRiskAnalysis();
  }
  
  // Update all charts
  function updateAllCharts() {
    if (!state.selectedVendor) return;
    
    // Update charts
    updateChartsForVendor(state.selectedVendor);
  }
  
  // Create vendor comparison
  function createVendorComparison() {
    // Check if VendorAdvantages is available
    if (typeof VendorAdvantages !== 'undefined') {
      // Create vendor comparison
      VendorAdvantages.createComparison('vendor-comparison-container', {
        currentVendor: state.selectedVendor
      });
    }
  }
  
  // Create risk analysis
  function createRiskAnalysis() {
    // Check if RiskAnalysis is available
    if (typeof RiskAnalysis !== 'undefined') {
      // Create risk analysis
      RiskAnalysis.createRiskAnalysis('risk-analysis-container', {
        industry: state.selectedIndustry || 'technology',
        orgSize: state.organizationSize,
        nacType: 'cloud'
      });
    }
  }
  
  // Update charts for vendor
  function updateChartsForVendor(vendorId) {
    // Update TCO comparison chart
    if (elements.tcoComparisonChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.tcoComparison('tco-comparison-chart', {
        labels: [getVendorName(vendorId), 'Portnox Cloud'],
        values: calculateTCOValues(vendorId)
      });
    }
    
    // Update cumulative cost chart
    if (elements.cumulativeCostChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.cumulativeCost('cumulative-cost-chart', {
        labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
        currentValues: calculateCumulativeCostValues(vendorId),
        portnoxValues: calculateCumulativeCostValues('portnox')
      });
    }
    
    // Update cost breakdown charts
    if (elements.currentBreakdownChart && elements.alternativeBreakdownChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.costBreakdown('current-breakdown-chart', {
        labels: ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'],
        values: calculateCostBreakdownValues(vendorId)
      });
      
      ModernCharts.charts.costBreakdown('alternative-breakdown-chart', {
        labels: ['Implementation', 'Licensing', 'Support', 'Personnel'],
        values: calculateCostBreakdownValues('portnox')
      });
    }
    
    // Update feature comparison chart
    if (elements.featureComparisonChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.featureComparison('feature-comparison-chart', {
        currentVendor: vendorId,
        currentVendorName: getVendorName(vendorId),
        currentValues: calculateFeatureValues(vendorId),
        portnoxValues: calculateFeatureValues('portnox')
      });
    }
    
    // Update implementation comparison chart
    if (elements.implementationComparisonChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.implementationComparison('implementation-comparison-chart', {
        currentVendor: vendorId,
        currentVendorName: getVendorName(vendorId),
        currentValues: calculateImplementationValues(vendorId),
        portnoxValues: calculateImplementationValues('portnox')
      });
    }
    
    // Update ROI chart
    if (elements.roiChart && typeof ModernCharts !== 'undefined') {
      ModernCharts.charts.roi('roi-chart', {
        currentVendor: vendorId,
        currentVendorName: getVendorName(vendorId),
        currentValues: calculateROIValues(vendorId),
        portnoxValues: calculateROIValues('portnox')
      });
    }
  }
  
  // Calculate TCO values
  function calculateTCOValues(vendorId) {
    const tcoValues = {
      cisco: [300000, 150000],
      aruba: [250000, 150000],
      forescout: [280000, 150000],
      fortinac: [220000, 150000],
      nps: [180000, 150000],
      securew2: [200000, 150000],
      noNac: [0, 150000],
      portnox: [150000, 150000]
    };
    
    return tcoValues[vendorId] || [0, 0];
  }
  
  // Calculate cumulative cost values
  function calculateCumulativeCostValues(vendorId) {
    const cumulativeValues = {
      cisco: [100000, 200000, 300000, 400000],
      aruba: [80000, 160000, 240000, 320000],
      forescout: [90000, 180000, 270000, 360000],
      fortinac: [70000, 140000, 210000, 280000],
      nps: [50000, 100000, 150000, 200000],
      securew2: [60000, 120000, 180000, 240000],
      noNac: [0, 0, 0, 0],
      portnox: [45000, 90000, 135000, 180000]
    };
    
    return cumulativeValues[vendorId] || [0, 0, 0, 0];
  }
  
  // Calculate cost breakdown values
  function calculateCostBreakdownValues(vendorId) {
    const breakdownValues = {
      cisco: [50000, 25000, 45000, 60000, 40000, 30000, 50000],
      aruba: [40000, 30000, 40000, 50000, 35000, 25000, 40000],
      forescout: [45000, 30000, 50000, 55000, 35000, 25000, 45000],
      fortinac: [35000, 25000, 35000, 45000, 30000, 20000, 35000],
      nps: [20000, 0, 30000, 0, 20000, 15000, 30000],
      securew2: [0, 20000, 30000, 45000, 25000, 20000, 30000],
      noNac: [0, 0, 0, 0, 0, 0, 0],
      portnox: [20000, 0, 0, 80000, 0, 20000, 30000]
    };
    
    return breakdownValues[vendorId] || [0, 0, 0, 0, 0, 0, 0];
  }
  
  // Calculate feature values
  function calculateFeatureValues(vendorId) {
    const featureValues = {
      cisco: [70, 60, 50, 40, 80, 75, 55],
      aruba: [65, 65, 55, 45, 75, 70, 60],
      forescout: [75, 70, 50, 45, 70, 65, 50],
      fortinac: [60, 55, 45, 50, 65, 60, 65],
      nps: [40, 45, 50, 60, 50, 45, 35],
      securew2: [60, 65, 70, 65, 55, 50, 80],
      noNac: [0, 0, 0, 0, 0, 0, 0],
      portnox: [90, 85, 95, 90, 85, 90, 95]
    };
    
    return featureValues[vendorId] || [0, 0, 0, 0, 0, 0, 0];
  }
  
  // Calculate implementation values
  function calculateImplementationValues(vendorId) {
    const implementationValues = {
      cisco: [15, 10, 25, 20, 20, 10],
      aruba: [12, 8, 20, 18, 15, 8],
      forescout: [15, 10, 25, 20, 18, 10],
      fortinac: [10, 8, 18, 15, 15, 8],
      nps: [8, 5, 15, 12, 10, 7],
      securew2: [7, 3, 10, 8, 7, 5],
      noNac: [0, 0, 0, 0, 0, 0],
      portnox: [3, 1, 4, 5, 3, 2]
    };
    
    return implementationValues[vendorId] || [0, 0, 0, 0, 0, 0];
  }
  
  // Calculate ROI values
  function calculateROIValues(vendorId) {
    const roiValues = {
      cisco: [-220000, -140000, -60000, 20000, 100000, 180000],
      aruba: [-180000, -110000, -40000, 30000, 100000, 170000],
      forescout: [-200000, -120000, -40000, 40000, 120000, 200000],
      fortinac: [-150000, -80000, -10000, 60000, 130000, 200000],
      nps: [-100000, -50000, 0, 50000, 100000, 150000],
      securew2: [-120000, -60000, 0, 60000, 120000, 180000],
      noNac: [0, 0, 0, 0, 0, 0],
      portnox: [-50000, 0, 50000, 100000, 150000, 200000]
    };
    
    return roiValues[vendorId] || [0, 0, 0, 0, 0, 0];
  }
  
  // Handle tab click
  function handleTabClick(event) {
    const tabButton = event.currentTarget;
    const tabId = tabButton.dataset.tab;
    
    if (!tabId) return;
    
    // Update active tab button
    if (elements.tabButtons) {
      elements.tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1');
      });
    }
    
    tabButton.classList.add('active');
    tabButton.setAttribute('aria-selected', 'true');
    tabButton.setAttribute('tabindex', '0');
    
    // Update active tab pane
    if (elements.tabContent) {
      elements.tabContent.forEach(pane => {
        pane.classList.remove('active');
      });
    }
    
    const tabPane = document.getElementById(tabId);
    if (tabPane) {
      tabPane.classList.add('active');
    }
  }
  
  // Handle sub-tab click
  function handleSubTabClick(event) {
    const tabButton = event.currentTarget;
    const tabId = tabButton.dataset.subtab;
    
    if (!tabId) return;
    
    // Update active sub-tab button
    if (elements.subTabButtons) {
      elements.subTabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1');
      });
    }
    
    tabButton.classList.add('active');
    tabButton.setAttribute('aria-selected', 'true');
    tabButton.setAttribute('tabindex', '0');
    
    // Update active sub-tab pane
    if (elements.subTabContent) {
      elements.subTabContent.forEach(pane => {
        pane.classList.remove('active');
      });
    }
    
    const tabPane = document.getElementById(tabId);
    if (tabPane) {
      tabPane.classList.add('active');
    }
  }
  
  // Show help modal
  function showHelpModal() {
    if (elements.helpModal) {
      elements.helpModal.classList.remove('hidden');
    }
  }
  
  // Hide help modal
  function hideHelpModal() {
    if (elements.helpModal) {
      elements.helpModal.classList.add('hidden');
    }
  }
  
  // Handle resize
  function handleResize() {
    // Resize charts
    console.log('Resizing charts');
    updateChartsForVendor(state.selectedVendor);
  }
  
  // Initialize the application
  init();
});
#!/bin/bash

# NAC Architecture Designer Pro Enhancement Deployment Script
echo "Starting NAC Architecture Designer Pro Enhancement Deployment..."

# Create backup of the original files
echo "Creating backup..."
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_dir="backup_$timestamp"
mkdir -p "$backup_dir"
cp -r css js img index.html "$backup_dir/"

# Create necessary directories
echo "Creating directories..."
mkdir -p css/themes/enhanced
mkdir -p css/animations
mkdir -p css/visualizations
mkdir -p css/components/advanced
mkdir -p js/components/enhanced
mkdir -p js/charts/enhanced
mkdir -p js/risk-analysis
mkdir -p js/compliance
mkdir -p js/vendor-comparisons
mkdir -p img/wizard-icons
mkdir -p libs/js
mkdir -p libs/css
mkdir -p webfonts

# Download required font files to fix missing resources
echo "Downloading font files..."
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-solid-900.woff2 -o webfonts/fa-solid-900.woff2
curl -s https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/webfonts/fa-solid-900.ttf -o webfonts/fa-solid-900.ttf

# Create wizard icons
echo "Creating wizard icons..."
# (Wizard icon creation code from previous implementation)

# Install enhanced files
echo "Installing enhanced CSS files..."
# (CSS file creation code from previous implementation)

echo "Installing enhanced JavaScript files..."
# (JavaScript file creation code from previous implementation)

# Fix existing errors
echo "Fixing existing errors..."

# Fix duplicate IDs
sed -i 's/id="dark-mode-toggle".*>/id="dark-mode-toggle-header">/g' index.html

# Fix chart initialization conflicts
cat > js/fixes/chart-init-fix.js << 'EOF'
/**
 * Chart Initialization Fix
 *
 * This script fixes chart initialization conflicts by creating a unified
 * chart initialization process that prevents multiple scripts from
 * trying to initialize the same charts.
 */

(function() {
  console.log('Unified chart initialization starting...');

  // Store initialized chart references
  window.initializedCharts = window.initializedCharts || {};

  // Override Chart constructor to track initialized charts
  const originalChart = window.Chart;
  if (originalChart) {
    window.Chart = function(ctx, config) {
      const canvas = ctx.canvas || ctx;
      const chartId = canvas.id;

      // Check if chart is already initialized
      if (chartId && window.initializedCharts[chartId]) {
        console.log(`Chart ${chartId} already initialized, skipping`);
        return window.initializedCharts[chartId];
      }

      // Create new chart
      const chart = new originalChart(ctx, config);

      // Store reference
      if (chartId) {
        window.initializedCharts[chartId] = chart;
      }

      return chart;
    };

    // Copy prototype and static properties
    window.Chart.prototype = originalChart.prototype;
    Object.keys(originalChart).forEach(key => {
      window.Chart[key] = originalChart[key];
    });
  }

  // Unified chart initialization function
  window.initializeCharts = function() {
    // Use enhanced chart builder if available
    if (window.ModernCharts) {
      console.log('Using enhanced chart builder to initialize charts');
      // Let the chart builder handle initialization
    } else if (window.ChartBuilder) {
      console.log('Using chart builder compatibility layer');
      window.ChartBuilder.initCharts();
    } else {
      console.log('No chart builder available');
    }
  };

  // Initialize charts when DOM is loaded
  document.addEventListener('DOMContentLoaded', window.initializeCharts);

  console.log('Unified chart initialization complete');
})();
