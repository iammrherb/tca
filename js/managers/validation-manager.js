/**
 * Enhanced error handling and validation framework with runtime validation creation
 */
class ValidationManager {
  constructor() {
    this.errorMessages = {
      required: '{label} is required',
      minValue: '{label} must be at least {min}',
      maxValue: '{label} must be at most {max}',
      integer: '{label} must be a whole number',
      positive: '{label} must be positive',
      regex: '{label} is not in the correct format',
      email: '{label} must be a valid email address',
      url: '{label} must be a valid URL',
      date: '{label} must be a valid date'
    };
    
    this.validationRules = {
      'device-count': { 
        required: true, 
        minValue: 1,
        maxValue: 1000000,
        integer: true,
        label: 'Device Count' 
      },
      'years-to-project': { 
        required: true, 
        minValue: 1, 
        maxValue: 10, 
        integer: true,
        label: 'Years to Project' 
      },
      'location-count': { 
        required: true, 
        minValue: 1, 
        integer: true,
        label: 'Location Count' 
      },
      'legacy-percentage': { 
        required: true, 
        minValue: 0, 
        maxValue: 100,
        label: 'Legacy Percentage' 
      }
    };
    
    this.fieldDependencies = {};
    this.validationEvents = {};
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Add validation to all form inputs
    document.querySelectorAll('input, select').forEach(input => {
      const id = input.id;
      if (id && this.validationRules[id]) {
        input.addEventListener('change', () => {
          this.validateInput(id);
          this.checkDependencies(id);
        });
        
        input.addEventListener('blur', () => {
          this.validateInput(id);
        });
      }
    });
    
    // Whenever form data is changed, update dependent field validation
    document.addEventListener('input', (e) => {
      const id = e.target.id;
      if (id) {
        this.checkDependencies(id);
      }
    });
  }
  
  // Add validation rule for a field at runtime
  addValidationRule(id, rules) {
    this.validationRules[id] = { ...rules };
    
    // Add listeners if the element exists
    const input = document.getElementById(id);
    if (input) {
      // Remove existing listeners
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      
      // Add new listeners
      newInput.addEventListener('change', () => {
        this.validateInput(id);
        this.checkDependencies(id);
      });
      
      newInput.addEventListener('blur', () => {
        this.validateInput(id);
      });
    }
  }
  
  // Add dependency between fields
  addDependency(sourceId, targetId, condition) {
    if (!this.fieldDependencies[sourceId]) {
      this.fieldDependencies[sourceId] = [];
    }
    
    this.fieldDependencies[sourceId].push({
      targetId,
      condition
    });
  }
  
  // Check dependencies for a field
  checkDependencies(id) {
    if (!this.fieldDependencies[id]) return;
    
    const sourceInput = document.getElementById(id);
    if (!sourceInput) return;
    
    const sourceValue = sourceInput.type === 'checkbox' 
      ? sourceInput.checked 
      : sourceInput.value;
    
    this.fieldDependencies[id].forEach(dependency => {
      const targetInput = document.getElementById(dependency.targetId);
      if (!targetInput) return;
      
      const conditionMet = dependency.condition(sourceValue, targetInput.value);
      
      // Get parent container
      const container = targetInput.closest('.input-group') || targetInput.parentNode;
      
      if (conditionMet) {
        container.classList.remove('disabled');
        targetInput.disabled = false;
      } else {
        container.classList.add('disabled');
        targetInput.disabled = true;
        this.clearError(dependency.targetId);
      }
    });
  }
  
  validateInput(id) {
    const input = document.getElementById(id);
    if (!input || !this.validationRules[id]) return true;
    
    const rules = this.validationRules[id];
    const value = input.type === 'checkbox' ? input.checked : input.value;
    
    // Skip validation for disabled fields
    if (input.disabled) {
      this.clearError(id);
      return true;
    }
    
    // Remove existing error message
    this.clearError(id);
    
    // Add validation error class for styling
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
      inputGroup.classList.remove('has-error');
    }
    
    // Validate according to rules
    if (rules.required && (value === '' || value === null || value === undefined)) {
      this.showError(id, this.formatErrorMessage('required', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    // Skip other validations if empty and not required
    if (value === '' || value === null || value === undefined) {
      return true;
    }
    
    if (rules.minValue !== undefined && parseFloat(value) < rules.minValue) {
      this.showError(id, this.formatErrorMessage('minValue', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.maxValue !== undefined && parseFloat(value) > rules.maxValue) {
      this.showError(id, this.formatErrorMessage('maxValue', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.integer && !Number.isInteger(parseFloat(value))) {
      this.showError(id, this.formatErrorMessage('integer', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.positive && parseFloat(value) <= 0) {
      this.showError(id, this.formatErrorMessage('positive', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.regex && !new RegExp(rules.regex).test(value)) {
      this.showError(id, this.formatErrorMessage('regex', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.showError(id, this.formatErrorMessage('email', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.url && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(value)) {
      this.showError(id, this.formatErrorMessage('url', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    if (rules.date && isNaN(Date.parse(value))) {
      this.showError(id, this.formatErrorMessage('date', rules));
      if (inputGroup) {
        inputGroup.classList.add('has-error');
      }
      return false;
    }
    
    // Custom validation if provided
    if (rules.validate && typeof rules.validate === 'function') {
      const result = rules.validate(value);
      if (result !== true) {
        this.showError(id, result || this.formatErrorMessage(rules.validateMessage || 'This field is invalid', rules));
        if (inputGroup) {
          inputGroup.classList.add('has-error');
        }
        return false;
      }
    }
    
    // If we get here, validation passed
    if (typeof this.validationEvents.onValidationSuccess === 'function') {
      this.validationEvents.onValidationSuccess(id, input);
    }
    
    return true;
  }
  
  validateAll() {
    let isValid = true;
    
    for (const id in this.validationRules) {
      if (!this.validateInput(id)) {
        isValid = false;
        
        // Focus the first invalid field
        if (isValid === false) {
          setTimeout(() => {
            document.getElementById(id)?.focus();
          }, 100);
        }
      }
    }
    
    return isValid;
  }
  
  // Set validation event handlers
  on(eventName, callback) {
    this.validationEvents[eventName] = callback;
  }
  
  formatErrorMessage(rule, ruleConfig) {
    let message = this.errorMessages[rule] || rule;
    
    // Replace placeholders
    message = message.replace('{label}', ruleConfig.label || 'Field');
    
    // Replace other placeholders if they exist in the rule config
    for (const key in ruleConfig) {
      message = message.replace(`{${key}}`, ruleConfig[key]);
    }
    
    return message;
  }
  
  showError(id, message) {
    const input = document.getElementById(id);
    if (!input) return;
    
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `error-${id}`;
    errorDiv.textContent = message;
    
    // Set aria-describedby to link input with error message
    input.setAttribute('aria-describedby', `error-${id}`);
    
    // Find the parent input-group if it exists, otherwise use input's parent
    const container = input.closest('.input-group') || input.parentNode;
    
    // Add error message after input or at end of container
    container.appendChild(errorDiv);
    
    // Trigger event
    if (typeof this.validationEvents.onValidationError === 'function') {
      this.validationEvents.onValidationError(id, message, input);
    }
  }
  
  clearError(id) {
    const input = document.getElementById(id);
    if (!input) return;
    
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    
    // Remove error message if exists
    const errorDiv = document.getElementById(`error-${id}`);
    if (errorDiv) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
    
    // Remove error class from input group
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
      inputGroup.classList.remove('has-error');
    }
  }
  
  clearAllErrors() {
    for (const id in this.validationRules) {
      this.clearError(id);
    }
  }
}
