#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文化数据管理系统 - 后端服务器
支持文化数据的自动保存功能
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import urllib.parse

CULTURE_DATA_PATH = 'data/culturedata.json'

class CultureDataHandler(SimpleHTTPRequestHandler):
    """
    自定义请求处理器，支持文化数据的读写
    """
    
    def do_GET(self):
        """处理 GET 请求"""
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode('utf-8'))
            return
        
        super().do_GET()
    
    def do_POST(self):
        """处理 POST 请求 - 保存数据"""
        if self.path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                backup_path = CULTURE_DATA_PATH + '.backup'
                if os.path.exists(CULTURE_DATA_PATH):
                    os.rename(CULTURE_DATA_PATH, backup_path)
                
                with open(CULTURE_DATA_PATH, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'message': '数据保存成功！'
                }).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': False,
                    'message': f'保存失败: {str(e)}'
                }).encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'message': '未找到该接口'
            }).encode('utf-8'))
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    """主函数 - 启动服务器"""
    port = 8000
    
    if not os.path.exists(CULTURE_DATA_PATH):
        print(f'警告: 找不到 {CULTURE_DATA_PATH} 文件')
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, CultureDataHandler)
    
    print(f'╔════════════════════════════════════════════════════════════╗')
    print(f'║  文化数据管理系统 - 服务器已启动                              ║')
    print(f'╠════════════════════════════════════════════════════════════╣')
    print(f'║  访问地址: http://127.0.0.1:{port}                            ║')
    print(f'║  管理页面: http://127.0.0.1:{port}/admin.html               ║')
    print(f'╠════════════════════════════════════════════════════════════╣')
    print(f'║  按 Ctrl+C 停止服务器                                        ║')
    print(f'╚════════════════════════════════════════════════════════════╝')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n服务器已停止')
        httpd.shutdown()

if __name__ == '__main__':
    main()
