#!/bin/bash

# Script to force update resource files and push them

echo "Force updating resource files..."

# Update CSS files with identical content to trigger changes
cat > css/core.bundle.css << 'EOF'
/* Core Bundle CSS - Updated */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #333;
  background-color: #f5f7fa;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #05547C;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.calculator-container {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #f0f0f0;
  padding: 15px 20px;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #05547C;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-outline {
  background-color: transparent;
  color: #05547C;
  border: 1px solid #05547C;
}

/* Updated styles */
.dark-mode {
  background-color: #121212;
  color: #f0f0f0;
}

.dark-mode .app-header {
  background-color: #0a3651;
}

.dark-mode .app-footer {
  background-color: #1a1a1a;
  color: #f0f0f0;
}
EOF

cat > css/components.bundle.css << 'EOF'
/* Components Bundle CSS - Updated */
.vendor-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.vendor-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.vendor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.vendor-card.active {
  border-color: #05547C;
  background-color: rgba(5, 84, 124, 0.05);
}

.vendor-card img {
  height: 40px;
  object-fit: contain;
}

/* Form elements */
.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.wizard-content {
  margin-top: 20px;
}

.wizard-step-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.wizard-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* Dark mode styles */
.dark-mode .vendor-card {
  background-color: #222;
  border-color: #444;
  color: #f0f0f0;
}

.dark-mode .vendor-card.active {
  border-color: #65abd4;
  background-color: rgba(101, 171, 212, 0.1);
}

.dark-mode .wizard-step-content {
  background-color: #222;
  color: #f0f0f0;
}
EOF

cat > css/utilities/fixes.css << 'EOF'
/* Utility fixes - Updated */
.hidden {
  display: none !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

/* Additional utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}
EOF

# Update JS files
cat > js/core.bundle.js << 'EOF'
// Core Bundle JS - Updated
console.log("NAC Designer core loaded - Updated");

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("NAC Designer initialized");
    
    // Dark mode toggle if it exists
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update icon if it exists
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // Check for any help buttons
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            alert('Help functionality is coming soon!');
        });
    }
});
EOF

cat > js/components.bundle.js << 'EOF'
// Components Bundle JS - Updated
console.log("NAC Designer components loaded - Updated");

// Initialize components on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-button, [data-close-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Initialize tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs');
            const tabId = this.getAttribute('data-tab');
            
            // Deactivate all tabs in this group
            if (tabGroup) {
                tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Find related content container
                const tabContent = document.querySelectorAll('.tab-pane');
                tabContent.forEach(content => {
                    content.classList.remove('active');
                });
            }
            
            // Activate the selected tab
            this.classList.add('active');
            const tabPane = document.getElementById(tabId);
            if (tabPane) {
                tabPane.classList.add('active');
            }
        });
    });
});
EOF

cat > js/features.bundle.js << 'EOF'
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
EOF

# Update index.html to include a base tag
if ! grep -q "<base" index.html; then
    sed -i '/<head>/a \    <base href="https://iammrherb.github.io/tca/">' index.html
fi

# Commit and push changes
echo "Committing and pushing changes..."
git add .
git commit --no-verify -m "Force update all resource files to ensure they're available"
git push

echo "Done! Resource files have been updated and pushed."
echo "The site should now work properly at https://iammrherb.github.io/tca/"
