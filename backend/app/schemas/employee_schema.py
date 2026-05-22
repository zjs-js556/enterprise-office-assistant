import re
from marshmallow import Schema, fields, validate, ValidationError


def validate_email(value):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, value):
        raise ValidationError("邮箱格式不正确")


class EmployeeCreateSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=20),
        error_messages={"required": "姓名不能为空"},
    )
    age = fields.Integer(
        required=True,
        validate=validate.Range(min=18, max=60),
        error_messages={"required": "年龄不能为空"},
    )
    email = fields.Email(
        required=True,
        validate=[validate.Length(max=120), validate_email],
        error_messages={"required": "邮箱不能为空"},
    )


class EmployeeUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=1, max=20))
    age = fields.Integer(validate=validate.Range(min=18, max=60))
    email = fields.Email(validate=[validate.Length(max=120), validate_email])


class EmployeeItemSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    age = fields.Integer()
    email = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class EmployeeListSchema(Schema):
    items = fields.List(fields.Nested(EmployeeItemSchema))
    total = fields.Integer()
    page = fields.Integer()
    page_size = fields.Integer()
