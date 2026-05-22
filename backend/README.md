# Enterprise Office Assistant - Backend

## 技术栈

- Python 3.12+
- Flask + Flask-Smorest + SQLAlchemy
- MySQL 8.0
- JWT 认证

## 快速开始

```bash
# 1. 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入真实配置

# 4. 初始化数据库
flask db init
flask db migrate -m "initial"
flask db upgrade

# 5. 启动服务
python run.py
```

## 项目结构

```
backend/
├── app/
│   ├── config.py          # 配置管理
│   ├── extensions.py      # Flask 扩展初始化
│   ├── models/            # SQLAlchemy 数据模型
│   ├── schemas/           # Marshmallow 序列化/反序列化
│   ├── routes/            # API 路由（蓝本）
│   ├── services/          # 业务逻辑层
│   ├── middlewares/        # 中间件（日志、异常处理等）
│   ├── utils/             # 工具函数
│   └── exceptions/        # 自定义异常
├── migrations/            # Flask-Migrate 数据库迁移
├── logs/                  # 日志文件
├── requirements.txt
├── .env.example
└── run.py                 # 应用入口
```

## API 文档

启动服务后访问 http://localhost:5000/docs/swagger 查看 Swagger 文档。
