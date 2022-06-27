from django.db import models

class Project(models.Model):
    name = models.TextField()
    description = models.TextField()
    creation_date = models.DateTimeField()

   

