const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jizhang-app-secret';

// 认证中间件
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: '令牌无效或已过期' });
  }
}

// 管理员认证中间件
function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

// 生成 Token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      phone: user.phone, 
      isAdmin: user.is_admin || false 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { authMiddleware, adminMiddleware, generateToken };
