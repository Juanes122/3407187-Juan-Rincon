/**
 * ============================================
 * LÓGICA FUNCIONAL - MediCare EHR PRO (Final)
 * ============================================
 */

// --- 1. CLASES (JERARQUÍA POO) ---
class HealthRecord {
    #id; #patientName; #active; #location; #dateCreated;
    constructor(patientName, location, id = null, date = null, active = true) {
        this.#id = id || crypto.randomUUID();
        this.#patientName = patientName;
        this.#active = active;
        this.location = location;
        this.#dateCreated = date || new Date().toLocaleString();
    }
    get id() { return this.#id; }
    get patientName() { return this.#patientName; }
    get isActive() { return this.#active; }
    get location() { return this.#location; }
    get dateCreated() { return this.#dateCreated; }
    set location(value) { this.#location = value || "Sin ubicación"; }
    toggleStatus() { this.#active = !this.#active; }
    getType() { return this.constructor.name; }
}

class Consultation extends HealthRecord {
    #diagnosis;
    constructor(p, l, diag, id, date, active) { super(p, l, id, date, active); this.#diagnosis = diag; }
    getInfo() { return `Diagnóstico: ${this.#diagnosis}`; }
    get rawDetail() { return this.#diagnosis; }
}

class LabTest extends HealthRecord {
    #test;
    constructor(p, l, test, id, date, active) { super(p, l, id, date, active); this.#test = test; }
    getInfo() { return `Examen: ${this.#test}`; }
    get rawDetail() { return this.#test; }
}

class Prescription extends HealthRecord {
    #meds;
    constructor(p, l, meds, id, date, active) { super(p, l, id, date, active); this.#meds = meds; }
    getInfo() { return `Medicamento: ${this.#meds}`; }
    get rawDetail() { return this.#meds; }
}

class User {
    #id; #name; #email;
    constructor(name, email, id = null) {
        this.#id = id || crypto.randomUUID();
        this.#name = name;
        this.#email = email;
    }
    get id() { return this.#id; }
    get name() { return this.#name; }
    get email() { return this.#email; }
    getType() { return this.constructor.name; }
}

class Doctor extends User {
    #spec;
    constructor(n, e, s, id) { super(n, e, id); this.#spec = s; }
    get specialty() { return this.#spec; }
}

class Nurse extends User {
    #ward;
    constructor(n, e, w, id) { super(n, e, id); this.#ward = w; }
    get ward() { return this.#ward; }
}

// --- 2. SISTEMA INTEGRAL ---
class ClinicSystem {
    #records = [];
    #staff = [];
    #audit = [];

    constructor() { this.load(); }

    save() {
        const data = {
            records: this.#records.map(r => ({
                type: r.getType(), name: r.patientName, loc: r.location, 
                detail: r.rawDetail, id: r.id, date: r.dateCreated, active: r.isActive
            })),
            staff: this.#staff.map(s => ({
                type: s.getType(), name: s.name, email: s.email, 
                extra: s instanceof Doctor ? s.specialty : s.ward, id: s.id
            })),
            audit: this.#audit
        };
        localStorage.setItem('medicare_storage', JSON.stringify(data));
    }

    load() {
        const saved = localStorage.getItem('medicare_storage');
        if (!saved) return;
        const data = JSON.parse(saved);
        this.#records = data.records.map(r => {
            if (r.type === 'Consultation') return new Consultation(r.name, r.loc, r.detail, r.id, r.date, r.active);
            if (r.type === 'LabTest') return new LabTest(r.name, r.loc, r.detail, r.id, r.date, r.active);
            return new Prescription(r.name, r.loc, r.detail, r.id, r.date, r.active);
        });
        this.#staff = data.staff.map(s => (s.type === 'Doctor') ? new Doctor(s.name, s.email, s.extra, s.id) : new Nurse(s.name, s.email, s.extra, s.id));
        this.#audit = data.audit || [];
    }

    addRecord(record) { this.#records.push(record); this.logAction(`Registro creado: ${record.patientName}`); this.save(); }
    removeRecord(id) { this.#records = this.#records.filter(r => r.id !== id); this.logAction(`Registro eliminado`); this.save(); }
    addStaff(person) { this.#staff.push(person); this.logAction(`Alta de personal: ${person.name}`); this.save(); }
    removeStaff(id) { this.#staff = this.#staff.filter(s => s.id !== id); this.logAction(`Baja de personal`); this.save(); }
    logAction(msg) { this.#audit.unshift({ date: new Date().toLocaleTimeString(), msg }); this.save(); }

    get records() { return this.#records; }
    get staff() { return this.#staff; }
    get audit() { return this.#audit; }
    getStats() {
        return {
            total: this.#records.length,
            active: this.#records.filter(r => r.isActive).length,
            archived: this.#records.filter(r => !r.isActive).length,
            staff: this.#staff.length
        };
    }
}

const ehrSystem = new ClinicSystem();

// --- 3. MANEJO DEL DOM ---

window.openModal = (id) => document.getElementById(id).classList.add('active');
window.closeModal = (id) => document.getElementById(id).classList.remove('active');

document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('item-list');
    const userList = document.getElementById('user-list');

    // NAVEGACIÓN
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).style.display = 'block';
            renderAll();
        });
    });

    // FORMULARIOS
    document.getElementById('form-record').addEventListener('submit', (e) => {
        e.preventDefault();
        const [type, name, loc, detail] = ['reg-type', 'reg-name', 'reg-location', 'reg-detail'].map(id => document.getElementById(id).value);
        let record = (type === 'Consultation') ? new Consultation(name, loc, detail) : (type === 'LabTest') ? new LabTest(name, loc, detail) : new Prescription(name, loc, detail);
        ehrSystem.addRecord(record);
        closeModal('modal-record');
        e.target.reset();
        renderAll();
    });

    document.getElementById('form-user').addEventListener('submit', (e) => {
        e.preventDefault();
        const [role, name, email, extra] = ['user-role', 'user-name', 'user-email', 'user-extra'].map(id => document.getElementById(id).value);
        ehrSystem.addStaff(role === 'Doctor' ? new Doctor(name, email, extra) : new Nurse(name, email, extra));
        closeModal('modal-user');
        e.target.reset();
        renderAll();
    });

    // --- RENDERIZADORES ---
    function renderRecords() {
        const query = document.getElementById('search-input').value.toLowerCase();
        const fType = document.getElementById('filter-type').value;
        const fStatus = document.getElementById('filter-status').value;

        const filtered = ehrSystem.records.filter(r => {
            const mQuery = r.patientName.toLowerCase().includes(query);
            const mType = (fType === 'all' || r.getType() === fType);
            const mStatus = (fStatus === 'all') || (fStatus === 'active' ? r.isActive : !r.isActive);
            return mQuery && mType && mStatus;
        });

        itemList.innerHTML = filtered.length === 0 ? `<div class="empty-state"><p>🔍 No se encontraron registros</p></div>` : 
            filtered.map(r => `
            <div class="item ${r.isActive ? '' : 'inactive'}">
                <div class="item-header"><h3>${r.patientName}</h3><span class="badge ${r.getType()}">${r.getType()}</span></div>
                <p>📍 ${r.location}</p><p>ℹ️ ${r.getInfo()}</p>
                <div class="item-actions" style="margin-top:10px">
                    <button class="btn btn-secondary btn-small" onclick="toggleRecord('${r.id}')">${r.isActive ? 'Archivar' : 'Reactivar'}</button>
                    <button class="btn btn-danger btn-small" onclick="deleteRecord('${r.id}')">Eliminar</button>
                </div>
            </div>`).join('');
    }

    function renderStaff() {
        const query = document.getElementById('search-users').value.toLowerCase();
        const filtered = ehrSystem.staff.filter(s => s.name.toLowerCase().includes(query));
        userList.innerHTML = filtered.length === 0 ? `<div class="empty-state"><p>👨‍⚕️ No se encontró personal</p></div>` :
            filtered.map(s => `
            <div class="user-card">
                <div class="user-avatar">${s.name[0]}</div>
                <div class="user-name">${s.name}</div>
                <span class="role-badge ${s.getType().toLowerCase()}">${s.getType()}</span>
                <p style="font-size:0.8rem; margin: 10px 0;">${s instanceof Doctor ? 'Especialidad: ' + s.specialty : 'Pabellón: ' + s.ward}</p>
                <button class="btn btn-danger btn-small" style="width:100%" onclick="deleteStaff('${s.id}')">Dar de Baja</button>
            </div>`).join('');
    }

    // *** AQUÍ ESTÁ EL CAMBIO DE LOS ARCHIVADOS ***
    function renderStats() {
        const stats = ehrSystem.getStats();
        const container = document.getElementById('stats-container');
        if (container) {
            container.innerHTML = `
                <div class="stat-card"><div class="stat-value">${stats.total}</div><div class="stat-label">Registros</div></div>
                <div class="stat-card"><div class="stat-value" style="color:#2ecc71">${stats.active}</div><div class="stat-label">Activos</div></div>
                <div class="stat-card"><div class="stat-value" style="color:#e67e22">${stats.archived}</div><div class="stat-label">Archivados</div></div>
                <div class="stat-card"><div class="stat-value" style="color:#3498db">${stats.staff}</div><div class="stat-label">Personal</div></div>
            `;
        }
        const auditList = document.getElementById('audit-list');
        if (auditList) auditList.innerHTML = ehrSystem.audit.map(a => `<div class="transaction-card"><span>${a.msg}</span><small>${a.date}</small></div>`).join('');
    }

    function renderAll() { renderRecords(); renderStaff(); renderStats(); }

    // EVENTOS
    ['search-input', 'filter-type', 'filter-status'].forEach(id => document.getElementById(id).addEventListener('change', renderRecords));
    document.getElementById('search-input').addEventListener('input', renderRecords);
    document.getElementById('search-users').addEventListener('input', renderStaff);

    window.toggleRecord = (id) => { ehrSystem.records.find(r => r.id === id).toggleStatus(); ehrSystem.save(); renderAll(); };
    window.deleteRecord = (id) => { if(confirm("¿Eliminar?")) { ehrSystem.removeRecord(id); renderAll(); } };
    window.deleteStaff = (id) => { if(confirm("¿Dar de baja?")) { ehrSystem.removeStaff(id); renderAll(); } };

    renderAll();
});