document.addEventListener('DOMContentLoaded', function() {
    cargarTablaPago();

    document.getElementById('form-pago').addEventListener('submit', function(event) {
        event.preventDefault();

        let carrito = [];
        document.querySelectorAll('#tabla-pago tr').forEach(function(row) {
            let cells = row.querySelectorAll('td');
            if (cells.length > 2) {
                let item = {
                    descripcion: cells[1].textContent,
                    total: cells[2].textContent,
                    fecha: cells[3].textContent
                };
                carrito.push(item);
            }
        });

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega items al carrito antes de pagar.");
            return;
        }

        const formData = new FormData(document.getElementById('form-pago'));
        formData.append('carrito', JSON.stringify(carrito));

        fetch('/procesar_pago/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al procesar el pago.');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Pago procesado exitosamente.');
                localStorage.removeItem('carrito');  // Limpiar el carrito
                window.location.href = '/pago/';  // Redirigir al inicio o página de éxito
            } else {
                alert('Error al procesar el pago.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al procesar el pago.');
        });
    });
});

function cargarTablaPago() {
    fetch('/cargar_carrito/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let tablaPago = document.getElementById('tabla-pago');
        tablaPago.innerHTML = ''; // Limpiar la tabla actual

        let totalGeneral = 0;

        data.forEach((item, index) => {
            let fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.descripcion}</td>
                <td>${item.total}</td>
                <td>${new Date(item.fecha).toLocaleDateString()}</td>
            `;
            tablaPago.appendChild(fila);

            totalGeneral += parseFloat(item.total);
        });

        let filaTotal = document.createElement('tr');
        filaTotal.innerHTML = `
            <th scope="row" colspan="3">Total General</th>
            <td>$${totalGeneral.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        `;
        tablaPago.appendChild(filaTotal);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para obtener la cookie CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}