// 错误处理工具类
export const errorHandler = {
  // 显示错误信息
  showError: function(message, duration = 3000) {
    // 创建错误提示元素
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .error-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        animation: slideDown 0.3s ease-out;
      }
      
      .error-content {
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 4px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .error-icon {
        margin-right: 8px;
        font-size: 16px;
      }
      
      .error-message {
        color: #dc2626;
        font-size: 14px;
        white-space: nowrap;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(errorToast);
    
    // 自动消失
    setTimeout(() => {
      errorToast.style.animation = 'slideUp 0.3s ease-in forwards';
      setTimeout(() => {
        document.body.removeChild(errorToast);
        document.head.removeChild(style);
      }, 300);
    }, duration);
  },
  
  // 处理API请求错误
  handleApiError: function(error) {
    const errorMessage = error.message || '操作失败';
    this.showError(errorMessage);
    console.error('API Error:', error);
  }
};

// 添加slideUp动画样式
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(slideUpStyle);