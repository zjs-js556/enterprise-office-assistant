#!/usr/bin/env python3
import json
import os
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

PROJECT_DIR = "/opt/office-assistant"
LOG_FILE = "/opt/office-assistant/logs/deploy.log"
SECRET = os.environ.get("WEBHOOK_SECRET", "")
PORT = int(os.environ.get("WEBHOOK_PORT", "9000"))

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    line = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def run_cmd(cmd):
    log(f"RUN: {cmd}")
    result = subprocess.run(
        cmd,
        shell=True,
        cwd=PROJECT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        timeout=600,
    )
    log(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed: {cmd}")

def deploy():
    run_cmd("git pull origin master")
    run_cmd(
        "docker compose "
        "--env-file /opt/office-assistant/.env "
        "-f /opt/office-assistant/deploy/docker-compose.yml "
        "up -d --build"
    )
    run_cmd("docker image prune -f")
    run_cmd("curl -fsS http://127.0.0.1/health")
    log("DEPLOY SUCCESS")

class WebhookHandler(BaseHTTPRequestHandler):
    def send_json(self, code, body):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        self.send_json(200, {"status": "webhook server running"})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length).decode("utf-8") if length else "{}"

            try:
                payload = json.loads(raw_body)
            except Exception:
                payload = {}

            header_token = (
                self.headers.get("X-Gitee-Token")
                or self.headers.get("X-Git-Osc-Token")
                or self.headers.get("X-Gitee-Password")
                or ""
            )

            body_token = str(
                payload.get("password")
                or payload.get("hook_password")
                or payload.get("token")
                or payload.get("secret")
                or ""
            )

            log(f"Webhook request received. header_token_len={len(header_token)}, body_token_len={len(body_token)}")

            if SECRET and header_token != SECRET and body_token != SECRET:
                log("Webhook 密码校验失败，拒绝请求")
                self.send_json(403, {"error": "invalid webhook password"})
                return

            ref = payload.get("ref", "")
            log(f"Webhook branch ref={ref}")

            if ref and ref not in ("refs/heads/master", "refs/heads/main"):
                self.send_json(200, {"message": "ignored non-main branch", "ref": ref})
                return

            deploy()
            self.send_json(200, {"message": "deploy success"})

        except Exception as e:
            log(f"DEPLOY FAILED: {e}")
            self.send_json(500, {"message": str(e)})

if __name__ == "__main__":
    log(f"Webhook 服务启动，监听端口 {PORT}")
    server = HTTPServer(("0.0.0.0", PORT), WebhookHandler)
    server.serve_forever()
