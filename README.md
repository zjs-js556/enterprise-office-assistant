# 企业办公助手 (Enterprise Office Assistant)

企业级内部移动办公助手 App，为中小企业提供员工管理、设备资产管理和设备分类管理等核心办公功能。

## 1. 项目介绍

本系统采用前后端分离架构，后端提供 RESTful API 接口，前端为 React Native 跨平台移动应用，支持 iOS 与 Android。

**核心能力：**

- 管理员 JWT 认证登录
- 员工信息 CRUD（创建/查询/修改/删除）
- 设备分类管理（支持关联设备数量统计、删除保护）
- 设备资产管理（支持按分类筛选、分类-设备关联查询）
- API 请求全量日志记录（IP/方法/路径/状态码/耗时）
- 统一接口响应格式 `{ code, message, data }`
- 全局异常处理（400/401/403/404/409/422/500）

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 移动端 | React Native 0.76 + Expo SDK 54 + TypeScript 5.7 |
| 导航 | React Navigation 7（Stack + Bottom Tabs） |
| HTTP 客户端 | axios（拦截器自动注入 JWT） |
| 本地存储 | AsyncStorage |
| 后端框架 | Python Flask 3.1 + Flask-Smorest 0.47 |
| ORM | SQLAlchemy + Flask-Migrate |
| 认证 | Flask-JWT-Extended + PyJWT |
| 数据库 | MySQL 8.0 |
| 密码加密 | werkzeug.security（scrypt） |
| 跨域 | Flask-CORS |
| API 文档 | OpenAPI 3.0 + Swagger UI |

## 3. 项目结构

```
enterprise-office-assistant/
├── README.md                    # 项目总览（本文件）
│
├── backend/                     # Python Flask 后端
│   ├── app/
│   │   ├── __init__.py          # Flask 工厂函数 create_app()
│   │   ├── config.py            # 配置管理（从 .env 读取）
│   │   ├── extensions.py        # Flask 扩展（SQLAlchemy/Migrate/JWT/CORS/Api）
│   │   ├── models/              # SQLAlchemy 数据模型
│   │   │   ├── admin_user.py    # 管理员用户表
│   │   │   ├── employee.py      # 员工表
│   │   │   ├── category.py      # 设备分类表
│   │   │   └── device.py        # 设备表
│   │   ├── schemas/             # Marshmallow 序列化/校验 Schema
│   │   │   ├── auth.py
│   │   │   ├── employee_schema.py
│   │   │   ├── category_schema.py
│   │   │   └── device_schema.py
│   │   ├── routes/              # API 路由（flask-smorest Blueprint）
│   │   │   ├── health.py        # GET /api/v1/health
│   │   │   ├── auth.py          # POST /api/v1/auth/login, GET /me
│   │   │   ├── employee_routes.py
│   │   │   ├── category_routes.py
│   │   │   └── device_routes.py
│   │   ├── services/            # 业务逻辑层
│   │   │   ├── auth.py
│   │   │   ├── employee_service.py
│   │   │   ├── category_service.py
│   │   │   └── device_service.py
│   │   ├── middlewares/         # 中间件
│   │   │   ├── error_handler.py # 全局异常处理
│   │   │   ├── request_logger.py # API 请求日志（before/after_request）
│   │   │   └── auth_required.py  # JWT 装饰器
│   │   ├── utils/               # 工具函数
│   │   │   ├── response.py      # success_response / error_response
│   │   │   ├── jwt.py           # generate_token / verify_token
│   │   │   └── logger.py        # RotatingFileHandler 日志配置
│   │   └── exceptions/          # 自定义异常
│   │       └── BusinessException
│   ├── migrations/              # Flask-Migrate 数据库迁移文件
│   ├── logs/                    # 日志文件（app.log + 滚动备份）
│   ├── requirements.txt         # Python 依赖清单
│   ├── .env.example             # 环境变量模板
│   ├── seed.py                  # 数据库初始化 + 默认管理员
│   └── run.py                   # 应用入口
│
├── mobile/                      # React Native + Expo 移动端
│   ├── App.tsx                  # 入口（AuthProvider → AppNavigator）
│   ├── src/
│   │   ├── api/                 # HTTP 客户端 + 4 个模块 API
│   │   │   ├── http.ts          # axios 实例（拦截器）
│   │   │   ├── authApi.ts
│   │   │   ├── employeeApi.ts
│   │   │   ├── categoryApi.ts
│   │   │   └── deviceApi.ts
│   │   ├── components/          # 6 个通用 UI 组件
│   │   │   ├── AppButton.tsx    # 主按钮/危险按钮/描边按钮
│   │   │   ├── AppInput.tsx     # 表单输入框（校验错误提示）
│   │   │   ├── InfoCard.tsx     # 信息卡片
│   │   │   ├── EmptyState.tsx   # 空状态占位
│   │   │   ├── ConfirmDialog.tsx # 确认删除弹窗
│   │   │   └── LoadingView.tsx  # 加载动画
│   │   ├── screens/             # 8 个页面
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── EmployeeListScreen.tsx
│   │   │   ├── EmployeeDetailScreen.tsx
│   │   │   ├── EmployeeFormScreen.tsx
│   │   │   ├── CategoryListScreen.tsx
│   │   │   ├── DeviceListScreen.tsx
│   │   │   └── DeviceFormScreen.tsx
│   │   ├── navigation/          # React Navigation 配置
│   │   │   └── AppNavigator.tsx
│   │   ├── context/             # AuthContext（登录状态管理）
│   │   │   └── AuthContext.tsx
│   │   ├── types/index.ts       # TypeScript 类型定义
│   │   └── utils/               # 工具
│   │       ├── theme.ts         # 主题色/间距/字号常量
│   │       └── navigation.ts    # 导航 ref
│   ├── app.json                 # Expo 配置
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                        # 项目文档
    ├── api.md                   # 完整接口文档
    ├── database.md              # 数据库设计
    ├── design.md                # 前端设计规范 + Figma 链接
    └── demo-script.md           # 比赛演示讲解稿
```

## 4. 后端启动步骤

### 前置条件

- Python 3.12+
- MySQL 8.0（已安装并运行）
- pip

### 步骤

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境（推荐）
python -m venv venv

# 3. 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，修改数据库连接信息（见第 7 节）

# 6. 初始化数据库 + 创建默认管理员
python seed.py

# 7. 启动服务
python run.py
```

服务默认运行在 `http://localhost:5000`。

Swagger 接口文档：`http://localhost:5000/docs/swagger`

## 5. 前端启动步骤

### 前置条件

- Node.js 18+
- Expo Go App（手机端）或 Android/iOS 模拟器

### 步骤

```bash
# 1. 进入移动端目录
cd mobile

# 2. 安装依赖
npm install

# 3. 启动 Expo 开发服务器
npx expo start

# 4. 选择运行方式
# - 扫码：手机安装 Expo Go，扫描终端二维码
# - Android 模拟器：按 a
# - iOS 模拟器：按 i
# - Web：按 w
```

> **注意：** Android 模拟器中 API 地址默认为 `http://10.0.2.2:5000/api/v1`（模拟器访问宿主机）。iOS 模拟器或真机请修改 `mobile/src/api/http.ts` 中的 `baseURL` 为 `http://<本机IP>:5000/api/v1`。

## 6. MySQL 数据库配置

### 安装与启动

```bash
# macOS (Homebrew)
brew install mysql@8.0
brew services start mysql@8.0

# Windows
# 下载 MySQL 8.0 安装包或使用 phpStudy 等集成环境

# Linux (Ubuntu)
sudo apt install mysql-server-8.0
sudo systemctl start mysql
```

### 创建数据库

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE enterprise_office
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- （可选）创建专用用户
CREATE USER 'eoa_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON enterprise_office.* TO 'eoa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 7. .env 示例说明

复制 `.env.example` 为 `.env` 并按实际情况修改：

```bash
# Flask 应用密钥（生产环境请使用随机字符串）
SECRET_KEY=change-me-to-a-random-string

# 运行环境：development / production
FLASK_ENV=development

# JWT 签名密钥（生产环境必须修改）
JWT_SECRET_KEY=change-me-to-a-random-jwt-secret

# 数据库连接字符串
# 格式：mysql+pymysql://用户名:密码@主机:端口/数据库名
DATABASE_URL=mysql+pymysql://root:password@127.0.0.1:3306/enterprise_office

# 日志级别：DEBUG / INFO / WARNING / ERROR
LOG_LEVEL=DEBUG

# 日志文件路径
LOG_FILE=logs/app.log

# 单个日志文件最大大小（字节），默认 10MB
LOG_MAX_BYTES=10485760

# 日志文件备份数量
LOG_BACKUP_COUNT=10
```

## 8. 数据库初始化方式

项目使用 SQLAlchemy ORM + Flask-Migrate 管理数据库。

### 方式一：seed.py 快速初始化（推荐）

```bash
cd backend
python seed.py
```

该脚本会：
1. 创建所有数据表（`db.create_all()`）
2. 插入默认管理员账号（如不存在）
3. 输出：`默认管理员已创建: username=admin, role=admin`

### 方式二：Flask-Migrate 迁移（适合版本迭代）

```bash
cd backend
flask db init          # 仅首次执行，创建迁移目录
flask db migrate -m "初始化数据库"
flask db upgrade       # 执行迁移
python -c "from app import create_app; from app.extensions import db; from app.services.auth import create_default_admin; app=create_app(); app.app_context().push(); create_default_admin()"
```

## 9. 默认管理员账号

| 字段 | 值 |
|------|-----|
| 用户名 | `admin` |
| 密码 | `admin123456` |
| 角色 | admin |

> **安全提醒：** 生产环境请立即修改默认密码。密码使用 werkzeug scrypt 算法加密存储，数据库不存明文。

## 10. API 接口列表

详见 [docs/api.md](docs/api.md)。

| 方法 | 路径 | 认证 | 说明 |
|------|------|:----:|------|
| GET | `/api/v1/health` | - | 健康检查 |
| POST | `/api/v1/auth/login` | - | 管理员登录 |
| GET | `/api/v1/auth/me` | Bearer | 获取当前用户信息 |
| GET | `/api/v1/employees` | Bearer | 员工列表（分页） |
| POST | `/api/v1/employees` | Bearer | 创建员工 |
| GET | `/api/v1/employees/<id>` | Bearer | 员工详情 |
| PUT | `/api/v1/employees/<id>` | Bearer | 修改员工 |
| DELETE | `/api/v1/employees/<id>` | Bearer | 删除员工 |
| GET | `/api/v1/categories` | Bearer | 分类列表（含设备数） |
| POST | `/api/v1/categories` | Bearer | 创建分类 |
| PUT | `/api/v1/categories/<id>` | Bearer | 修改分类 |
| DELETE | `/api/v1/categories/<id>` | Bearer | 删除分类（有设备时 409） |
| GET | `/api/v1/devices` | Bearer | 设备列表（支持分类筛选） |
| POST | `/api/v1/devices` | Bearer | 创建设备 |
| GET | `/api/v1/categories/<id>/devices` | Bearer | 某分类下的设备 |
| PUT | `/api/v1/devices/<id>` | Bearer | 修改设备 |
| DELETE | `/api/v1/devices/<id>` | Bearer | 删除设备 |

## 11. 常见问题

### Q1：启动报错 "Can't connect to MySQL server"

确保 MySQL 服务正在运行：
```bash
# macOS
brew services list | grep mysql

# Windows
# 检查 phpStudy 或其他 MySQL 服务是否启动

# Linux
sudo systemctl status mysql
```

### Q2：登录后 token 过期怎么办？

JWT token 有效期 2 小时。过期后 axios 响应拦截器会自动清除本地 token 并跳转登录页，重新登录即可。

### Q3：前端连不上后端 API？

- **Android 模拟器**：确保 `http.ts` 中 `baseURL` 为 `http://10.0.2.2:5000/api/v1`
- **iOS 模拟器**：尝试 `http://localhost:5000/api/v1`
- **真机**：使用电脑局域网 IP，确保手机和电脑在同一网络
- **CORS 错误**：后端已配置 `Flask-CORS`，检查是否正确加载

### Q4：如何查看 API 请求日志？

后端日志同时输出到控制台和 `backend/logs/app.log`，每条请求格式：
```
2026-05-22 15:25:40 [INFO] request_logger:19 - 127.0.0.1 GET /api/v1/employees 200 3ms
```

### Q5：分类下有设备时删除会怎样？

返回 409 状态码：`{ "code": 409, "message": "分类下存在设备，无法删除", "data": null }`

### Q6：如何新增 API 接口？

按照分层架构添加文件：
1. `models/` — 新建数据模型
2. `schemas/` — 新建 Marshmallow Schema
3. `services/` — 新建业务逻辑函数
4. `routes/` — 新建 Blueprint + 路由函数
5. 在 `routes/__init__.py` 注册新蓝图

## 12. 功能演示流程

### 后端 API 演示

```bash
# 1. 健康检查
curl http://localhost:5000/api/v1/health

# 2. 登录获取 TOKEN
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

# 3. 创建员工
curl -X POST http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","age":28,"email":"zhangsan@company.com"}'

# 4. 查询员工列表
curl http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer $TOKEN"

# 5. 创建设备分类
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"笔记本电脑"}'

# 6. 创建设备（关联分类）
curl -X POST http://localhost:5000/api/v1/devices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"ThinkPad X1","model":"Carbon Gen11","category_id":1}'

# 7. 查看分类下的设备
curl http://localhost:5000/api/v1/categories/1/devices \
  -H "Authorization: Bearer $TOKEN"

# 8. 尝试删除有设备的分类（应返回 409）
curl -X DELETE http://localhost:5000/api/v1/categories/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 前端演示

1. 启动后端 `python run.py`，确保 MySQL 已连接
2. 启动前端 `npx expo start`
3. 在模拟器/手机打开 App
4. 使用 `admin / admin123456` 登录
5. 依次演示：首页 → 员工管理 → 新增员工 → 员工详情 → 分类管理 → 设备管理
6. 展示：下拉刷新、长按删除确认弹窗、分类筛选、空状态占位
# webhook test Fri May 22 05:27:54 PM CST 2026
#   w e b h o o k   v e r i f y   0 5 / 2 5 / 2 0 2 6   1 4 : 2 8 : 4 1  
 