"""初始化默认管理员账号"""
from app import create_app
from app.extensions import db
from app.services.auth import create_default_admin

app = create_app()

with app.app_context():
    db.create_all()
    admin = create_default_admin()
    print(f"默认管理员已创建: username={admin.username}, role={admin.role}")
    db.session.commit()
