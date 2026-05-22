from flask import jsonify
from marshmallow import ValidationError

from app.exceptions import BusinessException


def register_error_handlers(app):

    @app.errorhandler(BusinessException)
    def handle_business_exception(error):
        app.logger.warning(
            "业务异常: code=%d message=%s", error.code, error.message
        )
        return (
            jsonify({"code": error.code, "message": error.message, "data": error.data}),
            error.code,
        )

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        app.logger.warning("请求参数校验失败: %s", str(error.messages))
        return (
            jsonify({"code": 422, "message": "请求参数校验失败", "data": error.messages}),
            422,
        )

    @app.errorhandler(400)
    def handle_400(error):
        app.logger.warning("参数错误: %s", str(error))
        return jsonify({"code": 400, "message": "参数错误", "data": None}), 400

    @app.errorhandler(401)
    def handle_401(error):
        app.logger.warning("未授权: %s", str(error))
        return jsonify({"code": 401, "message": "未授权，请先登录", "data": None}), 401

    @app.errorhandler(403)
    def handle_403(error):
        app.logger.warning("权限不足: %s", str(error))
        return jsonify({"code": 403, "message": "权限不足", "data": None}), 403

    @app.errorhandler(404)
    def handle_404(error):
        return jsonify({"code": 404, "message": "资源不存在", "data": None}), 404

    @app.errorhandler(409)
    def handle_409(error):
        app.logger.warning("业务冲突: %s", str(error))
        return jsonify({"code": 409, "message": "业务冲突", "data": None}), 409

    @app.errorhandler(500)
    def handle_500(error):
        app.logger.error("系统异常: %s", str(error), exc_info=True)
        return jsonify({"code": 500, "message": "服务器内部错误", "data": None}), 500

    @app.errorhandler(422)
    def handle_422(error):
        app.logger.warning("请求验证失败: %s", str(error))
        return jsonify({"code": 422, "message": "请求数据验证失败", "data": None}), 422
