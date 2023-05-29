import express from 'express';
import * as postController from '../controller/post'
import { verifyAdmin, verifyToken } from '../middleware/auth'

const router = express.Router()

router.get('/all', postController.getPosts)
router.get('/limit', postController.getPostsLimit)
router.get('/newpost', postController.getNewPosts)
router.get('/post_id', postController.getPostById)
router.get('/label', postController.getLabelPost)

router.use(verifyToken)
router.post('/create', postController.createNewPost)
router.get('/posts_user', postController.getPostsUser)
router.put('/update', postController.updatePost)
router.delete('/delete', postController.deletePost)
router.put('/update_status', postController.updateStatusPost)
router.post('/favourite/add', postController.setFavouritePost)
router.put('/favourite/remove', postController.removeFavourite)
router.get('/favourite', postController.getFavouritePost)

router.use(verifyAdmin)
router.get('/all_post_admin', postController.getPostsAdmin)
router.put('/update_status_post_admin', postController.updateStatusPostAdmin)
router.get('/count_post_by_month', postController.getCountPostByMonth)
router.get('/count_post_by_day', postController.getCountPostByDay)
router.get('/post_by_month', postController.getPostByMonth)
export default router