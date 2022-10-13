import express from 'express';
import { getSubForum, getSubForumById, getAllSubForumByUserId, tambahSubForum, updateSubForum, deleteSubForum, getAllSubForumByMainId } from '../controllers/SubForumController.js';
import { publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/tag/:id', getAllSubForumByMainId);
router.get('/sub', getSubForum); //route ini public dan memanggil fungsi dari controller SubForumController untuk menampilkan sub forum
router.get('/sub/:id', getSubForumById); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menampilkan sub forum berdasarkan id
router.get('/sub/user/:user_id', getAllSubForumByUserId);
router.post('/sub', publicAll, tambahSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menambah sub forum baru
router.patch('/sub/:id', publicAll, updateSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk mengupdate sub forum berdasarkan id
router.delete('/sub/:id', publicAll, deleteSubForum); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller SubForumController untuk menghapus sub forum berdasarkan id

export default router;
