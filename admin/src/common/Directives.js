import store from '../store'

function preventInput(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

export default {
    install(Vue) {
        /**
         * 1.在标签上添加v-editButton="accidentLevel"指令  
         * 2.参数accidentLevel为打开编辑框时接口获取的数据
         * 3.将打开编辑框时接口获取的数据存储到store中作为第一次初始数据（that.$store.state.btndDatas = JSON.stringify(res);）
         * 问题：编辑弹框中出现类似于客户管理模块中的联系人信息和银行账户信息列表时，需要改一下插值。
         * */
        Vue.directive('editButton', {
            update: function (el, binding, vnode) {
                if (JSON.stringify(binding.value) == store.state.btndDatas) {
                    el.setAttribute('disabled', true);
                    el.classList.add("disabledButton");
                } else {
                    el.removeAttribute('disabled');
                    el.classList.remove("disabledButton");
                }
                if (store.state.btndDatas && store.state.btndDatas.rules) {
                    const rawData = binding.value;
                    const rules = store.state.btndDatas.rules
                    let requiredNumber = 0; // 必填项总计数
                    let requiredCount = 0; // 必填项已填写计数
                    Object.keys(rules).forEach(key => {
                        const rule = rules[key][0]
                        if (rule.required) {
                            requiredNumber++;
                            if ((rawData[key] || rawData[key] === 0) && rule.validator === undefined) {
                                requiredCount++;
                            } else if (rawData[key]) {
                                rule.validator(undefined, rawData[key], (bool) => {
                                    if (!bool) {
                                        requiredCount++;
                                    }
                                })
                            }
                        }
                    })
                    vnode.componentInstance.progress = requiredCount / requiredNumber * 100;
                }
            },
        });

        /**调用示例
        * 可以输入任意数字
        * <el-input
        *   v-only-number
        *   v-model="price"
        * />
        * 最大两位小数
        * <el-input
        *   v-only-number="{ min: 0, max: 100, precision: 2 }"
        *   v-model="price"
        * />
        * 只允许输入整数
        * <input
        *   v-only-number="{ min: -10, max: 100, precision: 0 }"
        *   v-model="price"
        * />
        * */
        Vue.directive('only-number', {
            inserted(el, vDir, vNode) {
                // vDir.value 有参数的指令
                // 设置默认参数
                let defaultOptions = {
                    max: Number.MAX_VALUE,
                    min: -Number.MAX_VALUE,
                    precision: "noLimit"
                }, content, re = /\d|\.|-/, inputKey;
                vDir.value = vDir.value || {};
                vDir.value = Object.assign(defaultOptions, vDir.value);

                // 设置输入框的值,触发input事件,改变v-model绑定的值
                const setVal = val => {
                    if (vNode.componentInstance) {
                        vNode.componentInstance.$emit('input', val);
                    } else {
                        el.value = val;
                        el.dispatchEvent(new Event('input'));
                    }
                };

                // 按键按下=>只允许输入 数字/小数点/减号
                el.addEventListener('keypress', event => {
                    const e = event || window.event;

                    // 获取当前输入的字符
                    inputKey = String.fromCharCode(typeof e.charCode === 'number' ? e.charCode : e.keyCode);

                    // 获取所有输入的字符（获取不到最后一个，因为keypress时字符还没有填充到输入框中）
                    content = e.target.value;

                    // 如果是除数字、小数点、减号外的字符，阻止此次输入
                    if (!re.test(inputKey) && !e.ctrlKey) {
                        preventInput(e);
                    }

                    // 如果已有小数点,再次输入小数点,阻止此次输入
                    if (content.indexOf('.') >= 0 && inputKey === '.') {
                        preventInput(e);
                    }

                    // 如果已有减号,再次输入减号,阻止此次输入
                    if (content.indexOf('-') >= 0 && inputKey === '-') {
                        preventInput(e);
                    }
                });

                // 按键弹起=>并限制最大最小
                el.addEventListener('keyup', event => {
                    const e = event || window.event;
                    content = parseFloat(e.target.value);

                    // 英文输入法状态下，如果输入的是除数字、小数点、减号外的字符，则置为0
                    // 中文输入法状态下，此操作无效
                    if (!content && !re.test(inputKey)) {
                        content = 0.00;
                    }

                    let arg_max = '';
                    let arg_min = '';

                    if (vDir.value) {
                        arg_max = parseFloat(vDir.value.max);
                        arg_min = parseFloat(vDir.value.min);
                    }

                    // 超出最大范围，取最大值
                    if (arg_max !== undefined && content > arg_max) {
                        setVal(arg_max);
                        content = arg_max;
                    }

                    // 超出最小限制，取最小值
                    if (arg_min !== undefined && content < arg_min) {
                        setVal(arg_min);
                        content = arg_min;
                    }
                });

                // 失去焦点=>保留指定位小数，去除其他字符
                el.addEventListener('focusout', event => {
                    const e = event || window.event;

                    // 可以输入空串
                    if (e.target.value == "") {
                        content = "";
                        // 去除其他字符
                    } else {
                        content = parseFloat(e.target.value);
                        !content && (content = 0.00);
                    }

                    // 默认保留至整数
                    let arg_precision = vDir.value.precision;
                    if (arg_precision != "noLimit" && typeof arg_precision == "number" && typeof content == "number") {
                        content = content.toFixed(arg_precision);
                    }

                    setVal(content);
                })
            }
        });

        /***
         *  节流 每单位时间可触发一次
         *  第一次瞬间触发，最后一次不管是否达到间隔时间依然触发
         * 【考虑到input的change事件】
         *  @param {?Number|300} time - 间隔时间
         *  @param {Function} fn - 执行事件
         *  @param {?String|"click"} event - 事件类型 例："click"
         *  @param {Array} binding.value - [fn,event,time]
         *  例：<el-button v-throttle="[reset,`click`,300]">刷新</el-button>
         *  传递参数则：<el-button v-throttle="[()=>reset(param),`click`,300]">刷新</el-button>
         */
        Vue.directive('throttle', {
            inserted: function (el, binding) {
                let [fn, event = 'click', time = 300] = binding.value
                let timer, timer_end
                el.addEventListener(event, () => {
                    if (timer) {
                        clearTimeout(timer_end)
                        return (timer_end = setTimeout(() => fn(), time))
                    }
                    fn()
                    timer = setTimeout(() => (timer = null), time)
                })
            },
        })

        /**
         * 直接添加指令  v-el-select-input
         * 可输入的select下拉框，在输入框失去焦点时，默认选中所输入的条目，不用再进行选择
         * */
        Vue.directive('elSelectInput', {
            inserted(el, vDir, vNode) {
                if (el.tagName.toLowerCase() !== 'input') {
                    el = el.getElementsByTagName('input')[0];
                }
                el.addEventListener('blur', function () {
                    if (vNode.componentInstance && el.value) {
                        vNode.componentInstance.$emit('input', el.value);
                    }
                })

            }
        });

        /**
         * 直接添加指令  v-select-maxLength="20"
         * 可输入的select下拉框，限制输入长度
         * */
        Vue.directive('select-maxLength', {
            inserted(el, vDir, vNode) {
                let cusInput = el.children[0].children[0];
                if (cusInput.tagName == "INPUT") {
                    if (!cusInput.hasAttribute('maxLength')) {
                        cusInput.maxLength = vDir.value
                    }
                }
            }
        });

        /**
         * 自动触发点击事件
         * */
        Vue.directive('trigger', {
            inserted(el,binging){
                el.click();
            }
        });
    }
}


