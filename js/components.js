/**
 * 组件加载器
 * 负责加载公共布局组件并处理菜单高亮、事件绑定等
 */
(function(app) {
    'use strict';

    const Components = {
        // 缓存模板内容
        templateCache: {},

        /**
         * 加载侧边栏组件
         * @param {string} activeMenu - 当前激活的菜单项ID
         * @param {string[]} expandedSubmenus - 需要展开的子菜单ID数组
         */
        async loadSidebar(activeMenu, expandedSubmenus = []) {
            try {
                // 尝试从文件加载模板
                let sidebarHtml = await this.loadTemplate('../templates/sidebar.html');

                // 如果文件加载失败,使用内联模板
                if (!sidebarHtml) {
                    sidebarHtml = this.getInlineSidebar();
                }

                // 替换现有的sidebar
                const existingSidebar = document.querySelector('.sidebar');
                if (existingSidebar) {
                    existingSidebar.outerHTML = sidebarHtml;
                }

                // 高亮当前菜单
                this.highlightMenu(activeMenu);

                // 展开子菜单
                expandedSubmenus.forEach(submenuId => {
                    this.expandSubmenu(submenuId);
                });

                // 重新绑定侧边栏事件
                this.bindSidebarEvents();

            } catch (error) {
                console.error('加载侧边栏失败:', error);
                // 降级到内联模板
                const sidebarHtml = this.getInlineSidebar();
                const existingSidebar = document.querySelector('.sidebar');
                if (existingSidebar) {
                    existingSidebar.outerHTML = sidebarHtml;
                }
                this.highlightMenu(activeMenu);
                this.bindSidebarEvents();
            }
        },

        /**
         * 加载顶部栏组件
         * @param {Array} breadcrumb - 面包屑数组 [{text: '', href: ''}, ...]
         */
        async loadHeader(breadcrumb = []) {
            try {
                // 尝试从文件加载模板
                let headerHtml = await this.loadTemplate('../templates/header.html');

                // 如果文件加载失败,使用内联模板
                if (!headerHtml) {
                    headerHtml = this.getInlineHeader();
                }

                // 替换现有的header
                const existingHeader = document.querySelector('.header');
                if (existingHeader) {
                    existingHeader.outerHTML = headerHtml;
                }

                // 渲染面包屑
                this.renderBreadcrumb(breadcrumb);

                // 重新绑定顶部栏事件
                this.bindHeaderEvents();

            } catch (error) {
                console.error('加载顶部栏失败:', error);
                // 降级到内联模板
                const headerHtml = this.getInlineHeader();
                const existingHeader = document.querySelector('.header');
                if (existingHeader) {
                    existingHeader.outerHTML = headerHtml;
                }
                this.renderBreadcrumb(breadcrumb);
                this.bindHeaderEvents();
            }
        },

        /**
         * 加载完整布局
         * @param {string} activeMenu
         * @param {string[]} expandedSubmenus
         * @param {Array} breadcrumb
         */
        async loadLayout(activeMenu, expandedSubmenus, breadcrumb) {
            await Promise.all([
                this.loadSidebar(activeMenu, expandedSubmenus),
                this.loadHeader(breadcrumb)
            ]);
        },

        /**
         * 从文件加载模板
         * @param {string} url - 模板文件URL
         * @returns {Promise<string>} 模板HTML内容
         */
        async loadTemplate(url) {
            // 检查缓存
            if (this.templateCache[url]) {
                return this.templateCache[url];
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                // 缓存模板
                this.templateCache[url] = html;
                return html;
            } catch (error) {
                console.warn(`无法加载模板文件 ${url}:`, error.message);
                return null;
            }
        },

        /**
         * 高亮当前菜单项
         * @param {string} menuId - 菜单项ID
         */
        highlightMenu(menuId) {
            // 移除所有active类
            document.querySelectorAll('.menu-link').forEach(link => {
                link.classList.remove('active');
            });

            // 添加active类到当前菜单项
            const activeLink = document.querySelector(`[data-menu="${menuId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');

                // 如果是子菜单项,确保父级也高亮
                const parentSubmenu = activeLink.closest('.submenu');
                if (parentSubmenu) {
                    const parentMenuItem = parentSubmenu.closest('.menu-item.has-submenu');
                    if (parentMenuItem) {
                        const parentLink = parentMenuItem.querySelector(':scope > .menu-link');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            }
        },

        /**
         * 展开子菜单
         * @param {string} submenuId - 子菜单ID
         */
        expandSubmenu(submenuId) {
            const submenuItem = document.querySelector(`[data-submenu="${submenuId}"]`);
            if (submenuItem) {
                const arrow = submenuItem.querySelector('.menu-arrow');
                const submenu = submenuItem.querySelector('.submenu');

                if (arrow) {
                    arrow.classList.add('expanded');
                }
                if (submenu) {
                    submenu.classList.add('open');
                }
            }
        },

        /**
         * 渲染面包屑
         * @param {Array} breadcrumbData - 面包屑数据
         */
        renderBreadcrumb(breadcrumbData) {
            const container = document.getElementById('breadcrumbContainer');
            if (!container) return;

            if (!breadcrumbData || breadcrumbData.length === 0) {
                container.innerHTML = '';
                return;
            }

            const html = breadcrumbData.map((item, index) => {
                const isLast = index === breadcrumbData.length - 1;
                if (isLast) {
                    return `<span class="breadcrumb-item">${this.escapeHtml(item.text)}</span>`;
                } else {
                    const href = item.href ? this.escapeHtml(item.href) : 'javascript:void(0)';
                    return `<span class="breadcrumb-item">
                        <a href="${href}">${this.escapeHtml(item.text)}</a>
                    </span>`;
                }
            }).join('<span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>');

            container.innerHTML = html;
        },

        /**
         * 绑定侧边栏事件
         */
        bindSidebarEvents() {
            // 侧边栏折叠
            const toggleBtn = document.querySelector('.toggle-btn');
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');

            if (toggleBtn && sidebar) {
                // 移除旧的事件监听器(克隆节点)
                const newToggleBtn = toggleBtn.cloneNode(true);
                toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

                newToggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('collapsed');
                });
            }

            // 移动端遮罩点击关闭侧边栏
            if (overlay && sidebar) {
                const newOverlay = overlay.cloneNode(true);
                overlay.parentNode.replaceChild(newOverlay, overlay);

                newOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-open');
                });
            }

            // 子菜单展开/收起
            document.querySelectorAll('.menu-item.has-submenu > .menu-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const menuItem = link.parentElement;
                    const arrow = link.querySelector('.menu-arrow');
                    const submenu = menuItem.querySelector('.submenu');

                    arrow.classList.toggle('expanded');
                    submenu.classList.toggle('open');
                });
            });
        },

        /**
         * 绑定顶部栏事件
         */
        bindHeaderEvents() {
            // 全屏按钮
            const fullscreenBtn = document.querySelector('.fullscreen-btn');
            if (fullscreenBtn) {
                const newBtn = fullscreenBtn.cloneNode(true);
                fullscreenBtn.parentNode.replaceChild(newBtn, fullscreenBtn);

                newBtn.addEventListener('click', () => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                });
            }

            // 主题切换按钮
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle && app.toggleTheme) {
                const newBtn = themeToggle.cloneNode(true);
                themeToggle.parentNode.replaceChild(newBtn, themeToggle);

                newBtn.addEventListener('click', () => {
                    app.toggleTheme();
                });
            }

            // 通知按钮
            const notificationBtn = document.querySelector('.notification-btn');
            if (notificationBtn) {
                const newBtn = notificationBtn.cloneNode(true);
                notificationBtn.parentNode.replaceChild(newBtn, notificationBtn);

                newBtn.addEventListener('click', () => {
                    app.showToast('暂无新通知', 'info');
                });
            }
        },

        /**
         * 获取内联侧边栏模板(降级方案)
         */
        getInlineSidebar() {
            return `<aside class="sidebar">
                <div class="sidebar-logo">
                    <i class="fas fa-water"></i>
                    <span class="logo-text">废水处理平台</span>
                </div>
                <nav class="sidebar-menu">
                    <div class="menu-section">
                        <div class="menu-label">综合看板</div>
                        <div class="menu-item">
                            <a href="dashboard-company.html" class="menu-link" data-menu="dashboard-company">
                                <span class="menu-icon"><i class="fas fa-chart-line"></i></span>
                                <span class="menu-text">公司级看板</span>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="dashboard-project.html" class="menu-link" data-menu="dashboard-project">
                                <span class="menu-icon"><i class="fas fa-chart-bar"></i></span>
                                <span class="menu-text">项目级看板</span>
                            </a>
                        </div>
                    </div>
                    <div class="menu-section">
                        <div class="menu-label">设备管理</div>
                        <div class="menu-item">
                            <a href="device-list.html" class="menu-link" data-menu="device-list">
                                <span class="menu-icon"><i class="fas fa-list"></i></span>
                                <span class="menu-text">设备档案</span>
                            </a>
                        </div>
                    </div>
                    <div class="menu-section">
                        <div class="menu-label">在线监控</div>
                        <div class="menu-item has-submenu" data-submenu="monitor">
                            <a href="javascript:void(0)" class="menu-link">
                                <span class="menu-icon"><i class="fas fa-desktop"></i></span>
                                <span class="menu-text">实时监控</span>
                                <span class="menu-arrow"><i class="fas fa-chevron-down"></i></span>
                            </a>
                            <div class="submenu">
                                <div class="menu-item">
                                    <a href="monitor-realtime.html" class="menu-link" data-menu="monitor-realtime">
                                        <span class="menu-text">实时数据</span>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="monitor-history.html" class="menu-link" data-menu="monitor-history">
                                        <span class="menu-text">历史数据</span>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="monitor-alarm.html" class="menu-link" data-menu="monitor-alarm">
                                        <span class="menu-text">报警管理</span>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="monitor-video.html" class="menu-link" data-menu="monitor-video">
                                        <span class="menu-text">视频监控</span>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="monitor-digitaltwin.html" class="menu-link" data-menu="monitor-digitaltwin">
                                        <span class="menu-text">数字孪生</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="menu-section">
                        <div class="menu-label">统计分析</div>
                        <div class="menu-item">
                            <a href="report-list.html" class="menu-link" data-menu="report-list">
                                <span class="menu-icon"><i class="fas fa-file-alt"></i></span>
                                <span class="menu-text">数据报表</span>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="report-energy.html" class="menu-link" data-menu="report-energy">
                                <span class="menu-icon"><i class="fas fa-bolt"></i></span>
                                <span class="menu-text">能耗统计</span>
                            </a>
                        </div>
                    </div>
                    <div class="menu-section">
                        <div class="menu-label">系统管理</div>
                        <div class="menu-item">
                            <a href="user-manage.html" class="menu-link" data-menu="user-manage">
                                <span class="menu-icon"><i class="fas fa-users"></i></span>
                                <span class="menu-text">人员管理</span>
                            </a>
                        </div>
                        <div class="menu-item">
                            <a href="javascript:void(0)" class="menu-link" data-menu="system-settings">
                                <span class="menu-icon"><i class="fas fa-cog"></i></span>
                                <span class="menu-text">系统设置</span>
                            </a>
                        </div>
                    </div>
                </nav>
            </aside>`;
        },

        /**
         * 获取内联顶部栏模板(降级方案)
         */
        getInlineHeader() {
            return `<header class="header">
                <div class="header-left">
                    <button class="toggle-btn">
                        <i class="fas fa-bars"></i>
                    </button>
                    <nav class="breadcrumb" id="breadcrumbContainer"></nav>
                </div>
                <div class="header-right">
                    <button class="header-action theme-toggle" id="themeToggle" title="切换主题">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="header-action notification-btn">
                        <i class="fas fa-bell"></i>
                        <span class="badge-count">3</span>
                    </button>
                    <button class="header-action fullscreen-btn">
                        <i class="fas fa-expand"></i>
                    </button>
                    <div class="user-info">
                        <div class="user-avatar">A</div>
                        <div class="user-details">
                            <div class="user-name">管理员</div>
                            <div class="user-role">系统管理员</div>
                        </div>
                    </div>
                    <a href="../index.html" class="header-action logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </header>`;
        },

        /**
         * HTML转义
         * @param {string} text - 需要转义的文本
         * @returns {string} 转义后的文本
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // 导出到全局app对象
    app.components = Components;

})(window.app);
