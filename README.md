# 记账App 项目启动指南

## 项目结构

```
记账App/
├── server/                 # 后端服务 (Node.js + Express)
├── user-app/               # 用户端 (UniApp + Vue3)
├── admin-app/              # 管理端 (Vue3 + Ant Design Vue)
├── PRD/                    # 产品需求文档
├── design/                 # 设计稿
└── docs/                   # 项目文档
```

---

## 后端服务 (server)

### 技术栈
- Node.js + Express
- SQLite (better-sqlite3)
- JWT 认证

### 启动步骤

```bash
cd server

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 服务运行在 http://localhost:3000
```

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| GET | /api/v1/auth/me | 获取当前用户 |
| GET | /api/v1/records | 获取账目列表 |
| POST | /api/v1/records | 创建账目 |
| GET | /api/v1/categories | 获取分类列表 |
| GET | /api/v1/statistics/home | 获取首页数据 |
| GET | /api/v1/statistics/monthly | 获取月度统计 |

---

## 用户端 (user-app)

### 技术栈
- UniApp + Vue 3 + TypeScript
- Wot Design Uni 组件库
- Pinia 状态管理

### 启动步骤

```bash
cd user-app

# 安装依赖
pnpm install

# 启动微信小程序开发
pnpm dev:mp-weixin

# 启动 H5 开发
pnpm dev:h5
```

### 已完成页面
- ✅ 登录页
- ✅ 首页（金额卡片、今日账目、快捷记账）
- ✅ 记账页（支出/收入、分类选择、金额输入）
- ✅ 统计页（收支概览、分类占比）
- ✅ 我的页（用户信息、功能入口）

---

## 管理端 (admin-app)

### 技术栈
- Vue 3 + TypeScript + Vite
- Ant Design Vue 组件库
- Pinia + Vue Router
- ECharts 图表

### 启动步骤

```bash
cd admin-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 已完成页面
- ✅ 登录页
- ✅ Dashboard（数据卡片、用户增长图表、今日流水）
- ✅ 用户管理（列表、详情、禁用/启用）
- ✅ 分类管理（支出/收入分类列表）

---

## 测试账号

后端启动后，可以使用以下方式创建测试账号：

1. 注册新账号：通过用户端注册页面
2. API 直接测试：
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"phone":"13800138000","password":"123456","username":"测试用户"}'
   ```

---

## 开发注意事项

1. **后端** 需要先启动，前端项目才能正常调用 API
2. **用户端** H5 模式已配置代理，小程序模式需要修改 API 地址
3. **管理端** 目前使用模拟数据，需要对接真实 API

---

## 下一步开发

- [ ] 用户端：账本管理、预算设置
- [ ] 管理端：账目管理、数据统计
- [ ] 后端：添加管理员权限验证
- [ ] 部署配置
