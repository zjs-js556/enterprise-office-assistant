from flask_smorest import Blueprint
from sqlalchemy import text
from app.extensions import db
from app.utils import success_response, error_response

blp = Blueprint("health", __name__, description="健康检查")


@blp.route("/health", methods=["GET"])
def health():
    try:
        db.session.execute(text("SELECT 1"))
        return success_response(
            data={"status": "healthy", "database": "connected"},
            message="ok",
        )
    except Exception:
        return error_response(
            message="数据库连接失败",
            code=500,
            data={"status": "unhealthy", "database": "disconnected"},
        )
