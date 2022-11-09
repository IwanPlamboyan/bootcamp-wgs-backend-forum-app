import express from 'express';
import { getCommentsByPostId, addComment, deleteComment } from '../controllers/CommentController.js';
import { isUser } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/comment', getCommentsByPostId);
router.post('/comment', isUser, addComment);
router.delete('/comment/:id', isUser, deleteComment);

export default router;
