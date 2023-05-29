import db from "../models/index";


// GET ALL Listprice
export const getListPriceService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listPrice = await db.PriceList.findAll({
                raw: true,
                order: [['id', 'ASC']]
            })
            resolve({
                err: listPrice ? 0 : 1,
                msg: listPrice ? "Thành công" : "Không lấy được",
                listPrice
            })
        } catch (e) {
            reject(e);
        }
    })
}

// UPDATE Listprice ADMIN
export const updateListPriceService = (payload) => {
    return new Promise(async (resolve, reject) => {
        const { id, price, title } = payload
        try {
            if (!id) {
                resolve({
                    err: 1,
                    msg: "Thiếu gì đó rồi",
                })
            } else {
                const listPrice = await db.PriceList.findOne({
                    where: {
                        id: id
                    }
                })
                if (!listPrice) {
                    resolve({
                        err: 2,
                        msg: "Không tìm thấy",
                    })
                } else {
                    listPrice.title = title
                    listPrice.price = +price

                    await listPrice.save()
                    resolve({
                        err: 0,
                        msg: "Cập nhật thành công",
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}