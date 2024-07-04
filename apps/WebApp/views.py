import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from .models import Comuna, Material, Pedido, TarjetaPago, Carrito
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm, TarjetaPagoForm, UserForm
from django.contrib.auth.models import User
from datetime import datetime
from django.http import JsonResponse
from django.contrib.messages import get_messages


def cargarPago(request):
    form = TarjetaPagoForm()
    carrito_items = Carrito.objects.filter(usuario=request.user)
    return render(request, "pago.html", {'form': form, 'carrito_items': carrito_items})

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

def register(request):
    data = {
        'form': CustomUserCreationForm()
    }

    if request.method == 'POST':
        user_creation_form = CustomUserCreationForm(data=request.POST)

        if user_creation_form.is_valid():
            user_creation_form.save()
            user = authenticate(username=user_creation_form.cleaned_data['username'], password=user_creation_form.cleaned_data['password1'])
            login(request, user)
            return redirect('Inicio')
        else:
            data['form'] = user_creation_form

    return render(request, 'registro.html', data)

@login_required
@transaction.atomic
def procesar_pago(request):
    if request.method == 'POST':
        form = TarjetaPagoForm(request.POST)
        if form.is_valid():
            carrito_items = Carrito.objects.filter(usuario=request.user)
            if not carrito_items.exists():
                return JsonResponse({'status': 'error', 'message': 'El carrito está vacío.'})

            for item in carrito_items:
                partes = item.descripcion.split(', ')
                if len(partes) < 3:
                    print("Formato de item incorrecto:", item.descripcion)
                    continue
                direccion = partes[0]
                comuna = partes[1]
                valorCotizacion = partes[2].split()[-1]
                Pedido.objects.create(
                    usuario=request.user,
                    direccion=direccion,
                    comuna=comuna,
                    total=item.total,
                    fecha=item.fecha
                )
            carrito_items.delete()

            if form.cleaned_data['guardar_tarjeta']:
                tarjeta = form.save(commit=False)
                tarjeta.usuario = request.user
                tarjeta.save()

            return JsonResponse({'status': 'success'})

        else:
            return JsonResponse({'status': 'error', 'message': 'Errores en el formulario.'})
    else:
        form = TarjetaPagoForm()
    return render(request, 'pago.html', {'form': form})

@login_required
def agregar_al_carrito(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        descripcion = data.get('descripcion')
        total = data.get('total')
        Carrito.objects.create(
            usuario=request.user,
            descripcion=descripcion,
            total=total
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def cargar_carrito(request):
    carrito_items = Carrito.objects.filter(usuario=request.user).values('descripcion', 'total', 'fecha')
    return JsonResponse(list(carrito_items), safe=False)

@login_required
def eliminar_item_carrito(request, id):
    try:
        item = Carrito.objects.get(id=id, usuario=request.user)
        item.delete()
        return JsonResponse({'status': 'success'})
    except Carrito.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)

@login_required
@transaction.atomic
def perfil_usuario(request):
    usuario = request.user
    pedidos = Pedido.objects.filter(usuario=usuario)
    tarjetas = TarjetaPago.objects.filter(usuario=usuario)

    if request.method == 'POST':
        usuario_form = UserForm(request.POST, instance=usuario)
        tarjeta_form = TarjetaPagoForm(request.POST)
        if usuario_form.is_valid():
            usuario_form.save()
            messages.success(request, 'Perfil actualizado correctamente.')
        if tarjeta_form.is_valid():
            nueva_tarjeta = tarjeta_form.save(commit=False)
            nueva_tarjeta.usuario = usuario
            nueva_tarjeta.save()
            messages.success(request, 'Tarjeta agregada correctamente.')
        return redirect('perfil_usuario')
    else:
        usuario_form = UserForm(instance=usuario)
        tarjeta_form = TarjetaPagoForm()

    # Limpiar mensajes solo en esta vista
    storage = get_messages(request)
    for message in storage:
        pass

    context = {
        'usuario_form': usuario_form,
        'tarjeta_form': tarjeta_form,
        'pedidos': pedidos,
        'tarjetas': tarjetas
    }
    return render(request, 'perfil.html', context)

@login_required
def eliminar_usuario(request):
    if request.method == 'POST':
        usuario = request.user
        usuario.delete()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def eliminar_tarjeta(request, id):
    try:
        tarjeta = TarjetaPago.objects.get(id=id, usuario=request.user)
        tarjeta.delete()
        return JsonResponse({'status': 'success'})
    except TarjetaPago.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)

@login_required
def agregar_tarjeta(request):
    if request.method == 'POST':
        form = TarjetaPagoForm(request.POST)
        if form.is_valid():
            nueva_tarjeta = form.save(commit=False)
            nueva_tarjeta.usuario = request.user
            nueva_tarjeta.save()
            messages.success(request, 'Tarjeta agregada correctamente.')
        else:
            messages.error(request, 'Error al agregar la tarjeta.')
    return redirect('perfil_usuario')

