document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTOS DEL DOM
  // ===============================
  const form = document.getElementById("item-form");
  const itemList = document.getElementById("item-list");
  const emptyState = document.getElementById("empty-state");

  const statTotal = document.getElementById("stat-total");
  const statActive = document.getElementById("stat-active");
  const statInactive = document.getElementById("stat-inactive");

  const statsDetails = document.getElementById("stats-details");

  const clearInactiveBtn = document.getElementById("clear-inactive");

  const filterStatus = document.getElementById("filter-status");
  const filterCategory = document.getElementById("filter-category");
  const filterPriority = document.getElementById("filter-priority");
  const searchInput = document.getElementById("search-input");

  // ===============================
  // ESTADO GLOBAL
  // ===============================
  let items = JSON.parse(localStorage.getItem("items")) || [];

  // ===============================
  // LOCAL STORAGE
  // ===============================
  const saveItems = () => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  // ===============================
  // ESTADÍSTICAS BÁSICAS
  // ===============================
  const updateStats = () => {
    statTotal.textContent = items.length;
    statActive.textContent = items.filter(i => i.active).length;
    statInactive.textContent = items.filter(i => !i.active).length;
  };

  // ===============================
  // ESTADÍSTICAS DEL SISTEMA (DETALLADAS)
  // ===============================
  const renderDetailedStats = () => {
    statsDetails.innerHTML = "";

    if (items.length === 0) return;

    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const byPriority = items.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {});

    Object.entries(byCategory).forEach(([category, count]) => {
      statsDetails.innerHTML += `
        <div class="stat-card">
          <h4>Categoría</h4>
          <p>${category}: ${count}</p>
        </div>
      `;
    });

    Object.entries(byPriority).forEach(([priority, count]) => {
      statsDetails.innerHTML += `
        <div class="stat-card">
          <h4>Prioridad</h4>
          <p>${priority}: ${count}</p>
        </div>
      `;
    });
  };

  // ===============================
  // FILTROS + BÚSQUEDA
  // ===============================
  const getFilteredItems = () => {
    return items.filter(item => {

      if (filterStatus.value === "active" && !item.active) return false;
      if (filterStatus.value === "inactive" && item.active) return false;

      if (filterCategory.value !== "all" && item.category !== filterCategory.value) {
        return false;
      }

      if (filterPriority.value !== "all" && item.priority !== filterPriority.value) {
        return false;
      }

      const search = searchInput.value.toLowerCase();
      if (
        search &&
        !item.name.toLowerCase().includes(search) &&
        !item.description.toLowerCase().includes(search)
      ) {
        return false;
      }

      return true;
    });
  };

  // ===============================
  // RENDERIZAR ITEMS
  // ===============================
  const renderItems = () => {
    itemList.innerHTML = "";

    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) {
      emptyState.style.display = "block";
      updateStats();
      renderDetailedStats();
      return;
    }

    emptyState.style.display = "none";

    filteredItems.forEach(item => {
      const div = document.createElement("div");
      div.className = `task-item priority-${item.priority} ${item.active ? "" : "completed"}`;

      div.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${item.active ? "" : "checked"}>
        <div class="task-content">
          <h3>${item.name}</h3>
          <p>${item.description || "Sin descripción"}</p>

          <div class="task-meta">
            <span class="task-badge badge-category">${item.category}</span>
            <span class="task-badge badge-priority priority-${item.priority}">
              ${item.priority}
            </span>
          </div>
        </div>

        <div class="task-actions">
          <button class="btn-delete">🗑️</button>
        </div>
      `;

      // Activar / Archivar
      div.querySelector(".task-checkbox").addEventListener("change", () => {
        item.active = !item.active;
        saveItems();
        renderItems();
      });

      // Eliminar individual
      div.querySelector(".btn-delete").addEventListener("click", () => {
        if (!confirm("¿Eliminar este registro?")) return;
        items = items.filter(i => i !== item);
        saveItems();
        renderItems();
      });

      itemList.appendChild(div);
    });

    updateStats();
    renderDetailedStats();
  };

  // ===============================
  // CREAR NUEVO REGISTRO
  // ===============================
  form.addEventListener("submit", e => {
    e.preventDefault();

    const newItem = {
      name: document.getElementById("item-name").value.trim(),
      description: document.getElementById("item-description").value.trim(),
      category: document.getElementById("item-category").value,
      priority: document.getElementById("item-priority").value,
      active: true,
      createdAt: new Date().toISOString()
    };

    if (!newItem.name) {
      alert("El nombre es obligatorio");
      return;
    }

    items.push(newItem);
    saveItems();
    form.reset();
    renderItems();
  });

  // ===============================
  // ELIMINAR ARCHIVADOS
  // ===============================
  clearInactiveBtn.addEventListener("click", () => {
    if (!confirm("¿Eliminar todos los registros archivados?")) return;

    items = items.filter(item => item.active);
    saveItems();
    renderItems();
  });

  // ===============================
  // EVENTOS DE FILTROS
  // ===============================
  [filterStatus, filterCategory, filterPriority, searchInput]
    .forEach(el => el.addEventListener("input", renderItems));

  // ===============================
  // INICIALIZACIÓN
  // ===============================
  renderItems();
});