# 中华民族文化数字平台

## 项目简介

中华民族文化数字平台是一个综合性的文化遗产保护与展示系统，包含三个核心子项目：

- **文化遗产数据库管理系统**：专注于文化遗产数据的管理、存储和可视化展示，为研究和传承中华优秀传统文化提供支持。
- **AI 文化对话系统**：利用人工智能技术，实现民族服饰识别、文化背景故事生成、AI对话和少数民族语言翻译等功能。
- **中华民族文化博物馆**：基于Vue 3和Java的文化博物馆论坛平台，提供文化交流和讨论功能。

本项目旨在通过数字化手段，让更多人了解和关注中国各民族的文化遗产，促进中华优秀传统文化的传承与发展。

## 项目结构

```
├── index/                  # 文化遗产数据库管理系统
│   ├── data/               # 数据目录
│   ├── mz_screen/          # 前端展示页面
│   │   ├── index.html      # 主页面
│   │   ├── js/             # JavaScript文件
│   │   └── data/           # 前端数据目录
│   ├── api.py              # API服务
│   ├── index.html          # 主页面
│   ├── script.js           # 前端脚本
│   ├── styles.css          # 样式文件
│   ├── ethnic_groups.json  # 民族数据
│   ├── video_data.json     # 视频数据
│   ├── start.sh            # 启动脚本
│   └── README.md           # 项目说明文档
├── ai_chat/                # AI 文化对话系统
│   ├── app/                # 后端应用
│   │   ├── config.py       # 配置文件
│   │   ├── llm.py          # 语言模型接口
│   │   ├── main.py         # 主应用入口
│   │   └── translation.py  # 翻译功能
│   ├── static/             # 静态文件
│   │   └── index.html      # 前端页面
│   ├── .env.example        # 环境变量示例
│   ├── pyproject.toml      # 项目依赖配置
│   ├── start.sh            # 启动脚本
│   └── README.md           # 项目说明文档
├── chinese-national-culture-museum/  # 中华民族文化博物馆
│   ├── backend/            # 后端服务
│   │   └── community-service  # 社区服务模块
│   ├── frontend/           # 前端应用
│   │   ├── src/            # 源代码
│   │   │   ├── api/        # API请求模块
│   │   │   ├── components/  # 组件
│   │   │   ├── views/      # 页面
│   │   │   ├── router/     # 路由配置
│   │   │   ├── utils/      # 工具函数
│   │   │   └── main.js     # 入口文件
│   │   ├── public/         # 静态资源
│   │   ├── dist/           # 构建输出
│   │   ├── index.html      # 入口HTML文件
│   │   ├── package.json    # 项目配置
│   │   └── vite.config.js  # Vite配置
│   └── cultural_museum.sql # 数据库脚本
├── .env.example            # 环境变量示例
├── docker-compose.yml      # Docker配置
├── Dockerfile.ai_chat      # AI对话系统Dockerfile
├── Dockerfile.index        # 文化遗产数据库管理系统Dockerfile
├── Dockerfile.chinese-national-culture-museum-backend # 博物馆后端Dockerfile
├── Dockerfile.chinese-national-culture-museum-frontend # 博物馆前端Dockerfile
└── README.md               # 整体项目说明文档
```

## 子项目详解

### 1. 文化遗产数据库管理系统

**功能特点**：

- 文化数据可视化：使用ECharts展示文化数据的分布和统计信息
- 民族文化展示：展示各民族的文化特色和详细信息
- 地区文化分布：展示不同地区的文化分布情况
- 文化搜索：支持按关键词搜索文化信息
- 数据库管理：提供可视化的数据库管理工具，支持数据的增删改查、导入导出等操作

**核心文件**：

- `index/index.html`：前端主页面，包含文化数据展示和交互界面
- `index/api.py`：API服务，提供后端数据接口
- `index/script.js`：前端脚本，处理页面交互逻辑
- `index/styles.css`：样式文件，定义页面样式
- `index/ethnic_groups.json`：民族数据文件
- `index/video_data.json`：视频数据文件
- `index/start.sh`：启动脚本，注入环境变量并启动服务

### 2. AI 文化对话系统

**功能特点**：

- 图片文化识别：上传民族服饰照片后，分析可能所属民族并生成文化背景故事
- 文化对话：根据识别出的文化信息进行AI对话
- 少数民族语言翻译：支持多语言翻译功能

**核心文件**：

- `ai_chat/app/main.py`：FastAPI应用入口，定义API路由
- `ai_chat/app/llm.py`：语言模型接口，处理图片识别和对话功能
- `ai_chat/app/translation.py`：翻译功能，支持少数民族语言翻译
- `ai_chat/static/index.html`：前端页面，提供用户交互界面
- `ai_chat/start.sh`：启动脚本，注入环境变量并启动服务

### 3. 中华民族文化博物馆

**功能特点**：

- 文化论坛：提供文化交流和讨论的平台
- 文化展示：展示中华民族的文化遗产和特色
- 社区互动：用户可以发布帖子、评论、点赞和收藏文化内容
- 用户管理：支持用户注册、登录、个人信息管理
- 标签系统：为帖子添加标签，方便分类和搜索
- 文件上传：支持上传图片和视频等多媒体文件
- 权限管理：支持公开和仅好友可见的帖子设置

**核心文件**：

- `chinese-national-culture-museum/frontend/index.html`：前端入口页面
- `chinese-national-culture-museum/frontend/src/`：前端源代码
- `chinese-national-culture-museum/frontend/src/api/`：API请求模块
- `chinese-national-culture-museum/frontend/src/views/`：页面组件
- `chinese-national-culture-museum/frontend/src/components/`：通用组件
- `chinese-national-culture-museum/backend/community-service/`：后端社区服务模块
- `chinese-national-culture-museum/cultural_museum.sql`：数据库初始化脚本

## 技术栈

| 技术          | 用途         | 子项目                   |
| ----------- | ---------- | --------------------- |
| Python      | 后端开发       | 文化遗产数据库管理系统、AI 文化对话系统 |
| JavaScript  | 前端开发       | 文化遗产数据库管理系统、AI 文化对话系统 |
| Vue 3       | 前端框架       | 论坛                    |
| Java        | 后端开发       | 论坛                    |
| FastAPI     | Web API服务  | AI 文化对话系统             |
| Flask       | Web API服务  | 文化遗产数据库管理系统           |
| HTML5/CSS3  | 前端开发       | 所有子项目                 |
| jQuery      | DOM操作和AJAX | 文化遗产数据库管理系统           |
| ECharts     | 数据可视化      | 文化遗产数据库管理系统           |
| Vite        | 前端构建工具     | 论坛                    |
| GLM-4.1V    | AI对话       | AI 文化对话系统             |
| Heimori API | 少数民族语言翻译   | AI 文化对话系统             |
| Docker      | 容器化部署      | 所有子项目                 |

## 环境要求

- Python 3.6+：用于文化遗产数据库管理系统和AI文化对话系统
- Node.js 14+：用于中华民族文化博物馆前端
- Java 17+：用于中华民族文化博物馆后端
- 浏览器：Chrome, Firefox, Edge等现代浏览器
- 对于AI文化对话系统，需要配置智谱API Key和Heimori API Key
- 对于中华民族文化博物馆，需要配置阿里云OSS账号（用于文件上传功能）

## 快速开始

### Docker部署（推荐）

#### 1. 安装Docker和Docker Compose

在Linux服务器上安装Docker和Docker Compose：

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker compose --version
```

#### 2. 克隆项目代码

将项目代码克隆到服务器上：

```bash
git clone https://github.com/Satou456/culture.git
cd culture
```

#### 3. 配置环境变量

创建`.env`文件，配置所需的环境变量：

```bash
cp .env.example .env
```

编辑`.env`文件，填写以下内容：

```env
# 智谱API配置
BIGMODEL_API_KEY=your_bigmodel_api_key
BIGMODEL_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VISION_MODEL=glm-4.1v-thinking-flash
CHAT_MODEL=glm-4.1v-thinking-flash
LLM_TIMEOUT_SECONDS=60

# Heimori翻译API配置
HEIMORI_API_URL=https://api.xmor.cn/v1/chat/translation
HEIMORI_API_KEY=your_heimori_api_key
HEIMORI_API_KEY_HEADER=Authorization
HEIMORI_TIMEOUT_SECONDS=30
HEIMORI_TRANSLATION_MODEL=tengri-t1-pro
HEIMORI_AUTH_PREFIX=Bearer

# 阿里云OSS配置
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_ENDPOINT=your_oss_endpoint
OSS_REGION=your_region
OSS_BUCKET_NAME=your_bucket_name

# 服务器IP地址配置
SERVER_IP=your_server_ip
```

**注意**：

- 需要修改`BIGMODEL_API_KEY`和`HEIMORI_API_KEY`为您的真实API Key
- 需要修改`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`和`OSS_BUCKET_NAME`为您的阿里云OSS配置
- 需要修改`SERVER_IP`为您的服务器IP地址
- 其他配置项保持默认值即可

#### 4. 构建和启动容器

使用Docker Compose构建和启动所有服务：

```bash
docker compose up -d --build
```

这将构建所有Docker镜像并启动容器。首次构建可能需要一些时间，因为需要下载基础镜像和安装依赖。

#### 5. 验证部署

检查所有容器是否正常运行：

```bash
docker compose ps
```

您应该看到以下容器正在运行：

- mysql-db: MySQL数据库服务
- index-service: 文化遗产数据库管理系统
- ai-chat-service: AI文化对话系统
- chinese-national-culture-museum-backend-service: 中华民族文化博物馆后端
- chinese-national-culture-museum-frontend-service: 中华民族文化博物馆前端

#### 6. 访问服务

部署完成后，您可以通过以下URL访问各个服务：

- 文化遗产数据库管理系统：`http://${SERVER_IP}:5000`
- AI文化对话系统：`http://${SERVER_IP}:8000`
- 中华民族文化博物馆前端：`http://${SERVER_IP}:5173`
- 中华民族文化博物馆后端：`http://${SERVER_IP}:8080`

### 本地开发（可选）

如果您需要在本地进行开发，可以参考以下方式启动各个服务：

#### 1. 启动文化遗产数据库管理系统

1. 进入index目录：
   ```bash
   cd index
   ```
2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
3. 启动API服务：
   ```bash
   python api.py
   ```
4. 在浏览器中访问：`http://127.0.0.1:5000`

#### 2. 启动AI文化对话系统

1. 进入ai_chat目录：
   ```bash
   cd ai_chat
   ```
2. 复制环境变量模板并配置：
   ```bash
   copy .env.example .env
   ```
   编辑`.env`文件，填写智谱API Key和Heimori API Key
3. 创建虚拟环境并安装依赖：
   ```bash
   uv venv
   uv sync
   ```
4. 启动项目：
   ```bash
   uv run uvicorn app.main:app --reload
   ```
5. 在浏览器中访问：`http://127.0.0.1:8000`

#### 3. 启动中华民族文化博物馆

##### 3.1 启动前端

1. 进入frontend目录：
   ```bash
   cd chinese-national-culture-museum/frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 在浏览器中访问：`http://localhost:5173`

##### 3.2 启动后端

1. 进入backend目录：
   ```bash
   cd chinese-national-culture-museum/backend
   ```
2. 构建项目：
   ```bash
   mvn clean package
   ```
3. 启动后端服务：
   ```bash
   java -jar community-service/target/community-service.jar
   ```

## 系统功能

### 文化遗产数据库管理系统

- **前端展示**：文化数据可视化、民族文化展示、地区文化分布、文化搜索
- **数据库管理**：数据导入导出、批量数据操作、表结构查看、数据编辑、记录管理
- **动态配置**：支持通过环境变量配置服务器IP地址，实现灵活部署

### AI 文化对话系统

- **图片文化识别**：识别图片内容与民族文化信息，生成文化背景故事
- **文化对话**：基于识别出的文化信息进行AI对话
- **少数民族语言翻译**：支持多语言翻译功能
- **动态配置**：支持通过环境变量配置服务器IP地址，实现灵活部署

### 中华民族文化博物馆

- **文化论坛**：提供文化交流和讨论的平台
- **文化展示**：展示中华民族的文化遗产和特色
- **社区互动**：用户可以发布帖子、评论和分享文化内容
- **动态配置**：支持通过环境变量配置服务器IP地址，实现灵活部署

## 数据管理

### 数据格式

**JSON数据格式示例**：

```json
{
  "cultures": [
    {
      "name": "京剧",
      "type": "传统戏剧",
      "region": "北京",
      "description": "中国国粹",
      "details": "京剧是中国影响最大的戏曲剧种...",
      "heat": 95,
      "image": "path/to/image.jpg"
    }
  ]
}
```

## 常见问题

### 1. Docker容器启动失败

- 检查Docker和Docker Compose版本是否符合要求
- 确保端口3306、5000、8000、8080、5173没有被其他进程占用
- 检查容器日志中的错误信息：`docker-compose logs 服务名`

### 2. 数据库连接失败

如果应用无法连接到数据库，请检查：

- MySQL容器是否正常运行
- 环境变量中的数据库连接信息是否正确
- 数据库初始化是否完成

### 3. API服务启动失败

- 检查`api.py`中的配置是否正确
- 确保端口5000没有被其他进程占用
- 查看容器日志：`docker-compose logs index-service`

### 4. 前端数据加载失败

- 检查`data/`目录下的数据文件是否存在
- 确保API服务正常运行
- 检查浏览器控制台是否有错误信息

### 5. AI文化对话系统启动失败

- 检查环境变量配置是否正确
- 确保智谱API Key和Heimori API Key有效
- 检查网络连接是否正常
- 查看容器日志：`docker-compose logs ai-chat-service`

### 6. 中华民族文化博物馆服务启动失败

- 检查Java版本是否符合要求
- 确保项目构建成功：`mvn clean package`
- 检查数据库连接配置是否正确
- 查看容器日志：`docker-compose logs chinese-national-culture-museum-backend-service`

### 7. 本地开发问题

#### 中华民族文化博物馆前端启动失败

- 检查Node.js版本是否符合要求
- 确保依赖安装成功：`npm install`
- 检查端口5173是否被占用

#### 中华民族文化博物馆后端启动失败

- 检查Java版本是否符合要求
- 确保项目构建成功：`mvn clean package`
- 检查数据库连接配置是否正确

### 8. API Key问题

如果AI文化对话系统无法正常工作，请检查：

- 智谱API Key和Heimori API Key是否正确配置
- API Key是否有效

### 9. 环境变量配置问题

如果服务无法正确获取环境变量，请检查：

- `.env`文件是否正确创建
- 环境变量格式是否正确
- 服务是否重新启动以加载新的环境变量

## 开发指南

### 添加新功能

1. **前端功能**：
   - 文化遗产数据库管理系统：在`index/index.html`和`index/script.js`中添加新功能
   - AI文化对话系统：在`ai_chat/static/index.html`和相关JavaScript文件中添加新功能
   - 中华民族文化博物馆：在`chinese-national-culture-museum/frontend/src/`目录下添加新功能
2. **后端功能**：
   - 文化遗产数据库管理系统：在`index/api.py`中扩展功能
   - AI文化对话系统：在`ai_chat/app/`目录下的相关文件中添加新功能
   - 中华民族文化博物馆：在`chinese-national-culture-museum/backend/community-service/`目录下添加新功能
3. **数据处理**：根据需要创建新的Python脚本处理数据

### 数据备份

定期备份`index/data/`目录下的数据文件和`index/`目录下的JSON文件，以防止数据丢失。

## 贡献

欢迎对项目提出建议和改进。如果您有任何问题或建议，请联系项目维护者。

## 许可证

本项目采用MIT许可证。

***

**备注**：本项目旨在保护和传承中华优秀传统文化，希望通过数字化手段让更多人了解和关注中国各民族的文化遗产。