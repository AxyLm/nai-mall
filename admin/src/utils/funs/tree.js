/*
 * list查询下级路径
 * @param: {Array}          list         json Array
 * @param: {Number|String}  outterIdVal  当前分类的id值
 * @param: {String}         outterIdKey  当前分类的id键名
 * @return {Array}          返回当前分类的所有下级分类数组（元素为json数据）
 */
export function getPathFromOutter(list, outterIdVal, outterIdKey) {
    var paths = [];
    for (var i = 0; i < list.length; i++) {
        if (outterIdVal == list[i].parentID) {
            paths.push(list[i]);
            paths.push(...getPathFromOutter(list[i][outterIdKey], outterIdKey, list));
        }
    }
    return paths;
}

/*
 * list查询上级路径
 * @param: {Array}          list        json Array
 * @param: {Number|String}  innerIdVal  内层分类的id值
 * @param: {String}         innerIdKey  内层分类的id键名
 * @param: {String}         pathProp    路径组成元素的key
 * @return {Array}          返回当前分类的所有上级分类数组
 */
export function getPathFromInner(list, innerIdVal, innerIdKey, pathProp) {
    let paths = [], currentTypeJson;
    (function inner(innerIdVal) {
        currentTypeJson = list.filter(item => {
            return item[innerIdKey] == innerIdVal;
        })[0];
        paths.push(currentTypeJson[pathProp]);
        innerIdVal = currentTypeJson.parentID;
        innerIdVal != 0 && inner(innerIdVal);
    })(innerIdVal);
    return paths.reverse();
}

/*
 * list去重
 * @param: {Array}  list  json Array
 * @param: {String} key   唯一的key名，根据此键名进行去重
 * @return {Array} 返回去重后的新数组
 *  var temp = {};
    var result = [];
    totalDemo.map(function (item, index) {
        if(!temp[item.name]){
            result.push(item);
            temp[item.name] = true;
        }
    });
 */
export function uniqueList(list, key) {
    var result = [list[0]];
    for (var i = 1; i < list.length; i++) {
        var item = list[i];
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            result.push(item);
        }
    }
    return result;
}

/*
 * list转tree
 * @param: {Array}   list      json Array
 * @param: {String}  sidKey    记录的id键名
 * @param: {String}  pidKey    记录的指向父级的id键名
 * @param: {Boolean} keepOriginChildren  是否保留转换前每条记录的children字段
 * @return {Array}   返回tree数组
 */
export function toTree(list, sidKey, pidKey, keepOriginChildren) {
    !keepOriginChildren && list.forEach(function (item) {
        delete item.children;
    });

    var map = {};
    list.forEach(function (item) {
        map[item[sidKey] || item.autoID] = item;
    });

    var val = [];
    for (let i = 0; i < list.length; i++) {
        var parent = map[list[i][pidKey]];
        if (parent) {
            (parent.children || (parent.children = [])).push(list[i]);
        } else {
            val.push(list[i]);
        }
    }
    console.log(val);
    return val;
}

/*
 * tree查询
 * @param: {Array}  tree   json Array
 * @param: {Mixed}  value  要查询的值
 * @param: {String} key    要查询的值对应的键名
 * @param: {String} type   为single或list可忽略
 * @return {Object|Array}  当type为single或忽略时返回一条Object记录，为list时返回所有符合条件的数组
 */
export function findFromTree(tree, value, key, type) {
    var queen = [], list = [];
    queen = queen.concat(tree);
    while (queen.length) {
        var temp = queen.shift();
        if (temp.children) {
            queen = temp.children.concat(queen);
        }
        if (value == temp[key] && (type == "single" || !type)) {
            return temp;
        } else if (value == temp[key] && type == "list") {
            list.push(temp);
        }
    }
    if (type == "list") {
        return list;
    }
}

/*
 * tree删除
 * @param: {Array}  tree   json Array
 * @param: {Mixed}  value  要删除的值
 * @param: {String} key    要删除的值对应的键名
 * @return {Undefined}  
 */
export function delFromTree(tree, value, key) {
    var isDeleted = false;
    function deepDel(tree, value, key) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i].children && tree[i].children.length > 0) {
                deepDel(tree[i].children, value, key);
            }
            if (value === tree[i][key] || isDeleted) {
                isDeleted || tree.splice(i, 1);
                isDeleted = true;
                break;
            }
        }
    }
    deepDel(tree, value, key);
}

/*
 * tree转list
 * @param: {Array} tree json Array
 * @return {Array} 返回list数组
 */
export function toList(tree) {
    var queen = [], result = [];
    queen = queen.concat(tree);
    while (queen.length) {
        var temp = queen.shift();
        if (temp.children) {
            queen = temp.children.concat(queen);
            delete temp['children'];
        }
        result.push(temp);
    }
    return result;
}