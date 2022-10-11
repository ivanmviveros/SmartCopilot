from rest_framework.decorators import api_view
from rest_framework.response import Response
from .Apriori import Apriori

rulesUrl = 'static/association_rules/rules.csv'
baseGroupsUrl = 'static/association_rules/baseGroups.csv'
resultGroupsUrl = 'static/association_rules/resultGroups.csv'


@api_view(['GET'])
def get(request, key):
    res = Apriori().recommended(rulesUrl, baseGroupsUrl, resultGroupsUrl, key)
    return Response({"recommendations": res})


@api_view(['POST'])
def post(request):
    res = Apriori().add(rulesUrl, baseGroupsUrl, resultGroupsUrl, request)
    return Response({"success": res})
