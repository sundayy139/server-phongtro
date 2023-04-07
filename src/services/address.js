import db from "../models/index";


// GET ALL PROVINCES
export const getProvincesService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const provinces = await db.Province.findAll({
                raw: true,
                attributes: ['code', 'value']
            })
            resolve({
                err: provinces ? 0 : 1,
                msg: provinces ? "Thành công" : "Không lấy được tỉnh thành",
                provinces
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL District
export const getDistrictsService = (provinceCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const districts = await db.District.findAll({
                where: {
                    provinceCode: provinceCode
                },
                raw: true,
                attributes: ['code', 'value']
            })
            resolve({
                err: districts ? 0 : 1,
                msg: districts ? "Thành công" : "Không lấy được quận/huyện",
                districts
            })
        } catch (e) {
            reject(e);
        }
    })
}

// GET ALL District
export const getWardsService = (districtCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wards = await db.Ward.findAll({
                where: {
                    districtCode: districtCode
                },
                raw: true,
                attributes: ['code', 'value']
            })
            resolve({
                err: wards ? 0 : 1,
                msg: wards ? "Thành công" : "Không lấy được phường/xã",
                wards
            })
        } catch (e) {
            reject(e);
        }
    })
}
