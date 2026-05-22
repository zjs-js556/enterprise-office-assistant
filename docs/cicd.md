# CI/CD 自动化部署

## 整体流程

```
开发者 push 代码到 Gitee
    │
    ▼
Gitee Webhook
    │
    ▼
office-webhook.service (监听 9000 端口)
    │
    ├── 1. 校验签名 (WEBHOOK_SECRET)
    ├── 2. 检查分支 (仅 master/main)
    ├── 3. git pull
    ├── 4. docker compose up -d --build
    ├── 5. docker image prune -f
    ├── 6. curl /health 健康检查
    └── 7. 写入部署日志
```

---

## systemd 服务配置

### 创建服务文件

```bash
sudo tee /etc/systemd/system/office-webhook.service << 'EOF'
[Unit]
Description=Office Assistant - Gitee Webhook Deploy Service
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/opt/office-assistant
EnvironmentFile=/opt/office-assistant/.env
ExecStart=/usr/bin/python3 /opt/office-assistant/deploy/webhook-server.py
Restart=always
RestartSec=10
StandardOutput=append:/opt/office-assistant/logs/webhook.out.log
StandardError=append:/opt/office-assistant/logs/webhook.err.log

[Install]
WantedBy=multi-user.target
EOF
```

### 启动与管理

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 开机自启并立即启动
sudo systemctl enable --now office-webhook

# 查看状态
sudo systemctl status office-webhook

# 查看日志（实时）
journalctl -u office-webhook -f

# 查看最近日志
journalctl -u office-webhook -n 50

# 重启
sudo systemctl restart office-webhook

# 停止
sudo systemctl stop office-webhook
```

---

## 手动触发部署

除了 Gitee Webhook 自动触发，也可以手动触发：

```bash
# 方式一：模拟 Webhook 请求
curl -X POST http://127.0.0.1:9000/ \
  -H "Content-Type: application/json" \
  -H "X-Gitee-Token: <WEBHOOK_SECRET>" \
  -d '{"ref":"refs/heads/master"}'

# 方式二：直接执行部署命令
cd /opt/office-assistant
git pull
docker compose \
  --env-file /opt/office-assistant/.env \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  up -d --build
docker image prune -f
curl -s http://127.0.0.1/health
```

---

## 部署日志

日志文件位置：

| 日志 | 路径 |
|------|------|
| 部署日志 | `/opt/office-assistant/logs/deploy.log` |
| Webhook stdout | `/opt/office-assistant/logs/webhook.out.log` |
| Webhook stderr | `/opt/office-assistant/logs/webhook.err.log` |
| API 应用日志 | 容器内 `/app/logs/app.log`（挂载到宿主机 `logs/`） |

---

## 安全注意事项

1. **MySQL 端口**：3306 不暴露到公网，仅在 Docker 内部网络通信
2. **Webhook 端口**：9000 建议通过 Nginx 反向代理或配置 iptables 白名单
3. **JWT_SECRET_KEY**：必须随机生成，不可使用默认值
4. **.env 文件**：必须加入 `.gitignore`，绝不提交到仓库
5. **Webhook Secret**：在 Gitee 和 `.env` 中配置相同的密钥

### 生成随机密钥

```bash
# JWT Secret (64 字符十六进制)
openssl rand -hex 32

# Webhook Secret (16 字符十六进制)
openssl rand -hex 16
```

---

## 故障排查

### Webhook 服务未运行

```bash
sudo systemctl status office-webhook
```

如果不是 active 状态，检查日志：

```bash
journalctl -u office-webhook -n 50
```

常见原因：
- `.env` 文件路径错误
- Python 版本不兼容（需要 Python 3.8+）
- 9000 端口被占用

### 部署失败，git pull 报错

确保 VPS 上配置了 Gitee 的 SSH 密钥或 Access Token：

```bash
# 测试 SSH 连接
ssh -T git@gitee.com
```

### Docker 构建失败

```bash
cd /opt/office-assistant
docker compose \
  --env-file /opt/office-assistant/.env \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  build --no-cache
```

查看具体构建错误信息。

---

## 完整部署检查清单

| 序号 | 检查项 | 命令 |
|:---:|--------|------|
| 1 | Docker 已安装 | `docker --version` |
| 2 | Docker Compose 已安装 | `docker compose version` |
| 3 | .env 文件已配置 | `cat /opt/office-assistant/.env` |
| 4 | 数据库密码已设置 | 检查 .env 中 MYSQL_PASSWORD |
| 5 | JWT 密钥已生成 | 检查 .env 中 JWT_SECRET_KEY |
| 6 | 容器全部运行 | `docker ps \| grep office` |
| 7 | 健康检查通过 | `curl http://127.0.0.1/health` |
| 8 | Webhook 服务运行 | `systemctl status office-webhook` |
| 9 | Gitee Webhook 已配置 | Gitee 仓库 → 管理 → Webhooks |
| 10 | 推送测试通过 | Push 代码后查看 `deploy.log` |
