/**
 * Sensitivity Analysis UI Controller
 * Manages the sensitivity analysis interface and interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sensitivity analyzer
    const analyzer = SensitivityAnalyzer;
    
    // DOM elements
    const paramVariable = document.getElementById('param-variable');
    const paramVendor = document.getElementById('param-vendor');
    const paramMin = document.getElementById('param-min');
    const paramMax = document.getElementById('param-max');
    const paramSteps = document.getElementById('param-steps');
    const includeBreakeven = document.getElementById('include-breakeven');
    const compareToNoNac = document.getElementById('compare-to-no-nac');
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    const paramDescription = document.getElementById('parameter-description');
    const returnButton = document.getElementById('return-to-calculator');
    const helpButton = document.getElementById('sensitivity-help-btn');
    const helpModal = document.getElementById('sensitivity-help-modal');
    const helpModalClose = document.getElementById('sensitivity-help-modal-close');
    const helpModalCloseBtn = document.getElementById('sensitivity-help-modal-close-btn');
    
    // Set default values
    const defaultValues = analyzer.getDefaultValues();
    
    // Update parameter description when variable changes
    paramVariable.addEventListener('change', function() {
        paramDescription.textContent = analyzer.getParameterDescription(this.value);
        
        // Update min/max/steps based on parameter
        const defaults = defaultValues[this.value] || defaultValues.deviceCount;
        paramMin.value = defaults.min;
        paramMax.value = defaults.max;
        paramSteps.value = 10;
    });
    
    // Run sensitivity analysis
    sensitivityBtn.addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Analysis...';
        
        // Get settings
        const settings = {
            parameter: paramVariable.value,
            vendor: paramVendor.value,
            minValue: parseFloat(paramMin.value),
            maxValue: parseFloat(paramMax.value),
            steps: parseInt(paramSteps.value),
            includeBreakeven: includeBreakeven.checked,
            compareToNoNac: compareToNoNac.checked
        };
        
        // Update analyzer settings
        analyzer.updateSettings(settings);
        
        // Run analysis (with slight delay to allow UI update)
        setTimeout(function() {
            const results = analyzer.runAnalysis();
            updateUI(results);
            
            // Restore button
            sensitivityBtn.disabled = false;
            sensitivityBtn.innerHTML = '<i class="fas fa-chart-line"></i> Run Sensitivity Analysis';
        }, 100);
    });
    
    // Return to calculator
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Help modal
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', function() {
            helpModal.classList.remove('hidden');
        });
        
        if (helpModalClose) {
            helpModalClose.addEventListener('click', function() {
                helpModal.classList.add('hidden');
            });
        }
        
        if (helpModalCloseBtn) {
            helpModalCloseBtn.addEventListener('click', function() {
                helpModal.classList.add('hidden');
            });
        }
    }
    
    // Update UI with results
    function updateUI(results) {
        // Update charts using existing chart builder
        if (window.EnhancedChartBuilder) {
            updateCharts(results, window.EnhancedChartBuilder);
        } else if (window.ChartBuilder) {
            updateCharts(results, window.ChartBuilder);
        }
        
        // Update breakeven analysis
        updateBreakevenAnalysis(results.breakevenPoints);
        
        // Update results table
        updateResultsTable(results);
    }
    
    // Update charts using available chart builder
    function updateCharts(results, chartBuilder) {
        // Update sensitivity chart
        if (chartBuilder.updateSensitivityChart) {
            chartBuilder.updateSensitivityChart({
                parameterValues: results.parameterValues,
                vendorResults: results.vendorResults
            });
        } else if (chartBuilder.createOrUpdateChart) {
            // Alternative approach if your chart builder works differently
            chartBuilder.createOrUpdateChart('sensitivity-chart', {
                type: 'line',
                data: {
                    labels: results.parameterValues,
                    datasets: results.vendorResults.map((vendor, index) => ({
                        label: vendor.name,
                        data: vendor.values,
                        borderColor: getColor(index),
                        backgroundColor: 'transparent',
                        tension: 0.2,
                        borderWidth: 2
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Update savings impact chart
        if (chartBuilder.updateSavingsImpactChart) {
            chartBuilder.updateSavingsImpactChart({
                parameterValues: results.parameterValues,
                savingsPercentages: results.savingsPercentages
            });
        } else if (chartBuilder.createOrUpdateChart && results.savingsPercentages) {
            // Alternative approach
            chartBuilder.createOrUpdateChart('savings-impact-chart', {
                type: 'line',
                data: {
                    labels: results.parameterValues,
                    datasets: [{
                        label: 'Savings Percentage',
                        data: results.savingsPercentages,
                        borderColor: '#65BD44',
                        backgroundColor: 'rgba(101, 189, 68, 0.1)',
                        fill: true,
                        tension: 0.2,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Get color for chart series
    function getColor(index) {
        const colors = [
            '#05547C', // Primary
            '#65BD44', // Accent
            '#F6921E', // Orange
            '#662D91', // Purple
            '#FFC20E', // Yellow
            '#EE3124', // Red
            '#00A4EF'  // Sky Blue
        ];
        
        return colors[index % colors.length];
    }
    
    // Update breakeven analysis
    function updateBreakevenAnalysis(breakevenPoints) {
        const container = document.getElementById('breakeven-container');
        const grid = document.getElementById('breakeven-grid');
        
        if (!container || !grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Hide if no breakeven points
        if (!breakevenPoints || breakevenPoints.length === 0) {
            container.classList.add('hidden');
            return;
        }
        
        // Show container
        container.classList.remove('hidden');
        
        // Add breakeven items
        breakevenPoints.forEach(point => {
            const item = document.createElement('div');
            item.className = 'breakeven-item';
            
            item.innerHTML = `
                <div class="breakeven-vendor">${point.vendorName}</div>
                <div class="breakeven-value">${point.breakevenPoint}</div>
                <div class="breakeven-description">
                    ${point.isCrossingFromAbove ? 
                        `Portnox becomes more cost-effective than ${point.vendorName} at this value.` : 
                        `${point.vendorName} becomes more cost-effective than Portnox at this value.`}
                </div>
            `;
            
            grid.appendChild(item);
        });
    }
    
    // Update results table
    function updateResultsTable(results) {
        const tableHeader = document.getElementById('sensitivity-table-header');
        const tableBody = document.getElementById('sensitivity-table-body');
        
        if (!tableHeader || !tableBody) return;
        
        // Clear existing content
        tableHeader.innerHTML = '<th scope="col">Parameter Value</th>';
        tableBody.innerHTML = '';
        
        // Add vendor columns to header
        results.vendorResults.forEach(vendor => {
            tableHeader.innerHTML += `<th scope="col">${vendor.name}</th>`;
        });
        
        // Add savings column if relevant
        if (results.savingsPercentages && results.savingsPercentages.length > 0) {
            tableHeader.innerHTML += '<th scope="col">Savings (%)</th>';
        }
        
        // Add rows for each parameter value
        results.parameterValues.forEach((value, index) => {
            const row = document.createElement('tr');
            
            // Parameter value
            row.innerHTML = `<td>${value}</td>`;
            
            // Vendor values
            results.vendorResults.forEach(vendor => {
                row.innerHTML += `<td>$${Math.round(vendor.values[index]).toLocaleString()}</td>`;
            });
            
            // Savings percentage
            if (results.savingsPercentages && results.savingsPercentages.length > 0) {
                row.innerHTML += `<td>${Math.round(results.savingsPercentages[index])}%</td>`;
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Trigger initial description update
    paramVariable.dispatchEvent(new Event('change'));
});
