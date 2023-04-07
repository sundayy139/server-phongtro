import db from "../models/index";
import { v4 as generateId } from 'uuid'

// GET ALL Blogs
export const getBlogsService = (page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blogs = await db.Blog.findAndCountAll({
                raw: true,
                nest: true,
                order: [['createdAt', 'DESC']],
                limit: +process.env.LIMIT,
                offset: (page - 1) * (+process.env.LIMIT) || 0,
                include: [
                    { model: db.User, as: 'userBlogData', attributes: ['name', 'avatar'] }
                ]
            })
            resolve({
                err: blogs ? 0 : 1,
                msg: blogs ? "Thành công" : "Không lấy được blog",
                blogs
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL Blogs
export const getBlogByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const blog = await db.Blog.findOne({
                    where: {
                        id: id
                    },
                    raw: true,
                    nest: true,
                    include: [
                        { model: db.User, as: 'userBlogData', attributes: ['name', 'avatar'] }
                    ]
                })

                resolve({
                    err: blog ? 0 : 2,
                    msg: blog ? "Thành công" : "Không lấy được blog",
                    blog
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// CREATE BLOG ADMIN
export const createBlogService = (body, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { descHTML, image, title } = body
            if (!id || !descHTML || !image || !title) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const blog = await db.Blog.create({
                    id: generateId(),
                    descHTML: descHTML,
                    userId: id,
                    image: image,
                    title: title
                })

                resolve({
                    err: blog ? 0 : 2,
                    msg: blog ? "Tạo mới blog thành công" : 'Tạo mới blog thất bại',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// UPDATE BLOG ADMIN
export const updateBlogService = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, descHTML, title, image } = payload
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Thiếu mất gì đó rồi",
                })
            } else {
                const blog = await db.Blog.findOne({
                    where: {
                        id: id
                    }
                })
                if (!blog) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy blog",
                    })
                } else {
                    blog.title = title
                    blog.descHTML = descHTML
                    blog.image = image

                    await blog.save()
                    resolve({
                        err: 0,
                        msg: "Cập nhật blog thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// DELETE BLOG ADMIN
export const deleteBlogService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const blog = await db.Blog.findOne({
                    where: {
                        id: id,
                    }
                })
                if (!blog) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy blog",
                    })
                } else {
                    await blog.destroy()
                    resolve({
                        err: 0,
                        msg: "Xóa blog thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}