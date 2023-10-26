"""
URL configuration for ToDo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, react_app_view, task_list, delete_task, get_task

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # URL para la vista de React
    path('react/', react_app_view, name='react_app_view'),
    path('api/tasks/', task_list, name='task-list'),
    path('api/tasks/delete/<int:task_id>/', delete_task, name='delete_task'),
    path('api/tasks/edit/<int:task_id>/', get_task, name='edit_task'),
    
]