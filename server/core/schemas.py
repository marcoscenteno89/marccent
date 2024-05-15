from ninja import ModelSchema, Schema
from .models import Option, Message

class OptionSchema(ModelSchema):
  class Meta:
    model = Option
    fields = '__all__'

class MessageSchema(ModelSchema):
  class Meta:
    model = Message
    fields = '__all__'

class MessageCreateSchema(Schema):
  message: str
  user_id: int
