import express from 'express';
import { getDiscussionBySubForum, tambahDiscussion, deleteDiscussion } from '../controllers/DiscussionController.js';
import { publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/discussion', publicAll, getDiscussionBySubForum); //route ini public dan memanggil fungsi dari controller DiscussionController untuk menampilkan semua diskusi berdasarkan subForum
router.post('/discussion', publicAll, tambahDiscussion); //route ini public dan memanggil fungsi dari controller DiscussionController untuk menambah diskusi baru
router.delete('/discussion/:id', publicAll, deleteDiscussion); //route ini public dan memanggil fungsi dari controller DiscussionController untuk menghapus diskusi berdasarkan id

export default router;
