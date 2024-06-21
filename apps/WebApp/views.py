from django.shortcuts import render, redirect
from .models import Comuna, Material
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages

# Create your views here.


def cargarInicio(request):
    return render(request,"inicio.html")

def cargarRegistro(request):
    return render(request,"registro.html")

def cargarQuienesSomos(request):
    return render(request,"quienes_somos.html")

def cargarPreguntas(request):
    return render(request,"preguntas.html")

def cargarCotizador(request):
    comunas = Comuna.objects.all()
    materiales = Material.objects.all()
    
    data = {
        'comunas': comunas,
        'materiales': materiales
    }
    
    return render(request, "cotizador.html", data)

def login_view(request):
    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"¡Bienvenido, {username}!")
                return redirect('Inicio')
            else:
                messages.error(request, 'Usuario o contraseña incorrectos')
    return render(request, 'base.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('Inicio')

