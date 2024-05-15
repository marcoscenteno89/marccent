from django.contrib import admin
from django.urls import path, include

urlpatterns = [
  path('editorjs/', include('django_editorjs_fields.urls')),
]