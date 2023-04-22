import * as paymentService from "../services/payment";

export const createPaymentUrl = async (req, res, next) => {
    try {
        let response = await paymentService.createPaymentUrlService(req);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error
        })
    }
}

export const paymentReturn = async (req, res, next) => {
    try {
        const { params } = req.query
        const { id } = req.user
        let response = await paymentService.paymentReturnService(params, id);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error
        })
    }
}

export const paymentHistory = async (req, res, next) => {
    try {
        const { id } = req.user
        let response = await paymentService.paymentHistoryService(id);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error
        })
    }
}

export const getPaymentSuccess = async (req, res, next) => {
    try {
        let response = await paymentService.getPaymentSuccessService();
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error
        })
    }
}

export const getPaymentByMonth = async (req, res, next) => {
    const { status, month, year } = req.query
    try {
        let response = await paymentService.getPaymentByMonthService(status, month, year);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error
        })
    }
}

export const getTotalPaymentByMonth = async (req, res) => {
    try {
        const { status } = req.query
        const response = await paymentService.getTotalPaymentByMonthService(status);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error + '1'
        })
    }
}

export const getTotalPaymentByDay = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query
        const response = await paymentService.getTotalPaymentByDayService(status, startDate, endDate);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at payment controller' + error + '1'
        })
    }
}