from marshmallow import Schema, fields, validate


class DeviceCreateSchema(Schema):
    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=100),
        error_messages={"required": "设备名称不能为空"},
    )
    model = fields.String(validate=validate.Length(max=100))
    category_id = fields.Integer(
        required=True,
        error_messages={"required": "分类ID不能为空"},
    )


class DeviceUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=1, max=100))
    model = fields.String(validate=validate.Length(max=100))
    category_id = fields.Integer()


class DeviceItemSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    model = fields.String()
    category_id = fields.Integer()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
