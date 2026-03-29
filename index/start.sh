#!/bin/bash

# 将环境变量注入到HTML文件中
if [ -f "index.html" ]; then
    # 创建一个临时文件
    temp_file=$(mktemp)
    
    # 在HTML文件的</head>标签前注入环境变量脚本
    cat > "$temp_file" << EOF
<script>
window.ENV_CONFIG = {
    SERVER_IP: '${SERVER_IP}'
};
</script>
EOF
    
    # 将环境变量脚本插入到HTML文件的</head>标签前
    sed -i "/<\/head>/r $temp_file" index.html
    
    # 删除临时文件
    rm -f "$temp_file"
fi

if [ -f "mz_screen/index.html" ]; then
    # 创建一个临时文件
    temp_file=$(mktemp)
    
    # 在HTML文件的</head>标签前注入环境变量脚本
    cat > "$temp_file" << EOF
<script>
window.ENV_CONFIG = {
    SERVER_IP: '${SERVER_IP}'
};
</script>
EOF
    
    # 将环境变量脚本插入到HTML文件的</head>标签前
    sed -i "/<\/head>/r $temp_file" mz_screen/index.html
    
    # 删除临时文件
    rm -f "$temp_file"
fi

# 启动应用
exec python api.py
