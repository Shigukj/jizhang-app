const express = require('express');
const router = express.Router();
const { prepare } = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 管理员路由 - 获取用户列表
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { page = 1, limit = 20, status, keyword } = req.query;

    let sql = 'SELECT id, username, phone, avatar, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (status !== undefined) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (keyword) {
      sql += ' AND (username LIKE ? OR phone LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const countSql = `SELECT COUNT(*) as total FROM (${sql})`;
    const { total } = prepare(countSql).get(...params);

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const users = prepare(sql).all(...params);

    res.json({
      users,
      pagination: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 禁用/启用用户
router.put('/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, id);

    res.json({ message: '状态更新成功' });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    res.status(500).json({ error: '更新状态失败' });
  }
});

module.exports = router;
