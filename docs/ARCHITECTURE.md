# NAC Architecture Designer Pro - Architecture Documentation

## Overall Architecture
The NAC Architecture Designer Pro is a web application built with HTML, CSS, and JavaScript. It follows a component-based architecture with separation of concerns.

## Key Components
1. **Wizard Interface**: Guides users through the process of selecting their current NAC vendor, configuring organization details, and viewing results.
2. **Calculation Engine**: Performs TCO calculations based on user inputs.
3. **Visualization Components**: Charts and graphs for displaying comparison data.
4. **Reporting System**: Generates reports in various formats.

## Directory Structure Rationale
- **CSS Organization**: CSS files are organized by their purpose (themes, components, layouts) to make styling more maintainable.
- **JavaScript Organization**: JS files are organized by their functionality to support separation of concerns.
- **Bundling Strategy**: Files are bundled by their purpose to reduce HTTP requests in production.

## Integration Points
- Chart.js for data visualization
- jsPDF for report generation
- Various data files for vendor and industry information

## Data Flow
1. User inputs are collected through the wizard interface
2. Calculation engines process the inputs
3. Results are displayed through visualization components
4. Reports can be generated based on the results
