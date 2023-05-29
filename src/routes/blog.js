import express from 'express';
import * as blogController from '../controller/blog'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.get('/all', blogController.getBlogs)
router.get('/blog_id', blogController.getBlogById)

router.use(verifyToken)
router.use(verifyAdmin)
router.post('/create', blogController.createBlog)
router.put('/update', blogController.updateBlog)
router.delete('/delete', blogController.deleteBlog)

export default router