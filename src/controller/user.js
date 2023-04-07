import * as userService from "../services/user";

export const getCurrentUser = async (req, res) => {
    const { id } = req.user
    try {
        if (!id) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing required parameters'
            })
        } else {
            const response = await userService.getUserService(id)
            return res.status(200).json(response)
        }
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const response = await userService.updateUserProfileService(req.body)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller' + error
        })
    }
}

// ADMIN
export const getUsers = async (req, res) => {
    try {
        const response = await userService.getUsersService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller' + error
        })
    }
}

// ADMIN
export const deleteUser = async (req, res) => {
    const { id } = req.query
    try {
        const response = await userService.deleteUserService(id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller' + error
        })
    }
}

// ADMIN
export const getCountUserByMonth = async (req, res) => {
    try {
        const { status } = req.query
        const response = await userService.getCountUserByMonthService(status);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller' + error
        })
    }
}

// ADMIN
export const getCountUserByDay = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query
        const response = await userService.getCountUserByDayService(status, startDate, endDate);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller' + error
        })
    }
}

// ADMIN
export const getUserByMonth = async (req, res) => {
    try {
        const { status, month, year } = req.query
        const response = await userService.getUserByMonthService(status, month, year);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at user controller' + error
        })
    }
}

