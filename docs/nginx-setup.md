# Nginx 配置说明

## 架构图

```
用户浏览器
    │
    ▼
┌──────────────┐
│  Nginx (:80) │  ← 唯一对外端口
└──────┬───────┘
       │
       ├── /api/*     → office-api:8000  (Flask 后端)
       ├── /health    → office-api:8000/api/v1/health
       └── /          → 返回 OK
```

## 配置文件

位置：`deploy/nginx.conf`

### 核心配置说明

```nginx
server {
    listen 80;

    # 代理超时 120 秒（适应慢请求）
    proxy_read_timeout 120s;

    # API 转发
    location /api/ {
        proxy_pass http://office-api:8000;

        # 保留真实客户端 IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        proxy_pass http://office-api:8000/api/v1/health;
    }
}
```

## 真实 IP 传递

后端通过以下请求头获取客户端真实 IP：

| 请求头 | 含义 |
|--------|------|
| `X-Real-IP` | 客户端真实 IP |
| `X-Forwarded-For` | 代理链 IP 列表 |
| `X-Forwarded-Proto` | 原始协议（http/https） |

后端日志中间件已支持从 `X-Forwarded-For` 读取 IP，详见 `backend/app/middlewares/request_logger.py`。

## 高级配置（可选）

### 配置 HTTPS（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install -y certbot

# 获取证书（standalone 模式，需先停止 nginx）
docker stop office-nginx
sudo certbot certonly --standalone -d your-domain.com

# 证书路径
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

然后在 `nginx.conf` 中添加 HTTPS server 块，挂载证书文件。

### Webhook 通过 Nginx 反向代理

在 `nginx.conf` 中添加：

```nginx
# 仅允许 Gitee 的 IP 段访问 Webhook
location /webhook/ {
    allow 116.211.0.0/16;   # Gitee IP 段（仅供参考）
    deny all;

    proxy_pass http://127.0.0.1:9000/;
}
```

### 限制请求频率

```nginx
# 在 http 块中定义
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;

# 在 server/location 中使用
location /api/ {
    limit_req zone=api burst=50 nodelay;
    proxy_pass http://office-api:8000;
}
```

### 启用 Gzip 压缩

```nginx
gzip on;
gzip_types application/json;
gzip_min_length 256;
```
