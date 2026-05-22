"""
Gitee Webhook 自动部署服务

监听 Gitee Push 事件，自动拉取代码并重新部署。
只处理 master/main 分支的 push 事件。
"""

import hashlib
import hmac
import json
import os
import subprocess
import sys
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

DEPLOY_DIR = "/opt/office-assistant"
LOG_FILE = os.path.join(DEPLOY_DIR, "logs", "deploy.log")
ENV_FILE = os.path.join(DEPLOY_DIR, ".env")
COMPOSE_FILE = os.path.join(DEPLOY_DIR, "deploy", "docker-compose.yml")

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")
WEBHOOK_PORT = int(os.getenv("WEBHOOK_PORT", "9000"))


def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line, flush=True)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception as e:
        print(f"无法写入日志文件: {e}", flush=True)


def verify_signature(body: bytes, signature: str) -> bool:
    if not WEBHOOK_SECRET:
        log("WARNING: WEBHOOK_SECRET 未设置，跳过签名校验")
        return True
    if not signature:
        return False
    expected = hmac.new(
        WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def run(cmd: list[str]) -> tuple[int, str]:
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=DEPLOY_DIR)
    return result.returncode, result.stdout.strip() or result.stderr.strip()


def deploy():
    log("=" * 50)
    log("开始部署...")

    log("Step 1/4: git pull")
    code, out = run(["git", "pull"])
    log(f"  git pull: {out}")
    if code != 0:
        log(f"  git pull 失败: {out}")
        return False

    log("Step 2/4: docker compose build & up")
    code, out = run([
        "docker", "compose",
        "--env-file", ENV_FILE,
        "-f", COMPOSE_FILE,
        "up", "-d", "--build",
        "--remove-orphans",
    ])
    log(f"  docker compose: {out}")
    if code != 0:
        log(f"  docker compose 失败: {out}")
        return False

    log("Step 3/4: 清理旧镜像")
    code, out = run(["docker", "image", "prune", "-f"])
    log(f"  docker image prune: {out}")

    log("Step 4/4: 健康检查")
    code, out = run(["curl", "-s", "http://127.0.0.1/health"])
    log(f"  健康检查: {out}")

    log("部署完成 ✓")
    log("=" * 50)
    return True


class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        # 签名校验
        signature = self.headers.get("X-Gitee-Token", "")
        if not verify_signature(body, signature):
            log("签名校验失败，拒绝请求")
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'{"error":"invalid signature"}')
            return

        # 解析 payload
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error":"invalid json"}')
            return

        ref = payload.get("ref", "")
        log(f"收到 Webhook: ref={ref}")

        # 只处理 master/main 分支
        if ref not in ("refs/heads/master", "refs/heads/main"):
            log(f"  跳过非目标分支: {ref}")
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"skipped","reason":"not target branch"}')
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'{"status":"deploying"}')

        success = deploy()

        if not success:
            log("部署失败！请检查日志。")


    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'{"status":"webhook server running"}')


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", WEBHOOK_PORT), WebhookHandler)
    log(f"Webhook 服务启动，监听端口 {WEBHOOK_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log("Webhook 服务已停止")
        server.shutdown()
