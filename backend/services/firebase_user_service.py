from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional
import uuid

from firebase_config import get_firestore_client


USERS_COLLECTION = "users"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _users_ref():
    db = get_firestore_client()
    return db.collection(USERS_COLLECTION)


def create_user(data: Dict[str, Any]) -> Dict[str, Any]:
    user_id = data.get("user_id") or str(uuid.uuid4())
    now = _now_iso()
    payload = {
        "user_id": user_id,
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "location": data.get("location", ""),
        "profession": data.get("profession", ""),
        "experience_years": int(data.get("experience_years", 0)),
        "skills": data.get("skills", []),
        "risk_score": float(data.get("risk_score", 0.0)),
        "readiness_score": float(data.get("readiness_score", 0.0)),
        "narrative": data.get("narrative", ""),
        "created_at": now,
        "updated_at": now,
    }
    _users_ref().document(user_id).set(payload)
    return payload


def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    doc = _users_ref().document(user_id).get()
    if not doc.exists:
        return None
    return doc.to_dict()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    docs = _users_ref().where("email", "==", email).limit(1).stream()
    for doc in docs:
        if doc.exists:
            return doc.to_dict()
    return None


def update_user(user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    existing = get_user(user_id)
    if not existing:
        return None
    next_doc = dict(existing)
    for key, value in updates.items():
        if value is None:
            continue
        if key == "skills":
            current_skills = next_doc.get("skills", [])
            if isinstance(current_skills, list) and isinstance(value, list):
                by_name: Dict[str, Dict[str, Any]] = {}
                for item in current_skills:
                    if isinstance(item, dict) and item.get("name"):
                        by_name[item["name"]] = item
                for item in value:
                    if isinstance(item, dict) and item.get("name"):
                        by_name[item["name"]] = {**by_name.get(item["name"], {}), **item}
                next_doc["skills"] = list(by_name.values())
            else:
                next_doc["skills"] = value
            continue
        next_doc[key] = value
    next_doc["updated_at"] = _now_iso()
    _users_ref().document(user_id).set(next_doc)
    return next_doc


def delete_user(user_id: str) -> bool:
    existing = get_user(user_id)
    if not existing:
        return False
    _users_ref().document(user_id).delete()
    return True

