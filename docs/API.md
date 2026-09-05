# TrackPulse API Reference

All TrackPulse APIs return JSON responses and include typed error payloads.

---

## 1. Dynamic Train ETA
`GET /api/trains/{trainId}/eta`

### Query Parameters
- `delay` (optional): Override current delay in minutes (integer)
- `station` (optional): Override current station code (e.g. `KPD`)
- `time` (optional): Simulated current time (e.g. `18:00`)
- `mode` (optional): `LIVE` | `REPLAY` | `HISTORICAL` | `DEMO`

### Response Payload
```json
{
  "train_id": "12675",
  "train_number": "12675",
  "train_name": "Kovai Express",
  "train_type": "Superfast",
  "source_station": "MAS",
  "destination_station": "CBE",
  "current_station": "KPD",
  "status": "DELAYED",
  "current_delay_minutes": 18,
  "scheduled_arrival": "14:05",
  "eta": "14:23",
  "eta_p10": "14:18",
  "eta_p50": "14:23",
  "eta_p90": "14:35",
  "reliability": 0.87,
  "regime": "DELAYED",
  "risk": "MEDIUM",
  "delay_probability": 0.45,
  "distance_remaining_km": 365,
  "stops_remaining": 6,
  "reasons": [
    {
      "classification": "OBSERVED",
      "factor": "Current Running Delay",
      "impact_minutes": 18,
      "description": "Train is currently running +18 min behind schedule at Katpadi Jn (KPD)."
    }
  ],
  "section_timeline": [],
  "is_fallback": false,
  "data_mode": "DEMO",
  "last_updated": "2026-09-05T12:00:00Z"
}
```

---

## 2. Multi-Train Network & Turnaround Analysis
`POST /api/network/analyze`

### Request Body
```json
{
  "station_id": "MAS",
  "time_window_minutes": 120,
  "delay_overrides": {
    "12675": 18
  }
}
```

---

## 3. Passenger Train Recommendation
`POST /api/recommend`

### Request Body
```json
{
  "source": "MAS",
  "destination": "CBE",
  "date": "2026-09-10",
  "preference": "balanced",
  "custom_weights": {
    "arrival_quality": 0.35,
    "reliability": 0.20
  }
}
```

---

## 4. What-If Simulation
`POST /api/simulate`

### Request Body
```json
{
  "train_id": "12675",
  "delay_injection_minutes": 30
}
```

---

## 5. PNR Status Lookup
`POST /api/pnr/status`

### Request Body
```json
{
  "pnr": "1234567890"
}
```

---

## 6. Button-Phone Inbound SMS
`POST /api/sms/inbound`

### Request Body
```json
{
  "message": "PNR 1234567890"
}
```

---

## 7. Movement Telemetry Replay
`GET /api/replay?step=1&playing=false&speed=1`
