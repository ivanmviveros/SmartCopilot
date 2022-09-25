from rest_framework import serializers
from .models import Diagram
import json


class DiagramSerializer(serializers.ModelSerializer):
    json_user_histories = serializers.JSONField()

    class Meta:
        model = Diagram
        fields = ['id', 'name', 'description', 'xml', 'creation_date',
                  'update_date', 'json_user_histories', 'id_project']
