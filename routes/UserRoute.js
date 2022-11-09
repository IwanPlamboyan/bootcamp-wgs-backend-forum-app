import express from 'express';
import { getUsers, getUserByUsername, editprofile, createModerator, updateModerator, changePassword } from '../controllers/UserController.js';
import { isAdmin, isUser } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/', isAdmin, getUsers);
router.get('/:username', getUserByUsername);
router.patch('/:id', isUser, editprofile);
router.post('/moderator', isAdmin, createModerator);
router.patch('/moderator/:id', isAdmin, updateModerator);
router.patch('/password/:id', isUser, changePassword);

export default router;
