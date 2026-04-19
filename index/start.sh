#!/bin/bash

if [ -f "index.html" ]; then
    temp_file=$(mktemp)
    cat > "$temp_file" << SCRIPT
<script>
window.ENV_CONFIG = {
    SERVER_IP: '${SERVER_IP}'
};
</script>
SCRIPT
    sed -i "/<\/head>/r $temp_file" index.html
    rm -f "$temp_file"
fi

if [ -f "mz_screen/index.html" ]; then
    temp_file=$(mktemp)
    cat > "$temp_file" << SCRIPT
<script>
window.ENV_CONFIG = {
    SERVER_IP: '${SERVER_IP}'
};
</script>
SCRIPT
    sed -i "/<\/head>/r $temp_file" mz_screen/index.html
    rm -f "$temp_file"
fi

exec python api.py
