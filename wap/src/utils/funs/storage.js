import { serializeObject, deSerializeObject } from './json';
import { isEmpty } from './types';
//将数据存储到Cookie中
export function setCookie(key, data) {
    document.cookie = key + "=" + serializeObject(data) + ";path=/";
}
//获取Cookie中的数据
export function getCookie(key) {
    let name = key + "=";
    let allCookieStr = decodeURIComponent(document.cookie);
    let cookieArr = allCookieStr.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let c = cookieArr[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return deSerializeObject(c.substring(name.length, c.length));
        }
    }
    return null;
}
//移除Cookie中的数据
export function removeCookie(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}
//将数据存储到Session中
export function setSession(key, data) {
    sessionStorage.setItem(key, serializeObject(data));
}
//获取Session中的数据
export function getSession(key) {
    let strData = sessionStorage.getItem(key);
    if (isEmpty(strData)) {
        return null;
    }
    return deSerializeObject(strData);
}
//移除Session中的数据
export function removeSession(key) {
    sessionStorage.removeItem(key);
}
//将数据存储到LocalStorage中
export function setLocalStorage(key, data) {
    localStorage.setItem(key, serializeObject(data));
}
//获取LocalStorage中的数据
export function getLocalStorage(key) {
    let strData = localStorage.getItem(key);
    if (isEmpty(strData)) {
        return null;
    }
    return deSerializeObject(strData);
}
//移除LocalStorage中的数据
export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}