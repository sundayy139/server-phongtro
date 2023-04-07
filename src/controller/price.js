import * as priceService from "../services/price";

export const getPrices = async (req, res) => {
    try {
        const response = await priceService.getPricesService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at price controller' + error
        })
    }
}