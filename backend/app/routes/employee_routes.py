from flask import request
from flask_smorest import Blueprint

from app.schemas.employee_schema import (
    EmployeeCreateSchema,
    EmployeeUpdateSchema,
    EmployeeItemSchema,
    EmployeeListSchema,
)
from app.services import employee_service
from app.middlewares import auth_required
from app.utils import success_response

blp = Blueprint("employees", __name__, description="员工管理接口")


@blp.route("/employees", methods=["POST"])
@auth_required
def create_employee(payload):
    schema = EmployeeCreateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    employee = employee_service.create_employee(data)
    result = EmployeeItemSchema().dump(employee)
    return success_response(data=result, message="创建成功")


@blp.route("/employees", methods=["GET"])
@auth_required
def list_employees(payload):
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 20, type=int)
    result = employee_service.get_employees(page=page, page_size=page_size)
    dumped = EmployeeListSchema().dump(result)
    return success_response(data=dumped, message="查询成功")


@blp.route("/employees/<int:employee_id>", methods=["GET"])
@auth_required
def get_employee(payload, employee_id):
    employee = employee_service.get_employee_by_id(employee_id)
    result = EmployeeItemSchema().dump(employee)
    return success_response(data=result, message="查询成功")


@blp.route("/employees/<int:employee_id>", methods=["PUT"])
@auth_required
def update_employee(payload, employee_id):
    schema = EmployeeUpdateSchema()
    data = schema.load(request.get_json(silent=True) or {})
    employee = employee_service.update_employee(employee_id, data)
    result = EmployeeItemSchema().dump(employee)
    return success_response(data=result, message="修改成功")


@blp.route("/employees/<int:employee_id>", methods=["DELETE"])
@auth_required
def delete_employee(payload, employee_id):
    employee_service.delete_employee(employee_id)
    return success_response(data=None, message="删除成功")
