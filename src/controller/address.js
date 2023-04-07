import * as addressService from "../services/address";

export const getProvinces = async (req, res) => {
    try {
        const response = await addressService.getProvincesService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at address controller' + error
        })
    }
}

export const getDistricts = async (req, res) => {
    const { provinceCode } = req.query
    try {
        const response = await addressService.getDistrictsService(provinceCode);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at address controller' + error
        })
    }
}

export const getWards = async (req, res) => {
    const { districtCode } = req.query
    try {
        const response = await addressService.getWardsService(districtCode);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at address controller' + error
        })
    }
}