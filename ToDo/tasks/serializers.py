# serializers.py
from rest_framework import serializers
from .models import Task, Historial

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class HistorialSerializer(serializers.ModelSerializer):
    class Meta:
            model = Historial
            fields = '__all__'
