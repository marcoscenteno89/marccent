from django import forms
# from django_editorjs_fields import EditorJsWidget
from .models import Message


# class PostForm(forms.ModelForm):
#   class Meta:
#     model = Post
#     exclude = []
#     widgets = {
#       'body_editorjs': EditorJsWidget(
#         config = {
#           'minHeight': 100
#         }
#       ),
#       'body_editorjs_text': EditorJsWidget(
#         plugins = [
#           "@editorjs/image", 
#           "@editorjs/header"
#         ]
#       )
#     }