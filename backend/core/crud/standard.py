"""Standard functions for crud"""
from typing import Callable
from django.db.models import query
from django.db.models.query import QuerySet
from rest_framework import status
from rest_framework.response import Response
from core.crud.exeptions import NonCallableParam
from django.db.models import Model
from rest_framework.serializers import Serializer

class Crud():
    """Manages the standard functions for crud in modules"""

    def __init__(self, serializer_class: Serializer, model_class: Model):
        self.serializer_class = serializer_class
        self.model_class = model_class

    def save_instance(self, data, request=None, identifier=0, after_save=None):
        """Saves a model intance"""
        if identifier:
            model_obj = self.model_class.objects.get(pk=identifier)
            data_serializer = self.serializer_class(model_obj, data=data)
        else:
            data_serializer = self.serializer_class(data=data)
            
        if data_serializer.is_valid():
            model_obj = data_serializer.save()
            if Crud.validate_function(after_save):
                after_save(request, data_serializer)
            return {"success": True, "id": model_obj.pk}, status.HTTP_201_CREATED

        answer = self.error_data(data_serializer)
        return answer, status.HTTP_400_BAD_REQUEST

    def add(self, request, before_add=None):
        """Tries to create a row in the database and returns the result"""
        if Crud.validate_function(before_add):
            data = before_add(request.data.copy())
        else:
            data = request.data.copy()
        answer, answer_status = self.save_instance(data, request)
        return Response(answer, status=answer_status, content_type='application/json')

    def replace(self, request, identifier, before_replace=None):
        """Tries to update a row in the db and returns the result"""    
        if Crud.validate_function(before_replace):
            data = before_replace(request.data.copy())
        else:
            data = request.data.copy()
        answer, answer_status =  self.save_instance(data, request, identifier)
        return Response(answer, status=answer_status)

    def get(self, request, identifier, alter_model=None, alter_return=None):
        """Return a JSON response with data for the given id"""
        try:
            model_obj = self.model_class.objects.get(pk=identifier)
            data_serializer = self.serializer_class(model_obj)
            model_data = data_serializer.data.copy()
            if Crud.validate_function(alter_model):
                model_data = alter_model(model_data)

            data = {
                "success": True,
                "data": model_data
            }

            if Crud.validate_function(alter_return):
                data = alter_return(request, data)

            return Response(data, status=status.HTTP_200_OK)
        except self.model_class.DoesNotExist:
            data = {
                "success": False,
                "error": "No existe el registro, quiza haya sido borrado hace poco"
            }
            return Response(data, status=status.HTTP_404_NOT_FOUND)

    def delete(self, identifier, message):
        """Tries to delete a row from db and returns the result"""
        model_obj = self.model_class.objects.get(id=identifier)
        model_obj.delete()
        data = {
            "success": True,
            "message": message
        }
        return Response(data, status=status.HTTP_200_OK)

    def list(self, request):
        """ Returns a JSON response containing registered users"""
        queryset = self.model_class.objects.all()
        result = self.serializer_class(queryset, many=True)

        data = {
            'success': True,
            'data': result.data
        }
        return Response(data, status=status.HTTP_200_OK)

    @staticmethod
    def error_data(serializer):
        """Return a common JSON error result"""
        error_details = {}
        for key in serializer.errors.keys():
            error_details[key] = serializer.errors[key]

        data = {
            "succes": False,
            "Error": {
                "success": False,
                "message": "Los datos enviados no son validos",
                "details": error_details
            }
        }
        return error_details

    @staticmethod
    def validate_function(f):
        """Checks if the given parameter is a function"""
        if f is None:
            return False
        if callable(f):
            return True
        raise NonCallableParam
