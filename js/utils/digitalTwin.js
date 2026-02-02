/**
 * 数字孪生2.5D工具
 * 提供等轴侧设备、动态管道、HUD浮窗等功能
 */
(function(app) {
    'use strict';

    const DigitalTwin = {
        // 设备数据存储
        equipment: {},

        // 图表实例
        charts: {},

        /**
         * 初始化数字孪生场景
         * @param {Array} equipmentList - 设备列表
         */
        init(equipmentList) {
            // 初始化设备数据
            equipmentList.forEach(item => {
                this.equipment[item.id] = {
                    ...item,
                    status: item.status || 'stopped',
                    metrics: item.metrics || {}
                };
            });

            // 渲染场景
            this.renderScene();

            // 开始数据更新循环
            this.startDataUpdate();
        },

        /**
         * 渲染场景
         */
        renderScene() {
            const container = document.getElementById('digitalTwinScene');
            if (!container) return;

            const html = Object.values(this.equipment).map(item => {
                return `
                    <div class="equipment-item" data-equipment-id="${item.id}">
                        ${this.renderEquipment(item)}
                        ${this.renderHUD(item)}
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="equipment-grid">
                    ${html}
                </div>
            `;

            // 绑定悬停事件
            this.bindHoverEvents();
        },

        /**
         * 渲染设备
         */
        renderEquipment(equipment) {
            let iconHtml = '';

            switch (equipment.type) {
                case 'tank':
                    iconHtml = `
                        <div class="tank-isometric">
                            <div class="tank-water" style="height: ${equipment.metrics.waterLevel || 60}%"></div>
                        </div>
                    `;
                    break;

                case 'pump':
                    iconHtml = `
                        <div class="pump-isometric ${equipment.status}">
                            <i class="fas fa-pump-soap"></i>
                        </div>
                        <div class="equipment-glow ${equipment.status}"></div>
                    `;
                    break;

                case 'valve':
                    iconHtml = `
                        <div class="valve-isometric ${equipment.status === 'closed' ? 'closed' : ''}">
                            <i class="fas fa-compress-arrows-alt"></i>
                        </div>
                    `;
                    break;

                case 'sensor':
                    iconHtml = `
                        <div class="sensor-isometric">
                            <i class="fas fa-thermometer-half"></i>
                        </div>
                    `;
                    break;

                default:
                    iconHtml = `
                        <div class="tank-isometric">
                            <div class="tank-water"></div>
                        </div>
                    `;
            }

            return `
                <div class="equipment-card">
                    ${iconHtml}
                    <div class="equipment-name">${equipment.name}</div>
                    <div class="equipment-status-dot ${equipment.status}"></div>
                </div>
            `;
        },

        /**
         * 渲染HUD浮窗
         */
        renderHUD(equipment) {
            return `
                <div class="equipment-hud">
                    <div class="hud-header">
                        <span class="hud-title">${equipment.name}</span>
                        <span class="hud-status ${equipment.status}">
                            ${equipment.status === 'running' ? '运行中' : '已停止'}
                        </span>
                    </div>
                    <div class="hud-metrics">
                        <div class="metric">
                            <span class="metric-label">液位</span>
                            <span class="metric-value">${equipment.metrics.waterLevel || 0}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">PH值</span>
                            <span class="metric-value">${equipment.metrics.ph || 7.2}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">流量</span>
                            <span class="metric-value">${equipment.metrics.flow || 0}</span>
                        </div>
                    </div>
                    <div class="hud-chart" id="hud-chart-${equipment.id}"></div>
                </div>
            `;
        },

        /**
         * 绑定悬停事件
         */
        bindHoverEvents() {
            document.querySelectorAll('.equipment-item').forEach(item => {
                item.addEventListener('mouseenter', () => {
                    const equipmentId = item.dataset.equipmentId;
                    this.renderHUDChart(equipmentId);
                });
            });
        },

        /**
         * 渲染HUD迷你图表
         */
        renderHUDChart(equipmentId) {
            const chartId = `hud-chart-${equipmentId}`;
            const chartElement = document.getElementById(chartId);

            if (!chartElement) return;

            // 生成模拟数据
            const data = this.generateTrendData(20);

            // 创建迷你折线图
            app.utils.chart.createLineChart(chartId, {
                grid: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                xAxis: {
                    type: 'category',
                    show: false,
                    data: data.map((_, i) => i)
                },
                yAxis: {
                    type: 'value',
                    show: false,
                    min: Math.min(...data),
                    max: Math.max(...data)
                },
                series: [{
                    type: 'line',
                    data: data,
                    symbol: 'none',
                    lineStyle: {
                        width: 2,
                        color: '#1890ff'
                    },
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
         * 生成趋势数据
         */
        generateTrendData(count) {
            const data = [];
            let value = 50;

            for (let i = 0; i < count; i++) {
                value += (Math.random() - 0.5) * 10;
                value = Math.max(20, Math.min(80, value));
                data.push(parseFloat(value.toFixed(1)));
            }

            return data;
        },

        /**
         * 创建动态管道
         * @param {string} containerId - 容器ID
         * @param {Array} pipes - 管道配置数组
         */
        createPipes(containerId, pipes) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'pipe-svg');
            svg.setAttribute('viewBox', '0 0 800 400');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');

            pipes.forEach(pipe => {
                // 绘制管道路径
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pipe.path);
                path.setAttribute('class', 'pipe-path');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', pipe.color || '#4a90e2');
                path.setAttribute('stroke-width', pipe.width || 8);
                svg.appendChild(path);

                // 绘制流动效果
                const flow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                flow.setAttribute('d', pipe.path);
                flow.setAttribute('class', `pipe-flow ${pipe.speed || ''}`);
                flow.setAttribute('fill', 'none');
                flow.setAttribute('stroke', 'rgba(255,255,255,0.6)');
                flow.setAttribute('stroke-width', (pipe.width || 8) - 4);
                flow.setAttribute('data-pipe-id', pipe.id);
                svg.appendChild(flow);

                // 添加连接点
                if (pipe.points) {
                    pipe.points.forEach(point => {
                        const connector = document.createElement('div');
                        connector.className = 'pipe-connector';
                        connector.style.left = `${point.x}%`;
                        connector.style.top = `${point.y}%`;
                        container.appendChild(connector);
                    });
                }
            });

            container.innerHTML = '';
            container.appendChild(svg);
        },

        /**
         * 更新管道流速
         * @param {string} pipeId - 管道ID
         * @param {number} flowRate - 流量(0-100)
         */
        updatePipeFlow(pipeId, flowRate) {
            const pipeFlow = document.querySelector(`.pipe-flow[data-pipe-id="${pipeId}"]`);
            if (!pipeFlow) return;

            // 移除旧的速度类
            pipeFlow.classList.remove('slow', 'fast', 'stopped');

            // 根据流量设置速度
            if (flowRate === 0) {
                pipeFlow.classList.add('stopped');
            } else if (flowRate > 70) {
                pipeFlow.classList.add('fast');
            } else if (flowRate < 30) {
                pipeFlow.classList.add('slow');
            }
        },

        /**
         * 开始数据更新循环
         */
        startDataUpdate() {
            setInterval(() => {
                this.updateEquipmentMetrics();
            }, 3000);
        },

        /**
         * 更新设备指标
         */
        updateEquipmentMetrics() {
            Object.keys(this.equipment).forEach(id => {
                const equipment = this.equipment[id];

                // 模拟数据变化
                if (equipment.status === 'running') {
                    equipment.metrics.waterLevel = Math.max(0, Math.min(100,
                        (equipment.metrics.waterLevel || 50) + (Math.random() - 0.5) * 5
                    ));

                    equipment.metrics.ph = parseFloat((
                        (equipment.metrics.ph || 7.2) + (Math.random() - 0.5) * 0.2
                    ).toFixed(1));

                    equipment.metrics.flow = Math.max(0, Math.min(20,
                        (equipment.metrics.flow || 10) + (Math.random() - 0.5) * 2
                    ).toFixed(1));

                    // 更新DOM
                    this.updateEquipmentDOM(id);
                }
            });
        },

        /**
         * 更新设备DOM
         */
        updateEquipmentDOM(equipmentId) {
            const item = document.querySelector(`[data-equipment-id="${equipmentId}"]`);
            if (!item) return;

            const equipment = this.equipment[equipmentId];

            // 更新HUD中的指标
            const hud = item.querySelector('.equipment-hud');
            if (hud) {
                const metrics = hud.querySelectorAll('.metric-value');
                if (metrics.length >= 3) {
                    metrics[0].textContent = `${equipment.metrics.waterLevel?.toFixed(1)}%`;
                    metrics[1].textContent = equipment.metrics.ph;
                    metrics[2].textContent = equipment.metrics.flow;
                }
            }

            // 更新液位显示
            const water = item.querySelector('.tank-water');
            if (water && equipment.metrics.waterLevel !== undefined) {
                water.style.height = `${equipment.metrics.waterLevel}%`;
            }
        },

        /**
         * 切换设备状态
         * @param {string} equipmentId - 设备ID
         */
        toggleEquipment(equipmentId) {
            const equipment = this.equipment[equipmentId];
            if (!equipment) return;

            const currentStatus = equipment.status;
            const newStatus = currentStatus === 'running' ? 'stopped' : 'running';

            equipment.status = newStatus;

            // 更新DOM
            const item = document.querySelector(`[data-equipment-id="${equipmentId}"]`);
            if (item) {
                // 更新图标
                const icon = item.querySelector('.pump-isometric');
                if (icon) {
                    icon.className = `pump-isometric ${newStatus}`;
                }

                // 更新光晕
                const glow = item.querySelector('.equipment-glow');
                if (glow) {
                    glow.className = `equipment-glow ${newStatus}`;
                }

                // 更新状态指示灯
                const statusDot = item.querySelector('.equipment-status-dot');
                if (statusDot) {
                    statusDot.className = `equipment-status-dot ${newStatus}`;
                }

                // 更新HUD状态文本
                const hudStatus = item.querySelector('.hud-status');
                if (hudStatus) {
                    hudStatus.textContent = newStatus === 'running' ? '运行中' : '已停止';
                    hudStatus.className = `hud-status ${newStatus}`;
                }
            }

            app.showToast(`${equipment.name}已${newStatus === 'running' ? '启动' : '停止'}`, 'success');
        },

        /**
         * 获取设备信息
         * @param {string} equipmentId - 设备ID
         * @returns {Object} 设备信息
         */
        getEquipment(equipmentId) {
            return this.equipment[equipmentId];
        },

        /**
         * 获取所有设备
         * @returns {Array} 设备列表
         */
        getAllEquipment() {
            return Object.values(this.equipment);
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.digitalTwin = DigitalTwin;

})(window.app);
