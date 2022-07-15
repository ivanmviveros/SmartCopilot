from rest_framework import serializers
from .models import Diagram

class DiagramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagram
        fields = ['id', 'project_id', 'name', 'description', 'xml', 'properties', 'creation_date', 'update_date']