import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="PlacementPilot AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
class InterviewRequest(BaseModel):
    role: str
    resume: str

class AnswerRequest(BaseModel):
    question: str
    answer: str
    role: str    

@app.get("/")
def home():
    return {"message": "PlacementPilot AI Backend Running"}

@app.post("/generate-questions")
def generate_questions(request: InterviewRequest):
    try:
        prompt = f"""
You are an expert technical interviewer.

Candidate Role:
{request.role}

Candidate Resume:
{request.resume}

Generate 5 technical interview questions based on the candidate's resume.

Rules:
- Focus on the technologies mentioned in the resume.
- Ask practical interview questions.
- Return only the questions.
- One question per line.
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        print("========== GEMINI RESPONSE ==========")
        print(response)
        print("=====================================")

        text = response.text

        questions = [
            q.strip("- ").strip()
            for q in text.split("\n")
            if q.strip()
        ]

        return {
            "role": request.role,
            "questions": questions
        }

    except Exception as e:
        import traceback
        traceback.print_exc()

        return {
            "success": False,
            "error": str(e)
        }


@app.post("/evaluate-answer")
def evaluate_answer(request: AnswerRequest):
    try:
        prompt = f"""
You are an expert technical interviewer.

Job Role:
{request.role}

Interview Question:
{request.question}

Candidate Answer:
{request.answer}

Evaluate the answer.

Return in this format:

Score: X/10

Strengths:
- ...

Weaknesses:
- ...

Correct Answer:
...
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        return {
            "evaluation": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }   