# 部署指南

本目录包含 VPS 单机 Docker Compose 部署所需的所有文件。

## 文件说明

| 文件 | 说明 |
|------|------|
| `docker-compose.yml` | 三服务编排（API + MySQL + Nginx） |
| `nginx.conf` | Nginx 反向代理配置 |
| `webhook-server.py` | Gitee Webhook 自动部署服务 |
| `setup-vps.sh` | VPS 一键初始化脚本 |
| `.env.example` | 生产环境变量模板 |

## 首次部署

```bash
# 1. 将项目上传到 Gitee 仓库

# 2. 在 VPS 上执行初始化脚本
chmod +x deploy/setup-vps.sh
./deploy/setup-vps.sh

# 3. 根据提示填写 .env 文件中的敏感信息
```

## 启动命令

```bash
docker compose \
  --env-file /opt/office-assistant/.env \
  -f /opt/office-assistant/deploy/docker-compose.yml \
  up -d --build
```

## 详细文档

- [部署文档](../docs/deployment.md) — 完整部署流程
- [Nginx 配置说明](../docs/nginx-setup.md) — 反向代理详解
- [CI/CD 自动化](../docs/cicd.md) — Webhook + systemd 自动部署
