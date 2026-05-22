from flask import request
from flask_smorest import Blueprint

from app.schemas.device_schema import (
    DeviceCreateSchema,
    DeviceUpdateSchema,
    DeviceItemSchema,
)
from app.services import device_service
from app.middlewares import auth_required
from app.utils import success_response

blp = Blueprint("devices", __name__, description="设备管理接口")


@blp.route("/devices", methods=["POST"])
@auth_required
def create_device(payload):
    schema = DeviceCreateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    device = device_service.create_device(data)
    result = DeviceItemSchema().dump(device)
    return success_response(data=result, message="创建成功")


@blp.route("/devices", methods=["GET"])
@auth_required
def list_devices(payload):
    category_id = request.args.get("category_id", type=int)
    devices = device_service.get_devices(category_id=category_id)
    result = [DeviceItemSchema().dump(d) for d in devices]
    return success_response(data=result, message="查询成功")


@blp.route("/categories/<int:category_id>/devices", methods=["GET"])
@auth_required
def list_devices_by_category(payload, category_id):
    devices = device_service.get_devices_by_category(category_id)
    result = [DeviceItemSchema().dump(d) for d in devices]
    return success_response(data=result, message="查询成功")


@blp.route("/devices/<int:device_id>", methods=["PUT"])
@auth_required
def update_device(payload, device_id):
    schema = DeviceUpdateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    device = device_service.update_device(device_id, data)
    result = DeviceItemSchema().dump(device)
    return success_response(data=result, message="修改成功")


@blp.route("/devices/<int:device_id>", methods=["DELETE"])
@auth_required
def delete_device(payload, device_id):
    device_service.delete_device(device_id)
    return success_response(data=None, message="删除成功")
