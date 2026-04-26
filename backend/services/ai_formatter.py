from typing import Any, Dict, List

SYSTEM_PROMPT = (
    "You are an AI career and economic advisor helping users make real-world decisions. "
    "Your responses must always include: "
    "Insight (clear conclusion), Reason (data-backed explanation), "
    "and Actions (practical next steps). "
    "Keep language simple, concise, and actionable. Return valid JSON only."
)

CONTEXT_PROMPTS: Dict[str, str] = {
    "profile": "Focus on strengths, weaknesses, and improvement areas.",
    "skills": "Focus on economic value, demand, and growth potential.",
    "jobs": "Focus on job selection, skill gaps, and readiness.",
    "future": "Focus on projections, best path, and risk reduction.",
    "policy": "Focus on impact, recommendations, and decisions.",
    "general": "Focus on immediate decisions and next best actions.",
}


def context_prompt(context: str) -> str:
    return CONTEXT_PROMPTS.get(context, CONTEXT_PROMPTS["general"])


def validate_ai_structure(payload: Dict[str, Any]) -> bool:
    if not isinstance(payload, dict):
        return False
    if "insight" not in payload or "reason" not in payload:
        return False
    actions = payload.get("actions", [])
    return isinstance(actions, list)


def format_ai_response(
    payload: Dict[str, Any] | None,
    fallback_insight: str,
    fallback_reason: str,
    fallback_actions: List[str],
) -> Dict[str, Any]:
    payload = payload or {}
    insight = str(payload.get("insight", "")).strip() or fallback_insight
    reason = str(payload.get("reason", "")).strip() or fallback_reason
    actions_raw = payload.get("actions", fallback_actions)
    actions = [str(action).strip() for action in actions_raw if str(action).strip()] if isinstance(actions_raw, list) else []
    if not actions:
        actions = fallback_actions
    return {
        "insight": insight,
        "reason": reason,
        "actions": actions[:3],
    }

