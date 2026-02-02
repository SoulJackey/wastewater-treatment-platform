/**
 * 表格工具函数
 * 提供表格渲染、排序、筛选、分页等功能
 */
(function(app) {
    'use strict';

    const Table = {
        /**
         * 渲染表格
         * @param {string} tableId - 表格元素ID
         * @param {Array} columns - 列配置
         * @param {Array} data - 数据数组
         * @param {Object} options - 配置选项
         */
        render(tableId, columns, data, options = {}) {
            const table = document.getElementById(tableId);
            if (!table) return;

            const {
                pageSize = 10,
                showPagination = true,
                showCheckbox = false,
                stripe = true,
                border = false,
                emptyText = '暂无数据'
            } = options;

            // 设置表格类名
            table.className = `table ${stripe ? 'table-stripe' : ''} ${border ? 'table-border' : ''}`;

            // 生成表头
            const thead = table.querySelector('thead') || document.createElement('thead');
            thead.innerHTML = this._generateHeader(columns, showCheckbox);
            if (!table.querySelector('thead')) {
                table.appendChild(thead);
            }

            // 生成表体
            const tbody = table.querySelector('tbody') || document.createElement('tbody');
            if (data.length === 0) {
                const colspan = columns.length + (showCheckbox ? 1 : 0);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="${colspan}" class="text-center" style="padding: 40px;">
                            <div class="empty-state">
                                <div class="empty-icon">📭</div>
                                <div class="empty-text">${emptyText}</div>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = data.map((row, rowIndex) =>
                    this._generateRow(columns, row, rowIndex, showCheckbox)
                ).join('');
            }

            if (!table.querySelector('tbody')) {
                table.appendChild(tbody);
            }

            // 渲染分页
            if (showPagination && data.length > 0) {
                this._renderPagination(table, data, pageSize);
            }

            // 绑定事件
            this._bindEvents(table, columns, data);
        },

        /**
         * 生成表头HTML
         * @private
         */
        _generateHeader(columns, showCheckbox) {
            let html = '<tr>';

            if (showCheckbox) {
                html += '<th width="40"><input type="checkbox" class="table-check-all"></th>';
            }

            columns.forEach(col => {
                const width = col.width ? `width="${col.width}"` : '';
                const sortable = col.sortable ? 'class="sortable" data-field="' + col.field + '"' : '';
                html += `<th ${width} ${sortable}>${col.title}</th>`;
            });

            html += '</tr>';
            return html;
        },

        /**
         * 生成表格行HTML
         * @private
         */
        _generateRow(columns, rowData, rowIndex, showCheckbox) {
            let html = '<tr data-index="' + rowIndex + '">';

            if (showCheckbox) {
                html += '<td><input type="checkbox" class="table-check-item"></td>';
            }

            columns.forEach(col => {
                const value = this._getFieldValue(rowData, col.field);
                const content = col.render
                    ? col.render(value, rowData, rowIndex)
                    : this._defaultRender(value, col);

                html += `<td>${content}</td>`;
            });

            html += '</tr>';
            return html;
        },

        /**
         * 获取字段值(支持嵌套路径)
         * @private
         */
        _getFieldValue(rowData, field) {
            if (!field) return '';

            const keys = field.split('.');
            let value = rowData;

            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) return '';
            }

            return value;
        },

        /**
         * 默认渲染器
         * @private
         */
        _defaultRender(value, col) {
            // 如果有align属性
            const align = col.align || 'left';

            // 如果有type属性
            if (col.type === 'number') {
                return `<span class="text-right" style="display:block;text-align:${align}">${this._formatNumber(value)}</span>`;
            }

            if (col.type === 'date') {
                return `<span style="display:block;text-align:${align}">${app.formatDateTime(value, col.format || 'YYYY-MM-DD')}</span>`;
            }

            if (col.type === 'status') {
                return this._renderStatus(value);
            }

            return `<span style="display:block;text-align:${align}">${value}</span>`;
        },

        /**
         * 渲染状态标签
         * @private
         */
        _renderStatus(status) {
            const statusMap = {
                'normal': '<span class="tag tag-success">正常</span>',
                'warning': '<span class="tag tag-warning">警告</span>',
                'danger': '<span class="tag tag-danger">故障</span>',
                'offline': '<span class="tag tag-info">离线</span>',
                'running': '<span class="tag tag-success">运行中</span>',
                'stopped': '<span class="tag tag-default">已停止</span>'
            };

            return statusMap[status] || `<span class="tag tag-default">${status}</span>`;
        },

        /**
         * 格式化数字
         * @private
         */
        _formatNumber(value) {
            if (value === null || value === undefined) return '-';

            if (typeof value === 'number') {
                return value.toLocaleString('zh-CN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });
            }

            return value;
        },

        /**
         * 渲染分页
         * @private
         */
        _renderPagination(table, data, pageSize) {
            let pagination = table.nextElementSibling;
            if (!pagination || !pagination.classList.contains('table-pagination')) {
                pagination = document.createElement('div');
                pagination.className = 'table-pagination';
                table.parentNode.insertBefore(pagination, table.nextSibling);
            }

            const totalPages = Math.ceil(data.length / pageSize);
            const currentPage = 1;

            pagination.innerHTML = `
                <div class="pagination-info">
                    共 <strong>${data.length}</strong> 条记录
                </div>
                <div class="pagination-controls">
                    <button class="btn btn-default btn-sm" ${currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="pagination-pages">
                        ${this._generatePageNumbers(totalPages, currentPage)}
                    </span>
                    <button class="btn btn-default btn-sm" ${currentPage === totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        },

        /**
         * 生成分页页码
         * @private
         */
        _generatePageNumbers(totalPages, currentPage) {
            let html = '';

            for (let i = 1; i <= totalPages; i++) {
                const isActive = i === currentPage ? 'active' : '';
                html += `<button class="btn btn-default btn-sm page-number ${isActive}" data-page="${i}">${i}</button>`;
            }

            return html;
        },

        /**
         * 绑定表格事件
         * @private
         */
        _bindEvents(table, columns, data) {
            // 全选/取消全选
            const checkAll = table.querySelector('.table-check-all');
            if (checkAll) {
                checkAll.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    table.querySelectorAll('.table-check-item').forEach(item => {
                        item.checked = checked;
                    });
                });
            }

            // 行点击事件
            table.querySelectorAll('tbody tr').forEach(row => {
                row.addEventListener('click', (e) => {
                    // 如果点击的是checkbox或按钮,不触发行点击
                    if (e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'BUTTON' ||
                        e.target.closest('button')) {
                        return;
                    }

                    const index = parseInt(row.dataset.index);
                    const rowData = data[index];

                    // 触发自定义事件
                    table.dispatchEvent(new CustomEvent('rowClick', {
                        detail: { row, data: rowData, index }
                    }));
                });
            });

            // 排序事件
            table.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.field;
                    const order = th.dataset.order || 'asc';

                    // 清除其他列的排序状态
                    table.querySelectorAll('th.sortable').forEach(otherTh => {
                        if (otherTh !== th) {
                            otherTh.classList.remove('sort-asc', 'sort-desc');
                            delete otherTh.dataset.order;
                        }
                    });

                    // 切换排序方向
                    if (order === 'asc') {
                        th.classList.remove('sort-asc');
                        th.classList.add('sort-desc');
                        th.dataset.order = 'desc';
                    } else {
                        th.classList.remove('sort-desc');
                        th.classList.add('sort-asc');
                        th.dataset.order = 'asc';
                    }

                    // 触发排序事件
                    table.dispatchEvent(new CustomEvent('sort', {
                        detail: { field, order: th.dataset.order }
                    }));
                });
            });

            // 分页事件
            const pagination = table.nextElementSibling;
            if (pagination && pagination.classList.contains('table-pagination')) {
                pagination.querySelectorAll('.page-number').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const page = parseInt(btn.dataset.page);
                        table.dispatchEvent(new CustomEvent('pageChange', {
                            detail: { page }
                        }));
                    });
                });
            }
        },

        /**
         * 刷新表格数据
         * @param {string} tableId - 表格元素ID
         * @param {Array} newData - 新数据
         */
        refresh(tableId, newData) {
            const table = document.getElementById(tableId);
            if (!table) return;

            // 从data属性获取配置
            const columns = table.dataset.columns ? JSON.parse(table.dataset.columns) : [];
            const options = table.dataset.options ? JSON.parse(table.dataset.options) : {};

            this.render(tableId, columns, newData, options);
        },

        /**
         * 获取选中的行
         * @param {string} tableId - 表格元素ID
         * @returns {Array} 选中的行数据
         */
        getSelectedRows(tableId) {
            const table = document.getElementById(tableId);
            if (!table) return [];

            const selectedIndexes = [];
            table.querySelectorAll('.table-check-item:checked').forEach(checkbox => {
                const row = checkbox.closest('tr');
                selectedIndexes.push(parseInt(row.dataset.index));
            });

            const data = table.dataset.data ? JSON.parse(table.dataset.data) : [];
            return selectedIndexes.map(index => data[index]);
        },

        /**
         * 导出表格数据为CSV
         * @param {string} tableId - 表格元素ID
         * @param {string} filename - 文件名
         */
        exportToCsv(tableId, filename = 'export.csv') {
            const table = document.getElementById(tableId);
            if (!table) return;

            const rows = [];
            const headers = [];

            // 获取表头
            table.querySelectorAll('thead th').forEach(th => {
                headers.push(th.textContent.trim());
            });
            rows.push(headers);

            // 获取表体数据
            table.querySelectorAll('tbody tr').forEach(tr => {
                const row = [];
                tr.querySelectorAll('td').forEach(td => {
                    row.push(td.textContent.trim());
                });
                rows.push(row);
            });

            // 转换为CSV
            const csv = rows.map(row =>
                row.map(cell => {
                    // 处理包含逗号的字段
                    if (cell.includes(',')) {
                        return `"${cell}"`;
                    }
                    return cell;
                }).join(',')
            ).join('\n');

            // 下载文件
            const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            app.showToast('导出成功', 'success');
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.table = Table;

})(window.app);
