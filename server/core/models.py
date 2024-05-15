from django.db import models
from django.template.defaultfilters import truncatechars
from django.contrib.auth.models import User
from django_editorjs_fields import EditorJsJSONField
from django.utils import timezone

class DateCreatedMixin(models.Model):
    date_created = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True
class Option(DateCreatedMixin):
  name = models.CharField(max_length=200)
  value = models.TextField(default='')
  public = models.BooleanField(default=False)

  def __str__(self):
    return f"{self.id}. {self.name}"

  @property
  def short_description(self):
    return truncatechars(self.value, 100)

  # def get(name):
  #   return Option.objects.filter(name=name).values()
  
  # def update(name, val):
  #   return Option.objects.update_or_create(name=name,value=val)

  # def find(term):
  #   return Option.objects.filter(name__contains=term).values()

  # def get_all():
  #   return Option.objects.values()

  def is_json(value):
    import sys 
    try:
      return json.loads(value)
    except:
      return value

class Message(DateCreatedMixin):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  message = models.TextField(default='')

  @property
  def short_description(self):
    return truncatechars(self.message, 100)

  def unique_user():
    max_id = Message.objects.values('user').annotate(max_id=models.Max('id')).values('max_id')
    result = Message.objects.filter(id__in=max_id)
    return result

  def count(self):
    msg = Message.objects.all()
    return msg.filter(user=self.user).count()

  def get_user(email):
    return User.objects.filter(email=email)

  def user_msgs(email):
    user = User.objects.get(email=email)
    return Message.objects.filter(user=user)

  def user_msgs_by_id(id):
    msg = Message.objects.filter(user=id)
    return msg


class UserMessage(Message):

  class Meta:
    proxy = True
    verbose_name = 'Message'
    verbose_name_plural = 'Messages'


class Post(models.Model):
  name = models.CharField(max_length=200)
  body = EditorJsJSONField(
    plugins = [
      "@editorjs/image",
      "@editorjs/header",
    ],
    tools = {
      'Image': {
        'Config': {
          'endpoints': {
            'byFile': '/editorjs/image_upload/',
          }
        }
      }
    }
  )