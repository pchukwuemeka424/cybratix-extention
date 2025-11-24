# Chrome Web Store Permission Justifications

## Single Purpose Description

**Single Purpose:**

Cybratix has a single, narrow purpose: to analyze the security risk of websites users visit and display a risk score badge on each webpage. The extension automatically evaluates websites using security analysis APIs (IPQualityScore) to assess domain age, fraud score, phishing detection, malware presence, and suspicious activity. It then displays a visual risk score (0-100) badge on the page to help users make informed decisions about website safety before entering personal information or credentials. All functionality is focused exclusively on this security analysis and risk display - the extension does not perform any other functions, modify page content, collect user data, or interfere with browsing behavior beyond displaying the security badge.

---

## activeTab Permission

**Justification (1000 characters max):**

The activeTab permission is required to access the URL of the currently active browser tab when users open the extension popup. This allows Cybratix to display the security risk score for the website the user is currently viewing. The extension only accesses tab information when the user explicitly opens the popup interface - it does not continuously monitor tabs in the background. This permission enables the core functionality of showing users the security analysis for their current browsing context, helping them make informed decisions about website safety before entering personal information or credentials.

---

## storage Permission

**Justification (1000 characters max):**

The storage permission is essential for caching website security analysis results locally on the user's device. This serves two critical purposes: (1) Performance optimization - cached results prevent redundant API calls to security analysis services, reducing response times and API usage costs. Risk scores are cached for 1 hour per domain to balance freshness with efficiency. (2) User configuration - the extension stores user-provided API keys (if any) locally in Chrome's local storage, allowing users to optionally enhance functionality with their own API credentials. All data is stored locally and never transmitted to third-party servers except for the security analysis APIs themselves. No personal information or browsing history is stored - only domain risk scores and timestamps.

---

## tabs Permission

**Justification (1000 characters max):**

The tabs permission is required for two essential functions: (1) Automatic security analysis - when users navigate to a new website, the extension listens for tab updates to automatically analyze the website's security risk and display a risk score badge. This provides real-time protection without requiring user interaction. (2) Communication with content scripts - the extension sends security analysis results to content scripts running on web pages to display the risk badge UI. The extension only accesses tab URLs (not page content) and only for websites the user is actively visiting. It does not access tabs the user is not viewing, and all analysis is performed server-side through public security APIs. This permission enables the proactive security monitoring that is the core value proposition of the extension.

---

## scripting Permission

**Justification (1000 characters max):**

The scripting permission is required to inject the risk score badge UI into web pages that users visit. This badge displays the security analysis results (risk score, domain age, fraud score, phishing/malware detection) directly on the webpage, providing immediate visual feedback about website safety. The extension only injects a small, non-intrusive badge overlay that users can dismiss or drag to reposition. The injected content script does not modify page functionality, access form data, or interfere with user interactions - it only displays the security information badge. This visual indicator helps users make informed security decisions before entering sensitive information on potentially risky websites. The badge is clearly marked as part of the Cybratix extension and can be closed by users at any time.

---

## Host Permission (http://*/*, https://*/*)

**Justification (1000 characters max):**

Host permissions for all HTTP and HTTPS websites are required for three essential functions: (1) Content script injection - the extension must inject the security risk badge UI on all websites users visit to provide real-time security analysis. The badge appears on every page to help users assess website safety before interacting with forms or entering credentials. (2) Security API calls - the extension makes server-side API calls to IPQualityScore and other security analysis services to fetch domain reputation, fraud scores, phishing detection, malware scanning, and domain age information. These APIs require the extension to have permission to make network requests. (3) Automatic analysis - when users navigate to any website, the extension automatically analyzes the domain's security profile without requiring user interaction. The extension does not access or modify page content beyond displaying the security badge - it only reads the URL to perform security analysis and displays results. All analysis is performed through reputable third-party security APIs, and no user data or browsing behavior is collected or transmitted.

---

## Summary

All permissions are used exclusively for the extension's core security analysis functionality. The extension:
- Analyzes website security using third-party APIs (IPQualityScore, SSL Labs, etc.)
- Displays security risk scores to help users make informed decisions
- Caches results locally to optimize performance
- Does not collect personal information or browsing history
- Does not modify page functionality or access form data
- Only accesses URLs of websites users are actively visiting

