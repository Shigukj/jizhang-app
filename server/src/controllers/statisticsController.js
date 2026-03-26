const { prepare } = require('../config/database');
const dayjs = require('dayjs');

// 获取月度概览
function getMonthlySummary(req, res) {
  try {
    const user_id = req.user.id;
    const { year, month } = req.query;

    const targetYear = year || dayjs().year();
    const targetMonth = month || dayjs().month() + 1;

    const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
    const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD');

    const summary = prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date BETWEEN ? AND ?
    `).get(user_id, startDate, endDate);

    const balance = (summary.income || 0) - (summary.expense || 0);

    // 获取上月数据用于对比
    const lastMonthStart = dayjs(startDate).subtract(1, 'month').format('YYYY-MM-01');
    const lastMonthEnd = dayjs(lastMonthStart).endOf('month').format('YYYY-MM-DD');

    const lastMonthSummary = prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date BETWEEN ? AND ?
    `).get(user_id, lastMonthStart, lastMonthEnd);

    res.json({
      period: { year: Number(targetYear), month: Number(targetMonth) },
      current: {
        expense: summary.expense || 0,
        income: summary.income || 0,
        balance
      },
      comparison: {
        expenseChange: lastMonthSummary.expense > 0 
          ? (((summary.expense || 0) - lastMonthSummary.expense) / lastMonthSummary.expense * 100).toFixed(1)
          : 0,
        incomeChange: lastMonthSummary.income > 0
          ? (((summary.income || 0) - lastMonthSummary.income) / lastMonthSummary.income * 100).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    console.error('获取月度概览错误:', error);
    res.status(500).json({ error: '获取月度概览失败' });
  }
}

// 获取分类统计
function getCategoryStatistics(req, res) {
  try {
    const user_id = req.user.id;
    const { type = 'expense', start_date, end_date } = req.query;

    const startDate = start_date || dayjs().startOf('month').format('YYYY-MM-DD');
    const endDate = end_date || dayjs().endOf('month').format('YYYY-MM-DD');

    const statistics = prepare(`
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.color,
        SUM(r.amount) as total,
        COUNT(r.id) as count
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.user_id = ? AND r.type = ? AND r.record_date BETWEEN ? AND ?
      GROUP BY c.id
      ORDER BY total DESC
    `).all(user_id, type, startDate, endDate);

    const total = statistics.reduce((sum, item) => sum + (item.total || 0), 0);

    const result = statistics.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.total || 0) / total * 100).toFixed(1) : 0
    }));

    res.json({
      statistics: result,
      total,
      period: { start_date: startDate, end_date: endDate }
    });
  } catch (error) {
    console.error('获取分类统计错误:', error);
    res.status(500).json({ error: '获取分类统计失败' });
  }
}

// 获取趋势数据
function getTrendStatistics(req, res) {
  try {
    const user_id = req.user.id;
    const { period = 'month' } = req.query;

    let startDate, endDate;

    if (period === 'week') {
      startDate = dayjs().startOf('week').format('YYYY-MM-DD');
      endDate = dayjs().endOf('week').format('YYYY-MM-DD');
    } else if (period === 'year') {
      startDate = dayjs().startOf('year').format('YYYY-MM-DD');
      endDate = dayjs().endOf('year').format('YYYY-MM-DD');
    } else {
      startDate = dayjs().startOf('month').format('YYYY-MM-DD');
      endDate = dayjs().endOf('month').format('YYYY-MM-DD');
    }

    const trends = prepare(`
      SELECT 
        record_date as date,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date BETWEEN ? AND ?
      GROUP BY record_date
      ORDER BY record_date ASC
    `).all(user_id, startDate, endDate);

    res.json({
      trends,
      period: { start_date: startDate, end_date: endDate, type: period }
    });
  } catch (error) {
    console.error('获取趋势数据错误:', error);
    res.status(500).json({ error: '获取趋势数据失败' });
  }
}

// 获取首页数据
function getHomeData(req, res) {
  try {
    const user_id = req.user.id;
    const today = dayjs().format('YYYY-MM-DD');
    const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');
    const monthEnd = dayjs().endOf('month').format('YYYY-MM-DD');

    // 本月统计
    const monthSummary = prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date BETWEEN ? AND ?
    `).get(user_id, monthStart, monthEnd);

    // 今日账目
    const todayRecords = prepare(`
      SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.user_id = ? AND r.record_date = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all(user_id, today);

    // 今日统计
    const todaySummary = prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
      FROM records
      WHERE user_id = ? AND record_date = ?
    `).get(user_id, today);

    // 常用分类
    const recentCategories = prepare(`
      SELECT c.*, COUNT(r.id) as usage_count
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.user_id = ? AND r.type = 'expense'
      GROUP BY c.id
      ORDER BY MAX(r.created_at) DESC
      LIMIT 6
    `).all(user_id);

    res.json({
      monthSummary: {
        expense: monthSummary.expense || 0,
        income: monthSummary.income || 0,
        balance: (monthSummary.income || 0) - (monthSummary.expense || 0)
      },
      todayRecords,
      todaySummary,
      recentCategories
    });
  } catch (error) {
    console.error('获取首页数据错误:', error);
    res.status(500).json({ error: '获取首页数据失败' });
  }
}

module.exports = {
  getMonthlySummary,
  getCategoryStatistics,
  getTrendStatistics,
  getHomeData
};
