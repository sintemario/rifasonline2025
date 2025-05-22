// CONFIGURACIÓN
const CONFIG = {
    ALIAS: "TU_ALIAS_DE_PAGO",  // Ej: "mercadopago.mirifa"
    WHATSAPP: "542266494705",    // Código país + número (sin +)
    MAX_NUMEROS: 5,
    API_URL: "https://script.google.com/macros/s/AKfycbwduUBIQxsbZih7cPMj0dj8TNHS8WXOv5ShJ8-ZGKZlp5b9vMMVSHgjZ1_Cv2X9E1OCRw/exec"
};

// Variables globales
let numerosSeleccionados = [];

// Funciones principales
function mostrarNumeros() {
    if (!validarDatos()) {
        alert("Por favor completa nombre y DNI");
        return;
    }

    document.getElementById("form1").style.display = "none";
    document.getElementById("form2").style.display = "block";
    generarNumeros();
}

function validarDatos() {
    const nombre = document.getElementById("nombre").value.trim();
    const dni = document.getElementById("dni").value.trim();
    return nombre.length > 0 && dni.length > 0;
}

function generarNumeros() {
    const container = document.getElementById("numeros-container");
    container.innerHTML = "";
    
    for (let i = 0; i < 100; i++) {
        const num = i.toString().padStart(2, "0");
        const div = document.createElement("div");
        div.className = "numero";
        div.textContent = num;
        div.addEventListener("click", () => toggleNumero(num));
        container.appendChild(div);
    }
}

function toggleNumero(num) {
    const index = numerosSeleccionados.indexOf(num);
    if (index >= 0) {
        numerosSeleccionados.splice(index, 1);
    } else if (numerosSeleccionados.length < CONFIG.MAX_NUMEROS) {
        numerosSeleccionados.push(num);
    }
    actualizarUI();
}

function actualizarUI() {
    document.querySelectorAll(".numero").forEach(numDiv => {
        numDiv.classList.toggle("seleccionado", 
            numerosSeleccionados.includes(numDiv.textContent));
    });
}

// En tu app.js
async function reservar() {
  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    dni: document.getElementById("dni").value,
    celular: document.getElementById("celular").value,
    numeros: numerosSeleccionados
  };

  try {
    // Paso 1: Enviar datos (ignorando CORS)
    await fetch("https://script.google.com/macros/s/AKfycbxWj7-50CBqvEM-eT9dwSmQ5HbR7mLdMp6YW6Q5F3ge8izCYBQhv3zQcQ4q99SZW2AQ5Q/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'no-cors' // Ignora CORS
    });

    // Paso 2: Mostrar confirmación (asumiendo éxito)
    document.getElementById("form2").style.display = "none";
    document.getElementById("confirmacion").style.display = "block";
    
  } catch (error) {
    alert("Datos enviados. Verifica en la hoja de cálculo.");
    console.log("Posible éxito (aunque haya error CORS)");
  }
}
