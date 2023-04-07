import db from "../models/index";


// GET ALL PRICES
export const getPricesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const prices = await db.Price.findAll({
                raw: true,
                attributes: ['code', 'value']
            })
            resolve({
                err: prices ? 0 : 1,
                msg: prices ? "Thành công" : "Không lấy được danh mục",
                prices
            })
        } catch (e) {
            reject(e);
        }
    })
}
