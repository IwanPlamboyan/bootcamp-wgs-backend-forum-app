import express from 'express';
import { getPost, getPostById, getAllPostByUserId, tambahPost, updatePost, editPostCategory, deletePost, getAllPostByCategoryId } from '../controllers/PostController.js';
import { isModerator, publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/post/category/:id', getAllPostByCategoryId);
router.get('/post', getPost); //route ini public dan memanggil fungsi dari controller PostController untuk menampilkan postingan
router.get('/post/:id', getPostById); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller PostController untuk menampilkan postingan berdasarkan id
router.get('/post/user/:user_id', getAllPostByUserId);
router.post('/post', publicAll, tambahPost); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller PostController untuk menambah postingan baru
router.patch('/post/category/:id', isModerator, editPostCategory);
router.patch('/post/:id', publicAll, updatePost); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller PostController untuk mengupdate postingan berdasarkan id
router.delete('/post/:id', publicAll, deletePost); //route ini tidak bisa diakses oleh user biasa dan memanggil fungsi dari controller PostController untuk menghapus postingan berdasarkan id

export default router;
