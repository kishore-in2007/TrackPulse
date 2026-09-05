/**
 * TrackPulse Comprehensive End-to-End Analysis Test Suite
 * Evaluates APIs, Frontend Routes, Quantile Invariants, ML Performance & Network Propagation
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Accept': options.accept || 'application/json, text/html',
        ...(postData ? {
          'Content-Type': options.contentType || 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        } : {}),
        ...(options.headers || {})
      },
      timeout: 15000
    };

    const startTime = process.hrtime.bigint();
    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1e6;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json,
          durationMs
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after 15000ms: ${path}`));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

const results = {
  suite: 'TrackPulse End-to-End Analysis',
  timestamp: new Date().toISOString(),
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(category, name, passed, details = {}) {
  if (passed) {
    results.passed++;
    console.log(`  \x1b[32m✔\x1b[0m [${category}] ${name} (${details.durationMs ? details.durationMs.toFixed(1) + 'ms' : 'OK'})`);
  } else {
    results.failed++;
    console.error(`  \x1b[31m✖\x1b[0m [${category}] ${name}: ${details.error || `Assertion failed (status: ${details.status}, bytes: ${details.bytes})`}`);
  }
  results.tests.push({ category, name, passed, ...details });
}


async function runAnalysis() {
  console.log('======================================================================');
  console.log('  STARTING TRACKPULSE END-TO-END SYSTEM ANALYSIS TEST');
  console.log(`  Target: ${BASE_URL} | Time: ${new Date().toLocaleString()}`);
  console.log('======================================================================\n');

  // --- 1. CORE API SUITE ---
  console.log('1. Evaluating Core API Endpoints & Business Logic:');

  // 1.1 Metrics API
  try {
    const res = await fetchUrl('/api/metrics');
    const valid = res.status === 200 && res.json?.status === 'HEALTHY' && res.json?.metrics?.roc_auc > 0.85;
    recordTest('API', 'GET /api/metrics - Model Health & LightGBM ROC-AUC > 0.85', valid, {
      status: res.status,
      durationMs: res.durationMs,
      roc_auc: res.json?.metrics?.roc_auc,
      modelType: res.json?.model_type
    });
  } catch (err) {
    recordTest('API', 'GET /api/metrics', false, { error: err.message });
  }

  // 1.2 Dynamic Train ETA API
  try {
    const res = await fetchUrl('/api/trains/12675/eta?delay=25');
    const eta = res.json;
    const hasRemainingQuantiles = eta?.p10_remaining_minutes !== undefined && eta?.p50_remaining_minutes !== undefined && eta?.p90_remaining_minutes !== undefined;
    const invariantHold = hasRemainingQuantiles && (eta.p10_remaining_minutes <= eta.p50_remaining_minutes) && (eta.p50_remaining_minutes <= eta.p90_remaining_minutes);
    const valid = res.status === 200 && invariantHold && eta.status !== undefined;
    recordTest('API', 'GET /api/trains/12675/eta - Dynamic ETA & Strict Quantile Monotonicity (P10 <= P50 <= P90)', valid, {
      status: res.status,
      durationMs: res.durationMs,
      p10_min: eta?.p10_remaining_minutes,
      p50_min: eta?.p50_remaining_minutes,
      p90_min: eta?.p90_remaining_minutes,
      eta_p50: eta?.eta_p50,
      confidence: eta?.reliability
    });
  } catch (err) {
    recordTest('API', 'GET /api/trains/12675/eta', false, { error: err.message });
  }

  // 1.3 Stations API (All)
  try {
    const res = await fetchUrl('/api/stations/ALL');
    const stationCount = res.json ? Object.keys(res.json).length : 0;
    const valid = res.status === 200 && stationCount >= 50;
    recordTest('API', 'GET /api/stations/ALL - Comprehensive Station Network Graph (50+ Stations)', valid, {
      status: res.status,
      durationMs: res.durationMs,
      totalStationsMapped: stationCount
    });
  } catch (err) {
    recordTest('API', 'GET /api/stations/ALL', false, { error: err.message });
  }

  // 1.4 Single Station API (MAS)
  try {
    const res = await fetchUrl('/api/stations/MAS');
    const valid = res.status === 200 && res.json?.station?.station_code === 'MAS' && res.json?.traffic?.incoming?.length > 0;
    recordTest('API', 'GET /api/stations/MAS - Terminal Station Real-Time Traffic & Incoming Flow', valid, {
      status: res.status,
      durationMs: res.durationMs,
      stationName: res.json?.station?.station_name,
      incomingTrains: res.json?.traffic?.incoming?.length,
      outgoingTrains: res.json?.traffic?.outgoing?.length
    });
  } catch (err) {
    recordTest('API', 'GET /api/stations/MAS', false, { error: err.message });
  }

  // 1.5 PNR Status API (Valid)
  try {
    const res = await fetchUrl('/api/pnr/status', {
      method: 'POST',
      body: { pnr: '1234567890' }
    });
    const valid = res.status === 200 && res.json?.booking_status === 'CONFIRMED' && res.json?.masked_pnr === '******7890';
    recordTest('API', 'POST /api/pnr/status - Valid PNR Status with Mandatory Privacy Masking', valid, {
      status: res.status,
      durationMs: res.durationMs,
      train: res.json?.train_name,
      coach: res.json?.coach,
      maskedPnr: res.json?.masked_pnr
    });
  } catch (err) {
    recordTest('API', 'POST /api/pnr/status (Valid)', false, { error: err.message });
  }

  // 1.6 PNR Status API (404 Handling)
  try {
    const res = await fetchUrl('/api/pnr/status', {
      method: 'POST',
      body: { pnr: '0000000000' }
    });
    recordTest('API', 'POST /api/pnr/status - Non-existent PNR Returns 404 Gracefully', res.status === 404, {
      status: res.status,
      durationMs: res.durationMs,
      errorMsg: res.json?.message
    });
  } catch (err) {
    recordTest('API', 'POST /api/pnr/status (404)', false, { error: err.message });
  }

  // 1.7 What-If Simulator API
  try {
    const res = await fetchUrl('/api/simulate', {
      method: 'POST',
      body: {
        train_id: '12675',
        delay_injection_minutes: 45
      }
    });
    const valid = res.status === 200 && res.json?.primary_diff?.delay_impact_min === 45 && res.json?.network_ripple_effect !== undefined;
    recordTest('API', 'POST /api/simulate - Dispatcher What-If Injected Delay & Impact Calculation', valid, {
      status: res.status,
      durationMs: res.durationMs,
      rippleEffect: res.json?.network_ripple_effect,
      injectedDelayMin: res.json?.primary_diff?.delay_impact_min,
      scenarioArrival: res.json?.primary_diff?.scenario_arrival
    });
  } catch (err) {
    recordTest('API', 'POST /api/simulate', false, { error: err.message });
  }

  // 1.8 Passenger Multi-Criteria Recommendation API
  try {
    const res = await fetchUrl('/api/recommend', {
      method: 'POST',
      body: {
        source: 'MAS',
        destination: 'CBE'
      }
    });
    const valid = res.status === 200 && res.json?.recommended_train?.train_name && Array.isArray(res.json?.alternatives);
    recordTest('API', 'POST /api/recommend - Multi-Criteria Utility Optimization & Alternatives Ranking', valid, {
      status: res.status,
      durationMs: res.durationMs,
      topRecommended: res.json?.recommended_train?.train_name,
      compositeScore: res.json?.recommended_train?.composite_score,
      alternativesCount: res.json?.alternatives?.length
    });
  } catch (err) {
    recordTest('API', 'POST /api/recommend', false, { error: err.message });
  }

  // 1.9 Network Analysis API
  try {
    const res = await fetchUrl('/api/network/analyze', {
      method: 'POST',
      body: {
        station_id: 'MAS',
        time_window_minutes: 120
      }
    });
    const valid = res.status === 200 && res.json?.summary?.congestion_risk !== undefined && Array.isArray(res.json?.incoming);
    recordTest('API', 'POST /api/network/analyze - Junction Network Congestion & Turnaround Analysis', valid, {
      status: res.status,
      durationMs: res.durationMs,
      congestionRisk: res.json?.summary?.congestion_risk,
      avgIncomingDelay: res.json?.summary?.avg_incoming_delay
    });
  } catch (err) {
    recordTest('API', 'POST /api/network/analyze', false, { error: err.message });
  }

  // 1.10 Inbound SMS Gateway API (JSON & TwiML)
  try {
    const res = await fetchUrl('/api/sms/inbound', {
      method: 'POST',
      body: {
        message: 'ETA 12675',
        sender: '919876543210'
      }
    });
    const valid = res.status === 200 && res.json?.sms_text && res.json.sms_text.length <= 160;
    recordTest('API', 'POST /api/sms/inbound - Feature-Phone SMS Fallback (< 160 Chars Guarantee)', valid, {
      status: res.status,
      durationMs: res.durationMs,
      smsLength: res.json?.sms_text?.length,
      smsSample: res.json?.sms_text
    });
  } catch (err) {
    recordTest('API', 'POST /api/sms/inbound', false, { error: err.message });
  }

  // 1.11 Replay State API
  try {
    const res = await fetchUrl('/api/replay?step=2');
    const valid = res.status === 200 && res.json?.current_step === 2 && Array.isArray(res.json?.active_trains);
    recordTest('API', 'GET /api/replay - Historical Incident Step-by-Step Replay Engine', valid, {
      status: res.status,
      durationMs: res.durationMs,
      activeTrains: res.json?.active_trains?.length,
      currentStep: res.json?.current_step,
      simulatedTime: res.json?.simulated_time
    });
  } catch (err) {
    recordTest('API', 'GET /api/replay', false, { error: err.message });
  }

  // --- 2. FRONTEND PAGE RENDERING SUITE ---
  console.log('\n2. Evaluating Frontend Page SSR & Status 200:');
  const pages = [
    { path: '/', label: 'IRCTC Home & Live Telemetry Dashboard' },
    { path: '/train/12675', label: 'Train Detail, Coach Visualizer & Intermediate Halts' },
    { path: '/pnr', label: 'PNR Status & Journey Tracker' },
    { path: '/passenger', label: 'Passenger Smart Trip Recommendation Hub' },
    { path: '/simulate', label: 'Dispatcher What-If Scenario Sandbox' },
    { path: '/network', label: 'Corridor Congestion & Platform Occupancy Map' },
    { path: '/station/MAS', label: 'Station Operational Terminal (MAS)' },
    { path: '/ml', label: 'Machine Learning Intelligence & Feature Explainability' }
  ];

  for (const page of pages) {
    try {
      const res = await fetchUrl(page.path, { accept: 'text/html' });
      const valid = res.status === 200 && res.data.length > 500 && (res.data.includes('<!DOCTYPE html>') || res.data.includes('<html'));
      recordTest('PAGE', `${page.path} - ${page.label}`, valid, {
        status: res.status,
        durationMs: res.durationMs,
        bytes: res.data.length
      });
    } catch (err) {
      recordTest('PAGE', `${page.path} - ${page.label}`, false, { error: err.message });
    }
  }

  // --- 3. SUMMARY & METRICS ---
  console.log('\n======================================================================');
  console.log(`  TEST RESULTS: ${results.passed} PASSED / ${results.failed} FAILED (TOTAL: ${results.tests.length})`);
  console.log('======================================================================');

  const avgApiLatency = results.tests
    .filter(t => t.category === 'API' && t.durationMs)
    .reduce((acc, t, _, arr) => acc + t.durationMs / arr.length, 0);

  const avgPageLatency = results.tests
    .filter(t => t.category === 'PAGE' && t.durationMs)
    .reduce((acc, t, _, arr) => acc + t.durationMs / arr.length, 0);

  console.log(`  Avg API Response Time:  ${avgApiLatency.toFixed(1)} ms`);
  console.log(`  Avg Page Render Time:   ${avgPageLatency.toFixed(1)} ms`);
  console.log('======================================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAnalysis().catch(err => {
  console.error('Fatal testing error:', err);
  process.exit(1);
});
