import * as mailService from '../services/mailer';

export const registerMail = async (req, res) => {
    try {
        let response = await mailService.sendMailRegister(req.body);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at mailer controller' + error
        })
    }
}

export const contactMail = async (req, res) => {
    try {
        const { email, name, phone, content } = req.body
        let response = await mailService.sendMailContactService(email, name, phone, content);
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at mailer controller' + error
        })
    }
}
