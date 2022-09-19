import express from 'express';
import { Register, Login, Logout } from '../controllers/AuthController.js';
import { refreshToken } from '../controllers/RefreshToken.js';

const router = express.Router();
router.post('/register', Register); //memanggil fungsi register dari controller auth
router.post('/login', Login); //memanggil fungsi login dari controller auth
router.get('/token', refreshToken); //memanggil fungsi refresh token dari controller refreshToken
router.delete('/logout', Logout); //memanggil fungsi logout dari controller auth

export default router;
