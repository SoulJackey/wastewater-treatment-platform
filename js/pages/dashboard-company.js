/**
 * 公司级看板页面逻辑
 */
(function(app) {
    'use strict';

    const DashboardCompany = {
        // 图表实例
        charts: {},

        // 自动刷新定时器
        refreshTimer: null,

        /**
         * 初始化页面
         */
        init() {
            console.log('初始化公司级看板');

            this.loadStatistics();
            this.initMap();
            this.initCharts();
            this.loadProjectList();
            this.loadAlarmList();
            this.startAutoRefresh();
        },

        /**
         * 加载统计数据
         */
        loadStatistics() {
            const stats = mockData.statistics;

            // 更新统计卡片
            this.updateStatCard('totalProjects', stats.totalProjects);
            this.updateStatCard('runningDevices', stats.runningDevices);
            this.updateStatCard('todayAlarms', stats.todayAlarms);
            this.updateStatCard('totalEnergy', stats.totalEnergy);

            // 应用数字滚动动画
            setTimeout(() => {
                app.utils.animation.countUpBatch(
                    document.querySelectorAll('.stat-card-value'),
                    'data-value',
                    1000
                );
            }, 300);
        },

        /**
         * 更新统计卡片
         */
        updateStatCard(elementId, value) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
                element.setAttribute('data-value', value);
            }
        },

        /**
         * 初始化地图
         */
        initMap() {
            const mapContainer = document.getElementById('mapContainer');
            if (!mapContainer) return;

            // 创建地图
            const map = L.map('mapContainer').setView([30.5728, 104.0668], 5);

            // 添加地图图层
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // 添加项目标记
            mockData.projects.forEach(project => {
                const marker = this.createProjectMarker(project);
                marker.addTo(map);
            });

            this.map = map;
        },

        /**
         * 创建项目标记
         */
        createProjectMarker(project) {
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

            const marker = L.marker([project.location.lat, project.location.lng], { icon });

            // 添加弹窗
            const popupContent = `
                <div class="project-popup">
                    <h4>${project.name}</h4>
                    <p><strong>类型:</strong> ${project.type}</p>
                    <p><strong>状态:</strong> ${this.getStatusText(project.status)}</p>
                    <p><strong>设备数:</strong> ${project.deviceCount}台</p>
                    <p><strong>运行:</strong> ${project.runningDevices}台</p>
                    ${project.alarmCount > 0 ? `<p class="text-warning"><i class="fas fa-exclamation-triangle"></i> ${project.alarmCount}个报警</p>` : ''}
                </div>
            `;

            marker.bindPopup(popupContent);

            // 绑定点击事件
            marker.on('click', () => {
                this.showProjectDetail(project);
            });

            return marker;
        },

        /**
         * 获取状态文本
         */
        getStatusText(status) {
            const statusMap = {
                'normal': '<span class="tag tag-success">正常</span>',
                'warning': '<span class="tag tag-warning">警告</span>',
                'danger': '<span class="tag tag-danger">故障</span>'
            };
            return statusMap[status] || status;
        },

        /**
         * 显示项目详情
         */
        showProjectDetail(project) {
            // TODO: 显示项目详情面板
            console.log('显示项目详情:', project);
        },

        /**
         * 初始化所有图表
         */
        initCharts() {
            this.initDeviceTypeChart();
            this.initAlarmChart();
            this.initEnergyTrendChart();
        },

        /**
         * 初始化设备类型分布图表
         */
        initDeviceTypeChart() {
            // 统计各类型项目数量
            const typeCount = {};
            mockData.projects.forEach(project => {
                typeCount[project.type] = (typeCount[project.type] || 0) + 1;
            });

            const colors = ['#1890ff', '#52c41a', '#faad14', '#13c2c2'];

            this.charts.deviceType = app.utils.chart.createDoughnutChart('deviceTypeChart', {
                tooltip: {
                    formatter: '{b}: {c}个 ({d}%)'
                },
                series: [{
                    data: Object.keys(typeCount).map((type, index) => ({
                        name: type,
                        value: typeCount[type],
                        itemStyle: { color: colors[index % colors.length] }
                    }))
                }]
            });
        },

        /**
         * 初始化报警统计图表
         */
        initAlarmChart() {
            const stats = mockData.statistics;

            this.charts.alarm = app.utils.chart.createDoughnutChart('alarmChart', {
                tooltip: {
                    formatter: '{b}: {c}条'
                },
                series: [{
                    data: [
                        {
                            value: stats.highAlarms,
                            name: '高级报警',
                            itemStyle: { color: '#f5222d' }
                        },
                        {
                            value: stats.mediumAlarms,
                            name: '中级报警',
                            itemStyle: { color: '#faad14' }
                        },
                        {
                            value: stats.lowAlarms,
                            name: '低级报警',
                            itemStyle: { color: '#52c41a' }
                        }
                    ]
                }]
            });
        },

        /**
         * 初始化能耗趋势图表
         */
        initEnergyTrendChart() {
            const data = mockData.energyHistory.slice(-7);

            this.charts.energyTrend = app.utils.chart.createAreaChart('energyTrendChart', {
                tooltip: {
                    formatter: '{b}<br/>能耗: {c} kWh'
                },
                xAxis: {
                    data: data.map(item => item.date.slice(5))
                },
                yAxis: {
                    name: 'kWh'
                },
                series: [{
                    name: '能耗',
                    data: data.map(item => item.energy),
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                                { offset: 1, color: 'rgba(24, 144, 255, 0)' }
                            ]
                        }
                    }
                }]
            });
        },

        /**
         * 加载项目列表
         */
        loadProjectList() {
            const container = document.getElementById('projectList');
            if (!container) return;

            const html = mockData.projects.map(project => {
                const typeConfig = getWastewaterTypeConfig(project.type);

                return `
                    <div class="project-card ${app.components.typeIcons.getCardClass(project.type)}">
                        <div class="card-header">
                            <div class="project-type">
                                ${app.getTypeIcon(project.type, 32)}
                            </div>
                            <div class="project-actions">
                                <button class="btn-icon" onclick="app.pages.dashboardCompany.viewProject(${project.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <h4 class="project-name">${project.name}</h4>
                            <p class="project-address">
                                <i class="fas fa-map-marker-alt"></i> ${project.address}
                            </p>
                            <div class="project-stats">
                                <div class="stat-item">
                                    <span class="stat-label">设备</span>
                                    <span class="stat-value">${project.deviceCount}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">运行</span>
                                    <span class="stat-value text-success">${project.runningDevices}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">报警</span>
                                    <span class="stat-value ${project.alarmCount > 0 ? 'text-danger' : ''}">${project.alarmCount}</span>
                                </div>
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                                </div>
                                <span class="progress-text">${project.progress}%</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = html;
        },

        /**
         * 加载报警列表
         */
        loadAlarmList() {
            const container = document.getElementById('alarmList');
            if (!container) return;

            const recentAlarms = mockData.alarms.slice(0, 5);

            const html = recentAlarms.map(alarm => {
                const levelClass = {
                    'high': 'danger',
                    'medium': 'warning',
                    'low': 'info'
                }[alarm.level];

                return `
                    <div class="alarm-item">
                        <div class="alarm-level">
                            <span class="tag tag-${levelClass}">${alarm.levelText}</span>
                        </div>
                        <div class="alarm-content">
                            <div class="alarm-title">${alarm.title}</div>
                            <div class="alarm-info">
                                <span>${alarm.projectName}</span>
                                <span>•</span>
                                <span>${app.formatDateTime(alarm.time, 'MM-DD HH:mm')}</span>
                            </div>
                        </div>
                        <div class="alarm-status">
                            ${alarm.status === 'pending' ? '<span class="status-dot warning"></span>' : ''}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = html;
        },

        /**
         * 查看项目详情
         */
        viewProject(projectId) {
            const project = mockData.projects.find(p => p.id === projectId);
            if (project) {
                // 跳转到项目级看板
                window.location.href = `dashboard-project.html?id=${projectId}`;
            }
        },

        /**
         * 刷新所有数据
         */
        refreshData() {
            console.log('刷新数据');

            // 重新加载数据
            this.loadStatistics();
            this.loadProjectList();
            this.loadAlarmList();

            // 刷新图表
            this.initCharts();

            app.showToast('数据已刷新', 'success');
        },

        /**
         * 开始自动刷新
         */
        startAutoRefresh() {
            // 每30秒自动刷新
            this.refreshTimer = setInterval(() => {
                this.refreshData();
            }, 30000);
        },

        /**
         * 停止自动刷新
         */
        stopAutoRefresh() {
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
        },

        /**
         * 销毁页面
         */
        destroy() {
            this.stopAutoRefresh();

            // 销毁所有图表
            Object.values(this.charts).forEach(chart => {
                chart.dispose();
            });
            this.charts = {};
        }
    };

    // 导出到全局app对象
    app.pages = app.pages || {};
    app.pages.dashboardCompany = DashboardCompany;

})(window.app);
