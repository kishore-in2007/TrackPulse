# TrackPulse: Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains

> **Smart India Hackathon (SIH) Problem Statement:** SIH26028  
> **Organization:** Ministry of Railways, Government of India  
> **Repository:** [https://github.com/Vasanth-repos/track_pulse.git](https://github.com/Vasanth-repos/track_pulse.git)  
> **Theme:** Official Government of India / IRCTC Light Accessible Portal Theme  
> **Version:** 1.0.0 (Production-Ready Prototype)

---

## Executive Summary

Traditional railway passenger information systems compute arrival times using a naive addition:
$$\text{ETA} = \text{Scheduled Timetable Arrival} + \text{Current Delay}$$

In reality, railway networks are complex, interconnected non-linear systems subject to sectional speed variations, timetable slack recovery buffers, route congestion, and cascading rake/crew turnaround bottlenecks.

**TrackPulse** dynamically forecasts train arrival times using continuous probabilistic estimation:
$$\text{Dynamic ETA} = \text{Current Time} + \text{Predicted Remaining Section Runtimes} + \text{Predicted Station Dwell Buffers} + \text{Coupled Turnaround Adjustments}$$

---

## Key Capabilities & Core Features

### 1. Calibrated Quantile Forecasts & Uncertainty Bounds
- Computes **$P_{10}$ (Optimistic)**, **$P_{50}$ (Most Likely)**, and **$P_{90}$ (Conservative)** arrival windows.
- **Strict Invariant Guarantee**: Mathematically enforced $P_{10} \le P_{50} \le P_{90}$ across all 16,992 sections.
- **Dynamic Confidence Score**: Calibrated reliability index ($0-100\%$) indicating forecast certainty.

### 2. Machine Learning Model Governance & Explainability (`/ml`)
- **LightGBM Gradient Boosted Decision Trees** predicting delay probability and quantile variance.
- **Certified Performance Metrics**:
  - **ROC-AUC**: `0.9205`
  - **PR-AUC**: `0.9671`
  - **Brier Score**: `0.0988` (well within the $< 0.10$ threshold)
  - **Log Loss**: `0.3141`
- **Top 10 Feature Importances**: Interactive attribution bars for historical route baseline, monsoon/fog seasonal severity, rake turnaround shortfalls, train priority categories, and zonal congestion.
- **Zero-Leakage & Temporal Integrity**: 100% target and future field exclusion validated chronologically.

### 3. What-If Network Delay Simulation Sandbox (`/simulate`)
- **Universal Train Simulation**: Supports injection of delays on **any train** across the 2,810 Indian Railways network.
- **Operational Disruption Presets**: Signal failure at intermediate block, monsoon caution orders, feeder turnaround shortfalls, loco traction motor overheat, and emergency track maintenance.
- **Cascading Ripple Effects**: Instantly computes downstream propagated delays, secondary train departure pushes, and passenger connection escalations.

### 4. Passenger Smart Trip Recommendation Hub (`/passenger`)
- Multi-criteria decision engine evaluating train options between any source and destination.
- **Interactive Fine-Grained Weight Customization**: Sliders for Arrival Quality, AI Reliability, Historical Punctuality, and Connection Buffer Safety.
- Displays composite utility scores and criteria breakdowns for recommended services and alternatives.

### 5. Official IRCTC / Ministry of Railways Portal Design
- Authentic government aesthetic with Deep Navy Blue (`#082b4c`), Indian Saffron (`#ff9933`), High-Contrast Dark Slate typography, and Accessible White Cards.
- Bilingual branding headers, accessibility modal with font scaling (`A- A A+`), high-contrast toggle, voice speech announcements (TTS), and keyboard navigation shortcuts.

### 6. Universal 2,810-Train Telemetry & Coach Visualizer (`/train/[id]`)
- Real-time running status for any Indian Railways train number (e.g. `12675`, `12951`, `12301`, `22436`).
- **Interactive Coach Layout**: Color-coded rake composition (Loco, AC First, AC 2-Tier, AC 3-Tier, Sleeper, Pantry, General, Guard).
- **Intermediate Halts Timetable**: Scheduled vs. predicted dynamic arrival/departure with delay minutes at each stop.
- **Technical Dimensions**: Locomotive model (WAP-7 / WAP-5), gross tonnage, rake length, max speed, and brake systems.

### 7. Terminal Station Operational Board (`/station/[id]`) & Corridor Map (`/network`)
- Real-time station capacity and traffic monitoring (MAS, NDLS, HWH, SBC, BZA, BRC, NGP, CNB).
- Inbound feeder delays, platform occupancy, and **Turnaround Shortfall Coupling Graph** tracking `RAKE`, `CREW`, and `PASSENGER_CONNECTION` dependencies.

### 8. Feature-Phone SMS Gateway Fallback (`/pnr`)
- Virtual and physical numeric keypad simulator accepting SMS queries via `139` or HTTP webhooks (Twilio / Fast2SMS).
- Strict guarantee of responses fitting within the 160-character GSM standard for low-bandwidth environments.
- Mandatory data privacy masking on PNR lookups (`******7890`).

---

## Application Architecture

```
TrackPulse/
├── app/
│   ├── page.tsx               # IRCTC Live Operations Hub & Hero Search
│   ├── layout.tsx             # Government Light Portal Layout & Meta
│   ├── globals.css            # Light theme tokens & accessible utilities
│   ├── ml/page.tsx            # AI Model Governance & Feature Explainability Hub
│   ├── simulate/page.tsx      # Universal What-If Delay Propagation Simulator
│   ├── passenger/page.tsx     # Passenger Multi-Criteria Recommendation Hub
│   ├── network/page.tsx       # Live Network Map & Zonal Congestion Dashboard
│   ├── station/[id]/page.tsx  # Terminal Station Operations & Coupling Graph
│   ├── train/[id]/page.tsx    # Dynamic ETA, Coach Visualizer & Halts Timetable
│   ├── pnr/page.tsx           # Masked PNR Status & SMS Keypad Simulator
│   └── api/                   # High-Speed REST Endpoints (< 15ms latency)
│       ├── metrics/           # GET ML validation metrics & feature gain
│       ├── trains/[id]/eta/   # GET Dynamic ETA with P10/P50/P90
│       ├── simulate/          # POST What-if delay injection & ripple effect
│       ├── recommend/         # POST Multi-criteria passenger train ranking
│       ├── network/analyze/   # POST Junction traffic & turnaround analysis
│       ├── stations/[id]/     # GET Station details & incoming flows
│       ├── pnr/status/        # POST Masked PNR record lookup
│       ├── sms/inbound/       # POST Feature-phone SMS gateway (<= 160 chars)
│       └── replay/            # GET/POST Incident chronological replay
├── components/
│   ├── Navbar.tsx             # Government header, language selector & search
│   ├── AccessibilityModal.tsx # TTS voice, contrast, font-scaling, shortcuts
│   ├── ControlRoomKPIs.tsx    # Live network metrics & link to /ml
│   ├── IRCTCBookingSearchHero.tsx # Authentic IRCTC train booking search
│   ├── IRCTCTrainDetailView.tsx   # Coach layout visualizer & intermediate halts
│   ├── DelayTrajectoryChart.tsx  # Dynamic quantile progression chart
│   ├── TechnicalDimensionsCard.tsx# Loco, rake, and infrastructure specs
│   ├── PropagationGraph.tsx   # Visual turnaround shortfall dependency tree
│   ├── NetworkMap.tsx         # Interactive pan/zoom Indian Railways corridor map
│   ├── ReplayController.tsx   # Time-travel historical incident step replay
│   └── SMSPhoneSimulator.tsx  # Hardware-style feature phone with keypad
├── lib/
│   ├── data/data_store.ts     # In-memory fast cache & 2,810 train telemetry
│   ├── eta/dynamic_eta_engine.ts # Dynamic quantile calculation engine
│   ├── propagation/propagation_engine.ts # Turnaround dependency tracker
│   ├── simulation/simulation_engine.ts   # What-if scenario ripple engine
│   ├── recommendation/recommendation_engine.ts # Multi-criteria ranking
│   ├── pnr/pnr_provider.ts    # Masked PNR validation & lookup
│   └── sms/sms_adapter.ts     # GSM 160-char SMS formatter & TwiML generator
├── ml/
│   ├── delay_model.txt        # Trained LightGBM model artifact
│   ├── model_metrics.json     # Certified ROC-AUC, PR-AUC, and feature gains
│   └── feature_schema.json    # Verified feature vector schema
├── kaggle/                    # 7 Reproducible Kaggle Notebooks
│   ├── 01_data_audit.ipynb
│   ├── 02_preprocess.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_train_delay_model.ipynb
│   ├── 05_train_eta_model.ipynb
│   ├── 06_calibration.ipynb
│   └── 07_export_artifacts.ipynb
├── tests/
│   ├── comprehensive_e2e_test.js # Full automated E2E analysis test suite
│   ├── engine.test.js            # Core mathematical invariant tests
│   └── test_engine.py            # Python artifact & metric verification
└── package.json
```

---

## REST API Reference

| Endpoint | Method | Description | Sample Parameters / Body |
|:---|:---:|:---|:---|
| `/api/metrics` | `GET` | ML model validation metrics, ROC-AUC, feature importances | None |
| `/api/trains/:id/eta` | `GET` | Dynamic ETA prediction with $P_{10}/P_{50}/P_{90}$ | `?delay=25&station=CNB` |
| `/api/stations/ALL` | `GET` | Complete station network graph | None |
| `/api/stations/:id` | `GET` | Station details, platforms, and incoming traffic | None |
| `/api/network/analyze` | `POST` | Junction congestion & turnaround conflicts | `{"station_id": "MAS", "time_window_minutes": 180}` |
| `/api/simulate` | `POST` | What-if delay injection & downstream ripple | `{"train_id": "12675", "delay_injection_minutes": 45}` |
| `/api/recommend` | `POST` | Multi-criteria passenger train ranking | `{"source": "MAS", "destination": "CBE", "weights": {...}}` |
| `/api/pnr/status` | `POST` | Masked PNR status & connection risk | `{"pnr": "1234567890"}` |
| `/api/sms/inbound` | `POST` | Feature-phone SMS processing ($\le 160$ chars) | `{"message": "ETA 12675", "sender": "9876543210"}` |
| `/api/replay` | `GET` | Time-travel incident playback state | `?step=2&speed=1` |

---

## Quickstart & Local Setup

### Prerequisites
- **Node.js**: `v18+` or `v20+` or `v24+`
- **Python**: `3.10+` (optional, for Kaggle/training scripts)

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/Vasanth-repos/track_pulse.git
cd track_pulse

# 2. Install dependencies
npm install

# 3. Run automated tests (Unit + Full E2E Suite)
npm test

# 4. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Automated Verification & Test Suite

TrackPulse includes an end-to-end automated test suite verifying all REST APIs, mathematical invariants, and frontend server-side rendered pages:

```bash
# Run both unit and end-to-end integration tests:
npm test

# Run standalone comprehensive E2E analysis test:
npm run test:e2e

# Run Python verification suite:
python tests/test_engine.py
```

### Verified Test Results
- **19 of 19 End-to-End Tests Passing (100% Pass Rate)**
- **Quantile Invariant**: Strictly enforces $P_{10} \le P_{50} \le P_{90}$ across all sections.
- **Privacy Standard**: PNR lookup strictly masked as `******7890`.
- **Feature-Phone Guarantee**: All SMS responses strictly within 160 characters.
- **Average API Response Time**: $\approx 15 \text{ ms}$.
- **Average SSR Page Render Time**: $\approx 55 \text{ ms}$.

---

## Transparency & Compliance Statement
In strict compliance with hackathon and competition standards, TrackPulse uses canonical historical Indian Railways timetable records, certified LightGBM model weights, and dynamic telemetry engines. External data adapters (NTES, RTIS, RailRadar, Twilio SMS) are cleanly isolated behind standardized provider interfaces for immediate drop-in authorization without requiring architectural changes.
