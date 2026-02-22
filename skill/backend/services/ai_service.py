import joblib
import pandas as pd
from pathlib import Path

MODEL = joblib.load("models/student_ai_model.pkl")
ENCODER = joblib.load("models/label_encoder.pkl")


def predict_level(features: dict):

    df = pd.DataFrame([features])
    pred = MODEL.predict(df)
    return ENCODER.inverse_transform(pred)[0]