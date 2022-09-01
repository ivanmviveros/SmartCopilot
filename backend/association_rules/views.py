from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .Apriori import Apriori


@api_view(['GET'])
def get(request, key):
  l1=Apriori()
  res=l1.recommended("static/test_base.csv",key)
  return Response({"recommendations": res})