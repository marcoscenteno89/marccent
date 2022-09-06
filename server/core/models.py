from django.db import models
from django.template.defaultfilters import truncatechars
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

  def op_get(name):
    obj = Option.objects.filter(name=name).values()
    return obj[0]['value'] if (len(obj) > 0) else 'Item not found'
  
  def op_update(name, val):
    return Option.objects.update_or_create(name=name,value=val)

  def op_filter(filter):

    return 'nothing here'

  def op_get_all():
    items = Option.objects.all()
    values = Option.objects.values()
    alist = list(Option.objects.all())
    # print(items)
    # print(values)
    # for val in items:
    #   temp = Option.is_json(val.value)
    #   val['value'] = temp

    return items

  def is_json(value):
    try:
      return json.loads(value)
    except:
      return value

  