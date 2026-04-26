import logging
import os
from threading import Lock
from typing import Any, Dict, List

try:
    from google import genai
except ImportError:
    genai = None

logger = logging.getLogger("gotskilled.backend.gemini")

_rotation_lock = Lock()
_current_key_index = 0


USE_CASE_KEY_ENV_ORDER: Dict[str, List[str]] = {
    "chat": ["GEMINI_KEYS_CHAT", "GEMINI_API_KEY_CHAT", "GEMINI_KEYS", "GEMINI_API_KEY"],
    "jobs": ["GEMINI_KEYS_JOBS", "GEMINI_API_KEY_JOBS", "GEMINI_KEYS", "GEMINI_API_KEY"],
    "map": ["GEMINI_KEYS_MAP", "GEMINI_API_KEY_MAP", "GEMINI_KEYS", "GEMINI_API_KEY"],
    "policy": ["GEMINI_KEYS_POLICY", "GEMINI_API_KEY_POLICY", "GEMINI_KEYS", "GEMINI_API_KEY"],
    "future": ["GEMINI_KEYS_FUTURE", "GEMINI_API_KEY_FUTURE", "GEMINI_KEYS", "GEMINI_API_KEY"],
    "default": ["GEMINI_KEYS", "GEMINI_API_KEY"],
}


def _parse_key_value(value: str) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _load_keys(use_case: str = "default") -> List[str]:
    env_order = USE_CASE_KEY_ENV_ORDER.get(use_case, USE_CASE_KEY_ENV_ORDER["default"])
    for env_name in env_order:
        parsed = _parse_key_value(os.getenv(env_name, "").strip())
        if parsed:
            return parsed
    return []


def _next_start_index(total: int) -> int:
    global _current_key_index
    with _rotation_lock:
        start = _current_key_index % total
        _current_key_index = (_current_key_index + 1) % total
    return start


def generate_json_with_rotation(
    prompt: str,
    candidate_models: List[str],
    use_case: str = "default",
) -> Dict[str, Any] | List[Any]:
    if genai is None:
        raise RuntimeError("google-genai package is not installed.")

    keys = _load_keys(use_case)
    if not keys:
        env_hint = ", ".join(USE_CASE_KEY_ENV_ORDER.get(use_case, USE_CASE_KEY_ENV_ORDER["default"]))
        raise RuntimeError(f"No Gemini keys configured for use_case='{use_case}'. Set one of: {env_hint}.")
    if not candidate_models:
        raise RuntimeError("No Gemini models provided.")

    start = _next_start_index(len(keys))
    ordered_keys = keys[start:] + keys[:start]
    last_error: Exception | None = None

    for key_idx, api_key in enumerate(ordered_keys):
        for model_name in candidate_models:
            try:
                client = genai.Client(api_key=api_key)
                result = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )
                text = (result.text or "").strip()
                if not text:
                    raise RuntimeError("Gemini returned empty response.")

                cleaned = text
                if cleaned.startswith("```"):
                    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

                array_start = cleaned.find("[")
                object_start = cleaned.find("{")
                if array_start != -1 and (object_start == -1 or array_start < object_start):
                    array_end = cleaned.rfind("]")
                    if array_end == -1:
                        raise ValueError("No JSON array found in model output.")
                    import json

                    return json.loads(cleaned[array_start : array_end + 1])

                start_idx = object_start
                end_idx = cleaned.rfind("}")
                if start_idx == -1 or end_idx == -1:
                    raise ValueError("No JSON object found in model output.")

                import json

                return json.loads(cleaned[start_idx : end_idx + 1])
            except Exception as exc:
                last_error = exc
                logger.warning(
                    "Gemini request failed (use_case=%s, key #%s, model=%s): %s",
                    use_case,
                    key_idx + 1,
                    model_name,
                    exc,
                )
                continue

    raise RuntimeError(f"All Gemini keys/models failed. Last error: {last_error}")

