from app.extensions import db
from app.models import Device, Category
from app.exceptions import BusinessException


def create_device(data):
    category = Category.query.get(data["category_id"])
    if not category:
        raise BusinessException(message="分类不存在", code=404)

    device = Device(
        name=data["name"],
        model=data.get("model", ""),
        category_id=data["category_id"],
    )
    db.session.add(device)
    db.session.commit()
    return device


def get_devices(category_id=None):
    query = Device.query.order_by(Device.created_at.desc())
    if category_id is not None:
        query = query.filter_by(category_id=category_id)
    return query.all()


def get_devices_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        raise BusinessException(message="分类不存在", code=404)
    return category.devices.order_by(Device.created_at.desc()).all()


def update_device(device_id, data):
    device = _get_or_404(device_id)

    if "category_id" in data:
        category = Category.query.get(data["category_id"])
        if not category:
            raise BusinessException(message="分类不存在", code=404)

    for field in ("name", "model", "category_id"):
        if field in data:
            setattr(device, field, data[field])

    db.session.commit()
    return device


def delete_device(device_id):
    device = _get_or_404(device_id)
    db.session.delete(device)
    db.session.commit()


def _get_or_404(device_id):
    device = Device.query.get(device_id)
    if not device:
        raise BusinessException(message="设备不存在", code=404)
    return device
