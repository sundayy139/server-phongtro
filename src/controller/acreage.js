import * as acreageService from "../services/acreage";

export const getAcreages = async (req, res) => {
    try {
        const response = await acreageService.getAcreagesService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at acreage controller' + error
        })
    }
}