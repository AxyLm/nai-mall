function _toArray() {
    let arr = [];
    for (let key in this._properties) {
        if (this._properties.hasOwnProperty(key)) {
            arr.push(this._properties[key]);
        }
    }
    return arr;
}

function _toJson(lang) {
    let json = {};
    for (let key in this._properties) {
        if (this._properties.hasOwnProperty(key)) {
            if (lang) {
                json[key] = this._properties[key]['text_' + lang];
            } else {
                json[key] = this._properties[key].text;
            }
        }
    }
    return json;
}

function _get(id) {
    if (this._properties[id]) {
        return this._properties[id]
    } else {
        return { text: "", value: null };
    }
}

export default {
    // 是否
    Is_Status: {
        _properties: {
            0: { text: "否", value: 0, color: "colr-error"},
            1: { text: "是", value: 1, color: "colr-success" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 删除状态
    Delete_Status: {
        _properties: {
            0: { text: "禁用", value: 0, color: "colr-error"},
            1: { text: "启用", value: 1, color: "colr-success" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 审核状态
    Audit_Status: {
        _properties: {
            0: { text: "未提交", value: 0, color: "colr-info"},
            1: { text: "审核中", value: 1, color: "colr-warning" },
            2: { text: "已通过", value: 2, color: "colr-success" },
            3: { text: "被拒绝", value: 3, color: "colr-error" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 订单状态
    Order_Status: {
        _properties: {
            0: { text: "已提交", value: 0, color: "colr-info" },
            1: { text: "已付款", value: 1, color: "colr-warning" },
            2: { text: "已发货", value: 2, color: "colr-warning" },
            3: { text: "已确认", value: 3, color: "colr-primary" },
            4: { text: "已评价", value: 4, color: "colr-success" },
            5: { text: "已关闭", value: 5, color: "colr-error" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 支付方式
    Pay_Type: {
        _properties: {
            1: { text: "支付宝", value: 1, color: "colr-primary" },
            2: { text: "微信", value: 2, color: "colr-success" },
            3: { text: "银行卡", value: 3, color: "colr-warning" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 发票抬头类型
    Fapiao_Type: {
        _properties: {
            0: { text: "个人", value: 0, color: "colr-primary" },
            1: { text: "公司", value: 1, color: "colr-success" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 发货类型
    Delivery_Type: {
        _properties: {
            0: { text: "邮寄", value: 0, color: "colr-primary" },
            1: { text: "自提", value: 1, color: "colr-success" },
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    },
    // 快递公司
    Delivery_Compay: {
        _properties: {
            0: { text: "顺丰", value: 0 },
            1: { text: "圆通", value: 1 },
            2: { text: "中通", value: 2 },
            3: { text: "申通", value: 3 },
            4: { text: "韵达", value: 4 },
            5: { text: "百世", value: 5 },
            6: { text: "极兔", value: 6 },
            7: { text: "邮政", value: 7 },
            8: { text: "天天", value: 8 }
        },
        ToArray: function() {
            return _toArray.call(this);
        },
        ToJSON: function(lang) {
            return _toJson.call(this, lang);
        },
        Get: function(id) {
            return _get.call(this, id);
        }
    }
}