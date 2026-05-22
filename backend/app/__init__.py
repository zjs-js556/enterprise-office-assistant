from flask import Flask

from .config import Config
from .extensions import init_extensions
from .utils.logger import setup_logging
from .middlewares import register_error_handlers, register_request_logger


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 日志
    setup_logging(app)

    # Flask 扩展
    init_extensions(app)

    # 全局异常处理
    register_error_handlers(app)

    # API 请求日志
    register_request_logger(app)

    # 注册路由
    with app.app_context():
        from .routes import register_routes

        register_routes(app)

    return app
