# API 接口文档

Base URL: `http://localhost:5000/api/v1`

## 统一响应格式

所有接口返回统一 JSON 格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 状态码说明

| code | 说明 | 触发场景 |
|------|------|---------|
| 200 | 成功 | 正常返回 |
| 400 | 参数错误 | Flask 自动解析请求失败 |
| 401 | 未认证 | token 缺失/过期/无效 |
| 403 | 无权限 | 角色权限不足 |
| 404 | 资源不存在 | 查询/修改/删除不存在的记录 |
| 409 | 业务冲突 | 邮箱重复、分类下有设备时删除 |
| 422 | 请求参数校验失败 | Marshmallow Schema 校验不通过 |
| 500 | 服务器内部错误 | 未捕获的异常 |

---

## 1. 健康检查

### GET /api/v1/health

无需认证。

**响应示例：**
```json
{
  "code": 200,
  "message": "服务运行正常",
  "data": { "status": "ok" }
}
```

---

## 2. 认证模块

### 2.1 登录

**POST /api/v1/auth/login**

无需认证。

**请求体：**
```json
{
  "username": "admin",
  "password": "admin123456"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| username | string | 是 | 用户名，1-50 字符 |
| password | string | 是 | 密码，1-128 字符 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin_id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| token | string | JWT token，有效期 2 小时 |
| admin_id | integer | 管理员 ID |
| username | string | 用户名 |
| role | string | 角色 |

**失败响应 (401)：**
```json
{
  "code": 401,
  "message": "账号或密码错误",
  "data": null
}
```

**curl 示例：**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

### 2.2 获取当前用户信息

**GET /api/v1/auth/me**

需要 `Authorization: Bearer <token>`。

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "admin_id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**失败响应 (401)：**
```json
{
  "code": 401,
  "message": "未授权访问，请先登录",
  "data": null
}
```

**curl 示例：**
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. 员工管理模块

所有接口需要 `Authorization: Bearer <token>`。

### 3.1 创建员工

**POST /api/v1/employees**

**请求体：**
```json
{
  "name": "张三",
  "age": 28,
  "email": "zhangsan@company.com"
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|:---:|---------|
| name | string | 是 | 1-20 字符 |
| age | integer | 是 | 18-60 |
| email | string | 是 | 合法邮箱格式，唯一 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "张三",
    "age": 28,
    "email": "zhangsan@company.com",
    "created_at": "2026-05-22T07:33:34",
    "updated_at": "2026-05-22T07:33:34"
  }
}
```

**校验失败 (422)：**
```json
{
  "code": 422,
  "message": "请求参数校验失败",
  "data": {
    "name": ["Length must be between 1 and 20."],
    "age": ["Must be greater than or equal to 18 and less than or equal to 60."],
    "email": ["Not a valid email address."]
  }
}
```

**邮箱重复 (409)：**
```json
{
  "code": 409,
  "message": "该邮箱已存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X POST http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","age":28,"email":"zhangsan@company.com"}'
```

### 3.2 查询员工列表

**GET /api/v1/employees?page=1&page_size=20**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:---:|--------|------|
| page | integer | 否 | 1 | 页码 |
| page_size | integer | 否 | 20 | 每页条数 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "张三",
        "age": 28,
        "email": "zhangsan@company.com",
        "created_at": "2026-05-22T07:33:34",
        "updated_at": "2026-05-22T07:33:34"
      }
    ],
    "total": 1,
    "page": 1,
    "page_size": 20
  }
}
```

按 `created_at` 倒序排列。

**curl 示例：**
```bash
curl "http://localhost:5000/api/v1/employees?page=1&page_size=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 3.3 查询员工详情

**GET /api/v1/employees/<id>**

**成功响应 (200)：** 同创建响应。

**失败响应 (404)：**
```json
{
  "code": 404,
  "message": "员工不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl http://localhost:5000/api/v1/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3.4 修改员工

**PUT /api/v1/employees/<id>**

支持部分更新，只传需要修改的字段。

**请求体（部分更新示例）：**
```json
{
  "name": "张三丰",
  "age": 30
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|:---:|---------|
| name | string | 否 | 1-20 字符 |
| age | integer | 否 | 18-60 |
| email | string | 否 | 合法邮箱格式，唯一 |

**成功响应 (200)：** 返回更新后的完整员工信息。

**失败响应 (404)：**
```json
{
  "code": 404,
  "message": "员工不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X PUT http://localhost:5000/api/v1/employees/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"张三丰","age":30}'
```

### 3.5 删除员工

**DELETE /api/v1/employees/<id>**

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**失败响应 (404)：**
```json
{
  "code": 404,
  "message": "员工不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X DELETE http://localhost:5000/api/v1/employees/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. 设备分类管理模块

所有接口需要 `Authorization: Bearer <token>`。

### 4.1 创建分类

**POST /api/v1/categories**

**请求体：**
```json
{
  "name": "笔记本电脑"
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|:---:|---------|
| name | string | 是 | 1-20 字符 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "笔记本电脑",
    "device_count": 0,
    "created_at": "2026-05-22T07:38:30",
    "updated_at": "2026-05-22T07:38:30"
  }
}
```

**curl 示例：**
```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"笔记本电脑"}'
```

### 4.2 查询分类列表

**GET /api/v1/categories**

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "笔记本电脑",
      "device_count": 2,
      "created_at": "2026-05-22T07:38:30",
      "updated_at": "2026-05-22T07:38:30"
    }
  ]
}
```

`device_count` 为该分类下的设备总数。按 `created_at` 倒序。

**curl 示例：**
```bash
curl http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN"
```

### 4.3 修改分类

**PUT /api/v1/categories/<id>**

**请求体：**
```json
{
  "name": "笔记本"
}
```

**成功响应 (200)：** 返回更新后的分类信息。

**失败响应 (404)：**
```json
{
  "code": 404,
  "message": "分类不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X PUT http://localhost:5000/api/v1/categories/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"笔记本"}'
```

### 4.4 删除分类

**DELETE /api/v1/categories/<id>**

删除前检查该分类下是否有设备。如果有设备，禁止删除。

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**有设备时 (409)：**
```json
{
  "code": 409,
  "message": "分类下存在设备，无法删除",
  "data": null
}
```

**不存在 (404)：**
```json
{
  "code": 404,
  "message": "分类不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X DELETE http://localhost:5000/api/v1/categories/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. 设备管理模块

所有接口需要 `Authorization: Bearer <token>`。

### 5.1 创建设备

**POST /api/v1/devices**

**请求体：**
```json
{
  "name": "ThinkPad X1",
  "model": "Carbon Gen11",
  "category_id": 1
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|:---:|---------|
| name | string | 是 | 1-100 字符 |
| model | string | 否 | 最大 100 字符 |
| category_id | integer | 是 | 必须存在于 categories 表 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "ThinkPad X1",
    "model": "Carbon Gen11",
    "category_id": 1,
    "created_at": "2026-05-22T07:38:30",
    "updated_at": "2026-05-22T07:38:30"
  }
}
```

**分类不存在 (404)：**
```json
{
  "code": 404,
  "message": "分类不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X POST http://localhost:5000/api/v1/devices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"ThinkPad X1","model":"Carbon Gen11","category_id":1}'
```

### 5.2 查询设备列表

**GET /api/v1/devices?category_id=1**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:---:|--------|------|
| category_id | integer | 否 | - | 按分类筛选，不传则返回全部 |

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "name": "ThinkPad X1",
      "model": "Carbon Gen11",
      "category_id": 1,
      "created_at": "2026-05-22T07:38:30",
      "updated_at": "2026-05-22T07:38:30"
    }
  ]
}
```

按 `created_at` 倒序。

**curl 示例：**
```bash
# 全部设备
curl http://localhost:5000/api/v1/devices \
  -H "Authorization: Bearer $TOKEN"

# 按分类筛选
curl "http://localhost:5000/api/v1/devices?category_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.3 查询分类下的设备

**GET /api/v1/categories/<category_id>/devices**

嵌套路由，返回指定分类下的所有设备。

**成功响应 (200)：** 格式同 5.2 的 data 数组。

**分类不存在 (404)：**
```json
{
  "code": 404,
  "message": "分类不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl http://localhost:5000/api/v1/categories/1/devices \
  -H "Authorization: Bearer $TOKEN"
```

### 5.4 修改设备

**PUT /api/v1/devices/<id>**

支持部分更新。

**请求体：**
```json
{
  "model": "Carbon Gen12"
}
```

| 字段 | 类型 | 必填 | 校验规则 |
|------|------|:---:|---------|
| name | string | 否 | 1-100 字符 |
| model | string | 否 | 最大 100 字符 |
| category_id | integer | 否 | 必须存在于 categories 表 |

**成功响应 (200)：** 返回更新后的完整设备信息。

**失败响应：**
- 404 — 设备不存在
- 404 — 新分类不存在

**curl 示例：**
```bash
curl -X PUT http://localhost:5000/api/v1/devices/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"Carbon Gen12"}'
```

### 5.5 删除设备

**DELETE /api/v1/devices/<id>**

**成功响应 (200)：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**失败响应 (404)：**
```json
{
  "code": 404,
  "message": "设备不存在",
  "data": null
}
```

**curl 示例：**
```bash
curl -X DELETE http://localhost:5000/api/v1/devices/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 错误码速查

| HTTP 状态码 | code | message 示例 |
|------------|------|-------------|
| 200 | 200 | 操作成功 |
| 400 | 400 | 参数错误 |
| 401 | 401 | 未授权访问，请先登录 |
| 401 | 401 | 账号或密码错误 |
| 404 | 404 | 员工不存在 / 分类不存在 / 设备不存在 |
| 409 | 409 | 该邮箱已存在 |
| 409 | 409 | 分类下存在设备，无法删除 |
| 422 | 422 | 请求参数校验失败 + 字段级错误详情 |
| 500 | 500 | 服务器内部错误 |
