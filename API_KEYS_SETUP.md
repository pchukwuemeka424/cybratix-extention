# API Keys Setup Guide

Cybratix uses **IPQualityScore (IPQS) API** as the primary service for comprehensive domain analysis. The API key is pre-configured and ready to use!

## IPQualityScore (IPQS) API (Primary - Pre-configured)

**Status:** ✅ Pre-configured and active

**API Key:** `2qxVQ09doSSgHdeDldSlCsLsWMbrxl92`

**What IPQS Provides:**
- ✅ Domain age detection
- ✅ Phishing detection  
- ✅ Malware detection
- ✅ Fraud score calculation
- ✅ Suspicious activity detection
- ✅ Domain reputation analysis

**No setup required** - The extension uses IPQS by default!

## Optional: Additional API Keys

### WHOIS API Keys (Optional Fallback)

### Option 1: WhoisXML API (Recommended)
1. Go to https://whoisxmlapi.com/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 1,000 queries/month

**Setup:**
- Copy `config.example.js` to `config.js`
- Set `WHOIS_API_KEY` to your API key
- Set `WHOIS_API_PROVIDER` to `'whoisxmlapi'`

### Option 2: APIVoid Domain Age API
1. Go to https://www.apivoid.com/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 100 queries/day

**Setup:**
- Copy `config.example.js` to `config.js`
- Set `WHOIS_API_KEY` to your API key
- Set `WHOIS_API_PROVIDER` to `'apivoid'`

### Option 3: IPWhois API
1. Go to https://ipwhois.app/
2. Sign up for a free account
3. Get your API key

**Setup:**
- Copy `config.example.js` to `config.js`
- Set `WHOIS_API_KEY` to your API key
- Set `WHOIS_API_PROVIDER` to `'ipwhois'`

## VirusTotal API Key (Optional)

1. Go to https://www.virustotal.com/
2. Sign up for a free account
3. Get your API key from the API section
4. Free tier: 4 requests/minute, 500 requests/day

**Setup:**
- Copy `config.example.js` to `config.js`
- Set `VIRUSTOTAL_API_KEY` to your API key

## Configuration

The IPQS API key is already configured in the extension. To add optional API keys:

### Method 1: Chrome Storage (Recommended)

Open Chrome DevTools Console (F12) on any page and run:

```javascript
chrome.storage.local.set({
  config: {
    IPQS_API_KEY: '2qxVQ09doSSgHdeDldSlCsLsWMbrxl92', // Already configured
    VIRUSTOTAL_API_KEY: 'your-virustotal-key', // Optional
    WHOIS_API_KEY: 'your-whois-key' // Optional fallback
  }
});
```

Then reload the extension in `chrome://extensions/`

### Method 2: Config File (Advanced)

After copying `config.example.js` to `config.js`, your file should look like:

```javascript
const CONFIG = {
  IPQS_API_KEY: '2qxVQ09doSSgHdeDldSlCsLsWMbrxl92', // Pre-configured
  VIRUSTOTAL_API_KEY: 'your-virustotal-key-here', // Optional
  WHOIS_API_KEY: 'your-whois-key-here', // Optional fallback
  WHOIS_API_PROVIDER: 'whoisxmlapi',
  CACHE_DURATION: 3600000,
};
```

## Important Notes

- ✅ **IPQS API is pre-configured and active** - No setup needed!
- The extension works primarily with IPQS API
- Additional API keys (VirusTotal, WHOIS) are optional fallbacks
- API keys are stored locally in Chrome storage (not synced)
- Domain age, phishing, and malware detection work with IPQS by default

## Testing Your API Keys

1. Load the extension in Chrome
2. Visit a website (e.g., google.com)
3. Check the risk score badge - domain age should now show instead of "Unknown"
4. Check the browser console (F12) for any API errors

