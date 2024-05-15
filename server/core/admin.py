from django.contrib import admin
from django.urls import path
from .models import Option, Message, UserMessage, Post
from .views import msg_user_view

admin.site.site_header = 'Marccent Admin'
class OptionAdmin(admin.ModelAdmin):
  list_display = ('name', 'date_created', 'public', 'short_description')
  searchfields = ['name']


class PostAdmin(admin.ModelAdmin):
  list_display = ('id', 'name')
  searchfields = ['name']
  fields = (('name', 'body'),)


class MessageAdmin(admin.ModelAdmin):
  list_display = ('select', 'user', 'count', 'short_description')
  readonly_fields = ['message', 'user']

  def get_queryset(self, request):
    qs = super().get_queryset(request)
    return Message.unique_user()

  def select(self, obj):
    from django.utils.html import format_html
    url = '/admin/core/message/user/{}/'.format(obj.user.id)
    return format_html('<a href="{}">Select</a>'.format(url))


class UserMessageAdmin(MessageAdmin):
  # list_display = ('description')
  # readonly_fields = ['description']

  class Meta:
    proxy = True
    verbose_name = 'user message'
    verbose_name_plural = 'user messages'

  def get_queryset(self, request):
    id = request.path.split('/')[-2]
    print(id)
    print(request)
    qs = super().get_queryset(request)
    # qs = Message.user_msgs_by_id(id)
    return qs

  def get_urls(self):
    urls = super().get_urls()
    my_urls = [
      path('user/<int:id>/', msg_user_view, name='msg_view'),
    ]
    return my_urls + urls

  def msg_user_view(self, request, id):
    from django.template.response import TemplateResponse, HttpResponse

    req = request
    req.path = '/admin/core/message/'
    FormSet = self.get_changelist_formset(req)

    action_form = self.action_form(auto_id=None)
    action_form.fields["action"].choices = self.get_action_choices(req)
    cl = self.get_changelist_instance(request)
    cl.formset = FormSet(queryset=Message.user_msgs_by_id(id))
    # print('outside of method')
    # print(cl.queryset.count())
    # print(cl.queryset)

    context = dict(
      self.admin_site.each_context(request),
      module_name = str(self.model._meta.verbose_name_plural),
      opts = cl.opts,
      cl = cl,
      media = self.media + action_form.media,
      action_form = action_form,
      title = cl.title,
    )
    return TemplateResponse(request, "admin/change_list.html", context)


admin.site.register(Option, OptionAdmin)
admin.site.register(Post, PostAdmin)

admin.site.register(Message, MessageAdmin)
# admin.site.register(UserMessage, UserMessageAdmin)