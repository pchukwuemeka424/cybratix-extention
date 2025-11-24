# Privacy Policy for Cybratix Chrome Extension

**Last Updated:** January 2025

## Introduction

This Privacy Policy describes how Cybratix ("we", "our", or "the extension") handles information when you use our Chrome browser extension. We are committed to protecting your privacy and being transparent about our data practices.

## Developer Information

**Developer:** Prince Chukwuemeka  
**Email:** pchukwuemeka424@gmail.com  
**Extension Name:** Cybratix

## Data Collection and Use

### What Data We Collect

Cybratix collects **minimal data** necessary for its security analysis functionality:

1. **Website URLs/Domains**: When you visit a website, the extension accesses the URL/domain name of that website to perform security analysis. We do NOT access page content, form data, passwords, or any personal information on the webpage.

2. **Cached Risk Scores**: The extension stores security analysis results (risk scores, domain age, fraud scores, etc.) locally on your device for 1 hour to improve performance and reduce API calls.

3. **Optional API Keys**: If you choose to provide your own API keys (VirusTotal, WHOIS, etc.) for enhanced functionality, these are stored locally in Chrome's local storage on your device only.

### What Data We Do NOT Collect

We do **NOT** collect, store, or transmit:
- Personal information (name, email, address, etc.)
- Browsing history
- Page content or form data
- Passwords or credentials
- Search queries
- Location data
- Device information
- User behavior or analytics

### How We Use Collected Data

1. **Security Analysis**: Website URLs/domains are sent to third-party security analysis APIs (IPQualityScore, SSL Labs, etc.) to generate security risk assessments. These APIs analyze the domain for:
   - Domain age and registration history
   - Fraud score and reputation
   - Phishing detection
   - Malware detection
   - Suspicious activity patterns
   - SSL/TLS certificate validation

2. **Performance Optimization**: Risk scores are cached locally for 1 hour per domain to:
   - Reduce redundant API calls
   - Improve response times
   - Minimize API usage costs

3. **User Experience**: Cached data allows the extension to display security information quickly without repeated analysis of the same domain.

## Third-Party Services

Cybratix uses the following third-party services for security analysis:

1. **IPQualityScore (IPQS)**: 
   - Purpose: Domain reputation, fraud scoring, phishing/malware detection
   - Data Sent: Domain names/URLs only
   - Privacy Policy: https://www.ipqualityscore.com/privacy-policy

2. **SSL Labs API**:
   - Purpose: SSL/TLS certificate analysis
   - Data Sent: Domain names only
   - Privacy Policy: https://www.ssllabs.com/about/terms.html

3. **Optional Services** (if user provides API keys):
   - **VirusTotal**: Malware and threat detection
   - **WHOIS APIs**: Domain registration information

We are not responsible for the privacy practices of these third-party services. We encourage you to review their privacy policies.

## Data Storage

All data is stored **locally on your device** using Chrome's local storage:

- **Location**: Chrome browser's local storage (not synced across devices)
- **Duration**: 
  - Risk scores: Cached for 1 hour, then automatically deleted
  - API keys: Stored until you remove them or uninstall the extension
- **Access**: Only the extension can access this data
- **Transmission**: No data is transmitted to our servers or any servers we control

## Data Sharing

We do **NOT** share, sell, or rent your data to any third parties. The only data transmission occurs when:
- Domain names/URLs are sent to security analysis APIs (IPQualityScore, SSL Labs, etc.) for analysis
- This is necessary for the extension's core functionality

## Data Security

- All data is stored locally on your device
- No data is transmitted to our servers
- API keys (if provided) are stored securely in Chrome's local storage
- We use HTTPS for all API communications

## User Rights

You have the right to:

1. **Access**: View cached data through Chrome's developer tools (chrome.storage.local)
2. **Delete**: Clear all extension data by uninstalling the extension
3. **Control**: Remove API keys at any time through Chrome's developer console
4. **Disable**: Disable or uninstall the extension at any time

## Children's Privacy

Cybratix does not knowingly collect information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify users of any material changes by:
- Updating the "Last Updated" date
- Posting the updated policy in the extension's documentation

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

## Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact:

**Email:** pchukwuemeka424@gmail.com  
**Developer:** Prince Chukwuemeka

## Disclaimer

Cybratix provides security analysis based on available data from third-party APIs. Risk scores are calculated using algorithms and should be used as one factor in your security assessment. The extension is provided "as-is" without warranties. Always use multiple verification methods and consult with security professionals for critical security decisions.

---

**By using Cybratix, you acknowledge that you have read and understood this Privacy Policy.**

