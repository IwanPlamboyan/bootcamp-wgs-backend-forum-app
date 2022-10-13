import express from 'express';
import { getMainForum, getMainForumById, tambahMainForum, updateMainForum, deleteMainForum } from '../controllers/MainForumController.js';
import { isModerator } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/main', getMainForum); //route ini public dan memanggil fungsi dari MainForumController untuk menampilkan MainForum
router.get('/main/:id', isModerator, getMainForumById); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller MainForumController untuk menampilkan mainForum berdasarkan id
router.post('/main', isModerator, tambahMainForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller MainForumController untuk menambahkan mainForum
router.patch('/main/:id', isModerator, updateMainForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller MainForumController untuk mengupdate mainForum berdasarkan id
router.delete('/main/:id', isModerator, deleteMainForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller MainForumController untuk menghapus mainforum berdasarkan id

export default router;
