from django.contrib import admin
from .models import Option, Message

# Register your models here.

class OptionAdmin(admin.ModelAdmin):
  list_display = ('name', 'short_description')
  searchfields = ['name']

class MessageAdmin(admin.ModelAdmin):
  list_display = ('user', 'short_description')
  searchfields = ['user']
  readonly_fields = ['message']
  fields = (('user', 'message'))

  # def get_queryset(self, request):
  #   qs = super().get_queryset(request)
  #   print(qs.filter(user=request.user))
    # return qs.filter(author=request.user)


admin.site.register(Option, OptionAdmin)
admin.site.register(Message, MessageAdmin)