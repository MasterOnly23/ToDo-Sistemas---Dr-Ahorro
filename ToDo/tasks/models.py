from django.db import models

# Create your models here.

prio = (('Urgente','Urgente'),
            ('Para Hoy','Para Hoy'),
            ('Cuando Puedas','Cuando Puedas'),
            ('Puede Esperar', 'Puede Esperar'))

agentes = (('Jairo','Jairo'),
            ('Felipe','Felipe'),
            ('Ezequiel','Ezequiel'),
            (('Joaquin','Joaquin')))

esatdo = (('Resuelto','Resuelto'),
            ('Pendiente','Pendiente'),
            ('Cerrado','Cerrado'))


class TaskManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False)

class Task(models.Model):
    tarea = models.CharField(max_length=100, blank=False, null=False)
    prioridad = models.CharField(choices=prio, max_length=25, blank=False, null=False)
    agente = models.CharField(choices=agentes, max_length=50, blank=False, null=False)
    comentario = models.CharField(max_length=100, blank=True, null=False, default='-------')
    estado = models.CharField(max_length=20, blank=False, null=False, choices=esatdo)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    objects = TaskManager()

    def soft_delete(self):
        self.deleted = True
        self.save()

    def restore(self):
        self.deleted = False
        self.save()

    class Meta:
        verbose_name_plural = "Tasks"


class Historial(models.Model):
    tarea = models.CharField(max_length=100, blank=False, null=False)
    prioridad = models.CharField(choices=prio, max_length=25, blank=False, null=False)
    agente = models.CharField(choices=agentes, max_length=50, blank=False, null=False)
    comentario = models.CharField(max_length=100, blank=True, null=False, default='-------')
    estado = models.CharField(max_length=20, blank=False, null=False, choices=esatdo)
    fecha_modificacion = models.DateTimeField()

    class Meta:
        verbose_name_plural = "Historial"
