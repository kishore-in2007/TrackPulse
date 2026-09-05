"""
Python Verification Test Suite for TrackPulse Engine
"""
import os
import json
import unittest

WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestTrackPulseArtifacts(unittest.TestCase):
    
    def test_canonical_files_exist(self):
        seed_dir = os.path.join(WORKSPACE_DIR, "data", "seed")
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "canonical_stations.json")))
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "canonical_trains.json")))
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "canonical_schedules.json")))
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "section_statistics.json")))
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "canonical_dependencies.json")))
        self.assertTrue(os.path.exists(os.path.join(seed_dir, "demo_pnr.json")))

    def test_ml_model_artifacts_exist(self):
        ml_dir = os.path.join(WORKSPACE_DIR, "ml")
        self.assertTrue(os.path.exists(os.path.join(ml_dir, "delay_model.txt")))
        self.assertTrue(os.path.exists(os.path.join(ml_dir, "feature_schema.json")))
        self.assertTrue(os.path.exists(os.path.join(ml_dir, "model_metrics.json")))
        
        with open(os.path.join(ml_dir, "model_metrics.json"), "r") as f:
            metrics = json.load(f)
            self.assertIn("roc_auc", metrics)
            self.assertGreater(metrics["roc_auc"], 0.85)

    def test_kaggle_notebooks_exist(self):
        kaggle_dir = os.path.join(WORKSPACE_DIR, "kaggle")
        for i in range(1, 8):
            nb_name = [f for f in os.listdir(kaggle_dir) if f.startswith(f"0{i}")][0]
            self.assertTrue(os.path.exists(os.path.join(kaggle_dir, nb_name)))

if __name__ == "__main__":
    unittest.main()
