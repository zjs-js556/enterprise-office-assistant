from flask import request

from flask_smorest import Blueprint

from app.schemas.auth import LoginRequestSchema
from app.services.auth import login_service
from app.middlewares import auth_required
from app.utils import success_response

blp = Blueprint("auth", __name__, description="认证相关接口")


@blp.route("/login", methods=["POST"])
def login():
    schema = LoginRequestSchema()
    data = schema.load(request.get_json(silent=True) or {})
    result = login_service(data["username"], data["password"])
    return success_response(data=result, message="登录成功")


@blp.route("/me", methods=["GET"])
@auth_required
def me(payload):
    return success_response(data={
        "admin_id": payload["admin_id"],
        "username": payload["username"],
        "role": payload["role"],
    }, message="查询成功")
