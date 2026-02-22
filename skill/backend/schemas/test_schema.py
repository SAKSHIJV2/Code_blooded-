from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class QuestionSchema(BaseModel):
    id: str
    track: str
    topic: str
    subtopic: str
    difficulty: str
    question_type: str
    question: str

    options: Optional[List[str]] = []
    code: Optional[str] = None   # 🔥 ADD THIS LINE

    correct_answer: Optional[List[str]] = None
    ideal_answer: Optional[str] = None
    expected_keywords: Optional[List[str]] = None
    user_explanation_required: Optional[bool] = None
    evaluation: Optional[Dict[str, Any]] = None


class GenerateTestResponse(BaseModel):
    test_meta: Dict[str, Any]
    questions: List[QuestionSchema]