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
async function reservar(event) {
  event.preventDefault();
  
  try {
    // Validación reforzada
    if (numerosSeleccionados.length === 0) {
      throw new Error("Selecciona al menos un número");
    }

    const camposRequeridos = ['nombre', 'dni', 'celular'];
    const faltantes = camposRequeridos.filter(id => !document.getElementById(id).value.trim());
    
    if (faltantes.length > 0) {
      throw new Error(`Faltan campos: ${faltantes.join(', ')}`);
    }

    // Construcción del payload
    const payload = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      celular: document.getElementById("celular").value.trim(),
      numeros: numerosSeleccionados
    };

    console.log("Payload creado:", payload);

    // Envío con manejo de errores mejorado
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    if (!result.success) {
      throw new Error(result.error || "Error desconocido del servidor");
    }

    // Éxito
    document.getElementById("form2").style.display = "none";
    document.getElementById("confirmacion").style.display = "block";
    
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error al reservar: ${error.message}`);
  }
}
