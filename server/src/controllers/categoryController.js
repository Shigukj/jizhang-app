const { prepare } = require('../config/database');

// 获取分类列表
function getCategories(req, res) {
  try {
    const user_id = req.user.id;
    const { type } = req.query;

    let sql = `
      SELECT * FROM categories 
      WHERE (is_system = 1 OR user_id = ?)
    `;
    const params = [user_id];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY sort_order ASC, id ASC';

    const categories = prepare(sql).all(...params);

    res.json({ categories });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({ error: '获取分类列表失败' });
  }
}

// 创建自定义分类
function createCategory(req, res) {
  try {
    const user_id = req.user.id;
    const { name, type, icon, color, parent_id } = req.body;

    if (!name || !type || !icon) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    const result = prepare(`
      INSERT INTO categories (name, type, icon, color, parent_id, is_system, user_id)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(name, type, icon || '📦', color || '#00A5A0', parent_id || null, user_id);

    const category = prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ message: '创建成功', category });
  } catch (error) {
    console.error('创建分类错误:', error);
    res.status(500).json({ error: '创建分类失败' });
  }
}

// 更新分类
function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { name, icon, color } = req.body;

    // 检查是否是用户的自定义分类
    const category = prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, user_id);
    if (!category) {
      return res.status(404).json({ error: '分类不存在或无权修改' });
    }

    prepare(`
      UPDATE categories 
      SET name = COALESCE(?, name),
          icon = COALESCE(?, icon),
          color = COALESCE(?, color)
      WHERE id = ?
    `).run(name, icon, color, id);

    const updated = prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({ message: '更新成功', category: updated });
  } catch (error) {
    console.error('更新分类错误:', error);
    res.status(500).json({ error: '更新分类失败' });
  }
}

// 删除分类
function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const category = prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(id, user_id);
    if (!category) {
      return res.status(404).json({ error: '分类不存在或无权删除' });
    }

    // 检查是否有关联账目
    const records = prepare('SELECT COUNT(*) as count FROM records WHERE category_id = ?').get(id);
    if (records.count > 0) {
      return res.status(400).json({ error: '该分类下有账目记录，无法删除' });
    }

    prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除分类错误:', error);
    res.status(500).json({ error: '删除分类失败' });
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
