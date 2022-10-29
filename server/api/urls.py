from core import views as coreViews
from django.urls import path, re_path, include
from . import views

urlpatterns = [
  path('option/', include([
    path('', views.optionGetAll),
    path('get/', views.optionGet),
    path('find/', views.optionFind),
  ])),
  path('message/', include([
    path('', views.message),
    # path('get-all/', views.messageGetAll),
    # path('get/', views.messageGet),
    # path('find/', views.messageFind),
  ])),
]