
from django.urls import include, path
from . import views

urlpatterns = [
    path('create/', views.create, name='projectCreate'),
    path('get/<int:projectId>', views.get, name='projectGet'),
    path('list/', views.list, name='projectList'),
    path('update/<int:projectId>', views.update, name='projectUpdate'),
]
 