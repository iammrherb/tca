/**
 * Enhanced UI Updates
 * Enhances the UI with multi-year projection options, No-NAC comparison, and improved visualizations
 */
(function() {
    // Configuration
    const config = {
        defaultProjectionYears: 3,
        availableProjectionYears: [1, 2, 3, 5],
        charts: {
            colors: {
                currentVendor: '#6c757d',
                portnox: '#2BD25B',
                noNac: '#dc3545',
                savings: '#1B67B2'
            }
        }
    };
    
    // DOM elements cache
    let elements = {};
    
    // Initialize UI enhancements
    function initialize() {
        cacheElements();
        setupEventListeners();
        enhanceYearsProjectionSelector();
        addNoNacBaselineOption();
        enhanceVendorComparison();
        enhanceSensitivityAnalysis();
        addIndustryCompliancePanel();
        
        console.log('Enhanced UI updates loaded.');
    }
    
    // Cache DOM elements for better performance
    function cacheElements() {
        elements = {
            yearsProjectSelect: document.getElementById('years-to-project'),
            deviceCountInput: document.getElementById('device-count'),
            organizationSizeSelect: document.getElementById('organization-size'),
            calculateButton: document.getElementById('calculate-btn'),
            vendorCards: document.querySelectorAll('.vendor-card'),
            industrySelector: document.getElementById('industry-selector'),
            tabs: document.querySelectorAll('.tab-button'),
            tabPanes: document.querySelectorAll('.tab-pane'),
            summaryTab: document.getElementById('summary-tab'),
            financialTab: document.getElementById('financial-tab'),
            implementationTab: document.getElementById('implementation-tab'),
            comparisonTab: document.getElementById('comparison-tab'),
            migrationTab: document.getElementById('migration-tab'),
            tcoComparisonChart: document.getElementById('tco-comparison-chart'),
            cumulativeCostChart: document.getElementById('cumulative-cost-chart'),
            currentBreakdownChart: document.getElementById('current-breakdown-chart'),
            alternativeBreakdownChart: document.getElementById('alternative-breakdown-chart'),
            advancedOptionsPanel: document.getElementById('advanced-options-panel'),
            advancedOptionsToggle: document.querySelector('.advanced-options-toggle')
        };
    }
    
    // Setup event listeners for enhanced functionality
    function setupEventListeners() {
        if (elements.calculateButton) {
            elements.calculateButton.addEventListener('click', handleEnhancedCalculation);
        }
        
        if (elements.yearsProjectSelect) {
            elements.yearsProjectSelect.addEventListener('change', handleYearsProjectionChange);
        }
        
        if (elements.industrySelector) {
            elements.industrySelector.addEventListener('change', handleIndustryChange);
        }
        
        // Expand advanced options by default
        if (elements.advancedOptionsToggle && elements.advancedOptionsPanel) {
            elements.advancedOptionsToggle.setAttribute('aria-expanded', 'true');
            elements.advancedOptionsPanel.classList.remove('hidden');
        }
    }
    
    // Enhance years projection selector
    function enhanceYearsProjectionSelector() {
        const select = elements.yearsProjectSelect;
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        // Add available year options
        config.availableProjectionYears.forEach(years => {
            const option = document.createElement('option');
            option.value = years;
            option.textContent = `${years} Year${years > 1 ? 's' : ''}`;
            option.selected = years === config.defaultProjectionYears;
            select.appendChild(option);
        });
    }
    
    // Add No-NAC baseline option
    function addNoNacBaselineOption() {
        // Add No-NAC baseline toggle to advanced options
        const advancedOptions = elements.advancedOptionsPanel;
        if (!advancedOptions) return;
        
        const noNacToggleDiv = document.createElement('div');
        noNacToggleDiv.className = 'input-group checkbox-group';
        noNacToggleDiv.innerHTML = `
            <input type="checkbox" id="include-no-nac" name="include-no-nac" checked>
            <label for="include-no-nac">Include "No NAC" baseline comparison</label>
        `;
        
        advancedOptions.appendChild(noNacToggleDiv);
        
        // Add event listener
        const noNacToggle = document.getElementById('include-no-nac');
        if (noNacToggle) {
            noNacToggle.addEventListener('change', function() {
                // Re-run calculation if already calculated
                if (document.querySelector('.results-grid canvas')) {
                    handleEnhancedCalculation();
                }
            });
        }
    }
    
    // Enhance vendor comparison features
    function enhanceVendorComparison() {
        // Add feature comparison toggle to comparison tab
        const comparisonTab = elements.comparisonTab;
        if (!comparisonTab) return;
        
        // Add feature comparison button
        const featureComparisonBtn = document.createElement('button');
        featureComparisonBtn.className = 'btn btn-outline';
        featureComparisonBtn.innerHTML = '<i class="fas fa-table"></i> Detailed Feature Comparison';
        featureComparisonBtn.id = 'feature-comparison-btn';
        
        // Add button after architecture diagram
        const architectureDiagramContainer = comparisonTab.querySelector('.architecture-diagram-container');
        if (architectureDiagramContainer) {
            architectureDiagramContainer.after(featureComparisonBtn);
        } else {
            comparisonTab.appendChild(featureComparisonBtn);
        }
        
        // Add event listener
        featureComparisonBtn.addEventListener('click', showFeatureComparisonModal);
    }
    
    // Enhance sensitivity analysis features
    function enhanceSensitivityAnalysis() {
        // Add No-NAC option to sensitivity analysis param-vendor dropdown
        const sensitivityBtn = document.getElementById('sensitivity-analysis-btn');
        if (!sensitivityBtn) return;
        
        // Listen for sensitivity analysis button click to modify the sensitivity.html page
        sensitivityBtn.addEventListener('click', function() {
            // We'll need to modify the dropdown in sensitivity.html
            // This will need to be handled when sensitivity.html loads
            localStorage.setItem('enhanceTcoSensitivity', 'true');
        });
    }
    
    // Add industry compliance panel
    function addIndustryCompliancePanel() {
        // Add expanded compliance panel to comparison tab
        const comparisonTab = elements.comparisonTab;
        if (!comparisonTab) return;
        
        const compliancePanel = document.createElement('div');
        compliancePanel.className = 'compliance-panel result-card hidden';
        compliancePanel.id = 'industry-compliance-panel';
        compliancePanel.innerHTML = `
            <h3>Industry Compliance Requirements</h3>
            <p>Select an industry to view compliance requirements relevant to NAC implementations.</p>
            <div id="compliance-requirements-container"></div>
        `;
        
        // Add panel at the end of comparison tab
        comparisonTab.appendChild(compliancePanel);
    }
    
    // Show feature comparison modal
    function showFeatureComparisonModal() {
        // Get current vendor
        const selectedVendorCard = document.querySelector('.vendor-card.selected');
        if (!selectedVendorCard) return;
        
        const vendorId = selectedVendorCard.getAttribute('data-vendor');
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'feature-comparison-modal';
        modalContent.innerHTML = `
            <h3>Feature Comparison: ${vendorId.charAt(0).toUpperCase() + vendorId.slice(1)} vs. Portnox</h3>
            <div class="feature-comparison-loading">Loading feature comparison data...</div>
            <div class="feature-comparison-table-container"></div>
        `;
        
        // Create modal backdrop
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.className = 'modal feature-comparison-modal-container';
        modalElement.appendChild(modalContent);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close-btn';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalBackdrop);
            document.body.removeChild(modalElement);
        });
        
        modalContent.prepend(closeButton);
        
        // Add to body
        document.body.appendChild(modalBackdrop);
        document.body.appendChild(modalElement);
        
        // Load feature comparison data
        loadFeatureComparisonData(vendorId, modalContent.querySelector('.feature-comparison-table-container'));
    }
    
    // Load feature comparison data
    function loadFeatureComparisonData(vendorId, container) {
        // Make sure VendorComparison is available
        if (typeof VendorComparison === 'undefined') {
            container.innerHTML = '<p class="error">Error: Vendor comparison data not available.</p>';
            return;
        }
        
        try {
            // Get feature comparison between selected vendor and Portnox
            const comparison = VendorComparison.getFeatureComparison([vendorId, 'portnox']);
            
            // Create HTML table
            let tableHtml = `
                <table class="data-table feature-comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>${vendorId.charAt(0).toUpperCase() + vendorId.slice(1)}</th>
                            <th>Portnox</th>
                            <th>Advantage</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            // Add rows for each feature
            Object.keys(comparison).forEach(featureId => {
                const feature = comparison[featureId];
                const vendorFeature = feature.vendors[vendorId];
                const portnoxFeature = feature.vendors.portnox;
                
                const vendorRating = vendorFeature ? vendorFeature.rating : 0;
                const portnoxRating = portnoxFeature ? portnoxFeature.rating : 0;
                const difference = portnoxRating - vendorRating;
                
                let advantageText = '';
                let advantageClass = '';
                
                if (difference > 0) {
                    advantageText = 'Portnox';
                    advantageClass = 'advantage-portnox';
                } else if (difference < 0) {
                    advantageText = vendorId.charAt(0).toUpperCase() + vendorId.slice(1);
                    advantageClass = 'advantage-competitor';
                } else {
                    advantageText = 'Equal';
                    advantageClass = 'advantage-equal';
                }
                
                tableHtml += `
                    <tr>
                        <td>
                            <strong>${feature.name}</strong>
                            <div class="feature-description">${feature.description}</div>
                        </td>
                        <td>
                            <div class="rating-container">
                                <div class="rating-value">${vendorRating}/10</div>
                                <div class="rating-bar">
                                    <div class="rating-fill" style="width: ${vendorRating * 10}%"></div>
                                </div>
                            </div>
                            <div class="feature-details">${vendorFeature ? vendorFeature.details : 'Not available'}</div>
                        </td>
                        <td>
                            <div class="rating-container">
                                <div class="rating-value">${portnoxRating}/10</div>
                                <div class="rating-bar">
                                    <div class="rating-fill portnox" style="width: ${portnoxRating * 10}%"></div>
                                </div>
                            </div>
                            <div class="feature-details">${portnoxFeature ? portnoxFeature.details : 'Not available'}</div>
                        </td>
                        <td class="${advantageClass}">${advantageText}</td>
                    </tr>
                `;
            });
            
            tableHtml += `
                    </tbody>
                </table>
            `;
            
            // Update container
            container.innerHTML = tableHtml;
            
            // Hide loading indicator
            const loadingDiv = container.parentElement.querySelector('.feature-comparison-loading');
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error loading feature comparison data:', error);
            container.innerHTML = `<p class="error">Error loading feature comparison data: ${error.message}</p>`;
        }
    }
    
    // Handle enhanced calculation
    function handleEnhancedCalculation() {
        // Make sure EnhancedTcoCalculator is available
        if (typeof EnhancedTcoCalculator === 'undefined') {
            showNotification('error', 'Enhanced TCO calculator not available. Please check console for errors.');
            return;
        }
        
        try {
            // Gather input values
            const params = gatherInputParams();
            
            // Calculate TCO with enhanced calculator
            const tcoResults = EnhancedTcoCalculator.calculateTco(params);
            
            // Update UI with results
            updateResultsUI(tcoResults);
            
        } catch (error) {
            console.error('Error calculating enhanced TCO:', error);
            showNotification('error', `Error calculating TCO: ${error.message}`);
        }
    }
    
    // Gather input parameters from form
    function gatherInputParams() {
        const deviceCount = parseInt(elements.deviceCountInput.value, 10) || 1000;
        const yearsToProject = parseInt(elements.yearsProjectSelect.value, 10) || 3;
        const organizationSize = elements.organizationSizeSelect.value || 'medium';
        
        // Get current vendor
        const selectedVendorCard = document.querySelector('.vendor-card.selected');
        const currentVendor = selectedVendorCard ? selectedVendorCard.getAttribute('data-vendor') : 'cisco';
        
        // Get industry
        const industry = elements.industrySelector.value !== 'none' ? elements.industrySelector.value : 'other';
        
        // Get additional options
        const hasMultipleLocations = document.getElementById('multiple-locations') ? 
            document.getElementById('multiple-locations').checked : false;
            
        const locationCount = hasMultipleLocations && document.getElementById('location-count') ? 
            parseInt(document.getElementById('location-count').value, 10) : 1;
            
        const legacyDevices = document.getElementById('legacy-devices') ? 
            document.getElementById('legacy-devices').checked : false;
            
        const legacyPercentage = legacyDevices && document.getElementById('legacy-percentage') ? 
            parseInt(document.getElementById('legacy-percentage').value, 10) : 0;
            
        const includeNoNac = document.getElementById('include-no-nac') ? 
            document.getElementById('include-no-nac').checked : true;
        
        return {
            deviceCount,
            yearsToProject,
            organizationSize,
            currentVendor,
            industry,
            hasMultipleLocations,
            locationCount,
            legacyPercentage,
            includeNoNac
        };
    }
    
    // Update UI with calculation results
    function updateResultsUI(results) {
        if (!results) return;
        
        // Show results container
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultsContainer.classList.add('active');
        }
        
        // Update vendor names in UI
        updateVendorNamesInUI(results.currentVendor.name);
        
        // Update summary metrics
        updateSummaryMetrics(results);
        
        // Update comparison charts
        updateComparisonCharts(results);
        
        // Update financial breakdown
        updateFinancialBreakdown(results);
        
        // Update implementation comparison
        updateImplementationComparison(results);
        
        // Update cloud vs. on-prem comparison
        updateCloudOnPremComparison(results);
        
        // Update migration planning
        updateMigrationPlanning(results);
        
        // Update industry-specific metrics
        updateIndustryMetrics(results);
        
        // Update compliance requirements
        updateComplianceRequirements(results.parameters.industry);
        
        // Show first tab
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) {
            firstTab.click();
        }
        
        // Show notification
        showNotification('success', 'TCO calculation complete.');
    }
    
    // Update vendor names in UI
    function updateVendorNamesInUI(vendorName) {
        document.querySelectorAll('.vendor-name-placeholder').forEach(element => {
            element.textContent = vendorName;
        });
        
        document.querySelectorAll('[id$="-comparison-vendor"]').forEach(element => {
            element.textContent = vendorName;
        });
    }
    
    // Update summary metrics
    function updateSummaryMetrics(results) {
        // Update savings amount
        const savingsAmountElement = document.getElementById('comparison-savings');
        if (savingsAmountElement) {
            savingsAmountElement.textContent = formatCurrency(results.savings.total);
        }
        
        // Update savings percentage in progress bar
        const savingsProgressElement = document.querySelector('#comparison-savings + .progress-container .progress');
        if (savingsProgressElement) {
            savingsProgressElement.style.width = `${Math.min(100, results.savings.percentage)}%`;
        }
        
        // Update implementation time reduction
        const implementationElement = document.getElementById('comparison-implementation');
        if (implementationElement) {
            const weeksSaved = results.implementationComparison.weeksSaved;
            implementationElement.textContent = `${weeksSaved.toFixed(1)} weeks`;
        }
        
        // Update implementation percentage in progress bar
        const implementationProgressElement = document.querySelector('#comparison-implementation + .progress-container .progress');
        if (implementationProgressElement) {
            implementationProgressElement.style.width = `${Math.min(100, results.implementationComparison.percentageFaster)}%`;
        }
        
        // Update portnox specific savings info in sidebar
        const portnoxSavingsAmount = document.getElementById('portnox-savings-amount');
        if (portnoxSavingsAmount) {
            portnoxSavingsAmount.textContent = formatCurrency(results.savings.total);
        }
        
        const portnoxSavingsPercentage = document.getElementById('portnox-savings-percentage');
        if (portnoxSavingsPercentage) {
            portnoxSavingsPercentage.textContent = `${results.savings.percentage.toFixed(1)}%`;
        }
        
        const portnoxImplementationTime = document.getElementById('portnox-implementation-time');
        if (portnoxImplementationTime) {
            portnoxImplementationTime.textContent = `${results.implementationComparison.weeksSaved.toFixed(1)} weeks`;
        }
        
        // Update benefits grid
        updateBenefitsGrid(results);
    }
    
    // Update benefits grid
    function updateBenefitsGrid(results) {
        const benefitsGrid = document.querySelector('.benefits-grid');
        if (!benefitsGrid) return;
        
        // Create benefits based on calculation results
        const benefits = [
            {
                icon: 'fa-dollar-sign',
                title: `${results.savings.percentage.toFixed(1)}% Lower TCO`,
                description: `Save ${formatCurrency(results.savings.total)} over ${results.parameters.yearsToProject} years compared to ${results.currentVendor.name}`
            },
            {
                icon: 'fa-clock',
                title: `${results.implementationComparison.percentageFaster.toFixed(1)}% Faster Deployment`,
                description: `${results.implementationComparison.weeksSaved.toFixed(1)} weeks faster implementation than ${results.currentVendor.name}`
            },
            {
                icon: 'fa-users',
                title: 'Reduced IT Staffing Needs',
                description: `${results.portnox.annual.staffing < results.currentVendor.annual.staffing ? 
                    ((1 - (results.portnox.annual.staffing / results.currentVendor.annual.staffing)) * 100).toFixed(1) + '%' : 
                    'Significant'} reduction in IT resource requirements`
            },
            {
                icon: 'fa-server',
                title: 'No Hardware Required',
                description: 'Eliminate hardware costs, maintenance, and refresh cycles'
            }
        ];
        
        // If No-NAC comparison is included, add benefit
        if (results.noNac && results.parameters.includeNoNac) {
            benefits.push({
                icon: 'fa-shield-alt',
                title: 'Reduced Risk Exposure',
                description: `${formatCurrency(results.noNac.cumulativeTotal - results.portnox.total)} lower risk costs vs. operating without NAC`
            });
        }
        
        // Add industry-specific benefit if available
        if (results.industryFactors) {
            benefits.push({
                icon: 'fa-industry',
                title: `Optimized for ${results.parameters.industry.charAt(0).toUpperCase() + results.parameters.industry.slice(1)}`,
                description: `Industry-specific features aligned with ${results.parameters.industry} requirements`
            });
        }
        
        // Create benefit elements
        benefitsGrid.innerHTML = '';
        benefits.forEach(benefit => {
            const benefitElement = document.createElement('div');
            benefitElement.className = 'benefit-card';
            benefitElement.innerHTML = `
                <div class="benefit-icon">
                    <i class="fas ${benefit.icon}"></i>
                </div>
                <div class="benefit-content">
                    <h4>${benefit.title}</h4>
                    <p>${benefit.description}</p>
                </div>
            `;
            benefitsGrid.appendChild(benefitElement);
        });
    }
    
    // Update comparison charts
    function updateComparisonCharts(results) {
        // Only update if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not available. Cannot update charts.');
            return;
        }
        
        // Update TCO comparison chart
        updateTcoComparisonChart(results);
        
        // Update cumulative cost chart
        updateCumulativeCostChart(results);
        
        // Update cost breakdown charts
        updateCostBreakdownCharts(results);
        
        // Update ROI timeline chart
        updateRoiTimelineChart(results);
    }
    
    // Update TCO comparison chart
    function updateTcoComparisonChart(results) {
        const chartCanvas = document.getElementById('tco-comparison-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const data = {
            labels: [results.currentVendor.name, 'Portnox Cloud'],
            datasets: [{
                label: `${results.parameters.yearsToProject}-Year TCO`,
                data: [results.currentVendor.total, results.portnox.total],
                backgroundColor: [config.charts.colors.currentVendor, config.charts.colors.portnox],
                borderColor: [config.charts.colors.currentVendor, config.charts.colors.portnox],
                borderWidth: 1
            }]
        };
        
        // Add No-NAC data if included
        if (results.noNac && results.parameters.includeNoNac) {
            data.labels.push('No NAC (Baseline)');
            data.datasets[0].data.push(results.noNac.cumulativeTotal);
            data.datasets[0].backgroundColor.push(config.charts.colors.noNac);
            data.datasets[0].borderColor.push(config.charts.colors.noNac);
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    // Update cumulative cost chart
    function updateCumulativeCostChart(results) {
        const chartCanvas = document.getElementById('cumulative-cost-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const years = Array.from({ length: results.parameters.yearsToProject }, (_, i) => `Year ${i + 1}`);
        
        const currentVendorData = results.yearByYearProjection.map(year => year.currentVendor.cumulative);
        const portnoxData = results.yearByYearProjection.map(year => year.portnox.cumulative);
        
        const data = {
            labels: years,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor,
                    borderColor: config.charts.colors.currentVendor,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxData,
                    backgroundColor: config.charts.colors.portnox,
                    borderColor: config.charts.colors.portnox,
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
        
        // Add No-NAC data if included
        if (results.noNac && results.parameters.includeNoNac) {
            const noNacData = results.yearByYearProjection.map(year => year.noNac.cumulative);
            
            data.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                backgroundColor: config.charts.colors.noNac,
                borderColor: config.charts.colors.noNac,
                borderWidth: 2,
                tension: 0.1
            });
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'line',
            data: data,
            options: options
        });
    }
    
    // Update cost breakdown charts
    function updateCostBreakdownCharts(results) {
        updateVendorBreakdownChart(
            'current-breakdown-chart', 
            results.currentVendor, 
            results.parameters.yearsToProject,
            results.currentVendor.name
        );
        
        updateVendorBreakdownChart(
            'alternative-breakdown-chart', 
            results.portnox, 
            results.parameters.yearsToProject,
            'Portnox Cloud'
        );
    }
    
    // Update vendor breakdown chart
    function updateVendorBreakdownChart(canvasId, vendorData, years, vendorName) {
        const chartCanvas = document.getElementById(canvasId);
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Calculate total annual costs
        const annualCosts = Object.values(vendorData.annual).reduce((a, b) => a + b, 0);
        
        // Prepare data
        const data = {
            labels: [
                'Implementation',
                'Licensing',
                'Hardware',
                'Maintenance',
                'IT Staffing',
                'Infrastructure',
                'Upgrades'
            ],
            datasets: [{
                label: `${vendorName} Costs`,
                data: [
                    vendorData.implementation,
                    vendorData.annual.licensing * years,
                    (vendorData.annual.hardware || 0) * years + (vendorData.hardwareRefresh || 0),
                    (vendorData.annual.maintenance || 0) * years,
                    vendorData.annual.staffing * years,
                    (vendorData.annual.infrastructure || 0) * years,
                    (vendorData.annual.upgrades || 0) * years
                ],
                backgroundColor: [
                    '#1B67B2',   // Implementation
                    '#2BD25B',   // Licensing
                    '#6c757d',   // Hardware
                    '#ffc107',   // Maintenance
                    '#fd7e14',   // IT Staffing
                    '#20c997',   // Infrastructure
                    '#e83e8c'    // Upgrades
                ]
            }]
        };
        
        // Filter out zero values
        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];
        
        data.datasets[0].data.forEach((value, index) => {
            if (value > 0) {
                filteredLabels.push(data.labels[index]);
                filteredData.push(value);
                filteredColors.push(data.datasets[0].backgroundColor[index]);
            }
        });
        
        // Update data with filtered values
        data.labels = filteredLabels;
        data.datasets[0].data = filteredData;
        data.datasets[0].backgroundColor = filteredColors;
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }
    
    // Update ROI timeline chart
    function updateRoiTimelineChart(results) {
        const chartCanvas = document.getElementById('roi-timeline-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Only show ROI chart if No-NAC comparison is included
        if (!results.noNac || !results.parameters.includeNoNac) {
            const container = chartCanvas.parentElement;
            container.innerHTML = '<p class="chart-placeholder">Enable "No NAC" baseline comparison to view ROI timeline.</p>';
            return;
        }
        
        // Prepare data
        const years = Array.from({ length: results.parameters.yearsToProject }, (_, i) => `Year ${i + 1}`);
        
        const currentVendorRoi = results.yearByYearProjection.map(year => year.currentVendor.roi);
        const portnoxRoi = results.yearByYearProjection.map(year => year.portnox.roi);
        
        const data = {
            labels: years,
            datasets: [
                {
                    label: `${results.currentVendor.name} ROI vs. No NAC`,
                    data: currentVendorRoi,
                    backgroundColor: config.charts.colors.currentVendor,
                    borderColor: config.charts.colors.currentVendor,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Portnox Cloud ROI vs. No NAC',
                    data: portnoxRoi,
                    backgroundColor: config.charts.colors.portnox,
                    borderColor: config.charts.colors.portnox,
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
        
        // Add breakeven markers
        const annotations = {};
        
        if (results.breakevenPoint.currentVendor.years <= results.parameters.yearsToProject) {
            annotations.currentVendorBreakeven = {
                type: 'line',
                xMin: results.breakevenPoint.currentVendor.years - 1,
                xMax: results.breakevenPoint.currentVendor.years - 1,
                borderColor: config.charts.colors.currentVendor,
                borderWidth: 2,
                label: {
                    content: `${results.currentVendor.name} Breakeven: ${results.breakevenPoint.currentVendor.description}`,
                    enabled: true,
                    position: 'top'
                }
            };
        }
        
        if (results.breakevenPoint.portnox.years <= results.parameters.yearsToProject) {
            annotations.portnoxBreakeven = {
                type: 'line',
                xMin: results.breakevenPoint.portnox.years - 1,
                xMax: results.breakevenPoint.portnox.years - 1,
                borderColor: config.charts.colors.portnox,
                borderWidth: 2,
                label: {
                    content: `Portnox Breakeven: ${results.breakevenPoint.portnox.description}`,
                    enabled: true,
                    position: 'bottom'
                }
            };
        }
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        }
                    }
                },
                annotation: {
                    annotations: annotations
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'line',
            data: data,
            options: options
        });
    }
    
    // Update financial breakdown
    function updateFinancialBreakdown(results) {
        const tcSummaryTableBody = document.getElementById('tco-summary-table-body');
        if (!tcSummaryTableBody) return;
        
        // Calculate annual costs
        const years = results.parameters.yearsToProject;
        const currentVendorAnnual = results.currentVendor.annual;
        const portnoxAnnual = results.portnox.annual;
        
        // Clear table
        tcSummaryTableBody.innerHTML = '';
        
        // Add implementation costs
        addTcoRow(tcSummaryTableBody, 'Implementation Costs', 
            results.currentVendor.implementation, 
            results.portnox.implementation, 
            results.currentVendor.implementation - results.portnox.implementation);
        
        // Add licensing costs
        addTcoRow(tcSummaryTableBody, `Licensing (${years} years)`, 
            currentVendorAnnual.licensing * years, 
            portnoxAnnual.licensing * years, 
            currentVendorAnnual.licensing * years - portnoxAnnual.licensing * years);
        
        // Add hardware costs
        if (currentVendorAnnual.hardware || portnoxAnnual.hardware) {
            addTcoRow(tcSummaryTableBody, `Hardware (${years} years)`, 
                (currentVendorAnnual.hardware || 0) * years, 
                (portnoxAnnual.hardware || 0) * years, 
                (currentVendorAnnual.hardware || 0) * years - (portnoxAnnual.hardware || 0) * years);
        }
        
        // Add maintenance costs
        if (currentVendorAnnual.maintenance || portnoxAnnual.maintenance) {
            addTcoRow(tcSummaryTableBody, `Maintenance (${years} years)`, 
                (currentVendorAnnual.maintenance || 0) * years, 
                (portnoxAnnual.maintenance || 0) * years, 
                (currentVendorAnnual.maintenance || 0) * years - (portnoxAnnual.maintenance || 0) * years);
        }
        
        // Add staffing costs
        addTcoRow(tcSummaryTableBody, `IT Staffing (${years} years)`, 
            currentVendorAnnual.staffing * years, 
            portnoxAnnual.staffing * years, 
            currentVendorAnnual.staffing * years - portnoxAnnual.staffing * years);
        
        // Add infrastructure costs
        if (currentVendorAnnual.infrastructure || portnoxAnnual.infrastructure) {
            addTcoRow(tcSummaryTableBody, `Infrastructure (${years} years)`, 
                (currentVendorAnnual.infrastructure || 0) * years, 
                (portnoxAnnual.infrastructure || 0) * years, 
                (currentVendorAnnual.infrastructure || 0) * years - (portnoxAnnual.infrastructure || 0) * years);
        }
        
        // Add upgrades costs
        if (currentVendorAnnual.upgrades || portnoxAnnual.upgrades) {
            addTcoRow(tcSummaryTableBody, `Upgrades (${years} years)`, 
                (currentVendorAnnual.upgrades || 0) * years, 
                (portnoxAnnual.upgrades || 0) * years, 
                (currentVendorAnnual.upgrades || 0) * years - (portnoxAnnual.upgrades || 0) * years);
        }
        
        // Add hardware refresh costs if applicable
        if (results.currentVendor.hardwareRefresh || results.portnox.hardwareRefresh) {
            addTcoRow(tcSummaryTableBody, 'Hardware Refresh', 
                results.currentVendor.hardwareRefresh || 0, 
                results.portnox.hardwareRefresh || 0, 
                (results.currentVendor.hardwareRefresh || 0) - (results.portnox.hardwareRefresh || 0));
        }
        
        // Add total row
        addTcoRow(tcSummaryTableBody, `Total ${years}-Year TCO`, 
            results.currentVendor.total, 
            results.portnox.total, 
            results.savings.total, 
            true);
            
        // Add ROI row if No-NAC baseline is included
        if (results.noNac && results.parameters.includeNoNac) {
            // Current vendor ROI
            const currentVendorRoi = results.yearByYearProjection[results.yearByYearProjection.length - 1].currentVendor.roi;
            
            // Portnox ROI
            const portnoxRoi = results.yearByYearProjection[results.yearByYearProjection.length - 1].portnox.roi;
            
            // Difference
            const roiDifference = portnoxRoi - currentVendorRoi;
            
            // Add ROI row
            const roiRow = document.createElement('tr');
            roiRow.innerHTML = `
                <td>Return on Investment (vs. No NAC)</td>
                <td>${currentVendorRoi.toFixed(1)}%</td>
                <td>${portnoxRoi.toFixed(1)}%</td>
                <td class="${roiDifference >= 0 ? 'positive' : 'negative'}">${roiDifference >= 0 ? '+' : ''}${roiDifference.toFixed(1)}%</td>
            `;
            tcSummaryTableBody.appendChild(roiRow);
            
            // Add breakeven row
            const breakevenRow = document.createElement('tr');
            breakevenRow.innerHTML = `
                <td>Breakeven Point (vs. No NAC)</td>
                <td>${results.breakevenPoint.currentVendor.description}</td>
                <td>${results.breakevenPoint.portnox.description}</td>
                <td class="positive">${results.breakevenPoint.comparisonAdvantage.toFixed(1)} years faster</td>
            `;
            tcSummaryTableBody.appendChild(breakevenRow);
        }
        
        // Update annual costs table
        updateAnnualCostsTable(results);
    }
    
    // Add row to TCO summary table
    function addTcoRow(tableBody, label, currentVendorValue, portnoxValue, savings, isTotal = false) {
        const row = document.createElement('tr');
        row.className = isTotal ? 'total-row' : '';
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(currentVendorValue)}</td>
            <td>${formatCurrency(portnoxValue)}</td>
            <td class="${savings >= 0 ? 'positive' : 'negative'}">${formatCurrency(savings)}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Update annual costs table
    function updateAnnualCostsTable(results) {
        const annualCostsTableBody = document.getElementById('annual-costs-table-body');
        if (!annualCostsTableBody) return;
        
        // Clear table
        annualCostsTableBody.innerHTML = '';
        
        const currentVendorAnnual = results.currentVendor.annual;
        const portnoxAnnual = results.portnox.annual;
        
        // Add licensing costs
        addAnnualCostRow(annualCostsTableBody, 'Licensing', 
            currentVendorAnnual.licensing, 
            portnoxAnnual.licensing, 
            currentVendorAnnual.licensing - portnoxAnnual.licensing);
        
        // Add hardware costs
        if (currentVendorAnnual.hardware || portnoxAnnual.hardware) {
            addAnnualCostRow(annualCostsTableBody, 'Hardware', 
                currentVendorAnnual.hardware || 0, 
                portnoxAnnual.hardware || 0, 
                (currentVendorAnnual.hardware || 0) - (portnoxAnnual.hardware || 0));
        }
        
        // Add maintenance costs
        if (currentVendorAnnual.maintenance || portnoxAnnual.maintenance) {
            addAnnualCostRow(annualCostsTableBody, 'Maintenance', 
                currentVendorAnnual.maintenance || 0, 
                portnoxAnnual.maintenance || 0, 
                (currentVendorAnnual.maintenance || 0) - (portnoxAnnual.maintenance || 0));
        }
        
        // Add staffing costs
        addAnnualCostRow(annualCostsTableBody, 'IT Staffing', 
            currentVendorAnnual.staffing, 
            portnoxAnnual.staffing, 
            currentVendorAnnual.staffing - portnoxAnnual.staffing);
        
        // Add infrastructure costs
        if (currentVendorAnnual.infrastructure || portnoxAnnual.infrastructure) {
            addAnnualCostRow(annualCostsTableBody, 'Infrastructure', 
                currentVendorAnnual.infrastructure || 0, 
                portnoxAnnual.infrastructure || 0, 
                (currentVendorAnnual.infrastructure || 0) - (portnoxAnnual.infrastructure || 0));
        }
        
        // Add upgrades costs
        if (currentVendorAnnual.upgrades || portnoxAnnual.upgrades) {
            addAnnualCostRow(annualCostsTableBody, 'Upgrades', 
                currentVendorAnnual.upgrades || 0, 
                portnoxAnnual.upgrades || 0, 
                (currentVendorAnnual.upgrades || 0) - (portnoxAnnual.upgrades || 0));
        }
        
        // Add total row
        const totalCurrentVendor = Object.values(currentVendorAnnual).reduce((a, b) => a + b, 0);
        const totalPortnox = Object.values(portnoxAnnual).reduce((a, b) => a + b, 0);
        
        addAnnualCostRow(annualCostsTableBody, 'Total Annual Operating Costs', 
            totalCurrentVendor, 
            totalPortnox, 
            totalCurrentVendor - totalPortnox, 
            true);
    }
    
    // Add row to annual costs table
    function addAnnualCostRow(tableBody, label, currentVendorValue, portnoxValue, savings, isTotal = false) {
        const row = document.createElement('tr');
        row.className = isTotal ? 'total-row' : '';
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(currentVendorValue)}</td>
            <td>${formatCurrency(portnoxValue)}</td>
            <td class="${savings >= 0 ? 'positive' : 'negative'}">${formatCurrency(savings)}</td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Update implementation comparison
    function updateImplementationComparison(results) {
        const implementationTableBody = document.getElementById('implementation-table-body');
        if (!implementationTableBody) return;
        
        // Clear table
        implementationTableBody.innerHTML = '';
        
        // Implementation phases
        const phases = [
            {
                name: 'Planning & Design',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.2,
                portnox: results.portnox.implementation.timeframe.avg * 0.15
            },
            {
                name: 'Installation & Configuration',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.3,
                portnox: results.portnox.implementation.timeframe.avg * 0.3
            },
            {
                name: 'Policy Development',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.25,
                portnox: results.portnox.implementation.timeframe.avg * 0.25
            },
            {
                name: 'Testing & Validation',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.15,
                portnox: results.portnox.implementation.timeframe.avg * 0.2
            },
            {
                name: 'Deployment & Rollout',
                currentVendor: results.currentVendor.implementation.timeframe.avg * 0.1,
                portnox: results.portnox.implementation.timeframe.avg * 0.1
            }
        ];
        
        // Add phase rows
        phases.forEach(phase => {
            const savings = phase.currentVendor - phase.portnox;
            const savingsPercentage = (savings / phase.currentVendor) * 100;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${phase.name}</td>
                <td>${phase.currentVendor.toFixed(1)} weeks</td>
                <td>${phase.portnox.toFixed(1)} weeks</td>
                <td class="${savings >= 0 ? 'positive' : 'negative'}">${savings.toFixed(1)} weeks (${savingsPercentage.toFixed(1)}%)</td>
            `;
            
            implementationTableBody.appendChild(row);
        });
        
        // Add total row
        const totalCurrentVendor = results.currentVendor.implementation.timeframe.avg;
        const totalPortnox = results.portnox.implementation.timeframe.avg;
        const totalSavings = totalCurrentVendor - totalPortnox;
        const savingsPercentage = (totalSavings / totalCurrentVendor) * 100;
        
        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td>Total Implementation Time</td>
            <td>${totalCurrentVendor.toFixed(1)} weeks</td>
            <td>${totalPortnox.toFixed(1)} weeks</td>
            <td class="positive">${totalSavings.toFixed(1)} weeks (${savingsPercentage.toFixed(1)}%)</td>
        `;
        
        implementationTableBody.appendChild(totalRow);
        
        // Update implementation comparison chart
        updateImplementationComparisonChart(results, phases);
    }
    
    // Update implementation comparison chart
    function updateImplementationComparisonChart(results, phases) {
        const chartCanvas = document.getElementById('implementation-comparison-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const phaseNames = phases.map(phase => phase.name);
        const currentVendorData = phases.map(phase => phase.currentVendor);
        const portnoxData = phases.map(phase => phase.portnox);
        
        const data = {
            labels: phaseNames,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor,
                    stack: 'Stack 0'
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxData,
                    backgroundColor: config.charts.colors.portnox,
                    stack: 'Stack 1'
                }
            ]
        };
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + ' weeks';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Weeks'
                    },
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
        
        // Update implementation complexity chart
        updateImplementationComplexityChart(results);
    }
    
    // Update implementation complexity chart
    function updateImplementationComplexityChart(results) {
        const chartCanvas = document.getElementById('implementation-complexity-chart');
        if (!chartCanvas) return;
        
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Prepare data
        const categories = [
            'Hardware Requirements',
            'Software Installation',
            'Network Integration',
            'Multiple Location Support',
            'Policy Configuration',
            'User Training'
        ];
        
        // Complexity ratings (1-10 scale where 10 is most complex)
        const currentVendorRatings = {
            'cisco': [9, 8, 9, 8, 9, 7],
            'aruba': [8, 7, 8, 7, 8, 6],
            'forescout': [8, 7, 8, 7, 7, 6],
            'fortinac': [7, 6, 7, 6, 7, 6],
            'nps': [4, 6, 5, 4, 5, 5],
            'securew2': [3, 4, 5, 3, 4, 3]
        };
        
        // Portnox complexity ratings
        const portnoxRatings = [2, 3, 3, 2, 5, 3];
        
        // Get current vendor ratings
        const vendorId = results.currentVendor.id;
        const currentVendorData = currentVendorRatings[vendorId] || currentVendorRatings.cisco;
        
        const data = {
            labels: categories,
            datasets: [
                {
                    label: results.currentVendor.name,
                    data: currentVendorData,
                    backgroundColor: config.charts.colors.currentVendor
                },
                {
                    label: 'Portnox Cloud',
                    data: portnoxRatings,
                    backgroundColor: config.charts.colors.portnox
                }
            ]
        };
        
        // Chart configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Complexity (1-10 scale)'
                    },
                    beginAtZero: true,
                    max: 10
                }
            }
        };
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    // Update cloud vs. on-prem comparison
    function updateCloudOnPremComparison(results) {
        const comparisonTableBody = document.getElementById('cloud-comparison-table-body');
        if (!comparisonTableBody) return;
        
        // Clear table
        comparisonTableBody.innerHTML = '';
        
        // Comparison features
        const features = [
            {
                name: 'Deployment Model',
                onPrem: 'Hardware appliances or virtual machines',
                cloud: 'SaaS with cloud connectors, no hardware required'
            },
            {
                name: 'Implementation Time',
                onPrem: `${results.currentVendor.implementation.timeframe.avg} weeks average`,
                cloud: `${results.portnox.implementation.timeframe.avg} weeks average`
            },
            {
                name: 'IT Resource Requirements',
                onPrem: 'Dedicated IT staff for deployment and maintenance',
                cloud: 'Minimal IT oversight required'
            },
            {
                name: 'Hardware Costs',
                onPrem: 'Significant upfront hardware investment',
                cloud: 'No hardware costs'
            },
            {
                name: 'Maintenance',
                onPrem: 'Manual updates and maintenance windows',
                cloud: 'Automatic updates managed by provider'
            },
            {
                name: 'Scaling',
                onPrem: 'Hardware expansion required for growth',
                cloud: 'Seamless scaling with subscription changes'
            },
            {
                name: 'Multi-Location Support',
                onPrem: 'Hardware required at each location',
                cloud: 'Single cloud instance manages all locations'
            },
            {
                name: 'Disaster Recovery',
                onPrem: 'Complex DR planning and infrastructure',
                cloud: 'Built-in redundancy and DR capabilities'
            },
            {
                name: 'Total Cost of Ownership',
                onPrem: `${formatCurrency(results.currentVendor.total)} (${results.parameters.yearsToProject} years)`,
                cloud: `${formatCurrency(results.portnox.total)} (${results.parameters.yearsToProject} years)`
            }
        ];
        
        // Add feature rows
        features.forEach(feature => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${feature.name}</td>
                <td>${feature.onPrem}</td>
                <td>${feature.cloud}</td>
            `;
            
            comparisonTableBody.appendChild(row);
        });
        
        // Update architecture diagrams
        updateArchitectureDiagrams();
    }
    
    // Update architecture diagrams
    function updateArchitectureDiagrams() {
        const onPremDiagram = document.querySelector('.on-prem-diagram');
        const cloudDiagram = document.querySelector('.cloud-diagram');
        
        if (!onPremDiagram || !cloudDiagram) return;
        
        // On-premises diagram
        onPremDiagram.innerHTML = `
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Corporate HQ -->
            <rect x="50" y="50" width="180" height="200" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="140" y="30" text-anchor="middle" font-size="14" font-weight="bold">Corporate HQ</text>
            
            <!-- NAC Server -->
            <rect x="80" y="80" width="120" height="40" rx="5" fill="#6c757d" stroke="#333" stroke-width="1"/>
            <text x="140" y="105" text-anchor="middle" font-size="12" fill="white">NAC Servers</text>
            
            <!-- Network -->
            <rect x="80" y="140" width="120" height="40" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="140" y="165" text-anchor="middle" font-size="12" fill="white">Core Network</text>
            
            <!-- Endpoints -->
            <rect x="80" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="105" y="220" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="150" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="175" y="220" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Branch Office -->
            <rect x="270" y="50" width="180" height="200" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="360" y="30" text-anchor="middle" font-size="14" font-weight="bold">Branch Office</text>
            
            <!-- NAC Server -->
            <rect x="300" y="80" width="120" height="40" rx="5" fill="#6c757d" stroke="#333" stroke-width="1"/>
            <text x="360" y="105" text-anchor="middle" font-size="12" fill="white">NAC Servers</text>
            
            <!-- Network -->
            <rect x="300" y="140" width="120" height="40" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="360" y="165" text-anchor="middle" font-size="12" fill="white">Branch Network</text>
            
            <!-- Endpoints -->
            <rect x="300" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="325" y="220" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="370" y="200" width="50" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="395" y="220" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Connection between sites -->
            <line x1="230" y1="160" x2="270" y2="160" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="250" y="150" text-anchor="middle" font-size="10">WAN</text>
        </svg>
        `;
        
        // Cloud diagram
        cloudDiagram.innerHTML = `
        <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Cloud -->
            <ellipse cx="250" cy="80" rx="130" ry="50" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="250" y="85" text-anchor="middle" font-size="14" font-weight="bold">Portnox Cloud</text>
            
            <!-- Corporate HQ -->
            <rect x="50" y="150" width="180" height="130" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="140" y="140" text-anchor="middle" font-size="14" font-weight="bold">Corporate HQ</text>
            
            <!-- Cloud Connector -->
            <rect x="80" y="170" width="120" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="140" y="190" text-anchor="middle" font-size="12" fill="white">Cloud Connector</text>
            
            <!-- Network -->
            <rect x="80" y="210" width="120" height="30" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="140" y="230" text-anchor="middle" font-size="12" fill="white">Corporate Network</text>
            
            <!-- Endpoints -->
            <rect x="80" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="105" y="265" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="150" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="175" y="265" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Branch Office -->
            <rect x="270" y="150" width="180" height="130" rx="5" fill="#f5f5f5" stroke="#6c757d" stroke-width="2"/>
            <text x="360" y="140" text-anchor="middle" font-size="14" font-weight="bold">Branch Office</text>
            
            <!-- Cloud Connector -->
            <rect x="300" y="170" width="120" height="30" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="360" y="190" text-anchor="middle" font-size="12" fill="white">Cloud Connector</text>
            
            <!-- Network -->
            <rect x="300" y="210" width="120" height="30" rx="5" fill="#1B67B2" stroke="#333" stroke-width="1"/>
            <text x="360" y="230" text-anchor="middle" font-size="12" fill="white">Branch Network</text>
            
            <!-- Endpoints -->
            <rect x="300" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="325" y="265" text-anchor="middle" font-size="10" fill="white">Users</text>
            
            <rect x="370" y="250" width="50" height="20" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="395" y="265" text-anchor="middle" font-size="10" fill="white">IoT</text>
            
            <!-- Connections to cloud -->
            <line x1="140" y1="170" x2="200" y2="100" stroke="#2BD25B" stroke-width="2"/>
            <line x1="360" y1="170" x2="300" y2="100" stroke="#2BD25B" stroke-width="2"/>
            
            <!-- BYOD and Remote Users -->
            <rect x="185" y="105" width="130" height="25" rx="5" fill="#2BD25B" stroke="#333" stroke-width="1"/>
            <text x="250" y="122" text-anchor="middle" font-size="12" fill="white">BYOD & Remote Users</text>
        </svg>
        `;
    }
    
    // Update migration planning
    function updateMigrationPlanning(results) {
        const migrationTableBody = document.getElementById('migration-table-body');
        if (!migrationTableBody) return;
        
        // Clear table
        migrationTableBody.innerHTML = '';
        
        // Migration phases
        const phases = [
            {
                name: 'Phase 1: Assessment & Planning',
                description: 'Evaluate current environment, define requirements, and create migration plan',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 2: Initial Deployment',
                description: 'Deploy Portnox Cloud and configure basic policies in monitoring mode',
                duration: '1 week'
            },
            {
                name: 'Phase 3: Policy Development',
                description: 'Develop and test comprehensive policies based on your organization\'s requirements',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 4: Pilot Deployment',
                description: 'Deploy to a limited group of users/devices to validate configuration',
                duration: '1 week'
            },
            {
                name: 'Phase 5: Full Deployment',
                description: 'Roll out to all users and devices in phases based on groups or locations',
                duration: '1-2 weeks'
            },
            {
                name: 'Phase 6: Transition & Decommissioning',
                description: `Decommission ${results.currentVendor.name} after successful parallel operation`,
                duration: '1 week'
            }
        ];
        
        // Add phase rows
        phases.forEach(phase => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${phase.name}</td>
                <td>${phase.description}</td>
                <td>${phase.duration}</td>
            `;
            
            migrationTableBody.appendChild(row);
        });
        
        // Update migration phases visualization
        updateMigrationPhases(phases, results);
    }
    
    // Update migration phases
    function updateMigrationPhases(phases, results) {
        const migrationPhasesContainer = document.querySelector('.migration-phases');
        if (!migrationPhasesContainer) return;
        
        // Clear container
        migrationPhasesContainer.innerHTML = '';
        
        // Create phase cards
        phases.forEach((phase, index) => {
            const phaseCard = document.createElement('div');
            phaseCard.className = 'migration-phase-card';
            
            phaseCard.innerHTML = `
                <div class="phase-number">${index + 1}</div>
                <div class="phase-content">
                    <h4>${phase.name.split(':')[1].trim()}</h4>
                    <p>${phase.description}</p>
                    <div class="phase-duration">
                        <i class="fas fa-clock"></i> ${phase.duration}
                    </div>
                </div>
            `;
            
            migrationPhasesContainer.appendChild(phaseCard);
        });
    }
    
    // Update industry-specific metrics
    function updateIndustryMetrics(results) {
        const industryMetricsContainer = document.getElementById('industry-specific-metrics');
        if (!industryMetricsContainer) return;
        
        // Only show if industry is selected
        if (results.parameters.industry === 'other' || results.parameters.industry === 'none') {
            industryMetricsContainer.classList.add('hidden');
            return;
        }
        
        // Show container
        industryMetricsContainer.classList.remove('hidden');
        
        // Clear container
        industryMetricsContainer.innerHTML = '';
        
        // Get industry name
        const industryName = results.parameters.industry.charAt(0).toUpperCase() + results.parameters.industry.slice(1);
        
        // Create industry metrics card
        const industryCard = document.createElement('div');
        industryCard.className = 'result-card';
        industryCard.innerHTML = `
            <h3>${industryName} Industry-Specific Metrics</h3>
            <div class="industry-metrics-content">
                <div class="industry-metrics-grid">
                    <div class="metric-container">
                        <div class="metric-label">Industry Cloud Adoption Rate</div>
                        <div class="metric-value">${(results.industryFactors.cloudSavingsPercentage * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">Implementation Time Reduction</div>
                        <div class="metric-value">${(results.industryFactors.implementationTimeReduction * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">IT Staffing Reduction</div>
                        <div class="metric-value">${((1 - (results.industryFactors.fteRequirements.cloud / results.industryFactors.fteRequirements.onPremise)) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="metric-container">
                        <div class="metric-label">Breach Risk Reduction</div>
                        <div class="metric-value">${(results.industryFactors.breachRiskReduction * 100).toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="industry-requirements">
                    <h4>${industryName} NAC Requirements</h4>
                    <ul class="industry-requirements-list" id="industry-requirements-list"></ul>
                </div>
            </div>
        `;
        
        industryMetricsContainer.appendChild(industryCard);
        
        // Get industry data
        if (typeof IndustryData !== 'undefined') {
            const industryData = IndustryData.getIndustryData(results.parameters.industry);
            
            // Add requirements to list
            const requirementsList = document.getElementById('industry-requirements-list');
            if (requirementsList && industryData && industryData.metrics && industryData.metrics.keyRequirements) {
                industryData.metrics.keyRequirements.forEach(requirement => {
                    const li = document.createElement('li');
                    li.textContent = requirement;
                    requirementsList.appendChild(li);
                });
            }
        }
    }
    
    // Update compliance requirements
    function updateComplianceRequirements(industryId) {
        const compliancePanel = document.getElementById('industry-compliance-panel');
        if (!compliancePanel) return;
        
        // Only show if industry is selected
        if (industryId === 'other' || industryId === 'none') {
            compliancePanel.classList.add('hidden');
            return;
        }
        
        // Show panel
        compliancePanel.classList.remove('hidden');
        
        // Get compliance container
        const complianceContainer = document.getElementById('compliance-requirements-container');
        if (!complianceContainer) return;
        
        // Clear container
        complianceContainer.innerHTML = '';
        
        // Get compliance requirements
        if (typeof EnhancedTcoCalculator !== 'undefined') {
            const complianceRequirements = EnhancedTcoCalculator.getComplianceRequirements(industryId);
            
            // Create frameworks sections
            Object.keys(complianceRequirements).forEach(frameworkId => {
                const framework = complianceRequirements[frameworkId];
                
                const frameworkSection = document.createElement('div');
                frameworkSection.className = 'compliance-framework';
                
                frameworkSection.innerHTML = `
                    <h4>${framework.name} - ${framework.fullName}</h4>
                    <div class="compliance-requirements">
                        <table class="data-table compliance-table">
                            <thead>
                                <tr>
                                    <th>Requirement</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody class="compliance-requirements-body-${frameworkId}"></tbody>
                        </table>
                    </div>
                `;
                
                complianceContainer.appendChild(frameworkSection);
                
                // Add requirements to table
                const requirementsBody = document.querySelector(`.compliance-requirements-body-${frameworkId}`);
                if (requirementsBody) {
                    framework.requirements.forEach(requirement => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td><strong>${requirement.id}</strong></td>
                            <td>${requirement.description}</td>
                        `;
                        requirementsBody.appendChild(row);
                    });
                }
            });
        }
    }
    
    // Handle years projection change
    function handleYearsProjectionChange() {
        // Re-run calculation if already calculated
        if (document.querySelector('.results-grid canvas')) {
            handleEnhancedCalculation();
        }
    }
    
    // Handle industry change
    function handleIndustryChange() {
        // Re-run calculation if already calculated
        if (document.querySelector('.results-grid canvas')) {
            handleEnhancedCalculation();
        }
        
        // Update compliance requirements
        const industry = elements.industrySelector.value;
        if (industry !== 'none') {
            updateComplianceRequirements(industry);
        }
    }
    
    // Show notification
    function showNotification(type, message) {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add close handler
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            messageContainer.removeChild(notification);
        });
        
        // Add to container
        messageContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            if (notification.parentElement) {
                messageContainer.removeChild(notification);
            }
        }, 5000);
    }
    
    // Format currency
    function formatCurrency(amount, abbreviate = false) {
        if (abbreviate && Math.abs(amount) >= 1000000) {
            return '$' + (amount / 1000000).toFixed(1) + 'M';
        } else if (abbreviate && Math.abs(amount) >= 1000) {
            return '$' + (amount / 1000).toFixed(1) + 'K';
        } else {
            return '$' + amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
    }
    
    // Initialize on document ready
    document.addEventListener('DOMContentLoaded', initialize);
    
    // Check for sensitivity analysis enhancement
    window.addEventListener('load', function() {
        if (window.location.pathname.includes('sensitivity.html')) {
            enhanceSensitivityAnalysisPage();
        }
    });
    
    // Enhance sensitivity analysis page
    function enhanceSensitivityAnalysisPage() {
        // Check if enhancement was requested
        if (localStorage.getItem('enhanceTcoSensitivity') !== 'true') return;
        
        // Clear flag
        localStorage.removeItem('enhanceTcoSensitivity');
        
        // Get vendor dropdown
        const vendorDropdown = document.getElementById('param-vendor');
        if (!vendorDropdown) return;
        
        // Add No-NAC option
        const noNacOption = document.createElement('option');
        noNacOption.value = 'noNac';
        noNacOption.textContent = 'No NAC (Baseline)';
        vendorDropdown.appendChild(noNacOption);
        
        // Add option for breach risk
        const variableDropdown = document.getElementById('param-variable');
        if (variableDropdown) {
            const breachRiskOption = document.createElement('option');
            breachRiskOption.value = 'breachRisk';
            breachRiskOption.textContent = 'Security Breach Risk';
            variableDropdown.appendChild(breachRiskOption);
            
            const complianceRiskOption = document.createElement('option');
            complianceRiskOption.value = 'complianceRisk';
            complianceRiskOption.textContent = 'Compliance Risk Factor';
            variableDropdown.appendChild(complianceRiskOption);
        }
    }
    
})();

// Add styles for enhanced UI
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
/* Enhanced UI Styles */
.hidden {
    display: none !important;
}

.input-group checkbox-group {
    margin-bottom: 1rem;
}

.positive {
    color: #2BD25B;
    font-weight: bold;
}

.negative {
    color: #dc3545;
    font-weight: bold;
}

.total-row {
    font-weight: bold;
    border-top: 2px solid #dee2e6;
}

.notification {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    background-color: #f8f9fa;
    border-left: 4px solid #6c757d;
}

.notification.success {
    background-color: #f0fff4;
    border-left-color: #2BD25B;
}

.notification.error {
    background-color: #fff5f5;
    border-left-color: #dc3545;
}

.notification-icon {
    margin-right: 1rem;
    font-size: 1.25rem;
}

.notification.success .notification-icon {
    color: #2BD25B;
}

.notification.error .notification-icon {
    color: #dc3545;
}

.notification-message {
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
}

.feature-comparison-modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    width: 900px;
    max-height: 90vh;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1050;
    overflow: hidden;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}

.feature-comparison-modal {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 90vh;
}

.modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
}

.feature-comparison-table-container {
    margin-top: 1.5rem;
}

.feature-comparison-table {
    width: 100%;
}

.feature-comparison-table th,
.feature-comparison-table td {
    padding: 0.75rem;
}

.feature-description {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.rating-value {
    width: 45px;
    text-align: right;
    margin-right: 0.5rem;
    font-weight: bold;
}

.rating-bar {
    flex: 1;
    height: 12px;
    background-color: #e9ecef;
    border-radius: 6px;
    overflow: hidden;
}

.rating-fill {
    height: 100%;
    background-color: #6c757d;
    border-radius: 6px;
}

.rating-fill.portnox {
    background-color: #2BD25B;
}

.feature-details {
    font-size: 0.875rem;
}

.advantage-portnox {
    color: #2BD25B;
    font-weight: bold;
}

.advantage-competitor {
    color: #6c757d;
    font-weight: bold;
}

.advantage-equal {
    color: #6c757d;
    font-style: italic;
}

.feature-comparison-loading {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}

.chart-placeholder {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background-color: #f8f9fa;
    border-radius: 0.25rem;
}

.compliance-panel {
    margin-top: 2rem;
}

.compliance-framework {
    margin-bottom: 2rem;
}

.compliance-table {
    font-size: 0.875rem;
}

.migration-phases {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1.5rem 0;
}

.migration-phase-card {
    flex: 1 1 calc(33.333% - 1rem);
    min-width: 250px;
    display: flex;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 1rem;
    background-color: #f8f9fa;
}

.phase-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1B67B2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
    margin-right: 1rem;
}

.phase-content {
    flex: 1;
}

.phase-content h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
}

.phase-content p {
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.phase-duration {
    font-size: 0.875rem;
    color: #1B67B2;
    font-weight: bold;
}

.industry-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

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

@media (max-width: 768px) {
    .industry-requirements-list {
        columns: 1;
    }
    
    .migration-phase-card {
        flex: 1 1 100%;
    }
}
`;

document.head.appendChild(enhancedStyles);
