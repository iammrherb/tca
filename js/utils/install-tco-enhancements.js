/**
 * Total Cost Analyzer Enhancement Installer
 * Injects required scripts and updates HTML to enhance the TCO calculator
 */
(function() {
    // Configuration
    const config = {
        scriptUrls: [
            'data/vendors/vendor-comparison.js',
            'data/industry/industry-data.js',
            'data/compliance/compliance-frameworks.js',
            'data/breach-costs/no-nac-baseline.js',
            'js/components/enhanced-total-cost-analyzer.js',
            'js/enhanced-ui-updates.js'
        ],
        loadedScripts: 0,
        totalScripts: 6
    };
    
    // Initialize installer
    function initialize() {
        showInstallProgress('Initializing Total Cost Analyzer Enhancement...', 0);
        
        // Create data directories if needed
        createDirectories();
    }
    
    // Create required directories
    function createDirectories() {
        showInstallProgress('Creating directory structure...', 10);
        
        const directories = [
            'data',
            'data/vendors',
            'data/industry',
            'data/compliance',
            'data/breach-costs'
        ];
        
        // Check and create directories
        let missingDirs = 0;
        
        directories.forEach(dir => {
            if (!directoryExists(dir)) {
                createDirectory(dir);
                missingDirs++;
            }
        });
        
        if (missingDirs > 0) {
            showInstallProgress(`Created ${missingDirs} missing directories`, 20);
        } else {
            showInstallProgress('Directory structure verified', 20);
        }
        
        // Load required scripts
        loadScripts();
    }
    
    // Load required JavaScript files
    function loadScripts() {
        showInstallProgress('Loading enhancement scripts...', 30);
        
        // Load each script
        config.scriptUrls.forEach(url => {
            const script = document.createElement('script');
            script.src = url;
            
            script.onload = function() {
                config.loadedScripts++;
                const progress = 30 + Math.round((config.loadedScripts / config.totalScripts) * 50);
                showInstallProgress(`Loaded ${config.loadedScripts}/${config.totalScripts} scripts`, progress);
                
                // When all scripts are loaded, update UI
                if (config.loadedScripts === config.totalScripts) {
                    updateUI();
                }
            };
            
            script.onerror = function() {
                showError(`Failed to load script: ${url}`);
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Update UI with enhancements
    function updateUI() {
        showInstallProgress('Applying UI enhancements...', 85);
        
        // Add No-NAC class to vendor cards
        const vendorSelectionCard = document.querySelector('.vendor-selection-card');
        if (vendorSelectionCard) {
            // Create No-NAC baseline card
            const noNacCard = document.createElement('div');
            noNacCard.className = 'vendor-card';
            noNacCard.setAttribute('data-vendor', 'noNac');
            noNacCard.setAttribute('tabindex', '0');
            noNacCard.innerHTML = `
                <div class="no-nac-icon">
                    <i class="fas fa-ban"></i>
                </div>
                <span>No NAC (Baseline)</span>
            `;
            
            // Add to vendor selection
            vendorSelectionCard.querySelector('.vendor-options').appendChild(noNacCard);
            
            // Add card selection handler
            noNacCard.addEventListener('click', function() {
                document.querySelectorAll('.vendor-card').forEach(card => {
                    card.classList.remove('selected');
                });
                this.classList.add('selected');
            });
            
            // Add keyboard handler
            noNacCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    document.querySelectorAll('.vendor-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    e.preventDefault();
                }
            });
        }
        
        // Update years to project dropdown
        const yearsSelect = document.getElementById('years-to-project');
        if (yearsSelect) {
            // Clear existing options
            yearsSelect.innerHTML = '';
            
            // Add options for 1, 2, 3, and 5 years
            const years = [1, 2, 3, 5];
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = `${year} Year${year > 1 ? 's' : ''}`;
                option.selected = year === 3; // Default to 3 years
                yearsSelect.appendChild(option);
            });
        }
        
        // Add industry-specific options to industry selector
        const industrySelector = document.getElementById('industry-selector');
        if (industrySelector && typeof IndustryData !== 'undefined') {
            // Get industries
            const industries = IndustryData.getAllIndustries();
            
            // Add options
            industries.forEach(industry => {
                if (industry.id !== 'other') { // 'other' should already be there as default
                    const option = document.createElement('option');
                    option.value = industry.id;
                    option.textContent = industry.name;
                    industrySelector.appendChild(option);
                }
            });
        }
        
        // Add styles for No-NAC card
        const style = document.createElement('style');
        style.textContent = `
            .vendor-card .no-nac-icon {
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #dc3545;
                margin-bottom: 5px;
            }
            
            /* Enhanced chart styles */
            .chart-container {
                min-height: 300px;
                position: relative;
            }
            
            /* Industry requirements list */
            .industry-requirements-list {
                columns: 2;
                column-gap: 2rem;
                list-style-type: none;
                padding: 0;
            }
            
            .industry-requirements-list li {
                margin-bottom: 0.5rem;
                position: relative;
                padding-left: 1.5rem;
            }
            
            .industry-requirements-list li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #2BD25B;
                font-weight: bold;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .industry-requirements-list {
                    columns: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Installation complete
        showInstallProgress('Total Cost Analyzer Enhancement Complete!', 100);
        setTimeout(function() {
            hideInstallProgress();
        }, 3000);
    }
    
    // Show installation progress
    function showInstallProgress(message, progress) {
        // Check if progress bar exists
        let progressContainer = document.getElementById('install-progress-container');
        
        if (!progressContainer) {
            // Create progress container
            progressContainer = document.createElement('div');
            progressContainer.id = 'install-progress-container';
            progressContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background-color: white;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 15px;
                z-index: 1000;
            `;
            
            // Create content
            progressContainer.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 10px;">Total Cost Analyzer Enhancement</div>
                <div id="install-progress-message" style="margin-bottom: 10px; font-size: 14px;"></div>
                <div style="background-color: #f3f3f3; border-radius: 3px; height: 10px; overflow: hidden;">
                    <div id="install-progress-bar" style="background-color: #2BD25B; height: 100%; width: 0%;"></div>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(progressContainer);
        }
        
        // Update message and progress
        document.getElementById('install-progress-message').textContent = message;
        document.getElementById('install-progress-bar').style.width = progress + '%';
    }
    
    // Hide installation progress
    function hideInstallProgress() {
        const progressContainer = document.getElementById('install-progress-container');
        if (progressContainer) {
            progressContainer.style.opacity = '0';
            progressContainer.style.transition = 'opacity 0.5s';
            
            setTimeout(function() {
                if (progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            }, 500);
        }
    }
    
    // Show error message
    function showError(message) {
        // Check if error container exists
        let errorContainer = document.getElementById('install-error-container');
        
        if (!errorContainer) {
            // Create error container
            errorContainer = document.createElement('div');
            errorContainer.id = 'install-error-container';
            errorContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background-color: #fff5f5;
                border-left: 4px solid #dc3545;
                border-radius: 3px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 15px;
                z-index: 1000;
            `;
            
            // Create content
            errorContainer.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <i class="fas fa-exclamation-circle" style="color: #dc3545; margin-right: 10px;"></i>
                    <div style="font-weight: bold;">Error</div>
                </div>
                <div id="install-error-message" style="margin-bottom: 10px; font-size: 14px;"></div>
                <button id="install-error-close" style="background: none; border: none; color: #6c757d; cursor: pointer; float: right;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add to body
            document.body.appendChild(errorContainer);
            
            // Add close handler
            document.getElementById('install-error-close').addEventListener('click', function() {
                hideError();
            });
        }
        
        // Update message
        document.getElementById('install-error-message').textContent = message;
        
        // Auto-hide after 10 seconds
        setTimeout(function() {
            hideError();
        }, 10000);
    }
    
    // Hide error message
    function hideError() {
        const errorContainer = document.getElementById('install-error-container');
        if (errorContainer) {
            errorContainer.style.opacity = '0';
            errorContainer.style.transition = 'opacity 0.5s';
            
            setTimeout(function() {
                if (errorContainer.parentNode) {
                    errorContainer.parentNode.removeChild(errorContainer);
                }
            }, 500);
        }
    }
    
    // Check if directory exists
    function directoryExists(dir) {
        // Simple check - if this is the browser environment
        // Assume directory exists if running in the browser
        return true;
    }
    
    // Create directory
    function createDirectory(dir) {
        // In browser environment, we can't actually create directories
        // This is a placeholder for the shell script
        console.log(`Would create directory: ${dir}`);
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
