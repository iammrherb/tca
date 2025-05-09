/**
 * TCO Wizard Controller
 * Controls the pop-out wizard for TCO calculation
 */
const TCOWizard = (function() {
    // Wizard state
    let currentStep = 1;
    const totalSteps = 5;
    
    // Step definitions
    const steps = [
        {
            id: 1,
            title: 'Current NAC Solution',
            description: 'Select your current NAC vendor or "No NAC" if you don\'t have a solution in place'
        },
        {
            id: 2,
            title: 'Industry & Compliance',
            description: 'Select your industry to see relevant compliance frameworks'
        },
        {
            id: 3,
            title: 'Organization Details',
            description: 'Tell us about your environment to customize the analysis'
        },
        {
            id: 4,
            title: 'Cost Configuration',
            description: 'Fine-tune cost parameters for more accurate comparison'
        },
        {
            id: 5,
            title: 'Review',
            description: 'Review your selections before calculating TCO'
        }
    ];
    
    // Cached DOM elements
    let wizardOverlay;
    let wizardContainer;
    let wizardContent;
    let wizardNav;
    let prevButton;
    let nextButton;
    
    // Initialize wizard
    function init() {
        createWizardDOM();
        cacheElements();
        renderWizardNav();
        setupEventListeners();
    }
    
    // Create Wizard DOM structure
    function createWizardDOM() {
        const wizardHTML = `
            <div id="wizard-overlay" class="wizard-overlay">
                <div id="wizard-container" class="wizard-container">
                    <div class="wizard-header">
                        <h2>Zero Trust NAC Architecture Designer</h2>
                        <button id="wizard-close" class="wizard-close">&times;</button>
                    </div>
                    
                    <div id="wizard-nav" class="wizard-nav"></div>
                    
                    <div id="wizard-content" class="wizard-content">
                        <!-- Step content will be dynamically loaded -->
                    </div>
                    
                    <div class="wizard-footer">
                        <button id="wizard-prev" class="btn btn-outline">Previous</button>
                        <button id="wizard-next" class="btn btn-primary">Next</button>
                    </div>
                </div>
            </div>
        `;
        
        // Append to document body
        const wizardDiv = document.createElement('div');
        wizardDiv.innerHTML = wizardHTML;
        document.body.appendChild(wizardDiv.firstElementChild);
        
        // Create step content templates
        createStepContentTemplates();
    }
    
    // Create templates for each step
    function createStepContentTemplates() {
        // Step 1: Vendor Selection
        const step1HTML = `
            <div id="step-1-content" class="wizard-step-content active">
                <h3>Select Your Current NAC Solution</h3>
                <p>Choose your current NAC vendor or select "No NAC" if you don't have a solution in place.</p>
                
                <div class="vendor-cards-grid">
                    <div class="vendor-card" data-vendor="cisco">
                        <img src="img/vendors/cisco-logo.png" alt="Cisco">
                        <span>Cisco ISE</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card" data-vendor="aruba">
                        <img src="img/vendors/aruba-logo.png" alt="Aruba">
                        <span>Aruba ClearPass</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card" data-vendor="forescout">
                        <img src="img/vendors/forescout-logo.png" alt="Forescout">
                        <span>Forescout</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card" data-vendor="fortinac">
                        <img src="img/vendors/fortinac-logo.png" alt="FortiNAC">
                        <span>FortiNAC</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card" data-vendor="nps">
                        <img src="img/vendors/microsoft-logo.png" alt="Microsoft NPS">
                        <span>Microsoft NPS</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card" data-vendor="securew2">
                        <img src="img/vendors/securew2-logo.png" alt="SecureW2">
                        <span>SecureW2</span>
                        <div class="status-badge"></div>
                    </div>
                    <div class="vendor-card no-nac" data-vendor="noNac">
                        <img src="img/icons/no-nac-icon.svg" alt="No NAC">
                        <span>No NAC Solution</span>
                        <div class="status-badge"></div>
                    </div>
                </div>
                
                <div id="vendor-info" class="info-box hidden">
                    <h4 id="vendor-info-title"></h4>
                    <p id="vendor-info-description"></p>
                </div>
            </div>
        `;
        
        // Step 2: Industry & Compliance
        const step2HTML = `
            <div id="step-2-content" class="wizard-step-content">
                <h3>Select Your Industry</h3>
                <p>Choose your industry to see relevant compliance frameworks and benchmarks.</p>
                
                <div class="form-group">
                    <label for="industry-select">Industry</label>
                    <select id="industry-select" class="form-control">
                        <option value="">Select an industry...</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="financial">Financial Services</option>
                        <option value="retail">Retail</option>
                        <option value="education">Education</option>
                        <option value="government">Government</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="technology">Technology</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div id="industry-info" class="info-box hidden">
                    <h4 id="industry-info-title"></h4>
                    <p id="industry-info-description"></p>
                </div>
                
                <div id="compliance-frameworks" class="compliance-grid hidden">
                    <h4>Relevant Compliance Frameworks</h4>
                    <div id="compliance-cards"></div>
                </div>
            </div>
        `;
        
        // Step 3: Organization Details
        const step3HTML = `
            <div id="step-3-content" class="wizard-step-content">
                <h3>Organization Details</h3>
                <p>Tell us about your environment to customize the TCO analysis.</p>
                
                <div class="form-group">
                    <label for="device-count">Number of Devices</label>
                    <input type="number" id="device-count" class="form-control" value="1000" min="10">
                    <div class="help-text">The total number of devices that will connect to your network</div>
                </div>
                
                <div class="form-group">
                    <label for="years-to-project">Years to Project</label>
                    <select id="years-to-project" class="form-control">
                        <option value="1">1 Year</option>
                        <option value="2">2 Years</option>
                        <option value="3" selected>3 Years</option>
                        <option value="4">4 Years</option>
                        <option value="5">5 Years</option>
                    </select>
                    <div class="help-text">The time period for TCO calculation</div>
                </div>
                
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="multi-location" class="form-check">
                    <label for="multi-location">Multiple Locations</label>
                </div>
                
                <div id="location-count-container" class="form-group hidden">
                    <label for="location-count">Number of Locations</label>
                    <input type="number" id="location-count" class="form-control" value="2" min="2">
                </div>
                
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="legacy-devices" class="form-check">
                    <label for="legacy-devices">Legacy Devices</label>
                </div>
                
                <div id="legacy-percentage-container" class="form-group hidden">
                    <label for="legacy-percentage">Legacy Device Percentage</label>
                    <div class="range-container">
                        <input type="range" id="legacy-percentage" min="0" max="100" value="30">
                        <span id="legacy-percentage-value">30%</span>
                    </div>
                </div>
            </div>
        `;
        
        // Step 4: Cost Configuration
        const step4HTML = `
            <div id="step-4-content" class="wizard-step-content">
                <h3>Cost Configuration</h3>
                <p>Fine-tune cost parameters for more accurate comparison.</p>
                
                <div class="options-grid">
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="complex-auth" class="form-check">
                        <label for="complex-auth">Complex Authentication</label>
                        <div class="help-text">MFA or complex authentication chains</div>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="cloud-integration" class="form-check">
                        <label for="cloud-integration">Cloud Integration</label>
                        <div class="help-text">Integration with cloud services</div>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="custom-policies" class="form-check">
                        <label for="custom-policies">Custom Policies</label>
                        <div class="help-text">Custom security policies</div>
                    </div>
                </div>
                
                <div id="policy-complexity-container" class="form-group hidden">
                    <label for="policy-complexity">Policy Complexity</label>
                    <select id="policy-complexity" class="form-control">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <h3 class="mt-lg">Portnox Pricing Options</h3>
                
                <div class="form-group">
                    <label for="portnox-cost-per-device">Monthly Cost Per Device ($)</label>
                    <div class="range-container">
                        <input type="range" id="portnox-cost-per-device" min="0.5" max="6" step="0.1" value="4">
                        <span id="portnox-cost-value">$4.00</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="portnox-discount">Volume Discount (%)</label>
                    <div class="range-container">
                        <input type="range" id="portnox-discount" min="0" max="80" step="1" value="0">
                        <span id="portnox-discount-value">0%</span>
                    </div>
                </div>
                
                <div id="pricing-summary" class="info-box">
                    <div class="info-row">
                        <span class="info-label">Effective Monthly Cost Per Device</span>
                        <span id="effective-cost" class="info-value">$4.00</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Estimated Annual Cost</span>
                        <span id="annual-cost" class="info-value">$48,000</span>
                    </div>
                </div>
            </div>
        `;
        
        // Step 5: Review
        const step5HTML = `
            <div id="step-5-content" class="wizard-step-content">
                <h3>Review Your Selections</h3>
                <p>Confirm your selections before viewing TCO results.</p>
                
                <div class="review-section">
                    <h4>Current Solution</h4>
                    <p id="review-vendor">No selection</p>
                </div>
                
                <div class="review-section">
                    <h4>Industry</h4>
                    <p id="review-industry">No selection</p>
                </div>
                
                <div class="review-section">
                    <h4>Organization Details</h4>
                    <ul class="review-list">
                        <li>Devices: <span id="review-devices">1000</span></li>
                        <li>Years to Project: <span id="review-years">3</span></li>
                        <li>Multiple Locations: <span id="review-locations">No</span></li>
                        <li>Legacy Devices: <span id="review-legacy">No</span></li>
                    </ul>
                </div>
                
                <div class="review-section">
                    <h4>Cost Configuration</h4>
                    <ul class="review-list">
                        <li>Complex Authentication: <span id="review-auth">No</span></li>
                        <li>Cloud Integration: <span id="review-cloud">No</span></li>
                        <li>Custom Policies: <span id="review-policies">No</span></li>
                        <li>Portnox Monthly Cost: <span id="review-portnox-cost">$4.00</span></li>
                        <li>Volume Discount: <span id="review-discount">0%</span></li>
                    </ul>
                </div>
            </div>
        `;
        
        // Append step content to wizard content
        const wizardContent = document.getElementById('wizard-content');
        wizardContent.innerHTML = step1HTML + step2HTML + step3HTML + step4HTML + step5HTML;
    }
    
    // Cache DOM elements
    function cacheElements() {
        wizardOverlay = document.getElementById('wizard-overlay');
        wizardContainer = document.getElementById('wizard-container');
        wizardContent = document.getElementById('wizard-content');
        wizardNav = document.getElementById('wizard-nav');
        prevButton = document.getElementById('wizard-prev');
        nextButton = document.getElementById('wizard-next');
    }
    
    // Render wizard navigation
    function renderWizardNav() {
        let navHTML = '<ul class="wizard-steps">';
        
        steps.forEach(step => {
            navHTML += `
                <li class="wizard-step ${currentStep === step.id ? 'active' : ''}" data-step="${step.id}">
                    <div class="step-number">${step.id}</div>
                    <div class="step-info">
                        <div class="step-title">${step.title}</div>
                        <div class="step-description">${step.description}</div>
                    </div>
                </li>
            `;
        });
        
        navHTML += '</ul>';
        wizardNav.innerHTML = navHTML;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Close button
        document.getElementById('wizard-close').addEventListener('click', closeWizard);
        
        // Previous/Next buttons
        prevButton.addEventListener('click', goToPreviousStep);
        nextButton.addEventListener('click', goToNextStep);
        
        // Step navigation
        wizardNav.addEventListener('click', function(e) {
            const stepEl = e.target.closest('.wizard-step');
            if (stepEl) {
                const stepNumber = parseInt(stepEl.dataset.step);
                
                // Only allow clicking on completed steps or the current step + 1
                if (stepNumber < currentStep || stepNumber === currentStep + 1) {
                    goToStep(stepNumber);
                }
            }
        });
        
        // Vendor selection
        const vendorCards = document.querySelectorAll('#step-1-content .vendor-card');
        vendorCards.forEach(card => {
            card.addEventListener('click', function() {
                vendorCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Show vendor info
                const vendorId = this.dataset.vendor;
                showVendorInfo(vendorId);
            });
        });
        
        // Industry selection
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            industrySelect.addEventListener('change', function() {
                const industryId = this.value;
                if (industryId) {
                    showIndustryInfo(industryId);
                    showComplianceFrameworks(industryId);
                } else {
                    document.getElementById('industry-info').classList.add('hidden');
                    document.getElementById('compliance-frameworks').classList.add('hidden');
                }
            });
        }
        
        // Multiple locations checkbox
        const multiLocationCheck = document.getElementById('multi-location');
        if (multiLocationCheck) {
            multiLocationCheck.addEventListener('change', function() {
                document.getElementById('location-count-container').classList.toggle('hidden', !this.checked);
            });
        }
        
        // Legacy devices checkbox
        const legacyDevicesCheck = document.getElementById('legacy-devices');
        if (legacyDevicesCheck) {
            legacyDevicesCheck.addEventListener('change', function() {
                document.getElementById('legacy-percentage-container').classList.toggle('hidden', !this.checked);
            });
        }
        
        // Legacy percentage range
        const legacyRange = document.getElementById('legacy-percentage');
        if (legacyRange) {
            legacyRange.addEventListener('input', function() {
                document.getElementById('legacy-percentage-value').textContent = this.value + '%';
            });
        }
        
        // Custom policies checkbox
        const customPoliciesCheck = document.getElementById('custom-policies');
        if (customPoliciesCheck) {
            customPoliciesCheck.addEventListener('change', function() {
                document.getElementById('policy-complexity-container').classList.toggle('hidden', !this.checked);
            });
        }
        
        // Portnox cost range
        const portnoxCostRange = document.getElementById('portnox-cost-per-device');
        if (portnoxCostRange) {
            portnoxCostRange.addEventListener('input', function() {
                const cost = parseFloat(this.value).toFixed(2);
                document.getElementById('portnox-cost-value').textContent = '$' + cost;
                updatePricingSummary();
            });
        }
        
        // Portnox discount range
        const portnoxDiscountRange = document.getElementById('portnox-discount');
        if (portnoxDiscountRange) {
            portnoxDiscountRange.addEventListener('input', function() {
                document.getElementById('portnox-discount-value').textContent = this.value + '%';
                updatePricingSummary();
            });
        }
    }
    
    // Show vendor information
    function showVendorInfo(vendorId) {
        const infoBox = document.getElementById('vendor-info');
        const titleEl = document.getElementById('vendor-info-title');
        const descEl = document.getElementById('vendor-info-description');
        
        // Vendor data
        const vendorData = {
            cisco: {
                name: 'Cisco ISE',
                description: 'Comprehensive on-premises NAC solution with extensive enterprise features and strong Cisco infrastructure integration.'
            },
            aruba: {
                name: 'Aruba ClearPass',
                description: 'Full-featured NAC solution with excellent guest management capabilities and multi-vendor support.'
            },
            forescout: {
                name: 'Forescout',
                description: 'Agentless visibility platform with strong device discovery and classification, particularly for IoT/OT environments.'
            },
            fortinac: {
                name: 'FortiNAC',
                description: 'Part of the Fortinet Security Fabric with good integration and protection for Fortinet environments.'
            },
            nps: {
                name: 'Microsoft NPS',
                description: 'Basic NAC functionality included with Windows Server, providing simple authentication with minimal features.'
            },
            securew2: {
                name: 'SecureW2',
                description: 'Cloud-focused solution specializing in certificate-based authentication and passwordless access.'
            },
            noNac: {
                name: 'No NAC Solution',
                description: 'Operating without dedicated NAC increases security risks, complicates compliance, and reduces visibility into network endpoints.'
            }
        };
        
        // Set content
        if (vendorData[vendorId]) {
            titleEl.textContent = vendorData[vendorId].name;
            descEl.textContent = vendorData[vendorId].description;
            infoBox.classList.remove('hidden');
        } else {
            infoBox.classList.add('hidden');
        }
    }
    
    // Show industry information
    function showIndustryInfo(industryId) {
        const infoBox = document.getElementById('industry-info');
        const titleEl = document.getElementById('industry-info-title');
        const descEl = document.getElementById('industry-info-description');
        
        // Industry data
        const industryData = {
            healthcare: {
                name: 'Healthcare',
                description: 'Healthcare organizations face unique challenges securing medical devices, patient data, and maintaining compliance with regulations like HIPAA.'
            },
            financial: {
                name: 'Financial Services',
                description: 'Financial institutions require robust security for protecting sensitive financial data and maintaining strict regulatory compliance.'
            },
            retail: {
                name: 'Retail',
                description: 'Retail environments need to secure payment systems, customer data, and diverse store networks while providing convenient guest access.'
            },
            education: {
                name: 'Education',
                description: 'Educational institutions balance open access for students and faculty with protecting sensitive data and research networks.'
            },
            government: {
                name: 'Government',
                description: 'Government agencies require advanced security controls to protect sensitive information and meet strict compliance requirements.'
            },
            manufacturing: {
                name: 'Manufacturing',
                description: 'Manufacturing environments face challenges securing both IT and OT networks while maintaining production continuity.'
            },
            technology: {
                name: 'Technology',
                description: 'Technology companies need flexible security that supports innovation while protecting intellectual property and customer data.'
            },
            hospitality: {
                name: 'Hospitality',
                description: 'Hospitality businesses require secure guest access, PCI compliance for payment systems, and network segmentation.'
            },
            other: {
                name: 'Other Industries',
                description: 'Organizations across various industries benefit from NAC for network security, access control, and meeting specific compliance requirements.'
            }
        };
        
        // Set content
        if (industryData[industryId]) {
            titleEl.textContent = industryData[industryId].name;
            descEl.textContent = industryData[industryId].description;
            infoBox.classList.remove('hidden');
        } else {
            infoBox.classList.add('hidden');
        }
    }
    
    // Show compliance frameworks
    function showComplianceFrameworks(industryId) {
        const frameworksContainer = document.getElementById('compliance-frameworks');
        const cardsContainer = document.getElementById('compliance-cards');
        
        // Compliance data by industry
        const complianceData = {
            healthcare: ['hipaa', 'pci', 'nist'],
            financial: ['pci', 'glba', 'gdpr', 'nist'],
            retail: ['pci', 'gdpr', 'nist'],
            education: ['ferpa', 'gdpr', 'nist'],
            government: ['cmmc', 'fedramp', 'nist800171', 'nist'],
            manufacturing: ['cmmc', 'nist800171', 'nist'],
            technology: ['gdpr', 'iso27001', 'nist'],
            hospitality: ['pci', 'gdpr', 'nist'],
            other: ['gdpr', 'nist', 'iso27001']
        };
        
        // Framework details
        const frameworks = {
            hipaa: {
                name: 'HIPAA',
                description: 'Health Insurance Portability and Accountability Act'
            },
            pci: {
                name: 'PCI DSS',
                description: 'Payment Card Industry Data Security Standard'
            },
            gdpr: {
                name: 'GDPR',
                description: 'General Data Protection Regulation'
            },
            cmmc: {
                name: 'CMMC',
                description: 'Cybersecurity Maturity Model Certification'
            },
            fedramp: {
                name: 'FedRAMP',
                description: 'Federal Risk and Authorization Management Program'
            },
            ferpa: {
                name: 'FERPA',
                description: 'Family Educational Rights and Privacy Act'
            },
            glba: {
                name: 'GLBA',
                description: 'Gramm-Leach-Bliley Act'
            },
            nist: {
                name: 'NIST CSF',
                description: 'NIST Cybersecurity Framework'
            },
            nist800171: {
                name: 'NIST 800-171',
                description: 'Protecting Controlled Unclassified Information'
            },
            iso27001: {
                name: 'ISO 27001',
                description: 'Information Security Management'
            }
        };
        
        // Generate framework cards
        if (complianceData[industryId]) {
            let cardsHTML = '';
            
            complianceData[industryId].forEach(framework => {
                if (frameworks[framework]) {
                    cardsHTML += `
                        <div class="compliance-card">
                            <h5>${frameworks[framework].name}</h5>
                            <p>${frameworks[framework].description}</p>
                        </div>
                    `;
                }
            });
            
            cardsContainer.innerHTML = cardsHTML;
            frameworksContainer.classList.remove('hidden');
        } else {
            frameworksContainer.classList.add('hidden');
        }
    }
    
    // Update pricing summary
    function updatePricingSummary() {
        const costPerDevice = parseFloat(document.getElementById('portnox-cost-per-device').value);
        const discount = parseFloat(document.getElementById('portnox-discount').value);
        const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
        
        // Calculate effective cost
        const effectiveCost = costPerDevice * (1 - discount / 100);
        // Calculate annual cost
        const annualCost = effectiveCost * 12 * deviceCount;
        
        // Update UI
        document.getElementById('effective-cost').textContent = '$' + effectiveCost.toFixed(2);
        document.getElementById('annual-cost').textContent = '$' + annualCost.toLocaleString();
    }
    
    // Go to next step
    function goToNextStep() {
        if (currentStep < totalSteps) {
            // Validate current step
            if (validateStep(currentStep)) {
                currentStep++;
                updateWizardUI();
                
                // Update review page if going to last step
                if (currentStep === totalSteps) {
                    updateReviewPage();
                }
            }
        } else {
            // Process final submission
            processWizardCompletion();
        }
    }
    
    // Go to previous step
    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            updateWizardUI();
        }
    }
    
    // Go to specific step
    function goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            if (stepNumber > currentStep && !validateStep(currentStep)) {
                return;
            }
            
            currentStep = stepNumber;
            updateWizardUI();
            
            // Update review page if going to last step
            if (currentStep === totalSteps) {
                updateReviewPage();
            }
        }
    }
    
    // Update wizard UI
    function updateWizardUI() {
        // Update steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            const stepId = parseInt(step.dataset.step);
            
            step.classList.remove('active', 'completed');
            
            if (stepId === currentStep) {
                step.classList.add('active');
            } else if (stepId < currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update content
        document.querySelectorAll('.wizard-step-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const currentContent = document.getElementById(`step-${currentStep}-content`);
        if (currentContent) {
            currentContent.classList.add('active');
        }
        
        // Update buttons
        prevButton.style.display = currentStep === 1 ? 'none' : 'block';
        nextButton.textContent = currentStep === totalSteps ? 'Calculate TCO' : 'Next';
    }
    
    // Validate current step
    function validateStep(step) {
        switch (step) {
            case 1:
                // Vendor selection
                const selectedVendor = document.querySelector('#step-1-content .vendor-card.active');
                if (!selectedVendor) {
                    alert('Please select a NAC vendor or "No NAC" option.');
                    return false;
                }
                return true;
                
            case 2:
                // Industry selection
                const selectedIndustry = document.getElementById('industry-select').value;
                if (!selectedIndustry) {
                    alert('Please select an industry.');
                    return false;
                }
                return true;
                
            case 3:
                // Organization details
                const deviceCount = document.getElementById('device-count').value;
                if (!deviceCount || isNaN(deviceCount) || parseInt(deviceCount) <= 0) {
                    alert('Please enter a valid number of devices.');
                    return false;
                }
                return true;
                
            case 4:
                // Cost configuration - nothing required
                return true;
                
            default:
                return true;
        }
    }
    
    // Update review page
    function updateReviewPage() {
        // Current vendor
        const selectedVendor = document.querySelector('#step-1-content .vendor-card.active');
        const vendorName = selectedVendor ? selectedVendor.querySelector('span').textContent : 'No selection';
        document.getElementById('review-vendor').textContent = vendorName;
        
        // Industry
        const industryEl = document.getElementById('industry-select');
        const industryName = industryEl.options[industryEl.selectedIndex].text;
        document.getElementById('review-industry').textContent = industryName;
        
        // Organization details
        document.getElementById('review-devices').textContent = document.getElementById('device-count').value;
        document.getElementById('review-years').textContent = document.getElementById('years-to-project').value;
        document.getElementById('review-locations').textContent = document.getElementById('multi-location').checked ? 'Yes' : 'No';
        document.getElementById('review-legacy').textContent = document.getElementById('legacy-devices').checked ? 'Yes' : 'No';
        
        // Cost configuration
        document.getElementById('review-auth').textContent = document.getElementById('complex-auth').checked ? 'Yes' : 'No';
        document.getElementById('review-cloud').textContent = document.getElementById('cloud-integration').checked ? 'Yes' : 'No';
        document.getElementById('review-policies').textContent = document.getElementById('custom-policies').checked ? 'Yes' : 'No';
        document.getElementById('review-portnox-cost').textContent = '$' + parseFloat(document.getElementById('portnox-cost-per-device').value).toFixed(2);
        document.getElementById('review-discount').textContent = document.getElementById('portnox-discount').value + '%';
    }
    
    // Process wizard completion
    function processWizardCompletion() {
        // Collect data from wizard
        const wizardData = {
            vendor: document.querySelector('#step-1-content .vendor-card.active')?.dataset.vendor,
            industry: document.getElementById('industry-select').value,
            deviceCount: parseInt(document.getElementById('device-count').value),
            yearsToProject: parseInt(document.getElementById('years-to-project').value),
            multiLocation: document.getElementById('multi-location').checked,
            locationCount: document.getElementById('multi-location').checked ? parseInt(document.getElementById('location-count').value) : 1,
            legacyDevices: document.getElementById('legacy-devices').checked,
            legacyPercentage: document.getElementById('legacy-devices').checked ? parseInt(document.getElementById('legacy-percentage').value) : 0,
            complexAuth: document.getElementById('complex-auth').checked,
            cloudIntegration: document.getElementById('cloud-integration').checked,
            customPolicies: document.getElementById('custom-policies').checked,
            policyComplexity: document.getElementById('custom-policies').checked ? document.getElementById('policy-complexity').value : 'medium',
            portnoxCostPerDevice: parseFloat(document.getElementById('portnox-cost-per-device').value),
            portnoxDiscount: parseInt(document.getElementById('portnox-discount').value)
        };
        
        // Pass data to calculator
        if (typeof window.Calculator !== 'undefined') {
            // Update calculator state
            if (typeof window.Calculator.updateState === 'function') {
                window.Calculator.updateState(wizardData);
            }
            
            // Calculate TCO
            if (typeof window.Calculator.calculateTCO === 'function') {
                window.Calculator.calculateTCO();
            }
        } else if (typeof window.EnhancedCalculator !== 'undefined') {
            // Use EnhancedCalculator if available
            if (typeof window.EnhancedCalculator.updateState === 'function') {
                window.EnhancedCalculator.updateState(wizardData);
            }
            
            if (typeof window.EnhancedCalculator.calculateTCO === 'function') {
                window.EnhancedCalculator.calculateTCO();
            }
        }
        
        // Close wizard
        closeWizard();
        
        // Show results container
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Activate comparison tab if available
            const comparisonTab = document.getElementById('tab-comparison');
            if (comparisonTab) {
                comparisonTab.click();
            }
        }
    }
    
    // Open wizard
    function openWizard() {
        wizardOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
        
        // Reset to first step
        currentStep = 1;
        updateWizardUI();
    }
    
    // Close wizard
    function closeWizard() {
        wizardOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Public API
    return {
        init,
        openWizard,
        closeWizard
    };
})();

// Initialize wizard when document is ready
document.addEventListener('DOMContentLoaded', function() {
    TCOWizard.init();
    
    // Add button to open wizard
    const wizardButton = document.createElement('button');
    wizardButton.id = 'open-wizard-btn';
    wizardButton.className = 'btn btn-primary btn-wizard';
    wizardButton.innerHTML = '<i class="fas fa-magic"></i> TCO Wizard';
    
    // Add button to header actions or create a floating button
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        headerActions.prepend(wizardButton);
    } else {
        wizardButton.classList.add('floating-wizard-btn');
        document.body.appendChild(wizardButton);
    }
    
    // Add click event to open wizard
    wizardButton.addEventListener('click', TCOWizard.openWizard);
});
