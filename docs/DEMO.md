# TrackPulse Hackathon Demo Script

## 10-Step Deterministic SIH26028 Live Presentation Scenario

### Step 1: Open Operations Hub (`/`)
- Show live telemetry bar at **Simulated Time 18:00 IST**.
- Point out **Active Monitored Trains (2,810)** across **8,990 Indian Railway stations**.
- Highlight **ML Delay Risk Model Metric: 0.9205 ROC-AUC** trained on Kaggle data with zero leakage.

---

### Step 2: Dynamic ETA vs Naive Static Additions (`/train/12675`)
- Show **Train 12675 (Kovai Express)** running with active delay $+18$ min at Katpadi Jn (KPD).
- Point out that **Dynamic ETA is calculated section-by-section** rather than adding $+18$ min to the end destination.
- Show the **Calibrated Uncertainty Bounds**:
  - $P_{10}$ (Optimistic): `14:18`
  - $P_{50}$ (Most Likely): `14:23`
  - $P_{90}$ (Conservative): `14:35`
- Highlight the **Measurable Reliability Score: 87%**.

---

### Step 3: Zero-Hallucination Reasoning Panel (`/train/12675`)
- Show the 4 structured evidence layers:
  1. `OBSERVED`: $+18$ min active delay recorded at KPD.
  2. `HISTORICAL`: Sectional speed curves and scheduled slack recovery capacity.
  3. `INFERRED`: Bottleneck accumulation index and remaining distance horizon.
  4. `NETWORK`: Downstream coupled rake turnaround link with Outgoing Train 12676.

---

### Step 4: Hub Operations & Turnaround Conflicts (`/station/MAS`)
- Open the Station Board for **Chennai Central (MAS)**.
- Show incoming trains (12675, 12007, 12622, 12842) vs outgoing trains (12676, 12008, 12674, 12840).
- Highlight the **Turnaround Shortfall Alert**:
  - Incoming Train 12675 predicted arrival leaves only **30 min** buffer.
  - Required minimum rake turnaround is **45 min**.
  - **Result**: $+15$ min shortfall propagated to Outgoing Train 12676.

---

### Step 5: What-If Delay Propagation Simulation (`/simulate`)
- Select **Train 12675**.
- Slide delay injection to **+30 min**.
- Click **"Recalculate"**.
- Show the cascading ripple:
  - Train 12675 arrival pushed from `18:38` to `19:08`.
  - Outgoing Train 12676 departure pushed from `18:50` to `19:20` (+30 min impact).
  - Outgoing Train 12674 departure pushed by +15 min due to shared platform pressure.
  - Passenger connection risk escalated to **HIGH**.

---

### Step 6: Multi-Criteria Passenger Journey Recommendation (`/passenger`)
- Search corridor: **Chennai (MAS) → Coimbatore (CBE)**.
- Toggle priorities: **"Fastest"** vs **"Highest Prediction Reliability"**.
- Observe dynamic re-ranking of Kovai Express, Shatabdi, and Cheran Superfast with composite utility scores ($0-100$).

---

### Step 7: Privacy-Preserving PNR Lookup (`/pnr`)
- Enter Demo PNR: `1234567890`.
- Verify PNR is displayed as **`******7890`** (masked in telemetry and server logs).
- Show passenger booking status, seat confirmation, and dynamic arrival ETA range.

---

### Step 8: Button-Phone / Feature-Phone SMS Experience (`/pnr`)
- On the interactive feature phone simulator, type `PNR 1234567890`.
- Click Send.
- Observe concise 160-character carrier SMS with dynamic ETA range, reliability %, and connection risk.

---

### Step 9: Interactive Movement Replay
- Click **"Play Replay"** on the telemetry bar.
- Switch speeds between $1\times, 2\times, 5\times, 10\times$.
- Watch live train markers traverse the high-density railway corridor on the interactive map.

---

### Step 10: Model Validation & Kaggle Notebooks
- Show the 7 reproducible Kaggle notebooks in `kaggle/` (`01` to `07`).
- Confirm zero feature leakage and rigorous chronological validation.
