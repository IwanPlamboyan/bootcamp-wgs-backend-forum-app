import express from 'express';
import { getUsers, getUserByUsername, editprofile, createModerator, updateModerator, changePassword } from '../controllers/UserController.js';
import { isAdmin, publicAll } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/', isAdmin, getUsers); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk menampilkan semua user
router.get('/:username', getUserByUsername); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk menampilkan user berdasarkan id
router.patch('/:id', publicAll, editprofile); //route ini public dan memanggil fungsi dari controller userController untuk mengedit user berdarkan id
router.post('/moderator', isAdmin, createModerator); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk membuat user dengan role moderator baru
router.patch('/moderator/:id', isAdmin, updateModerator); //route ini hanya bisa diakses oleh admin dan memanggil fungsi dari controller userController untuk merubah role moderator atau role user berdasarkan id user
router.patch('/password/:id', changePassword); //memanggil fungsi changePassword dari controller UsserController

export default router;
