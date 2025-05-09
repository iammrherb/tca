/**
 * Enhanced Sensitivity Analysis
 * Adds No-NAC baseline comparison and additional variables to sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
    // Enhance sensitivity analyzer to support No-NAC baseline
    enhanceSensitivityAnalyzer();
    
    // Add return button handler
    const returnButton = document.getElementById('return-to-calculator');
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

function enhanceSensitivityAnalyzer() {
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
        
        // Add option for projections
        const yearsOption = document.createElement('option');
        yearsOption.value = 'yearsToProject';
        yearsOption.textContent = 'Years to Project';
        variableDropdown.appendChild(yearsOption);
        
        // Update parameter description based on selection
        variableDropdown.addEventListener('change', updateParameterDescription);
        updateParameterDescription();
    }
    
    // Update run sensitivity analysis button
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
        // Replace the default click handler
        sensitivityBtn.replaceWith(sensitivityBtn.cloneNode(true));
        
        // Get the new button
        const newSensitivityBtn = document.getElementById('sensitivity-btn');
        
        // Add enhanced click handler
        newSensitivityBtn.addEventListener('click', runEnhancedSensitivityAnalysis);
    }
}

function updateParameterDescription() {
    const variableDropdown = document.getElementById('param-variable');
    const descriptionElement = document.getElementById('parameter-description');
    
    if (!variableDropdown || !descriptionElement) return;
    
    const selectedVariable = variableDropdown.value;
    
    // Update description based on selected variable
    switch (selectedVariable) {
        case 'deviceCount':
            descriptionElement.textContent = 'Analyze how changes in the total number of devices affect TCO and relative savings.';
            break;
        case 'legacyPercentage':
            descriptionElement.textContent = 'Analyze how different percentages of legacy devices impact TCO and security risks.';
            break;
        case 'locationCount':
            descriptionElement.textContent = 'Analyze how the number of physical locations affects implementation complexity and costs.';
            break;
        case 'yearsToProject':
            descriptionElement.textContent = 'Analyze how different projection timeframes affect TCO, ROI, and breakeven points.';
            break;
        case 'hardwareCost':
            descriptionElement.textContent = 'Analyze the sensitivity of TCO to changes in hardware acquisition costs.';
            break;
        case 'licensingCost':
            descriptionElement.textContent = 'Analyze how different licensing cost scenarios affect the overall TCO.';
            break;
        case 'maintenanceCost':
            descriptionElement.textContent = 'Analyze how maintenance cost variations impact long-term TCO.';
            break;
        case 'implementationCost':
            descriptionElement.textContent = 'Analyze how implementation cost variations affect initial investments and ROI.';
            break;
        case 'fteCost':
            descriptionElement.textContent = 'Analyze how IT staffing costs impact operational expenses and TCO.';
            break;
        case 'downtimeCost':
            descriptionElement.textContent = 'Analyze how downtime costs affect the total financial impact of different NAC solutions.';
            break;
        case 'breachRisk':
            descriptionElement.textContent = 'Analyze how different security breach risk factors affect the financial justification for NAC.';
            break;
        case 'complianceRisk':
            descriptionElement.textContent = 'Analyze how compliance risk factors impact the total risk exposure and NAC ROI.';
            break;
        default:
            descriptionElement.textContent = 'Select a variable to analyze its impact on TCO and relative savings.';
    }
    
    // Update min/max values based on selected variable
    updateMinMaxDefaults(selectedVariable);
}

function updateMinMaxDefaults(selectedVariable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Set default values based on variable
    switch (selectedVariable) {
        case 'deviceCount':
            minInput.value = 500;
            maxInput.value = 5000;
            stepsInput.value = 10;
            break;
        case 'legacyPercentage':
            minInput.value = 0;
            maxInput.value = 50;
            stepsInput.value = 6;
            break;
        case 'locationCount':
            minInput.value = 1;
            maxInput.value = 20;
            stepsInput.value = 5;
            break;
        case 'yearsToProject':
            minInput.value = 1;
            maxInput.value = 5;
            stepsInput.value = 5;
            break;
        case 'hardwareCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'licensingCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'maintenanceCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'implementationCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'fteCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'downtimeCost':
            minInput.value = 1000;
            maxInput.value = 10000;
            stepsInput.value = 5;
            break;
        case 'breachRisk':
            minInput.value = 0.1;
            maxInput.value = 1.0;
            stepsInput.value = 5;
            break;
        case 'complianceRisk':
            minInput.value = 0.1;
            maxInput.value = 1.0;
            stepsInput.value = 5;
            break;
    }
}

function runEnhancedSensitivityAnalysis() {
    // Get input values
    const variable = document.getElementById('param-variable').value;
    const vendor = document.getElementById('param-vendor').value;
    const minValue = parseFloat(document.getElementById('param-min').value);
    const maxValue = parseFloat(document.getElementById('param-max').value);
    const steps = parseInt(document.getElementById('param-steps').value);
    const includeBreakeven = document.getElementById('include-breakeven').checked;
    
    // Validate inputs
    if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps) || steps < 2) {
        showMessage('error', 'Please enter valid parameter values');
        return;
    }
    
    // Show loading message
    showMessage('info', 'Running sensitivity analysis...');
    
    // Clear previous results
    clearResults();
    
    // Get step size
    const stepSize = (maxValue - minValue) / (steps - 1);
    
    // Prepare data for calculation
    const sensitivityData = {
        variable,
        vendor,
        minValue,
        maxValue,
        steps,
        includeBreakeven,
        values: [],
        results: []
    };
    
    // Generate values to analyze
    for (let i = 0; i < steps; i++) {
        sensitivityData.values.push(minValue + (stepSize * i));
    }
    
    // Run calculations
    if (typeof EnhancedTcoCalculator !== 'undefined') {
        // Use enhanced calculator
        calculateWithEnhancedCalculator(sensitivityData);
    } else {
        // Use simple calculator
        calculateWithSimpleCalculator(sensitivityData);
    }
}

function calculateWithEnhancedCalculator(sensitivityData) {
    // Base parameters
    const baseParams = {
        deviceCount: 1000,
        legacyPercentage: 10,
        locationCount: 1,
        yearsToProject: 3,
        organizationSize: 'medium',
        industry: 'other',
        currentVendor: 'cisco',
        hasMultipleLocations: false,
        includeNoNac: true
    };
    
    // For each value, calculate TCO
    sensitivityData.values.forEach(value => {
        // Clone base parameters
        const params = {...baseParams};
        
        // Update variable value
        params[sensitivityData.variable] = value;
        
        // If vendor is specified, update it
        if (sensitivityData.vendor !== 'all') {
            params.currentVendor = sensitivityData.vendor;
        }
        
        // Update multiple locations flag if locationCount is the variable
        if (sensitivityData.variable === 'locationCount') {
            params.hasMultipleLocations = value > 1;
        }
        
        // Calculate TCO
        const result = EnhancedTcoCalculator.calculateTco(params);
        
        // Add to results
        sensitivityData.results.push({
            value,
            result
        });
    });
    
    // Display results
    displayEnhancedResults(sensitivityData);
}

function calculateWithSimpleCalculator(sensitivityData) {
    // Show error message
    showMessage('error', 'Enhanced TCO calculator not available. Cannot perform sensitivity analysis.');
}

function displayEnhancedResults(sensitivityData) {
    // Clear previous results
    clearResults();
    
    // Format variable name for display
    const variableDisplayNames = {
        deviceCount: 'Device Count',
        legacyPercentage: 'Legacy Device Percentage',
        locationCount: 'Number of Locations',
        yearsToProject: 'Years Projected',
        hardwareCost: 'Hardware Cost Multiplier',
        licensingCost: 'Licensing Cost Multiplier',
        maintenanceCost: 'Maintenance Cost Multiplier',
        implementationCost: 'Implementation Cost Multiplier',
        fteCost: 'Personnel Cost Multiplier',
        downtimeCost: 'Downtime Cost ($/hour)',
        breachRisk: 'Security Breach Risk Factor',
        complianceRisk: 'Compliance Risk Factor'
    };
    
    const variableDisplayName = variableDisplayNames[sensitivityData.variable] || sensitivityData.variable;
    
    // Create chart data
    const chartData = {
        labels: sensitivityData.values.map(value => formatValue(value, sensitivityData.variable)),
        datasets: []
    };
    
    // Set vendor colors
    const vendorColors = {
        cisco: '#007bff',
        aruba: '#6f42c1',
        forescout: '#fd7e14',
        nps: '#20c997',
        fortinac: '#6c757d',
        securew2: '#17a2b8',
        portnox: '#2BD25B',
        noNac: '#dc3545'
    };
    
    // Determine what data to display based on vendor selection
    if (sensitivityData.vendor === 'all') {
        // Show all vendors comparison
        const vendorIds = ['cisco', 'aruba', 'forescout', 'fortinac', 'nps', 'securew2', 'portnox'];
        
        // Create dataset for each vendor
        vendorIds.forEach(vendorId => {
            const vendorData = sensitivityData.results.map(result => {
                if (vendorId === 'portnox') {
                    return result.result.portnox.total;
                } else if (result.result.currentVendor.id === vendorId) {
                    return result.result.currentVendor.total;
                } else {
                    // If current vendor is not this vendor, we need to estimate
                    // This is a simplification, better to have actual calculations
                    return null;
                }
            });
            
            // Only add vendors with data
            if (!vendorData.every(d => d === null)) {
                chartData.datasets.push({
                    label: getVendorName(vendorId),
                    data: vendorData,
                    borderColor: vendorColors[vendorId],
                    backgroundColor: vendorColors[vendorId] + '33', // Add transparency
                    borderWidth: 2,
                    tension: 0.1
                });
            }
        });
        
        // Add No-NAC baseline if it's a relevant variable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            const noNacData = sensitivityData.results.map(result => {
                return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
            });
            
            chartData.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                borderColor: vendorColors.noNac,
                backgroundColor: vendorColors.noNac + '33', // Add transparency
                borderWidth: 2,
                tension: 0.1
            });
        }
    } else if (sensitivityData.vendor === 'noNac') {
        // Show No-NAC baseline with risk components
        const totalCostData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
        });
        
        const breachRiskData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.breachRisk.cumulativeExpectedLoss : null;
        });
        
        const complianceRiskData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.complianceRisk.cumulativeRisk : null;
        });
        
        const operationalData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.operationalInefficiency.cumulativeInefficiency : null;
        });
        
        const staffingData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.staffingCosts.cumulativeStaffingCost : null;
        });
        
        // Add datasets
        chartData.datasets.push({
            label: 'Total Cost (No NAC)',
            data: totalCostData,
            borderColor: vendorColors.noNac,
            backgroundColor: vendorColors.noNac + '33', // Add transparency
            borderWidth: 3,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Breach Risk',
            data: breachRiskData,
            borderColor: '#e83e8c',
            backgroundColor: '#e83e8c33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Compliance Risk',
            data: complianceRiskData,
            borderColor: '#fd7e14',
            backgroundColor: '#fd7e1433', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Operational Inefficiency',
            data: operationalData,
            borderColor: '#6f42c1',
            backgroundColor: '#6f42c133', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Staffing Costs',
            data: staffingData,
            borderColor: '#20c997',
            backgroundColor: '#20c99733', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
    } else {
        // Show specific vendor vs Portnox
        const vendorData = sensitivityData.results.map(result => {
            return result.result.currentVendor.total;
        });
        
        const portnoxData = sensitivityData.results.map(result => {
            return result.result.portnox.total;
        });
        
        // Add datasets
        chartData.datasets.push({
            label: getVendorName(sensitivityData.vendor),
            data: vendorData,
            borderColor: vendorColors[sensitivityData.vendor],
            backgroundColor: vendorColors[sensitivityData.vendor] + '33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Portnox Cloud',
            data: portnoxData,
            borderColor: vendorColors.portnox,
            backgroundColor: vendorColors.portnox + '33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        // Add No-NAC baseline if it's a relevant variable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            const noNacData = sensitivityData.results.map(result => {
                return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
            });
            
            chartData.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                borderColor: vendorColors.noNac,
                backgroundColor: vendorColors.noNac + '33', // Add transparency
                borderWidth: 2,
                tension: 0.1
            });
        }
        
        // Add savings data
        const savingsData = sensitivityData.results.map(result => {
            return result.result.savings.total;
        });
        
        // Add savings percentage line on secondary axis
        if (sensitivityData.vendor !== 'portnox') {
            const savingsPercentData = sensitivityData.results.map(result => {
                return result.result.savings.percentage;
            });
            
            chartData.datasets.push({
                label: 'Savings Percentage',
                data: savingsPercentData,
                borderColor: '#1B67B2',
                backgroundColor: '#1B67B233', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'percentage'
            });
        }
    }
    
    // Create and display chart
    displaySensitivityChart(chartData, sensitivityData);
    
    // Create and display table
    displaySensitivityTable(sensitivityData);
    
    // Create and display second chart for savings impact
    if (sensitivityData.vendor !== 'noNac') {
        displaySavingsImpactChart(sensitivityData);
    }
    
    // Hide loading message
    hideMessage();
}

function displaySensitivityChart(chartData, sensitivityData) {
    const chart = document.getElementById('sensitivity-chart');
    if (!chart) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        showMessage('error', 'Chart.js not available. Cannot display results.');
        return;
    }
    
    // Destroy existing chart if it exists
    if (chart.chart) {
        chart.chart.destroy();
    }
    
    // Format y-axis title based on variable
    let yAxisTitle = 'Total Cost ($)';
    if (sensitivityData.variable === 'breachRisk' || sensitivityData.variable === 'complianceRisk') {
        yAxisTitle = 'Risk Cost ($)';
    }
    
    // Format x-axis title based on variable
    const xAxisTitle = formatVariableName(sensitivityData.variable);
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `TCO Sensitivity to ${formatVariableName(sensitivityData.variable)}`
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.yAxisID === 'percentage') {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        } else {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxisTitle
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        } else {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    };
    
    // Add percentage axis if needed
    if (chartData.datasets.some(ds => ds.yAxisID === 'percentage')) {
        options.scales.percentage = {
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Savings Percentage'
            },
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            },
            grid: {
                drawOnChartArea: false
            }
        };
    }
    
    // Create chart
    chart.chart = new Chart(chart, {
        type: 'line',
        data: chartData,
        options: options
    });
}

function displaySavingsImpactChart(sensitivityData) {
    const chart = document.getElementById('savings-impact-chart');
    if (!chart) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        return;
    }
    
    // Destroy existing chart if it exists
    if (chart.chart) {
        chart.chart.destroy();
    }
    
    // Only show for specific vendor comparison (not 'all' or 'portnox')
    if (sensitivityData.vendor === 'all' || sensitivityData.vendor === 'portnox' || sensitivityData.vendor === 'noNac') {
        // Hide chart container with message
        const container = chart.closest('.chart-wrapper');
        if (container) {
            container.innerHTML = '<div class="chart-title">Portnox Savings Impact</div><div class="chart-placeholder">Select a specific vendor (not Portnox) to view savings impact.</div>';
        }
        return;
    }
    
    // Create chart data
    const chartData = {
        labels: sensitivityData.values.map(value => formatValue(value, sensitivityData.variable)),
        datasets: [
            {
                label: 'Cost Savings ($)',
                data: sensitivityData.results.map(result => result.result.savings.total),
                borderColor: '#1B67B2',
                backgroundColor: '#1B67B233', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'savings'
            },
            {
                label: 'Savings Percentage',
                data: sensitivityData.results.map(result => result.result.savings.percentage),
                borderColor: '#2BD25B',
                backgroundColor: '#2BD25B33', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'percentage'
            }
        ]
    };
    
    // If breach risk savings available, add it
    if (sensitivityData.results[0].result.noNac) {
        const portnoxVsNoNac = sensitivityData.results.map(result => {
            return result.result.noNac.cumulativeTotal - result.result.portnox.total;
        });
        
        const currentVendorVsNoNac = sensitivityData.results.map(result => {
            return result.result.noNac.cumulativeTotal - result.result.currentVendor.total;
        });
        
        // Calculate the additional savings with Portnox vs current vendor compared to No NAC
        const additionalSavings = portnoxVsNoNac.map((portnoxSavings, i) => {
            return portnoxSavings - currentVendorVsNoNac[i];
        });
        
        chartData.datasets.push({
            label: 'Additional Risk Reduction Savings',
            data: additionalSavings,
            borderColor: '#dc3545',
            backgroundColor: '#dc354533', // Add transparency
            borderWidth: 2,
            tension: 0.1,
            yAxisID: 'savings'
        });
    }
    
    // Format x-axis title based on variable
    const xAxisTitle = formatVariableName(sensitivityData.variable);
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Portnox Savings Impact vs. ${getVendorName(sensitivityData.vendor)}`
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.yAxisID === 'percentage') {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        } else {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle
                }
            },
            savings: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Cost Savings ($)'
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        } else {
                            return '$' + value;
                        }
                    }
                }
            },
            percentage: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Savings Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };
    
    // Create chart
    chart.chart = new Chart(chart, {
        type: 'line',
        data: chartData,
        options: options
    });
}

function displaySensitivityTable(sensitivityData) {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) return;
    
    // Clear table
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>${formatVariableName(sensitivityData.variable)}</th>`;
    
    // Add vendor columns
    if (sensitivityData.vendor === 'all') {
        // Add all vendors
        headerRow.innerHTML += `
            <th>Cisco ISE</th>
            <th>Aruba ClearPass</th>
            <th>Forescout</th>
            <th>FortiNAC</th>
            <th>Microsoft NPS</th>
            <th>SecureW2</th>
            <th>Portnox Cloud</th>
        `;
        
        // Add No-NAC if applicable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            headerRow.innerHTML += `<th>No NAC (Baseline)</th>`;
        }
    } else if (sensitivityData.vendor === 'noNac') {
        // Add No-NAC breakdown columns
        headerRow.innerHTML += `
            <th>Total Cost</th>
            <th>Breach Risk</th>
            <th>Compliance Risk</th>
            <th>Operational Inefficiency</th>
            <th>Staffing Costs</th>
        `;
    } else {
        // Add current vendor and Portnox
        headerRow.innerHTML += `
            <th>${getVendorName(sensitivityData.vendor)}</th>
            <th>Portnox Cloud</th>
            <th>Savings</th>
            <th>Savings %</th>
        `;
        
        // Add No-NAC if applicable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            headerRow.innerHTML += `<th>No NAC (Baseline)</th>`;
        }
    }
    
    tableHeader.appendChild(headerRow);
    
    // Create data rows
    sensitivityData.results.forEach((result, index) => {
        const row = document.createElement('tr');
        
        // Add variable value
        row.innerHTML = `<td>${formatValue(result.value, sensitivityData.variable)}</td>`;
        
        // Add data cells based on vendor selection
        if (sensitivityData.vendor === 'all') {
            // All vendors mode
            const vendorIds = ['cisco', 'aruba', 'forescout', 'fortinac', 'nps', 'securew2', 'portnox'];
            
            vendorIds.forEach(vendorId => {
                let cellValue = '';
                
                if (vendorId === 'portnox') {
                    cellValue = formatCurrency(result.result.portnox.total);
                } else if (result.result.currentVendor.id === vendorId) {
                    cellValue = formatCurrency(result.result.currentVendor.total);
                } else {
                    // Placeholder for unavailable data
                    cellValue = '-';
                }
                
                row.innerHTML += `<td>${cellValue}</td>`;
            });
            
            // Add No-NAC if applicable
            if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable) && result.result.noNac) {
                row.innerHTML += `<td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>`;
            }
        } else if (sensitivityData.vendor === 'noNac') {
            // No-NAC breakdown mode
            if (result.result.noNac) {
                row.innerHTML += `
                    <td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>
                    <td>${formatCurrency(result.result.noNac.breachRisk.cumulativeExpectedLoss)}</td>
                    <td>${formatCurrency(result.result.noNac.complianceRisk.cumulativeRisk)}</td>
                    <td>${formatCurrency(result.result.noNac.operationalInefficiency.cumulativeInefficiency)}</td>
                    <td>${formatCurrency(result.result.noNac.staffingCosts.cumulativeStaffingCost)}</td>
                `;
            } else {
                row.innerHTML += '<td colspan="5">No data available</td>';
            }
        } else {
            // Specific vendor mode
            row.innerHTML += `
                <td>${formatCurrency(result.result.currentVendor.total)}</td>
                <td>${formatCurrency(result.result.portnox.total)}</td>
                <td>${formatCurrency(result.result.savings.total)}</td>
                <td>${result.result.savings.percentage.toFixed(1)}%</td>
            `;
            
            // Add No-NAC if applicable
            if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable) && result.result.noNac) {
                row.innerHTML += `<td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>`;
            }
        }
        
        tableBody.appendChild(row);
    });
}

function clearResults() {
    // Clear charts
    const charts = ['sensitivity-chart', 'savings-impact-chart'];
    charts.forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (chart && chart.chart) {
            chart.chart.destroy();
            chart.chart = null;
        }
    });
    
    // Clear table
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (tableHeader) tableHeader.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
}

function formatValue(value, variable) {
    // Format value based on variable type
    switch (variable) {
        case 'deviceCount':
            return value.toLocaleString();
        case 'legacyPercentage':
            return value + '%';
        case 'locationCount':
            return value.toLocaleString();
        case 'yearsToProject':
            return value + (value === 1 ? ' Year' : ' Years');
        case 'hardwareCost':
        case 'licensingCost':
        case 'maintenanceCost':
        case 'implementationCost':
        case 'fteCost':
            return value.toFixed(2) + 'x';
        case 'downtimeCost':
            return '$' + value.toLocaleString() + '/hr';
        case 'breachRisk':
        case 'complianceRisk':
            return value.toFixed(2) + 'x';
        default:
            return value.toString();
    }
}

function formatVariableName(variable) {
    // Format variable name for display
    const variableDisplayNames = {
        deviceCount: 'Device Count',
        legacyPercentage: 'Legacy Device Percentage',
        locationCount: 'Number of Locations',
        yearsToProject: 'Years Projected',
        hardwareCost: 'Hardware Cost Multiplier',
        licensingCost: 'Licensing Cost Multiplier',
        maintenanceCost: 'Maintenance Cost Multiplier',
        implementationCost: 'Implementation Cost Multiplier',
        fteCost: 'Personnel Cost Multiplier',
        downtimeCost: 'Downtime Cost ($/hour)',
        breachRisk: 'Security Breach Risk Factor',
        complianceRisk: 'Compliance Risk Factor'
    };
    
    return variableDisplayNames[variable] || variable;
}

function formatCurrency(amount) {
    // Format currency value
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(2) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    } else {
        return '$' + amount.toLocaleString();
    }
}

function getVendorName(vendorId) {
    // Get vendor display name
    const vendorNames = {
        cisco: 'Cisco ISE',
        aruba: 'Aruba ClearPass',
        forescout: 'Forescout',
        fortinac: 'FortiNAC',
        nps: 'Microsoft NPS',
        securew2: 'SecureW2',
        portnox: 'Portnox Cloud',
        noNac: 'No NAC (Baseline)'
    };
    
    return vendorNames[vendorId] || vendorId;
}

function showMessage(type, message) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="message-text">${message}</div>
    `;
    
    // Add to container
    messageContainer.appendChild(messageElement);
}

function hideMessage() {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
}
