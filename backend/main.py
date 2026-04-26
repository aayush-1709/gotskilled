import json
import os
import logging
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None


class UserDataModel(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    skills: List[Dict[str, Any]] = Field(default_factory=list)
    risk: Dict[str, Any] = Field(default_factory=dict)
    opportunities: List[Dict[str, Any]] = Field(default_factory=list)


class ContextChatRequest(BaseModel):
    query: str
    context: str
    user_data: UserDataModel


class ContextChatResponse(BaseModel):
    response: str
    insight: str
    actions: List[str]


app = FastAPI(title="GotSkilled AI Backend")
logger = logging.getLogger("gotskilled.backend")
load_dotenv()
DEFAULT_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    if not os.getenv("GEMINI_API_KEY"):
        logger.warning("GEMINI_API_KEY is not configured. /ai/context-chat will return 500 until set.")
    if not os.getenv("GEMINI_MODEL"):
        logger.info("GEMINI_MODEL not set. Using fallback model order: %s", ", ".join(DEFAULT_MODELS))


def _build_prompt(payload: ContextChatRequest) -> str:
    return f"""
System:
You are an AI career and economic advisor helping users in low-resource environments.
You must answer in practical language and return only valid JSON.

Current page context: {payload.context}
User query: {payload.query}
User data:
{json.dumps(payload.user_data.model_dump(), indent=2)}

Return JSON with this shape:
{{
  "response": "concise answer for user",
  "insight": "explain why",
  "actions": ["short action 1", "short action 2", "short action 3"]
}}
"""


def _extract_json(text: str) -> Dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```json", "").replace("```", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in model output.")
    return json.loads(cleaned[start : end + 1])


@app.post("/ai/context-chat", response_model=ContextChatResponse)
async def context_chat(payload: ContextChatRequest) -> ContextChatResponse:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")
    if genai is None:
        raise HTTPException(status_code=500, detail="google-genai package is not installed.")

    try:
        client = genai.Client(api_key=gemini_api_key)
        configured_model = os.getenv("GEMINI_MODEL", "").strip()
        candidate_models = [configured_model] if configured_model else DEFAULT_MODELS

        result = None
        last_error: Exception | None = None
        for model_name in candidate_models:
            try:
                result = client.models.generate_content(
                    model=model_name,
                    contents=_build_prompt(payload),
                )
                break
            except Exception as model_error:
                last_error = model_error
                logger.warning("Gemini model '%s' failed: %s", model_name, model_error)

        if result is None:
            raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")

        text = result.text or ""
        parsed = _extract_json(text)
        return ContextChatResponse(
            response=str(parsed.get("response", "")).strip(),
            insight=str(parsed.get("insight", "")).strip(),
            actions=[str(item) for item in parsed.get("actions", [])][:3],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini request failed: {exc}") from exc

