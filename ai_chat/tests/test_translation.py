from app.config import Settings
from app.translation import (
    HeimoriTranslationClient,
    HeimoriTranslationError,
    _looks_like_openai_compatible_endpoint,
    _looks_like_xmor_translation_endpoint,
    _normalize_language_code,
    _normalize_openai_endpoint,
    _normalize_target_languages,
    _extract_translations,
)


def test_extract_translations_from_nested_body() -> None:
    payload = {"data": {"translation": "扎西德勒"}}
    assert _extract_translations(payload) == [{"language": "unknown", "content": "扎西德勒"}]


def test_extract_translations_from_openai_choices() -> None:
    payload = {"choices": [{"message": {"language": "mw", "content": "ᠰᠠᠢᠢᠨ ᠪᠠᠢᠢᠨᠠ"}}]}
    assert _extract_translations(payload) == [{"language": "mw", "content": "ᠰᠠᠢᠢᠨ ᠪᠠᠢᠢᠨᠠ"}]


def test_normalize_openai_endpoint() -> None:
    assert _looks_like_openai_compatible_endpoint("https://api.xmor.cn/v1")
    assert _looks_like_xmor_translation_endpoint("https://api.xmor.cn/v1/chat/translation")
    assert _normalize_openai_endpoint("https://api.xmor.cn/v1") == "https://api.xmor.cn/v1/chat/completions"
    assert (
        _normalize_openai_endpoint("https://api.xmor.cn/v1/chat/completions")
        == "https://api.xmor.cn/v1/chat/completions"
    )


def test_build_request_for_openai_compatible_translation() -> None:
    client = HeimoriTranslationClient(
        Settings(
            heimori_api_url="https://api.xmor.cn/v1",
            heimori_translation_model="tengri-t1-pro",
        )
    )
    payload, request_url = client._build_request(  # noqa: SLF001
        api_url="https://api.xmor.cn/v1",
        text="你好",
        source_language="汉语",
        target_language="蒙古语",
    )
    assert request_url == "https://api.xmor.cn/v1/chat/completions"
    assert payload["prompt"]
    assert payload["messages"][0]["role"] == "user"


def test_build_request_for_xmor_translation() -> None:
    client = HeimoriTranslationClient(
        Settings(
            heimori_api_url="https://api.xmor.cn/v1/chat/translation",
            heimori_translation_model="tengri-t1-pro",
        )
    )
    payload, request_url = client._build_request(  # noqa: SLF001
        api_url="https://api.xmor.cn/v1/chat/translation",
        text="你好",
        source_language="自动",
        target_language="英语,蒙古语,ja",
    )
    assert request_url == "https://api.xmor.cn/v1/chat/translation"
    assert payload["from"] == "auto"
    assert payload["to"] == "en,mw,ja"
    assert payload["messages"] == [{"role": "user", "content": "你好"}]


def test_normalize_language_codes() -> None:
    assert _normalize_language_code("汉语") == "zh"
    assert _normalize_language_code("英语") == "en"
    assert _normalize_target_languages("英语,蒙古语,ja") == "en,mw,ja"


def test_unsupported_language_raises_error() -> None:
    try:
        _normalize_language_code("藏语")
    except HeimoriTranslationError as exc:
        assert "不支持的语言参数" in str(exc)
    else:
        raise AssertionError("expected unsupported language error")
