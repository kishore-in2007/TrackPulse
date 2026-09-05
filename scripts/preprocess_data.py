"""
Preprocessing & Canonical Data Generator for TrackPulse (SIH26028)
Processes raw datasets into canonical JSON/Parquet artifacts for production inference.
"""
import os
import zipfile
import json
import re
import pandas as pd
import numpy as np

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE_DIR, "data", "seed")
os.makedirs(DATA_DIR, exist_ok=True)

print(f"Starting data preprocessing. Output directory: {DATA_DIR}")

def normalize_train_id(val):
    if pd.isna(val):
        return ""
    s = str(val).strip()
    if s.endswith(".0"):
        s = s[:-2]
    s = s.zfill(5)
    return s

def normalize_station_code(val):
    if pd.isna(val):
        return ""
    return str(val).strip().upper()

def process_stations():
    stations_zip = os.path.join(WORKSPACE_DIR, "stations.json.zip")
    stations_map = {}
    if os.path.exists(stations_zip):
        with zipfile.ZipFile(stations_zip, 'r') as z:
            with z.open("stations.json") as f:
                data = json.load(f)
                features = data.get("features", [])
                for feat in features:
                    props = feat.get("properties", {})
                    geom = feat.get("geometry") or {}
                    code = normalize_station_code(props.get("code"))
                    if not code:
                        continue
                    coords = geom.get("coordinates", [0, 0]) if isinstance(geom, dict) else [0, 0]
                    name = str(props.get("name") or code).strip().title()
                    state = str(props.get("state") or "").strip().title()
                    zone = str(props.get("zone") or "").strip().upper()
                    stations_map[code] = {
                        "station_code": code,
                        "station_name": name,
                        "state": state,
                        "zone": zone,
                        "latitude": round(coords[1], 4) if len(coords) > 1 else 0.0,
                        "longitude": round(coords[0], 4) if len(coords) > 0 else 0.0,
                    }
    print(f"Processed {len(stations_map)} canonical stations.")
    with open(os.path.join(DATA_DIR, "canonical_stations.json"), "w", encoding="utf-8") as f:
        json.dump(stations_map, f, indent=2)
    return stations_map

def process_schedules_and_sections(stations_map):
    isl_zip = os.path.join(WORKSPACE_DIR, "isl_wise_train_detail_03082015_v1.csv.zip")
    trains_dict = {}
    schedules_dict = {}
    sections_dict = {}
    
    if os.path.exists(isl_zip):
        with zipfile.ZipFile(isl_zip, 'r') as z:
            with z.open("isl_wise_train_detail_03082015_v1.csv") as f:
                df = pd.read_csv(f)
                
                df['train_no'] = df['Train No.'].apply(normalize_train_id)
                df['station_code'] = df['station Code'].apply(normalize_station_code)
                df['islno'] = pd.to_numeric(df['islno'], errors='coerce').fillna(0).astype(int)
                df['distance'] = pd.to_numeric(df['Distance'], errors='coerce').fillna(0).astype(float)
                
                df = df.sort_values(by=['train_no', 'islno'])
                
                for train_no, grp in df.groupby('train_no'):
                    if len(grp) < 2:
                        continue
                    first_row = grp.iloc[0]
                    last_row = grp.iloc[-1]
                    train_name = str(first_row['train Name']).strip().title()
                    src_code = normalize_station_code(first_row['Source Station Code']) or normalize_station_code(first_row['station_code'])
                    dst_code = normalize_station_code(first_row['Destination station Code']) or normalize_station_code(last_row['station_code'])
                    
                    trains_dict[train_no] = {
                        "train_id": train_no,
                        "train_number": train_no,
                        "train_name": train_name,
                        "train_type": "Superfast" if "SF" in train_name.upper() or "SUPERFAST" in train_name.upper() or "EXP" in train_name.upper() else "Express",
                        "source_station": src_code,
                        "destination_station": dst_code,
                        "zone": stations_map.get(src_code, {}).get("zone", "SR"),
                        "total_distance_km": float(last_row['distance']),
                        "total_stops": len(grp)
                    }
                    
                    stops = []
                    prev_row = None
                    for _, row in grp.iterrows():
                        stn_code = row['station_code']
                        arr_time = str(row['Arrival time']).strip()
                        dep_time = str(row['Departure time']).strip()
                        dist = float(row['distance'])
                        
                        stops.append({
                            "station_code": stn_code,
                            "station_name": str(row['Station Name']).strip().title(),
                            "stop_sequence": int(row['islno']),
                            "scheduled_arrival": arr_time if arr_time and arr_time != "'" else dep_time,
                            "scheduled_departure": dep_time if dep_time and dep_time != "'" else arr_time,
                            "distance_from_origin_km": dist
                        })
                        
                        if prev_row is not None:
                            sec_key = f"{prev_row['station_code']}->{stn_code}"
                            sec_dist = max(1.0, dist - float(prev_row['distance']))
                            
                            # Estimate nominal sectional running time in minutes from scheduled diff
                            def parse_min(t_str):
                                try:
                                    parts = t_str.split(':')
                                    return int(parts[0]) * 60 + int(parts[1])
                                except:
                                    return 0
                            
                            t1 = parse_min(str(prev_row['Departure time']).strip())
                            t2 = parse_min(arr_time)
                            diff_min = (t2 - t1) % 1440
                            if diff_min <= 0 or diff_min > 400:
                                diff_min = round(sec_dist * 1.1)  # ~55 km/h nominal
                                
                            if sec_key not in sections_dict:
                                sections_dict[sec_key] = {
                                    "from_station": prev_row['station_code'],
                                    "to_station": stn_code,
                                    "distance_km": sec_dist,
                                    "samples": [],
                                    "median_running_min": diff_min,
                                    "p90_running_min": round(diff_min * 1.25),
                                    "recovery_rate": 0.08
                                }
                            sections_dict[sec_key]["samples"].append(diff_min)
                        prev_row = row
                    schedules_dict[train_no] = stops

    # Refine section statistics
    final_sections = {}
    for key, val in sections_dict.items():
        arr = np.array(val["samples"])
        median_m = float(np.median(arr)) if len(arr) > 0 else float(val["median_running_min"])
        p90_m = float(np.percentile(arr, 90)) if len(arr) > 0 else float(val["p90_running_min"])
        std_m = float(np.std(arr)) if len(arr) > 1 else max(2.0, median_m * 0.15)
        final_sections[key] = {
            "from_station": val["from_station"],
            "to_station": val["to_station"],
            "distance_km": val["distance_km"],
            "sample_count": len(arr),
            "median_running_min": round(median_m, 1),
            "mean_running_min": round(float(np.mean(arr)), 1) if len(arr) > 0 else round(median_m, 1),
            "p90_running_min": round(p90_m, 1),
            "std_running_min": round(std_m, 1),
            "recovery_rate": 0.08
        }

    print(f"Processed {len(trains_dict)} trains, {len(schedules_dict)} schedules, {len(final_sections)} route sections.")
    
    with open(os.path.join(DATA_DIR, "canonical_trains.json"), "w", encoding="utf-8") as f:
        json.dump(trains_dict, f, indent=2)
    with open(os.path.join(DATA_DIR, "canonical_schedules.json"), "w", encoding="utf-8") as f:
        json.dump(schedules_dict, f, indent=2)
    with open(os.path.join(DATA_DIR, "section_statistics.json"), "w", encoding="utf-8") as f:
        json.dump(final_sections, f, indent=2)
        
    return trains_dict, schedules_dict, final_sections

def generate_dependencies_and_replay(trains_dict):
    # Establish canonical realistic train dependencies across major junctions (MAS, NDLS, HWH, SBC, BRC, CSMT)
    dependencies = [
        {
            "dependency_id": "DEP-MAS-12675-12676",
            "incoming_train_id": "12675",
            "incoming_train_name": "Kovai Express",
            "outgoing_train_id": "12676",
            "outgoing_train_name": "Kovai Return Express",
            "station_code": "MAS",
            "station_name": "Chennai Central",
            "dependency_type": "RAKE",
            "minimum_turnaround_minutes": 45,
            "scheduled_incoming_arrival": "18:20",
            "scheduled_outgoing_departure": "18:50",
            "confidence": 0.95,
            "description": "Shared rake turnaround for Coimbatore-Chennai express pair."
        },
        {
            "dependency_id": "DEP-MAS-12007-12008",
            "incoming_train_id": "12007",
            "incoming_train_name": "Shatabdi Express",
            "outgoing_train_id": "12008",
            "outgoing_train_name": "Mysore Shatabdi Express",
            "station_code": "MAS",
            "station_name": "Chennai Central",
            "dependency_type": "CREW",
            "minimum_turnaround_minutes": 30,
            "scheduled_incoming_arrival": "18:30",
            "scheduled_outgoing_departure": "19:10",
            "confidence": 0.90,
            "description": "Loco pilot and primary guard crew link handover."
        },
        {
            "dependency_id": "DEP-NDLS-12423-12424",
            "incoming_train_id": "12423",
            "incoming_train_name": "Dibrugarh Rajdhani",
            "outgoing_train_id": "12424",
            "outgoing_train_name": "Rajdhani Express",
            "station_code": "NDLS",
            "station_name": "New Delhi",
            "dependency_type": "PLATFORM",
            "minimum_turnaround_minutes": 25,
            "scheduled_incoming_arrival": "10:15",
            "scheduled_outgoing_departure": "10:50",
            "confidence": 0.88,
            "description": "Platform 2 clearance & inspection before outbound boarding."
        },
        {
            "dependency_id": "DEP-SBC-12657-12658",
            "incoming_train_id": "12657",
            "incoming_train_name": "Bangalore Mail",
            "outgoing_train_id": "12658",
            "outgoing_train_name": "Chennai Mail",
            "station_code": "SBC",
            "station_name": "KSR Bengaluru",
            "dependency_type": "RAKE",
            "minimum_turnaround_minutes": 40,
            "scheduled_incoming_arrival": "06:45",
            "scheduled_outgoing_departure": "07:30",
            "confidence": 0.96,
            "description": "Primary rake turnaround with coach watering and cleaning."
        },
        {
            "dependency_id": "DEP-MAS-12622-12674",
            "incoming_train_id": "12622",
            "incoming_train_name": "Tamil Nadu Express",
            "outgoing_train_id": "12674",
            "outgoing_train_name": "Cheran Express",
            "station_code": "MAS",
            "station_name": "Chennai Central",
            "dependency_type": "PASSENGER_CONNECTION",
            "minimum_turnaround_minutes": 20,
            "scheduled_incoming_arrival": "18:40",
            "scheduled_outgoing_departure": "19:05",
            "confidence": 0.92,
            "description": "High-volume reserved passenger connection window."
        }
    ]
    
    with open(os.path.join(DATA_DIR, "canonical_dependencies.json"), "w", encoding="utf-8") as f:
        json.dump(dependencies, f, indent=2)
        
    # Demo PNR database
    demo_pnr = {
        "1234567890": {
            "pnr": "1234567890",
            "passenger_name": "R. Sharma & 1 Other",
            "train_id": "12675",
            "train_number": "12675",
            "train_name": "Kovai Express",
            "source": "MAS",
            "destination": "CBE",
            "boarding_station": "MAS",
            "destination_station": "CBE",
            "booking_status": "CONFIRMED",
            "coach": "B2",
            "berth": "34, 35",
            "journey_date": "2026-09-10",
            "scheduled_departure": "06:10",
            "scheduled_arrival": "14:05"
        },
        "9876543210": {
            "pnr": "9876543210",
            "passenger_name": "P. Iyer",
            "train_id": "12007",
            "train_number": "12007",
            "train_name": "Mysore Shatabdi",
            "source": "MAS",
            "destination": "SBC",
            "boarding_station": "MAS",
            "destination_station": "SBC",
            "booking_status": "CONFIRMED",
            "coach": "C1",
            "berth": "12",
            "journey_date": "2026-09-10",
            "scheduled_departure": "06:00",
            "scheduled_arrival": "10:50"
        },
        "4567890123": {
            "pnr": "4567890123",
            "passenger_name": "A. Kumar",
            "train_id": "12622",
            "train_number": "12622",
            "train_name": "Tamil Nadu Express",
            "source": "NDLS",
            "destination": "MAS",
            "boarding_station": "BPL",
            "destination_station": "MAS",
            "booking_status": "CONFIRMED",
            "coach": "A1",
            "berth": "21",
            "journey_date": "2026-09-10",
            "scheduled_departure": "06:40",
            "scheduled_arrival": "18:40"
        }
    }
    with open(os.path.join(DATA_DIR, "demo_pnr.json"), "w", encoding="utf-8") as f:
        json.dump(demo_pnr, f, indent=2)

    # Demo Replay Events
    replay_events = [
        {"step": 0, "simulated_time": "17:00", "train_id": "12675", "current_station": "KPD", "next_station": "AJJ", "current_delay_min": 12, "distance_remaining_km": 130, "speed_kmh": 78},
        {"step": 1, "simulated_time": "17:30", "train_id": "12675", "current_station": "AJJ", "next_station": "PER", "current_delay_min": 15, "distance_remaining_km": 68, "speed_kmh": 65},
        {"step": 2, "simulated_time": "18:00", "train_id": "12675", "current_station": "PER", "next_station": "MAS", "current_delay_min": 18, "distance_remaining_km": 12, "speed_kmh": 40},
        {"step": 3, "simulated_time": "18:38", "train_id": "12675", "current_station": "MAS", "next_station": "TERMINAL", "current_delay_min": 18, "distance_remaining_km": 0, "speed_kmh": 0},
        {"step": 0, "simulated_time": "17:00", "train_id": "12007", "current_station": "AB", "next_station": "KPD", "current_delay_min": 5, "distance_remaining_km": 150, "speed_kmh": 85},
        {"step": 1, "simulated_time": "17:30", "train_id": "12007", "current_station": "KPD", "next_station": "AJJ", "current_delay_min": 8, "distance_remaining_km": 80, "speed_kmh": 80},
        {"step": 2, "simulated_time": "18:00", "train_id": "12007", "current_station": "AJJ", "next_station": "MAS", "current_delay_min": 6, "distance_remaining_km": 60, "speed_kmh": 82},
        {"step": 3, "simulated_time": "18:36", "train_id": "12007", "current_station": "MAS", "next_station": "TERMINAL", "current_delay_min": 6, "distance_remaining_km": 0, "speed_kmh": 0},
        {"step": 0, "simulated_time": "17:00", "train_id": "12622", "current_station": "BZA", "next_station": "GDR", "current_delay_min": 24, "distance_remaining_km": 280, "speed_kmh": 72},
        {"step": 1, "simulated_time": "17:30", "train_id": "12622", "current_station": "OGL", "next_station": "GDR", "current_delay_min": 28, "distance_remaining_km": 190, "speed_kmh": 68},
        {"step": 2, "simulated_time": "18:00", "train_id": "12622", "current_station": "GDR", "next_station": "MAS", "current_delay_min": 32, "distance_remaining_km": 138, "speed_kmh": 60},
        {"step": 3, "simulated_time": "18:45", "train_id": "12622", "current_station": "NYP", "next_station": "MAS", "current_delay_min": 35, "distance_remaining_km": 40, "speed_kmh": 55}
    ]
    with open(os.path.join(DATA_DIR, "replay_events.json"), "w", encoding="utf-8") as f:
        json.dump(replay_events, f, indent=2)

    print("Dependencies, PNR, and Replay seeds generated successfully.")

if __name__ == "__main__":
    stns = process_stations()
    trains, scheds, secs = process_schedules_and_sections(stns)
    generate_dependencies_and_replay(trains)
    print("Preprocessing completed successfully!")
