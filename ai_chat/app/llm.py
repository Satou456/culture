import base64
import json
import time

import httpx

from app.config import Settings
from app.prompts import ANALYZE_IMAGE_PROMPT, CHAT_SYSTEM_PROMPT


class LLMService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def analyze_image(self, filename: str, content_type: str, data: bytes) -> dict:
        data_url = _build_data_url(content_type, data)
        body = self._chat_completion(
            model=self.settings.vision_model,
            messages=[
                {"role": "system", "content": ANALYZE_IMAGE_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"文件名: {filename}"},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                },
            ],
            response_format={"type": "json_object"},
        )
        return _extract_json(_extract_message_content(body))

    def chat(self, messages: list[dict], cultural_context: str | None = None) -> str:
        final_messages: list[dict] = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
        if cultural_context:
            final_messages.append(
                {
                    "role": "system",
                    "content": f"Current cultural profile context:\n{cultural_context}",
                }
            )
        final_messages.extend(messages)
        body = self._chat_completion(
            model=self.settings.chat_model,
            messages=final_messages,
        )
        return _extract_message_content(body)

    def _chat_completion(
        self,
        model: str,
        messages: list[dict],
        response_format: dict | None = None,
    ) -> dict:
        if not self.settings.bigmodel_api_key:
            raise ValueError("BIGMODEL_API_KEY 未配置。")

        payload: dict = {
            "model": model,
            "messages": messages,
            "stream": False,
        }
        if response_format:
            payload["response_format"] = response_format

        headers = {
            "Authorization": f"Bearer {self.settings.bigmodel_api_key}",
            "Content-Type": "application/json",
        }
        url = f"{self.settings.bigmodel_base_url.rstrip('/')}/chat/completions"
        
        # 增加超时时间和重试策略
        timeout = httpx.Timeout(
            connect=30.0,
            read=60.0,
            write=30.0,
            pool=30.0,
        )
        
        with httpx.Client(timeout=timeout) as client:
            last_error: Exception | None = None
            for attempt in range(3):
                try:
                    response = client.post(url, json=payload, headers=headers)
                    response.raise_for_status()
                    return response.json()
                except httpx.HTTPStatusError as exc:
                    last_error = exc
                    status = exc.response.status_code
                    if status not in (429, 500, 502, 503, 504) or attempt == 2:
                        raise
                    time.sleep(1.5 * (attempt + 1))
                except (httpx.ConnectError, httpx.ReadError, httpx.WriteError) as exc:
                    last_error = exc
                    if attempt == 2:
                        raise
                    time.sleep(2 * (attempt + 1))
            if last_error:
                raise last_error
            raise ValueError("BigModel request failed without response.")


def _build_data_url(content_type: str, data: bytes) -> str:
    encoded = base64.b64encode(data).decode("utf-8")
    return f"data:{content_type};base64,{encoded}"


def _extract_json(content: str | None) -> dict:
    if not content:
        raise ValueError("Empty LLM response.")
    return json.loads(content)


def _extract_message_content(body: dict) -> str:
    choices = body.get("choices")
    if not isinstance(choices, list) or not choices:
        raise ValueError("BigModel response missing choices.")
    message = choices[0].get("message")
    if not isinstance(message, dict):
        raise ValueError("BigModel response missing message.")
    content = message.get("content")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text_parts = [item.get("text", "") for item in content if isinstance(item, dict)]
        merged = "".join(part for part in text_parts if part)
        if merged:
            return merged
    raise ValueError("BigModel response missing content.")
