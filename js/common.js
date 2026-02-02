// 通用脚本

// 全局配置
const CONFIG = {
    sidebarCollapsed: false,
    currentModule: '',
    refreshInterval: 5000, // 5秒刷新一次
    theme: 'light' // 主题: light | dark
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initTheme(); // 初始化主题
    initSidebar();
    initHeader();
    highlightCurrentMenu();
    initBackToTop();
});

// 初始化主题
function initTheme() {
    // 从本地存储读取主题设置
    const savedTheme = storage.get('theme', 'light');
    setTheme(savedTheme, false);
}

// 设置主题
function setTheme(theme, save = true) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        updateThemeIcon('light');
    }

    CONFIG.theme = theme;

    if (save) {
        storage.set('theme', theme);
    }

    // 触发主题切换事件(供图表等组件监听)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`已切换到${newTheme === 'dark' ? '暗黑' : '亮色'}主题`, 'success');
}

// 更新主题图标
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// 初始化侧边栏
function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // 移动端：显示/隐藏侧边栏
                sidebar.classList.toggle('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('active');
                }
            } else {
                // 桌面端：折叠/展开侧边栏
                sidebar.classList.toggle('collapsed');
                CONFIG.sidebarCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', CONFIG.sidebarCollapsed);
            }
        });
    }

    // 点击遮罩关闭侧边栏（移动端）
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // 恢复侧边栏状态
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
        sidebar.classList.add('collapsed');
        CONFIG.sidebarCollapsed = true;
    }

    // 子菜单展开/收起
    const menuItemsWithSubmenu = document.querySelectorAll('.menu-item.has-submenu');
    menuItemsWithSubmenu.forEach(item => {
        const link = item.querySelector(':scope > .menu-link');
        const arrow = link.querySelector('.menu-arrow');
        const submenu = item.querySelector('.submenu');

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = submenu.classList.contains('open');

            // 关闭其他打开的子菜单
            document.querySelectorAll('.submenu.open').forEach(openSubmenu => {
                if (openSubmenu !== submenu) {
                    openSubmenu.classList.remove('open');
                    const otherArrow = openSubmenu.parentElement.querySelector('.menu-arrow');
                    if (otherArrow) {
                        otherArrow.classList.remove('expanded');
                    }
                }
            });

            // 切换当前子菜单
            submenu.classList.toggle('open');
            if (arrow) {
                arrow.classList.toggle('expanded');
            }
        });
    });
}

// 初始化顶部栏
function initHeader() {
    // 全屏切换
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
    }

    // 用户菜单下拉
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function() {
            // 可以添加用户菜单下拉逻辑
            showToast('用户菜单功能开发中', 'info');
        });
    }

    // 通知按钮
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showToast('暂无新通知', 'info');
        });
    }

    // 退出登录
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                showToast('退出成功', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
}

// 高亮当前菜单项
function highlightCurrentMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-link');

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === './' + currentPage) {
            link.classList.add('active');

            // 如果是子菜单项，展开父菜单
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('open');
                const parentArrow = parentSubmenu.parentElement.querySelector('.menu-arrow');
                if (parentArrow) {
                    parentArrow.classList.add('expanded');
                }
            }
        } else {
            link.classList.remove('active');
        }
    });
}

// 初始化返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add('fullscreen');
            showToast('已进入全屏模式', 'success');
        }).catch(err => {
            showToast('无法进入全屏模式: ' + err.message, 'error');
        });
    } else {
        document.exitFullscreen().then(() => {
            document.body.classList.remove('fullscreen');
            showToast('已退出全屏模式', 'success');
        });
    }
}

// Toast提示
function showToast(message, type = 'info', duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    const icon = iconMap[type] || 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// 模态框控制
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target.id);
    }
})

// 格式化日期时间
function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// 格式化数字
function formatNumber(num, decimals = 2) {
    if (isNaN(num)) return '-';
    return Number(num).toFixed(decimals);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 获取URL参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 设置URL参数
function setUrlParam(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// 删除URL参数
function removeUrlParam(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('复制成功', 'success');
        }).catch(err => {
            showToast('复制失败', 'error');
        });
    } else {
        // 兼容性处理
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('复制成功', 'success');
        } catch (err) {
            showToast('复制失败', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// 生成随机ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 深拷贝对象
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));

    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

// 本地存储封装
const storage = {
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('读取本地存储失败:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('写入本地存储失败:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('删除本地存储失败:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('清空本地存储失败:', e);
            return false;
        }
    }
};

// Ajax请求封装（模拟）
function ajaxRequest(options) {
    const {
        method = 'GET',
        url = '',
        data = null,
        success = null,
        error = null,
        complete = null
    } = options;

    // 模拟网络延迟
    setTimeout(() => {
        console.log(`[模拟请求] ${method} ${url}`, data);

        // 这里应该调用真实API，现在只是模拟
        if (success && typeof success === 'function') {
            // 模拟成功响应
            const mockResponse = {
                code: 200,
                message: 'success',
                data: null
            };
            success(mockResponse);
        }

        if (complete && typeof complete === 'function') {
            complete();
        }
    }, 500);
}

// 表单验证
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            isValid = false;
            input.classList.add('error');
            const label = form.querySelector(`label[for="${input.id}"]`);
            const fieldName = label ? label.textContent : '此字段';
            showToast(`${fieldName}不能为空`, 'error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// 导出数据为CSV
function exportToCsv(data, filename = 'export.csv') {
    if (!data || !data.length) {
        showToast('没有数据可导出', 'warning');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => {
            const value = row[fieldName];
            // 处理包含逗号的字段
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('导出成功', 'success');
}

// 打印页面
function printPage() {
    window.print();
}

// 响应式处理
window.addEventListener('resize', debounce(function() {
    // 移动端旋转屏幕时关闭侧边栏
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('active');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    }
}, 250));

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭所有模态框
    if (e.key === 'Escape') {
        closeAllModals();
    }

    // Ctrl+P 打印
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printPage();
    }
});

// 页面加载完成
window.addEventListener('load', function() {
    console.log('页面加载完成');
});

// 页面卸载前确认
window.addEventListener('beforeunload', function(e) {
    // 如果有未保存的修改，可以在这里添加确认提示
    // const hasUnsavedChanges = checkUnsavedChanges();
    // if (hasUnsavedChanges) {
    //     e.preventDefault();
    //     e.returnValue = '';
    // }
});

// 导出全局对象
window.app = {
    CONFIG,
    showToast,
    showModal,
    hideModal,
    closeAllModals,
    formatDateTime,
    formatNumber,
    formatFileSize,
    storage,
    exportToCsv,
    printPage,
    copyToClipboard,
    getUrlParam,
    setUrlParam,
    removeUrlParam,
    toggleTheme,
    setTheme
};
