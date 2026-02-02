/**
 * ECharts 图表通用工具
 * 提供常用图表类型的快速创建方法
 */
(function(app) {
    'use strict';

    const Chart = {
        // 存储图表实例
        instances: {},

        /**
         * 创建折线图
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createLineChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    trigger: 'axis',
                    confine: true
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'line',
                    smooth: true,
                    data: []
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            // 保存实例并绑定resize事件
            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建柱状图
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createBarChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    confine: true
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar',
                    data: []
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建饼图
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createPieChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    confine: true
                },
                legend: {
                    orient: 'vertical',
                    right: '10%',
                    top: 'center'
                },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: []
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建环形图
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createDoughnutChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    confine: true
                },
                legend: {
                    orient: 'vertical',
                    right: '10%',
                    top: 'center'
                },
                series: [{
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: []
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建仪表盘
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createGaugeChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%',
                    confine: true
                },
                series: [{
                    type: 'gauge',
                    progress: {
                        show: true,
                        width: 18
                    },
                    axisLine: {
                        lineStyle: {
                            width: 18
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: 15,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: 25,
                        color: '#999',
                        fontSize: 12
                    },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            borderWidth: 10
                        }
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 24,
                        offsetCenter: [0, '70%'],
                        formatter: '{value}%'
                    },
                    data: [{
                        value: 50,
                        name: '完成率'
                    }]
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建面积图
         * @param {string} elementId - 容器元素ID
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createAreaChart(elementId, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    confine: true
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'line',
                    smooth: true,
                    areaStyle: {},
                    data: []
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 创建迷你趋势图(Sparkline)
         * @param {string} elementId - 容器元素ID
         * @param {Array} data - 数据数组
         * @param {Object} options - 图表配置
         * @returns {Object} ECharts实例
         */
        createSparkline(elementId, data, options = {}) {
            const chart = echarts.init(document.getElementById(elementId));

            const defaultOptions = {
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
                        color: options.color || '#1890ff'
                    },
                    areaStyle: options.showArea ? {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: options.color || 'rgba(24, 144, 255, 0.3)' },
                                { offset: 1, color: 'rgba(24, 144, 255, 0)' }
                            ]
                        }
                    } : undefined
                }]
            };

            const mergedOptions = this._mergeOptions(defaultOptions, options);
            chart.setOption(mergedOptions);

            this._registerChart(elementId, chart);

            return chart;
        },

        /**
         * 更新图表数据
         * @param {string} elementId - 图表元素ID
         * @param {Object|Array} newData - 新数据
         */
        updateChart(elementId, newData) {
            const chart = this.instances[elementId];
            if (chart) {
                chart.setOption(newData);
            }
        },

        /**
         * 调整图表大小
         * @param {string} elementId - 图表元素ID(可选)
         */
        resize(elementId) {
            if (elementId) {
                const chart = this.instances[elementId];
                if (chart) {
                    chart.resize();
                }
            } else {
                // 调整所有图表大小
                Object.values(this.instances).forEach(chart => {
                    chart.resize();
                });
            }
        },

        /**
         * 销毁图表
         * @param {string} elementId - 图表元素ID
         */
        dispose(elementId) {
            const chart = this.instances[elementId];
            if (chart) {
                chart.dispose();
                delete this.instances[elementId];
            }
        },

        /**
         * 销毁所有图表
         */
        disposeAll() {
            Object.values(this.instances).forEach(chart => {
                chart.dispose();
            });
            this.instances = {};
        },

        /**
         * 获取暗黑主题配置
         * @returns {Object} ECharts暗黑主题对象
         */
        getDarkTheme() {
            return {
                backgroundColor: 'transparent',
                textStyle: {
                    color: '#e8e8e8'
                },
                title: {
                    textStyle: {
                        color: '#e8e8e8'
                    }
                },
                legend: {
                    textStyle: {
                        color: '#e8e8e8'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 35, 50, 0.9)',
                    borderColor: '#2c2c2c',
                    textStyle: {
                        color: '#e8e8e8'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                categoryAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#8c8c8c'
                        }
                    },
                    axisLabel: {
                        color: '#e8e8e8'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#2c2c2c'
                        }
                    }
                },
                valueAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#8c8c8c'
                        }
                    },
                    axisLabel: {
                        color: '#e8e8e8'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#2c2c2c'
                        }
                    }
                }
            };
        },

        /**
         * 应用主题到所有图表
         */
        applyThemeToAll() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const theme = isDark ? this.getDarkTheme() : {};

            Object.entries(this.instances).forEach(([elementId, chart]) => {
                const currentOption = chart.getOption();
                chart.setOption({
                    ...currentOption,
                    ...theme
                });
            });
        },

        /**
         * 注册图表实例
         * @private
         */
        _registerChart(elementId, chart) {
            this.instances[elementId] = chart;

            // 绑定resize事件
            window.addEventListener('resize', () => {
                chart.resize();
            });

            // 监听主题变化
            window.addEventListener('themeChanged', () => {
                setTimeout(() => {
                    this.applyThemeToAll();
                }, 100);
            });
        },

        /**
         * 合并配置选项
         * @private
         */
        _mergeOptions(defaultOptions, customOptions) {
            return {
                ...defaultOptions,
                ...customOptions,
                // 深度合并series
                series: customOptions.series || defaultOptions.series,
                // 深度合并xAxis
                xAxis: {
                    ...defaultOptions.xAxis,
                    ...customOptions.xAxis
                },
                // 深度合并yAxis
                yAxis: {
                    ...defaultOptions.yAxis,
                    ...customOptions.yAxis
                }
            };
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.chart = Chart;

})(window.app);
