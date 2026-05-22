class BusinessException(Exception):
    def __init__(self, message="业务异常", code=400, data=None):
        self.message = message
        self.code = code
        self.data = data
        super().__init__(self.message)
