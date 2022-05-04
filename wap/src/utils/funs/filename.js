//得到一个范围内的随机数
export function getRand(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}
//根据时间得到文件名yyyyMMddHHmmssfff+6位随机数
export function genFileName(file) {
    let d = new Date();
    let result = "";

    result += d.getFullYear();

    if (d.getMonth() < 9) {
        result += "0" + (d.getMonth() + 1);
    } else {
        result += (d.getMonth() + 1);
    }

    if (d.getDate() < 10) {
        result += "0" + d.getDate();
    } else {
        result += d.getDate();
    }

    if (d.getHours() < 10) {
        result += "0" + d.getHours();
    } else {
        result += d.getHours();
    }

    if (d.getMinutes() < 10) {
        result += "0" + d.getMinutes();
    } else {
        result += d.getMinutes();
    }

    if (d.getSeconds() < 10) {
        result += "0" + d.getSeconds();
    } else {
        result += d.getSeconds();
    }

    result += d.getMilliseconds();

    result += getRand(100000, 999999).toString();

    return result + file.name.substring(file.name.lastIndexOf("."));
}

//根据文件url返回文件名
export function getFileName(url) {
    return url.substring(url.lastIndexOf("/") + 1);
}

//根据文件url返回文件扩展名
export function getFileExtName(url) {
    return url.replace(/.+\./, '');
}