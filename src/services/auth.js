import db from "../models/index";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid'
import * as mailService from '../services/mailer';
require('dotenv').config()

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const registerService = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    phone: body.phone,
                },
                raw: true
            })
            if (user) {
                resolve({
                    err: 1,
                    msg: 'Số điện thoại đã được sử dụng'
                })
            } else {
                await db.User.create({
                    id: v4(),
                    name: body.name,
                    phone: body.phone,
                    email: body.email,
                    role: body.role,
                    zalo: body.phone,
                    password: hashPassword(body.password),
                    statusCode: 'S5',
                    avatar: 'https://phongtro123.com/images/default-user.png'
                })

                await mailService.sendMailRegister(body.email, body.name)

                resolve({
                    err: 0,
                    msg: "Đăng ký tài khoản thành công",
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const loginService = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    phone: body.phone
                },
                raw: true,
            })
            if (user) {
                let check = bcrypt.compareSync(body.password, user.password);
                if (check) {
                    if (user.statusCode === 'S5') {
                        const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, process.env.SECRET_KEY, { expiresIn: "30d" })
                        resolve({
                            err: 0,
                            msg: 'Đăng nhập thành công',
                            token
                        })
                    } else {
                        resolve({
                            err: 1,
                            msg: 'Tài khoản của bạn đã bị khóa. Liên hệ với quản trị viên để biết thêm chi tiết',
                        })
                    }
                } else {
                    resolve({
                        err: 2,
                        msg: 'Sai số điện thoại hoặc mật khẩu'
                    })
                }
            } else {
                resolve({
                    err: 3,
                    msg: 'Người dùng không tồn tại'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const changePasswordService = (id, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = body
            if (!id || !oldPassword || !newPassword || !confirmPassword) {
                resolve({
                    err: 1,
                    msg: 'Bạn phải điển đầy đủ thông tin',
                })
            } else {
                const user = await db.User.findOne({
                    where: {
                        id: id
                    },
                })
                if (user) {
                    let check = bcrypt.compareSync(oldPassword, user.password);
                    if (check) {
                        if (newPassword !== confirmPassword) {
                            resolve({
                                err: 2,
                                msg: 'Mật khẩu nhập lại không trùng khớp',
                            })
                        } else {
                            user.password = hashPassword(newPassword)
                            await user.save()
                            resolve({
                                err: 0,
                                msg: 'Đổi mật khẩu thành công',
                            })
                        }
                    } else {
                        resolve({
                            err: 3,
                            msg: 'Mật khẩu cũ không đúng'
                        })
                    }
                } else {
                    resolve({
                        err: 4,
                        msg: 'Người dùng không tồn tại'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const forgotPasswordService = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    phone: body.phone,
                    email: body.email,
                },
                raw: true
            })
            if (!user) {
                resolve({
                    err: 1,
                    msg: "Không tìm thấy người dùng"
                })
            } else {
                const token = jwt.sign({ id: user.id, phone: user.phone, email: user.email }, process.env.SECRET_KEY, { expiresIn: "15m" })
                const link = `${process.env.CLIENT_URL}/reset-password/${token}`

                // Send MAIL
                await mailService.sendMailService(user.email, user.name, link)

                resolve({
                    err: 0,
                    msg: 'Link thay đổi mật khẩu đã được gửi tới email của bạn'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

export const resetPasswordService = (token, password, confirmPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token || !password || !confirmPassword) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi"
                })
            } else {
                jwt.verify(token, process.env.SECRET_KEY, async (err, userData) => {
                    if (err) {
                        resolve({
                            err: 2,
                            msg: "Token hết hạn"
                        })
                    } else {
                        const user = await db.User.findOne({
                            where: {
                                id: userData.id
                            }
                        })
                        if (!user) {
                            resolve({
                                err: 2,
                                msg: "Không tìm thấy người dùng"
                            })
                        } else {
                            if (password !== confirmPassword) {
                                resolve({
                                    err: 3,
                                    msg: "Nhập lại mật khẩu không đúng"
                                })
                            } else {
                                user.password = hashPassword(password)
                                await user.save()
                                resolve({
                                    err: 0,
                                    msg: "Cập nhật mật khẩu thành công"
                                })
                            }
                        }
                    }
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}




