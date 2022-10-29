from rest_framework import serializers
from core.models import Option, Message
from django.contrib.auth.models import User

class OptionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Option
    fields = ['id', 'name', 'value']

class MessageSerializer(serializers.ModelSerializer):
  class Meta:
    model = Message
    fields = ['id', 'name', 'value']

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['username', 'email', 'id']