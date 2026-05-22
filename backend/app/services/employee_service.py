from app.extensions import db
from app.models import Employee
from app.exceptions import BusinessException


def create_employee(data):
    existing = Employee.query.filter_by(email=data["email"]).first()
    if existing:
        raise BusinessException(message="该邮箱已存在", code=409)

    employee = Employee(name=data["name"], age=data["age"], email=data["email"])
    db.session.add(employee)
    db.session.commit()
    return employee


def get_employees(page=1, page_size=20):
    query = Employee.query.order_by(Employee.created_at.desc())
    pagination = query.paginate(page=page, per_page=page_size, error_out=False)
    return {
        "items": pagination.items,
        "total": pagination.total,
        "page": page,
        "page_size": page_size,
    }


def get_employee_by_id(employee_id):
    employee = Employee.query.get(employee_id)
    if not employee:
        raise BusinessException(message="员工不存在", code=404)
    return employee


def update_employee(employee_id, data):
    employee = get_employee_by_id(employee_id)

    if "email" in data and data["email"] != employee.email:
        existing = Employee.query.filter_by(email=data["email"]).first()
        if existing:
            raise BusinessException(message="该邮箱已被其他员工使用", code=409)

    for field in ("name", "age", "email"):
        if field in data:
            setattr(employee, field, data[field])

    db.session.commit()
    return employee


def delete_employee(employee_id):
    employee = get_employee_by_id(employee_id)
    db.session.delete(employee)
    db.session.commit()
