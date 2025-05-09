// Features Bundle JS - Updated
console.log("NAC Designer features loaded - Updated");

// Initialize features on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize vendor cards if they exist
    const vendorCards = document.querySelectorAll('.vendor-card');
    vendorCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            vendorCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked card
            this.classList.add('active');
            
            // Show vendor info if available
            const vendorId = this.getAttribute('data-vendor');
            const vendorInfo = document.getElementById('vendor-info');
            if (vendorInfo) {
                const title = document.getElementById('vendor-info-title');
                const description = document.getElementById('vendor-info-description');
                
                if (title && description) {
                    title.textContent = this.querySelector('span').textContent;
                    
                    // Set description based on vendor
                    let desc = '';
                    switch(vendorId) {
                        case 'cisco':
                            desc = 'Comprehensive on-premises NAC solution with extensive enterprise features.';
                            break;
                        case 'aruba':
                            desc = 'ClearPass provides advanced policy management for wired and wireless networks.';
                            break;
                        case 'forescout':
                            desc = 'Visibility and control platform for network security and compliance.';
                            break;
                        case 'fortinac':
                            desc = 'Network access control solution with integration into the Fortinet security fabric.';
                            break;
                        case 'nps':
                            desc = 'Basic network policy management solution for Windows environments.';
                            break;
                        case 'securew2':
                            desc = 'Cloud-based certificate management and network security solution.';
                            break;
                        case 'noNac':
                            desc = 'No NAC solution currently implemented.';
                            break;
                        default:
                            desc = 'Select a vendor to see details.';
                    }
                    
                    description.textContent = desc;
                    vendorInfo.classList.remove('hidden');
                }
            }
        });
    });
});
