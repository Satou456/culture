from typing import Any

import httpx

from app.config import Settings


class HeimoriTranslationError(RuntimeError):
    """Raised when translation configuration or request fails."""


SUPPORTED_LANGUAGE_OPTIONS = [
    ("auto", "自动识别"),
    ("zh", "中文"),
    ("en", "英文"),
    ("xle_mw", "西里尔蒙古文"),
    ("mw", "传统蒙古文"),
    ("es", "西班牙语"),
    ("fr", "法语"),
    ("de", "德语"),
    ("ja", "日语"),
    ("ko", "韩语"),
    ("ru", "俄语"),
    ("pt", "葡萄牙语"),
    ("ar", "阿拉伯语"),
    ("hi", "印地语"),
    ("id", "印尼语"),
    ("yue", "粤语"),
]

SUPPORTED_LANGUAGE_CODES = {code for code, _ in SUPPORTED_LANGUAGE_OPTIONS}


class HeimoriTranslationClient:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def translate(
        self, text: str, source_language: str, target_language: str
    ) -> dict[str, Any]:
        if not self.settings.heimori_api_url:
            raise HeimoriTranslationError(
                "HEIMORI_API_URL 未配置。请根据 https://www.heimori.cn/docs 填写准确的翻译接口地址。"
            )

        headers = self._build_headers()
        api_url = self.settings.heimori_api_url.strip()
        payload, request_url = self._build_request(
            api_url=api_url,
            text=text,
            source_language=source_language,
            target_language=target_language,
        )

        async with httpx.AsyncClient(timeout=self.settings.heimori_timeout_seconds) as client:
            response = await client.post(request_url, json=payload, headers=headers)
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                detail = _extract_error_detail(exc.response)
                if detail:
                    raise HeimoriTranslationError(
                        f"Heimori API 返回错误: {exc.response.status_code} {detail}"
                    ) from exc
                raise
            body = response.json()

        translations = _extract_translations(body)
        if not translations:
            raise HeimoriTranslationError(
                "Heimori API 返回中未找到译文，请按 README 调整 payload 或解析逻辑。"
            )
        return {
            "translated_text": translations[0]["content"],
            "translations": translations,
        }

    def _build_headers(self) -> dict[str, str]:
        headers: dict[str, str] = {"Content-Type": "application/json"}
        if self.settings.heimori_api_key:
            value = self.settings.heimori_api_key
            if self.settings.heimori_auth_prefix:
                value = f"{self.settings.heimori_auth_prefix} {value}"
            headers[self.settings.heimori_api_key_header] = value
        return headers

    def _build_request(
        self,
        api_url: str,
        text: str,
        source_language: str,
        target_language: str,
    ) -> tuple[dict[str, Any], str]:
        if _looks_like_xmor_translation_endpoint(api_url):
            return (
                {
                    "model": self.settings.heimori_translation_model,
                    "messages": [{"role": "user", "content": text}],
                    "from": _normalize_language_code(source_language),
                    "to": _normalize_target_languages(target_language),
                },
                api_url.rstrip("/"),
            )

        if _looks_like_openai_compatible_endpoint(api_url):
            prompt = (
                f"请将下面内容从{source_language}翻译为{target_language}，只返回译文，不要添加解释。\n\n"
                f"{text}"
            )
            return (
                {
                    "model": self.settings.heimori_translation_model,
                    "prompt": prompt,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2,
                },
                _normalize_openai_endpoint(api_url),
            )

        return (
            {
                "text": text,
                "source_language": source_language,
                "target_language": target_language,
            },
            api_url,
        )


def _extract_translations(body: Any) -> list[dict[str, str]]:
    if isinstance(body, dict):
        choices = body.get("choices")
        if isinstance(choices, list):
            translations: list[dict[str, str]] = []
            for choice in choices:
                if not isinstance(choice, dict):
                    continue
                message = choice.get("message")
                if isinstance(message, dict):
                    content = message.get("content")
                    if isinstance(content, str) and content.strip():
                        language = message.get("language")
                        translations.append(
                            {
                                "language": str(language).strip() if language else "unknown",
                                "content": content.strip(),
                            }
                        )
            if translations:
                return translations
        for key in ("translated_text", "translation", "result", "text", "data"):
            value = body.get(key)
            if isinstance(value, str) and value.strip():
                return [{"language": "unknown", "content": value.strip()}]
            if isinstance(value, dict):
                nested = _extract_translations(value)
                if nested:
                    return nested
    return []


def _looks_like_xmor_translation_endpoint(api_url: str) -> bool:
    return api_url.rstrip("/").endswith("/chat/translation")


def _looks_like_openai_compatible_endpoint(api_url: str) -> bool:
    normalized = api_url.rstrip("/")
    return normalized.endswith("/v1") or normalized.endswith("/chat/completions")


def _normalize_openai_endpoint(api_url: str) -> str:
    normalized = api_url.rstrip("/")
    if normalized.endswith("/chat/completions"):
        return normalized
    if normalized.endswith("/v1"):
        return f"{normalized}/chat/completions"
    return normalized


def _normalize_language_code(language: str) -> str:
    normalized = language.strip()
    if not normalized:
        return "auto"
    mapping = {
        "自动": "auto",
        "自动识别": "auto",
        "auto": "auto",
        "中文": "zh",
        "汉语": "zh",
        "普通话": "zh",
        "英语": "en",
        "英文": "en",
        "西里尔蒙古文": "xle_mw",
        "传统蒙古文": "mw",
        "西班牙语": "es",
        "法语": "fr",
        "德语": "de",
        "日语": "ja",
        "日文": "ja",
        "韩语": "ko",
        "韩文": "ko",
        "俄语": "ru",
        "葡萄牙语": "pt",
        "阿拉伯语": "ar",
        "印地语": "hi",
        "印尼语": "id",
        "粤语": "yue",
        "蒙古语": "mw",
    }
    candidate = mapping.get(normalized.lower(), mapping.get(normalized, normalized))
    if candidate not in SUPPORTED_LANGUAGE_CODES:
        supported = ", ".join(code for code, _ in SUPPORTED_LANGUAGE_OPTIONS)
        raise HeimoriTranslationError(f"不支持的语言参数: {language}。仅支持: {supported}")
    return candidate


def _normalize_target_languages(target_language: str) -> str:
    parts = [part.strip() for part in target_language.split(",") if part.strip()]
    normalized = [_normalize_language_code(part) for part in parts]
    return ",".join(normalized) if normalized else _normalize_language_code(target_language)


def _extract_error_detail(response: httpx.Response) -> str | None:
    try:
        body = response.json()
    except ValueError:
        text = response.text.strip()
        return text or None

    if isinstance(body, dict):
        error = body.get("error")
        if isinstance(error, dict):
            message = error.get("message")
            if isinstance(message, str) and message.strip():
                return message.strip()
        message = body.get("message") or body.get("msg") or body.get("detail")
        if isinstance(message, str) and message.strip():
            return message.strip()
    return None
