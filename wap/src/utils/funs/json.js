import { isEmpty } from './types';
//将Json对象转换成Json字符串
export function serializeObject(jsonObj) {
    try {
        return JSON.stringify(jsonObj);
    } catch {
        return null;
    }
}

//将Json字符串转换成Json对象
export function deSerializeObject(jsonStr) {
    if (isEmpty(jsonStr)) {
        return null;
    }
    try {
        return JSON.parse(jsonStr);
    } catch {
        return null;
    }
}