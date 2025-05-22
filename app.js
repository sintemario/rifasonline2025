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

async function reservar() {
    // Validación básica
    if (numerosSeleccionados.length === 0) {
        alert("Selecciona al menos un número");
        return;
    }

    // Obtener datos del formulario
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        dni: document.getElementById("dni").value.trim(),
        celular: document.getElementById("celular").value.trim(),
        numeros: numerosSeleccionados
    };

    // Validación avanzada
    if (!data.nombre || !data.dni || !data.celular) {
        alert("Completa todos los campos obligatorios");
        return;
    }

    try {
        // Configuración de la solicitud
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            redirect: "follow" // Importante para Google Apps Script
        });

        // Manejar redirección (necesario para GAS)
        const finalUrl = response.redirected ? response.url : CONFIG.API_URL;
        const finalResponse = await fetch(finalUrl);
        
        if (!finalResponse.ok) {
            throw new Error(`Error del servidor: ${finalResponse.status}`);
        }

        const result = await finalResponse.json();

        // Mostrar confirmación
        if (result.success) {
            document.getElementById("form2").style.display = "none";
            document.getElementById("confirmacion").style.display = "block";
            document.getElementById("alias-display").textContent = CONFIG.ALIAS;
            document.getElementById("whatsapp-link").href = `https://wa.me/${CONFIG.WHATSAPP}`;
            
            // Limpiar selección
            numerosSeleccionados = [];
            actualizarUI();
        } else {
            throw new Error(result.error || "Error desconocido");
        }

    } catch (error) {
        console.error("Error completo:", error);
        alert(`Error al reservar: ${error.message}\nIntenta nuevamente.`);
        
        // Opcional: Reintentar automáticamente
        // setTimeout(reservar, 2000);
    }
}
