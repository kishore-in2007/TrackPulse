# Dataset Inventory & Mapping

## Raw Datasets & Role Mapping

| Dataset | Size | Role | Processed Canonical Target |
|---|---|---|---|
| `ir_train.csv` | 321.5 MB | Primary ML Supervised Training (1.5M journeys) | `ml/delay_model.txt`, `ml/model_metrics.json` |
| `ir_test.csv` | 72.5 MB | Unseen competition test benchmark | Independent submission validation |
| `ir_data_dictionary.csv` | 3.2 KB | Feature definition and types audit | `data_audit/` reports |
| `stations.json.zip` | 0.27 MB | Station master (names, codes, zones, lat/lon) | `data/seed/canonical_stations.json` (8,990 stations) |
| `isl_wise_train_detail_03082015_v1.csv.zip` | 1.06 MB | Detailed stop sequences & timetable | `data/seed/canonical_schedules.json` (2,810 trains) |
| `etrain_delays.csv` | 0.29 MB | Historical station delay behaviour & recovery | `data/seed/section_statistics.json` (16,992 sections) |
| `EXP-TRAINS.json` / `SF-TRAINS.json` | 24.2 MB | Train type classification and route metadata | `data/seed/canonical_trains.json` |
| `trains_db_hbfs.csv` | 7.5 MB | Platform and transit timetable reference | Station capacity benchmarking |

---

## Canonical Schemas

### 1. `canonical_stations.json`
```json
{
  "MAS": {
    "station_code": "MAS",
    "station_name": "Chennai Central",
    "state": "Tamil Nadu",
    "zone": "SR",
    "latitude": 13.0827,
    "longitude": 80.2707
  }
}
```

### 2. `canonical_trains.json`
```json
{
  "12675": {
    "train_id": "12675",
    "train_number": "12675",
    "train_name": "Kovai Express",
    "train_type": "Superfast",
    "source_station": "MAS",
    "destination_station": "CBE",
    "zone": "SR",
    "total_distance_km": 495.0,
    "total_stops": 10
  }
}
```

### 3. `section_statistics.json`
```json
{
  "MAS->AJJ": {
    "from_station": "MAS",
    "to_station": "AJJ",
    "distance_km": 68.0,
    "sample_count": 45,
    "median_running_min": 58.0,
    "mean_running_min": 59.2,
    "p90_running_min": 71.0,
    "std_running_min": 6.8,
    "recovery_rate": 0.08
  }
}
```
