/**
 * 废水类型图标组件
 * 用于渲染不同类型废水的图标和标签
 */
(function(app) {
    'use strict';

    const TypeIcons = {
        /**
         * 获取类型图标HTML
         * @param {string} typeName - 类型名称('生活污水', '隧道废水'等)
         * @param {number} size - 图标大小(px)
         * @returns {string} 图标HTML
         */
        getIcon(typeName, size = 40) {
            const typeConfig = this._getTypeConfig(typeName);

            return `
                <div class="type-icon type-${typeConfig.id}"
                     style="width: ${size}px; height: ${size}px; background: ${typeConfig.gradient};"
                     title="${typeConfig.name}">
                    <i class="fas ${typeConfig.icon}"></i>
                </div>
            `;
        },

        /**
         * 获取类型标签HTML
         * @param {string} typeName - 类型名称
         * @param {boolean} showIcon - 是否显示图标
         * @returns {string} 标签HTML
         */
        getTag(typeName, showIcon = true) {
            const typeConfig = this._getTypeConfig(typeName);

            return `
                <span class="tag type-tag type-${typeConfig.id}"
                      style="background: ${typeConfig.gradient};">
                    ${showIcon ? `<i class="fas ${typeConfig.icon}"></i>` : ''}
                    ${typeConfig.name}
                </span>
            `;
        },

        /**
         * 获取类型徽章HTML(带边框的标签)
         * @param {string} typeName - 类型名称
         * @returns {string} 徽章HTML
         */
        getBadge(typeName) {
            const typeConfig = this._getTypeConfig(typeName);

            return `
                <span class="type-badge type-${typeConfig.id}">
                    <span class="badge-dot" style="background: ${typeConfig.color};"></span>
                    <span class="badge-text">${typeConfig.name}</span>
                </span>
            `;
        },

        /**
         * 获取类型选择器HTML(用于筛选)
         * @param {string} selectedType - 当前选中的类型
         * @returns {string} 选择器HTML
         */
        getFilter(selectedType = 'all') {
            const types = [
                { id: 'all', name: '全部', icon: 'fa-th', color: '#8c8c8c' },
                WASTEWATER_TYPES.DOMESTIC,
                WASTEWATER_TYPES.TUNNEL,
                WASTEWATER_TYPES.MIXING,
                WASTEWATER_TYPES.SANDSTONE
            ];

            return `
                <div class="type-filter">
                    ${types.map(type => `
                        <button class="filter-btn ${selectedType === type.id ? 'active' : ''}"
                                data-type="${type.id}"
                                style="${type.id !== 'all' ? `--type-color: ${type.color};` : ''}">
                            <i class="fas ${type.icon}"></i>
                            ${type.name}
                        </button>
                    `).join('')}
                </div>
            `;
        },

        /**
         * 获取项目卡片类型标识条HTML
         * @param {string} typeName - 类型名称
         * @returns {string} CSS类名
         */
        getCardClass(typeName) {
            const typeConfig = this._getTypeConfig(typeName);
            return `type-${typeConfig.id}`;
        },

        /**
         * 为项目卡片添加类型标识
         * @param {HTMLElement} cardElement - 卡片元素
         * @param {string} typeName - 类型名称
         */
        decorateCard(cardElement, typeName) {
            const typeConfig = this._getTypeConfig(typeName);
            cardElement.classList.add('type-card', `type-${typeConfig.id}`);
            cardElement.style.setProperty('--type-color', typeConfig.color);
        },

        /**
         * 获取类型统计卡片HTML
         * @param {string} typeName - 类型名称
         * @param {number} count - 数量
         * @param {number} alarmCount - 报警数量
         * @returns {string} 统计卡片HTML
         */
        getStatCard(typeName, count, alarmCount = 0) {
            const typeConfig = this._getTypeConfig(typeName);

            return `
                <div class="type-stat-card type-${typeConfig.id}">
                    <div class="stat-icon" style="background: ${typeConfig.gradient};">
                        <i class="fas ${typeConfig.icon}"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">${typeConfig.name}</div>
                        <div class="stat-value">${count}</div>
                        <div class="stat-alarm ${alarmCount > 0 ? 'has-alarm' : ''}">
                            <i class="fas fa-exclamation-triangle"></i>
                            ${alarmCount} 报警
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 获取类型图例HTML(用于地图等)
         * @returns {string} 图例HTML
         */
        getLegend() {
            const types = [
                WASTEWATER_TYPES.DOMESTIC,
                WASTEWATER_TYPES.TUNNEL,
                WASTEWATER_TYPES.MIXING,
                WASTEWATER_TYPES.SANDSTONE
            ];

            return `
                <div class="type-legend">
                    ${types.map(type => `
                        <div class="legend-item">
                            <div class="legend-color" style="background: ${type.gradient};"></div>
                            <span class="legend-text">${type.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        /**
         * 获取类型详细信息HTML
         * @param {string} typeName - 类型名称
         * @returns {string} 详情HTML
         */
        getDetail(typeName) {
            const typeConfig = this._getTypeConfig(typeName);

            return `
                <div class="type-detail type-${typeConfig.id}">
                    <div class="detail-header" style="background: ${typeConfig.gradient};">
                        <i class="fas ${typeConfig.icon}"></i>
                        <h3>${typeConfig.name}</h3>
                    </div>
                    <div class="detail-body">
                        <p>${typeConfig.description}</p>
                        <div class="detail-info">
                            <div class="info-item">
                                <span class="info-label">英文名称</span>
                                <span class="info-value">${typeConfig.nameEn}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">标识颜色</span>
                                <span class="info-value">
                                    <span class="color-sample" style="background: ${typeConfig.color};"></span>
                                    ${typeConfig.color}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * 获取类型配置对象
         * @param {string} typeName - 类型名称
         * @returns {Object} 类型配置
         * @private
         */
        _getTypeConfig(typeName) {
            const typeMap = {
                '生活污水': WASTEWATER_TYPES.DOMESTIC,
                '隧道废水': WASTEWATER_TYPES.TUNNEL,
                '拌合站废水': WASTEWATER_TYPES.MIXING,
                '砂石废水': WASTEWATER_TYPES.SANDSTONE
            };
            return typeMap[typeName] || WASTEWATER_TYPES.DOMESTIC;
        }
    };

    // 导出到全局app对象
    app.components = app.components || {};
    app.components.typeIcons = TypeIcons;

    // 便捷方法
    app.getTypeIcon = (typeName, size) => TypeIcons.getIcon(typeName, size);
    app.getTypeTag = (typeName, showIcon) => TypeIcons.getTag(typeName, showIcon);
    app.getTypeBadge = (typeName) => TypeIcons.getBadge(typeName);

})(window.app);
