import express from 'express';
import { getCategory, getAllCategory, getCategoryById, tambahCategory, updateCategory, deleteCategory } from '../controllers/CategoryController.js';
import { isModerator } from '../middleware/RoleMiddleware.js';

const router = express.Router();
router.get('/category', getCategory);
router.get('/categoryAll', getAllCategory);
router.get('/category/:id', isModerator, getCategoryById);
router.post('/category', isModerator, tambahCategory);
router.patch('/category/:id', isModerator, updateCategory);
router.delete('/category/:id', isModerator, deleteCategory);

export default router;
