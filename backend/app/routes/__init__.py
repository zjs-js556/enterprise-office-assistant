def register_routes(app):
    from .health import blp as health_blp
    from .auth import blp as auth_blp
    from .employee_routes import blp as employee_blp
    from .category_routes import blp as category_blp
    from .device_routes import blp as device_blp

    app.register_blueprint(health_blp, url_prefix="/api/v1")
    app.register_blueprint(auth_blp, url_prefix="/api/v1/auth")
    app.register_blueprint(employee_blp, url_prefix="/api/v1")
    app.register_blueprint(category_blp, url_prefix="/api/v1")
    app.register_blueprint(device_blp, url_prefix="/api/v1")
