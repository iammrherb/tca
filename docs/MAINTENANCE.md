# NAC Architecture Designer Pro - Maintenance Guide

## Adding New Features
1. Create new feature files in the appropriate subdirectory under `js/features/`
2. Add any necessary CSS in the appropriate subdirectory under `css/components/`
3. Update the HTML to include the new feature

## Adding New Vendors
1. Add vendor data to `data/vendors/`
2. Add vendor logo to `img/vendors/`
3. Update the vendor selection UI in the HTML

## Updating Calculation Models
1. Modify the relevant calculation files in `js/features/`
2. Update any affected visualization components

## Building for Production
1. Ensure all individual files are properly organized
2. Run bundling scripts to create the bundled CSS and JS files
3. Test the application with the bundled files

## Common Issues and Solutions
- **Chart rendering issues**: Check browser console for errors, ensure Chart.js is properly initialized
- **Calculation discrepancies**: Verify the calculation logic in the relevant feature files
- **UI inconsistencies**: Check CSS specificity and ensure the correct CSS files are being loaded
