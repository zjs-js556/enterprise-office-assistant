import functools

from flask import request, jsonify
from jwt import ExpiredSignatureError, InvalidTokenError

from app.utils.jwt import verify_token


def auth_required(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return (
                jsonify({
                    "code": 401,
                    "message": "未授权访问，请先登录",
                    "data": None,
                }),
                401,
            )

        token = auth_header[7:]
        try:
            payload = verify_token(token)
        except ExpiredSignatureError:
            return (
                jsonify({
                    "code": 401,
                    "message": "未授权访问，请先登录",
                    "data": None,
                }),
                401,
            )
        except InvalidTokenError:
            return (
                jsonify({
                    "code": 401,
                    "message": "未授权访问，请先登录",
                    "data": None,
                }),
                401,
            )

        return fn(payload, *args, **kwargs)

    return wrapper
