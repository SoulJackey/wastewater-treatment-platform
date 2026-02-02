/**
 * 工业控制三段式反馈工具
 * 实现下发指令→设备响应→更新UI的完整流程
 */
(function(app) {
    'use strict';

    const IndustrialControl = {
        // 设备状态存储
        deviceStates: {},

        // 操作日志
        operationLogs: [],

        /**
         * 初始化控制面板
         * @param {Array} devices - 设备列表
         */
        init(devices) {
            // 初始化设备状态
            devices.forEach(device => {
                this.deviceStates[device.id] = {
                    status: device.status || 'stopped',
                    name: device.name,
                    type: device.type,
                    isCritical: device.isCritical || false
                };
            });
        },

        /**
         * 切换设备状态(三段式反馈)
         * @param {string} deviceId - 设备ID
         * @param {boolean} requireConfirm - 是否需要二次确认
         */
        async toggleDevice(deviceId, requireConfirm = false) {
            const state = this.deviceStates[deviceId];
            if (!state) {
                app.showToast('设备不存在', 'error');
                return;
            }

            const currentState = state.status === 'running';
            const newState = !currentState;
            const action = newState ? '启动' : '停止';

            // 关键设备需要二次确认
            if (state.isCritical && requireConfirm) {
                const confirmed = await this.showConfirmDialog(
                    `确认${action}`,
                    `您确定要${action}【${state.name}】吗？\n此操作将影响整个系统运行。`
                );
                if (!confirmed) {
                    return;
                }
            }

            // 获取DOM元素
            const toggleBtn = document.querySelector(`[data-device-id="${deviceId}"] .control-toggle`);
            const statusText = document.querySelector(`[data-device-id="${deviceId}"] .control-status`);

            if (!toggleBtn || !statusText) {
                console.error(`找不到设备 ${deviceId} 的控制元素`);
                return;
            }

            // === 阶段1: 下发指令 ===
            toggleBtn.classList.add('loading');
            toggleBtn.disabled = true;
            statusText.textContent = '下发指令...';
            statusText.className = 'control-status pending';

            try {
                // 模拟网络延迟(0.8-2秒)
                await this._simulateDelay(800, 2000);

                // === 阶段2: 设备响应 ===
                statusText.textContent = '设备响应中...';

                // 模拟设备响应延迟(0.5-1.5秒)
                await this._simulateDelay(500, 1500);

                // === 阶段3: 更新UI ===
                // 90%成功率模拟
                const success = Math.random() > 0.1;

                if (success) {
                    // 操作成功
                    toggleBtn.classList.remove('loading');
                    toggleBtn.classList.toggle('active', newState);
                    toggleBtn.disabled = false;

                    statusText.textContent = newState ? '运行中' : '已停止';
                    statusText.className = `control-status ${newState ? 'running' : 'stopped'}`;

                    // 更新状态
                    this.deviceStates[deviceId].status = newState ? 'running' : 'stopped';

                    app.showToast(`${action}成功`, 'success');

                    // 记录操作日志
                    this.logOperation(deviceId, action, '成功');
                } else {
                    // 操作失败
                    throw new Error('设备响应超时或执行失败');
                }

            } catch (error) {
                // 失败处理
                toggleBtn.classList.remove('loading');
                toggleBtn.disabled = false;

                statusText.textContent = '操作失败';
                statusText.className = 'control-status error';

                app.showToast(`操作失败: ${error.message}`, 'error');

                // 记录失败日志
                this.logOperation(deviceId, action, '失败');

                // 2秒后恢复原状态
                setTimeout(() => {
                    statusText.textContent = currentState ? '运行中' : '已停止';
                    statusText.className = `control-status ${currentState ? 'running' : 'stopped'}`;
                }, 2000);
            }
        },

        /**
         * 显示确认对话框
         * @param {string} title - 标题
         * @param {string} message - 消息
         * @returns {Promise<boolean>} 用户是否确认
         */
        showConfirmDialog(title, message) {
            return new Promise((resolve) => {
                // 创建对话框
                const dialog = document.createElement('div');
                dialog.className = 'modal-overlay active';
                dialog.id = 'confirmDialog';

                dialog.innerHTML = `
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="confirm-dialog">
                            <div class="confirm-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3 style="margin-bottom: 16px;">${title}</h3>
                            <p class="confirm-message">${message.replace(/\n/g, '<br>')}</p>
                            <div class="confirm-actions">
                                <button class="btn btn-default" id="confirmCancel">
                                    <i class="fas fa-times"></i> 取消
                                </button>
                                <button class="btn btn-primary" id="confirmOk">
                                    <i class="fas fa-check"></i> 确认
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(dialog);
                document.body.style.overflow = 'hidden';

                // 绑定事件
                const cancelBtn = dialog.querySelector('#confirmCancel');
                const okBtn = dialog.querySelector('#confirmOk');

                const close = (result) => {
                    dialog.remove();
                    document.body.style.overflow = '';
                    resolve(result);
                };

                cancelBtn.addEventListener('click', () => close(false));
                okBtn.addEventListener('click', () => close(true));

                // ESC键关闭
                const handleEsc = (e) => {
                    if (e.key === 'Escape') {
                        document.removeEventListener('keydown', handleEsc);
                        close(false);
                    }
                };
                document.addEventListener('keydown', handleEsc);

                // 点击遮罩关闭
                dialog.addEventListener('click', (e) => {
                    if (e.target === dialog) {
                        close(false);
                    }
                });
            });
        },

        /**
         * 记录操作日志
         * @param {string} deviceId - 设备ID
         * @param {string} action - 操作
         * @param {string} result - 结果
         */
        logOperation(deviceId, action, result) {
            const state = this.deviceStates[deviceId];
            if (!state) return;

            const log = {
                time: new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
                device: state.name,
                action,
                result,
                operator: '管理员'
            };

            // 添加到日志数组
            this.operationLogs.unshift(log);

            // 限制日志数量
            if (this.operationLogs.length > 50) {
                this.operationLogs = this.operationLogs.slice(0, 50);
            }

            // 更新UI
            this._renderLogs();
        },

        /**
         * 渲染操作日志
         * @private
         */
        _renderLogs() {
            const container = document.getElementById('operationLog');
            if (!container) return;

            const html = this.operationLogs.map(log => `
                <div class="log-item">
                    <span class="log-time">${log.time}</span>
                    <span class="log-device">${log.device}</span>
                    <span class="log-action">${log.action}</span>
                    <span class="log-result ${log.result === '成功' ? 'success' : 'error'}">
                        ${log.result}
                    </span>
                </div>
            `).join('');

            container.innerHTML = html;
        },

        /**
         * 渲染控制面板
         * @param {Array} devices - 设备列表
         * @param {string} containerId - 容器元素ID
         */
        renderControlPanel(devices, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // 初始化设备状态
            this.init(devices);

            const html = `
                <h3><i class="fas fa-sliders-h"></i> 设备控制</h3>
                <div class="control-list">
                    ${devices.map(device => {
                        const state = this.deviceStates[device.id];
                        const isActive = state.status === 'running';

                        return `
                            <div class="control-item ${device.isCritical ? 'critical' : ''}" data-device-id="${device.id}">
                                <div class="control-info">
                                    <div class="control-icon">
                                        <i class="fas ${device.icon || 'fa-cog'}"></i>
                                    </div>
                                    <div class="control-details">
                                        <div class="control-name">
                                            ${device.name}
                                            ${device.isCritical ? '<span class="critical-badge"><i class="fas fa-exclamation-circle"></i> 关键</span>' : ''}
                                        </div>
                                        <div class="control-status ${isActive ? 'running' : 'stopped'}">
                                            ${isActive ? '运行中' : '已停止'}
                                        </div>
                                    </div>
                                </div>
                                <button class="control-toggle ${isActive ? 'active' : ''}"
                                        onclick="app.utils.industrialControl.toggleDevice('${device.id}', ${device.isCritical ? 'true' : 'false'})">
                                    <span class="toggle-slider"></span>
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="operation-log" id="operationLog">
                    <!-- 操作日志将在这里渲染 -->
                </div>
            `;

            container.innerHTML = html;
        },

        /**
         * 批量控制设备
         * @param {Array} deviceIds - 设备ID数组
         * @param {boolean} start - true为启动,false为停止
         */
        async batchControl(deviceIds, start) {
            const action = start ? '启动' : '停止';

            // 显示确认对话框
            const confirmed = await this.showConfirmDialog(
                `批量${action}`,
                `您确定要批量${action} ${deviceIds.length} 个设备吗？`
            );

            if (!confirmed) {
                return;
            }

            // 逐个控制
            for (const deviceId of deviceIds) {
                await this.toggleDevice(deviceId, false);
                // 延迟500ms避免请求过快
                await this._simulateDelay(500, 500);
            }

            app.showToast(`批量${action}完成`, 'success');
        },

        /**
         * 获取设备状态
         * @param {string} deviceId - 设备ID
         * @returns {Object} 设备状态
         */
        getDeviceState(deviceId) {
            return this.deviceStates[deviceId];
        },

        /**
         * 获取所有设备状态
         * @returns {Object} 所有设备状态
         */
        getAllDeviceStates() {
            return { ...this.deviceStates };
        },

        /**
         * 获取操作日志
         * @returns {Array} 操作日志
         */
        getOperationLogs() {
            return [...this.operationLogs];
        },

        /**
         * 清空操作日志
         */
        clearLogs() {
            this.operationLogs = [];
            this._renderLogs();
            app.showToast('日志已清空', 'success');
        },

        /**
         * 导出操作日志
         */
        exportLogs() {
            if (this.operationLogs.length === 0) {
                app.showToast('暂无日志可导出', 'warning');
                return;
            }

            const data = this.operationLogs.map(log => ({
                时间: log.time,
                设备: log.device,
                操作: log.action,
                结果: log.result,
                操作员: log.operator
            }));

            app.exportToCsv(data, `操作日志_${new Date().toISOString().slice(0, 10)}.csv`);
        },

        /**
         * 模拟延迟
         * @private
         */
        _simulateDelay(min, max) {
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.industrialControl = IndustrialControl;

})(window.app);
