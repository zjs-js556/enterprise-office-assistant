# 数据库设计文档

## ER 图（待补充）

## 数据表

### employees — 员工表

| 字段         | 类型          | 说明     |
|-------------|--------------|---------|
| id          | INT PK AUTO_INCREMENT | 主键 |
| name        | VARCHAR(50)  | 姓名    |
| email       | VARCHAR(100) | 邮箱    |
| phone       | VARCHAR(20)  | 电话    |
| department  | VARCHAR(50)  | 部门    |
| position    | VARCHAR(50)  | 职位    |
| created_at  | DATETIME     | 创建时间  |
| updated_at  | DATETIME     | 更新时间  |

### device_categories — 设备分类表

| 字段         | 类型          | 说明     |
|-------------|--------------|---------|
| id          | INT PK AUTO_INCREMENT | 主键 |
| name        | VARCHAR(50)  | 分类名称  |
| description | TEXT         | 描述    |
| created_at  | DATETIME     | 创建时间  |
| updated_at  | DATETIME     | 更新时间  |

### devices — 设备表

| 字段          | 类型          | 说明     |
|--------------|--------------|---------|
| id           | INT PK AUTO_INCREMENT | 主键 |
| name         | VARCHAR(100) | 设备名称  |
| model        | VARCHAR(100) | 型号    |
| serial_number| VARCHAR(100) | 序列号   |
| category_id  | INT FK       | 分类 ID  |
| status       | VARCHAR(20)  | 状态    |
| employee_id  | INT FK NULL  | 使用人 ID |
| created_at   | DATETIME     | 创建时间  |
| updated_at   | DATETIME     | 更新时间  |
