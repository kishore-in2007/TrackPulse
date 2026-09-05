"""
Machine Learning Training & Export Pipeline for TrackPulse (SIH26028)
Trains the LightGBM Delay Risk Model with zero leakage and chronological validation.
Exports production artifacts: delay_model.txt, feature_schema.json, feature_defaults.json, model_metrics.json.
"""
import os
import json
import time
import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, log_loss

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(WORKSPACE_DIR, "ml")
os.makedirs(ML_DIR, exist_ok=True)

DATA_PATH = os.path.join(WORKSPACE_DIR, "ir_train.csv")

# Strict Leakage Exclusion List
LEAKAGE_COLUMNS = [
    "journey_id",
    "primary_delay_cause",
    "delay_minutes",
    "actual_arrival",
    "future_delay",
    "is_delayed",
    "departure_date"
]

print("="*60)
print("TRACKPULSE ML TRAINING: DELAY RISK MODEL (LightGBM)")
print("="*60)

def load_and_prepare_data():
    print(f"Loading dataset from: {DATA_PATH}")
    # Load 250,000 rows for high-fidelity, high-speed training and calibration
    df = pd.read_csv(DATA_PATH, nrows=250000)
    print(f"Loaded dataset sample shape: {df.shape}")
    
    # Check for target
    assert "is_delayed" in df.columns, "Target 'is_delayed' missing!"
    
    # Audit leakage
    print("\n--- Leakage Audit ---")
    for col in LEAKAGE_COLUMNS:
        if col in df.columns:
            print(f"  [EXCLUDED] {col} (leakage prevention)")
            
    # Feature selection
    feature_cols = [c for c in df.columns if c not in LEAKAGE_COLUMNS]
    
    # Categorical and numerical preprocessing
    cat_cols = ['train_type', 'season', 'zone', 'zone_abbr', 'source_station_category', 'destination_station_category', 'traction_type']
    cat_cols = [c for c in cat_cols if c in feature_cols]
    
    cat_mappings = {}
    for col in cat_cols:
        df[col] = df[col].astype(str).fillna("UNKNOWN")
        unique_vals = sorted(df[col].unique().tolist())
        cat_mappings[col] = {val: idx for idx, val in enumerate(unique_vals)}
        df[col] = df[col].map(cat_mappings[col]).fillna(0).astype(int)
        
    num_cols = [c for c in feature_cols if c not in cat_cols]
    feature_defaults = {}
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        median_val = float(df[col].median()) if not df[col].isna().all() else 0.0
        feature_defaults[col] = round(median_val, 4)
        df[col] = df[col].fillna(median_val)
        
    for col in cat_cols:
        feature_defaults[col] = 0
        
    print(f"\nFinal feature count: {len(feature_cols)}")
    print(f"Features: {feature_cols}")
    
    # Chronological Split
    if 'year' in df.columns:
        years = sorted(df['year'].unique())
        print(f"Years in dataset: {years}")
        split_year = years[-1] if len(years) > 1 else years[0]
        train_mask = df['year'] < split_year if len(years) > 1 else np.arange(len(df)) < int(len(df) * 0.8)
    else:
        train_mask = np.arange(len(df)) < int(len(df) * 0.8)
        
    X = df[feature_cols]
    y = df['is_delayed'].astype(int)
    
    X_train, y_train = X[train_mask], y[train_mask]
    X_val, y_val = X[~train_mask], y[~train_mask]
    
    print(f"Train split: {len(X_train)} samples, Validation split: {len(X_val)} samples")
    print(f"Train target mean: {y_train.mean():.4f}, Val target mean: {y_val.mean():.4f}")
    
    return X_train, y_train, X_val, y_val, feature_cols, cat_cols, cat_mappings, feature_defaults

def train_delay_model(X_train, y_train, X_val, y_val, feature_cols, cat_cols):
    print("\nTraining LightGBM Classifier...")
    
    train_data = lgb.Dataset(X_train, label=y_train, categorical_feature=cat_cols)
    val_data = lgb.Dataset(X_val, label=y_val, reference=train_data, categorical_feature=cat_cols)
    
    params = {
        'objective': 'binary',
        'metric': ['auc', 'binary_logloss'],
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 31,
        'feature_fraction': 0.8,
        'bagging_fraction': 0.8,
        'bagging_freq': 5,
        'verbose': -1,
        'seed': 42
    }
    
    start_time = time.time()
    model = lgb.train(
        params,
        train_data,
        num_boost_round=300,
        valid_sets=[train_data, val_data],
        valid_names=['train', 'val'],
        callbacks=[lgb.early_stopping(stopping_rounds=30, verbose=False)]
    )
    elapsed = time.time() - start_time
    print(f"Training completed in {elapsed:.2f}s across {model.best_iteration} iterations.")
    
    # Evaluation
    val_preds = model.predict(X_val, num_iteration=model.best_iteration)
    auc = roc_auc_score(y_val, val_preds)
    pr_auc = average_precision_score(y_val, val_preds)
    brier = brier_score_loss(y_val, val_preds)
    loss = log_loss(y_val, val_preds)
    
    print("\n" + "="*40)
    print(f"EVALUATION METRICS:")
    print(f"  ROC-AUC:       {auc:.4f}")
    print(f"  PR-AUC:        {pr_auc:.4f}")
    print(f"  Brier Score:   {brier:.4f}")
    print(f"  Binary LogLoss:{loss:.4f}")
    print("="*40)
    
    # Feature importances
    importance = model.feature_importance(importance_type='gain')
    feat_imp = sorted(zip(feature_cols, importance), key=lambda x: x[1], reverse=True)
    print("\nTop 10 Most Important Features:")
    for f_name, imp in feat_imp[:10]:
        print(f"  - {f_name:30s}: {imp:.2f}")
        
    return model, {
        "roc_auc": round(float(auc), 4),
        "pr_auc": round(float(pr_auc), 4),
        "brier_score": round(float(brier), 4),
        "log_loss": round(float(loss), 4),
        "best_iteration": int(model.best_iteration),
        "top_features": [{"feature": f, "importance": round(float(imp), 2)} for f, imp in feat_imp[:10]]
    }

def export_artifacts(model, metrics, feature_cols, cat_cols, cat_mappings, feature_defaults):
    print(f"\nExporting artifacts to: {ML_DIR}")
    
    # 1. Save model text format
    model_txt_path = os.path.join(ML_DIR, "delay_model.txt")
    model.save_model(model_txt_path)
    
    # 2. Save feature schema
    schema = {
        "features": feature_cols,
        "categorical_features": cat_cols,
        "target": "is_delayed",
        "target_description": "P(delay > 15 minutes)",
        "categorical_mappings": cat_mappings
    }
    with open(os.path.join(ML_DIR, "feature_schema.json"), "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)
        
    # 3. Save feature defaults
    with open(os.path.join(ML_DIR, "feature_defaults.json"), "w", encoding="utf-8") as f:
        json.dump(feature_defaults, f, indent=2)
        
    # 4. Save model metrics
    with open(os.path.join(ML_DIR, "model_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
        
    # 5. Save model metadata
    metadata = {
        "model_type": "LightGBMClassifier",
        "problem_statement": "SIH26028 - Dynamic Train ETA & Delay Intelligence",
        "training_dataset": "Kaggle ir_train.csv (Temporal Split)",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "leakage_checked": True,
        "metrics": metrics
    }
    with open(os.path.join(ML_DIR, "model_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print("All ML artifacts exported successfully!")

if __name__ == "__main__":
    X_train, y_train, X_val, y_val, feature_cols, cat_cols, cat_mappings, feature_defaults = load_and_prepare_data()
    model, metrics = train_delay_model(X_train, y_train, X_val, y_val, feature_cols, cat_cols)
    export_artifacts(model, metrics, feature_cols, cat_cols, cat_mappings, feature_defaults)
