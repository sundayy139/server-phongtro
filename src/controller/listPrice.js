import * as ListPriceService from '../services/ListPrice';

export const getListPrice = async (req, res) => {
    try {
        const response = await ListPriceService.getListPriceService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at listPrice controller' + error
        })
    }
}


export const updateListPrice = async (req, res) => {
    try {
        const response = await ListPriceService.updateListPriceService(req.body);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at listPrice controller' + error
        })
    }
}

