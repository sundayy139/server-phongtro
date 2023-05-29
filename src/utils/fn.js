require('dotenv').config()
const crypto = require('crypto');

const formatString = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\s/g, '');
    str = str.replace(/-/g, '');
    return str;
}

export const generateCode = (str) => {
    if (str) {
        const salt = crypto.randomBytes(16).toString('hex');

        const combinedString = salt + str;
        // Tạo một đối tượng băm dữ liệu MD5
        const md5 = crypto.createHash('md5');

        // Mã hóa chuỗi đầu vào bằng hàm băm MD5
        const hash = md5.update(combinedString).digest('hex');

        // Trả về 6 ký tự đầu tiên của chuỗi mã hóa
        return hash.substring(0, 6).toUpperCase();
    }
}

export const getNumberFromStringPrice = (string) => {
    let number = 0
    if (string.search("đồng/tháng") !== -1) {
        number = +string.match(/\d+/)[0] / Math.pow(10, 3)
    } else if (string.search("triệu/tháng") !== -1) {
        number = +string.match(/\d+/)[0]
    }
    return number
}


export const getNumberFromString = (string) => {
    let number = 0
    if (string.search("đồng/tháng") !== -1) {
        number = +string.match(/\d+/)[0] / Math.pow(10, 3)
    } else if (string.search("triệu/tháng") !== -1) {
        number = +string.split(' ')[0]
    }
    return number
}



export const getNumberFromStringAcreage = (string) => {
    return string = +string.replace(/^\D+/g, '').match(/\d+/)[0]
}

export const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}