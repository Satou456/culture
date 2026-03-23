import json
import mimetypes
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.llm import LLMService
from app.models import (
    AnalyzeResponse,
    ChatRequest,
    ChatResponse,
    TranslationItem,
    TranslationRequest,
    TranslationResponse,
)
from app.translation import HeimoriTranslationClient, HeimoriTranslationError

# 添加字体文件的MIME类型
mimetypes.add_type('font/ttf', '.ttf')
mimetypes.add_type('font/truetype', '.ttf')
mimetypes.add_type('application/font-ttf', '.ttf')
mimetypes.add_type('application/x-font-ttf', '.ttf')

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
BACKGROUND_DIR = BASE_DIR / "backgroundImg"

settings = get_settings()
app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/backgroundImg", StaticFiles(directory=BACKGROUND_DIR), name="backgroundImg")

translation_client = HeimoriTranslationClient(settings)


@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    return (STATIC_DIR / "index.html").read_text(encoding="utf-8")


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_image(file: UploadFile = File(...)) -> AnalyzeResponse:
    if not settings.bigmodel_api_key:
        raise HTTPException(status_code=500, detail="BIGMODEL_API_KEY 未配置。")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="只支持图片文件上传。")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="上传文件为空。")

    try:
        llm_service = LLMService(settings)
        result = llm_service.analyze_image(file.filename or "upload", file.content_type, data)
        return AnalyzeResponse.model_validate(result)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"图片分析失败: {exc}") from exc


@app.post("/api/translate", response_model=TranslationResponse)
async def translate(payload: TranslationRequest) -> TranslationResponse:
    try:
        translation_result = await translation_client.translate(
            text=payload.text,
            source_language=payload.source_language,
            target_language=payload.target_language,
        )
        return TranslationResponse(
            translated_text=translation_result["translated_text"],
            translations=[
                TranslationItem(language=item["language"], content=item["content"])
                for item in translation_result.get("translations", [])
            ],
        )
    except HeimoriTranslationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"翻译请求失败: {exc}") from exc


@app.post("/api/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest) -> ChatResponse:
    if not settings.bigmodel_api_key:
        raise HTTPException(status_code=500, detail="BIGMODEL_API_KEY 未配置。")

    cultural_context = None
    if payload.cultural_profile:
        cultural_context = json.dumps(payload.cultural_profile.model_dump(), ensure_ascii=False, indent=2)

    try:
        llm_service = LLMService(settings)
        reply = llm_service.chat(
            messages=[message.model_dump() for message in payload.messages],
            cultural_context=cultural_context,
        )
        return ChatResponse(reply=reply)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"对话生成失败: {exc}") from exc
