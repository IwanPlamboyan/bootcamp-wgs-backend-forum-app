import express from 'express';
import { getAllSubForum, getSubForumById, tambahSubForum, updateSubForum, deleteSubForum } from '../controllers/SubForumController.js';
import { isModerator, publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/sub', publicAll, getAllSubForum); //route ini public dan memanggil fungsi dari controller SubForumController untuk menampilkan semua sub forum
router.get('/sub/:id', isModerator, getSubForumById); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menampilkan sub forum berdasarkan id
router.post('/sub', isModerator, tambahSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menambah sub forum baru
router.patch('/sub/:id', isModerator, updateSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk mengupdate sub forum berdasarkan id
router.delete('/sub/:id', isModerator, deleteSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menghapus sub forum berdasarkan id

export default router;
