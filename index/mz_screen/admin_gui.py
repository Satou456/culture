#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文化数据管理系统 - 桌面版
使用 tkinter 实现的图形界面管理程序
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
from datetime import datetime

# 获取脚本所在目录的绝对路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CULTURE_DATA_PATH = os.path.join(SCRIPT_DIR, 'data', 'culturedata.json')

class CultureDataManager:
    """文化数据管理类"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("文化数据管理系统")
        self.root.geometry("1400x900")
        self.root.minsize(1200, 700)
        
        # 设置主题样式
        self.setup_theme()
        
        self.data = None
        self.current_tab = 'cultures'
        self.load_data()
        self.setup_ui()
    
    def setup_theme(self):
        """设置主题样式"""
        style = ttk.Style()
        
        # 使用 clam 主题作为基础
        style.theme_use('clam')
        
        # 颜色配置
        PRIMARY_COLOR = "#192341"
        SECONDARY_COLOR = "#0f1428"
        ACCENT_COLOR = "#4a89dc"
        SUCCESS_COLOR = "#f6bb42"
        TEXT_COLOR = "#f8f0e3"
        TEXT_DARK = "#333333"
        
        # 配置全局样式
        style.configure('.', 
            background=PRIMARY_COLOR,
            foreground=TEXT_COLOR,
            font=("Microsoft YaHei", 10)
        )
        
        # 框架样式
        style.configure('TFrame', background=PRIMARY_COLOR)
        style.configure('TLabelframe', background=PRIMARY_COLOR, bordercolor=SECONDARY_COLOR)
        style.configure('TLabelframe.Label', background=PRIMARY_COLOR, foreground=ACCENT_COLOR, font=("Microsoft YaHei", 11, "bold"))
        
        # 标签样式
        style.configure('TLabel', background=PRIMARY_COLOR, foreground=TEXT_COLOR, font=("Microsoft YaHei", 10))
        style.configure('Header.TLabel', background=PRIMARY_COLOR, foreground=ACCENT_COLOR, font=("Microsoft YaHei", 24, "bold"))
        style.configure('Stat.TLabel', background=PRIMARY_COLOR, foreground=ACCENT_COLOR, font=("Microsoft YaHei", 28, "bold"))
        style.configure('StatLabel.TLabel', background=PRIMARY_COLOR, foreground="#888888", font=("Microsoft YaHei", 10))
        
        # 按钮样式
        style.configure('TButton', 
            background=SECONDARY_COLOR,
            foreground=TEXT_COLOR,
            borderwidth=0,
            padding=10,
            font=("Microsoft YaHei", 10)
        )
        style.map('TButton',
            background=[('active', ACCENT_COLOR)],
            foreground=[('active', TEXT_DARK)]
        )
        
        style.configure('Primary.TButton',
            background=ACCENT_COLOR,
            foreground=TEXT_DARK,
            borderwidth=0,
            padding=10,
            font=("Microsoft YaHei", 10, "bold")
        )
        style.map('Primary.TButton',
            background=[('active', SUCCESS_COLOR)]
        )
        
        # 输入框样式
        style.configure('TEntry', 
            fieldbackground=SECONDARY_COLOR,
            foreground=TEXT_COLOR,
            borderwidth=1,
            relief="solid",
            padding=8
        )
        
        # 组合框样式
        style.configure('TCombobox',
            fieldbackground=SECONDARY_COLOR,
            background=SECONDARY_COLOR,
            foreground=TEXT_COLOR,
            borderwidth=1,
            padding=8
        )
        
        # 复选框样式
        style.configure('TCheckbutton',
            background=PRIMARY_COLOR,
            foreground=TEXT_COLOR,
            font=("Microsoft YaHei", 10)
        )
        
        # 笔记本（标签页）样式
        style.configure('TNotebook', background=PRIMARY_COLOR, borderwidth=0)
        style.configure('TNotebook.Tab',
            background=SECONDARY_COLOR,
            foreground=TEXT_COLOR,
            padding=[20, 10],
            font=("Microsoft YaHei", 11)
        )
        style.map('TNotebook.Tab',
            background=[('selected', ACCENT_COLOR)],
            foreground=[('selected', TEXT_DARK)]
        )
        
        # 滚动条样式
        style.configure('Vertical.TScrollbar',
            background=SECONDARY_COLOR,
            bordercolor=SECONDARY_COLOR,
            arrowcolor=TEXT_COLOR,
            troughcolor=PRIMARY_COLOR
        )
        style.configure('Horizontal.TScrollbar',
            background=SECONDARY_COLOR,
            bordercolor=SECONDARY_COLOR,
            arrowcolor=TEXT_COLOR,
            troughcolor=PRIMARY_COLOR
        )
        
        # 树状视图样式
        style.configure('Treeview',
            background=SECONDARY_COLOR,
            foreground=TEXT_COLOR,
            fieldbackground=SECONDARY_COLOR,
            borderwidth=0,
            rowheight=30,
            font=("Microsoft YaHei", 9)
        )
        style.configure('Treeview.Heading',
            background=ACCENT_COLOR,
            foreground=TEXT_DARK,
            font=("Microsoft YaHei", 10, "bold"),
            relief="flat"
        )
        style.map('Treeview',
            background=[('selected', ACCENT_COLOR)],
            foreground=[('selected', TEXT_DARK)]
        )
    
    def load_data(self):
        """加载数据"""
        if os.path.exists(CULTURE_DATA_PATH):
            try:
                with open(CULTURE_DATA_PATH, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
            except Exception as e:
                messagebox.showerror("错误", f"加载数据失败: {str(e)}")
                self.data = {'cultures': []}
        else:
            self.data = {'cultures': []}
    
    def save_data(self):
        """保存数据"""
        try:
            if os.path.exists(CULTURE_DATA_PATH):
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_path = CULTURE_DATA_PATH + f'.backup_{timestamp}'
                os.rename(CULTURE_DATA_PATH, backup_path)
            
            with open(CULTURE_DATA_PATH, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            
            messagebox.showinfo("成功", "数据保存成功！")
        except Exception as e:
            messagebox.showerror("错误", f"保存数据失败: {str(e)}")
    
    def setup_ui(self):
        """设置用户界面"""
        # 设置窗口背景
        self.root.configure(bg="#1a1a2e")
        
        # 主容器
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 配置网格权重
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(1, weight=1)
        
        # 标题
        title_label = ttk.Label(main_frame, text="🎭 文化数据管理系统", style='Header.TLabel')
        title_label.grid(row=0, column=0, sticky=tk.W, pady=(0, 20))
        
        # 统计面板
        stats_frame = ttk.Frame(main_frame)
        stats_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 20))
        
        self.stats_labels = {}
        stats = [
            ("地区数量", self.get_region_count()),
            ("文化数量", self.get_culture_count()),
            ("非遗文化数量", self.get_heritage_count())
        ]
        
        for i, (label, value) in enumerate(stats):
            frame = ttk.Frame(stats_frame)
            frame.grid(row=0, column=i, padx=(0, 40))
            
            ttk.Label(frame, text=label, style='StatLabel.TLabel').grid(row=0, column=0)
            self.stats_labels[label] = ttk.Label(frame, text=str(value), style='Stat.TLabel')
            self.stats_labels[label].grid(row=1, column=0, pady=(5, 0))
        
        # 标签页
        notebook = ttk.Notebook(main_frame)
        notebook.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(20, 20))
        
        # 文化项目管理标签页
        self.cultures_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.cultures_frame, text="🎭 文化项目管理")
        self.setup_cultures_tab()
        
        # 地区数据管理标签页
        self.regions_frame = ttk.Frame(notebook, padding="10")
        notebook.add(self.regions_frame, text="📍 地区数据管理")
        self.setup_regions_tab()
        
        # 底部按钮
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=3, column=0, sticky=(tk.W, tk.E))
        
        ttk.Button(button_frame, text="💾 保存数据", command=self.save_data, style='Primary.TButton').grid(row=0, column=0, padx=(0, 10))
        ttk.Button(button_frame, text="🔄 重新加载", command=self.refresh_data).grid(row=0, column=1)
    
    def setup_cultures_tab(self):
        """设置文化项目管理标签页"""
        # 工具栏
        toolbar = ttk.Frame(self.cultures_frame)
        toolbar.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 15))
        
        ttk.Button(toolbar, text="➕ 添加文化项目", command=self.show_add_culture_dialog, style='Primary.TButton').grid(row=0, column=0, padx=(0, 10))
        ttk.Button(toolbar, text="🎨 一键设置传统工艺为非遗", command=self.auto_set_heritage).grid(row=0, column=1, padx=(0, 20))
        
        # 搜索框
        ttk.Label(toolbar, text="🔍 搜索:").grid(row=0, column=2, padx=(0, 5))
        self.search_var = tk.StringVar()
        self.search_var.trace('w', self.filter_cultures)
        search_entry = ttk.Entry(toolbar, textvariable=self.search_var, width=40)
        search_entry.grid(row=0, column=3)
        
        # 表格
        columns = ("ID", "名称", "地区", "类型", "非遗", "热度", "媒体")
        self.culture_tree = ttk.Treeview(self.cultures_frame, columns=columns, show="headings", height=20)
        
        for col in columns:
            self.culture_tree.heading(col, text=col)
            self.culture_tree.column(col, width=120)
        
        self.culture_tree.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 滚动条
        scrollbar = ttk.Scrollbar(self.cultures_frame, orient=tk.VERTICAL, command=self.culture_tree.yview)
        scrollbar.grid(row=1, column=1, sticky=(tk.N, tk.S))
        self.culture_tree.configure(yscrollcommand=scrollbar.set)
        
        # 操作按钮
        action_frame = ttk.Frame(self.cultures_frame)
        action_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        ttk.Button(action_frame, text="编辑", command=self.edit_culture).grid(row=0, column=0, padx=2)
        ttk.Button(action_frame, text="删除", command=self.delete_culture).grid(row=0, column=1, padx=2)
        
        # 配置网格
        self.cultures_frame.columnconfigure(0, weight=1)
        self.cultures_frame.rowconfigure(1, weight=1)
        
        self.refresh_cultures_table()
    
    def setup_regions_tab(self):
        """设置地区数据管理标签页"""
        # 列表框
        list_frame = ttk.Frame(self.regions_frame)
        list_frame.grid(row=0, column=0, sticky=(tk.N, tk.S), pady=(0, 10))
        
        ttk.Label(list_frame, text="地区列表").grid(row=0, column=0, pady=(0, 5))
        self.region_listbox = tk.Listbox(list_frame, width=30, height=25)
        self.region_listbox.grid(row=1, column=0, sticky=(tk.N, tk.S))
        self.region_listbox.bind('<<ListboxSelect>>', self.on_region_select)
        
        # 编辑区域
        edit_frame = ttk.LabelFrame(self.regions_frame, text="编辑地区数据", padding="10")
        edit_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(10, 0))
        
        # 创建编辑字段
        self.region_vars = {}
        fields = [
            ("地区名称", "name"),
            ("代表建筑数量", "代表建筑数量"),
            ("民族服饰数量", "民族服饰数量"),
            ("民族音乐数量", "民族音乐数量"),
            ("传统工艺数量", "传统工艺数量"),
            ("民族运动数量", "民族运动数量"),
            ("民族节日 (逗号分隔)", "民族节日"),
            ("民族食品 (逗号分隔)", "民族食品"),
            ("民族代表文化 (逗号分隔)", "民族代表文化"),
            ("世界文化遗产 (逗号分隔)", "世界文化遗产"),
            ("国家级非遗代表性项目数量", "国家级非遗代表性项目数量"),
            ("国家历史文化名城 (逗号分隔)", "国家历史文化名城"),
            ("地区主要信息", "地区主要信息"),
        ]
        
        for i, (label_text, field_key) in enumerate(fields):
            ttk.Label(edit_frame, text=label_text).grid(row=i, column=0, sticky=tk.W, pady=2)
            
            if "主要信息" in label_text:
                widget = tk.Text(edit_frame, width=50, height=8)
            else:
                widget = ttk.Entry(edit_frame, width=50)
            
            widget.grid(row=i, column=1, sticky=(tk.W, tk.E), pady=2)
            self.region_vars[field_key] = widget
        
        # 保存按钮
        ttk.Button(edit_frame, text="保存地区数据", command=self.save_region_data).grid(row=len(fields), column=0, columnspan=2, pady=(10, 0))
        
        # 配置网格
        self.regions_frame.columnconfigure(1, weight=1)
        self.regions_frame.rowconfigure(0, weight=1)
        edit_frame.columnconfigure(1, weight=1)
        
        self.refresh_regions_list()
    
    def get_region_count(self):
        """获取地区数量"""
        return len([k for k in self.data.keys() if k != 'cultures'])
    
    def get_culture_count(self):
        """获取文化数量"""
        return len(self.data.get('cultures', []))
    
    def get_heritage_count(self):
        """获取非遗文化数量"""
        return len([c for c in self.data.get('cultures', []) if c.get('isHeritage')])
    
    def update_stats(self):
        """更新统计数据"""
        self.stats_labels["地区数量"].config(text=str(self.get_region_count()))
        self.stats_labels["文化数量"].config(text=str(self.get_culture_count()))
        self.stats_labels["非遗文化数量"].config(text=str(self.get_heritage_count()))
    
    def refresh_data(self):
        """刷新数据"""
        self.load_data()
        self.update_stats()
        self.refresh_cultures_table()
        self.refresh_regions_list()
        messagebox.showinfo("成功", "数据刷新成功！")
    
    def refresh_cultures_table(self):
        """刷新文化表格"""
        # 清空表格
        for item in self.culture_tree.get_children():
            self.culture_tree.delete(item)
        
        # 添加数据
        for culture in self.data.get('cultures', []):
            media_count = len(culture.get('media', []))
            if media_count == 0:
                media_count = 1 if culture.get('image') else 0
            self.culture_tree.insert('', tk.END, values=(
                culture.get('id', ''),
                culture.get('name', ''),
                culture.get('region', ''),
                culture.get('type', ''),
                '✓' if culture.get('isHeritage') else '',
                culture.get('heat', ''),
                str(media_count) if media_count > 0 else ''
            ))
    
    def refresh_regions_list(self):
        """刷新地区列表"""
        self.region_listbox.delete(0, tk.END)
        regions = [k for k in self.data.keys() if k != 'cultures']
        for region in sorted(regions):
            self.region_listbox.insert(tk.END, region)
    
    def filter_cultures(self, *args):
        """筛选文化项目"""
        search_term = self.search_var.get().lower()
        
        # 清空表格
        for item in self.culture_tree.get_children():
            self.culture_tree.delete(item)
        
        # 添加匹配的数据
        for culture in self.data.get('cultures', []):
            name = culture.get('name', '').lower()
            region = culture.get('region', '').lower()
            culture_type = culture.get('type', '').lower()
            
            if not search_term or search_term in name or search_term in region or search_term in culture_type:
                media_count = len(culture.get('media', []))
                if media_count == 0:
                    media_count = 1 if culture.get('image') else 0
                self.culture_tree.insert('', tk.END, values=(
                    culture.get('id', ''),
                    culture.get('name', ''),
                    culture.get('region', ''),
                    culture.get('type', ''),
                    '✓' if culture.get('isHeritage') else '',
                    culture.get('heat', ''),
                    str(media_count) if media_count > 0 else ''
                ))
    
    def show_add_culture_dialog(self):
        """显示添加文化项目对话框"""
        self.show_culture_dialog(None)
    
    def edit_culture(self):
        """编辑文化项目"""
        selected = self.culture_tree.selection()
        if not selected:
            messagebox.showwarning("警告", "请先选择一个文化项目！")
            return
        
        item = self.culture_tree.item(selected[0])
        culture_id = item['values'][0]
        
        culture = next((c for c in self.data.get('cultures', []) if c.get('id') == culture_id), None)
        if culture:
            self.show_culture_dialog(culture)
    
    def show_culture_dialog(self, culture):
        """显示文化项目对话框"""
        dialog = tk.Toplevel(self.root)
        dialog.title("编辑文化项目" if culture else "添加文化项目")
        dialog.geometry("900x800")
        dialog.minsize(800, 700)
        dialog.configure(bg="#1a1a2e")
        
        # 表单变量
        vars_dict = {}
        
        # 媒体资源列表
        media_list = []
        if culture:
            media_list = culture.get('media', [])
            # 兼容旧的 image 字段
            if not media_list and culture.get('image'):
                media_list = [{
                    'type': 'image',
                    'url': culture.get('image'),
                    'title': ''
                }]
        
        # 主容器 - 分为左右两部分
        left_frame = ttk.Frame(dialog)
        left_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=10, pady=10)
        
        right_frame = ttk.Frame(dialog)
        right_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=10, pady=10)
        
        dialog.columnconfigure(0, weight=1)
        dialog.columnconfigure(1, weight=1)
        dialog.rowconfigure(0, weight=1)
        
        # 左侧：基本信息
        fields = [
            ("名称 *", "name"),
            ("地区 *", "region"),
            ("类型 *", "type"),
            ("简介 *", "description"),
            ("详细介绍 *", "details"),
            ("热度", "heat"),
        ]
        
        for i, (label_text, field_key) in enumerate(fields):
            ttk.Label(left_frame, text=label_text).grid(row=i, column=0, sticky=tk.W, pady=5, padx=5)
            
            if field_key in ["description", "details"]:
                widget = tk.Text(left_frame, width=40, height=5)
            elif field_key == "type":
                widget = ttk.Combobox(left_frame, values=[
                    "民族服饰", "民族音乐", "传统工艺", "代表建筑",
                    "民族节日", "民族运动", "戏曲曲艺", "民间文学"
                ], width=37)
            else:
                widget = ttk.Entry(left_frame, width=40)
            
            widget.grid(row=i, column=1, pady=5, padx=5)
            vars_dict[field_key] = widget
            
            # 填充数据
            if culture and culture.get(field_key):
                if field_key in ["description", "details"]:
                    widget.insert('1.0', culture.get(field_key, ''))
                else:
                    widget.insert(0, str(culture.get(field_key, '')))
        
        # 非遗复选框
        is_heritage_var = tk.BooleanVar(value=culture.get('isHeritage', False) if culture else False)
        ttk.Checkbutton(left_frame, text="是否为非遗文化", variable=is_heritage_var).grid(row=len(fields), column=0, columnspan=2, pady=10)
        
        # 右侧：媒体资源管理
        ttk.Label(right_frame, text="媒体资源管理", font=("Microsoft YaHei", 12, "bold")).grid(row=0, column=0, columnspan=3, sticky=tk.W, pady=(0, 10))
        
        # 媒体列表
        media_tree = ttk.Treeview(right_frame, columns=("类型", "标题", "URL"), show="headings", height=15)
        media_tree.heading("类型", text="类型")
        media_tree.heading("标题", text="标题")
        media_tree.heading("URL", text="URL")
        media_tree.column("类型", width=80)
        media_tree.column("标题", width=100)
        media_tree.column("URL", width=200)
        media_tree.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 填充媒体列表
        def refresh_media_list():
            for item in media_tree.get_children():
                media_tree.delete(item)
            for i, media in enumerate(media_list):
                if media['type'] == 'image':
                    type_text = "图片"
                elif media['type'] == 'video':
                    type_text = "视频"
                elif media['type'] == 'audio':
                    type_text = "音频"
                elif media['type'] == 'embed':
                    type_text = "嵌入"
                else:
                    type_text = media['type']
                
                url_display = media.get('url', '')
                if media['type'] == 'embed' and len(url_display) > 80:
                    url_display = url_display[:80] + '...'
                
                media_tree.insert('', tk.END, values=(type_text, media.get('title', ''), url_display))
        
        refresh_media_list()
        
        # 媒体操作按钮
        media_button_frame = ttk.Frame(right_frame)
        media_button_frame.grid(row=2, column=0, columnspan=3, pady=(10, 0))
        
        def add_media():
            add_dialog = tk.Toplevel(dialog)
            add_dialog.title("添加媒体资源")
            add_dialog.geometry("400x300")
            add_dialog.configure(bg="#1a1a2e")
            
            ttk.Label(add_dialog, text="类型:").grid(row=0, column=0, sticky=tk.W, pady=10, padx=10)
            type_var = tk.StringVar(value="image")
            type_combo = ttk.Combobox(add_dialog, values=["image", "video", "audio", "embed"], textvariable=type_var, width=30)
            type_combo.grid(row=0, column=1, pady=10, padx=10)
            
            ttk.Label(add_dialog, text="标题:").grid(row=1, column=0, sticky=tk.W, pady=10, padx=10)
            title_entry = ttk.Entry(add_dialog, width=30)
            title_entry.grid(row=1, column=1, pady=10, padx=10)
            
            ttk.Label(add_dialog, text="URL/嵌入代码:").grid(row=2, column=0, sticky=tk.W, pady=10, padx=10)
            url_text = tk.Text(add_dialog, width=30, height=5)
            url_text.grid(row=2, column=1, pady=10, padx=10)
            
            def save_add():
                url_value = url_text.get('1.0', tk.END).strip()
                if not url_value:
                    messagebox.showwarning("警告", "请输入URL或嵌入代码！")
                    return
                media_list.append({
                    'type': type_var.get(),
                    'url': url_value,
                    'title': title_entry.get().strip()
                })
                refresh_media_list()
                add_dialog.destroy()
            
            ttk.Button(add_dialog, text="添加", command=save_add).grid(row=3, column=0, columnspan=2, pady=20)
        
        def edit_media():
            selected = media_tree.selection()
            if not selected:
                messagebox.showwarning("警告", "请先选择一个媒体资源！")
                return
            index = media_tree.index(selected[0])
            media = media_list[index]
            
            edit_dialog = tk.Toplevel(dialog)
            edit_dialog.title("编辑媒体资源")
            edit_dialog.geometry("400x300")
            edit_dialog.configure(bg="#1a1a2e")
            
            ttk.Label(edit_dialog, text="类型:").grid(row=0, column=0, sticky=tk.W, pady=10, padx=10)
            type_var = tk.StringVar(value=media['type'])
            type_combo = ttk.Combobox(edit_dialog, values=["image", "video", "audio", "embed"], textvariable=type_var, width=30)
            type_combo.grid(row=0, column=1, pady=10, padx=10)
            
            ttk.Label(edit_dialog, text="标题:").grid(row=1, column=0, sticky=tk.W, pady=10, padx=10)
            title_entry = ttk.Entry(edit_dialog, width=30)
            title_entry.insert(0, media.get('title', ''))
            title_entry.grid(row=1, column=1, pady=10, padx=10)
            
            ttk.Label(edit_dialog, text="URL/嵌入代码:").grid(row=2, column=0, sticky=tk.W, pady=10, padx=10)
            url_text = tk.Text(edit_dialog, width=30, height=5)
            url_text.insert('1.0', media.get('url', ''))
            url_text.grid(row=2, column=1, pady=10, padx=10)
            
            def save_edit():
                url_value = url_text.get('1.0', tk.END).strip()
                if not url_value:
                    messagebox.showwarning("警告", "请输入URL或嵌入代码！")
                    return
                media_list[index] = {
                    'type': type_var.get(),
                    'url': url_value,
                    'title': title_entry.get().strip()
                }
                refresh_media_list()
                edit_dialog.destroy()
            
            ttk.Button(edit_dialog, text="保存", command=save_edit).grid(row=3, column=0, columnspan=2, pady=20)
        
        def delete_media():
            selected = media_tree.selection()
            if not selected:
                messagebox.showwarning("警告", "请先选择一个媒体资源！")
                return
            index = media_tree.index(selected[0])
            if messagebox.askyesno("确认", "确定要删除这个媒体资源吗？"):
                del media_list[index]
                refresh_media_list()
        
        ttk.Button(media_button_frame, text="添加", command=add_media).grid(row=0, column=0, padx=2)
        ttk.Button(media_button_frame, text="编辑", command=edit_media).grid(row=0, column=1, padx=2)
        ttk.Button(media_button_frame, text="删除", command=delete_media).grid(row=0, column=2, padx=2)
        
        right_frame.columnconfigure(0, weight=1)
        right_frame.rowconfigure(1, weight=1)
        
        def save_culture():
            try:
                culture_data = {
                    'name': vars_dict['name'].get(),
                    'region': vars_dict['region'].get(),
                    'type': vars_dict['type'].get(),
                    'isHeritage': is_heritage_var.get(),
                    'description': vars_dict['description'].get('1.0', tk.END).strip(),
                    'details': vars_dict['details'].get('1.0', tk.END).strip(),
                    'media': media_list,
                    'heat': int(vars_dict['heat'].get() or 50),
                }
                
                if culture:
                    index = next((i for i, c in enumerate(self.data.get('cultures', [])) if c.get('id') == culture.get('id')), -1)
                    if index != -1:
                        culture_data['id'] = culture.get('id')
                        self.data['cultures'][index] = culture_data
                else:
                    max_id = max([c.get('id', 0) for c in self.data.get('cultures', [])], default=0)
                    culture_data['id'] = max_id + 1
                    if 'cultures' not in self.data:
                        self.data['cultures'] = []
                    self.data['cultures'].append(culture_data)
                
                self.update_stats()
                self.refresh_cultures_table()
                dialog.destroy()
                messagebox.showinfo("成功", "保存成功！")
            
            except Exception as e:
                messagebox.showerror("错误", f"保存失败: {str(e)}")
        
        button_frame = ttk.Frame(dialog)
        button_frame.grid(row=1, column=0, columnspan=2, pady=20)
        
        ttk.Button(button_frame, text="保存", command=save_culture).grid(row=0, column=0, padx=5)
        ttk.Button(button_frame, text="取消", command=dialog.destroy).grid(row=0, column=1, padx=5)
    
    def delete_culture(self):
        """删除文化项目"""
        selected = self.culture_tree.selection()
        if not selected:
            messagebox.showwarning("警告", "请先选择一个文化项目！")
            return
        
        if not messagebox.askyesno("确认", "确定要删除这个文化项目吗？此操作不可撤销！"):
            return
        
        item = self.culture_tree.item(selected[0])
        culture_id = item['values'][0]
        
        self.data['cultures'] = [c for c in self.data.get('cultures', []) if c.get('id') != culture_id]
        self.update_stats()
        self.refresh_cultures_table()
        messagebox.showinfo("成功", "删除成功！")
    
    def auto_set_heritage(self):
        """一键设置传统工艺为非遗"""
        count = 0
        for culture in self.data.get('cultures', []):
            culture_type = culture.get('type', '')
            if culture_type == '传统工艺' or culture_type == '传统工艺/民族服饰':
                culture['isHeritage'] = True
                count += 1
        
        self.update_stats()
        self.refresh_cultures_table()
        messagebox.showinfo("成功", f"已将 {count} 个传统工艺项目设置为非遗文化！")
    
    def on_region_select(self, event):
        """地区选择事件"""
        selection = self.region_listbox.curselection()
        if not selection:
            return
        
        region_name = self.region_listbox.get(selection[0])
        region = self.data.get(region_name, {})
        
        # 填充编辑字段
        for field_key, widget in self.region_vars.items():
            value = region.get(field_key, '')
            
            if isinstance(widget, tk.Text):
                widget.delete('1.0', tk.END)
                widget.insert('1.0', str(value))
            elif isinstance(widget, ttk.Entry):
                widget.delete(0, tk.END)
                if isinstance(value, list):
                    widget.insert(0, '，'.join(value))
                else:
                    widget.insert(0, str(value))
    
    def save_region_data(self):
        """保存地区数据"""
        selection = self.region_listbox.curselection()
        if not selection:
            messagebox.showwarning("警告", "请先选择一个地区！")
            return
        
        region_name = self.region_listbox.get(selection[0])
        
        # 解析数据
        region_data = {}
        for field_key, widget in self.region_vars.items():
            if isinstance(widget, tk.Text):
                value = widget.get('1.0', tk.END).strip()
            else:
                value = widget.get().strip()
            
            if field_key in ['民族节日', '民族食品', '民族代表文化', '世界文化遗产', '国家历史文化名城']:
                region_data[field_key] = [s.strip() for s in value.split('，') if s.strip()]
            elif field_key.endswith('数量'):
                region_data[field_key] = int(value) if value else ''
            else:
                region_data[field_key] = value
        
        # 更新数据
        if region_name in self.data:
            self.data[region_name].update(region_data)
        
        messagebox.showinfo("成功", "地区数据保存成功！")

def main():
    root = tk.Tk()
    app = CultureDataManager(root)
    root.mainloop()

if __name__ == '__main__':
    main()

