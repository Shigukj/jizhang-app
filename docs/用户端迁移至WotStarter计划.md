# 用户端迁移至 Wot Starter 计划

## 📊 当前状态

### 现有项目特征

| 特征 | 状态 | 说明 |
|------|------|------|
| 基础框架 | ✅ uni-app | 基于 @dcloudio/uni-app |
| 组件库 | ✅ wot-design-uni | 已安装 v1.2.0 |
| 状态管理 | ✅ Pinia | 已安装并使用 |
| 路由 | ⚠️ uni-app 原生 | 使用 pages.json |
| 请求库 | ❌ 自定义封装 | 未使用 Alova |
| CSS 框架 | ❌ 普通样式 | 未使用 UnoCSS |
| TypeScript | ❌ 无 | 使用纯 JavaScript |
| Skills | ✅ 已集成 | 核心 Skills 已添加 |

### Wot Starter 特征对比

| 特征 | Wot Starter | 当前项目 |
|------|-------------|---------|
| vitesse-uni-app | ✅ | ❌ |
| @wot-ui/router | ✅ | ❌ |
| UnoCSS | ✅ | ❌ |
| Alova | ✅ | ❌ |
| TypeScript | ✅ | ❌ |
| .agent/skills | ✅ | ✅ |

---

## 🔍 结论

**当前用户端不是 Wot Starter 模板**，而是基于 uni-app + wot-design-uni 的自定义项目。

---

## 📋 迁移方案

### 方案一：完整迁移到 Wot Starter（风险高）

#### 工作量评估
- ⏱️ **预计时间**：2-3 天
- 🔄 **代码重构**：90%
- ⚠️ **风险等级**：高

#### 迁移步骤

1. **备份现有代码**
   ```bash
   git checkout -b backup-before-wot-starter
   ```

2. **克隆 Wot Starter**
   ```bash
   git clone https://github.com/wot-ui/wot-starter.git
   ```

3. **迁移业务代码**
   - 复制 `src/pages` 到新项目
   - 复制 `src/api` 到新项目
   - 复制 `src/stores` 到新项目
   - 调整为 TypeScript 语法

4. **调整配置文件**
   - 修改 `pages.json`
   - 修改 `manifest.json`
   - 配置路由

5. **测试验证**
   - H5 端测试
   - 小程序端测试

#### 优缺点

**优点**：
- ✅ 完整的 Wot Starter 功能
- ✅ TypeScript 类型安全
- ✅ 更好的开发体验
- ✅ 统一的项目规范

**缺点**：
- ❌ 工作量大
- ❌ 破坏性变更
- ❌ 需要学习新语法
- ❌ 可能引入新问题

---

### 方案二：增量集成 Wot Starter 功能（推荐）

#### 工作量评估
- ⏱️ **预计时间**：0.5-1 天
- 🔄 **代码重构**：20%
- ⚠️ **风险等级**：低

#### 已完成
- ✅ 添加 .agent/skills 目录
- ✅ 创建核心 Skills（wot-ui、uni-page-generator、pinia-store-generator、global-feedback、api-request）

#### 可选增强

1. **集成 UnoCSS**
   - 安装依赖
   - 创建配置文件
   - 迁移样式

2. **集成 @wot-ui/router**
   - 替换 uni-app 原生路由
   - 调整页面跳转

3. **添加 TypeScript**
   - 配置 tsconfig.json
   - 逐步添加类型定义

4. **集成 Alova**
   - 替换现有请求库
   - 统一 API 调用

#### 优缺点

**优点**：
- ✅ 工作量小
- ✅ 风险可控
- ✅ 可分步实施
- ✅ 保持现有功能

**缺点**：
- ❌ 功能不完整
- ❌ 可能存在兼容性问题

---

### 方案三：仅使用 Skills（当前方案）

#### 特点
- ✅ 已完成
- ✅ 零风险
- ✅ 即用即用

#### 说明
当前已添加核心 Skills，可以满足大部分 AI 辅助开发需求。

---

## 🎯 建议

### 推荐方案

**方案二：增量集成 Wot Starter 功能**

理由：
1. 风险可控，可以逐步验证
2. 根据实际需求选择集成哪些功能
3. 不影响现有业务功能

### 执行计划

#### 阶段一（已完成）
- ✅ 添加 .agent/skills 目录
- ✅ 创建核心 Skills

#### 阶段二（可选）
- 评估是否需要 UnoCSS
- 评估是否需要 @wot-ui/router
- 评估是否需要 TypeScript

#### 阶段三（评估后决定）
- 根据阶段二的评估结果
- 决定是否进行完整迁移

---

## 📝 注意事项

1. **备份先行**：任何迁移操作前先备份代码
2. **分步验证**：每完成一个功能就测试验证
3. **团队沟通**：迁移前与团队沟通确认
4. **回滚预案**：准备回滚方案

---

## 🔗 相关资源

- Wot Starter: https://github.com/wot-ui/wot-starter
- Wot Design Uni: https://wot-design-uni.netlify.app/
- 用户端项目: ./user-app/
