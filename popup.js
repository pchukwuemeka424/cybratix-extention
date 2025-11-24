// Popup script

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.url) {
    const urlElement = document.getElementById('current-url');
    let domain = 'N/A';
    
    try {
      const url = new URL(tab.url);
      domain = url.hostname;
      urlElement.textContent = domain;
      
      // Skip chrome:// and extension pages
      if (url.protocol.startsWith('http')) {
        await loadRiskScore(domain, tab.url, tab.id);
      } else {
        showNoScore();
      }
    } catch {
      urlElement.textContent = tab.url;
      showNoScore();
    }
  } else {
    document.getElementById('current-url').textContent = 'N/A';
    showNoScore();
  }
});

async function loadRiskScore(domain, fullUrl, tabId) {
  try {
    // Check cache first
    const cacheKey = `risk_${domain}`;
    const cached = await chrome.storage.local.get([cacheKey]);
    
    let riskData = null;
    
    if (cached[cacheKey] && Date.now() - cached[cacheKey].timestamp < 3600000) {
      // Use cached data if less than 1 hour old
      riskData = cached[cacheKey].data;
      displayRiskScore(riskData);
    } else {
      // Show loading state
      showLoading();
      
      // Request analysis from background script
      chrome.runtime.sendMessage({
        type: 'ANALYZE_URL',
        url: fullUrl,
        tabId: tabId
      }, async (response) => {
        if (response && response.riskData) {
          displayRiskScore(response.riskData);
        } else {
          // Try to get from cache again after a short delay
          setTimeout(async () => {
            const updatedCache = await chrome.storage.local.get([cacheKey]);
            if (updatedCache[cacheKey]) {
              displayRiskScore(updatedCache[cacheKey].data);
            } else {
              showNoScore();
            }
          }, 2000);
        }
      });
    }
  } catch (error) {
    console.error('Error loading risk score:', error);
    showNoScore();
  }
}

function displayRiskScore(data) {
  const score = data.riskScore;
  const riskLevel = getRiskLevel(score);
  const riskColor = getRiskColor(score);
  
  // Update score display
  const scoreElement = document.getElementById('risk-score');
  const levelElement = document.getElementById('risk-level');
  const scoreSection = document.getElementById('risk-score-section');
  
  if (scoreElement) {
    scoreElement.textContent = score;
    scoreElement.style.color = riskColor;
  }
  
  if (levelElement) {
    levelElement.textContent = riskLevel;
    levelElement.style.color = riskColor;
  }
  
  if (scoreSection) {
    scoreSection.style.borderColor = riskColor;
    scoreSection.style.display = 'block';
  }
  
  // Hide loading
  const loadingElement = document.getElementById('loading-score');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Show risk factors
  displayRiskFactors(data.riskFactors);
}

function displayRiskFactors(factors) {
  const factorsList = document.getElementById('risk-factors-list');
  if (!factorsList) return;
  
  factorsList.innerHTML = '';
  factorsList.style.display = 'block';
  
  const factorItems = [
    { label: 'Domain Age', factor: factors.domainAge, formatter: formatDomainAge },
    { label: 'Fraud Score', factor: factors.fraudScore, formatter: formatFraudScore },
    { label: 'Phishing', factor: factors.phishing, formatter: formatPhishing },
    { label: 'Malware', factor: factors.malware, formatter: formatMalware },
    { label: 'Suspicious Activity', factor: factors.suspicious, formatter: formatSuspicious },
    { label: 'Site Safety', factor: factors.unsafe, formatter: formatUnsafe }
  ];
  
  factorItems.forEach(({ label, factor, formatter }) => {
    if (factor) {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 8px 0; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;';
      const riskClass = getRiskClass(factor.risk);
      li.innerHTML = `
        <span class="factor-label">${label}:</span>
        <span class="factor-value ${riskClass}">${formatter(factor)}</span>
      `;
      factorsList.appendChild(li);
    }
  });
}

function showLoading() {
  const loadingElement = document.getElementById('loading-score');
  const scoreSection = document.getElementById('risk-score-section');
  
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
  
  if (scoreSection) {
    scoreSection.style.display = 'block';
  }
}

function showNoScore() {
  const scoreSection = document.getElementById('risk-score-section');
  const loadingElement = document.getElementById('loading-score');
  
  if (scoreSection) {
    scoreSection.style.display = 'none';
  }
  
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

function getRiskLevel(score) {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Caution';
  return 'High Risk';
}

function getRiskColor(score) {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

function getRiskClass(risk) {
  if (!risk) return 'risk-unknown';
  return `risk-${risk}`;
}

function formatDomainAge(domainAge) {
  if (!domainAge || domainAge.ageInDays === null || domainAge.ageInDays === undefined) {
    return 'Unknown';
  }
  
  const days = Number(domainAge.ageInDays);
  
  // Check if days is a valid number
  if (isNaN(days) || days < 0) {
    return 'Unknown';
  }
  
  // Less than 1 year = Unhealthy, 1 year or more = Healthy
  if (days < 365) {
    const months = Math.floor(days / 30);
    const daysRemainder = Math.floor(days % 30);
    if (months > 0) {
      return `${months} month${months !== 1 ? 's' : ''} ${daysRemainder > 0 ? daysRemainder + ' day' + (daysRemainder !== 1 ? 's' : '') : ''} - Unhealthy`;
    }
    return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''} - Unhealthy`;
  }
  
  const years = Math.floor(days / 365);
  const remainingDays = Math.floor(days % 365);
  const months = Math.floor(remainingDays / 30);
  
  if (years > 0) {
    if (months > 0) {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''} - Healthy`;
    }
    return `${years} year${years !== 1 ? 's' : ''} - Healthy`;
  }
  
  return 'Healthy';
}

function formatFraudScore(fraudScore) {
  if (!fraudScore || fraudScore.fraudScore === null || fraudScore.fraudScore === undefined) {
    return 'Unknown';
  }
  
  const score = Number(fraudScore.fraudScore);
  
  // Check if score is a valid number
  if (isNaN(score) || score < 0 || score > 100) {
    return 'Unknown';
  }
  
  const roundedScore = Math.round(score);
  if (roundedScore >= 76) return `${roundedScore}/100 (Very High Risk)`;
  if (roundedScore >= 51) return `${roundedScore}/100 (High Risk)`;
  if (roundedScore >= 26) return `${roundedScore}/100 (Medium Risk)`;
  return `${roundedScore}/100 (Low Risk)`;
}

function formatPhishing(phishing) {
  if (!phishing || phishing.detected === undefined) return 'Unknown';
  return phishing.detected ? '⚠️ Detected' : '✓ Safe';
}

function formatMalware(malware) {
  if (!malware || malware.detected === undefined) return 'Unknown';
  return malware.detected ? '⚠️ Detected' : '✓ Clean';
}

function formatSuspicious(suspicious) {
  if (!suspicious || suspicious.flagged === undefined) return 'Unknown';
  return suspicious.flagged ? '⚠️ Flagged' : '✓ Normal';
}

function formatUnsafe(unsafe) {
  if (!unsafe || unsafe.unsafe === undefined) return 'Unknown';
  return unsafe.unsafe ? '⚠️ Unsafe' : '✓ Safe';
}

