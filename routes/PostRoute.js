import express from 'express';
import { getPosts, getPostById, getAllPostByUserId, addPost, updatePost, editPostCategory, deletePost, getAllPostByCategoryId } from '../controllers/PostController.js';
import { isModerator, isUser } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/post/category/:id', getAllPostByCategoryId);
router.get('/post', getPosts);
router.get('/post/:id', getPostById);
router.get('/post/user/:user_id', getAllPostByUserId);
router.post('/post', isUser, addPost);
router.patch('/post/category/:id', isModerator, editPostCategory);
router.patch('/post/:id', isUser, updatePost);
router.delete('/post/:id', isUser, deletePost);

export default router;
