from django.db import models
from projects.models import Project
# Create your models here.

class Diagrams(models.Model):
    """Model to represent a diagram"""
    project_id = models.ForeignKey(Project, on_delete=models.DO_NOTHING)
    name = models.TextField()
    description = models.TextField()
    xml = models.TextField()
    properties = models.TextField()
    creation_date = models.DateTimeField()


class UserStory(models.Model):
    diagram_id = models.ForeignKey(Diagrams, on_delete=models.CASCADE, related_name="user_stories")
    data = models.JSONField()

