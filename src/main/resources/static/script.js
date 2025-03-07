let IPADDRESS = "localhost";

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();

    document.getElementById("add-btn").addEventListener("click", function (event) {
        event.preventDefault();
        if (validateForm()) {
            submitProperty();
        }
    });

    document.getElementById("update-btn").addEventListener("click", function (event) {
        event.preventDefault();
        if (validateForm()) {
            updateProperty();
        }
    });

    addRealTimeValidation();
});

let editingPropertyId = null;

function loadProperties() {
    fetch(`http://${IPADDRESS}:8080/properties`)
        .then(response => response.json())
        .then(properties => {
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = ""; 
            properties.forEach(property => {
                tableBody.appendChild(createPropertyRow(property));
            });
        })
        .catch(error => console.error("Error cargando propiedades:", error));
}

function submitProperty() {
    if (editingPropertyId) {
        updateProperty();
    } else {
        addProperty();
    }
}

function addProperty() {
    const address = document.getElementById("address").value;
    const price = document.getElementById("price").value;
    const size = document.getElementById("size").value;
    const description = document.getElementById("description").value;

    const newProperty = { address, price, size, description };
    fetch(`http://${IPADDRESS}:8080/properties/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty)
    })
        .then(response => response.json())
        .then(() => {
            loadProperties();
            resetForm();
            alert("Creado exitosamente!");
        })
        .catch(error => console.error("Error agregando propiedad:", error));
}

function editProperty(id, address, price, size, description) {
    document.getElementById("address").value = address;
    document.getElementById("price").value = price;
    document.getElementById("size").value = size;
    document.getElementById("description").value = description;
    
    editingPropertyId = id;
    document.getElementById("update-btn").style.display = "block";
}

function updateProperty() {
    if (!editingPropertyId) return;
    const updatedProperty = {
        id: editingPropertyId,
        address: document.getElementById("address").value,
        price: document.getElementById("price").value,
        size: document.getElementById("size").value,
        description: document.getElementById("description").value
    };
    fetch(`http://${IPADDRESS}:8080/properties/${editingPropertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProperty)
    })
        .then(response => response.json())
        .then(() => {
            loadProperties();
            resetForm();
            alert("Actualizado exitosamente!");
        })
        .catch(error => console.error("Error actualizando propiedad:", error));
}

function deleteProperty(id) {
    fetch(`http://${IPADDRESS}:8080/properties/${id}`, { method: "DELETE" })
        .then(() => {
            loadProperties();
            alert("Borrado exitosamente!");
        })
        .catch(error => console.error("Error eliminando propiedad:", error));
}

function createPropertyRow(property) {
    const tr = document.createElement("tr");
    tr.id = `row-${property.id}`;
    tr.innerHTML = `
        <td>${property.id || "N/A"}</td>
        <td>${property.address || "Sin dirección"}</td>
        <td>${property.price || "Sin precio"}</td>
        <td>${property.size || "Sin tamaño"}</td>
        <td>${property.description || "Sin descripción"}</td>
        <td>
            <button class="boton" onclick="editProperty(${property.id}, '${property.address}', '${property.price}', '${property.size}', '${property.description}')">Editar</button>
            <button class="boton" onclick="deleteProperty(${property.id})">Borrar</button>
        </td>
    `;

    return tr;
}

function resetForm() {
    document.getElementById("property-form").reset();
    editingPropertyId = null;
    document.getElementById("update-btn").style.display = "none";
    clearAllErrors();
}


function validateForm() {
    let valid = true;
    
    valid &= validateField("address", 5, 100, "Debe tener entre 5 y 100 caracteres.");
    valid &= validateNumber("price", 100, 1000000, "Debe estar entre $100 y $1,000,000.");
    valid &= validateField("description", 5, 255, "Debe tener entre 5 y 255 caracteres.");

    if (!valid) {
        alert("Corrige los errores antes de continuar.");
    }

    return valid;
}

function validateField(id, minLength, maxLength, errorMessage) {
    const input = document.getElementById(id);
    const value = input.value.trim();
    
    if (value.length < minLength || value.length > maxLength) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
    }
}

function validateNumber(id, min, max, errorMessage) {
    const input = document.getElementById(id);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < min || value > max) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
    }
}


function addRealTimeValidation() {
    document.getElementById("address").addEventListener("input", () => validateField("address", 5, 100, "Debe tener entre 5 y 100 caracteres."));
    document.getElementById("price").addEventListener("input", () => validateNumber("price", 100, 1000000, "Debe estar entre $100 y $1,000,000."));
    document.getElementById("description").addEventListener("input", () => validateField("description", 5, 255, "Debe tener entre 5 y 255 caracteres."));
}


function showError(input, message) {
    let errorElement = document.getElementById(input.id + "-error");
    
    if (!errorElement) {
        errorElement = document.createElement("small");
        errorElement.id = input.id + "-error";
        errorElement.style.color = "red";
        input.insertAdjacentElement("afterend", errorElement);
    }
    
    errorElement.textContent = message;
}

function clearError(input) {
    const errorElement = document.getElementById(input.id + "-error");
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function clearAllErrors() {
    document.querySelectorAll("small[id$='-error']").forEach(errorElement => {
        errorElement.textContent = "";
    });
}
