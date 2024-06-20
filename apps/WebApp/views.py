from django.shortcuts import render, redirect
from .models import Comuna, Material
from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.forms import AuthenticationForm

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
    
    error = ''
    
    if request.method == 'POST':
        
        usuario = request.POST.get('usuario')
        contra = request.POST.get('password')

        if len(usuario) < 1:
            error += 'Debe ingresar nombre de usuario.'

        if len(contra) < 1:
            error += 'Debe ingresar contraseña.'

        user = authenticate(username = usuario,password = contra)

        if user is None:
            error += 'Las credenciales no son validas.'
        else: 
            login(request,user)
            return redirect('inicio')


    return render(request,'login.html',{"error":error})

def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('Inicio')

