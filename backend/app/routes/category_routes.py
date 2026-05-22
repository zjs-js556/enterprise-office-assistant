from flask import request
from flask_smorest import Blueprint

from app.schemas.category_schema import (
    CategoryCreateSchema,
    CategoryUpdateSchema,
    CategoryItemSchema,
)
from app.services import category_service
from app.middlewares import auth_required
from app.utils import success_response

blp = Blueprint("categories", __name__, description="设备分类管理接口")


@blp.route("/categories", methods=["POST"])
@auth_required
def create_category(payload):
    schema = CategoryCreateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    result = category_service.create_category(data)
    dumped = CategoryItemSchema().dump(result)
    return success_response(data=dumped, message="创建成功")


@blp.route("/categories", methods=["GET"])
@auth_required
def list_categories(payload):
    items = category_service.get_categories()
    result = [CategoryItemSchema().dump(item) for item in items]
    return success_response(data=result, message="查询成功")


@blp.route("/categories/<int:category_id>", methods=["PUT"])
@auth_required
def update_category(payload, category_id):
    schema = CategoryUpdateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    result = category_service.update_category(category_id, data)
    dumped = CategoryItemSchema().dump(result)
    return success_response(data=dumped, message="修改成功")


@blp.route("/categories/<int:category_id>", methods=["DELETE"])
@auth_required
def delete_category(payload, category_id):
    category_service.delete_category(category_id)
    return success_response(data=None, message="删除成功")
