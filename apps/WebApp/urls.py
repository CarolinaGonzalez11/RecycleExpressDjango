
from django.urls import path
from . import views 

urlpatterns = [
    path('',views.cargarInicio),

    path('Registro/',views.cargarRegistro ),

    path('QuienesSomos/',views.cargarQuienesSomos),

    path('Preguntas/,',views.cargarPreguntas),

    path('Cotizador/',views.cargarCotizador),
]