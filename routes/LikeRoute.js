import express from 'express';
import { getLikes, addLike, deleteLike } from '../controllers/LikeController.js';
import { isUser } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/likes', getLikes);
router.post('/likes', isUser, addLike);
router.delete('/likes/:postId', isUser, deleteLike);

export default router;
