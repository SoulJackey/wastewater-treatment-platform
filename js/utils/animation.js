/**
 * 动画工具函数
 * 提供各种动画效果的工具函数
 */
(function(app) {
    'use strict';

    const Animation = {
        /**
         * 数字滚动效果
         * @param {HTMLElement} element - 目标元素
         * @param {number} target - 目标值
         * @param {number} duration - 动画时长(ms)
         * @param {number} decimals - 小数位数
         */
        countUp(element, target, duration = 1000, decimals = 0) {
            const start = 0;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // easeOutCubic缓动函数
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = start + (target - start) * easeProgress;

                element.textContent = current.toFixed(decimals);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target.toFixed(decimals);
                }
            };

            requestAnimationFrame(update);
        },

        /**
         * 批量数字滚动
         * @param {NodeList|Array} elements - 元素列表
         * @param {string} dataAttr - 存储目标值的数据属性名
         * @param {number} duration - 动画时长
         */
        countUpBatch(elements, dataAttr = 'data-value', duration = 1000) {
            elements.forEach(element => {
                const targetValue = parseFloat(element.getAttribute(dataAttr)) || 0;
                this.countUp(element, targetValue, duration);
            });
        },

        /**
         * 为多个元素添加延迟动画
         * @param {NodeList|Array} elements - 元素列表
         * @param {string} className - 动画类名
         * @param {number} delay - 每个元素之间的延迟(ms)
         */
        staggerAnimate(elements, className, delay = 100) {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add(className);
                }, index * delay);
            });
        },

        /**
         * 按钮波纹效果
         * @param {Event} event - 点击事件
         */
        createRipple(event) {
            const button = event.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        },

        /**
         * 为所有按钮绑定波纹效果
         */
        bindRippleEffect() {
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', this.createRipple);
            });
        },

        /**
         * 滚动到元素并高亮
         * @param {HTMLElement} element - 目标元素
         * @param {string} highlightClass - 高亮类名
         * @param {number} duration - 高亮持续时间
         */
        scrollToAndHighlight(element, highlightClass = 'highlight', duration = 2000) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            element.classList.add(highlightClass);

            setTimeout(() => {
                element.classList.remove(highlightClass);
            }, duration);
        },

        /**
         * 淡入显示元素
         * @param {HTMLElement} element - 目标元素
         * @param {number} duration - 动画时长
         * @param {Function} callback - 完成回调
         */
        fadeIn(element, duration = 300, callback) {
            element.style.opacity = '0';
            element.style.display = 'block';

            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = progress.toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 淡出隐藏元素
         * @param {HTMLElement} element - 目标元素
         * @param {number} duration - 动画时长
         * @param {Function} callback - 完成回调
         */
        fadeOut(element, duration = 300, callback) {
            const start = performance.now();
            const initialOpacity = parseFloat(window.getComputedStyle(element).opacity) || 1;

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = (initialOpacity * (1 - progress)).toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    if (callback) {
                        callback();
                    }
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 滑入显示元素
         * @param {HTMLElement} element - 目标元素
         * @param {string} direction - 方向: 'up', 'down', 'left', 'right'
         * @param {number} duration - 动画时长
         */
        slideIn(element, direction = 'up', duration = 400) {
            const transforms = {
                up: 'translateY(20px)',
                down: 'translateY(-20px)',
                left: 'translateX(20px)',
                right: 'translateX(-20px)'
            };

            element.style.transform = transforms[direction];
            element.style.opacity = '0';
            element.style.display = 'block';

            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                // easeOutQuart
                const easeProgress = 1 - Math.pow(1 - progress, 4);

                element.style.transform = `scale(${1 - easeProgress}) ${transforms[direction]}`;
                element.style.opacity = easeProgress.toString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = '';
                    element.style.opacity = '1';
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 元素进入视口时触发动画
         * @param {string} selector - 元素选择器
         * @param {string} animationClass - 动画类名
         * @param {number} threshold - 触发阈值(0-1)
         */
        observeViewport(selector, animationClass = 'fade-in', threshold = 0.1) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: threshold
            });

            document.querySelectorAll(selector).forEach(el => {
                observer.observe(el);
            });

            return observer;
        },

        /**
         * 震动元素
         * @param {HTMLElement} element - 目标元素
         * @param {number} duration - 震动时长
         * @param {number} intensity - 震动强度
         */
        shake(element, duration = 500, intensity = 5) {
            const start = performance.now();
            const originalTransform = element.style.transform;

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = elapsed / duration;

                if (progress < 1) {
                    const offset = Math.sin(elapsed / 30) * intensity * (1 - progress);
                    element.style.transform = `translateX(${offset}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 弹跳元素
         * @param {HTMLElement} element - 目标元素
         * @param {number} duration - 动画时长
         */
        bounce(element, duration = 600) {
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = elapsed / duration;

                if (progress < 1) {
                    // 模拟弹跳效果
                    const bounce = Math.abs(Math.sin(progress * Math.PI * 2)) * Math.pow(1 - progress, 2);
                    const offset = -bounce * 20;
                    element.style.transform = `translateY(${offset}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = '';
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 打字机效果
         * @param {HTMLElement} element - 目标元素
         * @param {string} text - 要显示的文本
         * @param {number} speed - 打字速度(ms/字符)
         */
        typewriter(element, text, speed = 100) {
            let i = 0;
            element.textContent = '';

            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            };

            type();
        },

        /**
         * 进度条动画
         * @param {HTMLElement} element - 进度条元素
         * @param {number} target - 目标百分比(0-100)
         * @param {number} duration - 动画时长
         */
        animateProgress(element, target, duration = 1000) {
            const start = 0;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = start + (target - start) * easeProgress;

                element.style.width = `${current}%`;
                element.setAttribute('aria-valuenow', current.toFixed(0));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        },

        /**
         * 循环计数动画(用于倒计时等场景)
         * @param {HTMLElement} element - 目标元素
         * @param {number} start - 起始值
         * @param {number} end - 结束值
         * @param {number} step - 步长
         * @param {number} interval - 间隔时间
         * @param {Function} onComplete - 完成回调
         */
        loopCount(element, start, end, step = 1, interval = 1000, onComplete) {
            let current = start;

            const timer = setInterval(() => {
                current += step;

                if (step > 0 && current >= end) {
                    current = end;
                    clearInterval(timer);
                    if (onComplete) onComplete();
                } else if (step < 0 && current <= end) {
                    current = end;
                    clearInterval(timer);
                    if (onComplete) onComplete();
                }

                element.textContent = current;
            }, interval);

            return timer;
        },

        /**
         * 骨架屏加载效果
         * @param {HTMLElement} container - 容器元素
         * @param {Function} loadData - 加载数据的异步函数
         * @param {Function} render - 渲染数据的函数
         */
        async loadWithSkeleton(container, loadData, render) {
            // 添加skeleton类
            container.classList.add('skeleton');

            try {
                const data = await loadData();

                // 移除skeleton类
                container.classList.remove('skeleton');

                // 渲染数据
                render(data);
            } catch (error) {
                container.classList.remove('skeleton');
                console.error('加载失败:', error);
            }
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.animation = Animation;

})(window.app);
