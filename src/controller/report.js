import * as reportService from "../services/report";

export const createReport = async (req, res) => {
    try {
        const { postId, content } = req.body
        const { id } = req.user
        const response = await reportService.createReportService(postId, content, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at report controller' + error
        })
    }
}

export const getAllReport = async (req, res) => {
    try {
        const response = await reportService.getAllReportService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at report controller' + error
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { reportId, status } = req.query
        const response = await reportService.updateStatusService(reportId, status);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at report controller' + error
        })
    }
}

export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.query
        const response = await reportService.deleteReportService(reportId);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at report controller' + error
        })
    }
}