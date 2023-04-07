import * as authService from '../services/auth';

export const register = async (req, res) => {
    const { name, phone, email, password } = req.body
    try {
        if (!name || !phone || !email || !password) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing required parameters'
            })
        } else {
            const response = await authService.registerService(req.body)
            return res.status(200).json(response)
        }
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

export const login = async (req, res) => {
    const { phone, password } = req.body
    try {
        if (!phone || !password) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing required parameters'
            })
        } else {
            const response = await authService.loginService(req.body)
            return res.status(200).json(response)
        }
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

export const changePassword = async (req, res) => {
    const { id } = req.user
    try {
        const response = await authService.changePasswordService(id, req.body)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

export const forgotPassword = async (req, res) => {
    const { email, phone } = req.body
    try {
        if (!email || !phone) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing required parameters'
            })
        } else {
            const response = await authService.forgotPasswordService(req.body)
            return res.status(200).json(response)
        }
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

export const resetPassword = async (req, res) => {
    const { password, confirmPassword, token } = req.body
    try {
        const response = await authService.resetPasswordService(token, password, confirmPassword)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}


