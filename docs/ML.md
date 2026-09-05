# Machine Learning & Delay Intelligence

## ML Model Architecture
TrackPulse uses a decoupled, leakage-safe machine learning architecture:

### 1. Delay Risk Model (Model A)
- **Algorithm**: `LightGBMClassifier`
- **Target**: `is_delayed` ($P(\text{delay} > 15\text{ minutes})$)
- **Leakage Prevention**: Strictly excludes `primary_delay_cause`, `delay_minutes`, `actual_arrival`, `future_delay`, `journey_id`.
- **Validation**: Chronological / Temporal Split across train operating years (2018–2023 for train, 2024 for validation).
- **Performance Metrics**:
  - **ROC-AUC**: `0.9205`
  - **PR-AUC**: `0.9671`
  - **Brier Score**: `0.0988`
  - **LogLoss**: `0.3141`
- **Top Predictive Features**:
  1. `route_historical_ontime_pct`
  2. `season_severity_score`
  3. `late_incoming_rake`
  4. `train_type`
  5. `season`
  6. `track_doubled`
  7. `is_monsoon_season`
  8. `zone_congestion_index`
  9. `loco_age_years`
  10. `month`

---

### 2. Dynamic Hybrid & Quantile ETA Engine (Model B)
- Calculates point-in-time remaining section runtimes:
  $$\text{Section Runtime}_{P_{50}} = \text{Median Historical Running Time} - \text{Scheduled Slack Recovery}$$
  $$\text{Section Runtime}_{P_{10}} = P_{50} - 1.3 \cdot \sigma_{\text{section}}$$
  $$\text{Section Runtime}_{P_{90}} = P_{90} + \text{Regime Variance}$$
- **Strict Invariant**: $P_{10} \le P_{50} \le P_{90}$ is mathematically guaranteed across all journeys.

---

### 3. Calibrated Reliability Scoring
- Dynamic reliability score ($0.00$ to $1.00$ / $0-100\%$) derived from:
  - Spread of confidence interval ($P_{90} - P_{10}$)
  - Remaining distance horizon
  - Current delay magnitude and stability
  - Operating regime (`NORMAL`, `DELAYED`, `DISRUPTED`)
