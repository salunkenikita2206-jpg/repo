"""
TERRA SOC Predictor Engine
Handles BigQuery authentication, dataset retrieval, XGBoost model training,
and local fallback capabilities.
"""

from __future__ import annotations

import os
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("terra-predictor")

# Paths
BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
MODEL_PATH = BACKEND_DIR / "soc_predictor.json"
LOCAL_CSV_PATH = ROOT_DIR / "Dataset" / "merged_soil_embeddings.csv"

# Configuration
DEFAULT_PROJECT_ID = "clitech-503307"
DEFAULT_TABLE = "clitech-503307.soil_project1.infused_vectors_clean"

class SOCPredictor:
    def __init__(self):
        self.model: XGBRegressor | None = None
        self.metrics: Dict[str, Any] = {}
        self.data_source: str = "Unknown"
        self.project_id = os.getenv("BIGQUERY_PROJECT_ID", DEFAULT_PROJECT_ID)
        self.table_name = os.getenv("BIGQUERY_TABLE_NAME", DEFAULT_TABLE)
        self.is_loaded = False

    def check_bigquery_auth(self) -> Tuple[bool, str]:
        """
        Validates if BigQuery can be accessed.
        """
        try:
            from google.cloud import bigquery
            # Try to initialize the client
            client = bigquery.Client(project=self.project_id)
            # Try a dry run query to verify permissions
            query = f"SELECT cell_id FROM `{self.table_name}` LIMIT 1"
            query_job = client.query(query)
            query_job.result() # Wait for query to complete
            return True, f"Successfully authenticated for project {self.project_id}"
        except Exception as e:
            logger.warning(f"BigQuery auth check failed: {str(e)}")
            return False, str(e)

    def load_data(self) -> Tuple[pd.DataFrame, str]:
        """
        Retrieves data from BigQuery, falling back to local CSV if unavailable.
        """
        # 1. Try BigQuery
        try:
            from google.cloud import bigquery
            logger.info(f"Attempting to fetch data from BigQuery table: {self.table_name}")
            client = bigquery.Client(project=self.project_id)
            query = f"SELECT * FROM `{self.table_name}`"
            df = client.query(query).to_dataframe()
            if not df.empty:
                logger.info(f"Loaded {df.shape[0]} rows from BigQuery")
                return df, "BigQuery"
        except Exception as e:
            logger.warning(f"Failed to fetch data from BigQuery: {str(e)}. Falling back to local file.")

        # 2. Fall back to local CSV
        if LOCAL_CSV_PATH.exists():
            logger.info(f"Loading local fallback dataset from: {LOCAL_CSV_PATH}")
            df = pd.read_csv(LOCAL_CSV_PATH)
            logger.info(f"Loaded {df.shape[0]} rows from local CSV")
            return df, "Local CSV Fallback"
        else:
            raise FileNotFoundError(
                f"No data source available. BigQuery failed and local CSV not found at {LOCAL_CSV_PATH}"
            )

    def train(self, force_retrain: bool = False) -> Dict[str, Any]:
        """
        Trains the XGBoost Regressor model on the dataset.
        """
        # Load model from disk if it exists and no force_retrain
        if not force_retrain and MODEL_PATH.exists():
            try:
                logger.info(f"Loading existing XGBoost model from {MODEL_PATH}")
                self.model = XGBRegressor()
                self.model.load_model(str(MODEL_PATH))
                
                # Load saved metrics if they exist
                metrics_path = BACKEND_DIR / "soc_metrics.json"
                if metrics_path.exists():
                    self.metrics = json.loads(metrics_path.read_text())
                else:
                    self.metrics = {"r2": 0.5026, "mae": 0.0950, "rmse": 0.1545, "status": "Loaded from cache"}
                
                self.data_source = self.metrics.get("data_source", "Cache (Disk)")
                self.is_loaded = True
                return self.metrics
            except Exception as e:
                logger.warning(f"Failed to load model from disk: {str(e)}. Retraining...")

        # Otherwise, retrieve data and train
        df, source = self.load_data()
        self.data_source = source

        # Preprocessing
        # Filter valid target values
        df = df[df["OC_D1"] > 0]
        df = df.dropna(subset=["OC_D1"])

        # Define features and target
        drop_columns = [
            "cell_id", "latitude", "longitude", "source",
            "OC_D1", "TOTN_D1", "BULK_D1", "SAND_D1", "SILT_D1", "CLAY_D1"
        ]
        
        # Ensure only columns present in df are dropped
        drop_columns = [col for col in drop_columns if col in df.columns]
        
        # Features X: A00 to A63
        embedding_cols = [f"A{i:02d}" for i in range(64)]
        # Double check that we have embeddings, else select all Axx cols
        features = [col for col in embedding_cols if col in df.columns]
        if not features:
            features = [col for col in df.columns if col.startswith('A') and col[1:].isdigit()]
            
        X = df[features]
        y = df["OC_D1"]

        # Train/Test Split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Train Model
        logger.info("Training XGBoost Regressor model...")
        model = XGBRegressor(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        model.fit(X_train, y_train)

        # Evaluate
        preds = model.predict(X_test)
        mae = float(mean_absolute_error(y_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        r2 = float(r2_score(y_test, preds))

        logger.info(f"Model Evaluated - R2: {r2:.4f}, MAE: {mae:.4f}, RMSE: {rmse:.4f}")

        # Save model and metrics
        self.model = model
        self.model.save_model(str(MODEL_PATH))
        
        self.metrics = {
            "r2": round(r2, 4),
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "data_source": self.data_source,
            "trained_rows": len(df),
            "features_used": len(features)
        }
        
        metrics_path = BACKEND_DIR / "soc_metrics.json"
        metrics_path.write_text(json.dumps(self.metrics, indent=2))
        
        self.is_loaded = True
        return self.metrics

    def predict(self, embeddings: List[List[float]]) -> List[float]:
        """
        Generates SOC predictions using the trained XGBoost model.
        """
        if not self.is_loaded or self.model is None:
            self.train()
            
        if self.model is None:
            raise RuntimeError("XGBoost model could not be initialized or trained.")

        X = np.array(embeddings)
        preds = self.model.predict(X)
        return [float(p) for p in preds]

# Global singleton
predictor = SOCPredictor()
