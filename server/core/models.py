from django.db import models
from django.template.defaultfilters import truncatechars
# from django.conf import settings
from django.contrib.auth.models import User
import json

# Create your models here.

class Option(models.Model):
  name = models.CharField(max_length=200)
  value = models.TextField(default='')

  def __str__(self):
    return f"{self.id}. {self.name}"

  @property
  def short_description(self):
    return truncatechars(self.value, 100)

  def get(name):
    return Option.objects.filter(name=name).values()
  
  def update(name, val):
    return Option.objects.update_or_create(name=name,value=val)

  def find(term):
    return Option.objects.filter(name__contains=term).values()

  def get_all():
    return Option.objects.values()

  def is_json(value):
    import sys 
    try:
      return json.loads(value)
    except:
      return value


class Message(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  message = models.TextField(default='')

  @property
  def short_description(self):
    return truncatechars(self.message, 100)

  def get_user(email):
    return User.objects.values().filter(email=email)

  def user_msgs(email):
    user = User.objects.get(email=email)
    return Message.objects.filter(user=user)

