from marshmallow import Schema, fields, validate


class LoginRequestSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1, max=50))
    password = fields.String(required=True, validate=validate.Length(min=1, max=128))


class LoginDataSchema(Schema):
    token = fields.String()
    admin_id = fields.Integer()
    username = fields.String()
    role = fields.String()


class LoginResponseSchema(Schema):
    code = fields.Integer()
    message = fields.String()
    data = fields.Nested(LoginDataSchema)
