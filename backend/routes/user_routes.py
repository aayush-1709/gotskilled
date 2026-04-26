import re
from typing import Any, Dict, List
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status

from schemas.user_schema import UserCreate, UserIntakeRequest, UserResponse, UserUpdate
from services.firebase_user_service import create_user, delete_user, get_user, get_user_by_email, update_user

router = APIRouter(prefix="/user", tags=["users"])


def _extract_experience_years(text: str) -> int | None:
    match = re.search(r"(\d+)\s*(?:\+)?\s*(?:years?|yrs?)", text, re.IGNORECASE)
    if not match:
        return None
    value = int(match.group(1))
    return value if value >= 0 else None


def _extract_skills(text: str) -> List[Dict[str, str]]:
    known_skills = [
        "electrical wiring",
        "cloud computing",
        "cybersecurity",
        "data science",
        "industrial automation",
        "logistics management",
        "product management",
        "construction",
        "hvac systems",
        "software engineering",
        "devops",
        "welding",
        "cnc operations",
    ]
    lowered = text.lower()
    extracted: List[Dict[str, str]] = []
    seen: set[str] = set()
    for skill in known_skills:
        if skill in lowered:
            item = {
                "name": skill.title(),
                "level": "Intermediate",
            }
            if item["name"] not in seen:
                extracted.append(item)
                seen.add(item["name"])
    if not extracted:
        extracted.append({
            "name": "General Technical Skills",
            "level": "Beginner",
        })
    return extracted


def _to_response(user_doc: Dict[str, Any]) -> UserResponse:
    skills_raw = user_doc.get("skills", [])
    skills_map: Dict[str, Dict[str, str]] = {}
    for item in skills_raw if isinstance(skills_raw, list) else []:
        if isinstance(item, dict) and item.get("name"):
            skills_map[item["name"]] = {
                "level": str(item.get("level", "Intermediate")),
                "demand": str(item.get("demand", "High")),
                "growth": str(item.get("growth", "+10%")),
            }
    return UserResponse(
        id=user_doc["user_id"],
        name=user_doc.get("name", ""),
        email=user_doc.get("email", ""),
        location=user_doc.get("location", ""),
        profession=user_doc.get("profession", ""),
        experience_years=int(user_doc.get("experience_years", 0)),
        skills=skills_map,
        risk_score=float(user_doc.get("risk_score", 0.0)),
        readiness_score=float(user_doc.get("readiness_score", 0.0)),
    )


def _build_intake_summary(raw_text: str) -> str:
    clean = " ".join(raw_text.strip().split())
    return clean[:280] if len(clean) > 280 else clean


@router.post("/create", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(payload: UserCreate) -> UserResponse:
    try:
        if get_user_by_email(payload.email):
            raise HTTPException(status_code=409, detail="User with this email already exists.")
        user = create_user({
            "user_id": str(uuid4()),
            **payload.model_dump(),
            "skills": [
                {"name": key, **(value if isinstance(value, dict) else {})}
                for key, value in payload.skills.items()
            ],
        })
        return _to_response(user)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Firestore error while creating user: {exc}") from exc


@router.get("/{user_id}", response_model=UserResponse)
def get_user_endpoint(user_id: str) -> UserResponse:
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return _to_response(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user_endpoint(user_id: str, payload: UserUpdate) -> UserResponse:
    try:
        updates = payload.model_dump(exclude_unset=True)
        if isinstance(updates.get("skills"), dict):
            updates["skills"] = [
                {"name": key, **(value if isinstance(value, dict) else {})}
                for key, value in updates["skills"].items()
            ]
        user = update_user(user_id, updates)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return _to_response(user)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Firestore error while updating user: {exc}") from exc


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(user_id: str) -> None:
    try:
        deleted = delete_user(user_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="User not found.")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Firestore error while deleting user: {exc}") from exc


@router.post("/intake", response_model=UserResponse)
def user_intake_endpoint(payload: UserIntakeRequest) -> UserResponse:
    user = get_user(payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    experience_years = _extract_experience_years(payload.raw_text)
    extracted_skills = _extract_skills(payload.raw_text)
    readiness_score = min(100.0, 45.0 + (len(extracted_skills) * 8.0))
    risk_score = max(5.0, 70.0 - (len(extracted_skills) * 5.0))

    updates: Dict[str, Any] = {
        "skills": extracted_skills,
        "readiness_score": readiness_score,
        "risk_score": risk_score,
        "narrative": payload.raw_text.strip(),
        "ai_summary": _build_intake_summary(payload.raw_text),
    }
    if experience_years is not None:
        updates["experience_years"] = experience_years

    try:
        updated = update_user(payload.user_id, updates)
        if not updated:
            raise HTTPException(status_code=404, detail="User not found.")
        return _to_response(updated)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Firestore error while processing intake: {exc}") from exc

