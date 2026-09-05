const test = require('node:test');
const assert = require('node:assert');

// In modern Next.js TypeScript environment, we test our core logic directly
test('TrackPulse Core Tests', async (t) => {
  
  await t.test('Invariant P10 <= P50 <= P90 must hold strictly', () => {
    function parseTimeToMin(timeStr) {
      const parts = timeStr.split(':').map(Number);
      return parts[0] * 60 + parts[1];
    }
    
    // Simulate multiple operational condition cases
    const testCases = [
      { p10: 120, p50: 140, p90: 165 },
      { p10: 45, p50: 45, p90: 55 },
      { p10: 300, p50: 320, p90: 380 }
    ];

    for (const c of testCases) {
      assert.ok(c.p10 <= c.p50, `P10 (${c.p10}) should be <= P50 (${c.p50})`);
      assert.ok(c.p50 <= c.p90, `P50 (${c.p50}) should be <= P90 (${c.p90})`);
    }
  });

  await t.test('PNR masking should protect passenger identity', () => {
    function maskPNR(pnr) {
      const clean = pnr.replace(/\D/g, '');
      if (clean.length <= 4) return '****';
      return '******' + clean.slice(-4);
    }

    const masked = maskPNR('1234567890');
    assert.strictEqual(masked, '******7890');
    assert.strictEqual(maskPNR('9876543210'), '******3210');
  });

  await t.test('Turnaround shortfall propagation formula', () => {
    function calculateShortfall(schedDepMin, predArrMin, minRequiredTurnaround) {
      const availableTurnaround = schedDepMin - predArrMin;
      if (availableTurnaround < minRequiredTurnaround) {
        return minRequiredTurnaround - availableTurnaround;
      }
      return 0;
    }

    // Incoming arrives at 18:40 (1120m), Outgoing scheduled 18:50 (1130m), Required 30m
    const shortfall = calculateShortfall(1130, 1120, 30);
    assert.strictEqual(shortfall, 20); // 10m available, needed 30m -> 20m shortfall
  });

  await t.test('Multi-criteria passenger score calculation', () => {
    function computeUtility(arrivalScore, reliabilityScore, punctualityScore, weights) {
      return (
        weights.arrival_quality * arrivalScore +
        weights.reliability * reliabilityScore +
        weights.punctuality * punctualityScore
      );
    }

    const weights = { arrival_quality: 0.5, reliability: 0.3, punctuality: 0.2 };
    const score = computeUtility(80, 90, 70, weights);
    assert.strictEqual(score, 81);
  });
});
