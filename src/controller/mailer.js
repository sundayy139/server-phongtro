import * as mailService from '../services/mailer';

export const registerMail = async (req, res) => {
    try {
        let response = await mailService.sendMailService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at mailer controller' + error
        })
    }
}
