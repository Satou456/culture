(function() {
  // 地区名称到文件名的映射
  var regionImageMap = {
    "北京": "bj_gg.jpg",
    "天津": "tj_jmgl.jpg",
    "上海": "sh_wt.jpg",
    "重庆": "cq_gyd.jpg",
    "河北": "hb_hhl.jpg",
    "山西": "shan3_xi_bmy.jpg",
    "辽宁": "ln_sygg.jpg",
    "吉林": "jl_cbs.jpg",
    "黑龙江": "hlj_bxdsj.jpg",
    "江苏": "js_szyl.jpg",
    "浙江": "hz_hzxh.jpg",
    "安徽": "ah_hs.jpg",
    "福建": "fj_wys.jpg",
    "江西": "jx_ls.jpg",
    "山东": "sd_ts.jpg",
    "河南": "hn_hssls.jpg",
    "湖北": "hb_hhl.jpg",
    "湖南": "hn_zjj.jpg",
    "广东": "gd_bys.jpg",
    "广西": "gx_gl.jpg",
    "海南": "hainan.jpg",
    "四川": "sc_jzg.jpg",
    "贵州": "gz_hgspb.jpg",
    "云南": "yn_dl.jpg",
    "陕西": "sx1_wts.jpg",
    "甘肃": "gs_mgy.jpg",
    "青海": "qh_qhh.jpg",
    "内蒙古": "nmg_hlbe.jpg",
    "新疆": "xj_ts.jpg",
    "西藏": "xz_bdlg.jpg",
    "宁夏": "nx_spt.jpg",
    "台湾": "tw_jsj.jpg",
    "香港": "tw_ryt.jpg",
    "澳门": "aomen.jpg",
    "北京市": "bj_gg.jpg",
    "天津市": "tj_jmgl.jpg",
    "上海市": "sh_wt.jpg",
    "重庆市": "cq_gyd.jpg",
    "河北省": "hb_hhl.jpg",
    "山西省": "shan3_xi_bmy.jpg",
    "辽宁省": "ln_sygg.jpg",
    "吉林省": "jl_cbs.jpg",
    "黑龙江省": "hlj_bxdsj.jpg",
    "江苏省": "js_szyl.jpg",
    "浙江省": "hz_hzxh.jpg",
    "安徽省": "ah_hs.jpg",
    "福建省": "fj_wys.jpg",
    "江西省": "jx_ls.jpg",
    "山东省": "sd_ts.jpg",
    "河南省": "hn_hssls.jpg",
    "湖北省": "hb_hhl.jpg",
    "湖南省": "hn_zjj.jpg",
    "广东省": "gd_bys.jpg",
    "广西壮族自治区": "gx_gl.jpg",
    "海南省": "hainan.jpg",
    "四川省": "sc_jzg.jpg",
    "贵州省": "gz_hgspb.jpg",
    "云南省": "yn_dl.jpg",
    "陕西省": "sx1_wts.jpg",
    "甘肃省": "gs_mgy.jpg",
    "青海省": "qh_qhh.jpg",
    "内蒙古自治区": "nmg_hlbe.jpg",
    "新疆维吾尔自治区": "xj_ts.jpg",
    "西藏自治区": "xz_bdlg.jpg",
    "宁夏回族自治区": "nx_spt.jpg",
    "台湾省": "tw_jsj.jpg",
    "香港特别行政区": "tw_ryt.jpg",
    "澳门特别行政区": "aomen.jpg"
  };

  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".map .chart"));

  // 2. 原有配置和数据
  var geoCoordMap = { /* ... 你的城市坐标数据保持不变 ... */ };

  var XAData = [];
  var XNData = [];
  var YCData = [];

  var planePath =
    "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value
        });
      }
    }
    return res;
  };

  var color = ["#fff", "#fff", "#fff"];
  var series = [];
  [["西安", XAData], ["西宁", XNData], ["银川", YCData]].forEach(function(item, i) {
    series.push(
      {
        name: item[0] + " Top3",
        type: "lines",
        zlevel: 1,
        effect: { show: true, period: 6, trailLength: 0.7, color: "red", symbolSize: 3 },
        lineStyle: { normal: { color: color[i], width: 0, curveness: 0.2 } },
        data: convertData(item[1])
      },
      {
        name: item[0] + " Top3",
        type: "lines",
        zlevel: 2,
        symbol: ["none", "arrow"],
        symbolSize: 10,
        effect: { show: true, period: 6, trailLength: 0, symbol: planePath, symbolSize: 15 },
        lineStyle: { normal: { color: color[i], width: 1, opacity: 0.6, curveness: 0.2 } },
        data: convertData(item[1])
      },
      {
        name: item[0] + " Top3",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: { brushType: "stroke" },
        label: { normal: { show: true, position: "right", formatter: "{b}" } },
        symbolSize: function(val) { return val[2] / 8; },
        itemStyle: { normal: { color: color[i] }, emphasis: { areaColor: "#2B91B7" } },
        data: item[1].map(function(dataItem) {
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
          };
        })
      }
    );
  });

  var option = {
    tooltip: { show: false }, // 禁用默认 tooltip
    geo: {
      map: "china",
      label: { emphasis: { show: true, color: "#fff" } },
      roam: true,
      zoom: 1.2,
      itemStyle: {
        normal: { areaColor: "rgba(219, 46, 16, 0.8)", borderColor: "rgb(0,0,0)", borderWidth: 1 },
        emphasis: { areaColor: "#8f0303b1" }
      }
    },
    series: series
  };
  myChart.setOption(option);

  // ========== 新增：数据存储和信息框 ==========  
  // 数据存储变量，用于临时保存从服务器获取的数据
  var regionDataCache = {};
  var cultureDataCache = null; // 缓存文化数据，避免每次都重新请求
  
  // 用于存储当前锁定的地区
  var lockedRegion = null;

  // 信息框
  var infoBox = document.createElement("div");
  infoBox.style.cssText = `
    position:absolute;pointer-events:none;
    background:rgba(30,30,30,0.4);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    color:#fff;padding:10px 15px;border-radius:8px;
    font-size:14px;display:none;z-index:1000;
  `;
  document.body.appendChild(infoBox);

  // 信息框内容容器
  var infoContent = document.createElement("div");
  infoBox.appendChild(infoContent);

  // 浮层
  var overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.4);
    backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    display:none;justify-content:center;align-items:center;z-index:2000;
  `;
  var overlayContent = document.createElement("div");
  overlayContent.style.cssText = `
    background:rgba(25,35,65,0.95);
    backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);
    padding:30px;border-radius:12px;color:#fff;width:1200px;max-width:90vw;
    border:1px solid rgba(80,120,200,0.3);
    box-shadow:0 20px 60px rgba(0,0,0,0.5);
  `;
  overlay.appendChild(overlayContent);
  document.body.appendChild(overlay);

  // 浮层内容容器
  var overlayInner = document.createElement("div");
  overlayContent.appendChild(overlayInner);

  // 关闭按钮
  var closeBtn = document.createElement("button");
  closeBtn.innerText = "关闭";
  closeBtn.style.cssText = `
    position:absolute;top:20px;right:20px;padding:8px 16px;border:none;
    background:rgba(74,137,220,0.3);color:#f6bb42;
    border:1px solid #4a89dc;border-radius:6px;cursor:pointer;
    font-size:14px;transition:all 0.3s ease;
  `;
  closeBtn.onmouseover = function() {
    this.style.background = 'rgba(74,137,220,0.5)';
    this.style.boxShadow = '0 0 15px rgba(74,137,220,0.5)';
  };
  closeBtn.onmouseout = function() {
    this.style.background = 'rgba(74,137,220,0.3)';
    this.style.boxShadow = 'none';
  };
  closeBtn.onclick = function() { overlay.style.display = "none"; };
  overlayContent.appendChild(closeBtn);

  // 锁定地区的函数
  function lockRegion(regionName) {
    lockedRegion = regionName;
    
    // 更新地图样式，高亮锁定地区
    var option = myChart.getOption();
    option.geo.regions = [{
      name: regionName,
      label: { 
        show: true,  // 确保地区名称始终显示
        color: '#fff', // 文字颜色与背景形成对比
        emphasis: { 
          show: true, 
          color: '#fff' 
        }
      },
      itemStyle: {
        areaColor: '#FFFF00', // 黄色表示锁定状态
        borderColor: '#990000', // 更深的红色边框
        borderWidth: 3
      },
      emphasis: {
        itemStyle: {
          areaColor: '#FFFF00',
          borderColor: '#990000', // 更深的红色边框
          borderWidth: 3
        }
      }
    }];
    myChart.setOption(option);
  }

  // 解锁地区的函数
  function unlockRegion() {
    lockedRegion = null;
    
    // 移除地图上的锁定样式
    var option = myChart.getOption();
    option.geo.regions = [];
    myChart.setOption(option);
  }

  // 发送请求获取地区数据
  function fetchRegionData(regionName) {
    // 如果数据已经在缓存中，直接返回
    if (regionDataCache[regionName]) {
      return Promise.resolve(regionDataCache[regionName]);
    }

    // 返回一个新的Promise
    return new Promise(function(resolve, reject) {
      // 发送AJAX请求获取数据
      $.ajax({
        url: `data/culturedata.json`,
        type: "GET",
        dataType: "json"
      }).done(function(data) {
        // 获取指定地区的数据
        const regionData = data[regionName] || {
          name: regionName,
          "代表建筑数量": "未知",
          "民族服饰数量": "未知",
          "民族音乐数量": "未知",
          "传统工艺数量": "未知",
          "民族运动数量": "未知",
          "民族节日": [],
          "民族食品": [],
          "地区访问人数": [],
          "地区年龄占比": {},
          "民族种类占比": {},
          "民族代表文化": [],
          "地区主要信息": "暂无数据"
        };
        // 缓存数据
        regionDataCache[regionName] = regionData;
        resolve(regionData);
      }).fail(function(xhr, status, error) {
        console.error("获取地区数据失败:", error);
        // 返回模拟数据
        const mockData = {
          name: regionName,
          "代表建筑数量": "未知",
          "民族服饰数量": "未知",
          "民族音乐数量": "未知",
          "传统工艺数量": "未知",
          "民族运动数量": "未知",
          "民族节日": [],
          "民族食品": [],
          "地区访问人数": [],
          "地区年龄占比": {},
          "民族种类占比": {},
          "民族代表文化": [],
          "地区主要信息": "暂无数据"
        };
        regionDataCache[regionName] = mockData;
        resolve(mockData);
      });
    });
  }

  // 用于存储上一次处理的地区，避免频繁更新
  var lastProcessedRegion = null;
  // 用于存储数据加载的定时器
  var dataLoadTimer = null;
  
  // 用于存储当前正在加载数据的地区
  var loadingRegion = null;
  
  // 用于存储当前显示数据的地区
  var currentDisplayRegion = null;
  
  // 鼠标移动显示信息框
  myChart.on("mousemove", function(params) {
    if (params.componentType === "geo") {
      // 如果有锁定的地区，不显示悬浮窗
      if (!lockedRegion) {
        // 计算信息框位置，确保在屏幕范围内
        const pageX = params.event.event.pageX;
        const pageY = params.event.event.pageY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const infoBoxWidth = 250; // 估计信息框宽度
        const infoBoxHeight = 200; // 估计信息框高度
        
        // 调整信息框位置，避免超出屏幕
        let left = pageX + 15;
        let top = pageY + 15;
        
        if (left + infoBoxWidth > windowWidth) {
          left = pageX - infoBoxWidth - 15;
        }
        
        if (top + infoBoxHeight > windowHeight) {
          top = pageY - infoBoxHeight - 15;
        }
        
        // 确保位置不会小于0
        left = Math.max(left, 10);
        top = Math.max(top, 10);
        
        infoBox.style.left = left + "px";
        infoBox.style.top = top + "px";
        infoBox.style.display = "block";
      } else {
        // 锁定状态下隐藏悬浮窗
        infoBox.style.display = "none";
      }

      // 如果有锁定的地区，始终显示锁定地区的数据
      const targetRegion = lockedRegion || params.name;

      // 避免频繁更新，只有当地区变化时才更新数据
      if (lastProcessedRegion !== targetRegion) {
        lastProcessedRegion = targetRegion;
        loadingRegion = targetRegion;
        currentDisplayRegion = null; // 重置当前显示地区，准备更新
        
        // 只有在非锁定状态下才显示"加载中..."状态
        if (!lockedRegion) {
          // 显示加载中
          infoContent.innerHTML = `
            <strong>${params.name}</strong><br/>
            <em>加载中...</em>
          `;
        }
        
        // 清除之前的定时器
        if (dataLoadTimer) {
          clearTimeout(dataLoadTimer);
        }
        
        // 添加防抖，延迟加载数据，避免鼠标快速移动时频繁更新
        dataLoadTimer = setTimeout(function() {
          // 准备请求
          const regionRequest = fetchRegionData(targetRegion);
          const cultureRequest = cultureDataCache ? Promise.resolve(cultureDataCache) : $.ajax({ url: `data/culturedata.json`, type: "GET", dataType: "json" });
          
          // 获取地区数据和文化数据
          Promise.all([regionRequest, cultureRequest]).then(function(results) {
            // 检查当前是否仍然在加载同一个地区的数据
            if (loadingRegion !== targetRegion) {
              return; // 如果不是，则不更新悬浮窗
            }
            
            const data = results[0];
            const globalData = results[1];
            
            // 缓存文化数据
            if (!cultureDataCache) {
              cultureDataCache = globalData;
            }
            
            // 计算实际收录的文化数量
            let cultureCounts = {
              "代表建筑": 0,
              "民族服饰": 0,
              "民族音乐": 0,
              "传统工艺": 0,
              "民族运动": 0
            };
            
            // 如果有文化数据，统计各个文化类型的数量
            if (globalData && globalData.cultures) {
              globalData.cultures.forEach(culture => {
                // 根据地区筛选文化数据
                let isMatch = false;
                
                // 精确匹配
                if (culture.region === targetRegion) {
                  isMatch = true;
                }
                // 包含匹配（如"内蒙古"匹配"内蒙古自治区"）
                else if (culture.region.includes(targetRegion) || targetRegion.includes(culture.region)) {
                  isMatch = true;
                }
                // 特殊匹配
                else if (targetRegion === "云南" && culture.region === "云南省") {
                  isMatch = true;
                }
                else if (targetRegion === "内蒙古" && culture.region === "内蒙古自治区") {
                  isMatch = true;
                }
                
                // 如果匹配，统计数量
                if (isMatch && cultureCounts.hasOwnProperty(culture.type)) {
                  cultureCounts[culture.type]++;
                }
              });
            }
            
            // 标记当前显示的地区
            currentDisplayRegion = targetRegion;
            
            // 只有在非锁定状态下才更新悬浮窗内容
            if (!lockedRegion) {
              // 更新信息框内容，使用实际收录的文化数量
              infoContent.innerHTML = `
                <strong>${data.name}</strong><br/>
                代表建筑数量：${cultureCounts["代表建筑"]}<br/>
                民族服饰数量：${cultureCounts["民族服饰"]}<br/>
                民族音乐数量：${cultureCounts["民族音乐"]}<br/>
                传统工艺数量：${cultureCounts["传统工艺"]}<br/>
                民族运动数量：${cultureCounts["民族运动"]}<br/>
                民族代表文化：${data.民族代表文化.join('、')}<br/>
                地区主要信息：${data.地区主要信息}
              `;
            }
            
            // 更新文化种类柱状图
            if (window.updateCultureChart) {
              window.updateCultureChart(data);
            }
            
            // 更新地区文化访问人数折线图
            if (window.updateVisitChart) {
              window.updateVisitChart(data);
            }
            
            // 更新地区年龄占比饼图
            if (window.updateAgeChart) {
              window.updateAgeChart(data);
            }
            
            // 更新地区民族占比表格
            if (window.updateEthnicTable) {
              window.updateEthnicTable(data);
            }
            
            // 更新地区民族文化列表
            if (window.updateCultureList) {
              window.updateCultureList(data);
            }
            
            // 更新地区主要信息
            if (window.updateRegionInfo) {
              window.updateRegionInfo(data);
            }
          });
        }, 80); // 减少延迟时间，加快响应速度
      } else {
        // 不改变地区时，保持悬浮窗内容不变，只更新位置
        if (!lockedRegion && currentDisplayRegion === targetRegion) {
          // 计算信息框位置，确保在屏幕范围内
          const pageX = params.event.event.pageX;
          const pageY = params.event.event.pageY;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const infoBoxWidth = 250; // 估计信息框宽度
          const infoBoxHeight = 200; // 估计信息框高度
          
          // 调整信息框位置，避免超出屏幕
          let left = pageX + 15;
          let top = pageY + 15;
          
          if (left + infoBoxWidth > windowWidth) {
            left = pageX - infoBoxWidth - 15;
          }
          
          if (top + infoBoxHeight > windowHeight) {
            top = pageY - infoBoxHeight - 15;
          }
          
          // 确保位置不会小于0
          left = Math.max(left, 10);
          top = Math.max(top, 10);
          
          infoBox.style.left = left + "px";
          infoBox.style.top = top + "px";
          infoBox.style.display = "block";
        }
      }
    }
  });
  
  // 鼠标移出时隐藏信息框
  myChart.on("mouseout", function() {
    infoBox.style.display = "none";
  });

  // 单击事件：锁定/解锁地区
  myChart.on("click", function(params) {
    if (params.componentType === "geo") {
      // 清除之前的数据加载定时器
      if (dataLoadTimer) {
        clearTimeout(dataLoadTimer);
      }
      
      // 如果点击的是当前锁定的地区，则解锁
      if (lockedRegion === params.name) {
        unlockRegion();
        infoBox.style.display = "none"; // 解锁后隐藏信息框
        
        // 解锁后更新为全国数据
        const nationalData = {
          name: "全国",
          "代表建筑数量": "未知",
          "民族服饰数量": "未知",
          "民族音乐数量": "未知",
          "传统工艺数量": "未知",
          "民族运动数量": "未知",
          "民族节日": [],
          "民族食品": [],
          "地区访问人数": [],
          "地区年龄占比": {},
          "民族种类占比": {},
          "民族代表文化": [],
          "地区主要信息": "全国文化数据"
        };
        
        // 更新所有图表和表格为全国数据
        if (window.updateCultureChart) window.updateCultureChart(null);
        if (window.updateVisitChart) window.updateVisitChart(nationalData);
        if (window.updateAgeChart) window.updateAgeChart(nationalData);
        if (window.updateEthnicTable) window.updateEthnicTable(nationalData);
        if (window.updateCultureList) window.updateCultureList(null);
        if (window.updateRegionInfo) window.updateRegionInfo(null);
      } else {
        // 否则锁定新的地区
        lockRegion(params.name);
        
        // 锁定后重新获取并显示该地区数据
        fetchRegionData(params.name).then(function(data) {
          // 更新所有图表和表格
          if (window.updateCultureChart) window.updateCultureChart(data);
          if (window.updateVisitChart) window.updateVisitChart(data);
          if (window.updateAgeChart) window.updateAgeChart(data);
          if (window.updateEthnicTable) window.updateEthnicTable(data);
          if (window.updateCultureList) window.updateCultureList(data);
          if (window.updateRegionInfo) window.updateRegionInfo(data);
          
          // 锁定状态下隐藏悬浮窗
          infoBox.style.display = "none";
        });
      }
    }
  });
  
  // 双击事件：显示详细信息浮层
  myChart.on("dblclick", function(params) {
    if (params.componentType === "geo") {
      // 显示加载状态
      overlayInner.innerHTML = `
        <h2 style="text-align:center;color:#f6bb42;margin-bottom:30px;">${params.name}</h2>
        <div style="text-align: center; padding: 20px;">
          <em style="color:#f8f0e3;">加载中...</em>
        </div>
      `;
      overlay.style.display = "flex";
      
      // 获取地区数据和文化数据
      const regionRequest = fetchRegionData(params.name);
      const cultureRequest = cultureDataCache ? Promise.resolve(cultureDataCache) : $.ajax({ url: `data/culturedata.json`, type: "GET", dataType: "json" });
      
      Promise.all([regionRequest, cultureRequest]).then(function(results) {
        const data = results[0];
        const globalData = results[1];
        
        // 缓存文化数据
        if (!cultureDataCache) {
          cultureDataCache = globalData;
        }
        
        // 计算实际收录的文化数量
        let cultureCounts = {
          "代表建筑": 0,
          "民族服饰": 0,
          "民族音乐": 0,
          "传统工艺": 0,
          "民族运动": 0
        };
        
        // 如果有文化数据，统计各个文化类型的数量
        if (globalData && globalData.cultures) {
          globalData.cultures.forEach(culture => {
            // 根据地区筛选文化数据
            let isMatch = false;
            
            // 精确匹配
            if (culture.region === params.name) {
              isMatch = true;
            }
            // 包含匹配（如"内蒙古"匹配"内蒙古自治区"）
            else if (culture.region.includes(params.name) || params.name.includes(culture.region)) {
              isMatch = true;
            }
            // 特殊匹配
            else if (params.name === "云南" && culture.region === "云南省") {
              isMatch = true;
            }
            else if (params.name === "内蒙古" && culture.region === "内蒙古自治区") {
              isMatch = true;
            }
            
            // 如果匹配，统计数量
            if (isMatch && cultureCounts.hasOwnProperty(culture.type)) {
              cultureCounts[culture.type]++;
            }
          });
        }
        
        // 获取地区图片
        const regionImage = regionImageMap[params.name] || '';
        const imagePath = regionImage ? `region/${regionImage}` : '';
        
        // 动态生成详细信息 - 左右布局
        overlayInner.innerHTML = `
          <div style="position:relative;">
            <h2 style="text-align:center;color:#f6bb42;margin-bottom:30px;font-size:28px;text-shadow:0 2px 10px rgba(246,187,66,0.3);">${data.name}</h2>
          </div>
          <div style="display:flex;gap:30px;">
            <!-- 左侧：媒体预览区域 -->
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:15px;">
              <h3 style="color:#f6bb42;margin:0;font-size:18px;">地区图片</h3>
              <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(80,120,200,0.2);border-radius:8px;overflow:hidden;">
                ${imagePath ? `<img src="${imagePath}" alt="${data.name}" style="width:100%;height:auto;max-height:400px;object-fit:cover;display:block;">` : `<div style="padding:60px;text-align:center;color:rgba(255,255,255,0.5);">暂无图片</div>`}
              </div>
            </div>
            
            <!-- 右侧：信息区域 -->
            <div style="flex:1.5;min-width:0;display:flex;flex-direction:column;gap:20px;overflow-y:auto;max-height:500px;padding-right:10px;">
              <div>
                <h3 style="color:#f6bb42;margin:0 0 15px 0;font-size:18px;border-bottom:1px solid rgba(80,120,200,0.2);padding-bottom:8px;">文化资源统计</h3>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                  <div style="background:rgba(74,137,220,0.1);padding:10px;border-radius:6px;border:1px solid rgba(74,137,220,0.2);">
                    <div style="color:#4a89dc;font-size:14px;">代表建筑</div>
                    <div style="color:#f8f0e3;font-size:20px;font-weight:bold;">${cultureCounts["代表建筑"]}</div>
                  </div>
                  <div style="background:rgba(74,137,220,0.1);padding:10px;border-radius:6px;border:1px solid rgba(74,137,220,0.2);">
                    <div style="color:#4a89dc;font-size:14px;">民族服饰</div>
                    <div style="color:#f8f0e3;font-size:20px;font-weight:bold;">${cultureCounts["民族服饰"]}</div>
                  </div>
                  <div style="background:rgba(74,137,220,0.1);padding:10px;border-radius:6px;border:1px solid rgba(74,137,220,0.2);">
                    <div style="color:#4a89dc;font-size:14px;">民族音乐</div>
                    <div style="color:#f8f0e3;font-size:20px;font-weight:bold;">${cultureCounts["民族音乐"]}</div>
                  </div>
                  <div style="background:rgba(74,137,220,0.1);padding:10px;border-radius:6px;border:1px solid rgba(74,137,220,0.2);">
                    <div style="color:#4a89dc;font-size:14px;">传统工艺</div>
                    <div style="color:#f8f0e3;font-size:20px;font-weight:bold;">${cultureCounts["传统工艺"]}</div>
                  </div>
                  <div style="background:rgba(74,137,220,0.1);padding:10px;border-radius:6px;border:1px solid rgba(74,137,220,0.2);grid-column:span 2;">
                    <div style="color:#4a89dc;font-size:14px;">民族运动</div>
                    <div style="color:#f8f0e3;font-size:20px;font-weight:bold;">${cultureCounts["民族运动"]}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style="color:#f6bb42;margin:0 0 15px 0;font-size:18px;border-bottom:1px solid rgba(80,120,200,0.2);padding-bottom:8px;">特色文化</h3>
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div>
                    <div style="color:#4a89dc;font-weight:bold;margin-bottom:5px;">民族节日</div>
                    <div style="color:#f8f0e3;line-height:1.6;">${data.民族节日.length > 0 ? data.民族节日.join('、') : '暂无数据'}</div>
                  </div>
                  <div>
                    <div style="color:#4a89dc;font-weight:bold;margin-bottom:5px;">民族食品</div>
                    <div style="color:#f8f0e3;line-height:1.6;">${data.民族食品.length > 0 ? data.民族食品.join('、') : '暂无数据'}</div>
                  </div>
                  <div>
                    <div style="color:#4a89dc;font-weight:bold;margin-bottom:5px;">民族代表文化</div>
                    <div style="color:#f8f0e3;line-height:1.6;">${data.民族代表文化.length > 0 ? data.民族代表文化.join('、') : '暂无数据'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style="color:#f6bb42;margin:0 0 15px 0;font-size:18px;border-bottom:1px solid rgba(80,120,200,0.2);padding-bottom:8px;">人口结构</h3>
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div>
                    <div style="color:#4a89dc;font-weight:bold;margin-bottom:5px;">地区年龄占比</div>
                    <div style="color:#f8f0e3;line-height:1.6;">${Object.entries(data.地区年龄占比).length > 0 ? Object.entries(data.地区年龄占比).map(([age, ratio]) => `${age}: ${ratio}%`).join('、') : '暂无数据'}</div>
                  </div>
                  <div>
                    <div style="color:#4a89dc;font-weight:bold;margin-bottom:5px;">民族种类占比</div>
                    <div style="color:#f8f0e3;line-height:1.6;">${Object.entries(data.民族种类占比).length > 0 ? Object.entries(data.民族种类占比).filter(([ethnic]) => ethnic !== "其他").map(([ethnic, ratio]) => `${ethnic}: ${ratio}%`).join('、') : '暂无数据'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style="color:#f6bb42;margin:0 0 15px 0;font-size:18px;border-bottom:1px solid rgba(80,120,200,0.2);padding-bottom:8px;">地区概况</h3>
                <div style="color:#f8f0e3;line-height:1.8;">${data.地区主要信息}</div>
              </div>
            </div>
          </div>
        `;
      }).fail(function() {
        // 加载失败时显示错误信息
        overlayInner.innerHTML = `
          <h2 style="text-align:center;color:#f6bb42;margin-bottom:30px;">${params.name}</h2>
          <div style="text-align: center; padding: 20px;">
            <em style="color:#f8f0e3;">加载数据失败，请稍后重试</em>
          </div>
        `;
      });
    }
  });

  window.addEventListener("resize", function() { myChart.resize(); });

  // 页面加载完成后，初始化地图数据
  window.addEventListener('DOMContentLoaded', function() {
    // 预加载文化数据，避免后续请求延迟
    $.ajax({ url: `data/culturedata.json`, type: "GET", dataType: "json" })
      .done(function(data) {
        cultureDataCache = data;
        console.log('文化数据预加载完成');
      })
      .fail(function(xhr, status, error) {
        console.error('预加载文化数据失败:', error);
      });
    
    // 延迟执行，确保地图已经完全渲染
    setTimeout(function() {
      // 初始化时显示全国数据
      if (window.updateCultureChart) {
        window.updateCultureChart(null);
      }
      
      // 初始化其他图表为默认状态
      const defaultData = {
        name: "全国",
        "代表建筑数量": "未知",
        "民族服饰数量": "未知",
        "民族音乐数量": "未知",
        "传统工艺数量": "未知",
        "民族运动数量": "未知",
        "民族节日": [],
        "民族食品": [],
        "地区访问人数": [],
        "地区年龄占比": {},
        "民族种类占比": {},
        "民族代表文化": [],
        "地区主要信息": "全国文化数据"
      };
      
      if (window.updateVisitChart) {
        window.updateVisitChart(defaultData);
      }
      if (window.updateAgeChart) {
        window.updateAgeChart(defaultData);
      }
      if (window.updateEthnicTable) {
        window.updateEthnicTable(defaultData);
      }
      if (window.updateCultureList) {
        window.updateCultureList(null);
      }
      if (window.updateRegionInfo) {
        window.updateRegionInfo(null);
      }
      
      // 初始化完成后，保持全国数据显示，不默认加载任何地区的数据
    }, 500); // 减少延迟时间，确保地图已经完全渲染
  });
})();
