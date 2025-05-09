/**
 * NAC TCO Wizard Controller
 * Controls the multi-step wizard experience for the TCO calculator
 */
const WizardController = (function() {
    // Wizard state
    let currentStep = 1;
    const totalSteps = 5;
    
    // Step definitions
    const steps = [
        {
            id: 1,
            name: 'vendor-selection',
            title: 'Current NAC Solution',
            description: 'Select your current NAC vendor or "No NAC" if you don\'t have a solution in place'
        },
        {
            id: 2,
            name: 'industry-compliance',
            title: 'Industry & Compliance',
            description: 'Select your industry to see relevant compliance frameworks'
        },
        {
            id: 3,
            name: 'organization-details',
            title: 'Organization Details',
            description: 'Tell us about your environment to customize the analysis'
        },
        {
            id: 4,
            name: 'cost-configuration',
            title: 'Cost Configuration',
            description: 'Fine-tune cost parameters for more accurate comparison'
        },
        {
            id: 5,
            name: 'calculation-results',
            title: 'Results & Analysis',
            description: 'View detailed cost breakdown, ROI analysis, and recommendations'
        }
    ];
    
    // Initialize wizard
    function init() {
        renderWizardNav();
        showCurrentStep();
        bindEvents();
    }
    
    // Render the wizard navigation
    function renderWizardNav() {
        const navContainer = document.getElementById('wizard-nav');
        if (!navContainer) return;
        
        let navHtml = '<ul class="wizard-steps">';
        steps.forEach(step => {
            navHtml += `
                <li class="wizard-step ${currentStep === step.id ? 'active' : ''}" data-step="${step.id}">
                    <div class="step-number">${step.id}</div>
                    <div class="step-info">
                        <div class="step-title">${step.title}</div>
                        <div class="step-description">${step.description}</div>
                    </div>
                </li>
            `;
        });
        navHtml += '</ul>';
        
        navContainer.innerHTML = navHtml;
    }
    
    // Show the current step
    function showCurrentStep() {
        // Hide all steps
        document.querySelectorAll('.wizard-step-content').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${steps[currentStep-1].name}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update navigation
        document.querySelectorAll('.wizard-step').forEach(stepEl => {
            stepEl.classList.remove('active');
            
            const stepNumber = parseInt(stepEl.dataset.step);
            
            if (stepNumber < currentStep) {
                stepEl.classList.add('completed');
            } else if (stepNumber === currentStep) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('completed');
            }
        });
        
        // Update buttons
        updateNavigationButtons();
    }
    
    // Update the navigation buttons based on current step
    function updateNavigationButtons() {
        const prevButton = document.getElementById('prev-step');
        const nextButton = document.getElementById('next-step');
        
        if (prevButton) {
            prevButton.style.display = currentStep === 1 ? 'none' : 'block';
        }
        
        if (nextButton) {
            nextButton.innerText = currentStep === totalSteps ? 'View Results' : 'Next Step';
        }
    }
    
    // Go to the next step
    function nextStep() {
        if (currentStep < totalSteps) {
            // Validate current step before proceeding
            if (validateCurrentStep()) {
                currentStep++;
                showCurrentStep();
                saveWizardState();
            }
        } else {
            // Final step - show results
            showResults();
        }
    }
    
    // Go to the previous step
    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            showCurrentStep();
            saveWizardState();
        }
    }
    
    // Go to a specific step
    function goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            currentStep = stepNumber;
            showCurrentStep();
            saveWizardState();
        }
    }
    
    // Validate the current step
    function validateCurrentStep() {
        const stepName = steps[currentStep-1].name;
        let isValid = true;
        
        switch (stepName) {
            case 'vendor-selection':
                // Check if a vendor is selected
                isValid = document.querySelector('.vendor-card.active') !== null;
                if (!isValid) {
                    showValidationError('Please select a current NAC vendor or "No NAC" option.');
                }
                break;
                
            case 'industry-compliance':
                // Check if an industry is selected
                isValid = document.getElementById('industry-selector').value !== 'none';
                if (!isValid) {
                    showValidationError('Please select your industry to continue.');
                }
                break;
                
            case 'organization-details':
                // Check if required fields are filled
                const deviceCount = document.getElementById('device-count').value;
                isValid = deviceCount && parseInt(deviceCount) > 0;
                if (!isValid) {
                    showValidationError('Please enter a valid number of devices.');
                }
                break;
                
            case 'cost-configuration':
                // All fields are optional with defaults
                isValid = true;
                break;
        }
        
        return isValid;
    }
    
    // Show validation error
    function showValidationError(message) {
        const errorContainer = document.getElementById('wizard-error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message-box">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                    <button class="close-error">×</button>
                </div>
            `;
            
            // Scroll to error
            errorContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Add click handler to close button
            errorContainer.querySelector('.close-error').addEventListener('click', function() {
                errorContainer.innerHTML = '';
            });
        }
    }
    
    // Show the final results
    function showResults() {
        // Calculate results
        if (typeof Calculator !== 'undefined') {
            Calculator.calculateTCO();
        }
        
        // Show results container
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Save wizard state
    function saveWizardState() {
        // Save current step and selections to localStorage for persistence
        const state = {
            currentStep,
            vendorSelection: getSelectedVendor(),
            industry: getSelectedIndustry(),
            deviceCount: document.getElementById('device-count')?.value,
            yearsToProject: document.getElementById('years-to-project')?.value,
            // Add other fields as needed
        };
        
        localStorage.setItem('wizardState', JSON.stringify(state));
    }
    
    // Load wizard state
    function loadWizardState() {
        const savedState = localStorage.getItem('wizardState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                currentStep = state.currentStep || 1;
                
                // Restore vendor selection
                if (state.vendorSelection) {
                    selectVendor(state.vendorSelection);
                }
                
                // Restore industry
                if (state.industry) {
                    document.getElementById('industry-selector').value = state.industry;
                }
                
                // Restore other fields
                if (state.deviceCount) {
                    document.getElementById('device-count').value = state.deviceCount;
                }
                
                if (state.yearsToProject) {
                    document.getElementById('years-to-project').value = state.yearsToProject;
                }
                
                // Show current step
                showCurrentStep();
            } catch (e) {
                console.error('Error restoring wizard state:', e);
                // Reset to first step if there's an error
                currentStep = 1;
                showCurrentStep();
            }
        }
    }
    
    // Helper functions for getting selections
    function getSelectedVendor() {
        const activeVendorCard = document.querySelector('.vendor-card.active');
        return activeVendorCard ? activeVendorCard.dataset.vendor : null;
    }
    
    function getSelectedIndustry() {
        return document.getElementById('industry-selector')?.value;
    }
    
    // Select a vendor
    function selectVendor(vendorId) {
        document.querySelectorAll('.vendor-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.vendor === vendorId) {
                card.classList.add('active');
            }
        });
    }
    
    // Bind all event handlers
    function bindEvents() {
        // Next button
        document.getElementById('next-step')?.addEventListener('click', nextStep);
        
        // Previous button
        document.getElementById('prev-step')?.addEventListener('click', prevStep);
        
        // Step navigation
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.dataset.step);
                // Only allow clicking on completed steps or the next step
                if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
                    goToStep(stepNumber);
                }
            });
        });
        
        // Vendor selection
        document.querySelectorAll('.vendor-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.vendor-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Public API
    return {
        init,
        nextStep,
        prevStep,
        goToStep,
        getCurrentStep: () => currentStep,
        getTotalSteps: () => totalSteps
    };
})();

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    WizardController.init();
});
