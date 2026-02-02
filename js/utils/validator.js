/**
 * 表单验证工具
 * 提供常用的表单验证功能
 */
(function(app) {
    'use strict';

    const Validator = {
        /**
         * 验证规则
         */
        rules: {
            // 必填
            required: (value) => {
                if (value === null || value === undefined || value === '') {
                    return { valid: false, message: '此字段为必填项' };
                }
                return { valid: true };
            },

            // 邮箱
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return { valid: false, message: '请输入有效的邮箱地址' };
                }
                return { valid: true };
            },

            // 手机号
            phone: (value) => {
                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    return { valid: false, message: '请输入有效的手机号码' };
                }
                return { valid: true };
            },

            // 数字
            number: (value) => {
                if (isNaN(value)) {
                    return { valid: false, message: '请输入有效的数字' };
                }
                return { valid: true };
            },

            // 整数
            integer: (value) => {
                if (!Number.isInteger(Number(value))) {
                    return { valid: false, message: '请输入整数' };
                }
                return { valid: true };
            },

            // 最小长度
            minLength: (value, min) => {
                if (value.length < min) {
                    return { valid: false, message: `长度不能少于${min}个字符` };
                }
                return { valid: true };
            },

            // 最大长度
            maxLength: (value, max) => {
                if (value.length > max) {
                    return { valid: false, message: `长度不能超过${max}个字符` };
                }
                return { valid: true };
            },

            // 范围
            range: (value, min, max) => {
                const num = Number(value);
                if (num < min || num > max) {
                    return { valid: false, message: `请输入${min}到${max}之间的数值` };
                }
                return { valid: true };
            },

            // 密码强度
            password: (value) => {
                if (value.length < 8) {
                    return { valid: false, message: '密码长度不能少于8位' };
                }
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return { valid: false, message: '密码必须包含大小写字母和数字' };
                }
                return { valid: true };
            },

            // URL
            url: (value) => {
                try {
                    new URL(value);
                    return { valid: true };
                } catch {
                    return { valid: false, message: '请输入有效的URL地址' };
                }
            },

            // IP地址
            ip: (value) => {
                const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if (!ipRegex.test(value)) {
                    return { valid: false, message: '请输入有效的IP地址' };
                }
                return { valid: true };
            },

            // 身份证号
            idCard: (value) => {
                const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!idCardRegex.test(value)) {
                    return { valid: false, message: '请输入有效的身份证号码' };
                }
                return { valid: true };
            },

            // 确认密码
            confirmPassword: (value, originalPassword) => {
                if (value !== originalPassword) {
                    return { valid: false, message: '两次输入的密码不一致' };
                }
                return { valid: true };
            }
        },

        /**
         * 验证单个字段
         * @param {*} value - 字段值
         * @param {string|Array|Object} rules - 验证规则
         * @returns {Object} 验证结果
         */
        validate(value, rules) {
            // 如果是字符串,转换为规则对象
            if (typeof rules === 'string') {
                rules = [rules];
            }

            // 如果是数组,转换为规则对象数组
            if (Array.isArray(rules)) {
                rules = rules.map(rule => typeof rule === 'string' ? { type: rule } : rule);
            }

            // 如果是单个规则对象,转换为数组
            if (!Array.isArray(rules)) {
                rules = [rules];
            }

            // 逐个验证
            for (const rule of rules) {
                const ruleType = typeof rule === 'string' ? rule : rule.type;
                const ruleParams = rule.params || [];

                let result;
                if (typeof this.rules[ruleType] === 'function') {
                    result = this.rules[ruleType](value, ...ruleParams);
                } else {
                    console.warn(`验证规则 "${ruleType}" 不存在`);
                    continue;
                }

                if (!result.valid) {
                    return {
                        valid: false,
                        message: rule.message || result.message
                    };
                }
            }

            return { valid: true };
        },

        /**
         * 验证表单
         * @param {string} formId - 表单ID
         * @param {Object} fieldRules - 字段验证规则配置
         * @returns {Object} 验证结果
         */
        validateForm(formId, fieldRules = {}) {
            const form = document.getElementById(formId);
            if (!form) {
                console.error(`表单 ${formId} 不存在`);
                return { valid: false, errors: {} };
            }

            const errors = {};
            let isValid = true;

            // 遍历所有需要验证的字段
            Object.keys(fieldRules).forEach(fieldName => {
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (!field) {
                    console.warn(`字段 ${fieldName} 不存在`);
                    return;
                }

                const value = field.value.trim();
                const rules = fieldRules[fieldName];

                // 验证字段
                const result = this.validate(value, rules);

                if (!result.valid) {
                    isValid = false;
                    errors[fieldName] = result.message;

                    // 显示错误样式
                    this._showFieldError(field, result.message);
                } else {
                    // 清除错误样式
                    this._clearFieldError(field);
                }
            });

            return {
                valid: isValid,
                errors
            };
        },

        /**
         * 显示字段错误
         * @private
         */
        _showFieldError(field, message) {
            field.classList.add('error');

            // 查找或创建错误消息元素
            let errorElement = field.parentElement.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentElement.appendChild(errorElement);
            }

            errorElement.textContent = message;
            errorElement.style.display = 'block';
        },

        /**
         * 清除字段错误
         * @private
         */
        _clearFieldError(field) {
            field.classList.remove('error');

            const errorElement = field.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        },

        /**
         * 清除所有字段错误
         * @param {string} formId - 表单ID
         */
        clearErrors(formId) {
            const form = document.getElementById(formId);
            if (!form) return;

            form.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });

            form.querySelectorAll('.field-error').forEach(errorElement => {
                errorElement.style.display = 'none';
            });
        },

        /**
         * 添加实时验证
         * @param {string} formId - 表单ID
         * @param {Object} fieldRules - 字段验证规则
         */
        addRealTimeValidation(formId, fieldRules) {
            const form = document.getElementById(formId);
            if (!form) return;

            Object.keys(fieldRules).forEach(fieldName => {
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (!field) return;

                const rules = fieldRules[fieldName];

                // 失去焦点时验证
                field.addEventListener('blur', () => {
                    const value = field.value.trim();
                    const result = this.validate(value, rules);

                    if (!result.valid) {
                        this._showFieldError(field, result.message);
                    } else {
                        this._clearFieldError(field);
                    }
                });

                // 输入时清除错误
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        this._clearFieldError(field);
                    }
                });
            });
        },

        /**
         * 获取表单数据
         * @param {string} formId - 表单ID
         * @returns {Object} 表单数据对象
         */
        getFormData(formId) {
            const form = document.getElementById(formId);
            if (!form) return {};

            const formData = new FormData(form);
            const data = {};

            // 处理普通字段
            formData.forEach((value, key) => {
                // 处理多选框
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            });

            // 处理checkbox(未选中的情况)
            form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                if (!checkbox.name) return;

                if (!(checkbox.name in data)) {
                    data[checkbox.name] = false;
                }

                if (checkbox.checked) {
                    data[checkbox.name] = true;
                }
            });

            return data;
        },

        /**
         * 设置表单数据
         * @param {string} formId - 表单ID
         * @param {Object} data - 数据对象
         */
        setFormData(formId, data) {
            const form = document.getElementById(formId);
            if (!form) return;

            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (!field) return;

                const value = data[key];

                if (field.type === 'checkbox') {
                    field.checked = Boolean(value);
                } else if (field.type === 'radio') {
                    if (field.value === String(value)) {
                        field.checked = true;
                    }
                } else if (field.tagName === 'SELECT') {
                    field.value = value;
                } else {
                    field.value = value || '';
                }
            });
        },

        /**
         * 重置表单
         * @param {string} formId - 表单ID
         */
        resetForm(formId) {
            const form = document.getElementById(formId);
            if (!form) return;

            form.reset();
            this.clearErrors(formId);
        }
    };

    // 导出到全局app对象
    app.utils = app.utils || {};
    app.utils.validator = Validator;

})(window.app);
