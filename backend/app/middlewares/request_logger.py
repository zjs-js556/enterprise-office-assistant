import time
from flask import g, request


def register_request_logger(app):

    @app.before_request
    def before_request():
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        elapsed_ms = int((time.time() - g.start_time) * 1000)

        ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        if not ip:
            ip = request.remote_addr or "-"

        app.logger.info(
            "%s %s %s %d %dms",
            ip,
            request.method,
            request.path,
            response.status_code,
            elapsed_ms,
        )

        return response
