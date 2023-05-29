import db from "../models/index";
require('dotenv').config();
import dateFormat, { masks } from "dateformat";
import moment from 'moment'
import { sortObject } from "../utils/fn";
const sequelize = require("sequelize");
const { Op } = require("sequelize");

export const createPaymentUrlService = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let amount = req.body.amount
            let bankCode = req.body.bankCode;
            const { id } = req.user

            if (!amount || !id) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi'
                })
            } else {
                let date = new Date();
                let createDate = dateFormat(date, 'yyyymmddHHmmss');
                let orderId = dateFormat(date, 'HHmmss');

                let ipAddr = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

                let tmnCode = process.env.VNPAY_MERCHANT;
                let secretKey = process.env.VNPAY_SECURE_SECRET;
                let vnpUrl = process.env.VNPAY_PAYMENT_GATEWAY
                let returnUrl = process.env.VNPAY_RETURN_URL

                let currCode = 'VND';
                let vnp_Params = {};
                let orderInfo = 'Thanh toan cho ma GD:' + orderId

                vnp_Params['vnp_Version'] = '2.1.0';
                vnp_Params['vnp_Command'] = 'pay';
                vnp_Params['vnp_TmnCode'] = tmnCode;
                vnp_Params['vnp_Locale'] = 'vn';
                vnp_Params['vnp_CurrCode'] = currCode;
                vnp_Params['vnp_TxnRef'] = orderId;
                vnp_Params['vnp_OrderInfo'] = orderInfo;
                vnp_Params['vnp_OrderType'] = 'other';
                vnp_Params['vnp_Amount'] = amount * 100;
                vnp_Params['vnp_ReturnUrl'] = returnUrl;
                vnp_Params['vnp_IpAddr'] = ipAddr;
                vnp_Params['vnp_CreateDate'] = createDate;

                if (bankCode !== null && bankCode !== '' && bankCode !== undefined) {
                    vnp_Params['vnp_BankCode'] = bankCode;
                }

                vnp_Params = sortObject(vnp_Params);
                let querystring = require('qs');
                let signData = querystring.stringify(vnp_Params, { encode: false });
                let crypto = require("crypto");
                let hmac = crypto.createHmac("sha512", secretKey);
                let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
                vnp_Params['vnp_SecureHash'] = signed;
                vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

                const payment = await db.Payment.create({
                    id: orderId,
                    userId: id,
                    amount: amount,
                    paymentDate: createDate,
                    paymentInfo: orderInfo,
                    statusCode: 'S7'
                })

                resolve({
                    err: 0,
                    msg: 'Thành công',
                    vnpUrl,
                    payment
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const paymentReturnService = (params, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let querystring = require('qs');
            let vnp_Params = querystring.parse(params);
            let secureHash = vnp_Params['vnp_SecureHash'];
            let orderId = vnp_Params['vnp_TxnRef'];
            let rspCode = vnp_Params['vnp_ResponseCode'];
            let amount = +vnp_Params['vnp_Amount'] / 100;

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let tmnCode = process.env.VNPAY_MERCHANT;
            let secretKey = process.env.VNPAY_SECURE_SECRET;


            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            let payment = await db.Payment.findOne({
                where: {
                    id: orderId
                },
                raw: false,
            })

            if (!payment) {
                resolve({
                    code: '01',
                    msg: 'Payment not found'
                })
            } else {
                if (secureHash === signed) {
                    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                    if (payment.id === orderId) {
                        if (+payment.amount === +amount) {
                            if (payment.statusCode === 'S7') {
                                if (rspCode == '00') {
                                    payment.statusCode = 'S8'
                                    await payment.save()

                                    let user = await db.User.findOne({
                                        where: {
                                            id
                                        },
                                        raw: false
                                    })

                                    user.balance += amount
                                    await user.save()

                                    resolve({
                                        code: '00',
                                        msg: 'Success',
                                        payment
                                    })
                                } else {
                                    payment.statusCode = 'S9'
                                    await payment.save()
                                    resolve({
                                        code: '00',
                                        msg: 'Success',
                                        payment
                                    })
                                }
                            } else {
                                resolve({
                                    code: '02',
                                    msg: 'This order has been updated to the payment status'
                                })
                            }
                        } else {
                            resolve({
                                code: '04',
                                msg: 'Amount invalid'
                            })
                        }
                    }
                } else {
                    resolve({
                        msg: 'success',
                        code: '97'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const paymentHistoryService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi'
                })
            } else {
                const history = await db.Payment.findAll({
                    where: {
                        userId: id
                    },
                    order: [['createdAt', 'DESC']]
                })
                resolve({
                    err: 0,
                    msg: 'Thành công',
                    history
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const getPaymentSuccessService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const payments = await db.Payment.findAll({
                where: {
                    statusCode: 'S8'
                }
            })
            resolve({
                err: 0,
                msg: 'Thành công',
                payments
            })
        } catch (e) {
            reject(e);
        }
    })
}

export const getTotalPaymentService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await db.Post.findAll();
            if (posts && posts.length > 0) {
                let payments = posts.reduce((total, obj) => {
                    let priceOrder = obj.priceOrder
                    let totalDay = + moment(obj.expiredAt).diff(moment(obj.createdAt), 'days');
                    let result = priceOrder * totalDay;
                    return total + result;
                }, 0);

                resolve({
                    err: 0,
                    msg: "Thành công",
                    payments
                })
            } else {
                resolve({
                    err: 0,
                    msg: "Thành công",
                    payments: 0
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const getPaymentByMonthService = (categoryCode, month, year) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (categoryCode) queries.categoryCode = categoryCode
        try {
            if (!month && !year) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const posts = await db.Post.findAll({
                    where: sequelize.and(
                        sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('createdAt')), year),
                        sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('createdAt')), month),
                        queries
                    ),
                });

                if (posts && posts.length > 0) {
                    let payments = posts.reduce((total, obj) => {
                        let order = obj.order === 3 ? 20000 : obj.order === 2 ? 10000 : 2000;
                        let totalDay = + moment(obj.expiredAt).diff(moment(obj.createdAt), 'days');
                        let result = order * totalDay;
                        return total + result;
                    }, 0);

                    resolve({
                        err: 0,
                        msg: "Thành công",
                        payments
                    })
                } else {
                    resolve({
                        err: 0,
                        msg: "Thành công",
                        payments: 0
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET TOTAL PAYMENT BY MONTH ADMIN
export const getTotalPaymentByMonthService = (categoryCode) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (categoryCode) queries.categoryCode = categoryCode
        try {
            const totalPayments = [];
            const firstMonth = (new Date(new Date().getFullYear(), 0));
            while (firstMonth.getMonth() <= new Date().getMonth()) {
                totalPayments.push({ month: moment(moment.utc(firstMonth)).local().format('MM/YYYY'), total: 0 });
                firstMonth.setMonth(firstMonth.getMonth() + 1)
            }

            const posts = await db.Post.findAll({
                raw: true,
                where: queries,
                attributes: ['createdAt', 'expiredAt', 'order', 'priceOrder']
            });

            // Lấy ra tất cả bài đăng theo ngày kèm giá tiền và số ngày
            posts.forEach(post => {
                post.totalDay = + moment(post.expiredAt).diff(moment(post.createdAt), 'days');
            })

            // Tính tổng tiền theo tháng rồi gộp lại
            const totalsByMonthYear = [];
            posts.forEach(obj => {
                const createdAt = new Date(obj.createdAt);
                const month = String(createdAt.getMonth() + 1).padStart(2, '0');; // Tháng bắt đầu từ 0, nên cần +1 để đúng tháng trong năm
                const year = createdAt.getFullYear();
                const key = `${month}/${year}`;

                const existingObj = totalsByMonthYear.find(item => item.month === key);
                if (existingObj) {
                    existingObj.total += obj.priceOrder * obj.totalDay;
                } else {
                    totalsByMonthYear.push({
                        month: key,
                        total: obj.priceOrder * obj.totalDay
                    });
                }
            });

            totalsByMonthYear.forEach(obj => {
                const resultItem = totalPayments.find(item => item.month === obj.month);
                if (resultItem) {
                    resultItem.total = obj.total;
                }
            });


            resolve({
                err: totalPayments ? 0 : 1,
                msg: totalPayments ? "Thành công" : "Không lấy được ",
                totalPayments
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET TOTAL PAYMENT BY DAY ADMIN
export const getTotalPaymentByDayService = (categoryCode, startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queries = {}
            if (categoryCode) queries.categoryCode = categoryCode
            if (startDate && endDate) {
                queries.createdAt =
                {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate),
                }
            }
            // Tạo mảng chứa các ngày trong khoảng thời gian cho trước
            const paymentsDay = [];
            let currentDate = new Date(new Date(startDate).getTime());
            while (currentDate <= new Date(endDate)) {
                paymentsDay.push({ date: moment(moment.utc(currentDate)).local().format('DD/MM'), total: 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const posts = await db.Post.findAll({
                raw: true,
                where: queries,
                attributes: ['createdAt', 'expiredAt', 'order', 'priceOrder']
            });

            // Lấy ra tất cả bài đăng theo ngày kèm giá tiền và số ngày
            posts.forEach(post => {
                post.totalDay = + moment(post.expiredAt).diff(moment(post.createdAt), 'days');
            })

            const totalsByDay = [];
            posts.forEach(obj => {
                const createdAt = new Date(obj.createdAt);
                const month = String(createdAt.getMonth() + 1).padStart(2, '0');; // Tháng bắt đầu từ 0, nên cần +1 để đúng tháng trong năm
                const day = String(createdAt.getDate()).padStart(2, '0')
                const key = `${day}/${month}`;

                const existingObj = totalsByDay.find(item => item.date === key);
                if (existingObj) {
                    existingObj.total += obj.priceOrder * obj.totalDay;
                } else {
                    totalsByDay.push({
                        date: key,
                        total: obj.priceOrder * obj.totalDay
                    });
                }
            });

            totalsByDay.forEach(obj => {
                const resultItem = paymentsDay.find(item => item.date === obj.date);
                if (resultItem) {
                    resultItem.total = obj.total;
                }
            });

            resolve({
                err: paymentsDay ? 0 : 1,
                msg: paymentsDay ? "Thành công" : "Không lấy được bài đăng",
                paymentsDay
            })
        } catch (e) {
            reject(e);
        }
    })
}
