import db from "../models/index";
require('dotenv').config()
const { Op } = require("sequelize");
const sequelize = require("sequelize");
import { v4 as generateId } from 'uuid'
import { generateCode } from "../utils/fn";
import moment from 'moment'

// GET ALL POSTS
export const getPostsService = (page, { ...query }, { priceNumber, acreageNumber }) => {
    return new Promise(async (resolve, reject) => {
        const queries = { ...query }
        if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
        if (acreageNumber) queries.acreageNumber = { [Op.between]: acreageNumber }
        queries.expiredAt = { [Op.gte]: new Date() }
        queries.statusCode = 'S2'
        try {
            const posts = await db.Post.findAll({
                where: queries,
                // offset: (page - 1) * (+process.env.LIMIT) || 0,
                raw: true,
                nest: true,
                include: [
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData', attributes: ['value'] },
                    { model: db.Province, as: 'provincePostData', attributes: ['value'] },
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.Category, as: 'categoryData', attributes: ['value'] },
                    { model: db.User, as: 'userData', attributes: ['name', 'avatar', 'zalo', 'phone'] },
                ],
            })
            resolve({
                err: posts ? 0 : 1,
                msg: posts ? "Thành công" : "Không lấy được bài đăng",
                posts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET POSTS LIMIT OR FILTER
export const getPostsLimitService = (page, { order, ...query }, { priceNumber, acreageNumber }) => {
    return new Promise(async (resolve, reject) => {
        const queries = { ...query }
        if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
        if (acreageNumber) queries.acreageNumber = { [Op.between]: acreageNumber }
        queries.expiredAt = { [Op.gte]: new Date() }
        queries.statusCode = 'S2'
        try {
            const posts = await db.Post.findAndCountAll({
                where: queries,
                raw: true,
                nest: true,
                order: order ? [order] : [['order', 'DESC']],
                offset: (page - 1) * (+process.env.LIMIT) || 0,
                limit: +process.env.LIMIT,
                include: [
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData' },
                    { model: db.Province, as: 'provincePostData' },
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.Category, as: 'categoryData', attributes: ['value'] },
                    { model: db.User, as: 'userData', attributes: ['name', 'avatar', 'zalo', 'phone'] },
                ],
            })
            resolve({
                err: posts ? 0 : 1,
                msg: posts ? "Thành công" : "Không lấy được bài đăng",
                posts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET NEW POSTS
export const getNewPostsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const newposts = await db.Post.findAll({
                where: {
                    statusCode: 'S2',
                    expiredAt: {
                        [Op.gte]: new Date()
                    }
                },
                raw: true,
                nest: true,
                limit: +process.env.LIMIT,
                order: [["createdAt", "DESC"]],
                attributes: [
                    'id',
                    "title",
                    "description",
                    "acreageNumber",
                    "priceNumber",
                    "createdAt",
                ],
                include: [
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData', attributes: ['value'] },
                    { model: db.Province, as: 'provincePostData', attributes: ['value'] },
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.User, as: 'userData', attributes: ['name', 'avatar', 'zalo', 'phone'] },
                ],
            })
            resolve({
                err: newposts ? 0 : 1,
                msg: newposts ? "Thành công" : "Không lấy được bài đăng",
                newposts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET LABEL POST
export const getLabelPostService = (categoryCode, provinceCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!categoryCode || !provinceCode) {
                resolve({
                    err: 1,
                    msg: 'Có lỗi gì đó rồi',
                })
            } else {
                const label = await db.Post.findAndCountAll({
                    where: {
                        categoryCode: categoryCode,
                        provinceCode: provinceCode
                    },
                    raw: true,
                    nest: true,
                    attributes: ['labelCode'],
                    group: ['labelCode', 'labelData.id'],
                    include: [
                        { model: db.Label, as: 'labelData' },
                    ],
                })
                resolve({
                    err: label ? 0 : 2,
                    msg: label ? "Thành công" : "Không lấy được bài đăng",
                    label
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET POST BY ID
export const getPostByIdService = (id, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await db.Post.findAndCountAll({
                where: {
                    id
                },
                raw: true,
                nest: true,
                offset: (page - 1) * (+process.env.LIMIT) || 0,
                limit: +process.env.LIMIT,
                include: [
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    {
                        model: db.User, as: 'userData', attributes: {
                            exclude: ['password']
                        }
                    },
                    { model: db.Category, as: 'categoryData', attributes: ['code', 'value'] },
                    { model: db.Label, as: 'labelData', attributes: ['code', 'value'] },
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData', attributes: ['value'] },
                    { model: db.Province, as: 'provincePostData', attributes: ['value'] },
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.User, as: 'userData', attributes: ['name', 'avatar', 'zalo', 'phone', 'statusCode'] },
                ]
            })
            resolve({
                err: post ? 0 : 1,
                msg: post ? "Thành công" : "Không lấy được bài đăng",
                post
            })
        } catch (e) {
            reject(e);
        }
    })
}

// CREATE NEW POST
export const createNewPostService = (body, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                categoryCode,
                priceNumber,
                acreageNumber,
                description,
                title,
                label,
                address,
                province,
                target,
                expired,
                images,
                priceCode,
                acreageCode,
                type,
                pricePerDay
            } = body

            if (!categoryCode || !type || !target || !expired || !description || !id || !priceNumber || !acreageNumber || !title || !label || !address || !province) {
                resolve({
                    err: 1,
                    msg: "Vui lòng điền đầy đủ thông tin",
                })
            } else {
                const imagesId = generateId()
                const labelCode = generateCode(label)
                const provinceCode = generateCode(province)
                const desc = description.split("\n")
                const district = address.split(',')[address.split(',').length - 2].trim()
                const districtCode = generateCode(address.split(',')[address.split(',').length - 2].trim())
                const ward = address.split(',')[address.split(',').length - 3].trim()
                const wardCode = generateCode(address.split(',')[address.split(',').length - 3].trim())
                const addresscf = address.split(',')[address.split(',').length - 4].trim()
                const addresscfCode = generateCode(address.split(',')[address.split(',').length - 4].trim())

                const user = await db.User.findOne({
                    where: {
                        id: id
                    },
                    raw: false
                })

                if (!user) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy người dùng",
                    })
                } else {
                    if (user.balance < +pricePerDay * +expired) {
                        resolve({
                            err: 3,
                            msg: "Số dư tài khoản không đủ",
                        })
                    } else {
                        const existingLabel = await db.Label.findOne({
                            where: {
                                value: label
                            }
                        })

                        if (!existingLabel) {
                            await db.Label.create({
                                code: labelCode,
                                value: label
                            })
                        }

                        const existingProvince = await db.Province.findOne({
                            where: {
                                value: province
                            }
                        })

                        if (!existingProvince) {
                            await db.Province.create({
                                code: provinceCode,
                                value: province
                            })
                        }

                        const existingDistrict = await db.District.findOne({
                            where: {
                                value: district
                            }
                        })

                        if (!existingDistrict) {
                            await db.District.create({
                                code: districtCode,
                                value: district,
                                provinceCode: existingProvince ? existingProvince.code : provinceCode
                            })
                        }

                        const existingWard = await db.Ward.findOne({
                            where: {
                                value: ward
                            }
                        })

                        if (!existingWard) {
                            await db.Ward.create({
                                code: wardCode,
                                value: ward,
                                districtCode: existingDistrict ? existingDistrict.code : districtCode,
                                provinceCode: existingProvince ? existingProvince.code : provinceCode
                            })
                        }

                        const existingAddress = await db.Address.findOne({
                            where: {
                                value: addresscf,
                                provinceCode: existingProvince ? existingProvince.code : provinceCode
                            }
                        })

                        if (!existingAddress) {
                            await db.Address.create({
                                code: addresscfCode,
                                value: addresscf,
                                wardCode: existingWard ? existingWard.code : wardCode,
                                districtCode: existingDistrict ? existingDistrict.code : districtCode,
                                provinceCode: existingProvince ? existingProvince.code : provinceCode
                            })
                        }

                        await db.Image.create({
                            id: imagesId,
                            images: JSON.stringify(images)
                        })

                        // update balance

                        user.balance -= +pricePerDay * +expired

                        await user.save()

                        const newPosts = await db.Post.create({
                            id: generateId(),
                            title: title,
                            labelCode: existingLabel ? existingLabel.code : labelCode,
                            addressCode: existingAddress ? existingAddress.code : addresscfCode,
                            wardCode: existingWard ? existingWard.code : wardCode,
                            districtCode: existingDistrict ? existingDistrict.code : districtCode,
                            provinceCode: existingProvince ? existingProvince.code : provinceCode,
                            categoryCode: categoryCode,
                            description: JSON.stringify(desc) || null,
                            userId: id,
                            imageId: imagesId,
                            priceCode: priceCode || null,
                            acreageCode: acreageCode || null,
                            statusCode: 'S1',
                            target: target,
                            order: type,
                            priceNumber: priceNumber / Math.pow(10, 6),
                            acreageNumber: acreageNumber,
                            expiredAt: new Date(Date.now() + expired * 24 * 60 * 60 * 1000)
                        })

                        resolve({
                            err: newPosts ? 0 : 4,
                            msg: newPosts ? "Tạo mới bài đăng thành công" : "Có lỗi gì đó rồi",
                        })
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET POSTS USER
export const getPostsUserService = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await db.Post.findAll({
                where: {
                    userId: userId,
                },
                raw: true,
                nest: true,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData', attributes: ['value'] },
                    { model: db.Province, as: 'provincePostData', attributes: ['value'] },
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.Category, as: 'categoryData', attributes: ['value'] },
                    { model: db.User, as: 'userData', attributes: ['name', 'avatar', 'zalo', 'phone'] },
                ],
            })
            resolve({
                err: posts ? 0 : 1,
                msg: posts ? "Thành công" : "Không lấy được bài đăng",
                posts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// UPDATE POST
export const updatePostService = (body, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                categoryCode,
                priceNumber,
                acreageNumber,
                description,
                title,
                label,
                address,
                province,
                target,
                expired,
                postId,
                images,
                priceCode,
                acreageCode
            } = body

            if (!categoryCode || !target || !postId || !expired || !description || !id || !priceNumber || !acreageNumber || !title || !label || !address || !province) {
                resolve({
                    err: 1,
                    msg: "Vui lòng điền đầy đủ thông tin",
                })
            } else {
                const labelCode = generateCode(label)
                const provinceCode = generateCode(province)
                const desc = description.split("\n")
                const district = address.split(',')[address.split(',').length - 2].trim()
                const districtCode = generateCode(address.split(',')[address.split(',').length - 2].trim())
                const ward = address.split(',')[address.split(',').length - 3].trim()
                const wardCode = generateCode(address.split(',')[address.split(',').length - 3].trim())
                const addresscf = address.split(',')[address.split(',').length - 4].trim()
                const addresscfCode = generateCode(address.split(',')[address.split(',').length - 4].trim())
                const existingLabel = await db.Label.findOne({
                    where: {
                        value: label
                    }
                })

                if (!existingLabel) {
                    await db.Label.create({
                        code: labelCode,
                        value: label
                    })
                }

                const existingProvince = await db.Province.findOne({
                    where: {
                        value: province
                    }
                })

                if (!existingProvince) {
                    await db.Province.create({
                        code: provinceCode,
                        value: province
                    })
                }

                const existingDistrict = await db.District.findOne({
                    where: {
                        value: district
                    }
                })

                if (!existingDistrict) {
                    await db.District.create({
                        code: districtCode,
                        value: district,
                        provinceCode: existingProvince ? existingProvince.code : provinceCode
                    })
                }

                const existingWard = await db.Ward.findOne({
                    where: {
                        value: ward
                    }
                })

                if (!existingWard) {
                    await db.Ward.create({
                        code: wardCode,
                        value: ward,
                        districtCode: existingDistrict ? existingDistrict.code : districtCode,
                        provinceCode: existingProvince ? existingProvince.code : provinceCode
                    })
                }

                const existingAddress = await db.Address.findOne({
                    where: {
                        value: addresscf,
                        provinceCode: existingProvince ? existingProvince.code : provinceCode
                    }
                })

                if (!existingAddress) {
                    await db.Address.create({
                        code: addresscfCode,
                        value: addresscf,
                        wardCode: existingWard ? existingWard.code : wardCode,
                        districtCode: existingDistrict ? existingDistrict.code : districtCode,
                        provinceCode: existingProvince ? existingProvince.code : provinceCode
                    })
                }

                const post = await db.Post.findOne({
                    where: {
                        id: postId
                    }
                })

                if (!post) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy bài đăng"
                    })
                } else {
                    await db.Image.update({
                        images: JSON.stringify(images)
                    }, {
                        where: {
                            id: post.imageId,
                        }
                    })

                    const updatePost = await db.Post.update({
                        title: title,
                        labelCode: existingLabel ? existingLabel.code : labelCode,
                        addressCode: existingAddress ? existingAddress.code : addresscfCode,
                        wardCode: existingWard ? existingWard.code : wardCode,
                        districtCode: existingDistrict ? existingDistrict.code : districtCode,
                        provinceCode: existingProvince ? existingProvince.code : provinceCode,
                        categoryCode: categoryCode,
                        description: JSON.stringify(desc),
                        priceCode: priceCode,
                        acreageCode: acreageCode,
                        target: target,
                        priceNumber: +priceNumber / Math.pow(10, 6),
                        acreageNumber: acreageNumber,
                        expiredAt: new Date(new Date(post.createdAt).getTime() + +expired * 24 * 60 * 60 * 1000)
                    }, {
                        where: {
                            id: postId,
                        }
                    })

                    resolve({
                        err: 0,
                        msg: "Cập nhật bài đăng thành công",
                        updatePost
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// DELETE POST
export const deletePostService = (postId, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!postId || !id) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const post = await db.Post.findOne({
                    where: {
                        id: postId,
                        userId: id
                    }
                })
                if (!post) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy bài đăng",
                    })
                } else {
                    await db.Image.destroy({
                        where: {
                            id: post.imageId
                        }
                    })
                    await post.destroy()
                    resolve({
                        err: 0,
                        msg: "Xóa bài đăng thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// UPDATE STATUS POST
export const updateStatusPostService = (postId, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!postId || !id) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const post = await db.Post.findOne({
                    where: {
                        id: postId,
                        userId: id
                    }
                })
                if (!post) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy bài đăng",
                    })
                } else {
                    post.statusCode = 'S4'
                    await post.save()
                    resolve({
                        err: 0,
                        msg: "Cập nhật trạng thái bài đăng thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// SET FAVOURITE POST
export const setFavouritePostService = (pId, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pId || !id) {
                resolve({
                    err: 1,
                    msg: "Vui lòng điền đầy đủ thông tin",
                })
            } else {
                const user = await db.Favourite.findOne({
                    where: {
                        userId: id
                    }
                })
                if (user) {
                    const postExists = user.postId.some(post => post === pId);
                    if (!postExists) {

                        const updatedPosts = [...user.postId, pId];
                        user.update({ postId: updatedPosts });
                    }
                    resolve({
                        err: 0,
                        msg: "Thành công",
                    })
                } else {
                    const favourite = await db.Favourite.create({
                        userId: id,
                        postId: [pId]
                    })
                    resolve({
                        err: favourite ? 0 : 1,
                        msg: favourite ? "Thành công" : "Thất bại",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// SET FAVOURITE POST
export const removeFavouriteService = (pId, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pId || !id) {
                resolve({
                    err: 1,
                    msg: "Vui lòng điền đầy đủ thông tin",
                })
            } else {
                const user = await db.Favourite.findOne({
                    where: {
                        userId: id
                    }
                })
                if (user) {
                    let newArrPost = []
                    let arr = user.postId
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] !== pId) {
                            newArrPost.push(arr[i]);
                        }
                    }

                    user.update({ postId: newArrPost });
                    resolve({
                        err: 0,
                        msg: "Thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

//GET FAVOURITE POST
export const getFavouritePostService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Vui lòng điền đầy đủ thông tin",
                })
            } else {
                const favourite = await db.Favourite.findAll({
                    where: {
                        userId: id
                    }
                })
                resolve({
                    err: favourite ? 0 : 1,
                    msg: favourite ? "Thành công" : "Thất bại",
                    favourite
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL POSTS ADMIN
export const getPostsAdminService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const posts = await db.Post.findAll({
                raw: true,
                nest: true,
                order: [['statusCode', 'ASC']],
                include: [
                    { model: db.Image, as: 'imagesData', attributes: ['images'] },
                    { model: db.Address, as: 'addressPostData', attributes: ['value'] },
                    { model: db.Ward, as: 'wardPostData', attributes: ['value'] },
                    { model: db.District, as: 'districtPostData', attributes: ['value'] },
                    { model: db.User, as: 'userData', attributes: { exclude: ['password'] } },
                    { model: db.Province, as: 'provincePostData', attributes: ['code', 'value'] },
                    { model: db.Category, as: 'categoryData', attributes: ['code', 'value'] },
                    { model: db.Label, as: 'labelData', attributes: ['code', 'value'] },
                ]
            })
            resolve({
                err: posts ? 0 : 1,
                msg: posts ? "Thành công" : "Không lấy được bài đăng",
                posts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// APPROVE POST ADMIN
export const approvePostService = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!postId) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const post = await db.Post.findOne({
                    where: {
                        id: postId,
                    }
                })
                if (!post) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy bài đăng",
                    })
                } else {
                    post.statusCode = 'S2'
                    await post.save()
                    resolve({
                        err: 0,
                        msg: "Phê duyệt bài đăng thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// APPROVE POST ADMIN
export const refusePostService = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!postId) {
                resolve({
                    err: 1,
                    msg: "Có lỗi gì đó rồi",
                })
            } else {
                const post = await db.Post.findOne({
                    where: {
                        id: postId,
                    }
                })
                if (!post) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy bài đăng",
                    })
                } else {
                    post.statusCode = 'S3'
                    await post.save()
                    resolve({
                        err: 0,
                        msg: "Từ chối phê duyệt bài đăng thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

// GET COUNT POST BY MONTH ADMIN
export const getCountPostByMonthService = (status, categoryCode) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (status) queries.statusCode = status
        if (categoryCode) queries.categoryCode = categoryCode
        try {
            const postCounts = [];
            const firstMonth = (new Date(new Date().getFullYear(), 0));
            while (firstMonth.getMonth() <= new Date().getMonth()) {
                postCounts.push({ month: moment(moment.utc(firstMonth)).local().format('MM/YYYY'), count: 0 });
                firstMonth.setMonth(firstMonth.getMonth() + 1)
            }

            const results = await db.Post.findAll({
                attributes: [
                    [sequelize.literal(`to_char("createdAt", 'MM/YYYY')`), 'month'],
                    [sequelize.fn('count', sequelize.col('id')), 'count']
                ],
                group: ['month'],
                raw: true,
                where: queries
            });

            results.forEach(post => {
                const resultItem = postCounts.find(item => item.month === post.month);
                if (resultItem) {
                    resultItem.count = post.count;
                }
            });
            resolve({
                err: postCounts ? 0 : 1,
                msg: postCounts ? "Thành công" : "Không lấy được bài đăng",
                postCounts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET COUNT POST BY DAY ADMIN
export const getCountPostByDayService = (status, startDate, endDate, categoryCode) => {
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
            const postCounts = [];
            let currentDate = new Date(new Date(startDate).getTime());
            while (currentDate <= new Date(endDate)) {
                postCounts.push({ date: moment(moment.utc(currentDate)).local().format('DD/MM'), count: 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            const results = await db.Post.findAll({
                where: queries
            });

            results.forEach(post => {
                const postDate = moment(moment.utc(post.createdAt)).local().format('DD/MM');
                const resultItem = postCounts.find(item => item.date === postDate);
                if (resultItem) {
                    resultItem.count++;
                }
            });
            resolve({
                err: postCounts ? 0 : 1,
                msg: postCounts ? "Thành công" : "Không lấy được bài đăng",
                postCounts
            })
        } catch (e) {
            reject(e);
        }
    })
}


// GET POST BY MONTH ADMIN
export const getPostByMonthService = (status, categoryCode, month, year) => {
    return new Promise(async (resolve, reject) => {
        const queries = {}
        if (status) queries.statusCode = status
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

                resolve({
                    err: posts ? 0 : 2,
                    msg: posts ? "Thành công" : "Không lấy được bài đăng",
                    posts
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

