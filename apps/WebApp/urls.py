
from django.urls import path
from . import views 

urlpatterns = [
    path('',views.cargarInicio, name="Inicio"),

    path('registro/',views.cargarRegistro, name="Registro" ),

    path('QuienesSomos/',views.cargarQuienesSomos, name="QuienesSomos"),

    path('preguntas/',views.cargarPreguntas, name="Preguntas"),

    path('Cotizador/',views.cargarCotizador, name="Cotizador"),
]