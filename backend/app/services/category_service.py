from app.extensions import db
from app.models import Category
from app.exceptions import BusinessException


def create_category(data):
    category = Category(name=data["name"])
    db.session.add(category)
    db.session.commit()
    return _to_item(category)


def get_categories():
    categories = Category.query.order_by(Category.created_at.desc()).all()
    return [_to_item(c) for c in categories]


def update_category(category_id, data):
    category = _get_or_404(category_id)
    if "name" in data:
        category.name = data["name"]
    db.session.commit()
    return _to_item(category)


def delete_category(category_id):
    category = _get_or_404(category_id)
    device_count = category.devices.count()
    if device_count > 0:
        raise BusinessException(message="分类下存在设备，无法删除", code=409)
    db.session.delete(category)
    db.session.commit()


def _get_or_404(category_id):
    category = Category.query.get(category_id)
    if not category:
        raise BusinessException(message="分类不存在", code=404)
    return category


def _to_item(category):
    return {
        "id": category.id,
        "name": category.name,
        "device_count": category.devices.count(),
        "created_at": category.created_at,
        "updated_at": category.updated_at,
    }
