from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.test_service import generate_test
from services.report_service import generate_paragraph
from services.test_service import router as test_router
from core.evaluation_service import evaluate_attempts, compute_student_features
from services.ai_service import predict_level
from utils.attempt_store import attempts_db
app = FastAPI(title="SkillGate Backend")
app.include_router(test_router)
# -------- Enable CORS (for React TSX frontend) --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Health Check --------
@app.get("/health")
def health_check():
    return {"status": "Backend running successfully"}


# -------- Generate Test --------
@app.post("/generate-test")
def create_test(request: dict):
    """
    Request body example:
    {
        "difficulty_mode": "Mixed",
        "time_limit": 1500
    }
    """

    difficulty_mode = request.get("difficulty_mode", "Mixed")
    time_limit = request.get("time_limit", 1500)

    test_data = generate_test(
        difficulty_mode=difficulty_mode,
        time_limit=time_limit
    )

    return test_data


# -------- Submit Attempt --------
@app.post("/submit-attempt")
def submit_attempt(attempt_data: dict):

    user_id = attempt_data["user_id"]

    # ✅ get stored answers
    answers = attempts_db.get(user_id, [])

    results = evaluate_attempts(answers)

    features = compute_student_features(results)

    level = predict_level(features)

    paragraph = generate_paragraph(features, level)

    return {
        "level": level,
        "features": features,
        "paragraph": paragraph
    }




















    