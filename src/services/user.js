import db from "../models/index";
import moment from 'moment'
const { Op } = require("sequelize");
const sequelize = require("sequelize");

export const getUserService = (uId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    id: uId
                },
                raw: true,
                attributes: {
                    exclude: ['password']
                }
            })
            resolve({
                err: user ? 0 : 1,
                msg: user ? "Thành công" : "Không lấy được người dùng",
                user
            })
        } catch (e) {
            reject(e);
        }
    })
}

export const updateUserProfileService = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!payload.id) {
                resolve({
                    err: 1,
                    msg: "Thiếu mất gì đó rồi",
                })
            } else {
                const user = await db.User.findOne({
                    where: {
                        id: payload.id
                    }
                })
                if (!user) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy người dùng",
                    })
                } else {
                    user.name = payload.name
                    user.email = payload.email
                    user.fbUrl = payload.fbUrl
                    user.zalo = payload.zalo
                    user.role = payload.role
                    user.avatar = payload.avatar
                    user.statusCode = payload.status

                    await user.save()
                    resolve({
                        err: 0,
                        msg: "Cập nhật thông tin thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL USERS ADMIN
export const getUsersService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                raw: true,
                nest: true,
                attributes: {
                    exclude: ['password']
                },
                order: [['createdAt', 'DESC']]
            })
            resolve({
                err: users ? 0 : 1,
                msg: users ? "Thành công" : "Không lấy được người dùng",
                users
            })
        } catch (e) {
            reject(e);
        }
    })
}

// DELETE USER ADMIN
export const deleteUserService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const user = await db.User.findOne({
                    where: {
                        id: id,
                    }
                })
                if (!user) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy người dùng",
                    })
                } else {
                    await user.destroy()
                    resolve({
                        err: 0,
                        msg: "Xóa người dùng thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET COUNT USER BY MONTH ADMIN
export const getCountUserByMonthService = (status) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (status) queries.statusCode = status
        try {
            const userCounts = [];
            const firstMonth = (new Date(new Date().getFullYear(), 0));
            while (firstMonth.getMonth() <= new Date().getMonth()) {
                userCounts.push({ month: moment(moment.utc(firstMonth)).local().format('MM/YYYY'), count: 0 });
                firstMonth.setMonth(firstMonth.getMonth() + 1)
            }

            const results = await db.User.findAll({
                attributes: [
                    [sequelize.literal(`to_char("createdAt", 'MM/YYYY')`), 'month'],
                    [sequelize.fn('count', sequelize.col('id')), 'count']
                ],
                group: ['month'],
                raw: true,
                where: queries
            });
            results.forEach(user => {
                const resultItem = userCounts.find(item => item.month === user.month);
                if (resultItem) {
                    resultItem.count = user.count;
                }
            });
            resolve({
                err: userCounts ? 0 : 1,
                msg: userCounts ? "Thành công" : "Không lấy được người dùng",
                userCounts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET COUNT USER BY DAY ADMIN
export const getCountUserByDayService = (status, startDate, endDate, categoryCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queries = {}
            if (status) queries.statusCode = status
            if (categoryCode) queries.categoryCode = categoryCode
            if (startDate && endDate) {
                queries.createdAt =
                {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate),
                }
            }
            // Tạo mảng chứa các ngày trong khoảng thời gian cho trước
            const userCounts = [];
            let currentDate = new Date(new Date(startDate).getTime());
            while (currentDate <= new Date(endDate)) {
                userCounts.push({ date: moment(moment.utc(currentDate)).local().format('DD/MM'), count: 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            const results = await db.User.findAll({
                where: queries
            });

            results.forEach(user => {
                const userDate = moment(moment.utc(user.createdAt)).local().format('DD/MM');
                const resultItem = userCounts.find(item => item.date === userDate);
                if (resultItem) {
                    resultItem.count++;
                }
            });
            resolve({
                err: userCounts ? 0 : 1,
                msg: userCounts ? "Thành công" : "Không lấy được",
                userCounts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET USER BY MONTH ADMIN
export const getUserByMonthService = (status, month, year) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (status) queries.statusCode = status
        try {
            if (!month && !year) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const users = await db.User.findAll({
                    where: sequelize.and(
                        sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('createdAt')), year),
                        sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('createdAt')), month),
                        queries
                    ),
                });

                resolve({
                    err: users ? 0 : 2,
                    msg: users ? "Thành công" : "Không lấy được bài đăng",
                    users
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
