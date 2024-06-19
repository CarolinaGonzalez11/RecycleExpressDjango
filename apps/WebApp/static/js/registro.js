document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nombreRegistro = document.getElementById('nombreRegistro').value;
    const apellidoRegistro = document.getElementById('apellidoRegistro').value;
    const telRegistro = document.getElementById('telRegistro').value;

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email)) {
        showModal('Por favor ingrese un correo electrónico válido.');
        return;
    }

    if (password !== confirmPassword) {
        showModal('Las contraseñas no coinciden.');
        return;
    }

    if (!email || !password || !confirmPassword || !nombreRegistro || !apellidoRegistro || !telRegistro) {
        showModal('Por favor complete todos los campos.');
        return;
    }

    showModal('Formulario enviado exitosamente.', true);
});

function showModal(message, isSuccess = false) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorModalBody = document.getElementById('errorModalBody');
    errorModalBody.textContent = message;
    errorModal.show();

    if (isSuccess) {
        setTimeout(function() {
            errorModal.hide();
            resetForm();
        }, 1500);
    }
}

function resetForm() {
    document.getElementById('registrationForm').reset();
}


