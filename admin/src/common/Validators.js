export default {
    checkName(apiKey, _SearchKey, _SearchTip, oldKey) {
        let searchKey = '_NameEqual',
            errorTip = '名称已存在，请重新输入！',
            emptyTip = '名称不能为空！'
        if (_SearchKey) {
            searchKey = _SearchKey;
            errorTip = '该属性已存在，请重新输入！',
                emptyTip = '该属性不能为空！'
        }
        if (_SearchTip) {
            errorTip = _SearchTip + "已存在,请重新输入！";
            emptyTip = _SearchTip + '不能为空！';
        }

        if (!oldKey) {
            oldKey = "oldName"
        }

        return function (rule, value, callback) {
            if (!value) {
                return callback(new Error(emptyTip))
            }
            if (this[oldKey] && value == this[oldKey]) {
                return callback()
            }
            this.$app.CallApi(this.$app.api[apiKey].GetCount, {
                data: {
                    [searchKey]: value,
                },
                success: (res) => {
                    if (res > 0) {
                        callback(new Error(errorTip))
                    } else {
                        callback()
                    }
                },
            })
        }
    },

    /**
     * 验证表单中输入的值在数据库中是否存在
     * @param {string} tableName 表名
     * @param {string} tips 提示信息
     * @param {string} field 特殊的字段名，不用带_
     */
    dbHas(tableName, tips, field) {
        if (!tableName || !tips) {
            new Error("未提供相应参数");
        }

        tips = tips + "已经存在，请重新输入！";

        return function (rule, value, callback) {
            let searchKey = "_" + rule.field;
            if (field) {
                searchKey = "_" + field;
            }

            if (this.old && this.old[rule.field] && value == this.old[rule.field]) {
                return callback();
            }
            this.$app.CallApi(this.$app.api[tableName].GetCount, {
                data: { [searchKey]: value },
                success: (res) => {
                    if (res > 0) {
                        return callback(new Error(tips));
                    } else {
                        return callback();
                    }
                }
            });
        }
    },

    checkPhone(rule, value, callback) {
        const telReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        const phoneReg = /^[0][0-9]{2,3}\-[0-9]{5,10}$/;
        if (value == '' || value == null) {
            callback()
        }
        if (telReg.test(value) || phoneReg.test(value)) {
            callback()
        } else {
            callback(new Error('电话号码格式不正确'))
        }
    },
    checkEmail(rule, value, callback) {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (value == '' || value == null) {
            callback()
        }
        if (mailReg.test(value)) {
            callback()
        } else {
            callback(new Error('请输入正确的邮箱格式'))
        }
    },
}
