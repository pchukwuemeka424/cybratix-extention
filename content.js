// Content script to inject risk score UI
// Developed by: Prince Chukwuemeka
// Email: pchukwuemeka424@gmail.com

let riskBadge = null;
let riskData = null;

// Listen for risk data from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RISK_DATA') {
    riskData = message.data;
    displayRiskBadge(riskData);
  }
});

// Display risk badge on the page
function displayRiskBadge(data) {
  // Remove existing badge if any
  if (riskBadge) {
    riskBadge.remove();
  }

  // Skip if on chrome:// or extension pages
  if (window.location.protocol === 'chrome:' || window.location.protocol === 'chrome-extension:') {
    return;
  }

  // Create risk badge
  riskBadge = document.createElement('div');
  riskBadge.id = 'risk-score-badge';
  riskBadge.className = 'risk-badge';

  const score = data.riskScore;
  const riskLevel = getRiskLevel(score);
  const riskColor = getRiskColor(score);

  riskBadge.innerHTML = `
    <div class="risk-badge-header">
      <span class="risk-badge-icon">🛡️</span>
      <span class="risk-badge-title">Cybratix</span>
      <button class="risk-badge-close" id="risk-badge-close">×</button>
    </div>
    <div class="risk-badge-content">
      <div class="risk-score-circle" style="border-color: ${riskColor}">
        <div class="risk-score-number" style="color: ${riskColor}">${score}</div>
        <div class="risk-score-label">${riskLevel}</div>
      </div>
      <div class="risk-factors">
        <div class="risk-factor">
          <span class="risk-factor-label">Domain Age:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.domainAge?.risk)}">
            ${formatDomainAge(data.riskFactors.domainAge)}
          </span>
        </div>
        <div class="risk-factor">
          <span class="risk-factor-label">Fraud Score:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.fraudScore?.risk)}">
            ${formatFraudScore(data.riskFactors.fraudScore)}
          </span>
        </div>
        <div class="risk-factor">
          <span class="risk-factor-label">Phishing:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.phishing?.risk)}">
            ${formatPhishing(data.riskFactors.phishing)}
          </span>
        </div>
        <div class="risk-factor">
          <span class="risk-factor-label">Malware:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.malware?.risk)}">
            ${formatMalware(data.riskFactors.malware)}
          </span>
        </div>
        <div class="risk-factor">
          <span class="risk-factor-label">Suspicious Activity:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.suspicious?.risk)}">
            ${formatSuspicious(data.riskFactors.suspicious)}
          </span>
        </div>
        <div class="risk-factor">
          <span class="risk-factor-label">Site Safety:</span>
          <span class="risk-factor-value ${getRiskClass(data.riskFactors.unsafe?.risk)}">
            ${formatUnsafe(data.riskFactors.unsafe)}
          </span>
        </div>
      </div>
      <div class="risk-warning" id="risk-warning" style="display: ${score < 50 ? 'block' : 'none'}">
        ⚠️ Warning: This website has a low risk score. Be cautious when entering personal information.
      </div>
    </div>
  `;

  // Add to page
  document.body.appendChild(riskBadge);

  // Close button handler
  const closeBtn = riskBadge.querySelector('#risk-badge-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      riskBadge.remove();
    });
  }

  // Make badge draggable
  makeDraggable(riskBadge);
}

// Get risk level text
function getRiskLevel(score) {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Caution';
  return 'High Risk';
}

// Get risk color
function getRiskColor(score) {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

// Get risk class for styling
function getRiskClass(risk) {
  if (!risk) return '';
  return `risk-${risk}`;
}

// Format domain age in days
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

// Format fraud score (0-100)
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

// Format phishing detection
function formatPhishing(phishing) {
  if (!phishing || phishing.detected === undefined) return 'Unknown';
  return phishing.detected ? '⚠️ Detected' : '✓ Safe';
}

// Format malware detection
function formatMalware(malware) {
  if (!malware || malware.detected === undefined) return 'Unknown';
  return malware.detected ? '⚠️ Detected' : '✓ Clean';
}

// Format suspicious activity
function formatSuspicious(suspicious) {
  if (!suspicious || suspicious.flagged === undefined) return 'Unknown';
  return suspicious.flagged ? '⚠️ Flagged' : '✓ Normal';
}

// Format unsafe site detection
function formatUnsafe(unsafe) {
  if (!unsafe || unsafe.unsafe === undefined) return 'Unknown';
  return unsafe.unsafe ? '⚠️ Unsafe' : '✓ Safe';
}

// Make badge draggable
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  const dragStart = (e) => {
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === element || element.contains(e.target)) {
      isDragging = true;
    }
  };

  const dragEnd = () => {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  };

  const drag = (e) => {
    if (isDragging) {
      e.preventDefault();
      
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, element);
    }
  };

  const setTranslate = (xPos, yPos, el) => {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  };

  element.addEventListener('mousedown', dragStart);
  element.addEventListener('touchstart', dragStart);
  element.addEventListener('mouseup', dragEnd);
  element.addEventListener('touchend', dragEnd);
  element.addEventListener('mousemove', drag);
  element.addEventListener('touchmove', drag);
}


