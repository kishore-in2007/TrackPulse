# TrackPulse: Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains

> **Smart India Hackathon (SIH) Problem Statement:** SIH26028  
> **Organization:** Ministry of Railways  
> **Project Version:** 1.0.0 (Production Prototype)

---

## Executive Summary
Traditional railway journey information systems estimate arrival times using a naive addition:
$$\text{ETA} = \text{Scheduled Arrival Time} + \text{Current Delay}$$
In practice, railway networks are dynamic, interconnected systems subject to section speed variations, slack recovery buffers, and cascading rake/crew turnaround bottlenecks.

**TrackPulse** dynamically forecasts train arrival times using:
$$\text{Dynamic ETA} = \text{Current Time} + \text{Predicted Remaining Section Runtimes} + \text{Predicted Station Dwell Buffers} + \text{Coupled Turnaround Adjustments}$$

TrackPulse delivers:
1. **Calibrated Quantile Forecasts**: $P_{10}$ (Optimistic), $P_{50}$ (Most Likely), $P_{90}$ (Conservative) strictly enforcing $P_{10} \le P_{50} \le P_{90}$.
2. **Measurable Prediction Reliability Score**: $0-100\%$ calibrated confidence.
3. **Delay Regimes**: `NORMAL`, `DELAYED`, `DISRUPTED`.
4. **Zero-Hallucination Evidence Attribution**: `OBSERVED`, `HISTORICAL`, `INFERRED`, `NETWORK`.
5. **Multi-Train Delay Propagation**: Network graph capturing `RAKE`, `CREW`, `PLATFORM`, and `PASSENGER_CONNECTION` turnaround shortfalls.
6. **What-If Simulation Engine**: Interactive operational disruption playground with baseline vs. scenario diffs.
7. **Passenger Recommendation Engine**: Multi-criteria utility ranking with customizable preference weights.
8. **Accessibility**: Masked PNR lookup (`******7890`) and 160-character button-phone carrier SMS formatting.

---

## Machine Learning & Delay Intelligence
- **Model A (Delay Risk Classifier)**: `LightGBMClassifier` predicting $P(\text{delay} > 15\text{ min})$.
  - **Zero Leakage**: All future and target-derived fields (`primary_delay_cause`, `delay_minutes`, `actual_arrival`) strictly excluded.
  - **Chronological Validation**: Evaluated on unseen subsequent operating years.
  - **Metrics**:
    - **ROC-AUC**: `0.9205`
    - **PR-AUC**: `0.9671`
    - **Brier Score**: `0.0988`
    - **LogLoss**: `0.3141`
- **Model B (Dynamic Sectional ETA)**: Section-by-section remaining journey accumulator utilizing 16,992 route section distributions.

---

## Project Structure
```
├── app/
│   ├── page.tsx               # Executive Operations Hub
│   ├── layout.tsx             # Theme layout & global styling
│   ├── globals.css            # Tailwind & glassmorphism CSS
│   ├── passenger/page.tsx     # Passenger Multi-Criteria Planner
│   ├── train/[id]/page.tsx    # Detailed Dynamic ETA & Sectional Timeline
│   ├── station/[id]/page.tsx  # Station Operations Board
│   ├── network/page.tsx       # Network Telemetry & Zonal Congestion
│   ├── simulate/page.tsx      # What-If Delay Propagation Simulator
│   ├── pnr/page.tsx           # PNR Lookup & Button-Phone SMS Simulator
│   └── api/                   # REST Route Handlers
│       ├── trains/[id]/eta/   # GET Dynamic ETA with P10/P50/P90
│       ├── network/analyze/   # POST Multi-train station analysis
│       ├── recommend/         # POST Passenger train recommendations
│       ├── simulate/          # POST What-if delay injection
│       ├── pnr/status/        # POST Masked PNR journey lookup
│       ├── sms/inbound/       # POST Feature-phone SMS simulator
│       ├── replay/            # GET/POST Telemetry replay
│       └── metrics/           # GET ML validation metrics
├── components/
│   ├── Navbar.tsx
│   ├── ETACard.tsx
│   ├── ReasoningPanel.tsx
│   ├── TrainTimeline.tsx
│   ├── PropagationGraph.tsx
│   ├── SMSPhoneSimulator.tsx
│   ├── ReplayController.tsx
│   └── NetworkMap.tsx
├── lib/
│   ├── data/data_store.ts     # In-memory fast cache & data access
│   ├── eta/dynamic_eta_engine.ts
│   ├── propagation/propagation_engine.ts
│   ├── simulation/simulation_engine.ts
│   ├── recommendation/recommendation_engine.ts
│   ├── pnr/pnr_provider.ts
│   └── sms/sms_adapter.ts
├── kaggle/                    # 7 Reproducible Kaggle Notebooks
│   ├── 01_data_audit.ipynb
│   ├── 02_preprocess.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_train_delay_model.ipynb
│   ├── 05_train_eta_model.ipynb
│   ├── 06_calibration.ipynb
│   └── 07_export_artifacts.ipynb
├── tests/
│   ├── engine.test.js         # Node.js engine unit tests
│   └── test_engine.py         # Python artifact validation suite
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ML.md
│   ├── DATA.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEMO.md
└── package.json
```

---

## Local Setup & Quickstart

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- Python `3.10+` or `3.11+`

### Installation
```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python ML dependencies
pip install -r requirements.txt # (or pip install pandas numpy scikit-learn lightgbm joblib nbformat)

# 3. Preprocess canonical datasets & train LightGBM model
python scripts/preprocess_data.py
python ml/train_models.py
python scripts/generate_kaggle_notebooks.py

# 4. Run automated test suites
npm test
python tests/test_engine.py

# 5. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Vercel
1. Push this repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com).
3. Build command: `npm run build`.
4. The production build bundles lightweight precomputed artifacts (`< 15MB`) and excludes heavy raw datasets.

---

## Transparency & Honesty Rule
- In compliance with competition guidelines, TrackPulse prototype uses canonical historical railway records, calibrated LightGBM weights, and high-fidelity movement replay.
- Live RTIS and live CRIS/PNR adapters are isolated behind clean provider interfaces (`MockPNRProvider`, `ReplayTrainMovementProvider`), ready for plug-and-play authorization without architectural rework.
