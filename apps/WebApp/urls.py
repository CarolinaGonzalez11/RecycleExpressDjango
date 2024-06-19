
from django.urls import path
from . import views 

urlpatterns = [
    path('',views.cargarInicio),

    path('registro/',views.cargarRegistro ),

    path('Quienes Somos/',views.cargarQuienesSomos),

    path('Preguntas/,',views.cargarPreguntas),

    path('Cotizador/',views.cargarCotizador)
]