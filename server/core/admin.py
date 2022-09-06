from django.contrib import admin
from .models import Option

# Register your models here.

class OptionAdmin(admin.ModelAdmin):
  list_display = ('name', 'short_description')
  searchfields = ['name']


admin.site.register(Option, OptionAdmin)