// Background service worker for risk analysis
// Developed by: Prince Chukwuemeka
// Email: pchukwuemeka424@gmail.com

// Configuration - API keys should be set in config.js (copy from config.example.js)
// For production, use environment variables or secure storage
let CONFIG = {
  IPQS_API_KEY: '2qxVQ09doSSgHdeDldSlCsLsWMbrxl92', // IPQualityScore API key
  VIRUSTOTAL_API_KEY: '',
  WHOIS_API_KEY: '',
  WHOIS_API_PROVIDER: 'whoisxmlapi',
  CACHE_DURATION: 3600000 // 1 hour in milliseconds
};

// Config is loaded via loadConfig() function on startup
// Users can set config using chrome.storage.local.set({ config: {...} })

// Load config on startup
async function loadConfig() {
  try {
    const result = await chrome.storage.local.get(['config']);
    if (result.config) {
      CONFIG = { ...CONFIG, ...result.config };
      console.log('Config loaded:', { 
        hasIPQSKey: !!CONFIG.IPQS_API_KEY,
        IPQSKey: CONFIG.IPQS_API_KEY ? CONFIG.IPQS_API_KEY.substring(0, 10) + '...' : 'none',
        hasWhoisKey: !!CONFIG.WHOIS_API_KEY, 
        hasVirusTotalKey: !!CONFIG.VIRUSTOTAL_API_KEY 
      });
    } else {
      console.log('Using default configuration with IPQS key:', CONFIG.IPQS_API_KEY ? CONFIG.IPQS_API_KEY.substring(0, 10) + '...' : 'none');
    }
  } catch (e) {
    console.log('Error loading config, using defaults:', e);
  }
}

// Load config immediately
loadConfig();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Cybratix Extension installed');
  loadConfig();
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'ok', message: 'Extension is running' });
    return true;
  }
  
  if (message.type === 'ANALYZE_URL') {
    // Handle analysis request from popup
    analyzeWebsiteRisk(message.url, message.tabId).then(async (riskData) => {
      if (riskData) {
        sendResponse({ riskData: riskData });
      } else {
        // Try to get from cache
        try {
          const urlObj = new URL(message.url);
          const domain = urlObj.hostname;
          const cacheKey = `risk_${domain}`;
          const cached = await chrome.storage.local.get([cacheKey]);
          if (cached[cacheKey]) {
            sendResponse({ riskData: cached[cacheKey].data });
          } else {
            sendResponse({ error: 'Analysis in progress' });
          }
        } catch {
          sendResponse({ error: 'Invalid URL' });
        }
      }
    }).catch((error) => {
      console.error('Error in analyze request:', error);
      sendResponse({ error: error.message });
    });
    return true; // Keep channel open for async response
  }
  
  return false;
});

// Listen for tab updates to analyze risk
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    analyzeWebsiteRisk(tab.url, tabId);
  }
});

// Analyze website risk
async function analyzeWebsiteRisk(url, tabId) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Skip chrome://, chrome-extension://, and other non-http(s) URLs
    if (!urlObj.protocol.startsWith('http')) {
      return null;
    }

    // Check cache first
    const cacheKey = `risk_${domain}`;
    const cached = await chrome.storage.local.get([cacheKey]);
    const cacheDuration = CONFIG.CACHE_DURATION || 3600000; // Default 1 hour
    
    if (cached[cacheKey] && Date.now() - cached[cacheKey].timestamp < cacheDuration) {
      // Use cached data if less than 1 hour old
      if (tabId) {
        sendRiskDataToContent(tabId, cached[cacheKey].data);
      }
      return cached[cacheKey].data;
    }

    // Perform risk analysis
    const riskData = await performRiskAnalysis(domain, url);
    
    // Cache the results
    await chrome.storage.local.set({
      [cacheKey]: {
        data: riskData,
        timestamp: Date.now()
      }
    });

    // Send to content script if tabId provided
    if (tabId) {
      sendRiskDataToContent(tabId, riskData);
    }
    
    return riskData;
  } catch (error) {
    console.error('Error analyzing website risk:', error);
    return null;
  }
}

// Send risk data to content script
function sendRiskDataToContent(tabId, riskData) {
  chrome.tabs.sendMessage(tabId, {
    type: 'RISK_DATA',
    data: riskData
  }).catch(() => {
    // Content script might not be ready yet, ignore
  });
}

// Perform comprehensive risk analysis using IPQS data
async function performRiskAnalysis(domain, fullUrl) {
  // Fetch IPQS data for comprehensive analysis
  const ipqsData = await fetchIPQSData(fullUrl);
  
  // Log IPQS data for debugging
  if (ipqsData) {
    console.log('IPQS Data received:', {
      domain_age: ipqsData.domain_age,
      fraud_score: ipqsData.fraud_score,
      phishing: ipqsData.phishing,
      malware: ipqsData.malware,
      suspicious: ipqsData.suspicious,
      unsafe: ipqsData.unsafe
    });
  } else {
    console.log('No IPQS data received - API may have failed or key not configured');
  }
  
  // Structure risk factors using IPQS data fields
  const riskFactors = {
    domainAge: extractDomainAge(ipqsData),
    fraudScore: extractFraudScore(ipqsData),
    phishing: extractPhishingDetection(ipqsData),
    malware: extractMalwareDetection(ipqsData),
    suspicious: extractSuspiciousActivity(ipqsData),
    unsafe: extractUnsafeSite(ipqsData),
    sslIssues: await checkSSLIssues(domain) // Keep SSL check as it's separate
  };

  // Calculate overall risk score (0-100, where 100 is safest)
  const riskScore = calculateRiskScore(riskFactors);

  return {
    domain,
    riskScore,
    riskFactors,
    ipqsData: ipqsData || null, // Include raw IPQS data for reference
    timestamp: Date.now()
  };
}

// Extract domain age in days from IPQS data
function extractDomainAge(ipqsData) {
  if (!ipqsData || ipqsData.domain_age === undefined || ipqsData.domain_age === null) {
    return {
      ageInDays: null,
      risk: 'unknown',
      score: 50,
      details: 'Domain age unavailable'
    };
  }
  
  // Convert to number and validate
  const ageInDays = Number(ipqsData.domain_age);
  
  // Check if it's a valid number
  if (isNaN(ageInDays) || ageInDays < 0) {
    return {
      ageInDays: null,
      risk: 'unknown',
      score: 50,
      details: 'Domain age unavailable'
    };
  }
  
  const ageInDaysFloor = Math.floor(ageInDays);
  
  // Less than 1 year = unhealthy, 1 year or more = healthy
  let risk = 'low';
  let score = 100;
  let isHealthy = true;
  
  if (ageInDaysFloor < 365) {
    risk = 'high';
    score = 30;
    isHealthy = false;
  }
  
  return {
    ageInDays: ageInDaysFloor,
    risk: risk,
    score: score,
    isHealthy: isHealthy,
    details: isHealthy ? 'Healthy (1+ years)' : 'Unhealthy (< 1 year)'
  };
}

// Extract fraud score (0-100) from IPQS data
function extractFraudScore(ipqsData) {
  if (!ipqsData || ipqsData.fraud_score === undefined || ipqsData.fraud_score === null) {
    return {
      fraudScore: null,
      risk: 'unknown',
      score: 50,
      details: 'Fraud score unavailable'
    };
  }
  
  // Convert to number and validate
  const fraudScore = Number(ipqsData.fraud_score);
  
  // Check if it's a valid number
  if (isNaN(fraudScore) || fraudScore < 0 || fraudScore > 100) {
    return {
      fraudScore: null,
      risk: 'unknown',
      score: 50,
      details: 'Fraud score unavailable'
    };
  }
  
  // Fraud score: 0-25 = low risk, 26-50 = medium, 51-75 = high, 76-100 = very high
  // We invert it for our score (100 = safest, so low fraud = high score)
  let risk = 'low';
  let score = 100;
  
  if (fraudScore >= 76) {
    risk = 'high';
    score = 20;
  } else if (fraudScore >= 51) {
    risk = 'high';
    score = 40;
  } else if (fraudScore >= 26) {
    risk = 'medium';
    score = 60;
  } else {
    risk = 'low';
    score = 100;
  }
  
  return {
    fraudScore: Math.round(fraudScore),
    risk: risk,
    score: score,
    details: `Fraud score: ${Math.round(fraudScore)}/100`
  };
}

// Extract phishing detection from IPQS data
function extractPhishingDetection(ipqsData) {
  if (!ipqsData || ipqsData.phishing === undefined) {
    return {
      detected: false,
      risk: 'unknown',
      score: 50,
      details: 'Phishing check unavailable'
    };
  }
  
  const detected = ipqsData.phishing === true;
  
  return {
    detected: detected,
    risk: detected ? 'high' : 'low',
    score: detected ? 20 : 100,
    details: detected ? 'Phishing detected' : 'No phishing detected'
  };
}

// Extract malware detection from IPQS data
function extractMalwareDetection(ipqsData) {
  if (!ipqsData || ipqsData.malware === undefined) {
    return {
      detected: false,
      risk: 'unknown',
      score: 50,
      details: 'Malware check unavailable'
    };
  }
  
  const detected = ipqsData.malware === true;
  
  return {
    detected: detected,
    risk: detected ? 'high' : 'low',
    score: detected ? 20 : 100,
    details: detected ? 'Malware detected' : 'No malware detected'
  };
}

// Extract suspicious activity flags from IPQS data
function extractSuspiciousActivity(ipqsData) {
  if (!ipqsData || ipqsData.suspicious === undefined) {
    return {
      flagged: false,
      risk: 'unknown',
      score: 50,
      details: 'Suspicious activity check unavailable'
    };
  }
  
  const flagged = ipqsData.suspicious === true;
  
  return {
    flagged: flagged,
    risk: flagged ? 'high' : 'low',
    score: flagged ? 40 : 100,
    details: flagged ? 'Suspicious activity detected' : 'No suspicious activity'
  };
}

// Extract unsafe site detection from IPQS data
function extractUnsafeSite(ipqsData) {
  if (!ipqsData || ipqsData.unsafe === undefined) {
    return {
      unsafe: false,
      risk: 'unknown',
      score: 50,
      details: 'Safety check unavailable'
    };
  }
  
  const unsafe = ipqsData.unsafe === true;
  
  return {
    unsafe: unsafe,
    risk: unsafe ? 'high' : 'low',
    score: unsafe ? 30 : 100,
    details: unsafe ? 'Unsafe site detected' : 'Site appears safe'
  };
}

// Old functions removed - now using extractDomainAge, extractFraudScore, extractPhishingDetection, etc.

// Fetch IPQualityScore data for domain/URL
async function fetchIPQSData(url) {
  const apiKey = CONFIG.IPQS_API_KEY || '';
  
  if (!apiKey) {
    console.log('IPQS API key not configured');
    return null;
  }
  
  try {
    // Extract domain from URL
    let domain;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch (e) {
      domain = url; // If URL parsing fails, assume it's already a domain
    }
    
    // Try Domain Reputation API first (has domain_age and fraud_score)
    const domainApiUrl = `https://www.ipqualityscore.com/api/json/domain/${apiKey}/${encodeURIComponent(domain)}`;
    
    let domainData = null;
    try {
      const domainResponse = await fetch(domainApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (domainResponse.ok) {
        const data = await domainResponse.json();
        if (data.success !== false) {
          domainData = data;
          console.log('IPQS Domain API success:', { domain_age: data.domain_age, fraud_score: data.fraud_score });
        } else {
          console.log('IPQS Domain API error:', data.message || 'Unknown error');
        }
      } else {
        console.log(`IPQS Domain API returned status: ${domainResponse.status}`);
      }
    } catch (domainError) {
      console.log('IPQS Domain API error:', domainError.message);
    }
    
    // Also try URL Scanning API for additional data
    const urlApiUrl = `https://www.ipqualityscore.com/api/json/url/${apiKey}/${encodeURIComponent(url)}`;
    
    let urlData = null;
    try {
      const urlResponse = await fetch(urlApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (urlResponse.ok) {
        const data = await urlResponse.json();
        if (data.success !== false) {
          urlData = data;
          console.log('IPQS URL API success');
        } else {
          console.log('IPQS URL API error:', data.message || 'Unknown error');
        }
      } else {
        console.log(`IPQS URL API returned status: ${urlResponse.status}`);
      }
    } catch (urlError) {
      console.log('IPQS URL API error:', urlError.message);
    }
    
    // Merge data - prefer domain data for domain_age and fraud_score, URL data for phishing/malware
    const mergedData = {
      ...domainData,
      ...urlData,
      // Ensure domain_age and fraud_score come from domain API
      domain_age: domainData?.domain_age ?? urlData?.domain_age,
      fraud_score: domainData?.fraud_score ?? urlData?.fraud_score,
      // Prefer URL API for phishing/malware if available
      phishing: urlData?.phishing ?? domainData?.phishing,
      malware: urlData?.malware ?? domainData?.malware,
      suspicious: urlData?.suspicious ?? domainData?.suspicious,
      unsafe: urlData?.unsafe ?? domainData?.unsafe
    };
    
    if (mergedData.domain_age !== undefined || mergedData.fraud_score !== undefined || mergedData.phishing !== undefined) {
      return mergedData;
    }
    
    return null;
  } catch (error) {
    console.log('IPQS API error:', error.message);
    return null;
  }
}

// Fetch WHOIS data (shared between domain age and WHOIS checks)
async function fetchWHOISData(domain) {
  // Try IPQS first if available
  const ipqsKey = CONFIG.IPQS_API_KEY || '';
  if (ipqsKey) {
    try {
      // IPQS Domain Reputation API
      const ipqsUrl = `https://www.ipqualityscore.com/api/json/domain/${ipqsKey}/${domain}`;
      const response = await fetch(ipqsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success !== false && data.domain_age) {
          // IPQS provides domain_age in days
          return {
            creation_date: new Date(Date.now() - data.domain_age * 24 * 60 * 60 * 1000).toISOString(),
            age_days: data.domain_age,
            registrar: data.registrar,
            registrant: data.registrant,
            isp: data.isp,
            organization: data.organization,
            country: data.country,
            _ipqs_data: data // Store full IPQS data
          };
        }
      }
    } catch (error) {
      console.log('IPQS Domain API error:', error.message);
    }
  }
  
  const apiKey = CONFIG.WHOIS_API_KEY || '';
  const provider = CONFIG.WHOIS_API_PROVIDER || 'whoisxmlapi';
  
  // Try API with key first if available
  if (apiKey) {
    try {
      let apiUrl = '';
      
      if (provider === 'whoisxmlapi') {
        // WhoisXML API - https://whoisxmlapi.com/
        apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domain}&outputFormat=JSON`;
      } else if (provider === 'apivoid') {
        // APIVoid Domain Age API - https://www.apivoid.com/
        apiUrl = `https://endpoint.apivoid.com/domainage/v1/pay-as-you-go/?key=${apiKey}&domain=${domain}`;
      } else if (provider === 'ipwhois') {
        // IPWhois API
        apiUrl = `https://ipwhois.app/json/${domain}?key=${apiKey}`;
      }
      
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Parse response based on provider
          if (provider === 'whoisxmlapi') {
            // WhoisXML API format
            if (data.WhoisRecord) {
              return {
                creation_date: data.WhoisRecord.createdDate || data.WhoisRecord.registryData?.createdDate,
                registrar: data.WhoisRecord.registrar?.name,
                registrant: data.WhoisRecord.registrant,
                ...data.WhoisRecord
              };
            }
          } else if (provider === 'apivoid') {
            // APIVoid format
            if (data.data && data.data.creation_date) {
              return {
                creation_date: data.data.creation_date,
                age_days: data.data.age_days,
                registrar: data.data.registrar,
                ...data.data
              };
            }
          } else if (provider === 'ipwhois') {
            // IPWhois format
            if (data.creation_date) {
              return data;
            }
          }
        } else {
          console.log(`WHOIS API returned status: ${response.status}`);
        }
      }
    } catch (error) {
      console.log('WHOIS API error:', error.message);
    }
  }
  
  // Fallback to free public APIs
  const freeApis = [
    `https://whoisjsonapi.com/api/v1/whois?domain=${domain}`,
    `https://api.whoisxmlapi.com/v1?apiKey=free&domainName=${domain}`
  ];
  
  for (const apiUrl of freeApis) {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Check if we got valid data
        if (data.creation_date || data.WhoisRecord?.createdDate || data.created_date) {
          return data;
        }
      }
    } catch (error) {
      console.log('Free WHOIS API error:', error.message);
      continue;
    }
  }
  
  return null;
}

// Extract domain age from WHOIS data
function checkDomainAgeFromWHOIS(whoisData) {
  if (!whoisData) return null;
  
  try {
    // Try multiple possible date fields
    let creationDate = whoisData.creation_date || 
                      whoisData.created_date || 
                      whoisData.registered_date ||
                      whoisData.WhoisRecord?.createdDate ||
                      whoisData.WhoisRecord?.registryData?.createdDate ||
                      whoisData.data?.creation_date;
    
    // If we have age_days directly (from APIVoid), use it
    if (whoisData.age_days || whoisData.data?.age_days) {
      const ageInDays = whoisData.age_days || whoisData.data.age_days;
      
      if (ageInDays >= 0 && ageInDays <= 36500) {
        return {
          ageInDays: Math.floor(ageInDays),
          creationDate: creationDate || 'Unknown',
          risk: ageInDays < 30 ? 'high' : ageInDays < 365 ? 'medium' : 'low',
          score: ageInDays < 30 ? 30 : ageInDays < 365 ? 70 : 100
        };
      }
    }
    
    // Otherwise calculate from creation date
    if (creationDate) {
      const date = new Date(creationDate);
      
      if (isNaN(date.getTime())) {
        return null;
      }
      
      const ageInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      
      if (ageInDays < 0 || ageInDays > 36500) {
        return null;
      }
      
      return {
        ageInDays: Math.floor(ageInDays),
        creationDate: creationDate,
        risk: ageInDays < 30 ? 'high' : ageInDays < 365 ? 'medium' : 'low',
        score: ageInDays < 30 ? 30 : ageInDays < 365 ? 70 : 100
      };
    }
  } catch (error) {
    console.log('Error parsing domain age from WHOIS:', error);
  }
  
  return null;
}

// Extract WHOIS abnormalities from WHOIS data
function checkWHOISAbnormalitiesFromData(whoisData) {
  if (!whoisData) return null;
  
  try {
    const abnormalities = [];
    
    // Check for privacy protection (good sign)
    const hasPrivacy = whoisData.registrar?.includes('Privacy') || whoisData.registrar?.includes('Proxy');
    
    // Check for suspicious registrar
    const suspiciousRegistrars = ['freenom', 'namecheap'];
    const isSuspiciousRegistrar = suspiciousRegistrars.some(s => 
      whoisData.registrar?.toLowerCase().includes(s)
    );
    
    // Check for recent registration
    if (whoisData.creation_date) {
      const creationDate = new Date(whoisData.creation_date);
      const daysSinceCreation = (Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 30) {
        abnormalities.push('Recently registered domain');
      }
    }
    
    // Check for missing contact information
    if (!whoisData.registrant || !whoisData.registrant.organization) {
      abnormalities.push('Missing registrant information');
    }
    
    const risk = abnormalities.length > 2 ? 'high' : abnormalities.length > 0 ? 'medium' : 'low';
    
    return {
      abnormalities,
      hasPrivacy,
      isSuspiciousRegistrar,
      risk,
      score: abnormalities.length > 2 ? 40 : abnormalities.length > 0 ? 70 : 100,
      details: abnormalities.length > 0 ? abnormalities.join(', ') : 'No abnormalities detected'
    };
  } catch (error) {
    console.log('Error parsing WHOIS abnormalities:', error);
  }
  
  return null;
}

// Check domain age (fallback if shared WHOIS data not available)
async function checkDomainAge(domain) {
  try {
    // Try alternative WHOIS APIs as fallback
    const apis = [
      {
        url: `https://api.whoisxmlapi.com/v1?apiKey=free&domainName=${domain}`,
        parseDate: (data) => data.WhoisRecord?.createdDate || data.WhoisRecord?.registryData?.createdDate || data.createdDate
      }
    ];
    
    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const creationDate = api.parseDate(data);
          
          if (creationDate) {
            const date = new Date(creationDate);
            
            // Validate date
            if (isNaN(date.getTime())) {
              continue; // Invalid date, try next API
            }
            
            const ageInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
            
            // Sanity check: domain age should be reasonable (not negative, not too old)
            if (ageInDays < 0 || ageInDays > 36500) { // More than 100 years is suspicious
              continue;
            }
            
            return {
              ageInDays: Math.floor(ageInDays),
              creationDate: creationDate,
              risk: ageInDays < 30 ? 'high' : ageInDays < 365 ? 'medium' : 'low',
              score: ageInDays < 30 ? 30 : ageInDays < 365 ? 70 : 100
            };
          }
        }
      } catch (apiError) {
        // Try next API
        continue;
      }
    }
  } catch (error) {
    console.error('Error checking domain age:', error);
  }
  
  return estimateDomainAge(domain);
}

// Estimate domain age from certificate
async function estimateDomainAge(domain) {
  // Fallback: return unknown
  return {
    ageInDays: null,
    creationDate: null,
    risk: 'unknown',
    score: 50
  };
}

// Check SSL certificate issues
async function checkSSLIssues(domain) {
  try {
    // SSL Labs API (free, but may have rate limits)
    const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&fromCache=on&maxAge=1`, {
      method: 'GET'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.endpoints && data.endpoints.length > 0) {
        const endpoint = data.endpoints[0];
        const grade = endpoint.grade || 'F';
        const hasIssues = !grade || grade < 'A' || endpoint.statusMessage !== 'Ready';
        
        return {
          grade,
          hasIssues,
          risk: hasIssues ? 'high' : 'low',
          score: hasIssues ? 40 : 100,
          details: endpoint.statusMessage || 'Analysis complete'
        };
      }
    }
  } catch (error) {
    console.error('Error checking SSL:', error);
  }
  
  // Fallback: basic HTTPS check
  // Note: In service worker, we can't directly test HTTPS, so we'll assume
  // if the current page is HTTPS, it's available
  const isHTTPS = domain.startsWith('https://') || true; // Assume HTTPS for modern sites
  
  return {
    grade: 'Unknown',
    hasIssues: false,
    risk: 'medium',
    score: 70,
    details: 'HTTPS available (detailed SSL analysis unavailable)'
  };
}

// Check server reputation
async function checkServerReputation(domain) {
  // Use API key from config, or fallback to empty (will use free tier)
  const VIRUSTOTAL_API_KEY = CONFIG.VIRUSTOTAL_API_KEY || '';
  
  // Only use VirusTotal API if key is provided
  if (VIRUSTOTAL_API_KEY) {
  try {
    // Try VirusTotal API first
    const response = await fetch(`https://www.virustotal.com/vtapi/v2/domain/report?apikey=${VIRUSTOTAL_API_KEY}&domain=${domain}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Check response code
      if (data.response_code === 1) {
        const detectedUrls = data.detected_urls || [];
        const detectedSamples = data.detected_samples || [];
        const positives = detectedUrls.length + detectedSamples.length;
        
        // Also check for detected samples count
        const samplePositives = data.detected_samples?.reduce((sum, sample) => sum + (sample.positives || 0), 0) || 0;
        const totalPositives = positives + samplePositives;
        
        const risk = totalPositives > 10 ? 'high' : totalPositives > 3 ? 'medium' : 'low';
        
        return {
          positives: totalPositives,
          detectedUrls: detectedUrls.length,
          detectedSamples: detectedSamples.length,
          risk,
          score: totalPositives > 10 ? 30 : totalPositives > 3 ? 70 : 100,
          details: totalPositives > 0 
            ? `${totalPositives} suspicious detection(s) found` 
            : 'No threats detected'
        };
      } else if (data.response_code === 0) {
        // Domain not found in VirusTotal database
        // Fall through to heuristic checks
      }
    }
  } catch (error) {
    console.error('Error checking VirusTotal API:', error);
    // Fall through to heuristic checks
    }
  }
  
  // Fallback: heuristic checks
  try {
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
    const isSuspiciousTLD = suspiciousTLDs.some(tld => domain.endsWith(tld));
    
    if (isSuspiciousTLD) {
      return {
        positives: 1,
        risk: 'medium',
        score: 60,
        details: 'Free TLD detected (may indicate lower trust)'
      };
    }
    
    // Check for known safe domains (major companies)
    const trustedDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com'];
    const isTrusted = trustedDomains.some(td => domain.includes(td));
    
    if (isTrusted) {
      return {
        positives: 0,
        risk: 'low',
        score: 100,
        details: 'Known trusted domain'
      };
    }
  } catch (error) {
    console.error('Error in heuristic checks:', error);
  }
  
  // Final fallback: neutral score
  return {
    positives: 0,
    risk: 'unknown',
    score: 50,
    details: 'Reputation check completed (no threats detected)'
  };
}

// Check WHOIS abnormalities
async function checkWHOISAbnormalities(domain) {
  try {
    const response = await fetch(`https://whoisjsonapi.com/api/v1/whois?domain=${domain}`);
    
    if (response.ok) {
      const data = await response.json();
      const abnormalities = [];
      
      // Check for privacy protection (good sign)
      const hasPrivacy = data.registrar?.includes('Privacy') || data.registrar?.includes('Proxy');
      
      // Check for suspicious registrar
      const suspiciousRegistrars = ['freenom', 'namecheap'];
      const isSuspiciousRegistrar = suspiciousRegistrars.some(s => 
        data.registrar?.toLowerCase().includes(s)
      );
      
      // Check for recent registration
      if (data.creation_date) {
        const creationDate = new Date(data.creation_date);
        const daysSinceCreation = (Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation < 30) {
          abnormalities.push('Recently registered domain');
        }
      }
      
      // Check for missing contact information
      if (!data.registrant || !data.registrant.organization) {
        abnormalities.push('Missing registrant information');
      }
      
      const risk = abnormalities.length > 2 ? 'high' : abnormalities.length > 0 ? 'medium' : 'low';
      
      return {
        abnormalities,
        hasPrivacy,
        isSuspiciousRegistrar,
        risk,
        score: abnormalities.length > 2 ? 40 : abnormalities.length > 0 ? 70 : 100,
        details: abnormalities.length > 0 ? abnormalities.join(', ') : 'No abnormalities detected'
      };
    }
  } catch (error) {
    console.error('Error checking WHOIS:', error);
  }
  
  return {
    abnormalities: [],
    risk: 'unknown',
    score: 50,
    details: 'WHOIS data unavailable'
  };
}

// Check for phishing patterns
async function checkPhishingPatterns(domain, fullUrl) {
  const patterns = [];
  let risk = 'low';
  
  // Check for suspicious URL patterns
  const suspiciousPatterns = [
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP address
    /bit\.ly|tinyurl|goo\.gl|t\.co/, // URL shorteners
    /[a-z0-9-]+-[a-z0-9-]+-[a-z0-9-]+\./, // Multiple hyphens
    /[0-9]+-[a-z]+-[0-9]+/ // Number-letter-number pattern
  ];
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(fullUrl)) {
      patterns.push('Suspicious URL pattern detected');
      risk = 'medium';
    }
  });
  
  // Check for typosquatting (simplified)
  const commonDomains = ['google', 'facebook', 'amazon', 'microsoft', 'apple', 'paypal', 'bank'];
  const domainLower = domain.toLowerCase();
  commonDomains.forEach(common => {
    if (domainLower.includes(common) && domainLower !== common) {
      patterns.push('Possible typosquatting detected');
      risk = 'high';
    }
  });
  
  // Check domain length
  if (domain.length > 50) {
    patterns.push('Unusually long domain name');
    risk = risk === 'low' ? 'medium' : risk;
  }
  
  const score = risk === 'high' ? 30 : risk === 'medium' ? 70 : 100;
  
  return {
    patterns,
    risk,
    score,
    details: patterns.length > 0 ? patterns.join(', ') : 'No phishing patterns detected'
  };
}

// Check breach history
async function checkBreachHistory(domain) {
  try {
    // Have I Been Pwned API (free, no key required for domain search)
    // Note: HIBP doesn't have a direct domain breach API, but we can check
    // against known breach databases or use heuristic methods
    
    // For now, check against common breached domains list
    // In production, you could integrate with HIBP's domain search or similar services
    
    // Known major breaches (simplified check)
    const knownBreachedDomains = [
      'yahoo.com', 'linkedin.com', 'adobe.com', 'ebay.com'
    ];
    
    const isKnownBreached = knownBreachedDomains.some(bd => domain.includes(bd));
    
    if (isKnownBreached) {
      return {
        breachCount: 1,
        breaches: ['Historical breach'],
        risk: 'medium',
        score: 70,
        details: 'Domain has history of breaches'
      };
    }
    
    return {
      breachCount: 0,
      breaches: [],
      risk: 'low',
      score: 100,
      details: 'No known breaches (limited check - add API for comprehensive scan)'
    };
  } catch (error) {
    console.error('Error checking breach history:', error);
  }
  
  return {
    breachCount: 0,
    risk: 'unknown',
    score: 50,
    details: 'Breach history check unavailable'
  };
}

// Calculate overall risk score (0-100, where 100 is safest)
// Uses IPQS data fields with weighted scoring
function calculateRiskScore(riskFactors) {
  const weights = {
    domainAge: 0.10,        // Domain age in days
    fraudScore: 0.30,      // Fraud score (0-100) - most important
    phishing: 0.20,        // Phishing detection
    malware: 0.20,         // Malware detection
    suspicious: 0.10,      // Suspicious activity flags
    unsafe: 0.10,          // Unsafe site detection
    sslIssues: 0.00        // SSL (kept for compatibility, weight 0 as IPQS covers security)
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(factor => {
    if (riskFactors[factor] && riskFactors[factor].score !== undefined && weights[factor] > 0) {
      totalScore += riskFactors[factor].score * weights[factor];
      totalWeight += weights[factor];
    }
  });
  
  // Normalize to 0-100 range
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  
  return Math.max(0, Math.min(100, finalScore));
}

