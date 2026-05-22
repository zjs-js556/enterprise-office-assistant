import logging
from logging.handlers import RotatingFileHandler
import os


def setup_logging(app):
    log_level = getattr(logging, app.config.get("LOG_LEVEL", "DEBUG"), logging.DEBUG)
    log_format = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(module)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # 控制台输出
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(log_format)

    # 文件输出（RotatingFileHandler）
    log_file = app.config.get("LOG_FILE", os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs", "app.log"))
    log_dir = os.path.dirname(log_file)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)

    max_bytes = app.config.get("LOG_MAX_BYTES", 10 * 1024 * 1024)
    backup_count = app.config.get("LOG_BACKUP_COUNT", 10)

    file_handler = RotatingFileHandler(
        log_file, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(log_format)

    # 清除默认 handlers
    app.logger.handlers.clear()

    app.logger.addHandler(console_handler)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(log_level)

    app.logger.info("日志系统初始化完成")
