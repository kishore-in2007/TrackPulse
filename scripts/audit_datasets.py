"""
Data Audit Script for TrackPulse (SIH26028)
Inspects all raw railway datasets and generates audit reports.
"""
import os
import zipfile
import json
import pandas as pd
import numpy as np

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(WORKSPACE_DIR, "data_audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Auditing datasets in: {WORKSPACE_DIR}")

def audit_file(filepath):
    filename = os.path.basename(filepath)
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    print(f"\n{'='*50}\nFile: {filename} ({size_mb:.2f} MB)")

    if filename.endswith(".zip"):
        with zipfile.ZipFile(filepath, 'r') as z:
            print("  Zip contents:", z.namelist())
            for inner in z.namelist():
                if inner.endswith(".csv"):
                    with z.open(inner) as f:
                        df_sample = pd.read_csv(f, nrows=10)
                        print(f"  Inner CSV: {inner} - Columns ({len(df_sample.columns)}): {list(df_sample.columns)}")
                elif inner.endswith(".json"):
                    with z.open(inner) as f:
                        data = json.load(f)
                        if isinstance(data, list):
                            print(f"  Inner JSON: {inner} - List length: {len(data)}, Item sample: {list(data[0].keys()) if len(data)>0 and isinstance(data[0], dict) else type(data[0])}")
                        elif isinstance(data, dict):
                            print(f"  Inner JSON: {inner} - Dict keys sample: {list(data.keys())[:10]}")
    elif filename.endswith(".csv"):
        df_sample = pd.read_csv(filepath, nrows=10)
        print(f"  Columns ({len(df_sample.columns)}): {list(df_sample.columns)}")
    elif filename.endswith(".json"):
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    print(f"  List length: {len(data)}, Item sample: {list(data[0].keys()) if len(data)>0 and isinstance(data[0], dict) else type(data[0])}")
                elif isinstance(data, dict):
                    print(f"  Dict keys sample: {list(data.keys())[:10]}")
            except Exception as e:
                print(f"  Error reading json: {e}")

if __name__ == "__main__":
    files = [
        "ir_data_dictionary.csv",
        "ir_sample_submission.csv",
        "ir_train.csv",
        "ir_test.csv",
        "etrain_delays.csv",
        "trains.csv",
        "trains_db_hbfs.csv",
        "part-00000-9194fa62-016b-4ae5-8f5e-92b5d2075f1a-c000.csv",
        "stations.json.zip",
        "trains.json.zip",
        "Trains schedule.csv.zip",
        "isl_wise_train_detail_03082015_v1.csv.zip",
        "EXP-TRAINS.json",
        "PASS-TRAINS.json",
        "SF-TRAINS.json"
    ]
    for f in files:
        path = os.path.join(WORKSPACE_DIR, f)
        if os.path.exists(path):
            audit_file(path)
        else:
            print(f"File not found: {f}")
