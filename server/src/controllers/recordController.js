const { prepare } = require('../config/database');
const dayjs = require('dayjs');

// 创建账目
function createRecord(req, res) {
  try {
    const { category_id, type, amount, note, record_date, ledger_id } = req.body;
    const user_id = req.user.id;

    if (!category_id || !type || !amount || !record_date) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: '类型必须是 income 或 expense' });
    }

    const result = prepare(`
      INSERT INTO records (user_id, ledger_id, category_id, type, amount, note, record_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(user_id, ledger_id || null, category_id, type, amount, note || null, record_date);

    const record = prepare(`
      SELECT r.*, c.name as category_name, c.icon as category_icon
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ message: '记账成功', record });
  } catch (error) {
    console.error('创建账目错误:', error);
    res.status(500).json({ error: '记账失败' });
  }
}

// 获取账目列表
function getRecords(req, res) {
  try {
    const user_id = req.user.id;
    const { type, category_id, start_date, end_date, page = 1, limit = 20 } = req.query;

    let sql = `
      SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
        l.name as ledger_name
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN ledgers l ON r.ledger_id = l.id
      WHERE r.user_id = ?
    `;
    const params = [user_id];

    if (type) {
      sql += ' AND r.type = ?';
      params.push(type);
    }
    if (category_id) {
      sql += ' AND r.category_id = ?';
      params.push(category_id);
    }
    if (start_date) {
      sql += ' AND r.record_date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND r.record_date <= ?';
      params.push(end_date);
    }

    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM (${sql})`;
    const { total } = prepare(countSql).get(...params);

    // 分页
    sql += ' ORDER BY r.record_date DESC, r.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const records = prepare(sql).all(...params);

    res.json({
      records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取账目列表错误:', error);
    res.status(500).json({ error: '获取账目列表失败' });
  }
}

// 获取单条账目
function getRecordById(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const record = prepare(`
      SELECT r.*, c.name as category_name, c.icon as category_icon,
        l.name as ledger_name
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN ledgers l ON r.ledger_id = l.id
      WHERE r.id = ? AND r.user_id = ?
    `).get(id, user_id);

    if (!record) {
      return res.status(404).json({ error: '账目不存在' });
    }

    res.json({ record });
  } catch (error) {
    console.error('获取账目详情错误:', error);
    res.status(500).json({ error: '获取账目详情失败' });
  }
}

// 更新账目
function updateRecord(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { category_id, type, amount, note, record_date, ledger_id } = req.body;

    // 检查账目是否存在
    const existing = prepare('SELECT id FROM records WHERE id = ? AND user_id = ?').get(id, user_id);
    if (!existing) {
      return res.status(404).json({ error: '账目不存在' });
    }

    prepare(`
      UPDATE records 
      SET category_id = COALESCE(?, category_id),
          type = COALESCE(?, type),
          amount = COALESCE(?, amount),
          note = COALESCE(?, note),
          record_date = COALESCE(?, record_date),
          ledger_id = COALESCE(?, ledger_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(category_id, type, amount, note, record_date, ledger_id, id, user_id);

    const record = prepare(`
      SELECT r.*, c.name as category_name, c.icon as category_icon
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = ?
    `).get(id);

    res.json({ message: '更新成功', record });
  } catch (error) {
    console.error('更新账目错误:', error);
    res.status(500).json({ error: '更新失败' });
  }
}

// 删除账目
function deleteRecord(req, res) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const existing = prepare('SELECT id FROM records WHERE id = ? AND user_id = ?').get(id, user_id);
    if (!existing) {
      return res.status(404).json({ error: '账目不存在' });
    }

    prepare('DELETE FROM records WHERE id = ? AND user_id = ?').run(id, user_id);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除账目错误:', error);
    res.status(500).json({ error: '删除失败' });
  }
}

// 获取今日账目
function getTodayRecords(req, res) {
  try {
    const user_id = req.user.id;
    const today = dayjs().format('YYYY-MM-DD');

    const records = prepare(`
      SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.user_id = ? AND r.record_date = ?
      ORDER BY r.created_at DESC
    `).all(user_id, today);

    const summary = prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date = ?
    `).get(user_id, today);

    res.json({ records, summary });
  } catch (error) {
    console.error('获取今日账目错误:', error);
    res.status(500).json({ error: '获取今日账目失败' });
  }
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getTodayRecords
};
