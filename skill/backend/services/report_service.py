from core.evaluation_service import evaluate_attempt
from utils.loader import load_full_dataset


def generate_paragraph(features, level):

    strengths = []
    weaknesses = []

    if features["conceptual_score"] > 70:
        strengths.append("conceptual understanding")
    else:
        weaknesses.append("conceptual clarity")

    if features["logical_score"] > 70:
        strengths.append("logical reasoning")
    else:
        weaknesses.append("problem solving")

    if features["speed_score"] < 60:
        weaknesses.append("time management")

    return f"""
    Your current performance level is {level}. 
    You demonstrate strengths in {', '.join(strengths)}. 
    However, you need to focus more on {', '.join(weaknesses)}.
    Regular practice and timed tests will help you improve.
    """