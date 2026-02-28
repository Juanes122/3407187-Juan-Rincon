# 🏥 MediCare EHR - Sistema de Gestión Hospitalaria

**MediCare EHR** es una aplicación web profesional diseñada para la gestión de registros médicos y personal hospitalario. El sistema utiliza una arquitectura basada en **Programación Orientada a Objetos (POO)** con JavaScript moderno (ES6+), garantizando la integridad de los datos mediante encapsulamiento y persistencia local.

---

## 🚀 Características Principales

* **Gestión de Personal Médico:** Registro y baja de Doctores y Enfermeros con campos específicos (Especialidades y Pabellones).
* **Registros Clínicos Dinámicos:** Soporte para Consultas, Exámenes de Laboratorio y Recetas Médicas mediante herencia de clases.
* **Búsqueda e Inteligencia de Filtros:** Sistema de filtrado combinado que permite buscar por nombre, tipo de registro y estado (Activo/Archivado) simultáneamente.
* **Persistencia de Datos (LocalStorage):** Los datos se guardan automáticamente en el navegador, permitiendo que la información permanezca tras recargar la página.
* **Tablero de Estadísticas Real:** Visualización en tiempo real del total de registros, casos activos, personal de alta y, específicamente, **registros archivados**.
* **Log de Auditoría:** Registro cronológico de todas las acciones (altas, bajas, ediciones) realizadas en el sistema.

---

## 🏗️ Arquitectura del Software

El sistema está construido bajo principios de **POO** (Programación Orientada a Objetos):

### Jerarquía de Clases
* **Salud (`HealthRecord`)**: Clase base con clases derivadas `Consultation`, `LabTest` y `Prescription`. Utiliza atributos privados para proteger el ID y la fecha de creación.
* **Personal (`User`)**: Clase base con especializaciones `Doctor` (Especialidad) y `Nurse` (Pabellón).
* **Sistema (`ClinicSystem`)**: Clase controladora (Singleton) que gestiona el almacenamiento, la lógica de guardado y la generación de estadísticas.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 / CSS3**: Interfaz de usuario moderna basada en componentes, modales y navegación por pestañas.
* **JavaScript (Vanilla ES6+)**: Lógica pura, manipulación del DOM y gestión de clases privadas (`#`).
* **LocalStorage API**: Almacenamiento persistente en el cliente.
* **Crypto API**: Uso de `crypto.randomUUID()` para generar identificadores únicos de registros.

---

## 📖 Instrucciones de Uso

1.  **Registrar Personal:** En la pestaña "Personal Médico", usa el botón de "Alta Personal".
2.  **Gestionar Pacientes:** Crea registros desde la pestaña de "Registros Médicos". Puedes archivar casos para quitarlos de la vista activa.
3.  **Filtrado Avanzado:** Utiliza la barra de búsqueda y los selectores de tipo/estado para encontrar datos específicos de forma instantánea.
4.  **Control de Estadísticas:** Consulta la pestaña de "Estadísticas" para ver el rendimiento y volumen de datos del hospital.

---

## ⚙️ Instalación

1.  Descarga los archivos `index.html`, `styles.css` y `script.js`.
2.  Asegúrate de que estén en la misma carpeta.
3.  Abre `index.html` en tu navegador.

---

> **Nota de Desarrollo:** Este sistema implementa la "rehidratación de objetos", lo que significa que al recuperar datos del LocalStorage, vuelven a convertirse en instancias de sus clases originales conservando todos sus métodos.
