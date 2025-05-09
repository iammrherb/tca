/**
 * Integrated Sensitivity Analysis
 * Provides sensitivity analysis functionality directly in the main UI
 */
const IntegratedSensitivityAnalyzer = (function() {
    // Store chart references
    let sensitivityChart = null;
    let savingsImpactChart = null;
    
    // Default parameter values
    const defaults = {
        parameter: 'deviceCount',
        vendor: 'all',
        min: 500,
        max: 5000,
        steps: 10
    };
    
    // Parameter definitions
    const parameters = {
        deviceCount: {
            name: 'Device Count',
            description: 'Analyze how changes in the total number of devices affect TCO and relative savings.',
            unit: '',
            defaultMin: 500,
            defaultMax: 5000
        },
        legacyPercentage: {
            name: 'Legacy Device Percentage',
            description: 'Evaluate the impact of varying percentages of legacy devices that require special handling.',
            unit: '%',
            defaultMin: 0,
            defaultMax: 100
        },
        locationCount: {
            name: 'Number of Locations',
            description: 'Assess how distributed deployment across multiple locations affects total costs.',
            unit: '',
            defaultMin: 1,
            defaultMax: 50
        },
        yearsToProject: {
            name: 'Years to Project',
            description: 'Compare TCO over different timeframes to understand long-term cost implications.',
            unit: 'years',
            defaultMin: 1,
            defaultMax: 7
        },
        hardwareCost: {
            name: 'Hardware Cost Multiplier',
            description: 'Test how variations in hardware pricing affect total cost of ownership.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        licensingCost: {
            name: 'Licensing Cost Multiplier',
            description: 'Analyze the sensitivity of TCO to changes in software licensing costs.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        maintenanceCost: {
            name: 'Maintenance Cost Multiplier',
            description: 'Evaluate how varying maintenance costs impact long-term TCO.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        implementationCost: {
            name: 'Implementation Cost Multiplier',
            description: 'Determine the sensitivity of initial deployment costs on overall TCO.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        fteCost: {
            name: 'Personnel Cost Multiplier',
            description: 'Assess how variations in IT staffing expenses affect solution costs.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        downtimeCost: {
            name: 'Downtime Cost',
            description: 'Analyze how the cost of downtime events affects the overall value proposition.',
            unit: '$/hour',
            defaultMin: 1000,
            defaultMax: 50000
        }
    };
    
    // Chart colors for vendors
    const vendorColors = {
        cisco: '#1B67B2',
        aruba: '#F6921E',
        forescout: '#FFC20E',
        fortinac: '#EE3124',
        nps: '#00A4EF',
        securew2: '#662D91',
        portnox: '#65BD44',
        noNac: '#A9A9A9'
    };
    
    // Initialize the sensitivity analysis UI
    function init() {
        console.log("Initializing Enhanced Sensitivity Analyzer...");
        
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        const stepsInput = document.getElementById('sensitivity-steps');
        const runButton = document.getElementById('run-sensitivity');
        
        if (!paramSelector || !minInput || !maxInput || !stepsInput || !runButton) {
            console.warn("Could not find all sensitivity controls");
            return;
        }
        
        // Populate parameter selector
        for (const [key, param] of Object.entries(parameters)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = param.name;
            paramSelector.appendChild(option);
        }
        
        // Add event listeners
        paramSelector.addEventListener('change', updateParameterInfo);
        runButton.addEventListener('click', runSensitivityAnalysis);
        
        // Set initial values
        updateParameterInfo();
        
        console.log("Enhanced Sensitivity Analyzer initialized");
    }
    
    // Update parameter information when selection changes
    function updateParameterInfo() {
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        
        if (!paramSelector || !minInput || !maxInput) return;
        
        const selectedParam = paramSelector.value;
        const paramInfo = parameters[selectedParam];
        
        if (paramInfo) {
            // Update min/max default values
            minInput.value = paramInfo.defaultMin;
            maxInput.value = paramInfo.defaultMax;
            
            // Update description if element exists
            const descElement = document.querySelector('.param-description');
            if (descElement) {
                descElement.textContent = paramInfo.description;
            }
        }
    }
    
    // Run sensitivity analysis
    function runSensitivityAnalysis() {
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        const stepsInput = document.getElementById('sensitivity-steps');
        
        if (!paramSelector || !minInput || !maxInput || !stepsInput) return;
        
        // Get parameter values
        const parameter = paramSelector.value;
        const min = parseFloat(minInput.value);
        const max = parseFloat(maxInput.value);
        const steps = parseInt(stepsInput.value);
        
        // Validate inputs
        if (isNaN(min) || isNaN(max) || isNaN(steps) || min >= max || steps < 2) {
            alert("Please enter valid parameter values. Min must be less than Max and Steps must be at least 2.");
            return;
        }
        
        // Calculate step size
        const stepSize = (max - min) / (steps - 1);
        
        // Generate parameter values
        const parameterValues = [];
        for (let i = 0; i < steps; i++) {
            parameterValues.push(min + i * stepSize);
        }
        
        // Mock results (in a real app, this would calculate actual values)
        const mockResults = generateMockResults(parameter, parameterValues);
        
        // Update charts with results
        updateSensitivityCharts(mockResults);
        
        // Show breakeven analysis if it exists
        const breakevenContainer = document.getElementById('breakeven-container');
        if (breakevenContainer) {
            breakevenContainer.classList.remove('hidden');
            updateBreakevenAnalysis(mockResults);
        }
    }
    
    // Generate mock results for demonstration
    function generateMockResults(parameter, parameterValues) {
        // Get vendors to include
        const vendors = [
            { id: 'cisco', name: 'Cisco ISE' },
            { id: 'aruba', name: 'Aruba ClearPass' },
            { id: 'forescout', name: 'Forescout' },
            { id: 'nps', name: 'Microsoft NPS' },
            { id: 'portnox', name: 'Portnox Cloud' }
        ];
        
        // Generate vendor results
        const vendorResults = vendors.map(vendor => {
            // Base TCO value
            let baseTco = vendor.id === 'portnox' ? 180000 : 300000;
            if (vendor.id === 'cisco') baseTco = 400000;
            if (vendor.id === 'aruba') baseTco = 350000;
            if (vendor.id === 'forescout') baseTco = 380000;
            if (vendor.id === 'nps') baseTco = 200000;
            
            // Calculate TCO values based on parameter
            const values = parameterValues.map(value => {
                let multiplier = 1.0;
                
                // Different multiplier calculations based on parameter type
                switch(parameter) {
                    case 'deviceCount':
                        // Device count has linear impact on most vendors, but Portnox has better scaling
                        multiplier = value / 1000;
                        if (vendor.id === 'portnox') {
                            multiplier = 0.2 + (0.7 * value / 1000); // Better scaling
                        }
                        break;
                    case 'yearsToProject':
                        // Years mainly affects ongoing costs
                        multiplier = 0.6 + (0.4 * value / 3);
                        break;
                    case 'locationCount':
                        // Locations affect on-premises vendors more
                        if (vendor.id === 'portnox') {
                            multiplier = 1 + (0.1 * Math.log2(value));
                        } else {
                            multiplier = 1 + (0.3 * Math.log2(value));
                        }
                        break;
                    default:
                        // Generic multiplier with random component for visualization
                        multiplier = value * (0.9 + 0.2 * Math.random());
                        break;
                }
                
                return Math.round(baseTco * multiplier);
            });
            
            return {
                name: vendor.name,
                id: vendor.id,
                values: values
            };
        });
        
        // Calculate savings percentages (compared to average on-premises)
        const savingsPercentages = parameterValues.map((_, index) => {
            const onPremValues = vendorResults
                .filter(vendor => vendor.id !== 'portnox')
                .map(vendor => vendor.values[index]);
            
            const avgOnPrem = onPremValues.reduce((a, b) => a + b, 0) / onPremValues.length;
            const portnoxValue = vendorResults.find(vendor => vendor.id === 'portnox').values[index];
            
            return Math.round(((avgOnPrem - portnoxValue) / avgOnPrem) * 100);
        });
        
        // Calculate breakeven points
        const breakeven = {
            deviceCount: parameter === 'deviceCount' ? 600 : null,
            yearCount: parameter === 'yearsToProject' ? 1.5 : null,
            costMultiplier: parameter.includes('Cost') ? 1.8 : null
        };
        
        return {
            parameter: parameter,
            parameterValues: parameterValues.map(value => Math.round(value * 100) / 100), // Round for display
            vendorResults: vendorResults,
            savingsPercentages: savingsPercentages,
            breakeven: breakeven
        };
    }
    
    // Update sensitivity charts with results
    function updateSensitivityCharts(results) {
        updateTcoSensitivityChart(results);
        updateSavingsImpactChart(results);
    }
    
    // Update the TCO sensitivity chart
    function updateTcoSensitivityChart(results) {
        const ctx = document.getElementById('sensitivity-chart');
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (sensitivityChart) {
            sensitivityChart.destroy();
        }
        
        // Create datasets
        const datasets = results.vendorResults.map(vendor => {
            return {
                label: vendor.name,
                data: vendor.values,
                borderColor: vendorColors[vendor.id] || '#888888',
                backgroundColor: 'transparent',
                borderWidth: vendor.id === 'portnox' ? 3 : 2,
                pointRadius: vendor.id === 'portnox' ? 4 : 3
            };
        });
        
        // Format parameter labels
        const paramInfo = parameters[results.parameter] || parameters.deviceCount;
        const formattedLabels = results.parameterValues.map(value => {
            return paramInfo.unit ? `${value}${paramInfo.unit}` : value.toString();
        });
        
        // Create chart
        sensitivityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Total Cost of Ownership ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: paramInfo.name
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `TCO Sensitivity to ${paramInfo.name}`
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update the savings impact chart
    function updateSavingsImpactChart(results) {
        const ctx = document.getElementById('savings-impact-chart');
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (savingsImpactChart) {
            savingsImpactChart.destroy();
        }
        
        // Format parameter labels
        const paramInfo = parameters[results.parameter] || parameters.deviceCount;
        const formattedLabels = results.parameterValues.map(value => {
            return paramInfo.unit ? `${value}${paramInfo.unit}` : value.toString();
        });
        
        // Create chart
        savingsImpactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedLabels,
                datasets: [{
                    label: 'Savings Percentage',
                    data: results.savingsPercentages,
                    borderColor: '#65BD44',
                    backgroundColor: 'rgba(101, 189, 68, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Savings vs. On-Premises (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: paramInfo.name
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Impact of ${paramInfo.name} on Cost Savings`
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Savings: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update breakeven analysis with results
    function updateBreakevenAnalysis(results) {
        const breakevenContainer = document.getElementById('breakeven-content');
        if (!breakevenContainer) return;
        
        const paramInfo = parameters[results.parameter] || {};
        
        // Clear previous content
        breakevenContainer.innerHTML = '';
        
        // Check if we have breakeven data
        const breakeven = results.breakeven;
        if (!breakeven || (!breakeven.deviceCount && !breakeven.yearCount && !breakeven.costMultiplier)) {
            breakevenContainer.innerHTML = '<p>No breakeven points identified for this parameter.</p>';
            return;
        }
        
        // Create breakeven cards
        const breakevenGrid = document.createElement('div');
        breakevenGrid.className = 'breakeven-grid';
        
        if (breakeven.deviceCount) {
            const card = createBreakevenCard(
                'Device Count Breakeven',
                breakeven.deviceCount + ' devices',
                `Portnox becomes more cost-effective than on-premises solutions at ${breakeven.deviceCount} devices.`
            );
            breakevenGrid.appendChild(card);
        }
        
        if (breakeven.yearCount) {
            const card = createBreakevenCard(
                'Time to Breakeven',
                breakeven.yearCount + ' years',
                `The investment in Portnox Cloud pays for itself in ${breakeven.yearCount} years compared to on-premises solutions.`
            );
            breakevenGrid.appendChild(card);
        }
        
        if (breakeven.costMultiplier) {
            const card = createBreakevenCard(
                'Cost Multiplier Breakeven',
                breakeven.costMultiplier + 'x',
                `Portnox remains more cost-effective than on-premises solutions until costs increase by ${breakeven.costMultiplier}x.`
            );
            breakevenGrid.appendChild(card);
        }
        
        breakevenContainer.appendChild(breakevenGrid);
    }
    
    // Create a breakeven card element
    function createBreakevenCard(title, value, description) {
        const card = document.createElement('div');
        card.className = 'breakeven-card';
        
        const cardTitle = document.createElement('h4');
        cardTitle.textContent = title;
        
        const cardValue = document.createElement('div');
        cardValue.className = 'breakeven-value';
        cardValue.textContent = value;
        
        const cardDesc = document.createElement('div');
        cardDesc.className = 'breakeven-description';
        cardDesc.textContent = description;
        
        card.appendChild(cardTitle);
        card.appendChild(cardValue);
        card.appendChild(cardDesc);
        
        return card;
    }
    
    // Return public API
    return {
        init
    };
})();

// Initialize sensitivity analyzer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    IntegratedSensitivityAnalyzer.init();
});
