/**
 * Integrated UI Setup
 * Initializes the enhanced UI components
 */
(function() {
    // Initialize all UI components when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initializing Integrated UI...');
        
        // Initialize wizard if available
        if (typeof TCOWizard !== 'undefined') {
            TCOWizard.init();
            console.log('TCO Wizard initialized');
            
            // Add wizard button if not already present
            if (!document.getElementById('open-wizard-btn')) {
                const wizardButton = document.createElement('button');
                wizardButton.id = 'open-wizard-btn';
                wizardButton.className = 'btn btn-primary';
                wizardButton.innerHTML = '<i class="fas fa-magic"></i> TCO Wizard';
                
                // Add to header or as floating button
                const headerActions = document.querySelector('.header-actions');
                if (headerActions) {
                    headerActions.prepend(wizardButton);
                } else {
                    wizardButton.classList.add('floating-wizard-btn');
                    document.body.appendChild(wizardButton);
                }
                
                // Add click event
                wizardButton.addEventListener('click', TCOWizard.openWizard);
            }
        }
        
        // Initialize sensitivity analysis
        if (typeof IntegratedSensitivity !== 'undefined') {
            IntegratedSensitivity.init();
            console.log('Integrated Sensitivity Analysis initialized');
        }
        
        // Setup vendor cards if they exist
        setupVendorCards();
        
        console.log('Integrated UI initialization complete');
    });
    
    // Set up vendor cards functionality
    function setupVendorCards() {
        const vendorCards = document.querySelectorAll('.vendor-card');
        if (vendorCards.length === 0) return;
        
        console.log('Setting up vendor cards...');
        
        // Add click handlers to vendor cards
        vendorCards.forEach(card => {
            card.addEventListener('click', function() {
                // Deactivate all cards
                vendorCards.forEach(c => c.classList.remove('active'));
                
                // Activate this card
                this.classList.add('active');
                
                // Update information display
                updateVendorInfo(this.dataset.vendor);
                
                // If calculator exists, update selected vendor
                if (window.Calculator && typeof window.Calculator.updateState === 'function') {
                    window.Calculator.updateState({
                        currentVendor: this.dataset.vendor
                    });
                } else if (window.EnhancedCalculator && typeof window.EnhancedCalculator.updateState === 'function') {
                    window.EnhancedCalculator.updateState({
                        currentVendor: this.dataset.vendor
                    });
                }
            });
        });
        
        console.log('Vendor cards setup complete');
    }
    
    // Update vendor information display
    function updateVendorInfo(vendorId) {
        const infoBox = document.getElementById('vendor-info');
        if (!infoBox) return;
        
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
})();
