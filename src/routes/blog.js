import express from 'express';
import * as blogController from '../controller/blog'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.get('/get-blogs', blogController.getBlogs)
router.get('/get-blog-by-id', blogController.getBlogById)

router.use(verifyToken)
router.use(verifyAdmin)
router.post('/create-blog', blogController.createBlog)
router.put('/update-blog', blogController.updateBlog)
router.delete('/delete-blog', blogController.deleteBlog)

export default router