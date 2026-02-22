def evaluate_mcq(question, user_answer):
    correct = set(question.get("correct_answer", []))
    user = set(user_answer or [])

    if user == correct:
        return {"score": 1.0, "feedback": "Correct"}
    return {"score": 0.0, "feedback": "Incorrect"}


def evaluate_msq(question, user_answer):
    correct = set(question.get("correct_answer", []))
    user = set(user_answer or [])

    if not correct:
        return {"score": 0.0, "feedback": "Invalid question"}

    matched = len(correct & user)
    score = matched / len(correct)

    return {
        "score": round(score, 2),
        "feedback": f"{matched}/{len(correct)} options correct"
    }


def evaluate_short_answer(question, user_answer):
    keywords = question.get("expected_keywords", [])
    answer_text = (user_answer or "").lower()

    matched = sum(1 for k in keywords if k.lower() in answer_text)
    score = matched / max(len(keywords), 1)

    return {
        "score": round(score, 2),
        "feedback": f"Covered {matched} key concepts"
    }


def evaluate_reasoning(question, user_answer):
    keywords = question.get("expected_keywords", [])
    answer_text = (user_answer or "").lower()

    matched = sum(1 for k in keywords if k.lower() in answer_text)
    score = matched / max(len(keywords), 1)

    return {
        "score": round(score, 2),
        "feedback": "Reasoning evaluated"
    }


def evaluate_code_trace(question, user_answer):
    correct_output = question.get("correct_answer", [""])[0]

    if isinstance(user_answer, dict):
        output = user_answer.get("output", "")
    else:
        output = user_answer

    if output == correct_output:
        return {"score": 1.0, "feedback": "Correct output"}

    return {"score": 0.0, "feedback": "Incorrect output"}


def evaluate_answer(question, user_answer):
    qtype = question.get("question_type")

    if qtype == "MCQ":
        return evaluate_mcq(question, user_answer)

    if qtype == "MSQ":
        return evaluate_msq(question, user_answer)

    if qtype == "CODE_TRACE":
        return evaluate_code_trace(question, user_answer)

    if qtype == "SHORT_ANSWER":
        return evaluate_short_answer(question, user_answer)

    if qtype == "REASONING":
        return evaluate_reasoning(question, user_answer)

    return {"score": 0.0, "feedback": "Unknown question type"}