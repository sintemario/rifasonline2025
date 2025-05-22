// CONFIGURACIÓN (EDITA ESTO)
const CONFIG = {
    ALIAS: "TU_ALIAS_DE_PAGO",  // Ej: "continente.contenido"
    WHATSAPP: "542266494705",   // Ej: código país + número sin +
    MAX_NUMEROS: 5,
    API_URL: "https://script.google.com/macros/s/AKfycbwjsZcoI9M6pYHkPxBINN4yA2t7ELn7BTaUOYII8nHi01ER75s3xDvoKTdmQcZYlY93/exec"  // La obtendrás después de desplegar el Apps Script
};

let numerosSeleccionados = [];

function mostrarNumeros() {
    // Validar datos antes de avanzar
    if (!validarDatos()) return;

    document.getElementById("form1").style.display = "none";
    document.getElementById("form2").style.display = "block";
    generarNumeros();
}

function validarDatos() {
    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    // Agrega más validaciones si necesitas
    return nombre && dni; // Retorna true si los campos no están vacíos
}

function generarNumeros() {
    const container = document.getElementById("numeros-container");
    container.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, "0");
        const div = document.createElement("div");
        div.className = "numero";
        div.textContent = num;
        div.onclick = () => toggleNumero(num);
        container.appendChild(div);
    }
}

function toggleNumero(num) {
    const index = numerosSeleccionados.indexOf(num);
    if (index >= 0) {
        numerosSeleccionados.splice(index, 1); // Deseleccionar
    } else if (numerosSeleccionados.length < CONFIG.MAX_NUMEROS) {
        numerosSeleccionados.push(num); // Seleccionar
    }
    actualizarUI();
}

function actualizarUI() {
    const numeros = document.querySelectorAll(".numero");
    numeros.forEach(numDiv => {
        if (numerosSeleccionados.includes(numDiv.textContent)) {
            numDiv.classList.add("seleccionado");
        } else {
            numDiv.classList.remove("seleccionado");
        }
    });
}
async function reservar() {
    const data = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      dni: document.getElementById("dni").value,
      celular: document.getElementById("celular").value,
      numeros: numerosSeleccionados
    };
  
    try {
      // Usamos un proxy CORS para desarrollo
      const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
      const API_URL = PROXY_URL + CONFIG.API_URL;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const result = await response.json();
      
      if (result.success) {
        // Mostrar confirmación
        document.getElementById("form2").style.display = "none";
        document.getElementById("confirmacion").style.display = "block";
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert("Error al reservar: " + error.message);
    }
  }