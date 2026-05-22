from marshmallow import Schema, fields, validate


class CategoryCreateSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=20),
        error_messages={"required": "分类名称不能为空"},
    )


class CategoryUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=1, max=20))


class CategoryItemSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    device_count = fields.Integer()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
