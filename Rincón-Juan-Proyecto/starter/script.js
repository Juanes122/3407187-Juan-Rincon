/* ============================================
   PROYECTO SEMANA 01 - FICHA DE INFORMACIÓN INTERACTIVA 29
   Dominio: Sistema de Historia Clínica Electrónica (EHR)
   ============================================ */

// ============================================
// 1. Objeto principal del dominio
// ============================================

const entityData = {
  name: 'Electronic Health Record System',
  description: 'Sistema digital para el registro, consulta y gestión segura de historias clínicas de pacientes.',
  identifier: 'EHR-CLINIC-2026',
  userLocation: 'Clínica Central - Bogotá',
  isActive: true,



  contact: {
    email: 'soporte@ehrsystem.com',
    phone: '+57 300 555 8899',
    location: 'Clínica Central - Bogotá'
  },

  items: [
    { name: 'Patient Registration', level: 95, category: 'Core' },
    { name: 'Medical History', level: 92, category: 'Clinical' },
    { name: 'Prescriptions', level: 88, category: 'Clinical' },
    { name: 'Lab Results', level: 90, category: 'Diagnostics' },
    { name: 'Appointments', level: 85, category: 'Administrative' },
    { name: 'Billing Records', level: 80, category: 'Financial' }
  ],

  links: [
  {
    platform: 'Documentación',
    url: 'README.md',
    icon: '📘'
  },
  {
    platform: 'Repositorio',
    url: 'https://github.com/Juanes122/3407187-Juan-Rincon.git',
    icon: '💻'
  }
],


  stats: {
    totalPatients: 12450,
    activeRecords: 11890,
    doctors: 145,
    satisfaction: 4.7
  }
};

// ============================================
// 2. Referencias al DOM
// ============================================
const userLocation = document.getElementById('userLocation');
const entityName = document.getElementById('entity-name');
const entityDescription = document.getElementById('entity-description');
const entityContact = document.getElementById('entity-contact');
const itemsList = document.getElementById('items-list');
const linksContainer = document.getElementById('links');
const statsContainer = document.getElementById('stats');
const themeToggle = document.getElementById('theme-toggle');
const copyBtn = document.getElementById('copy-btn');
const toggleItemsBtn = document.getElementById('toggle-items');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ============================================
// 3. Renderizar información básica
// ============================================

const renderBasicInfo = () => {
  const {
    name,
    description,
    contact: { email, phone, location }
  } = entityData;
  userLocation.textContent = `📍 ${entityData.userLocation}`;
  entityName.textContent = name;
  entityDescription.innerHTML = `<p>${description}</p>`;
  entityContact.innerHTML = `
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${phone}</p>
    <p><strong>Ubicación:</strong> ${location}</p>
  `;
};

// ============================================
// 4. Renderizar módulos del sistema
// ============================================

const renderItems = (showAll = false) => {
  const { items } = entityData;
  const itemsToShow = showAll ? items : items.slice(0, 4);

  itemsList.innerHTML = itemsToShow.map(({ name, level, category }) => `
    <div class="item">
      <div class="item-name">${name} <small>(${category})</small></div>
      <div class="item-level">
        <span>${level}%</span>
        <div class="level-bar">
          <div class="level-fill" style="width: ${level}%"></div>
        </div>
      </div>
    </div>
  `).join('');
};

// ============================================
// 5. Renderizar enlaces
// ============================================

const renderLinks = () => {
  const { links } = entityData;

  linksContainer.innerHTML = links.map(({ platform, url, icon }) => `
    <a href="${url}" target="_blank" rel="noopener noreferrer">
      ${icon} ${platform}
    </a>
  `).join('');
};

// ============================================
// 6. Renderizar estadísticas
// ============================================

const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Pacientes totales', value: stats.totalPatients },
    { label: 'Historias activas', value: stats.activeRecords },
    { label: 'Médicos registrados', value: stats.doctors },
    { label: 'Satisfacción', value: stats.satisfaction }
  ];

  statsContainer.innerHTML = statsArray.map(({ label, value }) => `
    <div class="stat-item">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `).join('');
};

// ============================================
// 7. Cambio de tema
// ============================================

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

// ============================================
// 8. Copiar información
// ============================================

const copyInfo = () => {
  const { name, description, contact } = entityData;

  const infoText = `
${name}
${description}
Contacto: ${contact.email}
Ubicación: ${contact.location}
  `.trim();

  navigator.clipboard.writeText(infoText);
  showToast('📋 Información copiada correctamente');
};

const showToast = message => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3000);
};

// ============================================
// 9. Mostrar / ocultar módulos
// ============================================

let showingAllItems = false;

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleItemsBtn.textContent = showingAllItems ? 'Mostrar menos' : 'Mostrar más';
};

// ============================================
// 10. Event listeners
// ============================================

themeToggle.addEventListener('click', toggleTheme);
copyBtn.addEventListener('click', copyInfo);
toggleItemsBtn.addEventListener('click', handleToggleItems);

// ============================================
// 11. Inicialización
// ============================================

const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log('✅ Sistema de Historia Clínica Electrónica inicializado');
};

init();
