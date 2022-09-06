from core import views as coreViews
from django.urls import path, re_path, include
from . import views

urlpatterns = [
  path('option/', include([
    path('get-all/', views.getAll),
  ])),
]