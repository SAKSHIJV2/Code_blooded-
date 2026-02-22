from core.selector import select_questions
from utils.loader import load_full_dataset
from fastapi import APIRouter
from utils.attempt_store import attempts_db
from core.evaluation_service import evaluate_attempts, compute_student_features
from services.ai_service import predict_level
from services.report_service import generate_paragraph
import random


router = APIRouter()

# Default blueprint (25 questions)
DEFAULT_BLUEPRINT = {
    "MCQ": 1,
    "MSQ": 1,
    "CODE_TRACE": 3,
    "SHORT_ANSWER": 2,
    "REASONING": 2
}


def sanitize_question(question):

    safe_data = {
        "id": question["id"],
        "track": question.get("track"),
        "topic": question.get("topic"),
        "subtopic": question.get("subtopic"),
        "difficulty": question.get("difficulty"),
        "question_type": question.get("question_type"),
        "question": question.get("question"),
        "options": question.get("options", []),
        "user_explanation_required": question.get("user_explanation_required", False),
    }

    # ✅ Include code for CODE_TRACE
    if question.get("question_type") == "CODE_TRACE":
        safe_data["code"] = question.get("code")

    return safe_data

def generate_test(difficulty_mode="Mixed", time_limit=1500):

    dataset = load_full_dataset()
    random.shuffle(dataset)
    selection = select_questions(
        dataset=dataset,
        blueprint=DEFAULT_BLUEPRINT,
        time_limit=time_limit,
        difficulty_mode=difficulty_mode
    )

    # Get full question objects
    selected_questions = [
        q for q in dataset if q["id"] in selection["question_ids"]
    ]

    # 🔒 Sanitize before returning
    safe_questions = [sanitize_question(q) for q in selected_questions]

    return {
        "test_meta": {
            "total_questions": selection["total_questions"],
            "total_time_sec": selection["total_time_sec"],
            "difficulty_mode": selection["difficulty_mode"]
        },
        "questions": safe_questions
    }
# Save each answer
@router.post("/submit-answer")
def submit_answer(payload: dict):

    user_id = payload["user_id"]

    if user_id not in attempts_db:
        attempts_db[user_id] = []

    attempts_db[user_id].append(payload)

    print("Saved:", payload)
    print("Current attempts_db:", attempts_db)

    return {"status": "saved"}
@router.post("/finish-test")
def finish_test(user_id: str):

    attempts = attempts_db.get(user_id, [])

    results = evaluate_attempts(attempts)

    features = compute_student_features(results)

    level = predict_level(features)

    paragraph = generate_paragraph(features, level)

    return {
        "level": level,
        "features": features,
        "paragraph": paragraph
    }