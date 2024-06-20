
from django.urls import path
from . import views 
from .views import login_view, logout_view

urlpatterns = [
    path('',views.cargarInicio, name="Inicio"),

    path('registro/',views.cargarRegistro, name="Registro" ),

    path('QuienesSomos/',views.cargarQuienesSomos, name="QuienesSomos"),

    path('preguntas/',views.cargarPreguntas, name="Preguntas"),

    path('Cotizador/',views.cargarCotizador, name="Cotizador"),
    
    path('login/', login_view, name='login'),

    path('logout/', logout_view, name='logout'),
]