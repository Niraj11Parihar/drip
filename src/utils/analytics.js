// BRUINE & BEE Centralized Analytics Engine

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generate or retrieve anonymous visitor ID
export function getVisitorId() {
  let id = localStorage.getItem('bb_visitor_id');
  if (!id) {
    id = 'vis_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('bb_visitor_id', id);
  }
  return id;
}

// Get UTM attribution parameters
export function getUtmParams() {
  const stored = localStorage.getItem('bb_utm_params');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: urlParams.get('utm_source') || null,
    utm_medium: urlParams.get('utm_medium') || null,
    utm_campaign: urlParams.get('utm_campaign') || null,
    utm_content: urlParams.get('utm_content') || null,
    utm_term: urlParams.get('utm_term') || null,
    referrer: document.referrer || 'Direct',
    landing_page: window.location.pathname
  };

  // Only store if at least one UTM present or fallback to Direct
  localStorage.setItem('bb_utm_params', JSON.stringify(utm));
  return utm;
}

// Check Analytics Consent state
export function hasAnalyticsConsent() {
  const consent = localStorage.getItem('bb_cookie_consent');
  if (!consent) return false;
  try {
    const parsed = JSON.parse(consent);
    return Boolean(parsed.analytics);
  } catch (e) {
    return false;
  }
}

// Core event tracking function
export function trackEvent(eventName, payload = {}) {
  // Always allow essential functional events like cookie consent recording
  const isEssentialEvent = ['cookie_banner_view', 'analytics_accept', 'analytics_reject', 'cookie_preferences_updated'].includes(eventName);
  
  if (!isEssentialEvent && !hasAnalyticsConsent()) {
    // Analytics consent not given yet
    return;
  }

  const visitorId = getVisitorId();
  const utm = getUtmParams();

  const eventData = {
    anonymousVisitorId: visitorId,
    eventName,
    payload,
    utmSource: utm.utm_source,
    utmMedium: utm.utm_medium,
    utmCampaign: utm.utm_campaign,
    pageUrl: window.location.href,
    timestamp: new Date().toISOString()
  };

  // 1. Send to Backend API
  fetch(`${API_BASE}/api/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  }).catch(() => {});

  // 2. PostHog integration hook if initialized
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, payload);
  }

  // 3. GA4 integration hook if initialized
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
}

// Setup active engagement time tracker
export function initEngagementTracking() {
  let activeTime = 0;
  let timer = null;
  const milestonesTriggered = new Set();

  const milestones = [15, 30, 60, 120, 300];

  function startTimer() {
    if (!timer) {
      timer = setInterval(() => {
        if (!document.hidden) {
          activeTime += 1;
          milestones.forEach(m => {
            if (activeTime >= m && !milestonesTriggered.has(m)) {
              milestonesTriggered.add(m);
              trackEvent(`engaged_${m}_seconds`, { activeTime });
            }
          });
        }
      }, 1000);
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  startTimer();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });
}

// Setup scroll depth tracker
export function initScrollTracking() {
  const depthsTriggered = new Set();
  const thresholds = [25, 50, 75, 90, 100];

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    thresholds.forEach(t => {
      if (scrollPercent >= t && !depthsTriggered.has(t)) {
        depthsTriggered.add(t);
        trackEvent(`scroll_${t}`, { scrollPercent: t });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}
