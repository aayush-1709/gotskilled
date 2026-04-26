import json
import os
import logging
import base64
import re
from io import BytesIO
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from services.ai_formatter import SYSTEM_PROMPT, context_prompt, format_ai_response
from services.gemini_service import generate_json_with_rotation
from routes import user_router

try:
    import qrcode
except ImportError:
    qrcode = None


class UserDataModel(BaseModel):
    profile: Dict[str, Any] = Field(default_factory=dict)
    skills: List[Dict[str, Any]] = Field(default_factory=list)
    risk: Dict[str, Any] = Field(default_factory=dict)
    opportunities: List[Dict[str, Any]] = Field(default_factory=list)


class ContextChatRequest(BaseModel):
    query: str
    context: str
    user_data: UserDataModel


class AIChatRequest(BaseModel):
    message: str
    context: str = "general"
    user_data: UserDataModel = Field(default_factory=UserDataModel)


class ContextChatResponse(BaseModel):
    response: str
    insight: str
    reason: str
    actions: List[str]


class JobRequest(BaseModel):
    job_id: int
    user_skills: List[str] = Field(default_factory=list)
    job_title: str = ""
    required_skills: List[str] = Field(default_factory=list)


class JobSimulationResponse(BaseModel):
    selection_probability: int
    missing_skills: List[str]
    tips: List[str]
    insight: str = ""
    reason: str = ""
    actions: List[str] = Field(default_factory=list)


class SkillGapResponse(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    gap_percentage: int
    insight: str = ""
    reason: str = ""
    actions: List[str] = Field(default_factory=list)


class UpskillPathResponse(BaseModel):
    recommended_skills: List[str]
    time_estimates: List[str]
    improved_match: int
    insight: str = ""
    reason: str = ""
    actions: List[str] = Field(default_factory=list)


class PublicUserProfileResponse(BaseModel):
    user_info: Dict[str, Any]
    skills: List[Dict[str, Any]]
    confidence_scores: Dict[str, int]
    reliability_score: int
    risk_score: int
    fit_score: int
    proof_of_skill: Dict[str, Any]
    passport_id: str
    profile_url: str
    qr_code_data_url: str


class MapRecommendRequest(BaseModel):
    user_skills: List[str] = Field(default_factory=list)
    current_location: str


class MapLocationRecommendation(BaseModel):
    location: str
    opportunity_score: int
    income_range: str
    demand: str
    top_jobs: List[str] = Field(default_factory=list)
    risk_level: str = "Medium"
    latitude: float = 0
    longitude: float = 0


class PolicySkillGapItem(BaseModel):
    region: str
    missing_skills: List[str]
    severity: str
    demand_supply_mismatch: int


class PolicyRiskClusterItem(BaseModel):
    region: str
    risk_percentage: int
    level: str


class PolicySimulationRequest(BaseModel):
    region: str
    policy_type: str


class PolicySimulationResponse(BaseModel):
    unemployment_change: int
    risk_reduction: int
    income_increase: int
    insight: str
    reason: str
    actions: List[str]


class ProfileUpdateAIRequest(BaseModel):
    raw_text: str


class ProfileUpdateAIResponse(BaseModel):
    extracted_profile_data: Dict[str, Any]


class FutureAnalysisRequest(BaseModel):
    user_skills: List[str] = Field(default_factory=list)
    job_domain: str
    horizon: str = "now"


class FutureAnalysisResponse(BaseModel):
    risk_score: int
    domain_alignment: int
    suggestions: List[str]
    insight: str
    reason: str
    actions: List[str]


app = FastAPI(title="GotSkilled AI Backend")
app.include_router(user_router)
logger = logging.getLogger("gotskilled.backend")
load_dotenv()
DEFAULT_MODELS = ["gemini-2.5-flash"]
JOB_SKILLS_MAP: Dict[int, List[str]] = {
    1: ["Hardware Diagnosis", "Screen Replacement", "Customer Service"],
    2: ["Board Repair", "Battery Systems", "Troubleshooting"],
    3: ["Soldering", "Circuit Testing", "Repair QA"],
    4: ["Display Replacement", "Issue Intake", "Software Reset"],
    5: ["Team Coordination", "Board Diagnostics", "Customer Handling"],
    6: ["Device Testing", "Repair Workflow", "Parts Grading"],
    7: ["Warranty Process", "Fault Logging", "Hardware Repair"],
    8: ["Micro-Soldering", "Board Diagnostics", "Power Line Testing"],
    9: ["On-site Repair", "Customer Service", "Fault Isolation"],
    10: ["Advanced Troubleshooting", "Mentoring", "Repair Strategy"],
}
LOCATION_COORDS: Dict[str, Dict[str, float]] = {
    "Lucknow, India": {"latitude": 26.8467, "longitude": 80.9462},
    "Bangalore, India": {"latitude": 12.9716, "longitude": 77.5946},
    "Pune, India": {"latitude": 18.5204, "longitude": 73.8567},
    "Hyderabad, India": {"latitude": 17.3850, "longitude": 78.4867},
    "Dubai, UAE": {"latitude": 25.2048, "longitude": 55.2708},
    "Abu Dhabi, UAE": {"latitude": 24.4539, "longitude": 54.3773},
    "Doha, Qatar": {"latitude": 25.2854, "longitude": 51.5310},
    "Lagos, Nigeria": {"latitude": 6.5244, "longitude": 3.3792},
}
BASE_HEATMAP: Dict[str, int] = {
    "India": 75,
    "UAE": 82,
    "Qatar": 74,
    "Nigeria": 55,
    "Saudi Arabia": 77,
}
POLICY_SKILL_GAP_DATA: List[PolicySkillGapItem] = [
    PolicySkillGapItem(region="California", missing_skills=["AI/ML Engineering", "Cloud Computing", "Cybersecurity", "Data Science"], severity="High", demand_supply_mismatch=85),
    PolicySkillGapItem(region="Texas", missing_skills=["Oil & Energy Tech", "Industrial Automation", "Electrical Systems", "Logistics Management"], severity="High", demand_supply_mismatch=78),
    PolicySkillGapItem(region="New York", missing_skills=["Financial Technology", "Data Analytics", "Cybersecurity", "Product Management"], severity="High", demand_supply_mismatch=82),
    PolicySkillGapItem(region="Florida", missing_skills=["Tourism Management", "Healthcare Support", "Construction", "HVAC Systems"], severity="Medium", demand_supply_mismatch=70),
    PolicySkillGapItem(region="Illinois", missing_skills=["Manufacturing Automation", "Supply Chain", "Robotics", "Mechanical Systems"], severity="Medium", demand_supply_mismatch=75),
    PolicySkillGapItem(region="Washington", missing_skills=["Cloud Architecture", "Software Engineering", "AI Systems", "DevOps"], severity="High", demand_supply_mismatch=80),
    PolicySkillGapItem(region="Ohio", missing_skills=["Automotive Tech", "Industrial Maintenance", "Welding", "CNC Operations"], severity="Medium", demand_supply_mismatch=68),
    PolicySkillGapItem(region="Georgia", missing_skills=["Logistics", "Warehouse Automation", "Electrical Work", "Construction"], severity="Medium", demand_supply_mismatch=72),
]
POLICY_RISK_CLUSTER_DATA: List[PolicyRiskClusterItem] = [
    PolicyRiskClusterItem(region="California", risk_percentage=65, level="Medium"),
    PolicyRiskClusterItem(region="Texas", risk_percentage=72, level="High"),
    PolicyRiskClusterItem(region="New York", risk_percentage=60, level="Medium"),
    PolicyRiskClusterItem(region="Florida", risk_percentage=75, level="High"),
    PolicyRiskClusterItem(region="Illinois", risk_percentage=55, level="Medium"),
    PolicyRiskClusterItem(region="Ohio", risk_percentage=68, level="High"),
    PolicyRiskClusterItem(region="Georgia", risk_percentage=70, level="High"),
    PolicyRiskClusterItem(region="Washington", risk_percentage=50, level="Low"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    key_groups = {
        "chat": ["GEMINI_KEYS_CHAT", "GEMINI_API_KEY_CHAT"],
        "jobs": ["GEMINI_KEYS_JOBS", "GEMINI_API_KEY_JOBS"],
        "map": ["GEMINI_KEYS_MAP", "GEMINI_API_KEY_MAP"],
        "policy": ["GEMINI_KEYS_POLICY", "GEMINI_API_KEY_POLICY"],
        "future": ["GEMINI_KEYS_FUTURE", "GEMINI_API_KEY_FUTURE"],
    }
    has_global = bool(os.getenv("GEMINI_KEYS") or os.getenv("GEMINI_API_KEY"))
    for use_case, envs in key_groups.items():
        has_specific = any(os.getenv(env_name) for env_name in envs)
        if not has_specific and not has_global:
            logger.warning(
                "No Gemini keys configured for '%s'. Set one of %s or fallback GEMINI_KEYS/GEMINI_API_KEY.",
                use_case,
                ", ".join(envs),
            )
    if not os.getenv("GEMINI_MODEL"):
        logger.info("GEMINI_MODEL not set. Using fallback model order: %s", ", ".join(DEFAULT_MODELS))


def _build_prompt(payload: ContextChatRequest) -> str:
    return f"""
System:
{SYSTEM_PROMPT}
{context_prompt(payload.context)}

Current page context: {payload.context}
User query: {payload.query}
User data:
{json.dumps(payload.user_data.model_dump(), indent=2)}

Return JSON with this shape:
{{
  "insight": "clear conclusion",
  "reason": "why this is happening",
  "actions": ["short action 1", "short action 2", "short action 3"]
}}
"""


def _call_gemini_json(prompt: str, use_case: str = "default") -> Any:
    configured_model = os.getenv("GEMINI_MODEL", "").strip()
    candidate_models = [configured_model] if configured_model else DEFAULT_MODELS
    return generate_json_with_rotation(prompt, candidate_models, use_case=use_case)


def _normalize_skills(skills: List[str]) -> List[str]:
    deduped: List[str] = []
    seen = set()
    for skill in skills:
        cleaned = skill.strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(cleaned)
    return deduped


def _resolve_required_skills(payload: JobRequest) -> List[str]:
    if payload.required_skills:
        return _normalize_skills(payload.required_skills)
    return JOB_SKILLS_MAP.get(payload.job_id, ["Troubleshooting", "Customer Support", "Diagnostics"])


def _fallback_skill_gap(payload: JobRequest) -> SkillGapResponse:
    required = _resolve_required_skills(payload)
    user_skills = _normalize_skills(payload.user_skills)
    user_set = {skill.lower() for skill in user_skills}
    matched = [skill for skill in required if skill.lower() in user_set]
    missing = [skill for skill in required if skill.lower() not in user_set]
    gap = round((len(missing) / max(len(required), 1)) * 100)
    return SkillGapResponse(matched_skills=matched, missing_skills=missing, gap_percentage=gap)


def _fallback_simulation(payload: JobRequest) -> JobSimulationResponse:
    gap = _fallback_skill_gap(payload)
    probability = max(20, min(92, 92 - int(gap.gap_percentage * 0.9)))
    tips = [
        "Use STAR format to explain one real troubleshooting case.",
        "Show customer handling examples with measurable outcomes.",
        "Prepare a short explanation of your diagnostic workflow.",
    ]
    return JobSimulationResponse(
        selection_probability=probability,
        missing_skills=gap.missing_skills[:4],
        tips=tips[:3],
    )


def _fallback_upskill(payload: JobRequest) -> UpskillPathResponse:
    gap = _fallback_skill_gap(payload)
    rec = gap.missing_skills[:3] or ["Advanced Troubleshooting", "Service Documentation"]
    estimates = ["2 weeks" if len(skill) > 12 else "1 week" for skill in rec]
    improved = min(95, max(70, 100 - max(gap.gap_percentage - 20, 5)))
    return UpskillPathResponse(
        recommended_skills=rec,
        time_estimates=estimates,
        improved_match=improved,
    )


def _slugify_name(value: str) -> str:
    letters = "".join(ch for ch in value.upper() if ch.isalpha())
    return (letters[:3] or "USR").ljust(3, "X")


def _build_passport_id(name: str, location: str) -> str:
    region = "IND" if "india" in location.lower() else "GLB"
    signature = sum(ord(char) for char in f"{name}-{location}") % 90000 + 10000
    return f"{_slugify_name(name)}-{region}-{signature}"


def _build_qr_data_url(url: str) -> str:
    if qrcode is None:
        return f"https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={url}"

    qr = qrcode.QRCode(box_size=8, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


def _fallback_recommendations(payload: MapRecommendRequest) -> List[MapLocationRecommendation]:
    skills = " ".join(_normalize_skills(payload.user_skills)).lower()
    has_hardware = "hardware" in skills or "repair" in skills or "diagnosis" in skills
    has_support = "support" in skills or "customer" in skills or "service" in skills
    base = [
        {
            "location": "Bangalore, India",
            "opportunity_score": 86 if has_hardware else 80,
            "income_range": "30000-60000",
            "demand": "High",
            "top_jobs": ["Device Service Engineer", "Hardware Technician", "Field Support Associate"],
            "risk_level": "Low",
        },
        {
            "location": "Dubai, UAE",
            "opportunity_score": 79 if has_support else 76,
            "income_range": "50000-90000",
            "demand": "Medium",
            "top_jobs": ["Electronics Support Specialist", "Service Center Advisor", "Technical Operations Associate"],
            "risk_level": "Medium",
        },
        {
            "location": "Hyderabad, India",
            "opportunity_score": 78,
            "income_range": "28000-52000",
            "demand": "High" if has_hardware else "Medium",
            "top_jobs": ["Repair QA Technician", "Service Desk Technician", "Diagnostics Associate"],
            "risk_level": "Low",
        },
        {
            "location": "Doha, Qatar",
            "opportunity_score": 72,
            "income_range": "45000-80000",
            "demand": "Medium",
            "top_jobs": ["Field Service Technician", "Warranty Technician", "Customer Technical Advisor"],
            "risk_level": "Medium",
        },
    ]
    results: List[MapLocationRecommendation] = []
    for item in base:
        coords = LOCATION_COORDS.get(item["location"], {"latitude": 0, "longitude": 0})
        results.append(
            MapLocationRecommendation(
                location=item["location"],
                opportunity_score=item["opportunity_score"],
                income_range=item["income_range"],
                demand=item["demand"],
                top_jobs=item["top_jobs"],
                risk_level=item["risk_level"],
                latitude=coords["latitude"],
                longitude=coords["longitude"],
            )
        )
    return results


def _fallback_policy_simulation(payload: PolicySimulationRequest) -> PolicySimulationResponse:
    policy = payload.policy_type.lower()
    base_unemployment_drop = 8
    base_risk_reduction = 12
    base_income_increase = 10

    if "skill" in policy:
        base_unemployment_drop += 4
        base_risk_reduction += 8
        base_income_increase += 12
    if "education" in policy:
        base_unemployment_drop += 3
        base_risk_reduction += 5
        base_income_increase += 8
    if "digital" in policy:
        base_unemployment_drop += 2
        base_risk_reduction += 6
        base_income_increase += 10

    is_high_risk_region = any(item.region.lower() == payload.region.lower() and item.level == "High" for item in POLICY_RISK_CLUSTER_DATA)
    if is_high_risk_region:
        base_unemployment_drop += 2
        base_risk_reduction += 2

    return PolicySimulationResponse(
        unemployment_change=-base_unemployment_drop,
        risk_reduction=base_risk_reduction,
        income_increase=base_income_increase,
        insight=f"{payload.region} can gain quick employment momentum from targeted policy support.",
        reason="Current skill mismatch and youth vulnerability are both elevated in the selected region.",
        actions=[
            f"Prioritize '{payload.policy_type}' with local training partners.",
            "Set quarterly employment and income targets.",
            "Track youth risk reduction with district dashboards.",
        ],
    )


def _extract_experience_years(text: str) -> int | None:
    patterns = [
        r"(\d+)\s*\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)",
        r"experience\s*(?:of|:)?\s*(\d+)\s*\+?\s*(?:years?|yrs?)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return int(match.group(1))
    return None


def _extract_domain(text: str) -> str | None:
    domain_patterns = [
        r"in\s+([a-zA-Z][a-zA-Z\s]{2,40})",
        r"domain\s*(?:is|:)?\s*([a-zA-Z][a-zA-Z\s]{2,40})",
        r"work(?:ing)?\s+as\s+(?:an?\s+)?([a-zA-Z][a-zA-Z\s]{2,40})",
    ]
    for pattern in domain_patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            candidate = match.group(1).strip(" .,-")
            if len(candidate.split()) <= 5:
                return candidate.title()
    return None


def _extract_skills(text: str) -> List[str]:
    lowered = text.lower()
    skill_catalog = {
        "mobile repair": ["mobile repair", "phone repair", "device repair"],
        "customer handling": ["customer handling", "customer support", "customer service"],
        "diagnostics": ["diagnostics", "troubleshooting", "fault finding"],
        "networking": ["networking", "router setup", "network support"],
        "software debugging": ["software debugging", "debugging", "software troubleshooting"],
        "soldering": ["soldering", "micro-soldering"],
        "hardware diagnosis": ["hardware diagnosis", "hardware troubleshooting"],
        "team coordination": ["team coordination", "team management", "supervision"],
    }
    extracted: List[str] = []
    for skill_name, phrases in skill_catalog.items():
        if any(phrase in lowered for phrase in phrases):
            extracted.append(skill_name.title())

    # Fallback phrase extraction from "skills like x, y and z"
    phrase_match = re.search(r"(?:skills?|experience)\s*(?:in|with|like)\s+([a-zA-Z,\s]+)", text, flags=re.IGNORECASE)
    if phrase_match:
        raw = phrase_match.group(1)
        for part in re.split(r",| and ", raw):
            cleaned = part.strip(" .,-")
            if cleaned and len(cleaned.split()) <= 4 and cleaned.lower() not in {"experience", "skills"}:
                candidate = cleaned.title()
                if candidate not in extracted:
                    extracted.append(candidate)
    return extracted[:8]


def _extract_profile_data_rule_based(raw_text: str) -> Dict[str, Any]:
    cleaned_text = re.sub(r"\s+", " ", raw_text).strip()
    experience = _extract_experience_years(cleaned_text)
    domain = _extract_domain(cleaned_text)
    skills = _extract_skills(cleaned_text)
    return {
        "summary": cleaned_text[:240],
        "skills": skills,
        "experience": experience,
        "domain": domain,
    }


def _fallback_future_analysis(payload: FutureAnalysisRequest) -> FutureAnalysisResponse:
    normalized = [skill.lower() for skill in payload.user_skills]
    domain_terms = payload.job_domain.lower().split()
    domain_hits = sum(1 for skill in normalized if any(term in skill for term in domain_terms))
    horizon_bias = {
        "now": 0,
        "6_months": 3,
        "1_year": 6,
        "3_years": 12,
    }.get(payload.horizon, 0)
    domain_alignment = max(35, min(95, 45 + (domain_hits * 12) - (horizon_bias // 2)))
    risk_score = max(12, min(85, 75 - domain_alignment + max(0, 35 - len(normalized) * 4) + horizon_bias))
    suggestions = [
        "Add one advanced domain certification",
        "Practice high-complexity troubleshooting tasks weekly",
        "Improve digital workflow and reporting skills",
    ]

    formatted = format_ai_response(
        {},
        fallback_insight=f"Your future-readiness in {payload.job_domain} is moderate with clear room to improve.",
        fallback_reason="Current skills show practical strength, but depth in advanced and digital capabilities is limited.",
        fallback_actions=["Take one high-impact course this month", "Build proof through practical projects", "Re-check readiness after 30 days"],
    )
    return FutureAnalysisResponse(
        risk_score=risk_score,
        domain_alignment=domain_alignment,
        suggestions=suggestions,
        insight=formatted["insight"],
        reason=formatted["reason"],
        actions=formatted["actions"],
    )


@app.post("/ai/context-chat", response_model=ContextChatResponse)
async def context_chat(payload: ContextChatRequest) -> ContextChatResponse:
    try:
        parsed = _call_gemini_json(_build_prompt(payload), use_case="chat")
        formatted = format_ai_response(
            parsed if isinstance(parsed, dict) else {},
            fallback_insight="You can improve outcomes by taking focused next steps in this area.",
            fallback_reason="Your profile and context indicate clear opportunities with manageable risks.",
            fallback_actions=["Prioritize one action this week", "Track progress weekly", "Review outcomes in 30 days"],
        )
        return ContextChatResponse(
            response=formatted["insight"],
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini request failed: {exc}") from exc


@app.post("/ai/chat", response_model=ContextChatResponse)
async def ai_chat(payload: AIChatRequest) -> ContextChatResponse:
    mapped_payload = ContextChatRequest(
        query=payload.message,
        context=payload.context,
        user_data=payload.user_data,
    )
    return await context_chat(mapped_payload)


@app.post("/jobs/skill-gap", response_model=SkillGapResponse)
async def jobs_skill_gap(payload: JobRequest) -> SkillGapResponse:
    fallback = _fallback_skill_gap(payload)
    prompt = f"""
You are an AI job-fit analyzer. Return only valid JSON.
Job title: {payload.job_title or 'Unknown role'}
Required skills: {_resolve_required_skills(payload)}
User skills: {_normalize_skills(payload.user_skills)}

Return JSON:
{{
  "matched_skills": ["..."],
  "missing_skills": ["..."],
  "gap_percentage": 0,
  "insight": "...",
  "reason": "...",
  "actions": ["...", "..."]
}}

Rules:
- Keep lists short and practical.
- gap_percentage must be 0-100.
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="jobs")
        parsed_dict = parsed if isinstance(parsed, dict) else {}
        formatted = format_ai_response(
            parsed_dict,
            fallback_insight="Skill mismatch is limiting job readiness.",
            fallback_reason="Required role skills are not fully covered by current skills.",
            fallback_actions=["Close top 2 missing skills", "Practice real tasks weekly", "Re-evaluate match after training"],
        )
        return SkillGapResponse(
            matched_skills=[str(x) for x in parsed_dict.get("matched_skills", [])][:8],
            missing_skills=[str(x) for x in parsed_dict.get("missing_skills", [])][:8],
            gap_percentage=max(0, min(100, int(parsed_dict.get("gap_percentage", fallback.gap_percentage)))),
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception:
        formatted = format_ai_response(
            {},
            fallback_insight="Skill mismatch is limiting job readiness.",
            fallback_reason="Required role skills are not fully covered by current skills.",
            fallback_actions=["Close top 2 missing skills", "Practice real tasks weekly", "Re-evaluate match after training"],
        )
        return SkillGapResponse(
            matched_skills=fallback.matched_skills,
            missing_skills=fallback.missing_skills,
            gap_percentage=fallback.gap_percentage,
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )


@app.post("/jobs/simulate", response_model=JobSimulationResponse)
async def jobs_simulate(payload: JobRequest) -> JobSimulationResponse:
    fallback = _fallback_simulation(payload)
    prompt = f"""
You are an AI hiring coach. Return only valid JSON.
Job title: {payload.job_title or 'Unknown role'}
Required skills: {_resolve_required_skills(payload)}
User skills: {_normalize_skills(payload.user_skills)}
Baseline probability from matching logic: {fallback.selection_probability}

Return JSON:
{{
  "selection_probability": 0,
  "missing_skills": ["..."],
  "tips": ["...", "...", "..."],
  "insight": "...",
  "reason": "...",
  "actions": ["...", "..."]
}}

Rules:
- selection_probability must be 1-99.
- tips should be short interview actions.
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="jobs")
        parsed_dict = parsed if isinstance(parsed, dict) else {}
        formatted = format_ai_response(
            parsed_dict,
            fallback_insight="Your chances improve with targeted preparation.",
            fallback_reason="Interview readiness and missing skills are reducing selection probability.",
            fallback_actions=["Prepare role-specific examples", "Address missing skills", "Practice interview scenarios"],
        )
        return JobSimulationResponse(
            selection_probability=max(1, min(99, int(parsed_dict.get("selection_probability", fallback.selection_probability)))),
            missing_skills=[str(x) for x in parsed_dict.get("missing_skills", fallback.missing_skills)][:5],
            tips=[str(x) for x in parsed_dict.get("tips", fallback.tips)][:3],
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception:
        formatted = format_ai_response(
            {},
            fallback_insight="Your chances improve with targeted preparation.",
            fallback_reason="Interview readiness and missing skills are reducing selection probability.",
            fallback_actions=["Prepare role-specific examples", "Address missing skills", "Practice interview scenarios"],
        )
        return JobSimulationResponse(
            selection_probability=fallback.selection_probability,
            missing_skills=fallback.missing_skills,
            tips=fallback.tips,
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )


@app.post("/jobs/upskill-path", response_model=UpskillPathResponse)
async def jobs_upskill_path(payload: JobRequest) -> UpskillPathResponse:
    fallback = _fallback_upskill(payload)
    prompt = f"""
You are an AI learning planner. Return only valid JSON.
Job title: {payload.job_title or 'Unknown role'}
Required skills: {_resolve_required_skills(payload)}
User skills: {_normalize_skills(payload.user_skills)}
Missing skills focus: {fallback.recommended_skills}

Return JSON:
{{
  "recommended_skills": ["..."],
  "time_estimates": ["1 week", "2 weeks"],
  "improved_match": 0,
  "insight": "...",
  "reason": "...",
  "actions": ["...", "..."]
}}

Rules:
- Keep recommended_skills and time_estimates aligned by index.
- improved_match should be realistic and between 1-99.
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="jobs")
        parsed_dict = parsed if isinstance(parsed, dict) else {}
        formatted = format_ai_response(
            parsed_dict,
            fallback_insight="A focused upskill path can significantly improve match.",
            fallback_reason="Specific missing skills are the main barrier to role fit.",
            fallback_actions=["Start with highest-impact skill", "Set weekly milestones", "Re-run match check in 2 weeks"],
        )
        recommended = [str(x) for x in parsed_dict.get("recommended_skills", fallback.recommended_skills)][:4]
        estimates = [str(x) for x in parsed_dict.get("time_estimates", fallback.time_estimates)][: len(recommended)]
        if len(estimates) < len(recommended):
            estimates.extend(["1 week"] * (len(recommended) - len(estimates)))
        return UpskillPathResponse(
            recommended_skills=recommended,
            time_estimates=estimates,
            improved_match=max(1, min(99, int(parsed_dict.get("improved_match", fallback.improved_match)))),
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception:
        formatted = format_ai_response(
            {},
            fallback_insight="A focused upskill path can significantly improve match.",
            fallback_reason="Specific missing skills are the main barrier to role fit.",
            fallback_actions=["Start with highest-impact skill", "Set weekly milestones", "Re-run match check in 2 weeks"],
        )
        return UpskillPathResponse(
            recommended_skills=fallback.recommended_skills,
            time_estimates=fallback.time_estimates,
            improved_match=fallback.improved_match,
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )


@app.get("/user/profile/{id}", response_model=PublicUserProfileResponse)
async def get_user_profile(id: str) -> PublicUserProfileResponse:
    sample_profile = {
        "name": "Imran Khan",
        "current_role": "Mobile Repair Shop Technician",
        "years_experience": 10,
        "location": "Lucknow, India",
        "education_level": "No formal degree",
    }
    confidence_scores = {
        "Mobile Hardware Repair": 93,
        "Software & OS Recovery": 84,
        "Customer Handling & Sales": 88,
        "Small Business Operations": 81,
    }
    reliability = min(100, max(45, int(sum(confidence_scores.values()) / len(confidence_scores))))
    risk = 32
    fit = min(100, max(50, int((reliability * 0.6) + ((100 - risk) * 0.4))))
    passport_id = _build_passport_id(sample_profile["name"], sample_profile["location"])
    profile_url = f"/profile/{id}"
    task_examples = [
        "Diagnose charging and audio faults",
        "Perform display and battery replacements",
        "Explain repair options and timelines to customers",
    ]

    proof_of_skill = {
        "task_count_label": "120+ real-world tasks described",
        "confidence_reason": "Confidence derived from repetition and hands-on task complexity.",
        "task_examples": task_examples,
    }

    return PublicUserProfileResponse(
        user_info=sample_profile,
        skills=[
            {"name": key, "confidence": value}
            for key, value in confidence_scores.items()
        ],
        confidence_scores=confidence_scores,
        reliability_score=reliability,
        risk_score=risk,
        fit_score=fit,
        proof_of_skill=proof_of_skill,
        passport_id=passport_id,
        profile_url=profile_url,
        qr_code_data_url=_build_qr_data_url(profile_url),
    )


@app.post("/map/recommend-locations", response_model=List[MapLocationRecommendation])
async def map_recommend_locations(payload: MapRecommendRequest) -> List[MapLocationRecommendation]:
    fallback = _fallback_recommendations(payload)
    prompt = f"""
You are an AI relocation advisor. Return only valid JSON.
User skills: {_normalize_skills(payload.user_skills)}
Current location: {payload.current_location}

Recommend 4 better locations and return this JSON shape:
[
  {{
    "location": "City, Country",
    "opportunity_score": 0,
    "income_range": "30000-60000",
    "demand": "High",
    "top_jobs": ["...", "..."],
    "risk_level": "Low"
  }}
]

Rules:
- opportunity_score must be integer 1-100
- demand must be High, Medium, or Low
- risk_level must be Low, Medium, or High
- keep income_range plain numeric range string
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="map")
        if not isinstance(parsed, list):
            return fallback

        recommendations: List[MapLocationRecommendation] = []
        for item in parsed[:5]:
            if not isinstance(item, dict):
                continue
            location = str(item.get("location", "")).strip()
            if not location:
                continue
            coords = LOCATION_COORDS.get(location, {"latitude": 0, "longitude": 0})
            recommendations.append(
                MapLocationRecommendation(
                    location=location,
                    opportunity_score=max(1, min(100, int(item.get("opportunity_score", 70)))),
                    income_range=str(item.get("income_range", "25000-50000")).strip(),
                    demand=str(item.get("demand", "Medium")).title(),
                    top_jobs=[str(job) for job in item.get("top_jobs", [])][:3],
                    risk_level=str(item.get("risk_level", "Medium")).title(),
                    latitude=coords["latitude"],
                    longitude=coords["longitude"],
                )
            )
        return recommendations or fallback
    except Exception:
        return fallback


@app.get("/map/heatmap-data", response_model=Dict[str, int])
async def map_heatmap_data() -> Dict[str, int]:
    prompt = """
You are an AI labor-market analyzer. Return only valid JSON object.
Provide opportunity scores (0-100) for key regions for a technical support and device repair profile.
Return JSON like:
{
  "India": 75,
  "UAE": 80,
  "Nigeria": 55,
  "Qatar": 72,
  "Saudi Arabia": 77
}
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="map")
        if not isinstance(parsed, dict):
            return BASE_HEATMAP
        normalized: Dict[str, int] = {}
        for key, value in parsed.items():
            normalized[str(key)] = max(0, min(100, int(value)))
        return normalized or BASE_HEATMAP
    except Exception:
        return BASE_HEATMAP


@app.get("/policy/skill-gap", response_model=List[PolicySkillGapItem])
async def policy_skill_gap() -> List[PolicySkillGapItem]:
    prompt = """
You are an AI policy labor analyst. Return only valid JSON array.
Provide region-wise skill gaps for USA states in this shape:
[
  {
    "region": "California",
    "missing_skills": ["AI/ML Engineering", "Cloud Computing"],
    "severity": "High",
    "demand_supply_mismatch": 85
  }
]
Rules:
- severity must be High, Medium, or Low
- demand_supply_mismatch must be 0-100
- provide 6-8 USA states
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="policy")
        if not isinstance(parsed, list):
            return POLICY_SKILL_GAP_DATA
        result: List[PolicySkillGapItem] = []
        for row in parsed[:6]:
            if not isinstance(row, dict):
                continue
            result.append(
                PolicySkillGapItem(
                    region=str(row.get("region", "Unknown")).strip(),
                    missing_skills=[str(skill) for skill in row.get("missing_skills", [])][:4],
                    severity=str(row.get("severity", "Medium")).title(),
                    demand_supply_mismatch=max(0, min(100, int(row.get("demand_supply_mismatch", 25)))),
                )
            )
        return result or POLICY_SKILL_GAP_DATA
    except Exception:
        return POLICY_SKILL_GAP_DATA


@app.get("/policy/risk-clusters", response_model=List[PolicyRiskClusterItem])
async def policy_risk_clusters() -> List[PolicyRiskClusterItem]:
    prompt = """
You are an AI youth employment risk analyst. Return only valid JSON array.
Return this shape:
[
  {
    "region": "Texas",
    "risk_percentage": 72,
    "level": "High"
  }
]
Rules:
- risk_percentage must be 0-100
- level must be High, Medium, or Low
- provide 6-8 USA states
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="policy")
        if not isinstance(parsed, list):
            return POLICY_RISK_CLUSTER_DATA
        result: List[PolicyRiskClusterItem] = []
        for row in parsed[:6]:
            if not isinstance(row, dict):
                continue
            result.append(
                PolicyRiskClusterItem(
                    region=str(row.get("region", "Unknown")).strip(),
                    risk_percentage=max(0, min(100, int(row.get("risk_percentage", 40)))),
                    level=str(row.get("level", "Medium")).title(),
                )
            )
        return result or POLICY_RISK_CLUSTER_DATA
    except Exception:
        return POLICY_RISK_CLUSTER_DATA


@app.post("/policy/simulate", response_model=PolicySimulationResponse)
async def policy_simulate(payload: PolicySimulationRequest) -> PolicySimulationResponse:
    fallback = _fallback_policy_simulation(payload)
    prompt = f"""
You are an AI policy simulation engine. Return only valid JSON object.
Region: {payload.region}
Policy action: {payload.policy_type}

Return shape:
{{
  "unemployment_change": -12,
  "risk_reduction": 20,
  "income_increase": 25,
  "insight": "what is happening",
  "reason": "why this happens",
  "actions": ["what to do next", "..."]
}}

Rules:
- unemployment_change should be integer (negative for reduction)
- risk_reduction and income_increase should be positive integer percentages
- keep insight/reason/actions short and practical
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="policy")
        if not isinstance(parsed, dict):
            return fallback
        formatted = format_ai_response(
            parsed,
            fallback_insight=fallback.insight,
            fallback_reason=fallback.reason,
            fallback_actions=fallback.actions,
        )
        return PolicySimulationResponse(
            unemployment_change=int(parsed.get("unemployment_change", fallback.unemployment_change)),
            risk_reduction=max(0, min(100, int(parsed.get("risk_reduction", fallback.risk_reduction)))),
            income_increase=max(0, min(100, int(parsed.get("income_increase", fallback.income_increase)))),
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception:
        return fallback


@app.post("/profile/update-ai", response_model=ProfileUpdateAIResponse)
async def profile_update_ai(payload: ProfileUpdateAIRequest) -> ProfileUpdateAIResponse:
    extracted = _extract_profile_data_rule_based(payload.raw_text)
    return ProfileUpdateAIResponse(extracted_profile_data=extracted)


@app.post("/future/analyze", response_model=FutureAnalysisResponse)
async def future_analyze(payload: FutureAnalysisRequest) -> FutureAnalysisResponse:
    fallback = _fallback_future_analysis(payload)
    prompt = f"""
{SYSTEM_PROMPT}
{context_prompt("future")}

Analyze future readiness for:
Job domain: {payload.job_domain}
User skills: {_normalize_skills(payload.user_skills)}
Timeline horizon: {payload.horizon}

Return JSON:
{{
  "risk_score": 0,
  "domain_alignment": 0,
  "suggestions": ["...", "...", "..."],
  "insight": "...",
  "reason": "...",
  "actions": ["...", "...", "..."]
}}

Rules:
- risk_score and domain_alignment are integers from 0-100
- suggestions and actions should be short and practical
"""
    try:
        parsed = _call_gemini_json(prompt, use_case="future")
        parsed_dict = parsed if isinstance(parsed, dict) else {}
        formatted = format_ai_response(
            parsed_dict,
            fallback_insight=fallback.insight,
            fallback_reason=fallback.reason,
            fallback_actions=fallback.actions,
        )
        return FutureAnalysisResponse(
            risk_score=max(0, min(100, int(parsed_dict.get("risk_score", fallback.risk_score)))),
            domain_alignment=max(0, min(100, int(parsed_dict.get("domain_alignment", fallback.domain_alignment)))),
            suggestions=[str(item) for item in parsed_dict.get("suggestions", fallback.suggestions)][:4],
            insight=formatted["insight"],
            reason=formatted["reason"],
            actions=formatted["actions"],
        )
    except Exception:
        return fallback

