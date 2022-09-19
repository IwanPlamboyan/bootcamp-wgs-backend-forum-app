import express from 'express';
import { getUsers, getUserById, editprofile, createModerator, updateModerator } from '../controllers/UserController.js';
import { isAdmin, publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/', isAdmin, getUsers); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk menampilkan semua user
router.get('/:id', isAdmin, getUserById); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk menampilkan user berdasarkan id
router.patch('/:id', publicAll, editprofile); //route ini public dan memanggil fungsi dari controller userController untuk mengedit user berdarkan id
router.post('/moderator', isAdmin, createModerator); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk membuat user dengan role moderator baru
router.patch('/moderator/:id', isAdmin, updateModerator); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk merubah role moderator atau role user berdasarkan id user

export default router;
