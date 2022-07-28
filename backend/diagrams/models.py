from django.db import models
from projects.models import Project
# Create your models here.

class Diagram(models.Model):
    """Model to represent a diagram"""
    name = models.TextField()
    description = models.TextField()
    xml = models.TextField()
    properties = models.TextField()
    creation_date = models.DateTimeField(null=True,blank=True)
    update_date = models.DateTimeField(null=True,blank=True)

class UserStory(models.Model):
    diagram_id = models.ForeignKey(Diagram, on_delete=models.CASCADE, related_name="user_stories")
    data = models.JSONField()

