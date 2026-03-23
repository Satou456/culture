    // 创建内容区域
    var infoBody = document.createElement("div");
    infoBody.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;
    
    // 添加媒体资源（图片、视频、音频）
    if (culture.media && culture.media.length > 0) {
      var mediaContainer = document.createElement("div");
      mediaContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
        align-items: flex-start;
      `;
      
      culture.media.forEach(function(media, index) {
        var mediaWrapper = document.createElement("div");
        mediaWrapper.style.cssText = `
          flex: 0 0 auto;
          max-width: 300px;
        `;
        
        if (media.type === 'image') {
          var img = document.createElement("img");
          img.src = media.url;
          img.alt = media.title || culture.name;
          img.style.cssText = `
            max-width: 100%;
            max-height: 250px;
            object-fit: contain;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
          `;
          img.onclick = function() {
            showImageModal(media.url);
          };
          img.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
          };
          img.onmouseleave = function() {
            this.style.transform = 'scale(1)';
          };
          mediaWrapper.appendChild(img);
        } else if (media.type === 'video') {
          var video = document.createElement("video");
          video.src = media.url;
          video.controls = true;
          video.style.cssText = `
            max-width: 100%;
            max-height: 250px;
            border-radius: 8px;
          `;
          mediaWrapper.appendChild(video);
        } else if (media.type === 'audio') {
          var audio = document.createElement("audio");
          audio.src = media.url;
          audio.controls = true;
          audio.style.cssText = `
            width: 100%;
            border-radius: 8px;
          `;
          if (media.title) {
            var audioTitle = document.createElement("div");
            audioTitle.textContent = media.title;
            audioTitle.style.cssText = `
              margin-bottom: 8px;
              font-size: 14px;
              color: #00f2f1;
            `;
            mediaWrapper.appendChild(audioTitle);
          }
          mediaWrapper.appendChild(audio);
        }
        
        mediaContainer.appendChild(mediaWrapper);
      });
      
      infoBody.appendChild(mediaContainer);
    } else if (culture.image && culture.image.trim() !== '') {
      // 兼容性：如果只有旧的 image 字段
      var infoImage = document.createElement("img");
      infoImage.src = culture.image;
      infoImage.style.cssText = `
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: 8px;
        margin: 0 auto;
        cursor: pointer;
      `;
      infoImage.onclick = function() {
        showImageModal(culture.image);
      };
      infoBody.appendChild(infoImage);
    }
