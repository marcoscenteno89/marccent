from django.shortcuts import render
from django.template.response import TemplateResponse, HttpResponse
from .models import Message
# from .admin import UserMessageAdmin

def msg_user_view(request, id):
  print(id)
  id = request.path.split('/')[-2]
  print(id)
  req = request
  req.path = '/admin/core/message/'
  # FormSet = UserMessageAdmin.get_changelist_formset(req)

  # action_form = UserMessageAdmin.action_form(auto_id=None)
  # action_form.fields["action"].choices = UserMessageAdmin.get_action_choices(req)
  # cl = UserMessageAdmin.get_changelist_instance(request)
  # cl.formset = FormSet(queryset=Message.user_msgs_by_id(id))
  # print('outside of method')
  # print(cl.queryset.count())
  # print(cl.queryset)

  context = dict(
  #   UserMessageAdmin.admin_site.each_context(request),
  #   module_name=str(UserMessageAdmin.model._meta.verbose_name_plural),
  #   opts=cl.opts,
  #   cl=cl,
  #   media=UserMessageAdmin.media + action_form.media,
  #   action_form=action_form,
  #   title=cl.title,
  )
  return TemplateResponse(request, "admin/change_list.html", context)