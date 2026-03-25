from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class StatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"


class TaskCreate(BaseModel):
    """Schema for creating a new study session."""
    subject: str = Field(..., example="Mathematics", description="The subject to study")
    topic: str = Field(..., example="Calculus - Integration", description="Specific topic")
    duration_minutes: int = Field(..., ge=1, example=60, description="Planned duration in minutes")
    status: StatusEnum = Field(default=StatusEnum.pending, description="Current status")

    model_config = {
        "json_schema_extra": {
            "example": {
                "subject": "Mathematics",
                "topic": "Calculus - Integration",
                "duration_minutes": 60,
                "status": "pending"
            }
        }
    }


class TaskUpdate(BaseModel):
    """Schema for updating an existing study session."""
    subject: Optional[str] = None
    topic: Optional[str] = None
    duration_minutes: Optional[int] = Field(default=None, ge=1)
    status: Optional[StatusEnum] = None


class Task(BaseModel):
    """Full task schema including the auto-generated ID."""
    id: int
    subject: str
    topic: str
    duration_minutes: int
    status: StatusEnum
