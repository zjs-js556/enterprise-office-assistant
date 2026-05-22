#!/bin/bash
# ============================================
# VPS 初始化脚本 — 企业办公助手
# 首次部署时在 VPS 上执行此脚本
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  企业办公助手 — VPS 部署初始化${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# ------ 1. 安装 Docker ------
echo -e "${YELLOW}[1/7] 安装 Docker...${NC}"
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
    echo -e "${GREEN}  Docker 安装完成${NC}"
else
    echo -e "${GREEN}  Docker 已安装，跳过${NC}"
fi

# ------ 2. 安装 Docker Compose 插件 ------
echo -e "${YELLOW}[2/7] 安装 Docker Compose 插件...${NC}"
if ! docker compose version &>/dev/null; then
    apt-get update -y
    apt-get install -y docker-compose-plugin
    echo -e "${GREEN}  Docker Compose 插件安装完成${NC}"
else
    echo -e "${GREEN}  Docker Compose 插件已安装，跳过${NC}"
fi

# ------ 3. 安装 Git ------
echo -e "${YELLOW}[3/7] 安装 Git...${NC}"
if ! command -v git &>/dev/null; then
    apt-get install -y git
    echo -e "${GREEN}  Git 安装完成${NC}"
else
    echo -e "${GREEN}  Git 已安装，跳过${NC}"
fi

# ------ 4. 克隆仓库 ------
echo -e "${YELLOW}[4/7] 克隆仓库...${NC}"
if [ ! -d /opt/office-assistant ]; then
    read -rp "  请输入 Gitee 仓库地址 (git@gitee.com:xxx/xxx.git): " REPO_URL
    git clone "$REPO_URL" /opt/office-assistant
    echo -e "${GREEN}  仓库已克隆到 /opt/office-assistant${NC}"
else
    echo -e "${GREEN}  /opt/office-assistant 已存在，跳过克隆${NC}"
fi

# ------ 5. 创建 logs 目录 ------
echo -e "${YELLOW}[5/7] 创建日志目录...${NC}"
mkdir -p /opt/office-assistant/logs
echo -e "${GREEN}  logs 目录已创建${NC}"

# ------ 6. 检查 .env 文件 ------
echo -e "${YELLOW}[6/7] 检查 .env 配置...${NC}"
if [ ! -f /opt/office-assistant/.env ]; then
    echo -e "${RED}  .env 文件不存在！${NC}"
    echo -e "  请执行以下命令："
    echo -e "  ${YELLOW}cp /opt/office-assistant/deploy/.env.example /opt/office-assistant/.env${NC}"
    echo -e "  然后编辑 ${YELLOW}/opt/office-assistant/.env${NC} 填入真实值。"
    echo -e ""
    echo -e "  必须填写的变量："
    echo -e "    - MYSQL_ROOT_PASSWORD"
    echo -e "    - MYSQL_PASSWORD"
    echo -e "    - JWT_SECRET_KEY（随机生成: openssl rand -hex 32）"
    echo -e "    - SECRET_KEY（随机生成: openssl rand -hex 32）"
    echo -e "    - WEBHOOK_SECRET（随机生成: openssl rand -hex 16）"
    echo -e ""
    echo -e "  填好后重新运行此脚本。"
    exit 1
fi
echo -e "${GREEN}  .env 文件已就绪${NC}"

# ------ 7. 启动 Docker Compose ------
echo -e "${YELLOW}[7/7] 启动 Docker Compose...${NC}"
cd /opt/office-assistant

docker compose \
    --env-file /opt/office-assistant/.env \
    -f /opt/office-assistant/deploy/docker-compose.yml \
    up -d --build

echo ""

# ------ 健康检查 ------
sleep 5
echo -e "${YELLOW}健康检查:${NC}"
curl -s http://127.0.0.1/health || echo -e "${RED}  健康检查失败，请检查容器日志${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署初始化完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  访问地址: http://<服务器IP>"
echo -e "  健康检查: http://<服务器IP>/health"
echo -e ""
echo -e "  常用命令:"
echo -e "    docker ps                              # 查看容器状态"
echo -e "    docker logs office-api --tail=100      # 查看 API 日志"
echo -e "    journalctl -u office-webhook -f        # 查看 Webhook 日志"
echo -e "    curl -s http://127.0.0.1/health        # 健康检查"
echo ""
