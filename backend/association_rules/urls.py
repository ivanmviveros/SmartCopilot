
from django.urls import include, path
from . import views

urlpatterns = [
    path('list/<str:key>', views.get, name='listOptions'),
 
]
