//根据UTC时间返回本地日期
export function getLocalDate(utcDate) {
    if (!utcDate) {
        return "";
    }

    let d = new Date(utcDate);
    let result = "";

    result += d.getFullYear() + "-";

    if (d.getMonth() < 9) {
        result += "0" + (d.getMonth() + 1) + "-";
    } else {
        result += (d.getMonth() + 1) + "-";
    }

    if (d.getDate() < 10) {
        result += "0" + d.getDate();
    } else {
        result += d.getDate();
    }

    return result;
}

//根据UTC时间返回本地时间
export function getLocalTime(utcDate) {
    if (!utcDate) {
        return "";
    }

    let d = new Date(utcDate);
    let result = "";

    if (d.getHours() < 10) {
        result += "0" + d.getHours() + ":";
    } else {
        result += d.getHours() + ":";
    }

    if (d.getMinutes() < 10) {
        result += "0" + d.getMinutes() + ":";
    } else {
        result += d.getMinutes() + ":";
    }

    if (d.getSeconds() < 10) {
        result += "0" + d.getSeconds();
    } else {
        result += d.getSeconds();
    }

    return result;
}

//根据UTC时间返回本地完整时间
export function getLocalDateTime(utcDate) {
    if (!utcDate) {
        return "";
    }

    let d = new Date(utcDate);
    let result = "";

    result += d.getFullYear() + "-";

    if (d.getMonth() < 9) {
        result += "0" + (d.getMonth() + 1) + "-";
    } else {
        result += (d.getMonth() + 1) + "-";
    }

    if (d.getDate() < 10) {
        result += "0" + d.getDate() + " ";
    } else {
        result += d.getDate() + " ";
    }

    if (d.getHours() < 10) {
        result += "0" + d.getHours() + ":";
    } else {
        result += d.getHours() + ":";
    }

    if (d.getMinutes() < 10) {
        result += "0" + d.getMinutes() + ":";
    } else {
        result += d.getMinutes() + ":";
    }

    if (d.getSeconds() < 10) {
        result += "0" + d.getSeconds();
    } else {
        result += d.getSeconds();
    }

    return result;
}

//根据参数格式化时间
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
            );
        }
    }
    return fmt;
}
// 计算两个日期之间的工时
export function timeMath(dt1, dt2) {
    var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
    var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
    var h = Math.floor(interval / 3600);
    return h
}