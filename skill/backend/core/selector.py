import random
import math

DIFFICULTY_RATIO = {
    "Easy": 0.4,
    "Medium": 0.4,
    "Hard": 0.2
}

CORE_TOPICS = [
    ["Arrays"],
    ["Recursion"],
    ["Stack", "Queue"],
    ["Trees", "Graphs"],
    ["Complexity"]
]


def select_questions(dataset, blueprint, time_limit, difficulty_mode="Mixed"):
    selected = []

    # -------- STEP 1: Difficulty-based selection --------
    for qtype, total_count in blueprint.items():

        pool = [q for q in dataset if q["question_type"] == qtype]
        type_selected = []

        if difficulty_mode == "Mixed":
            for level, ratio in DIFFICULTY_RATIO.items():
                take = max(1, math.floor(total_count * ratio))
                level_pool = [q for q in pool if q["difficulty"] == level]
                random.shuffle(level_pool)
                type_selected.extend(level_pool[:take])
        else:
            level_pool = [q for q in pool if q["difficulty"] == difficulty_mode]
            random.shuffle(level_pool)
            type_selected.extend(level_pool[:total_count])

        # Ensure exact count
        if len(type_selected) < total_count:
            remaining = [q for q in pool if q not in type_selected]
            random.shuffle(remaining)
            type_selected.extend(remaining[: total_count - len(type_selected)])

        selected.extend(type_selected[:total_count])

    # -------- STEP 2: Topic Coverage Enforcement --------
    present_topics = {q["topic"] for q in selected}

    for topic_group in CORE_TOPICS:
        if not any(t in present_topics for t in topic_group):

            candidate = next(
                (q for q in dataset if q["topic"] in topic_group),
                None
            )

            if candidate:
                lowest = min(
                    selected,
                    key=lambda q: q.get("evaluation", {}).get("weight", 1)
                )
                selected.remove(lowest)
                selected.append(candidate)
                present_topics.add(candidate["topic"])

    # -------- STEP 3: Time Enforcement --------
    def total_time(qs):
        return sum(q.get("evaluation", {}).get("max_time_sec", 60) for q in qs)

    current_time = total_time(selected)
    max_attempts = 50
    attempts = 0

    while current_time > time_limit and attempts < max_attempts:
        attempts += 1

        worst = max(
            selected,
            key=lambda q: q.get("evaluation", {}).get("max_time_sec", 60)
        )

        worst_time = worst.get("evaluation", {}).get("max_time_sec", 60)

        candidates = [
            q for q in dataset
            if q["question_type"] == worst["question_type"]
            and q not in selected
            and q.get("evaluation", {}).get("max_time_sec", 60) < worst_time
        ]

        if not candidates:
            break

        replacement = min(
            candidates,
            key=lambda q: q.get("evaluation", {}).get("max_time_sec", 60)
        )

        selected.remove(worst)
        selected.append(replacement)
        current_time = total_time(selected)

    return {
        "question_ids": [q["id"] for q in selected],
        "total_questions": len(selected),
        "total_time_sec": current_time,
        "difficulty_mode": difficulty_mode,
        "topics_covered": list({q["topic"] for q in selected})
    }