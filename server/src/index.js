require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { initDatabase } = require('./config/database');

async function startServer() {
  // 初始化数据库
  await initDatabase();
  
  // 导入路由（在数据库初始化之后）
  const authRoutes = require('./routes/auth');
  const recordRoutes = require('./routes/records');
  const categoryRoutes = require('./routes/categories');
  const statisticsRoutes = require('./routes/statistics');
  const userRoutes = require('./routes/users');

  const app = express();

  // 中间件
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API 路由
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/records', recordRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/statistics', statisticsRoutes);
  app.use('/api/v1/users', userRoutes);

  // 健康检查
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 处理
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // 错误处理
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
