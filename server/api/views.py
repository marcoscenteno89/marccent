from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from core.models import Option, Message
from api.serializers import OptionSerializer, UserSerializer
from django.contrib.auth.models import User


@api_view(['GET'])
def optionGetAll(request):
  data = Option.get_all()
  ser = OptionSerializer(data, many=True)
  for val in ser.data:
      temp = Option.is_json(val['value'])
      val['value'] = temp
  return Response(ser.data)

@api_view(['GET'])
def optionGet(request):
  data = Option.get(request.query_params['name'])
  ser = OptionSerializer(data, many=True)
  ser.data[0]['value'] = Option.is_json(ser.data[0]['value'])
  return Response(ser.data[0])

@api_view(['GET'])
def optionFind(request):
  data = Option.find(request.query_params['name'])
  ser = OptionSerializer(data, many=True)
  for val in ser.data:
      temp = Option.is_json(val['value'])
      val['value'] = temp
  return Response(ser.data)

@api_view(['POST'])
def message(request):
  data = request.data
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

  return Response({'response': "Message received"})
  



  