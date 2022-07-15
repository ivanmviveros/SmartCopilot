from django.db import models

class Project(models.Model):
    name = models.TextField()
    description = models.TextField()
    creation_date = models.DateTimeField(null=True,blank=True)
    update_date = models.DateTimeField(null=True,blank=True)

    def __str__(self) -> str:
        return self.name