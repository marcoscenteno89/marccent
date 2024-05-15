# from ninja import Auth
from ninja.security import django_auth
from ninja_jwt.controller import NinjaJWTDefaultController
from .models import Option, Message
from .schemas import OptionSchema, MessageSchema
from django.contrib.auth.models import User
from ninja_extra import NinjaExtraAPI
import json

# api = NinjaAPI()
api = NinjaExtraAPI()

## Auth
api.register_controllers(NinjaJWTDefaultController)

## Option
@api.get("option/", response=list[OptionSchema])
def get_options(request, name: str = None):
  if name and name.strip():
    return Option.objects.filter(name__contains=name, public=True)
  else:
    return Option.objects.filter(public=True)

@api.get("option/{id}", response=OptionSchema)
def get_single_option(request, id: int):
  return Option.objects.get(id=id)

## Message
@api.get("message/", response=list[MessageSchema])
def get_messages(request):
  return Message.objects.all()

@api.get("message/{id}", response=MessageSchema)
def get_single_message(request, id: int):
  return Message.objects.get(id=id)

@api.post("message/", response=MessageSchema)
def create_message(request):
  data = json.loads(request.body)
  user_exists = Message.get_user(data['email'])
  if user_exists.count() > 0: 
    user = User.objects.get(email=data['email'])
    msg = Message.objects.create(
      message = data['message'],
      user = user
    )

  else: 
    new_user = User.objects.create_user(
      username = data['email'].lower(), 
      email = data['email'].lower(), 
      password = '',
      first_name = data['first_name'],
      last_name = data['last_name']
    )
    msg = Message.objects.create(
      message = data['message'],
      user = new_user
    )

  return msg
