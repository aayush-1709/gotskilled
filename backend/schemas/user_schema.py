from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    location: str = ""
    profession: str = ""
    experience_years: int = Field(default=0, ge=0)
    skills: Dict[str, Any] = Field(default_factory=dict)
    risk_score: float = 0.0
    readiness_score: float = 0.0


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    location: Optional[str] = None
    profession: Optional[str] = None
    experience_years: Optional[int] = Field(default=None, ge=0)
    skills: Optional[Dict[str, Any]] = None
    risk_score: Optional[float] = None
    readiness_score: Optional[float] = None


class UserIntakeRequest(BaseModel):
    user_id: str
    raw_text: str = Field(min_length=1)


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    location: str
    profession: str
    experience_years: int
    skills: Dict[str, Any]
    risk_score: float
    readiness_score: float

    class Config:
        from_attributes = True

