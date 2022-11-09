import express from 'express';
import { getCommentsByPostId, tambahComment, deleteComment } from '../controllers/CommentController.js';
import { isUser } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/comment', getCommentsByPostId);
router.post('/comment', isUser, tambahComment);
router.delete('/comment/:id', isUser, deleteComment);

export default router;
