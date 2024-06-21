from django.db import models

# Create your models here.

class Comuna(models.Model):
    nombre = models.CharField(max_length=50)
    valorC = models.IntegerField()

    def __str__(self):
        return self.nombre

class Material(models.Model):
    nombre = models.CharField(max_length=50)
    valorM = models.IntegerField()

    def __str__(self):
        return self.nombre
 