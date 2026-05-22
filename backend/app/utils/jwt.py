from datetime import datetime, timedelta, timezone

import jwt
from flask import current_app


def generate_token(admin_id, username, role):
    exp = datetime.now(timezone.utc) + timedelta(hours=2)
    payload = {
        "admin_id": admin_id,
        "username": username,
        "role": role,
        "exp": exp,
    }
    secret = current_app.config["JWT_SECRET_KEY"]
    return jwt.encode(payload, secret, algorithm="HS256")


def verify_token(token):
    secret = current_app.config["JWT_SECRET_KEY"]
    payload = jwt.decode(token, secret, algorithms=["HS256"])
    return payload
