document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    const btnCarrito = document.getElementById('btn-carrito');
    const calcularBtn = document.getElementById('calcularBtn');
    const modalResultado = document.getElementById('modal-resultado');
    const agregarCarritoBtn = document.getElementById('agregarCarritoBtn');
    calcularBtn.addEventListener("click", calcularCotizacion);
    btnCarrito.addEventListener('click', function() {
        mostrarCarrito();
    });

    

    modalResultado.addEventListener('hidden.bs.modal', function() {
        resetForm();
        eliminarBackdrop();
    });

    agregarCarritoBtn.addEventListener("click", function() {
        agregarAlCarrito();
    });

    document.getElementById('offcanvasWithBothOptions').addEventListener('hidden.bs.offcanvas', function() {
        eliminarBackdrop();
    });
});

function mostrarCarrito() {
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasWithBothOptions'));
    offcanvas.show();
}

function agregarAlCarrito() {
    const direccion = document.getElementById("Direccion").value;
    const nombreComuna = document.getElementById('selec-comuna').selectedOptions[0].text;
    const valorCotizacion = document.getElementById("resultado-coti").textContent;

    let descripcion = `Su retiro programado en ${direccion}, ${nombreComuna}  ${valorCotizacion}`;
    
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(descripcion);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    cerrarModal('modal-resultado');
    mostrarCarrito();
}

function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    let lista = document.getElementById('listaRetiros');
    lista.innerHTML = ''; // Limpiar lista actual
    let total = 0;
    carrito.forEach((item, index) => {
        let li = document.createElement('li');
        li.innerHTML = item;
        let btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn-danger btn-sm ms-2';
        btnEliminar.onclick = function() { eliminarItem(index); };
        li.appendChild(btnEliminar);
        lista.appendChild(li);
        total += parseFloat(item.match(/\$([\d,.]+)/)[1].replace(/,/g, ''));
    });
    document.getElementById('totalCarrito').textContent = 'Total: $' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById('mensajeCarrito').style.display = carrito.length > 0 ? 'none' : 'block';
}

function eliminarItem(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}

function cerrarModal(modalId) {
    const myModal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    myModal.hide();
}

function eliminarBackdrop() {
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.style.overflow = 'auto';
}

function resetForm() {
    document.getElementById("Direccion").value = '';
    document.getElementById("ancho").value = '';
    document.getElementById("altura").value = '';
    document.getElementById("largo").value = '';
    document.getElementById("selec-comuna").value = '0';
    document.getElementById("selec-material").value = '0';
}

function calcularCotizacion() {
    const direccion = document.getElementById("Direccion").value;
    const medidaAncho = parseFloat(document.getElementById("ancho").value);
    const medidaAlto = parseFloat(document.getElementById("altura").value);
    const medidaLargo = parseFloat(document.getElementById("largo").value);
    const comunaSeleccionada = document.getElementById("selec-comuna").value;
    const materialSeleccionado = document.getElementById("selec-material").value;

    console.log("Medida Ancho:", medidaAncho);
    console.log("Medida Alto:", medidaAlto);
    console.log("Medida Largo:", medidaLargo);
    console.log("Comuna Seleccionada:", comunaSeleccionada);
    console.log("Material Seleccionado:", materialSeleccionado);

    if (!esValorValido(medidaAncho) || !esValorValido(medidaAlto) || !esValorValido(medidaLargo)) {
        mostrarError("Por favor, ingrese valores válidos entre 1 y 100 en ancho, alto y largo.");
        return;
    }

    if (comunaSeleccionada === "0" || materialSeleccionado === "0") {
        mostrarError("Por favor, seleccione una Comuna y un Material.");
        return;
    }

    let valorBase = determinarValorBase(comunaSeleccionada, materialSeleccionado);
    console.log("Valor Base:", valorBase);

    let costoTotal = valorBase * (medidaAlto * medidaAncho * medidaLargo);
    const costoFormateado = formatearCostoComoMoneda(costoTotal);

    document.getElementById("resultado-coti").textContent = ` tiene un valor de ${costoFormateado}`;
    document.getElementById("agregarCarritoBtn").style.display = "block";
}

function esValorValido(valor) {
    return Number.isFinite(valor) && valor > 0 && valor <= 100;
}

function mostrarError(mensaje) {
    document.getElementById("resultado-coti").textContent = mensaje;
    document.getElementById("agregarCarritoBtn").style.display = "none";
}

function determinarValorBase(comuna, material) {
    let valorComuna = parseFloat(comuna);
    let valorMaterial = parseFloat(material);
    console.log("Valor Comuna:", valorComuna);
    console.log("Valor Material:", valorMaterial);
    return valorComuna + valorMaterial;
}

function formatearCostoComoMoneda(costo) {
    return `$${costo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}





