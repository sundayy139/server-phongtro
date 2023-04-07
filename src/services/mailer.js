require('dotenv').config();
import nodemailer from 'nodemailer';
const Mailgen = require('mailgen')


export const sendMailService = (email, name, link) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email || !link) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_APP, // generated ethereal user
                        pass: process.env.PASSWORD_APP, // generated ethereal password
                    },
                });

                let MailGenerator = new Mailgen({
                    theme: 'default',
                    product: {
                        name: process.env.WEB_NAME,
                        link: process.env.CLIENT_URL
                    }
                })

                let response = {
                    body: {
                        name: name,
                        intro: `Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại ${process.env.WEB_NAME}`,
                        action: {
                            instructions: 'Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của bạn. Link sẽ hết hạn sau 15 phút.',
                            button: {
                                color: '#22BC66',
                                text: 'Đặt lại mật khẩu',
                                link: link
                            }
                        },
                        outro: 'Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.',
                        signature: 'Thanks'
                    },
                }

                let mail = MailGenerator.generate(response)

                let message = {
                    from: process.env.WEB_NAME, // sender address
                    to: email, // list of receivers
                    subject: 'Cấp lại mật khẩu', // Subject line,
                    html: mail
                }

                await transporter.sendMail(message)
                resolve({
                    err: 0,
                    msg: "Gửi email thành công",
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

export const sendMailRegister = (email, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_APP, // generated ethereal user
                        pass: process.env.PASSWORD_APP, // generated ethereal password
                    },
                });

                let MailGenerator = new Mailgen({
                    theme: 'default',
                    product: {
                        name: process.env.WEB_NAME,
                        link: process.env.CLIENT_URL
                    }
                })

                let response = {
                    body: {
                        name: name,
                        intro: [`Chào mừng bạn đến với ${process.env.WEB_NAME}`],
                        outro: [`Cảm ơn ban đã đăng ký tài khoản tại ${process.env.WEB_NAME}, mọi ý kiến phản hồi về sử dụng dịch vụ vui lòng liên lạc qua email này: ${process.env.EMAIL_APP}`],
                        signature: 'Thanks'
                    },
                }

                let mail = MailGenerator.generate(response)

                let message = {
                    from: process.env.WEB_NAME, // sender address
                    to: email, // list of receivers
                    subject: 'Đăng ký thành công', // Subject line,
                    html: mail
                }

                await transporter.sendMail(message)
                resolve({
                    err: 0,
                    msg: "Gửi email thành công",
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}