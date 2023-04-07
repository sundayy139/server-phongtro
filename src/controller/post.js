import * as postService from "../services/post";

export const getPosts = async (req, res) => {
    const { priceNumber, acreageNumber, ...query } = req.query
    try {
        const response = await postService.getPostsService(query, { priceNumber, acreageNumber });
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getLabelPost = async (req, res) => {
    const { categoryCode, provinceCode } = req.query
    try {
        const response = await postService.getLabelPostService(categoryCode, provinceCode);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getPostsLimit = async (req, res) => {
    const { page, priceNumber, acreageNumber, ...query } = req.query
    try {
        const response = await postService.getPostsLimitService(page, query, { priceNumber, acreageNumber });
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getNewPosts = async (req, res) => {
    try {
        const response = await postService.getNewPostsService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getPostById = async (req, res) => {
    const { id, page } = req.query
    try {
        const response = await postService.getPostByIdService(id, page);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const createNewPost = async (req, res) => {
    try {
        const { id } = req.user
        const response = await postService.createNewPostService(req.body, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const setFavouritePost = async (req, res) => {
    try {
        const { id } = req.user
        const { postId } = req.query
        const response = await postService.setFavouritePostService(postId, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const removeFavourite = async (req, res) => {
    try {
        const { id } = req.user
        const { postId } = req.query
        const response = await postService.removeFavouriteService(postId, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getFavouritePost = async (req, res) => {
    try {
        const { id } = req.user
        const response = await postService.getFavouritePostService(id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}


export const getPostsUser = async (req, res) => {
    try {
        const { id } = req.user
        const response = await postService.getPostsUserService(id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.user
        const response = await postService.updatePostService(req.body, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.user
        const { postId } = req.query
        const response = await postService.deletePostService(postId, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const updateStatusPost = async (req, res) => {
    try {
        const { id } = req.user
        const { postId } = req.query
        const response = await postService.updateStatusPostService(postId, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

// ADMIN
export const getPostsAdmin = async (req, res) => {
    try {
        const response = await postService.getPostsAdminService();
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

// ADMIN
export const approvePost = async (req, res) => {
    try {
        const { postId } = req.query
        const response = await postService.approvePostService(postId);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

// ADMIN
export const refusePost = async (req, res) => {
    try {
        const { postId } = req.query
        const response = await postService.refusePostService(postId);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getCountPostByMonth = async (req, res) => {
    try {
        const { status, categoryCode } = req.query
        const response = await postService.getCountPostByMonthService(status, categoryCode);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error + '1'
        })
    }
}

export const getCountPostByDay = async (req, res) => {
    try {
        const { status, startDate, endDate, categoryCode } = req.query
        const response = await postService.getCountPostByDayService(status, startDate, endDate, categoryCode);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error
        })
    }
}

export const getPostByMonth = async (req, res) => {
    try {
        const { status, categoryCode, month, year } = req.query
        const response = await postService.getPostByMonthService(status, categoryCode, month, year);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at post controller' + error + '1'
        })
    }
}


