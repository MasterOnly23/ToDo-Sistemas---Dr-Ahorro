from django.contrib import admin
from tasks.models import *

# Register your models here.

class TaskAdmin(admin.ModelAdmin):
    list_display=['tarea', 'prioridad', 'agente', 'comentario', 'estado', 'fecha_modificacion']
    search_fields = [ 'tarea', 'prioridad', 'agente', 'estado']
    list_filter = ['prioridad','estado', 'agente']
    list_per_page = 20
    list_editable = ['prioridad','estado', 'agente']

class HistorialAdmin(admin.ModelAdmin):
    list_display=['tarea', 'prioridad', 'agente', 'comentario', 'estado', 'fecha_modificacion']
    search_fields = [ 'tarea', 'prioridad', 'agente', 'estado']
    list_filter = ['prioridad','estado', 'agente']
    list_per_page = 20

admin.site.register(Task,TaskAdmin)
admin.site.register(Historial,HistorialAdmin)