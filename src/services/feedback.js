import db from "../models/index";
import { v4 as generateId } from 'uuid'

// CREATE FEEDBACK
export const createFeedbackService = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, phone, email, content } = body
            if (!name || !phone || !email || !content) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                let id = generateId()
                const feedback = await db.Feedback.create({
                    id: id,
                    name: name,
                    phone: phone,
                    email: email,
                    content: content
                })
                resolve({
                    err: feedback ? 0 : 2,
                    msg: feedback ? "Thành công" : "Thất bại",
                    feedback
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET FEEDBACKs
export const getFeedbacksService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const feedbacks = await db.Feedback.findAll()
            resolve({
                err: feedbacks ? 0 : 1,
                msg: feedbacks ? "Thành công" : "Thất bại",
                feedbacks
            })
        } catch (e) {
            reject(e);
        }
    })
}