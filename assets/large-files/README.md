# Large Files

This directory is for storing large files that shouldn't be committed directly to the Git repository.

## Recommended Approaches for Large Files

1. **Use Git LFS (Large File Storage)**
   - Install Git LFS: https://git-lfs.github.com/
   - Track large files: `git lfs track "*.js"`
   - Commit the .gitattributes file

2. **Use a build process**
   - Store source files in the repository
   - Generate large bundle files during build
   - Add bundle files to .gitignore

3. **Use a CDN or external hosting**
   - Host large files on a CDN
   - Reference them by URL in your application

## Files Currently Excluded

- js/core.bundle.js
- js/utils/sass.dart.js
