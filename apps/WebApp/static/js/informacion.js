<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
=======
    document.addEventListener('DOMContentLoaded', function() {
>>>>>>> 331ccfe358cdf7a15c87a8a3a5f0723d1fd0d205
    const carbonFootprintElement = document.getElementById('carbon-footprint-value');
    
    async function fetchCarbonFootprint() {
        try {
            const response = await fetch('https://sinca.mma.gob.cl/index.php/json/listadomapa2k19/');
            const data = await response.json();

            // Inspect the structure of `data` in the console
<<<<<<< HEAD
            console.log(data);

            // Access the correct property based on the JSON structure
            const pm25Value = data[120].realtime[0].info.rows[0].c[1].v; // Adjust this based on your JSON structure
=======
            console.log(response);
            console.log(data);

            // Access the correct property based on the JSON structure
            const pm25Value = data[123].realtime[0].info.rows[0].c[1].v; // Adjust this based on your JSON structure
>>>>>>> 331ccfe358cdf7a15c87a8a3a5f0723d1fd0d205
            const pm25Text = `La calidad del aire actual es de ${pm25Value} µg/m³ de PM2.5`;
            
            // Update the content of the element with a link
            carbonFootprintElement.innerHTML = `<a href="#" id="info-link-aire">${pm25Text}</a>`;

            document.getElementById('info-link-aire').addEventListener('click', mostrarMasInfo);
        } catch (error) {
            console.error('Error fetching data from API:', error);
            carbonFootprintElement.textContent = 'No se pudo obtener la calidad del aire.';
        }
    }

    function mostrarMasInfo() {
        // Define the action for more information
        Swal.fire({
            title: "¿Qué significan estos números?",
            text: "You clicked the button!"
        });
    }

    // Initial fetch when the page loads
    fetchCarbonFootprint();

    document.getElementById('mas-informacion-inicio').addEventListener('click', alertMsg)

    function alertMsg(){
        Swal.fire(
            'Sabemos que la salud de nuestro planeta depende en gran medida de la naturaleza que lo sustenta. Es por eso que nos hemos embarcado en una campaña global para plantar árboles. Creemos en el poder transformador de un árbol: no solo purifican el aire que respiramos, sino que también proporcionan hábitats vitales para la vida silvestre y contribuyen a estabilizar el clima.Nos gustaría invitarte a unirte a nosotros en este emocionante viaje.',
             'Tu apoyo y participación son, fundamentales para nuestro éxito. Juntos, podemos marcar la diferencia y dejar un legado duradero de ,cuidado y respeto por nuestro preciado planeta. ¡Ayúdanos a plantar un árbol y juntos crearemos un mundo más verde y próspero para las generaciones venideras!'
       )
       }
});
