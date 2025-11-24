# Setup Instructions

## Quick Start

1. **Generate Icons**
   - Open `generate-icons.html` in your browser
   - Click "Generate Icons"
   - Right-click each icon and save them as:
     - `icons/icon16.png`
     - `icons/icon48.png`
     - `icons/icon128.png`

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select this extension folder

3. **Test the Extension**
   - Visit any website (e.g., google.com)
   - Look for the risk score badge in the top-right corner
   - The badge will show the risk score and detailed breakdown

## Optional: Enhanced Features

### API Keys Status

✅ **VirusTotal API Key**: Already configured in `background.js` for enhanced server reputation checks.

### Additional API Keys (Optional)

For even more enhanced functionality, you can add additional API keys:

1. **VirusTotal API** (for server reputation):
   - ✅ Already configured
   - Get your own free API key from https://www.virustotal.com/ if needed

2. **WHOIS API** (for domain age):
   - The extension uses free WHOIS APIs by default
   - For more reliable results, consider using a paid WHOIS API service

3. **SSL Labs API**:
   - Free to use, but has rate limits
   - No API key required

## Troubleshooting

### Icons Not Showing
- Make sure you've generated and saved the icons in the `icons/` folder
- Check that the file names match exactly: `icon16.png`, `icon48.png`, `icon128.png`

### Risk Score Not Appearing
- Check the browser console for errors (F12 → Console)
- Make sure the website uses HTTP/HTTPS (chrome:// pages won't work)
- Wait a few seconds for the analysis to complete

### API Errors
- Some APIs have rate limits on free tiers
- The extension will fall back to heuristic checks if APIs fail
- Check the browser console for specific error messages

## Development

### Testing Changes
1. Make your changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the webpage you're testing

### Debugging
- Background script: Go to `chrome://extensions/` → Click "service worker" link
- Content script: Use browser DevTools (F12) on any webpage
- Popup: Right-click extension icon → "Inspect popup"

