from typing import Literal

from pydantic import BaseModel, Field


class DetectedFile(BaseModel):
    file_type: str = Field(description="Detected file category or scene type.")
    detailed_description: str = Field(description="Detailed visual description.")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence between 0 and 1.")


class CulturalAnalysis(BaseModel):
    ethnicity: str = Field(description="Most likely ethnic group.")
    clothing_features: list[str] = Field(default_factory=list)
    cultural_story: str = Field(description="Story or cultural background generated from the image.")
    recommended_culture_items: list[str] = Field(default_factory=list)
    caution: str = Field(
        default="The result is AI generated and should be verified for cultural sensitivity."
    )


class AnalyzeResponse(BaseModel):
    file_analysis: DetectedFile
    culture_analysis: CulturalAnalysis


class TranslationRequest(BaseModel):
    text: str = Field(min_length=1)
    source_language: str = Field(min_length=1)
    target_language: str = Field(min_length=1)


class TranslationItem(BaseModel):
    language: str
    content: str


class TranslationResponse(BaseModel):
    translated_text: str
    translations: list[TranslationItem] = Field(default_factory=list)
    provider: str = "Heimori API"


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    cultural_profile: CulturalAnalysis | None = None


class ChatResponse(BaseModel):
    reply: str
