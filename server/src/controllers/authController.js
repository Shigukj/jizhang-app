const bcrypt = require('bcryptjs');
const { prepare } = require('../config/database');
const { generateToken } = require('../middleware/auth');

// 用户注册
async function register(req, res) {
  try {
    const { phone, password, username } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // 检查手机号是否已注册
    const existingUser = prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return res.status(400).json({ error: '该手机号已注册' });
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const result = prepare(`
      INSERT INTO users (phone, password_hash, username)
      VALUES (?, ?, ?)
    `).run(phone, passwordHash, username || `用户${phone.slice(-4)}`);

    const userId = result.lastInsertRowid;

    // 创建默认账本
    prepare(`
      INSERT INTO ledgers (user_id, name, is_default)
      VALUES (?, '默认账本', 1)
    `).run(userId);

    // 获取用户信息
    const user = prepare('SELECT id, phone, username, avatar, created_at FROM users WHERE id = ?').get(userId);

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar,
        created_at: user.created_at
      },
      token: generateToken({ id: userId, phone: user.phone })
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败', message: error.message });
  }
}

// 用户登录
async function login(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // 查找用户
    const user = prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    // 检查状态
    if (user.status === 0) {
      return res.status(403).json({ error: '账号已被禁用' });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: '密码错误' });
    }

    res.json({
      message: '登录成功',
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        avatar: user.avatar
      },
      token: generateToken({ id: user.id, phone: user.phone })
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
}

// 获取当前用户信息
function getCurrentUser(req, res) {
  try {
    const user = prepare(`
      SELECT u.id, u.phone, u.username, u.avatar, u.created_at
      FROM users u
      WHERE u.id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取记账统计
    const stats = prepare(`
      SELECT COUNT(*) as record_count,
             COUNT(DISTINCT record_date) as record_days
      FROM records WHERE user_id = ?
    `).get(req.user.id);

    res.json({ user: { ...user, ...stats } });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
}

// 更新用户信息
function updateProfile(req, res) {
  try {
    const { username, avatar } = req.body;
    
    prepare(`
      UPDATE users 
      SET username = COALESCE(?, username),
          avatar = COALESCE(?, avatar),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(username, avatar, req.user.id);

    const user = prepare('SELECT id, phone, username, avatar FROM users WHERE id = ?').get(req.user.id);

    res.json({ message: '更新成功', user });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '更新失败' });
  }
}

module.exports = { register, login, getCurrentUser, updateProfile };
