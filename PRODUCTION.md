# Production Deployment Guide

## Pre-Deployment Checklist

- [x] API keys secured (moved to config)
- [x] Development files moved to `dev-tools/`
- [x] Icons generated and in place
- [x] Manifest.json updated for production
- [x] Documentation updated

## Production Build

The extension is ready for production deployment. All necessary files are in the root directory.

### Required Files for Production

```
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js             # Content script
├── popup.html             # Extension popup
├── popup.js               # Popup script
├── styles.css             # Styling
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── config.example.js      # Configuration template
```

### Optional Configuration

1. **API Keys** (Optional):
   - Copy `config.example.js` to `config.js`
   - Add your VirusTotal API key if desired
   - Note: Extension works without API keys using free tiers

2. **Chrome Web Store Submission**:
   - Create a ZIP file of the extension (excluding dev-tools, node_modules, etc.)
   - Follow Chrome Web Store developer guidelines
   - Ensure all required assets are included

## Configuration

### Setting API Keys

1. Copy `config.example.js` to `config.js`
2. Add your API keys:
   ```javascript
   const CONFIG = {
     VIRUSTOTAL_API_KEY: 'your-key-here',
     CACHE_DURATION: 3600000
   };
   ```
3. The extension will automatically use these keys if available

**Note:** `config.js` is in `.gitignore` and will not be committed to version control.

## Building for Distribution

### Create Distribution ZIP

```bash
# Exclude development files
zip -r cybratix-v1.0.0.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*dev-tools*" \
  -x "*.DS_Store" \
  -x "*.log" \
  -x "config.js" \
  -x "package*.json"
```

### Chrome Web Store Requirements

1. **Icons**: ✅ All sizes present (16, 48, 128)
2. **Manifest**: ✅ Valid manifest.json
3. **Privacy Policy**: Required for Chrome Web Store
4. **Screenshots**: Prepare screenshots for store listing
5. **Description**: Update store listing description

## Security Notes

- API keys are stored in `config.js` (not in version control)
- No sensitive data is hardcoded
- All API calls are made server-side
- No user data is collected or stored

## Version Management

Update version in:
- `manifest.json` - version field
- Chrome Web Store listing
- Release notes

## Support

For production issues or questions:
- **Developer**: Prince Chukwuemeka
- **Email**: pchukwuemeka424@gmail.com

