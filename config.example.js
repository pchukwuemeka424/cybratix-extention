// Configuration file for Cybratix Extension
// Copy this file to config.js and add your API keys

const CONFIG = {
  // IPQualityScore (IPQS) API Key (recommended)
  // Get your API key from: https://www.ipqualityscore.com/
  // IPQS provides domain age, reputation, phishing detection, and more
  IPQS_API_KEY: '2qxVQ09doSSgHdeDldSlCsLsWMbrxl92',

  // VirusTotal API Key (optional)
  // Get your free API key from: https://www.virustotal.com/
  // Leave empty to use free tier with limited functionality
  VIRUSTOTAL_API_KEY: '',

  // WHOIS API Configuration (optional - IPQS handles most domain checks)
  // Get free API keys from:
  // - WhoisXML API: https://whoisxmlapi.com/ (free tier available)
  // - APIVoid: https://www.apivoid.com/ (free tier available)
  // Leave empty to use free public APIs (may have rate limits)
  WHOIS_API_KEY: '',
  WHOIS_API_PROVIDER: 'whoisxmlapi', // Options: 'whoisxmlapi', 'apivoid', 'ipwhois'

  // Cache duration in milliseconds (default: 1 hour)
  CACHE_DURATION: 3600000,
};

// Export for use in background.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

