import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from .models import Comuna, Material, Pedido, TarjetaPago, Carrito
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import UserRegisterForm

# Create your views here.


def cargarInicio(request):
    return render(request, "inicio.html")

def cargarRegistro(request):
    return render(request, "registro.html")

def cargarQuienesSomos(request):
    return render(request, "quienes_somos.html")

def cargarPreguntas(request):
    return render(request, "preguntas.html")

def cargarCotizador(request):
    comunas = Comuna.objects.all()
    materiales = Material.objects.all()

    data = {
        'comunas': comunas,
        'materiales': materiales
    }

    return render(request, "cotizador.html", data)





def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('Inicio')
        else:
            messages.error(request, "Nombre de usuario o contraseña incorrectos.")
            return render(request, 'login.html')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('Inicio')

def cargarRegistro(request):
    form = UserRegisterForm()
    return render(request, 'registro.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Cuenta creada para {username}!')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'registro.html', {'form': form})

