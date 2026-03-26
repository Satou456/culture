// ESC 键关闭弹窗
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var allElements = document.body.children;
    for (var i = allElements.length - 1; i >= 0; i--) {
      var el = allElements[i];
      if (el.style && el.style.position === 'fixed' &&
        (el.style.zIndex >= 1000 || el.classList.contains('culture-info-modal') ||
          el.style.background && el.style.background.indexOf('rgba') !== -1)) {
        document.body.removeChild(el);
        break;
      }
    }
  }
});

// 柱状图1模块 - 文化种类统计
(function () {
  // 实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"));
  // 指定配置和数据
  var option = {
    color: ["#4a89dc", "#f6bb42"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: "0%",
      top: "10px",
      right: "0%",
      bottom: "4%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: [
          "代表建筑",
          "民族服饰",
          "民族音乐",
          "传统工艺",
          "民族运动"
        ],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12"
          }
        },
        axisLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          textStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12"
          }
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
          }
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,.1)"
          }
        }
      }
    ],
    series: [
      {
        name: "文化数量",
        type: "bar",
        barWidth: "35%",
        data: [0, 0, 0, 0, 0],
        itemStyle: {
          barBorderRadius: 5
        }
      }
    ]
  };

  // 把配置给实例对象
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });

  // 全局文化数据
  let globalCultureData = null;

  // 全局变量，用于存储当前选中的地区
  let currentRegionData = null;

  // 加载文化数据
  function loadGlobalCultureData() {
    return axios.get('/mz_screen/data/culturedata.json')
      .then(function (response) {
        globalCultureData = response.data;
      })
      .catch(function (error) {
        console.error("获取文化数据失败:", error);
      });
  }

  // 初始加载数据
  loadGlobalCultureData().then(function () {
    // 页面加载完成后，显示默认数据（所有地区的文化种类分布）
    window.updateCultureChart(null);
  });

  // 更新柱状图数据的函数
  window.updateCultureChart = function (regionData) {
    // 更新当前选中的地区
    currentRegionData = regionData;

    // 统计实际收录的文化数量
    if (globalCultureData && globalCultureData.cultures) {
      // 按文化类型统计数量
      const typeCounts = {
        "代表建筑": 0,
        "民族服饰": 0,
        "民族音乐": 0,
        "传统工艺": 0,
        "民族运动": 0
      };

      // 根据地区筛选文化数据
      let filteredCultures = globalCultureData.cultures;
      if (regionData) {
        // 更灵活的地区匹配逻辑
        filteredCultures = globalCultureData.cultures.filter(culture => {
          // 精确匹配
          if (culture.region === regionData.name) return true;
          // 包含匹配（如"内蒙古"匹配"内蒙古自治区"）
          if (culture.region.includes(regionData.name) || regionData.name.includes(culture.region)) return true;
          // 特殊匹配
          if (regionData.name === "云南" && culture.region === "云南省") return true;
          if (regionData.name === "内蒙古" && culture.region === "内蒙古自治区") return true;
          return false;
        });
      }

      filteredCultures.forEach(culture => {
        if (typeCounts.hasOwnProperty(culture.type)) {
          typeCounts[culture.type]++;
        }
      });

      // 更新数据
      option.series[0].data = [
        typeCounts["代表建筑"],
        typeCounts["民族服饰"],
        typeCounts["民族音乐"],
        typeCounts["传统工艺"],
        typeCounts["民族运动"]
      ];

      if (regionData) {
        option.series[0].name = regionData.name + "文化数量";
      } else {
        option.series[0].name = "文化数量";
      }
    } else {
      // 如果没有数据，显示默认值
      option.series[0].data = [0, 0, 0, 0, 0];
      option.series[0].name = "文化数量";
    }
    myChart.setOption(option);
  };

  // 更新当前选中的地区
  window.setCurrentRegion = function (regionData) {
    currentRegionData = regionData;
  };

  // 添加点击事件
  myChart.on('click', function (params) {
    if (params.componentType === 'series' && params.seriesType === 'bar') {
      const category = params.name;
      const value = params.value;

      // 显示文化种类详情弹窗
      showCultureTypeModal(category, value);
    }
  });

  // 显示文化种类详情弹窗
  function showCultureTypeModal(category, count) {
    // 创建弹窗
    var typeModal = document.createElement("div");
    typeModal.className = "culture-type-modal";
    typeModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 4000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    document.body.appendChild(typeModal);

    // 创建内容容器
    var modalContent = document.createElement("div");
    modalContent.style.cssText = `
      position: relative;
      max-width: 70vw;
      max-height: 70vh;
      background: rgba(30, 30, 30, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 20px;
      color: #fff;
      overflow-y: auto;
    `;
    typeModal.appendChild(modalContent);

    // 创建标题
    var modalTitle = document.createElement("h2");
    modalTitle.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      color: #f6bb42;
    `;
    modalTitle.textContent = category;
    modalContent.appendChild(modalTitle);

    // 创建数量显示
    var modalCount = document.createElement("div");
    modalCount.style.cssText = `
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    `;
    modalCount.textContent = `共收录 ${count} 项`;
    modalContent.appendChild(modalCount);

    // 创建文化列表
    var cultureList = document.createElement("ul");
    cultureList.style.cssText = `
      list-style: none;
      padding: 0;
      margin: 0;
      columns: 2;
      column-gap: 20px;
    `;
    modalContent.appendChild(cultureList);

    // 填充文化列表
    if (globalCultureData && globalCultureData.cultures) {
      let filteredCultures = globalCultureData.cultures.filter(culture => {
        // 根据类别筛选文化
        const typeMap = {
          "代表建筑": "代表建筑",
          "民族服饰": "民族服饰",
          "民族音乐": "民族音乐",
          "传统工艺": "传统工艺",
          "民族运动": "民族运动"
        };
        return culture.type === typeMap[category];
      });

      // 根据当前选中的地区筛选文化
      if (currentRegionData) {
        filteredCultures = filteredCultures.filter(culture => {
          // 精确匹配
          if (culture.region === currentRegionData.name) return true;
          // 包含匹配（如"内蒙古"匹配"内蒙古自治区"）
          if (culture.region.includes(currentRegionData.name) || currentRegionData.name.includes(culture.region)) return true;
          // 特殊匹配
          if (currentRegionData.name === "云南" && culture.region === "云南省") return true;
          if (currentRegionData.name === "内蒙古" && culture.region === "内蒙古自治区") return true;
          return false;
        });
      }

      if (filteredCultures.length > 0) {
        filteredCultures.forEach(culture => {
          const listItem = document.createElement("li");
          listItem.style.cssText = `
            margin-bottom: 5px;
            font-size: 14px;
            cursor: pointer;
            transition: color 0.3s ease;
          `;
          listItem.textContent = culture.name;
          listItem.onclick = function () {
            // 显示文化详细信息
            showCultureInfo(culture);
          };
          listItem.onmouseenter = function () {
            this.style.color = '#f6bb42';
          };
          listItem.onmouseleave = function () {
            this.style.color = '#fff';
          };
          cultureList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.style.cssText = `
          margin-bottom: 5px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        `;
        listItem.textContent = "暂无该类型的文化数据";
        cultureList.appendChild(listItem);
      }
    } else {
      const listItem = document.createElement("li");
      listItem.style.cssText = `
        margin-bottom: 5px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      `;
      listItem.textContent = "加载文化数据中...";
      cultureList.appendChild(listItem);
    }

    // 创建关闭按钮
    var closeBtn = document.createElement("button");
    closeBtn.innerText = "关闭";
    closeBtn.style.cssText = `
      margin-top: 20px;
      padding: 8px 16px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      margin-left: auto;
      margin-right: auto;
    `;
    closeBtn.onclick = function () {
      document.body.removeChild(typeModal);
    };
    modalContent.appendChild(closeBtn);

    // 点击背景关闭
    typeModal.onclick = function (e) {
      if (e.target === typeModal) {
        document.body.removeChild(typeModal);
      }
    };
  }

  // 显示文化详细信息
  function showCultureInfo(culture) {
    // 创建文化详情弹窗
    var cultureInfoModal = document.createElement("div");
    cultureInfoModal.className = "culture-info-modal";
    cultureInfoModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 5000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    document.body.appendChild(cultureInfoModal);

    // 创建弹窗内容
    var infoContent = document.createElement("div");
    infoContent.style.cssText = `
      position: relative;
      max-width: 80vw;
      max-height: 80vh;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 30px;
      color: #fff;
      overflow-y: auto;
    `;
    cultureInfoModal.appendChild(infoContent);

    // 创建标题
    var infoTitle = document.createElement("h2");
    infoTitle.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      color: #f6bb42;
    `;
    infoTitle.textContent = culture.name;
    infoContent.appendChild(infoTitle);

    // 创建左右布局的容器
    var infoBody = document.createElement("div");
    infoBody.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 30px;
      width: 100%;
    `;

    // 左侧：媒体展示区域
    var leftPanel = document.createElement("div");
    leftPanel.style.cssText = `
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `;

    // 右侧：内容展示区域
    var rightPanel = document.createElement("div");
    rightPanel.style.cssText = `
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      max-height: 500px;
      padding-right: 10px;
    `;

    // 添加媒体资源（图片、视频、音频）到左侧面板
    if (culture.media && culture.media.length > 0) {
      var mediaContainer = document.createElement("div");
      mediaContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
        width: 100%;
      `;

      culture.media.forEach(function (media, index) {
        var mediaWrapper = document.createElement("div");
        mediaWrapper.style.cssText = `
          width: 100%;
          display: flex;
          justify-content: center;
        `;

        if (media.type === 'image') {
          var img = document.createElement("img");
          img.src = media.url;
          img.alt = media.title || culture.name;
          img.style.cssText = `
            max-width: 100%;
            max-height: 350px;
            object-fit: contain;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
          `;
          img.onclick = function () {
            showImageModal(media.url);
          };
          img.onmouseenter = function () {
            this.style.transform = 'scale(1.02)';
          };
          img.onmouseleave = function () {
            this.style.transform = 'scale(1)';
          };
          mediaWrapper.appendChild(img);
        } else if (media.type === 'video') {
          var video = document.createElement("video");
          video.src = media.url;
          video.controls = true;
          video.style.cssText = `
            max-width: 100%;
            max-height: 350px;
            border-radius: 8px;
          `;
          mediaWrapper.appendChild(video);
        } else if (media.type === 'audio') {
          var audioContainer = document.createElement("div");
          audioContainer.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          `;
          if (media.title) {
            var audioTitle = document.createElement("div");
            audioTitle.textContent = media.title;
            audioTitle.style.cssText = `
              margin-bottom: 8px;
              font-size: 14px;
              color: #f6bb42;
            `;
            audioContainer.appendChild(audioTitle);
          }
          var audio = document.createElement("audio");
          audio.src = media.url;
          audio.controls = true;
          audio.style.cssText = `
            width: 100%;
            border-radius: 8px;
          `;
          audioContainer.appendChild(audio);
          mediaWrapper.appendChild(audioContainer);
        } else if (media.type === 'embed') {
          var embedContainer = document.createElement("div");
          embedContainer.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          `;
          if (media.title) {
            var embedTitle = document.createElement("div");
            embedTitle.textContent = media.title;
            embedTitle.style.cssText = `
              margin-bottom: 8px;
              font-size: 14px;
              color: #f6bb42;
            `;
            embedContainer.appendChild(embedTitle);
          }
          var iframeWrapper = document.createElement("div");
          iframeWrapper.style.cssText = `
            width: 100%;
            max-width: 500px;
            aspect-ratio: 16/9;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
          `;
          var iframe = document.createElement("div");
          iframe.innerHTML = media.url;
          var iframeElement = iframe.firstChild;
          if (iframeElement && iframeElement.tagName === 'IFRAME') {
            iframeElement.style.cssText = `
              width: 100%;
              height: 100%;
              border: none;
            `;
            iframeWrapper.appendChild(iframeElement);
          } else {
            iframeWrapper.textContent = '嵌入代码格式错误';
            iframeWrapper.style.cssText = `
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgba(255,255,255,0.5);
            `;
          }
          embedContainer.appendChild(iframeWrapper);
          mediaWrapper.appendChild(embedContainer);
        }

        mediaContainer.appendChild(mediaWrapper);
      });

      leftPanel.appendChild(mediaContainer);
    } else if (culture.image && culture.image.trim() !== '') {
      // 兼容性：如果只有旧的 image 字段
      var infoImage = document.createElement("img");
      infoImage.src = culture.image;
      infoImage.style.cssText = `
        max-width: 100%;
        max-height: 350px;
        object-fit: contain;
        border-radius: 8px;
        cursor: pointer;
      `;
      infoImage.onclick = function () {
        showImageModal(culture.image);
      };
      leftPanel.appendChild(infoImage);
    } else {
      // 如果没有媒体，显示提示
      var noMedia = document.createElement("div");
      noMedia.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
      `;
      noMedia.textContent = "暂无媒体资源";
      leftPanel.appendChild(noMedia);
    }

    // 添加描述到右侧面板
    var infoDescription = document.createElement("div");
    infoDescription.innerHTML = `
      <strong style="color: #f6bb42;">文化简介：</strong>
      <span style="display: block; margin-top: 8px;">${culture.description}</span>
    `;
    rightPanel.appendChild(infoDescription);

    // 添加详细介绍到右侧面板
    var infoDetails = document.createElement("div");
    infoDetails.innerHTML = `
      <strong style="color: #f6bb42;">详细介绍：</strong>
      <div style="margin-top: 10px; line-height: 1.8; text-align: justify;">${culture.details}</div>
    `;
    rightPanel.appendChild(infoDetails);

    // 添加基本信息到右侧面板
    var infoBasic = document.createElement("div");
    infoBasic.innerHTML = `
      <strong style="color: #f6bb42;">基本信息：</strong>
      <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.8;">
        <li>地区：${culture.region}</li>
        <li>类型：${culture.type}</li>
        <li>热度：${culture.heat}</li>
      </ul>
    `;
    rightPanel.appendChild(infoBasic);

    // 将左右面板添加到主容器
    infoBody.appendChild(leftPanel);
    infoBody.appendChild(rightPanel);

    infoContent.appendChild(infoBody);

    // 创建关闭按钮
    var closeInfoBtn = document.createElement("button");
    closeInfoBtn.innerText = "关闭";
    closeInfoBtn.style.cssText = `
      margin-top: 20px;
      padding: 10px 20px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      margin-left: auto;
      margin-right: auto;
    `;
    closeInfoBtn.onclick = function () {
      document.body.removeChild(cultureInfoModal);
    };
    infoContent.appendChild(closeInfoBtn);

    // 点击背景关闭
    cultureInfoModal.onclick = function (e) {
      if (e.target === cultureInfoModal) {
        document.body.removeChild(cultureInfoModal);
      }
    };
  }
})();

// 示例：监听 mapHoverHandler 发出的请求事件，并在页面显示/记录
document.addEventListener('map-region-request', function (e) {
  var detail = (e && e.detail) ? e.detail : {};
  try { console.log('[mapHover] 收到请求：', detail.message, detail.params); } catch (e) { }
  var display = document.querySelector('.map .map1');
  if (display) display.innerText = detail.message || '';
});

// 折线图定制 - 地区文化访问人数
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".line .chart"));

  // 2. 指定配置和数据
  var option = {
    color: ["#4a89dc"],
    tooltip: {
      // 通过坐标轴来触发
      trigger: "axis"
    },
    legend: {
      // 距离容器10%
      right: "10%",
      // 修饰图例文字的颜色
      textStyle: {
        color: "#4c9bfd"
      }
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      show: true,
      borderColor: "#012f4a",
      containLabel: true
    },

    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "rgba(255,255,255,.7)"
      },
      // 去除x坐标轴的颜色
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "rgba(255,255,255,.7)"
      },
      // 修改y轴分割线的颜色
      splitLine: {
        lineStyle: {
          color: "#012f4a"
        }
      }
    },
    series: [
      {
        name: "文化访问人数",
        type: "line",
        stack: "总量",
        // 是否让线条圆滑显示
        smooth: true,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };
  // 3. 把配置和数据给实例对象
  myChart.setOption(option);

  // 更新折线图数据的函数
  window.updateVisitChart = function (regionData) {
    if (!regionData || !regionData["地区访问人数"] || regionData["地区访问人数"].length === 0) {
      // 如果没有数据，显示默认值
      option.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      option.series[0].name = "文化访问人数";
    } else {
      // 更新数据
      option.series[0].data = regionData["地区访问人数"];
      option.series[0].name = regionData.name + "文化访问人数";
    }
    myChart.setOption(option);
  };

  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();

// 饼形图定制 - 地区年龄占比
(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector(".pie .chart"));

  option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c}%",
      position: function (p) {
        //其中p为当前鼠标的位置
        return [p[0] + 10, p[1] - 10];
      }
    },
    legend: {
      top: "90%",
      itemWidth: 10,
      itemHeight: 10,
      data: [],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "12"
      }
    },
    series: [
      {
        name: "年龄分布",
        type: "pie",
        center: ["50%", "42%"],
        radius: ["40%", "60%"],
        color: [
          "#2a5db0",
          "#3a6dc0",
          "#4a7dd0",
          "#4a89dc",
          "#5a99ec",
          "#f6bb42",
          "#f7cb52",
          "#f8db62",
          "#f9eb72"
        ],
        label: { show: false },
        labelLine: { show: false },
        data: []
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  // 更新饼图数据的函数
  window.updateAgeChart = function (regionData) {
    if (!regionData || !regionData["地区年龄占比"] || Object.keys(regionData["地区年龄占比"]).length === 0) {
      // 如果没有数据，显示默认值
      option.legend.data = ["暂无数据"];
      option.series[0].data = [{ value: 100, name: "暂无数据" }];
      option.series[0].name = "年龄分布";
    } else {
      // 转换数据格式
      const ageData = Object.entries(regionData["地区年龄占比"]).map(([age, ratio]) => {
        return { value: ratio, name: age };
      });

      // 更新数据
      option.legend.data = Object.keys(regionData["地区年龄占比"]);
      option.series[0].data = ageData;
      option.series[0].name = regionData.name + "年龄分布";
    }
    myChart.setOption(option);
  };

  window.addEventListener("resize", function () {
    myChart.resize();
  });
})();
// 地区民族占比表格模块
(function () {
  // 获取容器元素
  var container = document.querySelector(".bar1");

  // 创建表格容器
  var tableContainer = document.createElement("div");
  tableContainer.className = "ethnic-table-container";
  tableContainer.style.cssText = `
    padding: 10px;
    height: 3rem;
    overflow-y: auto;
  `;

  // 创建表格
  var table = document.createElement("table");
  table.className = "ethnic-table";
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    color: #fff;
    font-size: 12px;
  `;

  // 创建表头
  var thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th style="border-bottom: 1px solid rgba(255,255,255,0.2); padding: 5px; text-align: left;">民族</th>
      <th style="border-bottom: 1px solid rgba(255,255,255,0.2); padding: 5px; text-align: right;">占比</th>
    </tr>
  `;

  // 创建 tbody
  var tbody = document.createElement("tbody");
  tbody.innerHTML = `
    <tr>
      <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1);">暂无数据</td>
      <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">-</td>
    </tr>
  `;

  // 组装表格
  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);

  // 将表格添加到容器中
  container.insertBefore(tableContainer, container.querySelector(".panel-footer"));

  // 创建民族详情弹出框
  var ethnicDetailBox = document.createElement("div");
  ethnicDetailBox.className = "ethnic-detail-box";
  ethnicDetailBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 30px;
    color: #fff;
    width: 800px;
    max-width: 90vw;
    height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 3000;
    display: none;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  `;
  document.body.appendChild(ethnicDetailBox);

  // 创建弹出框内容容器
  var ethnicDetailContent = document.createElement("div");
  ethnicDetailContent.className = "ethnic-detail-content";
  ethnicDetailContent.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-weight: bold;">加载中...</div>
    </div>
  `;
  ethnicDetailBox.appendChild(ethnicDetailContent);

  // 创建关闭按钮
  var closeBtn = document.createElement("button");
  closeBtn.innerText = "关闭";
  closeBtn.style.cssText = `
    margin-top: 15px;
    padding: 8px 16px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    float: right;
  `;
  closeBtn.onclick = function () {
    ethnicDetailBox.style.display = "none";
  };
  ethnicDetailBox.appendChild(closeBtn);

  // 存储所有民族的列表
  var allEthnicGroups = [];

  // 从后端获取民族详细信息
  function fetchEthnicDetail(ethnicName) {
    console.log('开始获取民族详情:', ethnicName);
    // 发送axios请求获取数据
    return axios.get('/mz_screen/data/ethnic_groups.json')
      .then(function (response) {
        const data = response.data;
        console.log('获取数据成功:', data);
        console.log('ethnic_groups:', data.ethnic_groups);
        console.log('查找民族:', ethnicName, '是否存在:', ethnicName in data.ethnic_groups);

        // 存储所有民族的列表
        allEthnicGroups = Object.keys(data.ethnic_groups);
        console.log('所有民族列表:', allEthnicGroups);

        // 获取当前民族在列表中的索引
        const currentIndex = allEthnicGroups.indexOf(ethnicName);
        console.log('当前民族索引:', currentIndex);

        // 获取民族详情数据
        const ethnicData = data.ethnic_groups && data.ethnic_groups[ethnicName] || {
          "name": ethnicName,
          "population": "暂无数据",
          "origin": "暂无数据",
          "culture": "暂无数据",
          "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=150&fit=crop"
        };

        console.log('民族数据:', ethnicData);

        // 获取上一个和下一个民族
        const prevEthnic = currentIndex > 0 ? allEthnicGroups[currentIndex - 1] : allEthnicGroups[allEthnicGroups.length - 1];
        const nextEthnic = currentIndex < allEthnicGroups.length - 1 ? allEthnicGroups[currentIndex + 1] : allEthnicGroups[0];

        // 更新弹出框内容
        ethnicDetailContent.innerHTML = `
          <h2 style="text-align: center; margin-bottom: 30px; color: #f6bb42;">${ethnicData.name}民族详情</h2>
          <div style="display: flex; gap: 30px; margin-bottom: 30px;">
            <div style="flex: 0 0 250px;">
              <img src="${ethnicData.image}" alt="${ethnicData.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.3);">
            </div>
            <div style="flex: 1;">
              <div style="margin-bottom: 20px; font-size: 16px;">
                <strong style="color: #f6bb42; font-size: 18px;">人口：</strong>
                <span>${ethnicData.population}</span>
              </div>
              <div style="margin-bottom: 20px; font-size: 16px;">
                <strong style="color: #f6bb42; font-size: 18px;">来历：</strong>
                <span>${ethnicData.origin}</span>
              </div>
              <div style="font-size: 16px; line-height: 1.6;">
                <strong style="color: #f6bb42; font-size: 18px;">文化：</strong>
                <div style="margin-top: 10px;">${ethnicData.culture}</div>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <button onclick="fetchEthnicDetail('${prevEthnic}')" style="padding: 10px 20px; border: 1px solid #f6bb42; background: rgba(74, 137, 220, 0.1); color: #f6bb42; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
              上一页
            </button>
            <div style="text-align: center; color: rgba(255, 255, 255, 0.7); font-size: 14px;">
              ${currentIndex + 1} / ${allEthnicGroups.length}
            </div>
            <button onclick="fetchEthnicDetail('${nextEthnic}')" style="padding: 10px 20px; border: 1px solid #f6bb42; background: rgba(74, 137, 220, 0.1); color: #f6bb42; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
              下一页
            </button>
          </div>
        `;

        // 显示弹出框
        ethnicDetailBox.style.display = "block";
      })
      .catch(function (error) {
        console.error("获取民族详情数据失败:", error);
        ethnicDetailContent.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <div style="font-weight: bold; font-size: 18px;">获取数据失败，请稍后重试</div>
            <div style="font-size: 14px; color: #ff0000; margin-top: 15px;">错误: ${error.message}</div>
          </div>
        `;
        ethnicDetailBox.style.display = "block";
      });
  }

  // 更新表格数据的函数
  window.updateEthnicTable = function (regionData) {
    if (!regionData || !regionData["民族种类占比"] || Object.keys(regionData["民族种类占比"]).length === 0) {
      // 如果没有数据，显示默认内容
      tbody.innerHTML = `
        <tr>
          <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1);">暂无数据</td>
          <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">-</td>
        </tr>
      `;
      return;
    }

    // 转换数据并排序（按占比从高到低），过滤掉"其他"条目
    var ethnicData = Object.entries(regionData["民族种类占比"])
      .map(([ethnic, ratio]) => ({ ethnic, ratio }))
      .filter(item => item.ethnic !== "其他") // 过滤掉"其他"条目
      .sort((a, b) => b.ratio - a.ratio);

    // 生成表格内容
    var html = ethnicData.map(item => `
      <tr style="cursor: pointer;" onclick="fetchEthnicDetail('${item.ethnic}')">
        <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1);">${item.ethnic}</td>
        <td style="padding: 5px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${item.ratio}%</td>
      </tr>
    `).join("");

    // 更新表格内容
    tbody.innerHTML = html;
  };

  // 将fetchEthnicDetail函数暴露到全局，以便表格行点击时调用
  window.fetchEthnicDetail = fetchEthnicDetail;
})();
// 地区民族文化展示模块
(function () {
  // 获取容器元素
  var container = document.querySelector(".line1");

  // 创建列表容器
  var cultureListContainer = document.createElement("div");
  cultureListContainer.className = "culture-list-container";
  cultureListContainer.style.cssText = `
    padding: 10px;
    height: 150px;
    overflow-y: auto;
    color: #fff;
  `;

  // 创建列表
  var cultureList = document.createElement("ul");
  cultureList.className = "culture-list";
  cultureList.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
  `;

  // 初始列表内容
  cultureList.innerHTML = `
    <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <div style="font-weight: bold;">暂无数据</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.7);">请将鼠标悬浮在地图上查看地区民族文化信息</div>
    </li>
  `;

  // 组装并添加到容器
  cultureListContainer.appendChild(cultureList);
  container.insertBefore(cultureListContainer, container.querySelector(".panel-footer"));

  // 更新文化列表数据的函数
  window.updateCultureList = function (regionData) {
    if (!regionData) {
      // 如果没有数据，显示默认内容
      cultureList.innerHTML = `
        <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: bold;">暂无数据</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.7);">请将鼠标悬浮在地图上查看地区民族文化信息</div>
        </li>
      `;
      return;
    }

    // 整理文化数据
    var cultureData = [];

    // 民族节日
    if (regionData["民族节日"] && regionData["民族节日"].length > 0) {
      regionData["民族节日"].forEach(festival => {
        cultureData.push({
          type: "民族节日",
          name: festival
        });
      });
    }

    // 民族食品
    if (regionData["民族食品"] && regionData["民族食品"].length > 0) {
      regionData["民族食品"].forEach(food => {
        cultureData.push({
          type: "民族食品",
          name: food
        });
      });
    }

    // 民族代表文化
    if (regionData["民族代表文化"] && regionData["民族代表文化"].length > 0) {
      regionData["民族代表文化"].forEach(culture => {
        cultureData.push({
          type: "民族代表文化",
          name: culture
        });
      });
    }

    // 生成列表内容
    if (cultureData.length === 0) {
      cultureList.innerHTML = `
        <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: bold;">${regionData.name}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.7);">暂无民族文化数据</div>
        </li>
      `;
    } else {
      var html = `
        <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: bold;">${regionData.name}民族文化</div>
        </li>
      `;

      // 按类型分组显示
      var groupedData = cultureData.reduce((groups, item) => {
        if (!groups[item.type]) {
          groups[item.type] = [];
        }
        groups[item.type].push(item.name);
        return groups;
      }, {});

      for (var type in groupedData) {
        html += `
          <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 12px; font-weight: bold; color: #f6bb42;">${type}：</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-left: 10px;">${groupedData[type].join('、')}</div>
          </li>
        `;
      }

      cultureList.innerHTML = html;
    }
  };
})();

// 地区主要信息展示模块
(function () {
  // 获取容器元素
  var container = document.querySelector(".pie1");

  // 创建信息展示容器
  var infoContainer = document.createElement("div");
  infoContainer.className = "region-info-container";
  infoContainer.style.cssText = `
    padding: 10px;
    height: 150px;
    overflow-y: auto;
    color: #fff;
  `;

  // 初始信息内容
  infoContainer.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-weight: bold;">暂无数据</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 10px;">请将鼠标悬浮在地图上查看地区主要信息</div>
    </div>
  `;

  // 添加到容器
  container.insertBefore(infoContainer, container.querySelector(".panel-footer"));

  // 创建图片放大弹窗
  var imageModal = document.createElement("div");
  imageModal.className = "image-modal";
  imageModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 4000;
    display: none;
    justify-content: center;
    align-items: center;
  `;
  document.body.appendChild(imageModal);

  // 创建弹窗图片容器
  var modalImageContainer = document.createElement("div");
  modalImageContainer.style.cssText = `
    position: relative;
    max-width: 50vw;
    max-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  imageModal.appendChild(modalImageContainer);

  // 创建弹窗图片
  var modalImage = document.createElement("img");
  modalImage.style.cssText = `
    max-width: 50vw;
    max-height: 50vh;
    object-fit: contain;
    border-radius: 8px;
  `;
  modalImageContainer.appendChild(modalImage);

  // 创建关闭按钮
  var closeModalBtn = document.createElement("button");
  closeModalBtn.innerText = "关闭";
  closeModalBtn.style.cssText = `
    position: absolute;
    top: -30px;
    right: -30px;
    padding: 8px 16px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
  `;
  closeModalBtn.onclick = function () {
    imageModal.style.display = "none";
  };
  modalImageContainer.appendChild(closeModalBtn);

  // 点击弹窗背景关闭弹窗
  imageModal.onclick = function (e) {
    if (e.target === imageModal) {
      imageModal.style.display = "none";
    }
  };

  // 显示图片弹窗的函数
  function showImageModal(imgUrl) {
    modalImage.src = imgUrl;
    imageModal.style.display = "flex";
  }

  // 更新地区信息的函数
  window.updateRegionInfo = function (regionData) {
    if (!regionData) {
      // 如果没有数据，显示默认内容
      infoContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <div style="font-weight: bold;">暂无数据</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 10px;">请将鼠标悬浮在地图上查看地区主要信息</div>
        </div>
      `;
      return;
    }

    // 生成信息内容
    var html = `
      <div style="padding: 5px 0;">
        <div style="font-weight: bold; font-size: 14px;">${regionData.name}地区主要信息</div>
      </div>
    `;

    // 地区主要信息
    if (regionData["地区主要信息"] && regionData["地区主要信息"] !== "暂无数据") {
      html += `
        <div style="padding: 5px 0; font-size: 12px; line-height: 1.5;">
          <div style="font-weight: bold; color: #f6bb42;">地区简介：</div>
          <div style="margin-left: 10px; color: rgba(255,255,255,0.9);">${regionData["地区主要信息"]}</div>
        </div>
      `;
    }

    // 地区特色图片（如果有）
    if (regionData["地区图片"] && regionData["地区图片"].length > 0) {
      html += `
        <div style="padding: 5px 0; font-size: 12px;">
          <div style="font-weight: bold; color: #f6bb42;">地区图片：</div>
          <div style="margin-left: 10px; margin-top: 5px; display: flex; gap: 10px; flex-wrap: wrap;">
      `;

      regionData["地区图片"].forEach(imgUrl => {
        html += `
          <div style="width: 80px; height: 60px; overflow: hidden; border-radius: 4px; cursor: pointer;">
            <img src="${imgUrl}" alt="${regionData.name}" style="width: 100%; height: 100%; object-fit: cover;" onclick="showImageModal('${imgUrl}')" />
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    // 民族节日
    if (regionData["民族节日"] && regionData["民族节日"].length > 0) {
      html += `
        <div style="padding: 5px 0; font-size: 12px;">
          <div style="font-weight: bold; color: #f6bb42;">民族节日：</div>
          <div style="margin-left: 10px; color: rgba(255,255,255,0.9);">${regionData["民族节日"].join('、')}</div>
        </div>
      `;
    }

    // 民族食品
    if (regionData["民族食品"] && regionData["民族食品"].length > 0) {
      html += `
        <div style="padding: 5px 0; font-size: 12px;">
          <div style="font-weight: bold; color: #f6bb42;">民族食品：</div>
          <div style="margin-left: 10px; color: rgba(255,255,255,0.9);">${regionData["民族食品"].join('、')}</div>
        </div>
      `;
    }

    // 更新信息内容
    infoContainer.innerHTML = html;
  };

  // 将showImageModal函数暴露到全局，以便图片点击时调用
  window.showImageModal = showImageModal;
})();

// 文化数量统计模块
(function () {
  // 获取元素
  var totalCultureCount = document.getElementById('total-culture-count');
  var intangibleCultureCount = document.getElementById('intangible-culture-count');

  // 创建文化详情弹窗
  var cultureDetailModal = document.createElement("div");
  cultureDetailModal.className = "culture-detail-modal";
  cultureDetailModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 4000;
    display: none;
    justify-content: center;
    align-items: center;
  `;
  document.body.appendChild(cultureDetailModal);

  // 创建弹窗内容容器
  var modalContent = document.createElement("div");
  modalContent.style.cssText = `
    position: relative;
    max-width: 70vw;
    max-height: 70vh;
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 20px;
    color: #fff;
    overflow-y: auto;
  `;
  cultureDetailModal.appendChild(modalContent);

  // 创建弹窗标题
  var modalTitle = document.createElement("h2");
  modalTitle.style.cssText = `
    text-align: center;
    margin-bottom: 20px;
    color: #f6bb42;
  `;
  modalContent.appendChild(modalTitle);

  // 创建文化数量显示
  var modalCount = document.createElement("div");
  modalCount.style.cssText = `
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  `;
  modalContent.appendChild(modalCount);

  // 创建文化名称列表容器
  var cultureListContainer = document.createElement("div");
  cultureListContainer.style.cssText = `
    margin-top: 20px;
  `;
  modalContent.appendChild(cultureListContainer);

  // 创建文化名称标题
  var cultureListTitle = document.createElement("h3");
  cultureListTitle.style.cssText = `
    margin-bottom: 10px;
    color: #f6bb42;
    font-size: 16px;
  `;
  cultureListContainer.appendChild(cultureListTitle);

  // 创建文化名称列表
  var cultureList = document.createElement("ul");
  cultureList.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
    columns: 2;
    column-gap: 20px;
  `;
  cultureListContainer.appendChild(cultureList);

  // 创建关闭按钮
  var closeModalBtn = document.createElement("button");
  closeModalBtn.innerText = "关闭";
  closeModalBtn.style.cssText = `
    margin-top: 20px;
    padding: 8px 16px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
  `;
  closeModalBtn.onclick = function () {
    cultureDetailModal.style.display = "none";
  };
  modalContent.appendChild(closeModalBtn);

  // 点击弹窗背景关闭弹窗
  cultureDetailModal.onclick = function (e) {
    if (e.target === cultureDetailModal) {
      cultureDetailModal.style.display = "none";
    }
  };

  // 从后端获取文化数量数据和文化名称
  function fetchCultureCountData() {
    // 发送axios请求获取数据
    return axios.get('/mz_screen/data/culturedata.json')
      .then(function (response) {
        const data = response.data;
        // 计算文化总数和非遗文化数量
        let totalCount = 0;
        let intangibleCount = 0;

        // 从全国数据中获取文化数量
        if (data.全国) {
          // 计算总文化数量
          totalCount = data.全国["代表建筑数量"] +
            data.全国["民族服饰数量"] +
            data.全国["民族音乐数量"] +
            data.全国["传统工艺数量"] +
            data.全国["民族运动数量"];

          // 计算非遗文化数量（使用国家级非遗代表性项目数量）
          intangibleCount = data.全国["国家级非遗代表性项目数量"];
        }

        // 更新页面显示
        totalCultureCount.textContent = totalCount;
        intangibleCultureCount.textContent = intangibleCount;

        // 为元素添加点击事件
        totalCultureCount.onclick = function () {
          showCultureDetailModal('共收录文化数量', totalCount, data, 'total');
        };

        intangibleCultureCount.onclick = function () {
          showCultureDetailModal('非遗文化数量', intangibleCount, data, 'intangible');
        };

        // 添加鼠标悬停效果
        totalCultureCount.style.cursor = 'pointer';
        totalCultureCount.style.textDecoration = 'underline';
        intangibleCultureCount.style.cursor = 'pointer';
        intangibleCultureCount.style.textDecoration = 'underline';
      })
      .catch(function (error) {
        console.error("获取文化数量数据失败:", error);
        // 如果请求失败，显示默认值
        totalCultureCount.textContent = "0";
        intangibleCultureCount.textContent = "0";
      });
  }

  // 显示文化详情弹窗
  function showCultureDetailModal(title, count, data, type) {
    // 更新标题和数量
    modalTitle.textContent = title;
    modalCount.textContent = count;

    // 更新文化列表标题
    cultureListTitle.textContent = `${title}明细：`;

    // 清空文化列表
    cultureList.innerHTML = '';

    // 生成文化名称列表
    let cultureItems = [];

    // 根据类型显示不同的内容
    if (type === 'total') {
      // 共收录文化数量，显示各类文化数量
      cultureItems = [
        `代表建筑：${data.全国["代表建筑数量"]}项`,
        `民族服饰：${data.全国["民族服饰数量"]}项`,
        `民族音乐：${data.全国["民族音乐数量"]}项`,
        `传统工艺：${data.全国["传统工艺数量"]}项`,
        `民族运动：${data.全国["民族运动数量"]}项`
      ];
    } else if (type === 'intangible') {
      // 非遗文化数量，显示国家级非遗代表性项目数量
      cultureItems = [
        `国家级非遗代表性项目数量：${data.全国["国家级非遗代表性项目数量"]}项`
      ];
    }

    // 生成列表项
    if (cultureItems.length > 0) {
      cultureItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.style.cssText = `
          margin-bottom: 5px;
          font-size: 14px;
        `;
        listItem.textContent = item;
        cultureList.appendChild(listItem);
      });
    } else {
      const listItem = document.createElement("li");
      listItem.style.cssText = `
        margin-bottom: 5px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      `;
      listItem.textContent = "暂无数据";
      cultureList.appendChild(listItem);
    }

    // 显示弹窗
    cultureDetailModal.style.display = "flex";
  }

  // 显示文化详细信息
  function showCultureInfo(culture) {
    // 创建文化详情弹窗
    var cultureInfoModal = document.createElement("div");
    cultureInfoModal.className = "culture-info-modal";
    cultureInfoModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 5000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    document.body.appendChild(cultureInfoModal);

    // 创建弹窗内容
    var infoContent = document.createElement("div");
    infoContent.style.cssText = `
      position: relative;
      max-width: 80vw;
      max-height: 80vh;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 30px;
      color: #fff;
      overflow-y: auto;
    `;
    cultureInfoModal.appendChild(infoContent);

    // 创建标题
    var infoTitle = document.createElement("h2");
    infoTitle.style.cssText = `
      text-align: center;
      margin-bottom: 20px;
      color: #f6bb42;
    `;
    infoTitle.textContent = culture.name;
    infoContent.appendChild(infoTitle);

    // 创建左右布局的容器
    var infoBody = document.createElement("div");
    infoBody.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 30px;
      width: 100%;
    `;

    // 左侧：媒体展示区域
    var leftPanel = document.createElement("div");
    leftPanel.style.cssText = `
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `;

    // 右侧：内容展示区域
    var rightPanel = document.createElement("div");
    rightPanel.style.cssText = `
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      max-height: 500px;
      padding-right: 10px;
    `;

    // 添加媒体资源（图片、视频、音频）到左侧面板
    if (culture.media && culture.media.length > 0) {
      var mediaContainer = document.createElement("div");
      mediaContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
        width: 100%;
      `;

      culture.media.forEach(function (media, index) {
        var mediaWrapper = document.createElement("div");
        mediaWrapper.style.cssText = `
          width: 100%;
          display: flex;
          justify-content: center;
        `;

        if (media.type === 'image') {
          var img = document.createElement("img");
          img.src = media.url;
          img.alt = media.title || culture.name;
          img.style.cssText = `
            max-width: 100%;
            max-height: 350px;
            object-fit: contain;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
          `;
          img.onclick = function () {
            showImageModal(media.url);
          };
          img.onmouseenter = function () {
            this.style.transform = 'scale(1.02)';
          };
          img.onmouseleave = function () {
            this.style.transform = 'scale(1)';
          };
          mediaWrapper.appendChild(img);
        } else if (media.type === 'video') {
          var video = document.createElement("video");
          video.src = media.url;
          video.controls = true;
          video.style.cssText = `
            max-width: 100%;
            max-height: 350px;
            border-radius: 8px;
          `;
          mediaWrapper.appendChild(video);
        } else if (media.type === 'audio') {
          var audioContainer = document.createElement("div");
          audioContainer.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          `;
          if (media.title) {
            var audioTitle = document.createElement("div");
            audioTitle.textContent = media.title;
            audioTitle.style.cssText = `
              margin-bottom: 8px;
              font-size: 14px;
              color: #f6bb42;
            `;
            audioContainer.appendChild(audioTitle);
          }
          var audio = document.createElement("audio");
          audio.src = media.url;
          audio.controls = true;
          audio.style.cssText = `
            width: 100%;
            border-radius: 8px;
          `;
          audioContainer.appendChild(audio);
          mediaWrapper.appendChild(audioContainer);
        } else if (media.type === 'embed') {
          var embedContainer = document.createElement("div");
          embedContainer.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          `;
          if (media.title) {
            var embedTitle = document.createElement("div");
            embedTitle.textContent = media.title;
            embedTitle.style.cssText = `
              margin-bottom: 8px;
              font-size: 14px;
              color: #f6bb42;
            `;
            embedContainer.appendChild(embedTitle);
          }
          var iframeWrapper = document.createElement("div");
          iframeWrapper.style.cssText = `
            width: 100%;
            max-width: 500px;
            aspect-ratio: 16/9;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
          `;
          var iframe = document.createElement("div");
          iframe.innerHTML = media.url;
          var iframeElement = iframe.firstChild;
          if (iframeElement && iframeElement.tagName === 'IFRAME') {
            iframeElement.style.cssText = `
              width: 100%;
              height: 100%;
              border: none;
            `;
            iframeWrapper.appendChild(iframeElement);
          } else {
            iframeWrapper.textContent = '嵌入代码格式错误';
            iframeWrapper.style.cssText = `
              width: 100%;
              height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgba(255,255,255,0.5);
            `;
          }
          embedContainer.appendChild(iframeWrapper);
          mediaWrapper.appendChild(embedContainer);
        }

        mediaContainer.appendChild(mediaWrapper);
      });

      leftPanel.appendChild(mediaContainer);
    } else if (culture.image && culture.image.trim() !== '') {
      // 兼容性：如果只有旧的 image 字段
      var infoImage = document.createElement("img");
      infoImage.src = culture.image;
      infoImage.style.cssText = `
        max-width: 100%;
        max-height: 350px;
        object-fit: contain;
        border-radius: 8px;
        cursor: pointer;
      `;
      infoImage.onclick = function () {
        showImageModal(culture.image);
      };
      leftPanel.appendChild(infoImage);
    } else {
      // 如果没有媒体，显示提示
      var noMedia = document.createElement("div");
      noMedia.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
      `;
      noMedia.textContent = "暂无媒体资源";
      leftPanel.appendChild(noMedia);
    }

    // 添加描述到右侧面板
    var infoDescription = document.createElement("div");
    infoDescription.innerHTML = `
      <strong style="color: #f6bb42;">文化简介：</strong>
      <span style="display: block; margin-top: 8px;">${culture.description}</span>
    `;
    rightPanel.appendChild(infoDescription);

    // 添加详细介绍到右侧面板
    var infoDetails = document.createElement("div");
    infoDetails.innerHTML = `
      <strong style="color: #f6bb42;">详细介绍：</strong>
      <div style="margin-top: 10px; line-height: 1.8; text-align: justify;">${culture.details}</div>
    `;
    rightPanel.appendChild(infoDetails);

    // 添加基本信息到右侧面板
    var infoBasic = document.createElement("div");
    infoBasic.innerHTML = `
      <strong style="color: #f6bb42;">基本信息：</strong>
      <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.8;">
        <li>地区：${culture.region}</li>
        <li>类型：${culture.type}</li>
        <li>热度：${culture.heat}</li>
      </ul>
    `;
    rightPanel.appendChild(infoBasic);

    // 将左右面板添加到主容器
    infoBody.appendChild(leftPanel);
    infoBody.appendChild(rightPanel);

    infoContent.appendChild(infoBody);

    // 创建关闭按钮
    var closeInfoBtn = document.createElement("button");
    closeInfoBtn.innerText = "关闭";
    closeInfoBtn.style.cssText = `
      margin-top: 20px;
      padding: 10px 20px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      margin-left: auto;
      margin-right: auto;
    `;
    closeInfoBtn.onclick = function () {
      document.body.removeChild(cultureInfoModal);
    };
    infoContent.appendChild(closeInfoBtn);

    // 点击背景关闭
    cultureInfoModal.onclick = function (e) {
      if (e.target === cultureInfoModal) {
        document.body.removeChild(cultureInfoModal);
      }
    };
  }

  // 页面加载时获取数据
  fetchCultureCountData();
})();

// 文化搜索功能模块
(function () {
  // 获取DOM元素
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const doSearchBtn = document.getElementById('doSearchBtn');
  const cultureList = document.getElementById('cultureList');
  const cultureDetailModal = document.getElementById('cultureDetailModal');
  const closeCultureDetailBtn = document.getElementById('closeCultureDetailBtn');

  // 文化数据，将从JSON文件加载
  let cultureData = [];

  // 从JSON文件加载文化数据
  function loadCultureData() {
    return axios.get('/mz_screen/data/culturedata.json')
      .then(function (response) {
        const data = response.data;
        if (data.cultures) {
          cultureData = data.cultures;
        }
      })
      .catch(function (error) {
        console.error('加载文化数据失败:', error);
      });
  }

  // 显示搜索弹出框
  function showSearchModal() {
    searchModal.style.display = 'block';
    // 显示按热度排序的文化列表
    displayCultureList(cultureData);
  }

  // 隐藏搜索弹出框
  function hideSearchModal() {
    searchModal.style.display = 'none';
    // 清空搜索输入
    searchInput.value = '';
  }

  // 显示文化列表
  function displayCultureList(cultures) {
    cultureList.innerHTML = '';

    if (cultures.length === 0) {
      cultureList.innerHTML = `
        <li style="padding: 15px; margin-bottom: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px;">
          <div style="text-align: center; color: rgba(255, 255, 255, 0.7);">未找到相关文化</div>
        </li>
      `;
      return;
    }

    cultures.forEach(culture => {
      const li = document.createElement('li');
      li.style.cssText = `padding: 15px; margin-bottom: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; cursor: pointer; transition: all 0.3s ease;`;
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: bold; color: #f6bb42;">${culture.name}</div>
          <div style="font-size: 12px; color: rgba(255, 255, 255, 0.5);">热度: ${culture.heat}</div>
        </div>
        <div style="margin-top: 5px; font-size: 14px; color: rgba(255, 255, 255, 0.8);">${culture.description}</div>
        <div style="margin-top: 5px; font-size: 12px; color: rgba(255, 255, 255, 0.5);">
          地区: ${culture.region} | 类型: ${culture.type}
        </div>
      `;

      // 添加点击事件，显示详细信息
      li.addEventListener('click', () => {
        showCultureDetail(culture);
      });

      // 添加鼠标悬停效果
      li.addEventListener('mouseenter', () => {
        li.style.background = 'rgba(74, 137, 220, 0.1)';
        li.style.borderColor = '#f6bb42';
      });

      li.addEventListener('mouseleave', () => {
        li.style.background = 'rgba(255, 255, 255, 0.05)';
        li.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });

      cultureList.appendChild(li);
    });
  }

  // 搜索文化
  function searchCulture(keyword) {
    if (!keyword || keyword.trim() === '') {
      // 没有搜索内容，按热度显示所有文化
      displayCultureList(cultureData);
      return;
    }

    // 按关键词搜索
    const filteredCultures = cultureData.filter(culture => {
      return culture.name.includes(keyword) ||
        culture.description.includes(keyword) ||
        culture.region.includes(keyword) ||
        culture.type.includes(keyword);
    });

    displayCultureList(filteredCultures);
  }

  // 显示文化详细信息
  function showCultureDetail(culture) {
    // 更新详细信息内容
    document.getElementById('cultureDetailTitle').textContent = culture.name;

    // 处理图片显示
    const cultureImage = document.getElementById('cultureImage');
    const imageContainer = cultureImage.parentElement;

    if (culture.image && culture.image.trim() !== '') {
      cultureImage.src = culture.image;
      imageContainer.style.display = 'block';
    } else {
      imageContainer.style.display = 'none';
    }

    document.getElementById('cultureDescription').innerHTML = `
      <strong style="color: #f6bb42;">文化简介：</strong>
      <span>${culture.description}</span>
    `;
    document.getElementById('cultureDetails').innerHTML = `
      <div style="margin-bottom: 15px;">
        <strong style="color: #f6bb42;">详细介绍：</strong>
        <div style="margin-top: 5px; line-height: 1.6;">${culture.details}</div>
      </div>
      <div style="margin-bottom: 15px;">
        <strong style="color: #f6bb42;">基本信息：</strong>
        <ul style="margin-top: 5px; padding-left: 20px;">
          <li style="margin-bottom: 5px;">地区：${culture.region}</li>
          <li style="margin-bottom: 5px;">类型：${culture.type}</li>
          <li style="margin-bottom: 5px;">热度：${culture.heat}</li>
        </ul>
      </div>
    `;

    // 显示详细信息弹出框
    cultureDetailModal.style.display = 'block';
  }

  // 隐藏文化详细信息
  function hideCultureDetail() {
    cultureDetailModal.style.display = 'none';
  }

  // 事件监听
  searchBtn.addEventListener('click', showSearchModal);
  closeSearchBtn.addEventListener('click', hideSearchModal);
  doSearchBtn.addEventListener('click', () => {
    searchCulture(searchInput.value);
  });
  closeCultureDetailBtn.addEventListener('click', hideCultureDetail);

  // 点击模态框外部关闭
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      hideSearchModal();
    }
  });

  cultureDetailModal.addEventListener('click', (e) => {
    if (e.target === cultureDetailModal) {
      hideCultureDetail();
    }
  });

  // 按Enter键搜索
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchCulture(searchInput.value);
    }
  });

  // 页面加载时加载文化数据
  window.addEventListener('DOMContentLoaded', loadCultureData);
})();
