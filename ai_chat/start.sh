#!/bin/bash

if [ -f "static/index.html" ]; then
    temp_file=$(mktemp)
    cat > "$temp_file" << SCRIPT
<script>
window.ENV_CONFIG = {
    SERVER_IP: '${SERVER_IP:-20.196.138.17}'
};
</script>
SCRIPT
    sed -i "/<\/head>/r $temp_file" static/index.html
    rm -f "$temp_file"
fi

exec uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
