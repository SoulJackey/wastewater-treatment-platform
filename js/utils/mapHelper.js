/**
 * 地图交互工具
 * 提供地图动态标记、详情面板等功能
 */
(function(app) {
    'use strict';

    const MapHelper = {
        // 当前打开的详情面板
        currentPanel: null,

        // 地图实例
        map: null,

        // 标记点集合
        markers: [],

        /**
         * 创建动态标记
         * @param {Object} project - 项目数据
         * @param {Object} map - Leaflet地图实例
         * @returns {Object} Leaflet标记实例
         */
        createDynamicMarker(project, map) {
            const typeConfig = getWastewaterTypeConfig(project.type);

            // 创建自定义图标
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div class="marker-container ${project.status}">
                        <div class="marker-pulse" style="background: ${typeConfig.color}"></div>
                        <div class="marker-icon" style="background: ${typeConfig.color}">
                            <i class="fas ${typeConfig.icon}"></i>
                        </div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            // 创建标记
            const marker = L.marker([project.location.lat, project.location.lng], { icon });

            // 添加弹窗
            const popupContent = this.createPopupContent(project);
            marker.bindPopup(popupContent);

            // 绑定点击事件
            marker.on('click', () => {
                this.openDetailPanel(project);
            });

            return marker;
        },

        /**
         * 创建弹窗内容
         */
        createPopupContent(project) {
            const typeConfig = getWastewaterTypeConfig(project.type);

            return `
                <div class="project-popup">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        ${app.getTypeIcon(project.type, 24)}
                        <h4 style="margin: 0;">${project.name}</h4>
                    </div>
                    <p><strong>类型:</strong> ${project.type}</p>
                    <p><strong>地址:</strong> ${project.address}</p>
                    <p><strong>状态:</strong> ${this.getStatusBadge(project.status)}</p>
                    <p><strong>设备数:</strong> ${project.deviceCount}台</p>
                    <p><strong>运行中:</strong> <span class="text-success">${project.runningDevices}</span>台</p>
                    ${project.alarmCount > 0 ? `
                        <p class="text-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>${project.alarmCount}</strong>个报警
                        </p>
                    ` : `
                        <p class="text-success"><i class="fas fa-check-circle"></i> 无报警</p>
                    `}
                    <div style="margin-top: 12px;">
                        <button class="btn btn-primary btn-sm" onclick="app.utils.mapHelper.viewProjectDetail(${project.id})">
                            查看详情
                        </button>
                    </div>
                </div>
            `;
        },

        /**
         * 获取状态徽章
         */
        getStatusBadge(status) {
            const statusMap = {
                'normal': '<span class="tag tag-success">正常</span>',
                'warning': '<span class="tag tag-warning">警告</span>',
                'danger': '<span class="tag tag-danger">故障</span>'
            };
            return statusMap[status] || status;
        },

        /**
         * 打开详情面板
         * @param {Object} project - 项目数据
         */
        openDetailPanel(project) {
            // 创建面板(如果不存在)
            let panel = document.getElementById('mapDetailPanel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'mapDetailPanel';
                panel.className = 'map-detail-panel';
                document.body.appendChild(panel);
            }

            // 更新面板内容
            const typeConfig = getWastewaterTypeConfig(project.type);

            panel.innerHTML = `
                <div class="panel-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${app.getTypeIcon(project.type, 32)}
                        <h3>${project.name}</h3>
                    </div>
                    <button class="close-btn" onclick="app.utils.mapHelper.closeDetailPanel()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="panel-content">
                    <!-- 项目基本信息 -->
                    <div class="card" style="margin-bottom: 16px;">
                        <div class="card-body" style="padding: 16px;">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                <div>
                                    <span class="data-label">类型</span>
                                    <span class="data-value" style="font-size: 16px;">${project.type}</span>
                                </div>
                                <div>
                                    <span class="data-label">状态</span>
                                    <div>${this.getStatusBadge(project.status)}</div>
                                </div>
                                <div>
                                    <span class="data-label">设备总数</span>
                                    <span class="data-value" style="font-size: 16px;">${project.deviceCount}</span>
                                </div>
                                <div>
                                    <span class="data-label">运行中</span>
                                    <span class="data-value text-success" style="font-size: 16px;">${project.runningDevices}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 迷你图表 -->
                    <div>
                        <div class="mini-chart-title">PH值趋势(近1小时)</div>
                        <div class="mini-chart" id="phMiniChart"></div>
                    </div>

                    <div>
                        <div class="mini-chart-title">流量趋势(近1小时)</div>
                        <div class="mini-chart" id="flowMiniChart"></div>
                    </div>

                    <!-- 实时数据 -->
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">PH值</span>
                            <span class="data-value" id="phValue">--</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">流量</span>
                            <span class="data-value" id="flowValue">--</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">浊度</span>
                            <span class="data-value" id="turbidityValue">--</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">温度</span>
                            <span class="data-value" id="tempValue">--</span>
                        </div>
                    </div>

                    <!-- 报警信息 -->
                    ${project.alarmCount > 0 ? `
                        <div class="card" style="border-left: 4px solid var(--danger-color);">
                            <div class="card-body" style="padding: 16px;">
                                <h4 style="font-size: 14px; margin-bottom: 8px;">
                                    <i class="fas fa-exclamation-triangle text-danger"></i>
                                    当前报警
                                </h4>
                                <div style="font-size: 13px; color: var(--text-secondary);">
                                    共有 <strong>${project.alarmCount}</strong> 个未处理报警
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- 操作按钮 -->
                    <div style="display: flex; gap: 12px; margin-top: 16px;">
                        <button class="btn btn-primary" onclick="app.utils.mapHelper.viewProjectDetail(${project.id})">
                            <i class="fas fa-chart-line"></i> 查看详情
                        </button>
                        <button class="btn btn-default" onclick="app.utils.mapHelper.closeDetailPanel()">
                            关闭
                        </button>
                    </div>
                </div>
            `;

            // 显示面板
            setTimeout(() => {
                panel.classList.add('open');
            }, 10);

            // 渲染迷你图表
            this.renderMiniCharts(project);

            // 更新实时数据
            this.updateRealtimeData(project);

            // 保存当前面板
            this.currentPanel = panel;
        },

        /**
         * 关闭详情面板
         */
        closeDetailPanel() {
            const panel = document.getElementById('mapDetailPanel');
            if (panel) {
                panel.classList.remove('open');
            }
            this.currentPanel = null;
        },

        /**
         * 渲染迷你图表
         */
        renderMiniCharts(project) {
            // 生成模拟数据
            const phData = this.generateMockTrendData(7, 6.5, 8.5);
            const flowData = this.generateMockTrendData(7, 10, 20);

            // PH值图表
            const phChartElement = document.getElementById('phMiniChart');
            if (phChartElement) {
                app.utils.chart.createSparkline('phMiniChart', phData, {
                    color: '#1890ff',
                    showArea: true
                });
            }

            // 流量图表
            const flowChartElement = document.getElementById('flowMiniChart');
            if (flowChartElement) {
                app.utils.chart.createSparkline('flowMiniChart', flowData, {
                    color: '#52c41a',
                    showArea: true
                });
            }
        },

        /**
         * 生成模拟趋势数据
         */
        generateMockTrendData(count, min, max) {
            const data = [];
            let value = (min + max) / 2;

            for (let i = 0; i < count; i++) {
                value += (Math.random() - 0.5) * (max - min) * 0.2;
                value = Math.max(min, Math.min(max, value));
                data.push(parseFloat(value.toFixed(1)));
            }

            return data;
        },

        /**
         * 更新实时数据
         */
        updateRealtimeData(project) {
            // 生成模拟数据
            const ph = (6.5 + Math.random() * 2).toFixed(1);
            const flow = (10 + Math.random() * 10).toFixed(1);
            const turbidity = (5 + Math.random() * 15).toFixed(1);
            const temp = (15 + Math.random() * 10).toFixed(1);

            // 更新DOM
            setTimeout(() => {
                const phElement = document.getElementById('phValue');
                const flowElement = document.getElementById('flowValue');
                const turbidityElement = document.getElementById('turbidityValue');
                const tempElement = document.getElementById('tempValue');

                if (phElement) {
                    phElement.textContent = ph;
                    // 应用颜色
                    phElement.style.color = ph < 7 ? '#52c41a' : ph > 8.5 ? '#f5222d' : '#1890ff';
                }

                if (flowElement) flowElement.textContent = flow;
                if (turbidityElement) turbidityElement.textContent = turbidity;
                if (tempElement) tempElement.textContent = temp;
            }, 300);
        },

        /**
         * 查看项目详情
         */
        viewProjectDetail(projectId) {
            const project = mockData.projects.find(p => p.id === projectId);
            if (project) {
                // 关闭详情面板
                this.closeDetailPanel();

                // 跳转到项目级看板
                window.location.href = `dashboard-project.html?id=${projectId}`;
            }
        },

        /**
         * 批量添加标记到地图
         * @param {Array} projects - 项目数组
         * @param {Object} map - Leaflet地图实例
         */
        addMarkers(projects, map) {
            this.map = map;
            this.markers = [];

            projects.forEach(project => {
                const marker = this.createDynamicMarker(project, map);
                marker.addTo(map);
                this.markers.push(marker);
            });
        },

        /**
         * 清除所有标记
         */
        clearMarkers() {
            this.markers.forEach(marker => {
                this.map.removeLayer(marker);
            });
            this.markers = [];
        },

        /**
         * 缩放到标记
         */
        fitMarkers() {
            if (this.markers.length === 0) return;

            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
        },

        /**
         * 按状态筛选标记
         * @param {string} status - 状态('normal', 'warning', 'danger', 'all')
         */
        filterMarkersByStatus(status) {
            this.markers.forEach(marker => {
                if (status === 'all') {
                    marker.addTo(this.map);
                } else {
                    const markerElement = marker.getElement();
                    if (markerElement) {
                        const container = markerElement.querySelector('.marker-container');
                        if (container && container.classList.contains(status)) {
                            marker.addTo(this.map);
                        } else {
                            this.map.removeLayer(marker);
                        }
                    }
                }
            });
        },

        /**
         * 按类型筛选标记
         * @param {string} type - 类型
         */
        filterMarkersByType(type) {
            // 需要额外的数据存储来支持类型筛选
            // 这里仅作为接口示例
            console.log('按类型筛选:', type);
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.mapHelper = MapHelper;

})(window.app);
