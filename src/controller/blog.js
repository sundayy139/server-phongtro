import * as blogService from "../services/blog";


export const getBlogs = async (req, res) => {
    try {
        const { page } = req.query
        const response = await blogService.getBlogsService(page);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at blog controller' + error
        })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.query
        const response = await blogService.getBlogByIdService(id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at blog controller' + error
        })
    }
}

// ADMIN
export const createBlog = async (req, res) => {
    try {
        const { id } = req.user
        const response = await blogService.createBlogService(req.body, id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at blog controller' + error
        })
    }
}

// ADMIN
export const updateBlog = async (req, res) => {
    try {
        const response = await blogService.updateBlogService(req.body);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at blog controller' + error
        })
    }
}

// ADMIN
export const deleteBlog = async (req, res) => {
    const { id } = req.query
    try {
        const response = await blogService.deleteBlogService(id);
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at blog controller' + error
        })
    }
}
