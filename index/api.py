from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import json
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # 允许跨域请求

# 数据文件路径
CULTURE_DATA_PATH = 'data/culturedata.json'

# 根路径路由
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# 数据库连接函数
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get('MYSQL_HOST', 'localhost'),
            port=int(os.environ.get('MYSQL_PORT', 3306)),
            user=os.environ.get('MYSQL_USER', 'root'),
            password=os.environ.get('MYSQL_PASSWORD', '023579'),
            database=os.environ.get('MYSQL_DATABASE', 'cultural_museum')
        )
        return conn
    except mysql.connector.Error as err:
        print(f"数据库连接错误: {err}")
        return None

# 获取文化数据
@app.route('/api/cultures', methods=['GET'])
def get_cultures():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': '数据库连接失败'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM cultures')
    cultures = cursor.fetchall()
    conn.close()
    return jsonify({'cultures': cultures})

# 获取民族数据
@app.route('/api/ethnic-groups', methods=['GET'])
def get_ethnic_groups():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': '数据库连接失败'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM ethnic_groups')
    ethnic_groups = {}
    for row in cursor.fetchall():
        ethnic_groups[row['name']] = {
            'name': row['name'],
            'population': row['population'],
            'origin': row['origin'],
            'culture': row['culture'],
            'image': row['image_url']
        }
    conn.close()
    return jsonify({'ethnic_groups': ethnic_groups})

# 获取地区数据
@app.route('/api/regions/<region_name>', methods=['GET'])
def get_region_data(region_name):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': '数据库连接失败'}), 500
    cursor = conn.cursor(dictionary=True)
    
    # 获取地区基本信息
    cursor.execute('SELECT * FROM regions WHERE name = %s', (region_name,))
    region = cursor.fetchone()
    
    if not region:
        conn.close()
        return jsonify({
            'name': region_name,
            '民族节日': [],
            '民族食品': [],
            '地区访问人数': [],
            '地区年龄占比': {},
            '民族种类占比': {},
            '民族代表文化': [],
            '地区主要信息': '暂无数据'
        })
    
    region_id = region['id']
    
    # 获取地区节日
    cursor.execute('SELECT festival_name FROM region_festivals WHERE region_id = %s', (region_id,))
    festivals = [row['festival_name'] for row in cursor.fetchall()]
    
    # 获取地区美食
    cursor.execute('SELECT food_name FROM region_foods WHERE region_id = %s', (region_id,))
    foods = [row['food_name'] for row in cursor.fetchall()]
    
    # 获取地区访问人数
    cursor.execute('SELECT month, visitor_count FROM region_visitor_counts WHERE region_id = %s ORDER BY month', (region_id,))
    visitor_counts = [row['visitor_count'] for row in cursor.fetchall()]
    
    # 获取地区年龄分布
    cursor.execute('SELECT age_group, percentage FROM region_age_distribution WHERE region_id = %s', (region_id,))
    age_distribution = {row['age_group']: row['percentage'] for row in cursor.fetchall()}
    
    # 获取地区民族分布
    cursor.execute('SELECT ethnic_group, percentage FROM region_ethnic_distribution WHERE region_id = %s', (region_id,))
    ethnic_distribution = {row['ethnic_group']: row['percentage'] for row in cursor.fetchall()}
    
    # 获取地区文化（从cultures表中筛选该地区的文化）
    cursor.execute('SELECT name FROM cultures WHERE region = %s', (region_name,))
    cultures = [row['name'] for row in cursor.fetchall()]
    
    # 获取地区图片（如果没有单独的图片表，可以返回空数组）
    images = []
    
    conn.close()
    
    return jsonify({
        'name': region_name,
        '民族节日': festivals,
        '民族食品': foods,
        '地区访问人数': visitor_counts,
        '地区年龄占比': age_distribution,
        '民族种类占比': ethnic_distribution,
        '民族代表文化': cultures,
        '地区主要信息': region['main_info'],
        '地区图片': images
    })

# 获取所有地区名称
@app.route('/api/regions', methods=['GET'])
def get_regions():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': '数据库连接失败'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT name FROM regions')
    regions = [row['name'] for row in cursor.fetchall()]
    conn.close()
    return jsonify({'regions': regions})

# 获取视频数据
@app.route('/api/videos', methods=['GET'])
def get_videos():
    # 返回视频数据
    videos = [
        {
            "id": 1,
            "title": "春节文化",
            "description": "辞旧迎新、团圆祈福的年节",
            "videoUrl": "./video_display/InnerMGL.mp4",
            "thumbnailUrl": "./video_display/chunjie/chunjie.png"
        },
        {
            "id": 2,
            "title": "游牧文化",
            "description": "依托草原、逐水草迁徙的游牧民族核心文化",
            "videoUrl": "./video_display/youmu/2.mp4",
            "thumbnailUrl": "./video_display/youmu/2.png"
        },
        {
            "id": 3,
            "title": "藏文化",
            "description": "融合藏传佛教与高原生态的文化",
            "videoUrl": "./video_display/zang/3.mp4",
            "thumbnailUrl": "./video_display/zang/3.png"
        },
        {
            "id": 4,
            "title": "农耕文化",
            "description": "以农业生产为基础，衍生出的社会习俗、宗教信仰等文化体系",
            "videoUrl": "./video_display/nonggeng/4.mp4",
            "thumbnailUrl": "./video_display/nonggeng/4.png"
        },
        {
            "id": 5,
            "title": "西南山地文化",
            "description": "西南地区多民族融合形成的山地特色文化",
            "videoUrl": "./video_display/xinanshandi/5.mp4",
            "thumbnailUrl": "./video_display/xinanshandi/5.png"
        },
        {
            "id": 6,
            "title": "佛教文化",
            "description": "起源于印度，在中国形成独特宗派体系的佛教文化",
            "videoUrl": "./video_display/fo/6.mp4",
            "thumbnailUrl": "./video_display/fo/6.png"
        },
        {
            "id": 7,
            "title": "新疆文化",
            "description": "多元民族融合，兼具东西方特色的边疆文化",
            "videoUrl": "./video_display/xinjiang/7.mp4",
            "thumbnailUrl": "./video_display/xinjiang/7.png"
        },
        {
            "id": 8,
            "title": "故宫文化",
            "description": "以故宫为核心，承载的皇家历史、建筑艺术与文化遗产",
            "videoUrl": "./video_display/gugong/8.mp4",
            "thumbnailUrl": "./video_display/gugong/8.png"
        },
        {
            "id": 9,
            "title": "广西文化",
            "description": "以壮族为主体，多民族共生的华南边疆特色文化",
            "videoUrl": "./video_display/guangxi/9.mp4",
            "thumbnailUrl": "./video_display/guangxi/9.png"
        }
    ]
    return jsonify(videos)

# 健康检查端点
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

# 保存数据端点
@app.route('/api/save', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        
        backup_path = CULTURE_DATA_PATH + '.backup'
        if os.path.exists(CULTURE_DATA_PATH):
            os.rename(CULTURE_DATA_PATH, backup_path)
        
        with open(CULTURE_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            'success': True,
            'message': '数据保存成功！'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'保存失败: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)