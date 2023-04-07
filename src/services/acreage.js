import db from "../models/index";


// GET ALL ACREAGE
export const getAcreagesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const acreages = await db.Acreage.findAll({
                raw: true,
                attributes: ['code', 'value']
            })
            resolve({
                err: acreages ? 0 : 1,
                msg: acreages ? "Thành công" : "Không lấy được danh mục",
                acreages
            })
        } catch (e) {
            reject(e);
        }
    })
}