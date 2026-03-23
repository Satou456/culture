# AI 文化对话系统

这是一个基于 Python + FastAPI 的示例项目，满足以下能力：

- 图片上传后识别文件类型与图像内容
- 用户上传民族服饰照片后，分析可能所属民族并生成文化背景故事
- 根据识别出的文化信息继续进行 AI 对话
- 预留并封装少数民族语言翻译能力，按 `https://www.heimori.cn/docs` 接入 Heimori API

项目所有文件都在 `./ai_chat/` 目录中，依赖通过 `uv` 管理，避免污染全局 Python 环境。

## 目录结构

```text
ai_chat/
├── .env.example
├── README.md
├── pyproject.toml
├── app/
│   ├── config.py
│   ├── llm.py
│   ├── main.py
│   ├── models.py
│   ├── prompts.py
│   └── translation.py
├── static/
│   └── index.html
└── tests/
    └── test_translation.py
```

## 使用的依赖

- `fastapi`: Web API 与页面服务
- `uvicorn`: 本地启动 ASGI 服务
- `httpx`: 调用智谱 GLM 与 Heimori 翻译接口
- `pydantic-settings`: 管理环境变量配置
- `python-dotenv`: 加载 `.env`
- `python-multipart`: 支持图片上传
- `pytest`: 简单测试

## 环境变量

请先复制环境变量模板：

```bash
cd /home/yuangod/project/test/ai_chat
cp .env.example .env
```

然后编辑 `.env`：

```env
BIGMODEL_API_KEY=你的智谱 API Key
BIGMODEL_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VISION_MODEL=glm-4.1v-thinking-flash
CHAT_MODEL=glm-4.1v-thinking-flash
LLM_TIMEOUT_SECONDS=60

HEIMORI_API_URL=按官方文档填写的翻译接口完整地址
HEIMORI_API_KEY=你的 Heimori 密钥
HEIMORI_API_KEY_HEADER=Authorization
HEIMORI_AUTH_PREFIX=Bearer
HEIMORI_TIMEOUT_SECONDS=30
HEIMORI_TRANSLATION_MODEL=tengri-t1-pro
```

说明：

- `BIGMODEL_API_KEY` 用于图片识别与文化对话。
- `BIGMODEL_BASE_URL` 默认使用智谱官方同步接口基地址，程序会请求 `/chat/completions`。
- `VISION_MODEL` 与 `CHAT_MODEL` 默认都使用 `GLM-4.1V-Thinking-Flash`。
- `HEIMORI_API_URL` 需要你根据官方文档填写准确接口地址。由于公开检索没有拿到稳定的接口示例，这里做成了适配层，便于你按文档调整。
- 如果你使用的是讯蒙 OpenAI 兼容接口，推荐直接填写 `https://api.xmor.cn/v1`，程序会自动请求 `/chat/completions`。
- 如果你使用的是讯蒙官方翻译接口 `https://api.xmor.cn/v1/chat/translation`，程序会自动按官方示例发送 `model/messages/from/to`。
- 如果 Heimori 文档要求的请求头不是 `Authorization`，改 `HEIMORI_API_KEY_HEADER` 即可。
- 如果 Heimori 文档不需要 `Bearer` 前缀，把 `HEIMORI_AUTH_PREFIX` 留空。
- `HEIMORI_TRANSLATION_MODEL` 用于 OpenAI 兼容模式下的翻译模型，默认 `tengri-t1-pro`。

## 如何启动

### 0. 处理环境变量
参考上面的[环境变量](#环境变量)小节

### 1. 创建虚拟环境

```bash
cd /home/yuangod/project/test/ai_chat
uv venv
```

### 2. 安装依赖

```bash
uv sync
```

如果只想安装运行依赖：

```bash
uv sync --no-dev
```

### 3. 启动项目

```bash
uv run uvicorn app.main:app --reload
```

默认启动后访问：

```text
http://127.0.0.1:8000
```

## 如何使用

### 图片文化识别

1. 打开首页。
2. 上传图片。
3. 系统会返回：
   - 文件类型
   - 图片详细描述
   - 可能的民族服饰归属
   - 文化故事
   - 推荐的特色文化内容
4. 页面会将结构化结果渲染为自然语言文本，而不是直接显示 JSON。

### 少数民族语言翻译

1. 在页面输入源语言、目标语言、文本。
2. 点击翻译。
3. 如果 `HEIMORI_API_URL` 是 `https://api.xmor.cn/v1/chat/translation`，后端会发送：
   - `model`
   - `messages`
   - `from`
   - `to`
4. 当前页面使用下拉菜单，只允许选择官方支持语言，避免发送非法语言码。
5. 例如前端选择“自动识别”到“日语”，后端会发送 `from: "auto"` 和 `to: "ja"`。
6. 如果 `HEIMORI_API_URL` 是 `https://api.xmor.cn/v1`，后端会自动按 OpenAI 兼容接口调用 `POST /chat/completions`。
7. 如果你填的是其他自定义翻译端点，后端会继续按 `text/source_language/target_language` 方式直连。

### 文化对话

1. 先执行一次图片分析。
2. 再输入问题。
3. 对话接口会结合识别出的文化画像继续回答。
4. 页面默认直接显示对话正文，而不是 `{"reply": "..."}` 这类 JSON 外壳。

## 测试样例

项目目录内提供了测试图片目录：

```text
./test_img/
```

我已使用其中的代表性样本进行了本地验证，重点观察以下几类场景：

- 多民族服饰合影图：应输出“多民族服饰展示”或“无法可靠判断单一民族”，避免武断归为某一个民族。
- 电商商品截图：应明确说明这是商品页/截图，而不是把它误当成纯文化纪实照片。
- 社交媒体古装表演图：应识别为古装表演、历史题材演绎或汉文化服饰元素，避免过度断言真实民族身份。
- 玩偶或衍生品图片：应在 `caution` 中说明存在艺术化处理，不能等同于真实服饰样本。

当前版本已经针对这些问题收紧了视觉提示词，要求：

- 所有输出统一使用简体中文
- 对截图、电商页、短视频页、玩偶图进行如实分类
- 对不确定或混合场景避免单一民族硬判断
- `caution` 字段不能为空，必须说明边界和不确定性

## API 说明

### `POST /api/analyze`

- 表单字段：`file`
- 功能：识别图片内容与民族文化信息

### `POST /api/translate`

请求体示例：

```json
{
  "text": "欢迎来到我们的文化交流空间。",
  "source_language": "auto",
  "target_language": "ja"
}
```

### `POST /api/chat`

请求体示例：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "请介绍一下这个民族服饰可能对应的节庆。"
    }
  ],
  "cultural_profile": {
    "ethnicity": "藏族",
    "clothing_features": ["长袖藏袍", "彩色腰带"],
    "cultural_story": "示例故事",
    "recommended_culture_items": ["锅庄舞", "酥油茶"],
    "caution": "需人工复核"
  }
}
```

## 注意事项

- 民族识别属于高语义推断，模型结果只能作为辅助参考，不能作为严肃身份认定依据。
- 文化故事是生成内容，展示前建议做人工审核，避免文化刻板印象或错误归因。
- 智谱视觉接口在短时间内连续调用多张图片时，可能出现 `429 Too Many Requests`。当前项目已在 [llm.py](/home/yuangod/project/test/ai_chat/app/llm.py) 中加入轻量重试，但批量压测时仍建议控制节奏。
- Heimori 翻译接口的具体字段可能与你的账号文档不同。当前项目将该部分集中在 `app/translation.py`，如果官方字段不同，只需要修改这一处。
- 当前版本已经补上了 `xmor chat/translation` 所需的 `from` 和 `to` 字段，并解析 `choices[].message.language`。
- `xmor` 当前支持的语言已限制为官方列表：`auto, zh, en, xle_mw, mw, es, fr, de, ja, ko, ru, pt, ar, hi, id, yue`。
- 当前视觉识别和对话已按智谱官方对话补全接口实现，参考文档：
  https://docs.bigmodel.cn/api-reference/%E6%A8%A1%E5%9E%8B-api/%E5%AF%B9%E8%AF%9D%E8%A1%A5%E5%85%A8

## 测试

运行测试：

```bash
uv run pytest
```

## 无副作用卸载

本项目建议只使用 `uv` 虚拟环境，不安装到全局：

```bash
rm -rf .venv
```

删除后即可完成本地隔离环境卸载，不影响系统 Python。
