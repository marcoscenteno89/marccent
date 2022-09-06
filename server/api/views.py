from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from core.models import Option
from . serializers import OptionSerializer

@api_view(['GET'])
def getAll(request):
  data = Option.op_get_all()
  print(data)
  serializer = OptionSerializer(data, many=True)
  return Response(serializer.data)
