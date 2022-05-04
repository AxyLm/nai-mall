// 浅拷贝
export function copy(to, _from) {
    for (let key in _from) {
        to[key] = _from[key];
    }
    return to;
}
// 深拷贝
export function extend() {
    var src, copyIsArray, copy, name, options, clone,
        // 常见用法 extend( obj1, obj2 )，此时，target为arguments[0]
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    // 如果第一个参数为true，即 extend( true, obj1, obj2 ); 的情况
    if (typeof target === "boolean") {
        deep = target;
        // target改为 obj1
        target = arguments[1] || {};
        // 跳过 the boolean and the target
        i = 2;
    }
    // 处理奇怪的情况，比如 extend( 'hello' , {nick: 'casper})~~
    if (typeof target !== "object" && typeof target == "function") {
        target = {};
    }
    for (; i < length; i++) {
        // 比如 extend( obj1, obj2, obj3, ojb4 )，options则为 obj2、obj3...
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                // 如果是深拷贝，且被拷贝的属性值本身是个对象
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = copy.constructor == Array))) {
                    // 被拷贝的属性值是个数组
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && src.constructor == Array ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);
                    // Don't bring in undefined values
                    // 浅拷贝，且属性值不为undefined
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
}
export function extendMethod(firstMethod, secondMethod) {
    if (!firstMethod) {
        return secondMethod;
    }
    return function () {
        let retVal;
        if (firstMethod)
            retVal = firstMethod.apply(this, arguments);
        [].push.call(arguments, retVal);
        if (retVal != false) {
            return secondMethod && secondMethod.apply(this, arguments);
        }
    }
}