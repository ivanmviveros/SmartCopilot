from rest_framework import serializers
from .models import Diagram
import json

class DiagramSerializer(serializers.ModelSerializer):
    json_user_histories = serializers.JSONField()
    class Meta:
        model = Diagram
        fields = ['id', 'name', 'description', 'xml', 'properties', 'creation_date', 'update_date', 'user_id', 'json_user_histories']