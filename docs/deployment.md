# 部署文档

## 1. VPS 环境准备

### 最低配置

| 项目 | 要求 |
|------|------|
| CPU | 2 核 |
| 内存 | 2 GB |
| 硬盘 | 20 GB |
| 操作系统 | Ubuntu 20.04 / 22.04 / CentOS 7 |
| 网络 | 公网 IP，80 端口可访问 |

### 初始设置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 curl（通常已预装）
sudo apt install -y curl

# 设置时区
sudo timedatectl set-timezone Asia/Shanghai
```

---

## 2. 阿里云安全组开放端口

登录阿里云控制台 → ECS → 安全组 → 配置规则：

| 方向 | 端口 | 协议 | 来源 | 说明 |
|------|:---:|------|------|------|
| 入方向 | 80 | TCP | 0.0.0.0/0 | Nginx HTTP |
| 入方向 | 22 | TCP | 0.0.0.0/0 | SSH（建议限定为办公 IP） |
| 入方向 | 443 | TCP | 0.0.0.0/0 | HTTPS（可选，配置 SSL 后开放） |

> **注意**：3306（MySQL）和 9000（Webhook）不需要对外开放。

---

## 3. Gitee 仓库准备

1. 在 [Gitee](https://gitee.com) 创建私有仓库
2. 将项目代码推送到仓库：

```bash
git init
git add .
git commit -m "init: 企业办公助手 v1.0"
git remote add origin git@gitee.com:yourname/office-assistant.git
git push -u origin master
```

3. 在 Gitee 仓库 → 管理 → 部署公钥，添加 VPS 的 SSH 公钥：

```bash
# VPS 上生成 SSH Key（如尚无）
ssh-keygen -t ed25519 -C "deploy@vps"
cat ~/.ssh/id_ed25519.pub
```

---

## 4. .env 配置说明

在生产环境的 `/opt/office-assistant/.env` 中填写：

```bash
# 从模板复制
cp /opt/office-assistant/deploy/.env.example /opt/office-assistant/.env
```

### 必填变量

| 变量 | 说明 | 生成方式 |
|------|------|---------|
| `SECRET_KEY` | Flask 应用密钥 | `openssl rand -hex 32` |
| `JWT_SECRET_KEY` | JWT 签名密钥 | `openssl rand -hex 32` |
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | 自定义强密码 |
| `MYSQL_PASSWORD` | MySQL 业务用户密码 | 自定义强密码 |
| `DATABASE_URL` | 数据库连接串 | 把 PASSWORD 替换为实际密码 |
| `WEBHOOK_SECRET` | Webhook 签名密钥 | `openssl rand -hex 16` |

### DATABASE_URL 格式

容器内部通过 Docker 网络通信，host 是服务名 `office-mysql`：

```
DATABASE_URL=mysql+pymysql://office_user:你的密码@office-mysql:3306/office_assistant
```

---

## 5. Docker Compose 启动命令

```bash
cd /opt/office-assistant

# 启动（首次或代码更新后）
docker compose \
  --env-file /opt/office-assistant/.env \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  up -d --build

# 查看状态
docker compose \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  ps

# 停止
docker compose \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  down
```

---

## 6. Nginx 访问说明

- **API 访问**：`http://<服务器IP>/api/v1/health`
- **健康检查**：`http://<服务器IP>/health`
- **根路径**：`http://<服务器IP>/` 返回 `{"code":200,"message":"OK"}`

---

## 7. Gitee Webhook 配置方法

1. 登录 Gitee → 仓库 → 管理 → Webhooks
2. 添加 Webhook：
   - **URL**：`http://<服务器IP>:9000/`
   - **密码/签名密钥**：与 `.env` 中 `WEBHOOK_SECRET` 一致
   - **触发事件**：勾选「Push」
3. 保存后点击「测试」验证连通性

### 通过 Nginx 代理 Webhook（推荐）

Nginx 可以给 Webhook 加 HTTPS 和 IP 白名单，详见 [nginx-setup.md](nginx-setup.md)。

---

## 8. systemd 启动 Webhook 服务

详见 [cicd.md](cicd.md) 中的 systemd 配置章节。

---

## 9. 常用运维命令

```bash
# 查看所有容器
docker ps

# 查看 API 日志（最近 100 行）
docker logs office-api --tail=100

# 查看 API 日志（实时跟踪）
docker logs office-api -f

# 查看 MySQL 日志
docker logs office-mysql --tail=100

# 查看 Nginx 日志
docker logs office-nginx --tail=100

# 重启所有服务
docker compose \
  --env-file /opt/office-assistant/.env \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  restart

# 进入 API 容器
docker exec -it office-api bash

# 进入 MySQL 容器
docker exec -it office-mysql mysql -u office_user -p office_assistant

# 健康检查
curl -i http://127.0.0.1/health

# 清理未使用的镜像
docker image prune -f

# 查看磁盘占用
docker system df

# Webhook 日志
journalctl -u office-webhook -f

# 部署日志
tail -f /opt/office-assistant/logs/deploy.log
```

---

## 10. 常见问题排查

### Q1: 容器启动后 API 返回 500

```bash
docker logs office-api --tail=50
```

常见原因：数据库连接失败。检查 `.env` 中 `DATABASE_URL` 的用户名密码是否正确。

### Q2: 数据库表不存在

Flask 应用启动时不会自动建表。需要执行：

```bash
docker exec -it office-api python seed.py
```

### Q3: Nginx 502 Bad Gateway

API 容器未就绪：

```bash
docker logs office-api --tail=20
docker logs office-nginx --tail=20
```

### Q4: Webhook 不触发部署

1. 检查 Webhook 服务是否运行：`journalctl -u office-webhook -f`
2. 检查防火墙：`sudo ufw status`
3. 检查签名密钥是否一致

### Q5: 端口被占用

```bash
# 查看 80 端口占用
sudo lsof -i :80

# 停止占用进程
sudo systemctl stop apache2  # 或其他占用进程
```

### Q6: 磁盘空间不足

```bash
# 清理 Docker 资源
docker system prune -a --volumes -f
```

---

## 11. 最终验证步骤

部署完成后，按以下步骤验证：

```bash
# 1. 容器全部运行
docker ps | grep office
# 应看到 3 个容器：office-nginx, office-api, office-mysql

# 2. 健康检查
curl http://127.0.0.1/health
# 应返回: {"code":200,"message":"ok","data":{"status":"healthy","database":"connected"}}

# 3. 登录测试
curl -X POST http://127.0.0.1/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
# 应返回 JWT token

# 4. 使用 token 查询
TOKEN=<从上面获取的 token>
curl http://127.0.0.1/api/v1/employees \
  -H "Authorization: Bearer $TOKEN"
# 应返回员工列表

# 5. Webhook 服务状态
systemctl status office-webhook

# 6. 查看部署日志
cat /opt/office-assistant/logs/deploy.log
```

全部通过即部署成功。
