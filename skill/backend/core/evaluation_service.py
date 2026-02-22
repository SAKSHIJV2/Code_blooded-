from core.evaluator import evaluate_answer
from utils.loader import load_full_dataset


# 🔥 Load dataset once (fast & scalable)
DATASET = load_full_dataset()
QUESTION_MAP = {q["id"]: q for q in DATASET}


# -------- Readiness Classification --------
def classify_readiness(percent):
    if percent >= 85:
        return "Industry Ready"
    elif percent >= 65:
        return "Almost Ready"
    elif percent >= 40:
        return "Needs Improvement"
    else:
        return "Foundation Level"


# -------- Summary Generator --------
def generate_summary(percent, readiness, strong, weak):

    summary = f"Overall Performance: {percent}%.\n"
    summary += f"Skill Level: {readiness}.\n"

    if strong:
        summary += f"Strong Areas: {', '.join(strong)}.\n"

    if weak:
        summary += f"Needs Improvement: {', '.join(weak)}.\n"

    if readiness == "Industry Ready":
        summary += "Candidate demonstrates strong system thinking and problem-solving."
    elif readiness == "Almost Ready":
        summary += "Candidate has solid fundamentals but needs refinement."
    elif readiness == "Needs Improvement":
        summary += "Candidate shows partial understanding and needs structured practice."
    else:
        summary += "Candidate requires foundational learning."

    return summary


# -------- Detailed Attempt Evaluation --------
def evaluate_attempt(attempt_data):

    question_lookup = QUESTION_MAP

    total_score = 0
    max_score = 0
    topic_scores = {}
    detailed_results = []

    for answer in attempt_data.get("answers", []):

        question = question_lookup.get(answer["question_id"])
        if not question:
            continue

        result = evaluate_answer(question, answer.get("user_answer"))

        score = result["score"]
        weight = question.get("evaluation", {}).get("weight", 1)
        weighted_score = score * weight

        total_score += weighted_score
        max_score += weight

        topic = question.get("topic", "General")

        if topic not in topic_scores:
            topic_scores[topic] = {"score": 0, "max": 0}

        topic_scores[topic]["score"] += weighted_score
        topic_scores[topic]["max"] += weight

        detailed_results.append({
            "question_id": question["id"],
            "topic": topic,
            "score": round(weighted_score, 2),
            "max_score": weight,
            "feedback": result["feedback"]
        })

    # -------- Final Calculations --------
    final_percentage = round((total_score / max_score) * 100, 2) if max_score else 0

    topic_breakdown = {
        topic: round((data["score"] / data["max"]) * 100, 2)
        for topic, data in topic_scores.items()
    }

    strong_topics = []
    weak_topics = []

    for topic, score in topic_breakdown.items():
        if score >= 75:
            strong_topics.append(topic)
        elif score < 50:
            weak_topics.append(topic)

    readiness = classify_readiness(final_percentage)
    summary = generate_summary(final_percentage, readiness, strong_topics, weak_topics)

    return {
        "attempt_id": attempt_data.get("attempt_id"),
        "user_id": attempt_data.get("user_id"),
        "overall_score_percent": final_percentage,
        "readiness_level": readiness,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics,
        "topic_wise_performance_percent": topic_breakdown,
        "summary": summary,
        "detailed_results": detailed_results
    }

def clean_attempts(attempts):

    latest = {}

    for a in attempts:
        latest[a["question_id"]] = a

    return list(latest.values())
# -------- Lightweight Fast Evaluation (for Phase 1 test) --------
def evaluate_attempts(attempts):
    attempts=clean_attempts(attempts)
    results = []

    for a in attempts:
        score=0
        q = QUESTION_MAP.get(a["question_id"])
        if not q:
            continue

        user_answer = a.get("answer")
        time_taken = a.get("time", 60)
        is_correct = False

        # -------- MCQ --------
        if q["question_type"] == "MCQ":
            is_correct = user_answer == q.get("correct_answer")
            score=1 if is_correct else 0

        # -------- MSQ --------
        elif q["question_type"] == "MSQ":
            correct = set(q.get("correct_answer", []))
            user = set(user_answer if isinstance(user_answer, list) else [])

            if not correct:
                is_correct = False
                score = 0
            else:
                match = len(correct & user)
                score = match / len(correct)
                is_correct = score >= 0.6

        # -------- SHORT / REASONING --------
        elif q["question_type"] in ["SHORT_ANSWER", "REASONING"]:

            keywords = q.get("keywords", [])
            correct_text = str(q.get("correct_answer", "")).lower()

            if not user_answer:
                score = 0
                is_correct = False

            else:
                user = str(user_answer).lower()

                # 🔥 Use keywords if available
                if keywords:
                    match = sum(1 for k in keywords if k.lower() in user)
                    score = match / len(keywords)

                # 🔥 fallback if no keywords
                else:
                    score = 0.5 if correct_text[:10] in user else 0.2

                is_correct = score >= 0.4

        # -------- CODE TRACE --------
        elif q["question_type"] == "CODE_TRACE":

            expected = q.get("correct_answer")

            if isinstance(expected, list):
                expected = expected[0]

            if user_answer is not None:
                is_correct = str(user_answer).strip() == str(expected).strip()
                score = 1 if is_correct else 0
            else:
                score = 0

        results.append({
            "type": q["question_type"],
            "topic": q.get("topic"),
            "difficulty": q.get("difficulty"),
            "is_correct": is_correct,
            "time": time_taken,
            "score": score 
        })

    return results

    print(results)
# -------- Student Skill Features --------
# -------- Student Skill Features --------
def compute_student_features(results):

    if not results:
        return {}

    total = len(results)
    correct = sum(r["is_correct"] for r in results)

    conceptual = sum(
        r["score"] for r in results if r["type"] in ["REASONING", "SHORT_ANSWER"]
    )

    logical = sum(
        r["score"] for r in results if r["type"] == "CODE_TRACE"
    )

    conceptual_total = sum(
        1 for r in results if r["type"] in ["REASONING", "SHORT_ANSWER"]
    )

    logical_total = sum(
        1 for r in results if r["type"] == "CODE_TRACE"
    )

    avg_time = sum(r["time"] for r in results) / total
    accuracy = round((correct / total) * 100, 2)

    conceptual_score = (
        (conceptual / conceptual_total) * 100 if conceptual_total else 0
    )

    logical_score = (
        (logical / logical_total) * 100 if logical_total else 0
    )

    speed_score = max(0, min(100, (60 / avg_time) * 100))

    return {
        "accuracy": accuracy,
        "conceptual_score": round(conceptual_score, 2),
        "logical_score": round(logical_score, 2),
        "speed_score": round(speed_score, 2),
        "avg_time": round(avg_time, 2)
    }
