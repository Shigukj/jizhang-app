const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// 公开路由
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
