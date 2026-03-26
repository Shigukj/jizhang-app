# 记账App 开发指南

## 技术选型

### 管理端 (admin-app)
- **模板**: [antdv-next-admin](https://github.com/yelog/antdv-next-admin)
- **框架**: Vue 3 + TypeScript + Vite
- **UI**: Ant Design Vue
- **状态管理**: Pinia
- **用途**: 后台管理、数据统计、用户管理

### 用户端 (user-app)
- **模板**: wot-starter (基于 Wot Design Uni)
- **框架**: UniApp + Vue 3 + TypeScript
- **UI**: Wot Design Uni
- **状态管理**: Pinia
- **用途**: 记账、统计、个人中心
- **推荐模板**: [snail-uni](https://github.com/hu-snail/snail-uni)

### 服务端 (server)
- **运行时**: Node.js
- **框架**: Express / Fastify
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **API**: RESTful

---

## 项目结构

```
记账App/
├── PRD/                        # 产品需求文档
│   └── README.md
├── design/                     # 设计稿、原型
├── admin-app/                  # 管理端 (Vue3 + Ant Design Vue)
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   ├── components/         # 公共组件
│   │   ├── api/                # API 接口
│   │   ├── stores/             # Pinia 状态
│   │   └── router/             # 路由配置
│   └── package.json
├── user-app/                   # 用户端 (UniApp + Wot Design)
│   ├── src/
│   │   ├── pages/              # 页面
│   │   ├── components/         # 组件
│   │   ├── api/                # API 接口
│   │   ├── stores/             # Pinia 状态
│   │   └── static/             # 静态资源
│   └── package.json
├── server/                     # 后端服务
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── models/             # 数据模型
│   │   ├── routes/             # 路由
│   │   ├── middleware/         # 中间件
│   │   └── utils/              # 工具函数
│   └── package.json
└── docs/                       # 项目文档
    ├── TEAM_ROLES.md           # 团队角色
    ├── DEVELOPMENT_GUIDE.md    # 开发指南
    └── tests/                  # 测试用例
```

---

## 快速开始

### 1. 初始化管理端

```bash
# 克隆模板
cd 记账App
git clone https://github.com/yelog/antdv-next-admin.git admin-app
cd admin-app
pnpm install
pnpm dev
```

### 2. 初始化用户端

```bash
# 使用 snail-uni 脚手架创建
npx snail-uni create

# 或手动克隆模板
cd 记账App
git clone https://github.com/hu-snail/snail-uni.git user-app
cd user-app
pnpm install
pnpm dev:mp-weixin  # 微信小程序
```

### 3. 初始化服务端

```bash
cd 记账App/server
pnpm init
pnpm add express sqlite3 cors helmet
```

---

## 开发流程

### 阶段一：需求与设计

```
@产品经理 我要开发一个记账App，目标用户是个人和小微企业主。
核心功能包括：快速记账、分类管理、数据统计、预算管理、多账本。
请输出完整的 PRD 文档。
```

```
@UI设计师 根据 PRD 设计管理端和用户端的界面原型。
管理端需要：Dashboard、用户管理、账目管理、数据统计。
用户端需要：首页、记账、统计、我的。
```

### 阶段二：后端开发

```
@后端开发 请设计记账App的数据库模型，使用 SQLite：
1. 用户表 (users)
2. 账目表 (records)
3. 分类表 (categories)
4. 账本表 (ledgers)
5. 预算表 (budgets)
```

```
@后端开发 请实现用户认证 API，包括注册、登录、JWT 验证。
```

### 阶段三：前端开发

```
@前端开发(管理端) 请实现 Dashboard 页面，展示：
1. 今日/本月收支统计
2. 用户增长趋势图
3. 最近账目列表
```

```
@前端开发(用户端) 请实现记账页面，包括：
1. 收入/支出切换
2. 金额输入
3. 分类选择
4. 备注和日期
5. 保存按钮
```

### 阶段四：测试与部署

```
@测试工程师 请为记账功能编写测试用例，覆盖正常流程和边界情况。
```

---

## API 设计规范

### 基础路径

```
/api/v1
```

### 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/register | 用户注册 |
| POST | /auth/login | 用户登录 |
| GET | /users/profile | 获取用户信息 |
| GET | /records | 获取账目列表 |
| POST | /records | 创建账目 |
| PUT | /records/:id | 更新账目 |
| DELETE | /records/:id | 删除账目 |
| GET | /categories | 获取分类列表 |
| GET | /statistics/summary | 获取统计摘要 |
| GET | /budgets | 获取预算列表 |

---

## 数据库设计

### 用户表 (users)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | VARCHAR(50) | 用户名 |
| email | VARCHAR(100) | 邮箱 |
| password_hash | VARCHAR(255) | 密码哈希 |
| avatar | VARCHAR(255) | 头像 URL |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 账目表 (records)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户 ID |
| ledger_id | INTEGER | 账本 ID |
| category_id | INTEGER | 分类 ID |
| type | ENUM | income/expense |
| amount | DECIMAL(10,2) | 金额 |
| note | TEXT | 备注 |
| record_date | DATE | 记账日期 |
| created_at | DATETIME | 创建时间 |

### 分类表 (categories)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | VARCHAR(50) | 分类名称 |
| type | ENUM | income/expense |
| icon | VARCHAR(50) | 图标 |
| parent_id | INTEGER | 父分类 ID |
| sort_order | INTEGER | 排序 |

---

## 注意事项

1. **管理端** 使用 `@前端开发(管理端)` 或 `@前端开发-管理端`
2. **用户端** 使用 `@前端开发(用户端)` 或 `@前端开发-用户端`
3. 代码输出到对应目录后，需要手动初始化项目依赖
4. 建议先完成后端 API，再进行前端开发

---

## 下一步

1. 在 WebUI 中与 `@产品经理` 讨论需求
2. 与 `@后端开发` 设计数据库和 API
3. 初始化前端项目模板
4. 开始功能开发
