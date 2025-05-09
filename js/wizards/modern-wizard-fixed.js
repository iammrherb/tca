/**
 * Modern Wizard Component (Fixed Version)
 * Enhanced wizard experience with animated transitions and themed steps
 */
(function() {
  console.log('Initializing Modern Wizard (Fixed)');
  
  // Define the ModernWizard class
  class ModernWizardFixed {
    constructor(options = {}) {
      this.options = {
        containerSelector: '.wizard-content',
        stepSelector: '.wizard-step-content',
        navContainerSelector: '#wizard-nav',
        nextButtonSelector: '#next-step',
        prevButtonSelector: '#prev-step',
        activeClass: 'active',
        completedClass: 'completed',
        hiddenClass: 'hidden',
        ...options
      };
      
      this.currentStep = 1;
      this.totalSteps = 0;
      this.steps = [];
      this.stepElements = [];
      this.navItems = [];
      this.stepData = {};
      
      // Find elements
      this.container = document.querySelector(this.options.containerSelector);
      this.navContainer = document.querySelector(this.options.navContainerSelector);
      this.nextButton = document.querySelector(this.options.nextButtonSelector);
      this.prevButton = document.querySelector(this.options.prevButtonSelector);
      
      if (!this.container) {
        console.warn('Wizard container not found');
        return;
      }
      
      // Initialize
      this.init();
    }
    
    init() {
      console.log('Initializing wizard...');
      
      // Find step elements
      this.stepElements = Array.from(this.container.querySelectorAll(this.options.stepSelector));
      this.totalSteps = this.stepElements.length;
      
      if (this.totalSteps === 0) {
        console.warn('No wizard steps found');
        return;
      }
      
      console.log(`Found ${this.totalSteps} wizard steps`);
      
      // Define step data
      for (let i = 0; i < this.totalSteps; i++) {
        this.steps.push({
          id: this.stepElements[i].id,
          title: this.getStepTitle(i + 1),
          element: this.stepElements[i],
          validated: false,
          completed: false
        });
      }
      
      // Create navigation if needed
      if (this.navContainer) {
        this.createNavigation();
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Go to the first step
      this.goToStep(1);
      
      console.log('Modern Wizard initialized successfully');
    }
    
    createNavigation() {
      // Clear existing navigation
      this.navContainer.innerHTML = '';
      
      // Create steps container
      const stepsContainer = document.createElement('div');
      stepsContainer.className = 'wizard-steps';
      
      // Create step indicators
      for (let i = 0; i < this.totalSteps; i++) {
        const step = this.steps[i];
        const stepNumber = i + 1;
        
        // Create step indicator
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'wizard-step';
        stepIndicator.dataset.step = stepNumber;
        
        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'wizard-step-icon';
        
        // Create icon based on step
        let iconHtml;
        switch (stepNumber) {
          case 1:
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
            break;
          case 2:
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
            break;
          case 3:
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
            break;
          case 4:
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8l-8 8"></path><path d="M8 8l8 8"></path></svg>';
            break;
          case 5:
            iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M19 3v4M17 5h4M5 21v-4M3 19h4M19 21v-4M17 19h4M12 7v4M8 9h8"></path></svg>';
            break;
          default:
            iconHtml = `<span>${stepNumber}</span>`;
        }
        
        iconContainer.innerHTML = iconHtml;
        stepIndicator.appendChild(iconContainer);
        
        // Create title
        const titleElement = document.createElement('div');
        titleElement.className = 'wizard-step-title';
        titleElement.textContent = step.title;
        stepIndicator.appendChild(titleElement);
        
        // Store the nav item
        this.navItems.push(stepIndicator);
        
        // Add click handler (only if step is completed or active)
        stepIndicator.addEventListener('click', () => {
          const stepState = this.getStepState(stepNumber);
          if (stepState === 'completed' || stepState === 'active') {
            this.goToStep(stepNumber);
          }
        });
        
        stepsContainer.appendChild(stepIndicator);
      }
      
      this.navContainer.appendChild(stepsContainer);
    }
    
    getStepTitle(stepNumber) {
      const titles = [
        'Vendor Selection',
        'Compliance',
        'Organization',
        'Cost Configuration',
        'Results'
      ];
      
      return titles[stepNumber - 1] || `Step ${stepNumber}`;
    }
    
    setupEventListeners() {
      // Next button
      if (this.nextButton) {
        this.nextButton.addEventListener('click', () => {
          this.next();
        });
      }
      
      // Previous button
      if (this.prevButton) {
        this.prevButton.addEventListener('click', () => {
          this.previous();
        });
      }
    }
    
    next() {
      if (this.currentStep < this.totalSteps) {
        // Validate current step
        if (this.validateStep(this.currentStep)) {
          // Mark current step as completed
          this.steps[this.currentStep - 1].completed = true;
          
          // Go to next step
          this.goToStep(this.currentStep + 1);
        }
      }
    }
    
    previous() {
      if (this.currentStep > 1) {
        this.goToStep(this.currentStep - 1);
      }
    }
    
    goToStep(stepNumber) {
      // Validate step number
      if (stepNumber < 1 || stepNumber > this.totalSteps) {
        console.warn(`Invalid step number: ${stepNumber}`);
        return;
      }
      
      // Hide all steps
      this.stepElements.forEach(element => {
        element.classList.remove(this.options.activeClass);
        element.classList.add(this.options.hiddenClass);
      });
      
      // Show the target step
      const targetStep = this.steps[stepNumber - 1];
      targetStep.element.classList.add(this.options.activeClass);
      targetStep.element.classList.remove(this.options.hiddenClass);
      
      // Update navigation
      this.updateNavigation(stepNumber);
      
      // Update buttons
      this.updateButtons(stepNumber);
      
      // Update current step
      this.currentStep = stepNumber;
      
      // Trigger step change event
      this.triggerEvent('stepChange', {
        previousStep: this.currentStep,
        currentStep: stepNumber
      });
    }
    
    updateNavigation(stepNumber) {
      if (!this.navItems.length) return;
      
      // Update step indicators
      this.navItems.forEach((item, index) => {
        const stepNum = index + 1;
        
        // Remove all state classes
        item.classList.remove(this.options.activeClass, this.options.completedClass);
        
        // Add appropriate state class
        if (stepNum === stepNumber) {
          item.classList.add(this.options.activeClass);
        } else if (stepNum < stepNumber || this.steps[index].completed) {
          item.classList.add(this.options.completedClass);
        }
      });
    }
    
    updateButtons(stepNumber) {
      // Previous button visibility
      if (this.prevButton) {
        if (stepNumber === 1) {
          this.prevButton.classList.add(this.options.hiddenClass);
        } else {
          this.prevButton.classList.remove(this.options.hiddenClass);
        }
      }
      
      // Next button visibility and text
      if (this.nextButton) {
        if (stepNumber === this.totalSteps) {
          this.nextButton.textContent = 'Finish';
        } else {
          this.nextButton.textContent = 'Next Step';
        }
      }
    }
    
    validateStep(stepNumber) {
      // Simple validation - can be extended with custom validation logic
      this.steps[stepNumber - 1].validated = true;
      return true;
    }
    
    getStepState(stepNumber) {
      const stepIndex = stepNumber - 1;
      
      if (stepNumber === this.currentStep) {
        return 'active';
      } else if (this.steps[stepIndex].completed) {
        return 'completed';
      } else {
        return 'pending';
      }
    }
    
    triggerEvent(eventName, detail) {
      const event = new CustomEvent(`wizard:${eventName}`, {
        detail: detail,
        bubbles: true
      });
      
      this.container.dispatchEvent(event);
    }
  }
  
  // Create global instance when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    window.modernWizard = new ModernWizardFixed();
  });
  
  // Export class
  window.ModernWizardFixed = ModernWizardFixed;
  
  console.log('Modern Wizard (Fixed) initialized');
})();
