import * as feedbackService from "../services/feedback";
export const createFeedback = async (req, res) => {
    try {
        const response = await feedbackService.createFeedbackService(req.body);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at feedback controller' + error
        })
    }
}

export const getFeedbacks = async (req, res) => {
    try {
        const response = await feedbackService.getFeedbacksService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at feedback controller' + error
        })
    }
}