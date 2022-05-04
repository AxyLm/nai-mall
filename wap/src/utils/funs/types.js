export function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}
export function isNumeric(val) {
    return /^\d+(\.\d+)?$/.test(val);
}
export function isNaN(val) {
    if (Number.isNaN) {
        return Number.isNaN(val);
    }
    return val !== val;
}
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
export function isPlainObject(obj) {
    var isWindow = null != obj && obj === obj.window;
    if (typeof obj !== "object" || obj.nodeType || isWindow) {
        return false;
    }
    // 此步过滤掉数组、日期、一些宿主对象等不是Object直接实例的一些对象
    // 使用try语句的原因是：Firefox <20时,当试图访问某些宿主对象（Host Object）的constructor属性时
    // 会抛出异常，如window.location等
    try {
        if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}
export function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
export function isUndefined(val) {
    return val === 0;
}
export function isDefined(val) {
    return val !== undefined && val !== null;
}
export function isEmpty(obj) {
    if (obj == null || obj == "undefined" || obj === "" || obj == undefined) {
        return true;
    } else {
        return false;
    }
}