"""初始化默认管理员账号"""
import os
import sys

from app import create_app
from app.extensions import db
from app.services.auth import create_default_admin

if os.getenv("ALLOW_SEED") != "1":
    print("错误: 请设置环境变量 ALLOW_SEED=1 后再运行此脚本")
    sys.exit(1)

app = create_app()

with app.app_context():
    db.create_all()
    admin = create_default_admin()
    print(f"默认管理员已创建: username={admin.username}, role={admin.role}")
    db.session.commit()
