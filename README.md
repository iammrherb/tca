# NAC Architecture Designer Pro

## Overview
Zero Trust NAC Architecture Designer Pro is a tool for calculating and comparing the Total Cost of Ownership (TCO) of different Network Access Control (NAC) solutions.

## Directory Structure
- `/app`: Main application files
  - `/views`: Main HTML views
  - `/templates`: Reusable templates
- `/css`: Stylesheets
  - `/themes`: Theme-related styles
  - `/components`: Component-specific styles
  - `/layouts`: Layout styles
  - `/animations`: Animation styles
  - `/visualizations`: Chart and visualization styles
  - `/utilities`: Utility styles
- `/js`: JavaScript files
  - `/utils`: Utility functions
  - `/managers`: Manager classes
  - `/components`: UI components
  - `/features`: Feature implementations
  - `/charts`: Chart implementations
  - `/wizards`: Wizard implementations
  - `/reports`: Report generators
  - `/vendors`: Vendor-specific code
- `/img`: Images
  - `/vendors`: Vendor logos
  - `/icons`: Icon images
- `/data`: Data files
  - `/vendors`: Vendor-specific data
  - `/industry`: Industry-specific data
  - `/compliance`: Compliance frameworks data
- `/libs`: Third-party libraries
- `/assets`: Additional assets
- `/docs`: Documentation
  - `/api`: API documentation
  - `/examples`: Example files
  - `/charts`: Chart documentation
  - `/components`: Component documentation

## Main Applications
- `index.html`: Main application entry point
- `executive-dashboard.html`: Executive dashboard view
- `sensitivity.html`: Sensitivity analysis view
- `industry-compliance.html`: Industry compliance view

## Getting Started
1. Open `index.html` in your web browser
2. Follow the wizard to select your current NAC vendor
3. Configure your organization details
4. View the results and comparison

## Build
This application uses bundled CSS and JavaScript files for production.
- `css/core.bundle.css`: Core styles
- `css/components.bundle.css`: Component styles
- `js/core.bundle.js`: Core functionality
- `js/components.bundle.js`: UI components
- `js/features.bundle.js`: Feature implementations

## Development
For development, you can modify individual files in their respective directories.

## Git Usage

This project is version-controlled using Git. Here are some common commands for working with this repository:

### Basic Git Commands

```bash
# Clone the repository
git clone [repository-url]

# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Pull latest changes
git pull

# Push changes
git push
```

### Branching Strategy

We follow a simple branching strategy:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Urgent fixes for production

### Creating a New Feature

```bash
# Create a new feature branch
git checkout develop
git pull
git checkout -b feature/your-feature-name

# Work on your feature...

# Commit and push your changes
git add .
git commit -m "Add your feature"
git push -u origin feature/your-feature-name

# When ready, create a pull request to merge into develop
```

See CONTRIBUTING.md for more details on the development workflow.

## Handling Large Files

Some files in this project are too large to be included in the Git repository:

- Bundle files (*.bundle.js, *.bundle.css)
- Minified libraries (*.min.js)
- Certain utility scripts (sass.dart.js)

These files are excluded via .gitignore and should be regenerated during the build process:

```bash
# Regenerate bundle files
./scripts/build.sh
```

See `assets/large-files/README.md` for more details on handling large files.
