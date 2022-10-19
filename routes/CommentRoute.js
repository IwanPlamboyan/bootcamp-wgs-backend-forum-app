import express from 'express';
import { getCommentByPost, tambahComment, deleteComment } from '../controllers/CommentController.js';
import { publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/comment', publicAll, getCommentByPost); //route ini public dan memanggil fungsi dari controller CommentController untuk menampilkan semua diskusi berdasarkan Postingan
router.post('/comment', publicAll, tambahComment); //route ini public dan memanggil fungsi dari controller CommentController untuk menambah diskusi baru
router.delete('/comment/:id', publicAll, deleteComment); //route ini public dan memanggil fungsi dari controller CommentController untuk menghapus diskusi berdasarkan id

export default router;
