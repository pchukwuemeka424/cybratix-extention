# Chrome Web Store Screenshots Guide

## Requirements

- **Format**: JPEG or 24-bit PNG (no alpha channel)
- **Dimensions**: 1280x800 or 640x400 pixels
- **Quantity**: At least 1, up to 5 screenshots
- **Content**: Should showcase extension features

## Recommended Screenshots

### 1. Main Feature - Risk Badge (Required)
**What to capture:**
- A website with the Cybratix risk badge visible
- Show the risk score prominently
- Display the detailed risk factors

**Example sites to use:**
- google.com (high score)
- A test site (low score to show warning)

### 2. Extension Popup
**What to capture:**
- Open the extension popup
- Show the risk score display
- Display all risk factors

### 3. Risk Score Details
**What to capture:**
- Expanded risk badge showing all factors
- Domain age, fraud score, phishing, malware, etc.
- Color-coded risk levels

### 4. Multiple Websites Comparison
**What to capture:**
- Side-by-side comparison of different risk scores
- Show safe vs. risky websites

### 5. Feature Highlights
**What to capture:**
- Key features listed
- Visual representation of security analysis

## How to Take Screenshots

### Method 1: Browser Screenshot Tools

1. **Chrome DevTools**:
   - Press F12 to open DevTools
   - Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
   - Type "Capture screenshot"
   - Select "Capture full size screenshot"

2. **Browser Extensions**:
   - Use screenshot extensions like "Full Page Screen Capture"
   - Capture the visible area

3. **Mac Screenshot**:
   - Cmd+Shift+4 for area selection
   - Cmd+Shift+3 for full screen
   - Use Preview to resize to 1280x800

4. **Windows Screenshot**:
   - Snipping Tool or Snip & Sketch
   - Capture and resize in Paint or image editor

### Method 2: Resize Existing Screenshots

If you have screenshots in different sizes:

```bash
# Using ImageMagick (if installed)
convert screenshot.png -resize 1280x800 screenshot-1280x800.png

# Using sips on Mac
sips -z 800 1280 screenshot.png --out screenshot-1280x800.png
```

## Screenshot Checklist

Before uploading, ensure each screenshot:

- [ ] Is 1280x800 or 640x400 pixels
- [ ] Is JPEG or 24-bit PNG format
- [ ] Has no alpha channel (transparency)
- [ ] Shows extension features clearly
- [ ] Is high quality and readable
- [ ] Doesn't contain personal information
- [ ] Shows the extension in action

## Creating Screenshots - Step by Step

### Screenshot 1: Risk Badge on Website

1. Visit a website (e.g., google.com)
2. Wait for the risk badge to appear
3. Take a screenshot of the page with the badge visible
4. Crop/resize to 1280x800
5. Save as `screenshot1-risk-badge.png`

### Screenshot 2: Extension Popup

1. Click the extension icon in Chrome toolbar
2. Take a screenshot of the popup
3. Resize to 1280x800 (add background if needed)
4. Save as `screenshot2-popup.png`

### Screenshot 3: Detailed Risk Factors

1. Visit a website with the risk badge
2. Expand the risk badge to show all factors
3. Take a screenshot showing all details
4. Resize to 1280x800
5. Save as `screenshot3-details.png`

### Screenshot 4: Multiple Risk Scores

1. Open multiple tabs with different websites
2. Arrange them side by side
3. Take a screenshot showing different risk scores
4. Resize to 1280x800
5. Save as `screenshot4-comparison.png`

### Screenshot 5: Feature Overview

1. Create a simple graphic showing key features:
   - Domain Age Analysis
   - Fraud Score (0-100)
   - Phishing Detection
   - Malware Detection
   - Suspicious Activity Flags
   - Site Safety Check
2. Save as `screenshot5-features.png`

## Image Editing Tips

### Remove Alpha Channel (PNG)

**Using ImageMagick:**
```bash
convert screenshot.png -alpha off screenshot-no-alpha.png
```

**Using Preview (Mac):**
1. Open PNG in Preview
2. File → Export
3. Format: JPEG (removes alpha automatically)
4. Or: Format: PNG, uncheck "Alpha" if available

**Using GIMP/Photoshop:**
1. Open image
2. Remove alpha channel
3. Export as JPEG or 24-bit PNG

### Resize Images

**Target sizes:**
- Large: 1280x800 (recommended)
- Small: 640x400 (alternative)

**Maintain aspect ratio** when resizing to avoid distortion.

## File Naming Convention

Suggested names:
- `cybratix-screenshot1-main.png`
- `cybratix-screenshot2-popup.png`
- `cybratix-screenshot3-details.png`
- `cybratix-screenshot4-comparison.png`
- `cybratix-screenshot5-features.png`

## Upload to Chrome Web Store

1. Go to your extension listing
2. Scroll to "Screenshots" section
3. Click "Upload"
4. Select your screenshot files
5. Chrome will validate format and size
6. Add captions if desired (optional)

## Quick Checklist

Before submitting:
- [ ] At least 1 screenshot ready
- [ ] All screenshots are 1280x800 or 640x400
- [ ] All are JPEG or 24-bit PNG
- [ ] No alpha channel/transparency
- [ ] Screenshots showcase key features
- [ ] High quality and readable
- [ ] No personal/sensitive information visible

## Tools for Screenshot Creation

- **Chrome DevTools**: Built-in screenshot
- **Preview (Mac)**: Resize and convert
- **GIMP**: Free image editor
- **ImageMagick**: Command-line tool
- **Canva**: Online design tool for feature graphics
- **Figma**: Design tool for creating feature overviews

Good luck with your submission! 📸

