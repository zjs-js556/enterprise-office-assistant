from werkzeug.security import check_password_hash, generate_password_hash

from app.exceptions import BusinessException
from app.models import AdminUser
from app.extensions import db
from app.utils.jwt import generate_token


def login_service(username, password):
    admin = AdminUser.query.filter_by(username=username).first()
    if not admin:
        raise BusinessException(message="账号或密码错误", code=401)

    if not check_password_hash(admin.password_hash, password):
        raise BusinessException(message="账号或密码错误", code=401)

    token = generate_token(
        admin_id=admin.id,
        username=admin.username,
        role=admin.role,
    )

    return {
        "token": token,
        "admin_id": admin.id,
        "username": admin.username,
        "role": admin.role,
    }


def create_default_admin():
    existing = AdminUser.query.filter_by(username="admin").first()
    if existing:
        return existing

    admin = AdminUser(
        username="admin",
        password_hash=generate_password_hash("admin123456"),
        role="admin",
    )
    db.session.add(admin)
    db.session.commit()
    return admin
