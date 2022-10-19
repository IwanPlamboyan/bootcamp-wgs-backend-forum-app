import express from 'express';
import { getCategory, getAllCategory, getCategoryById, tambahCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';
import { isModerator } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/category', getCategory); //route ini public dan memanggil fungsi dari CategoryController untuk menampilkan category
router.get('/categoryAll', getAllCategory); //route ini public dan memanggil fungsi dari CategoryController untuk menampilkan semua category
router.get('/category/:id', isModerator, getCategoryById); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller CategoryController untuk menampilkan category berdasarkan id
router.post('/category', isModerator, tambahCategory); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller CategoryController untuk menambahkan category
router.patch('/category/:id', isModerator, updateCategory); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller CategoryController untuk mengupdate category berdasarkan id
router.delete('/category/:id', isModerator, deleteCategory); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller CategoryController untuk menghapus category berdasarkan id

export default router;
