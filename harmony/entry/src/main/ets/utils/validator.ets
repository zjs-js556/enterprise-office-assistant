export class Validator {
  static isNotEmpty(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  static isValidEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  static isValidAge(age: number): boolean {
    return Number.isInteger(age) && age >= 18 && age <= 60;
  }

  static isValidName(name: string): boolean {
    if (!name) {
      return false;
    }
    const trimmed = name.trim();
    return trimmed.length >= 1 && trimmed.length <= 20;
  }

  static isValidDeviceName(name: string): boolean {
    if (!name) {
      return false;
    }
    const trimmed = name.trim();
    return trimmed.length >= 1 && trimmed.length <= 100;
  }

  static isValidModel(model: string): boolean {
    if (!model || model.trim().length === 0) {
      return true; // model is optional
    }
    return model.trim().length <= 100;
  }

  static validateLoginForm(username: string, password: string): string | null {
    if (!Validator.isNotEmpty(username)) {
      return '请输入用户名';
    }
    if (!Validator.isNotEmpty(password)) {
      return '请输入密码';
    }
    return null;
  }

  static validateEmployeeForm(name: string, age: string, email: string): string | null {
    if (!Validator.isValidName(name)) {
      return '姓名长度应在1-20个字符之间';
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || !Validator.isValidAge(ageNum)) {
      return '年龄应在18-60岁之间';
    }
    if (!Validator.isValidEmail(email)) {
      return '请输入有效的邮箱地址';
    }
    return null;
  }

  static validateCategoryForm(name: string): string | null {
    if (!Validator.isValidName(name)) {
      return '分类名称长度应在1-20个字符之间';
    }
    return null;
  }

  static validateDeviceForm(name: string, model: string, categoryId: number): string | null {
    if (!Validator.isValidDeviceName(name)) {
      return '设备名称长度应在1-100个字符之间';
    }
    if (!Validator.isValidModel(model)) {
      return '设备型号长度不能超过100个字符';
    }
    if (!categoryId || categoryId <= 0) {
      return '请选择设备分类';
    }
    return null;
  }
}
