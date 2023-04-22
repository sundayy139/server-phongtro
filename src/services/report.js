import db from "../models/index";
import { v4 as generateId } from 'uuid'

// CREATE REPORT
export const createReportService = (postId, content, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!content || !postId || !id) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi',
                })
            } else {
                const report = await db.Report.create({
                    id: generateId(),
                    userId: id,
                    content: content,
                    postId: postId,
                    statusCode: 'S10'
                })
                resolve({
                    err: report ? 0 : 2,
                    msg: report ? "Báo cáo bài viết thành công" : "Không tạo được report",
                    report
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL REPORT
export const getAllReportService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const reports = await db.Report.findAll({
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            resolve({
                err: reports ? 0 : 1,
                msg: reports ? "Thành công" : "Không lấy được report",
                reports
            })
        } catch (e) {
            reject(e);
        }
    })
}


//UPDATE STATUS REPORT
export const updateStatusService = (reportId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!status || !reportId) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi',
                })
            } else {
                const report = await db.Report.findOne({
                    where: {
                        id: reportId
                    },
                    raw: false,
                    nest: false
                })
                if (!report) {
                    resolve({
                        err: 2,
                        msg: 'Không tìm thấy report',
                    })
                } else {
                    report.statusCode = status
                    await report.save()
                    resolve({
                        err: 0,
                        msg: 'Cập nhật trạng thái thành công',
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}


//DELETE STATUS REPORT
export const deleteReportService = (reportId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!reportId) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi',
                })
            } else {
                const report = await db.Report.findOne({
                    where: {
                        id: reportId
                    },
                    raw: false,
                    nest: false
                })
                if (!report) {
                    resolve({
                        err: 2,
                        msg: 'Không tìm thấy report',
                    })
                } else {
                    await report.destroy()
                    resolve({
                        err: 0,
                        msg: 'Xóa report thành công',
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}