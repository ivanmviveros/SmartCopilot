from django.db import models
from projects.models import Project
from django.contrib.auth.models import User
# Create your models here.


class Diagram(models.Model):
    """Model to represent a diagram"""
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    name = models.TextField()
    description = models.TextField()
    xml = models.TextField()
    properties = models.TextField(null=True, blank=True)
    json_user_histories = models.TextField(null=True, blank=True)
    creation_date = models.DateTimeField(null=True, blank=True)
    update_date = models.DateTimeField(null=True, blank=True)


