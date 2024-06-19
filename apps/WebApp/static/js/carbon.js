document.addEventListener('DOMContentLoaded', function() {
    const carbonFootprintElement = document.getElementById('carbon-footprint-value');

    async function fetchCarbonFootprint() {
        try {
            const response = await fetch('https://sinca.mma.gob.cl/index.php/json/listadomapa2k19/');
            const data = await response.json();

            // Inspecciona la estructura de `data` en la consola
            console.log(data);

            // Accede a la propiedad correcta según la estructura del JSON
            const pm25Value = data[0].realtime[0].info.rows[0].c[1].v; // Ajusta esto según la estructura real de tu JSON
            carbonFootprintElement.textContent = `La calidad del aire actual es de ${pm25Value} µg/m³ de PM2.5`;
        } catch (error) {
            console.error('Error al obtener los datos de la API:', error);
            carbonFootprintElement.textContent = 'No se pudo obtener la calidad del aire.';
        }
    }

    fetchCarbonFootprint();
});

// IBA A SER HUELLA DE CARBONO, POR ESO EL NOMBRE, PERO SOLO ENCONTRAMOS CALIDAD DEL AIRE