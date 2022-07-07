
from django.urls import include, path
from . import views

urlpatterns = [
    path('get/<int:projectId>', views.get, name='projectGet'),
    path('list/', views.list, name='projectList'),
]
