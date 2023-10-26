from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer, HistorialSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
import json



class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


def react_app_view(request):
    return render(request, "index.html")


@api_view(["GET", "POST"])
def task_list(request):
    if request.method == "GET":
        tasks = Task.objects.all().order_by('-fecha_modificacion')  # Obtener las tareas desde la base de datos
        data = [
            {
                "id": task.id,
                "tarea": task.tarea,
                "prioridad": task.prioridad,
                "agente": task.agente,
                "estado": task.estado,
                "comentario": task.comentario,
                "fecha_modificacion": task.fecha_modificacion,
            }
            for task in tasks
        ]  # Convertir a un formato JSON

        return JsonResponse(data, safe=False)
    elif request.method == "POST":
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        task.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT"])
def get_task(request, task_id):

    if request.method == "GET":
        try:
            task = get_object_or_404(Task, pk=task_id)
            data = {
                    "id": task.id,
                    "tarea": task.tarea,
                    "prioridad": task.prioridad,
                    "agente": task.agente,
                    "estado": task.estado,
                    "comentario": task.comentario,
                }
            return JsonResponse(data)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == "PUT":
        if task_id is not None:
            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response({'Error':'Tarea no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            
            data = json.loads(request.body)

            task.tarea = data.get('tarea', task.tarea)
            task.prioridad = data.get('prioridad', task.prioridad)
            task.agente = data.get('agente', task.agente)
            task.estado = data.get('estado', task.estado)
            task.comentario = data.get('comentario', task.comentario)
            task.save()

            return   JsonResponse({'message': 'Tarea actualizada con éxito', 'task': model_to_dict(task)})

        return JsonResponse({'error': 'Método no permitido'}, status=405)