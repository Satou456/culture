# 文化遗产数据库管理系统

## 项目简介

文化遗产数据库管理系统是一个综合性的文化遗产数据管理平台，包含前端展示页面和后端管理功能。该系统旨在保护、整理和展示中国各民族的文化遗产信息，为研究和传承中华优秀传统文化提供支持。

## 项目结构

```
├── data/                 # 数据目录
│   └── merged_cultural_heritage.db  # 合并后的文化遗产数据库
├── mz_screen/            # 前端展示页面
│   ├── index.html        # 主页面
│   ├── js/               # JavaScript文件
│   │   ├── flexible.js   # 响应式布局工具
│   │   ├── jquery.js     # jQuery库
│   │   ├── echarts.min.js # ECharts图表库
│   │   ├── index.js      # 主逻辑文件
│   │   ├── china.js      # 中国地图数据
│   │   └── myMap.js      # 地图相关功能
│   └── data/             # 前端数据目录
│       └── ethnic_groups.json  # 前端民族数据
├── db_manager.py         # 数据库管理工具
├── update_ethnic_groups.py  # 民族数据更新脚本
├── check_json.py         # JSON文件检查脚本
├── rename_ethnic_directories.py  # 民族目录重命名脚本
└── README.md             # 项目说明文档
```

## 文件功能详解

### 数据目录 (data/)

- **merged_cultural_heritage.db**：合并后的SQLite数据库文件
  - 包含完整的文化遗产和民族数据
  - 统一存储所有数据，避免数据分散
  - 支持数据的持久化存储和快速查询

### 前端展示页面 (mz_screen/)

- **index.html**：前端主页面
  - 包含页面结构、布局和基本样式
  - 引入必要的JavaScript库和样式文件
  - 实现文化数据的展示和交互界面

- **js/flexible.js**：响应式布局工具
  - 实现页面的响应式设计，适配不同屏幕尺寸
  - 处理移动端和桌面端的布局差异

- **js/jquery.js**：jQuery库
  - 提供DOM操作、事件处理和AJAX请求等功能
  - 简化前端开发和交互逻辑

- **js/echarts.min.js**：ECharts图表库
  - 实现数据可视化，包括柱状图、饼图等
  - 展示文化数据的统计和分布情况

- **js/index.js**：前端主逻辑文件
  - 实现页面的核心功能和交互逻辑
  - 处理数据加载、展示和用户操作
  - 使用Axios从后端获取数据

- **js/china.js**：中国地图数据
  - 提供中国地图的GeoJSON数据
  - 用于地图可视化展示

- **js/myMap.js**：地图相关功能
  - 实现地图的初始化和交互
  - 处理地图点击事件和数据展示

- **data/ethnic_groups.json**：前端民族数据
  - 前端使用的民族数据
  - 确保前端页面能够快速加载民族信息

### 工具文件

- **db_manager.py**：数据库管理工具
  - 基于Tkinter的GUI应用
  - 提供数据库表的可视化管理
  - 支持数据的增删改查、导入导出等操作
  - 实现批量数据操作和整行编辑功能

- **update_ethnic_groups.py**：民族数据更新脚本
  - 用于更新和同步民族数据
  - 处理民族数据的格式转换和标准化

- **check_json.py**：JSON文件检查脚本
  - 验证JSON文件的格式和内容
  - 确保数据的完整性和一致性

- **rename_ethnic_directories.py**：民族目录重命名脚本
  - 用于标准化民族目录名称
  - 确保目录结构的一致性和规范性

## 系统功能

### 1. 前端展示功能

- **文化数据可视化**：使用ECharts展示文化数据的分布和统计信息
- **民族文化展示**：展示各民族的文化特色和详细信息
- **地区文化分布**：展示不同地区的文化分布情况
- **文化搜索**：支持按关键词搜索文化信息
- **响应式设计**：适配不同设备的显示

### 2. 数据库管理功能

- **数据导入导出**：支持JSON格式的数据导入导出
- **批量数据操作**：支持批量添加、编辑、删除记录
- **表结构查看**：可视化查看数据库表结构
- **数据编辑**：直观编辑整行数据
- **记录管理**：便捷的记录增删改查操作

## 技术栈

- **前端**：HTML5, CSS3, JavaScript, jQuery, ECharts, Axios
- **后端**：Python, SQLite
- **数据库**：SQLite
- **工具**：Tkinter (GUI管理工具)

## 环境要求

- Python 3.6+
- 浏览器：Chrome, Firefox, Edge等现代浏览器

## 快速开始

### 1. 启动前端页面

1. 进入项目根目录
2. 启动本地HTTP服务器：
   ```bash
   python -m http.server 8000
   ```
3. 在浏览器中访问：`http://localhost:8000/mz_screen/index.html`

### 2. 启动数据库管理工具

1. 进入项目根目录
2. 运行数据库管理工具：
   ```bash
   python db_manager.py
   ```
3. 在弹出的GUI界面中管理数据库

## 数据库结构

### 主要数据表

- **regions**：地区信息表
  - id (主键)：自增整数，唯一标识
  - name：地区名称，字符串
  - description：地区描述，文本
  - building_count：建筑数量，整数
  - clothing_count：服饰数量，整数
  - music_count：音乐数量，整数
  - craft_count：工艺数量，整数
  - sport_count：体育数量，整数
  - main_info：主要信息，文本
  - created_at：创建时间，时间戳

- **region_stats**：地区统计表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - building_count：建筑数量，整数
  - costume_count：服饰数量，整数
  - music_count：音乐数量，整数
  - craft_count：工艺数量，整数
  - sport_count：体育数量，整数

- **region_festivals**：地区节日表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - festival_name：节日名称，字符串

- **region_foods**：地区美食表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - food_name：美食名称，字符串

- **region_visitor_counts**：地区游客数量表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - month：月份，整数
  - visitor_count：游客数量，整数

- **region_age_distribution**：地区年龄分布表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - age_group：年龄组，字符串
  - percentage：百分比，实数

- **region_ethnic_distribution**：地区民族分布表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - ethnic_group：民族名称，字符串
  - percentage：百分比，实数

- **region_cultures**：地区文化表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - culture_name：文化名称，字符串

- **region_images**：地区图片表
  - id (主键)：自增整数
  - region_id：地区ID，整数
  - image_url：图片路径，字符串

- **ethnic_groups**：民族表
  - id (主键)：自增整数
  - name：民族名称，字符串
  - population：人口数量，字符串
  - origin：起源，文本
  - culture：文化特色，文本
  - image_url：图片路径，字符串
  - created_at：创建时间，时间戳

- **cultures**：文化表
  - id (主键)：自增整数
  - name：文化名称，字符串
  - region：所属地区，字符串
  - type：文化类型，字符串
  - description：文化描述，文本
  - details：详细信息，文本
  - image_url：图片路径，字符串
  - heat：热度值，整数
  - created_at：创建时间，时间戳

## 使用指南

### 前端页面使用

1. **文化数据展示**：页面加载后会自动展示文化数据的统计信息
2. **地区选择**：点击地图或地区列表选择不同地区
3. **民族详情**：点击民族名称查看详细信息
4. **文化搜索**：点击搜索按钮，输入关键词搜索文化信息
5. **数据可视化**：查看文化数据的图表展示

### 数据库管理工具使用

1. **表管理**：在左侧选择要操作的数据库表
2. **数据查看**：右侧显示表结构和数据
3. **添加记录**：点击"添加记录"按钮，填写表单添加新记录
4. **编辑记录**：选择一条记录，点击"编辑整行"按钮修改数据
5. **删除记录**：选择一条记录，点击"删除记录"按钮删除
6. **导入数据**：点击"一键导入JSON"按钮，选择JSON文件导入数据
7. **导出数据**：点击"一键导出JSON"按钮，将数据导出为JSON文件
8. **批量添加**：点击"批量添加记录"按钮，批量添加多条记录

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

### 数据更新

使用`update_ethnic_groups.py`脚本更新民族数据：

```bash
python update_ethnic_groups.py
```

## 常见问题

### 1. 数据库连接失败

- 检查`db_manager.py`中的数据库路径是否正确
- 确保SQLite数据库文件存在

### 2. 前端数据加载失败

- 检查`data/`目录下的JSON文件是否存在
- 确保HTTP服务器正常运行
- 检查浏览器控制台是否有错误信息

### 3. 导入数据失败

- 检查JSON文件格式是否正确
- 确保JSON文件中的字段与数据库表结构匹配

## 开发指南

### 添加新功能

1. **前端功能**：在`mz_screen/js/index.js`中添加新功能
2. **数据库功能**：在`db_manager.py`中扩展功能
3. **数据处理**：创建新的Python脚本处理数据

### 数据备份

定期备份`data/`目录下的数据库文件，以防止数据丢失。

## 贡献

欢迎对项目提出建议和改进。如果您有任何问题或建议，请联系项目维护者。

## 许可证

本项目采用MIT许可证。

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目地址：[GitHub Repository URL]

---

**备注**：本项目旨在保护和传承中华优秀传统文化，希望通过数字化手段让更多人了解和关注中国各民族的文化遗产。