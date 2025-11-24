# Privacy Policy Setup Guide

## Overview

Chrome Web Store requires a publicly accessible URL for your extension's Privacy Policy. This guide explains how to host your privacy policy.

## Files Created

1. **`PRIVACY_POLICY.md`** - Markdown version (for documentation)
2. **`PRIVACY_POLICY.html`** - HTML version (for hosting online)

## Hosting Options

### Option 1: GitHub Pages (Recommended - Free)

1. **Create a GitHub repository** (if you don't have one)
   ```bash
   git init
   git add PRIVACY_POLICY.html
   git commit -m "Add privacy policy"
   git remote add origin https://github.com/yourusername/cybratix.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch and "/ (root)" folder
   - Click "Save"

3. **Rename file** (optional but recommended):
   - Rename `PRIVACY_POLICY.html` to `index.html` in your repository
   - Or create a `privacy-policy` folder and move the file there as `index.html`

4. **Your Privacy Policy URL will be**:
   - `https://yourusername.github.io/cybratix/privacy-policy/` (if in folder)
   - `https://yourusername.github.io/cybratix/PRIVACY_POLICY.html` (if in root)

### Option 2: Personal Website

If you have a personal website:

1. Upload `PRIVACY_POLICY.html` to your web server
2. Access it via: `https://yourwebsite.com/privacy-policy.html`
3. Update the URL in Chrome Web Store submission

### Option 3: Free Hosting Services

- **Netlify**: Drag and drop `PRIVACY_POLICY.html` → Get instant URL
- **Vercel**: Connect GitHub repo → Auto-deploy
- **GitHub Gist**: Create a gist with the HTML content (less ideal but works)

## Chrome Web Store Submission

When submitting to Chrome Web Store:

1. **Privacy Policy URL**: Enter your publicly accessible URL
   - Example: `https://yourusername.github.io/cybratix/privacy-policy/`
   - Must be accessible without authentication
   - Must be HTTPS (required by Chrome Web Store)

2. **Verification**: Chrome will verify the URL is accessible during review

## Testing Your Privacy Policy URL

Before submitting:

1. Open the URL in an incognito/private browser window
2. Verify it loads correctly
3. Check that all links work
4. Ensure the page is mobile-friendly

## Updating the Privacy Policy

If you need to update the privacy policy:

1. Edit `PRIVACY_POLICY.html` and `PRIVACY_POLICY.md`
2. Update the "Last Updated" date
3. Push changes to your hosting service
4. The URL remains the same - no need to update Chrome Web Store

## Important Notes

- ✅ Privacy Policy must be publicly accessible (no login required)
- ✅ Must use HTTPS (required by Chrome Web Store)
- ✅ Should be mobile-friendly
- ✅ Must be in English (or include English version)
- ✅ Should be clear and easy to understand

## Quick Start (GitHub Pages)

```bash
# 1. Create privacy-policy folder
mkdir privacy-policy

# 2. Copy HTML file
cp PRIVACY_POLICY.html privacy-policy/index.html

# 3. Commit and push
git add privacy-policy/
git commit -m "Add privacy policy for Chrome Web Store"
git push

# 4. Enable GitHub Pages in repository settings
# 5. Your URL will be: https://yourusername.github.io/repo-name/privacy-policy/
```

## Contact

For questions about hosting or the privacy policy:
- **Email:** pchukwuemeka424@gmail.com
- **Developer:** Prince Chukwuemeka

