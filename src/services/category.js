import db from "../models/index";


// GET ALL CATRGORIES
export const getCategoriesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await db.Category.findAll({
                raw: true,
            })
            resolve({
                err: categories ? 0 : 1,
                msg: categories ? "Thành công" : "Không lấy được danh mục",
                categories
            })
        } catch (e) {
            reject(e);
        }
    })
}