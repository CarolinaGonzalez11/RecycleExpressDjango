
from django.urls import path
from . import views 

urlpatterns = [
    path('',views.cargarInicio),

    path('registro/',views.cargarRegistro ),

    path('QuienesSomos/',views.cargarQuienesSomos),

    path('preguntas/',views.cargarPreguntas),

    path('Cotizador/',views.cargarCotizador),
]