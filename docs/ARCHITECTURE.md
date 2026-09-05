# TrackPulse System Architecture

## Overview
**TrackPulse** is a dynamic, uncertainty-aware railway Expected Time of Arrival (ETA) forecasting and multi-train delay propagation platform built for **SIH Problem Statement: SIH26028 (Ministry of Railways)**.

Instead of naive static sums ($\text{ETA} = \text{Scheduled Arrival} + \text{Current Delay}$), TrackPulse models the entire remaining journey:
$$\text{Dynamic ETA} = \text{Current Time} + \text{Remaining Section Runtimes} + \text{Stop Dwell Buffers} + \text{Coupled Turnaround Adjustments}$$

---

## High-Level Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          CANONICAL DATA & ML LAYER           │
                    │  - 8,990 Stations Master (Coordinates/Zones) │
                    │  - 2,810 Train Timetable Sequences           │
                    │  - 16,992 Precomputed Sectional Statistics   │
                    │  - LightGBM Delay Risk Model (Zero Leakage)   │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │              CORE ENGINE LAYER               │
                    │  - Dynamic ETA & Quantile Regressor          │
                    │  - Calibrated Reliability Engine (0-100%)    │
                    │  - Structured Evidence Reasoning (SHAP/Tele) │
                    │  - Delay Propagation & Turnaround Shortfalls │
                    │  - What-If Simulation Engine                 │
                    │  - Passenger Multi-Criteria Ranker           │
                    │  - Privacy-Preserving Masked PNR Adapter     │
                    │  - Feature-Phone SMS Telephony Formatter     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │             REST API ROUTE HANDLERS          │
                    │  GET  /api/trains/[id]/eta                   │
                    │  POST /api/network/analyze                   │
                    │  POST /api/recommend                         │
                    │  POST /api/simulate                          │
                    │  POST /api/pnr/status                        │
                    │  POST /api/sms/inbound                       │
                    │  GET  /api/replay                            │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │           NEXT.JS / REACT FRONTEND           │
                    │  /           Executive Operations Dashboard  │
                    │  /train/[id] Detailed Dynamic ETA & Timeline │
                    │  /station/[id] Junction Inbound/Outbound     │
                    │  /network    Corridor & Map Telemetry        │
                    │  /simulate   What-If Propagation Playground  │
                    │  /passenger  Multi-Factor Journey Planner    │
                    │  /pnr        Masked PNR & Phone SMS Sim      │
                    └──────────────────────────────────────────────┘
```

---

## Core Components
1. **Dynamic ETA Accumulator (`lib/eta/dynamic_eta_engine.ts`)**:
   - Accumulates $P_{10}$ (optimistic), $P_{50}$ (most likely), $P_{90}$ (conservative) remaining section runtimes.
   - Strictly enforces invariant: $P_{10} \le P_{50} \le P_{90}$.
   - Detects delay regimes: `NORMAL`, `DELAYED`, `DISRUPTED`.
   - Computes measurable reliability score ($0-100\%$) based on variance, interval spread, and remaining distance.

2. **Network Graph & Propagation Engine (`lib/propagation/propagation_engine.ts`)**:
   - Directs coupled relationships: `RAKE`, `CREW`, `PLATFORM`, `SCHEDULE`, `PASSENGER_CONNECTION`.
   - Calculates available turnaround vs required minimum turnaround.
   - Propagates delay shortfalls to downstream outgoing departures.

3. **Evidence-Based Reasoning Engine (`lib/reasoning/reasoning_engine.ts`)**:
   - Zero-hallucination attribution:
     - `OBSERVED`: Current live delay recorded at current station.
     - `HISTORICAL`: Sectional median speed curves and historical recovery tendencies.
     - `INFERRED`: Bottleneck accumulation and remaining distance horizon.
     - `NETWORK`: Turnaround shortfall on incoming rake.

4. **What-If Simulation Engine (`lib/simulation/simulation_engine.ts`)**:
   - Side-by-side baseline vs scenario comparison.
   - Ripple effect calculation across connected outgoing trains and passenger connections.

5. **Passenger Recommendation Ranker (`lib/recommendation/recommendation_engine.ts`)**:
   - Multi-criteria utility ranking based on arrival quality, reliability %, punctuality, connection safety, and user priority weights.

6. **Accessibility Adapters (`lib/pnr/pnr_provider.ts` & `lib/sms/sms_adapter.ts`)**:
   - Privacy-safe PNR lookup with logging sanitization (`******7890`).
   - Compact 160-character SMS engine for feature phones.
