/**
 * Tripio Preview App Engine
 * Simulated Frontend Logic with LocalStorage Persistence
 */

const App = {
    state: {
        currentScreen: 'home',
        homeView: 'timeline',
        trip: JSON.parse(localStorage.getItem('tripio_current')) || null,
        trips: JSON.parse(localStorage.getItem('tripio_all_trips')) || [],
        costs: JSON.parse(localStorage.getItem('tripio_costs')) || [],
        proposals: JSON.parse(localStorage.getItem('tripio_proposals')) || []
    },

    init() {
        this.bindEvents();
        this.render();
        console.log("Tripio Engine Initialized");
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = btn.getAttribute('data-screen');
                this.navigate(screen);
            });
        });
    },

    navigate(screen) {
        this.state.currentScreen = screen;

        // Update UI Active State
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-screen') === screen);
        });

        this.render();
    },

    render() {
        try {
            const container = document.getElementById('main-content');
            const header = document.querySelector('.app-header');
            const nav = document.querySelector('.bottom-nav');
            const headerTitle = document.getElementById('current-trip-name');
            const headerDates = document.getElementById('trip-dates');

            // 1. My Trips (Home Global Portal)
            if (!this.state.trip || !this.state.trip.id) {
                header.classList.add('hidden');
                nav.classList.add('hidden');
                container.innerHTML = this.screens.myTrips();
                return;
            }

            // 2. Active Trip View
            header.classList.remove('hidden');
            nav.classList.remove('hidden');
            headerTitle.innerText = this.state.trip.name || "Mi Viaje";
            headerDates.innerText = this.state.trip.dates || "Sin fechas";

            container.innerHTML = '';

            switch (this.state.currentScreen) {
                case 'home':
                    container.innerHTML = this.screens.dashboard();
                    break;
                case 'proposals':
                    container.innerHTML = this.screens.proposals();
                    break;
                case 'decided':
                    container.innerHTML = this.screens.decided();
                    break;
                case 'propose':
                    this.showProposeModal();
                    break;
            }
        } catch (err) {
            console.error("Render error:", err);
            localStorage.clear();
            location.reload();
        }
    },


    calculateFinancials() {
        if (!this.state.trip) return { totalGastado: 0, budgetLimit: 0, percentage: 0 };

        let fixedCosts = 0;
        (this.state.trip.accommodations || []).forEach(a => fixedCosts += (a.totalPrice || 0));
        (this.state.trip.transports || []).forEach(t => fixedCosts += (t.price || 0));

        // MVP simplified math: just fixed costs + (daily budget * arbitrary 5 days)
        const dailyTotal = (this.state.trip.dailyBudget || 0) * 5;
        const totalGastado = fixedCosts + dailyTotal;

        const budgetLimit = this.state.trip.budgetLimit * this.state.trip.participants;
        let percentage = budgetLimit > 0 ? (totalGastado / budgetLimit) * 100 : 0;
        if (percentage > 100) percentage = 100;

        return { totalGastado, budgetLimit, percentage };
    },

    saveTrip() {
        const name = document.getElementById('t-name').value;
        const startDate = document.getElementById('t-start-date').value;
        const endDate = document.getElementById('t-end-date').value;
        const dailyBudget = parseInt(document.getElementById('t-daily').value) || 0;
        const budgetLimit = parseInt(document.getElementById('t-limit').value) || 0;
        const currency = document.getElementById('t-currency').value;

        // Validations
        if ((startDate && !endDate) || (!startDate && endDate)) {
            this.showToast("⚠️ Debes proporcionar ambas fechas o dejarlas vacías.");
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            this.showToast("⚠️ La fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        const newTrip = {
            id: Date.now().toString(),
            name,
            startDate,
            endDate,
            dates: startDate && endDate ? `${startDate} al ${endDate}` : 'Sin Definir',
            participants: 1,
            dailyBudget,
            budgetLimit,
            currency,
            accommodations: [],
            transports: [],
            events: [],
            proposals: []
        };

        this.state.trips.push(newTrip);
        localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

        // Auto select the new trip
        this.selectTrip(newTrip.id);

        this.closeModal();
        this.showToast("✨ ¡Viaje creado exitosamente!");
    },

    saveEditTrip() {
        const name = document.getElementById('t-name').value;
        const startDate = document.getElementById('t-start-date').value;
        const endDate = document.getElementById('t-end-date').value;
        const dailyBudget = parseInt(document.getElementById('t-daily').value) || 0;
        const budgetLimit = parseInt(document.getElementById('t-limit').value) || 0;
        const currency = document.getElementById('t-currency').value;

        if (!this.state.trip) return;

        // Validations
        if ((startDate && !endDate) || (!startDate && endDate)) {
            this.showToast("⚠️ Debes proporcionar ambas fechas o dejarlas vacías.");
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            this.showToast("⚠️ La fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        this.state.trip.name = name;
        this.state.trip.startDate = startDate;
        this.state.trip.endDate = endDate;
        this.state.trip.dates = startDate && endDate ? `${startDate} al ${endDate}` : 'Sin Definir';
        this.state.trip.dailyBudget = dailyBudget;
        this.state.trip.budgetLimit = budgetLimit;
        this.state.trip.currency = currency;

        const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
        if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

        localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
        localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

        this.closeModal();
        this.showToast("📝 ¡Viaje actualizado exitosamente!");
        this.render();
    },

    deleteTrip() {
        if (!this.state.trip) return;
        if (confirm("⚠️ ¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer.")) {
            this.state.trips = this.state.trips.filter(t => t.id !== this.state.trip.id);
            localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));
            this.closeModal();
            this.closeTrip();
            this.showToast("🗑️ Viaje eliminado exitosamente.");
        }
    },

    selectTrip(id) {
        const selected = this.state.trips.find(t => t.id === id);
        if (selected) {
            this.state.trip = selected;
            this.state.currentScreen = 'home';
            localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
            this.render();
        }
    },

    closeTrip() {
        this.state.trip = null;
        this.state.currentScreen = 'home';
        localStorage.removeItem('tripio_current');
        this.render();
    },

    showToast(msg) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = msg;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    resetTrip() {
        if (confirm("⚠️ ¿Estás seguro de que quieres borrar este viaje? Se perderán todos los datos locales.")) {
            localStorage.clear();
            location.reload();
        }
    },

    buildCalendarHtml() {
        if (!this.state.trip.startDate || !this.state.trip.endDate) {
            return `
                <div class="card" style="text-align: center; padding: 30px 20px;">
                    <p style="font-size: 1.5rem; margin-bottom: 10px;">📅</p>
                    <h4 style="margin-bottom: 8px;">Fechas no definidas</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">Definí las fechas del viaje para ver el calendario.</p>
                    <button onclick="App.showEditTripModal()" class="primary" style="padding: 10px 20px; border-radius: 12px;">Establecer Fechas</button>
                </div>
            `;
        }

        const startDateObj = new Date(this.state.trip.startDate + "T12:00:00Z");
        const endDateObj = new Date(this.state.trip.endDate + "T12:00:00Z");

        const daysInRange = [];
        let currentDay = new Date(startDateObj);
        while (currentDay <= endDateObj) {
            daysInRange.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        const allItems = [...(this.state.trip.events || []), ...(this.state.trip.proposals || []).filter(p => p.status === 'confirmed')];
        const eventDates = allItems.reduce((acc, item) => {
            if (item.date) acc[item.date] = (acc[item.date] || 0) + 1;
            return acc;
        }, {});

        const startDayOfWeek = startDateObj.getDay();
        let gridHtml = '';

        for (let i = 0; i < startDayOfWeek; i++) {
            gridHtml += `<div style="padding: 10px; min-height: 50px;"></div>`;
        }

        daysInRange.forEach(dateObj => {
            const dateStr = dateObj.toISOString().split('T')[0];
            const d = dateObj.getDate();
            const eventsCount = eventDates[dateStr] || 0;
            const badgeHtml = eventsCount > 0 ? '<div style="margin: 4px auto 0; width: 6px; height: 6px; background: var(--primary); border-radius: 50%;"></div>' : '';
            const styleStr = eventsCount > 0 ? 'background: white; box-shadow: var(--shadow-neumorph); font-weight: bold; color: var(--brand);' : 'color: var(--text-muted);';

            gridHtml += `
                <div style="padding: 10px 5px; min-height: 50px; text-align: center; border-radius: 12px; cursor: pointer; transition: all 0.2s; ${styleStr}" onclick="App.showToast('Eventos en ${dateStr}: ${eventsCount}')">
                    <span style="font-size: 0.9rem;">${d}</span>
                    ${badgeHtml}
                </div>
            `;
        });

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthTitle = monthNames[startDateObj.getMonth()] + " " + startDateObj.getFullYear();

        return `
            <div class="card" style="padding: 16px;">
                <p style="text-align:center; font-weight:800; color:var(--brand); margin-bottom:12px;">${monthTitle}</p>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 15px; font-size: 0.75rem; font-weight: bold; color: var(--text-muted);">
                    <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;">
                    ${gridHtml}
                </div>
            </div>
            <p style="text-align:center; font-size:0.8rem; color:var(--text-muted); margin-top:12px;">
                Los días con punto naranja tienen eventos confirmados.
            </p>
        `;
    },



    screens: {
        myTrips() {
            return `
                <div class="onboarding-container fade-in">
                    <div class="onboarding-logo">✈️</div>
                    <h1 class="onboarding-title">Mis Viajes</h1>
                    <p class="onboarding-subtitle" style="margin-bottom: 20px;">Organiza tus grupales fácilmente.</p>
                    
                    ${App.state.trips.length > 0 ? `
                        <div style="width: 100%; text-align: left; margin-bottom: 24px;">
                            ${App.state.trips.map(t => `
                                <div class="card" style="margin-bottom: 15px; cursor: pointer; padding: 18px;" onclick="App.selectTrip('${t.id}')">
                                    <h3 style="color: var(--brand);">${t.name}</h3>
                                    <p style="font-size: 0.8rem; color: var(--text-muted);">${t.dates}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 30px;">Aún no tienes viajes creados.</p>
                    `}

                    <button class="primary" style="width: 100%; max-width: 300px;" onclick="App.showNewTripModal()">+ Crear Nuevo Viaje</button>
                </div>
            `;
        },

        dashboard() {
            const fin = App.calculateFinancials();
            const pendingProposals = (App.state.trip.proposals || []).filter(p => p.status !== 'confirmed' && p.status !== 'rejected').length;
            const currencySym = App.state.trip.currency || 'USD';

            // Timeline data — aggregate confirmed events and proposals
            const allItems = [];
            (App.state.trip.events || []).forEach(e => allItems.push({ ...e, isProposal: false }));
            (App.state.trip.proposals || []).forEach(p => {
                if (p.status === 'confirmed') {
                    const exists = allItems.find(i => i.id === (p.eventId || p.id));
                    if (!exists) allItems.push({ ...p, isProposal: true });
                }
            });
            const validItems = allItems.filter(i => i.date).sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return (a.time || "00:00").localeCompare(b.time || "00:00");
            });
            const grouped = {};
            validItems.forEach(item => {
                if (!grouped[item.date]) grouped[item.date] = [];
                grouped[item.date].push(item);
            });
            const todayDate = new Date().toISOString().split('T')[0];
            const timelineHtml = Object.keys(grouped).map(date => {
                let html = `<div style="margin: 20px 0 10px 0;"><span class="badge" style="background: rgba(244,106,31,0.1); color: var(--primary); font-weight:800; font-size:0.8rem;">📅 ${date}</span></div>`;
                grouped[date].forEach(item => {
                    const isPast = item.date < todayDate;
                    const opacity = isPast ? '0.5' : '1';
                    html += `
                        <div class="timeline-event" style="position: relative; margin-bottom: 24px; opacity: ${opacity};">
                            <div style="position: absolute; left: -26px; top: 12px; width: 18px; height: 18px; border-radius: 50%; background: ${isPast ? '#94a3b8' : 'var(--primary)'}; border: 4px solid var(--background); box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 2;"></div>
                            <div class="card" style="margin-bottom: 0; padding:16px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="badge" style="background: ${isPast ? '#f1f5f9' : '#dcfce7'}; color: ${isPast ? '#475569' : '#166534'}; font-size: 0.6rem;">${isPast ? 'COMPLETADO' : 'CONFIRMADO'}</span>
                                    <span style="font-size: 0.75rem; font-weight: 800; color: var(--brand);">${item.time || 'Todo el día'}</span>
                                </div>
                                <h4 style="font-size: 1.05rem; ${isPast ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${item.title}</h4>
                                ${item.cost ? `<p style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-top: 4px;">Costo Est: $${item.cost}</p>` : ''}
                            </div>
                        </div>
                    `;
                });
                return html;
            }).join('');

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <button onclick="App.closeTrip()" style="background: none; border: none; font-size: 0.9rem; color: var(--text-muted); cursor: pointer;">← Mis Viajes</button>
                    <button onclick="App.showEditTripModal()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;" title="Configurar Viaje">⚙️</button>
                </div>

                <div class="card" style="background: var(--brand); color: white;">
                    <div style="display:flex; justify-content: space-between;">
                        <div>
                            <h3 style="margin-bottom: 4px;">¡Hola, Viajero! 👋</h3>
                            <p style="font-size: 0.8rem; opacity: 0.8;">Tu viaje está en fase de ${App.state.trip.startDate ? 'Planificación Activa' : 'Ideación'}.</p>
                        </div>
                        <div style="text-align:right;">
                            ${pendingProposals > 0 ? `<span class="badge" style="background:rgba(255,255,255,0.2); color:white;">⚠️ ${pendingProposals} ideas por votar</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                    <div class="card" style="flex: 1; margin-bottom: 0; padding: 16px; text-align: center; cursor:pointer;" onclick="App.navigate('decided')">
                        <span style="display: block; font-size: 1.5rem; margin-bottom: 8px;">🏨</span>
                        <span style="font-size: 0.7rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Alojamientos</span>
                        <p style="font-size: 1.2rem; font-weight: 800; margin-top: 4px; color: var(--brand);">${(App.state.trip.accommodations || []).length}</p>
                    </div>
                    <div class="card" style="flex: 1; margin-bottom: 0; padding: 16px; text-align: center; cursor:pointer;" onclick="App.navigate('decided')">
                        <span style="display: block; font-size: 1.5rem; margin-bottom: 8px;">🚗</span>
                        <span style="font-size: 0.7rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Vehículos</span>
                        <p style="font-size: 1.2rem; font-weight: 800; margin-top: 4px; color: var(--brand);">${(App.state.trip.transports || []).length}</p>
                    </div>
                    <div class="card" style="flex: 1; margin-bottom: 0; padding: 16px; text-align: center; cursor:pointer;" onclick="App.navigate('proposals')">
                        <span style="display: block; font-size: 1.5rem; margin-bottom: 8px;">💡</span>
                        <span style="font-size: 0.7rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Pendientes</span>
                        <p style="font-size: 1.2rem; font-weight: 800; margin-top: 4px; color: ${pendingProposals > 0 ? 'var(--secondary)' : 'var(--brand)'};">${pendingProposals}</p>
                    </div>
                </div>

                <!-- Budget -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
                        <span style="font-weight: 800; font-size: 1rem; color: var(--brand);">Presupuesto</span>
                        <span class="badge" style="background: rgba(255,107,107,0.15); color: var(--primary);">
                            $${fin.totalGastado} ${currencySym} / pers.
                        </span>
                    </div>
                    ${fin.budgetLimit > 0 ? `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${fin.percentage}%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Gastado: $${fin.totalGastado} ${currencySym}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Límite: $${fin.budgetLimit} ${currencySym}</span>
                    </div>
                    ` : `<p style="font-size:0.75rem; color: var(--text-muted);">No has establecido un límite de presupuesto.</p>`}
                </div>

                <!-- Inline Timeline / Calendar Toggle -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 8px;">
                    <h2 style="font-size: 1.2rem; margin: 0;">📅 ${App.state.homeView === 'calendar' ? 'Calendario' : 'Timeline'}</h2>
                    <div style="background: var(--background); border-radius: 14px; padding: 4px; display: flex; gap: 4px; box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8);">
                        <button onclick="App.state.homeView='timeline'; App.render()" style="background:${App.state.homeView === 'timeline' ? 'var(--primary)' : 'transparent'}; color:${App.state.homeView === 'timeline' ? 'white' : 'var(--text-muted)'}; border-radius:10px; border:none; padding:6px 12px; font-size:0.8rem; font-weight:bold; cursor:pointer;">Timeline</button>
                        <button onclick="App.state.homeView='calendar'; App.render()" style="background:${App.state.homeView === 'calendar' ? 'var(--primary)' : 'transparent'}; color:${App.state.homeView === 'calendar' ? 'white' : 'var(--text-muted)'}; border-radius:10px; border:none; padding:6px 12px; font-size:0.8rem; font-weight:bold; cursor:pointer;">Calendario</button>
                    </div>
                </div>
                
                ${App.state.homeView === 'calendar' ? App.buildCalendarHtml() : (timelineHtml ? `
                    <div class="timeline-visual" style="position: relative; padding-left: 32px;">
                        <div style="position: absolute; left: 14px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--primary), var(--secondary), var(--warning)); z-index: 1;"></div>
                        ${timelineHtml}
                    </div>
                ` : `
                    <div class="card" style="text-align: center; padding: 30px 20px;">
                        <p style="font-size: 1.5rem; margin-bottom: 10px;">🗓️</p>
                        <h4 style="margin-bottom: 8px;">Sin actividades confirmadas</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">El timeline se construye con las ideas que aprueben entre todos.</p>
                        ${!App.state.trip.startDate ? `<button onclick="App.showEditTripModal()" class="primary" style="padding: 10px 20px; border-radius: 12px;">Configurar Fechas del Viaje</button>` : `<button onclick="App.navigate('proposals')" class="primary" style="padding: 10px 20px; border-radius: 12px;">Ir a Propuestas</button>`}
                    </div>
                `)}
            `;
        },


        proposals() {
            const filter = App.state.proposalFilter || 'all';
            let filteredProposals = (App.state.trip.proposals || []).sort((a, b) => b.votes - a.votes);

            if (filter !== 'all') {
                filteredProposals = filteredProposals.filter(p => p.type === filter);
            }

            return `
                <div style="margin-bottom: 16px;">
                    <h2 style="font-size: 1.5rem;">Pool de Ideas</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted)">Vota y confirma propuestas logísticas</p>
                </div>

                <div style="margin-bottom: 24px; display:flex; gap: 8px; overflow-x: auto; padding-bottom: 8px;">
                     <button onclick="App.state.proposalFilter='all'; App.render()" class="pill-btn ${filter === 'all' ? 'active' : ''}" style="white-space:nowrap; padding: 6px 12px; border-radius: 12px; border:none; ${filter === 'all' ? 'background:var(--brand); color:white;' : 'background:var(--background); color:var(--text-muted);'}">Todas</button>
                     <button onclick="App.state.proposalFilter='accommodation'; App.render()" class="pill-btn ${filter === 'accommodation' ? 'active' : ''}" style="white-space:nowrap; padding: 6px 12px; border-radius: 12px; border:none; ${filter === 'accommodation' ? 'background:var(--brand); color:white;' : 'background:var(--background); color:var(--text-muted);'}">Alojamientos</button>
                     <button onclick="App.state.proposalFilter='activity'; App.render()" class="pill-btn ${filter === 'activity' ? 'active' : ''}" style="white-space:nowrap; padding: 6px 12px; border-radius: 12px; border:none; ${filter === 'activity' ? 'background:var(--brand); color:white;' : 'background:var(--background); color:var(--text-muted);'}">Actividades</button>
                     <button onclick="App.state.proposalFilter='transport'; App.render()" class="pill-btn ${filter === 'transport' ? 'active' : ''}" style="white-space:nowrap; padding: 6px 12px; border-radius: 12px; border:none; ${filter === 'transport' ? 'background:var(--brand); color:white;' : 'background:var(--background); color:var(--text-muted);'}">Transporte</button>
                </div>

    ${filteredProposals.map(p => `
                    <div class="card" style="padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="flex: 1; padding-right: 15px;">
                                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                    <span class="badge" style="background: #e2e8f0; color: #475569;">${p.type.toUpperCase()}</span>
                                    ${p.status === 'confirmed' ? '<span class="badge" style="background: #dcfce7; color: #166534;">CONFIRMADO ✅</span>' : ''}
                                </div>
                                <h4 style="font-size: 1.1rem; margin-bottom: 4px; color: ${p.status === 'confirmed' ? 'var(--text-muted)' : 'var(--text-main)'}; ${p.status === 'confirmed' ? 'text-decoration: line-through;' : ''}">${p.title}</h4>
                                <div style="display: flex; flex-direction:column; gap: 4px; margin-top: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 800; color: var(--secondary);">$${p.cost}</span>
                                    ${p.date ? `<span style="font-size: 0.75rem; color: var(--text-muted);">🗓️ ${p.date} a las ${p.time}</span>` : ''}
                                </div>
                                
                                ${p.status !== 'confirmed' && p.votes > 0 ? `
                                    <button onclick="App.confirmProposal(${p.id})" style="margin-top: 12px; background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">Aprobar al Timeline</button>
                                ` : ''}

                            </div>
                            ${p.status !== 'confirmed' ? `
                            <button class="vote-btn" onclick="App.vote(${p.id})" style="background: var(--background); border:none; box-shadow: var(--shadow-neumorph); width:40px; height:40px; border-radius:12px; font-size:1.2rem; cursor:pointer;">
                                <span class="count" style="display:block; font-size:0.8rem; font-weight:bold; color:var(--brand);">${p.votes}👍</span>
                            </button>
                            ` : `
                            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-width: 50px;">
                                <span style="font-size:1.2rem;">✅</span>
                                <span style="font-size:0.7rem; color:var(--text-muted);">${p.votes} votos</span>
                            </div>
                            `}
                        </div>
                    </div>
                `).join('')
                }

<div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.8rem;">
    Las ideas aprobadas se mueven automáticamente al Timeline
</div>

<!-- FAB: Proponer Idea -->
<div style="position: fixed; bottom: 90px; right: 20px; z-index: 50;">
    <button onclick="App.showProposeModal()" style="width: 56px; height: 56px; border-radius: 28px; background: var(--primary); color: white; border: none; box-shadow: 0 4px 15px rgba(255,107,107,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer;">+</button>
</div>
`;
        },

        decided() {
            return `
                <div style="margin-bottom: 24px;">
                    <h2 style="font-size: 1.5rem;">Logística</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted)">Servicios y recursos confirmados</p>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 1.8rem;">🏠</div>
                            <div>
                                <h4 style="color: var(--brand);">Alojamientos</h4>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">${(App.state.trip.accommodations || []).length} confirmados</p>
                            </div>
                        </div>
                        <button onclick="App.showAddServiceModal('accommodation')" style="background:var(--background); color:var(--primary); border:none; box-shadow:var(--shadow-neumorph); width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer;">+</button>
                    </div>
                    
                    ${(App.state.trip.accommodations || []).map(acc => `
                        <div style="background: var(--background); border-radius: 16px; padding: 16px; border: 1px dashed var(--border); margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex: 1;">
                                    <strong style="font-size: 0.9rem;">${acc.name}</strong>
                                    <p style="font-size: 0.75rem; color: var(--text-muted);">${acc.dates}</p>
                                </div>
                                <div style="text-align: right;">
                                    <span style="display: block; font-weight: bold; color: var(--brand);">$${acc.totalPrice}</span>
                                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.6rem; margin-top:4px;">CONFIRMADO</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${!(App.state.trip.accommodations || []).length ? '<p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">No hay alojamientos todavía.</p>' : ''}
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 1.8rem;">🚗</div>
                            <div>
                                <h4 style="color: var(--brand);">Transportes</h4>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">${(App.state.trip.transports || []).length} confirmados</p>
                            </div>
                        </div>
                        <button onclick="App.showAddServiceModal('transport')" style="background:var(--background); color:var(--primary); border:none; box-shadow:var(--shadow-neumorph); width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer;">+</button>
                    </div>
                    
                    ${(App.state.trip.transports || []).map(tra => {
                const passengersCount = (tra.passengers || []).length;
                const hasJoined = (tra.passengers || []).includes('Me');
                const tripTypeLabel = tra.tripType === 'vuelta' ? '↩️ Vuelta' : (tra.tripType === 'interno' ? '🔄 Interno' : '➡️ Ida');

                return `
                        <div style="background: var(--background); border-radius: 16px; padding: 16px; border: 1px dashed var(--border); margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex: 1;">
                                    <strong style="display: block; font-size: 0.9rem;">${tra.name}</strong>
                                    <div style="display:flex; gap:6px; margin: 6px 0;">
                                        <span class="badge" style="background:#eef2ff; color:#4338ca; font-size:0.65rem;">${tripTypeLabel}</span>
                                    </div>
                                    ${tra.details ? `<p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${tra.details}</p>` : ''}
                                    <div style="display:flex; align-items:center; gap: 8px;">
                                        <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.7rem;">👥 ${passengersCount} Pasajeros</span>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <span style="display:block; font-weight: bold; color: var(--brand); margin-bottom: 8px;">$${tra.price}</span>
                                    ${!hasJoined ?
                        `<button onclick="App.joinTransport(${tra.id})" style="background:var(--primary); color:white; border:none; border-radius:8px; padding:4px 8px; font-size:0.7rem; cursor:pointer;">🙋‍♂️ Sumarme</button>`
                        : `<div><span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.65rem; margin-bottom:4px; display:block;">INSCRITO</span><button onclick="App.leaveTransport(${tra.id})" style="background:transparent; color:#ef4444; border:1px solid #ef4444; border-radius:8px; padding:3px 6px; font-size:0.65rem; cursor:pointer; margin-top:4px;">Salir</button></div>`
                    }
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                    ${!(App.state.trip.transports || []).length ? '<p style="font-size:0.8rem; color:var(--text-muted); text-align:center;">No hay transportes todavía.</p>' : ''}
                </div>

                <div style="padding: 20px; text-align: center;">
                    <button onclick="App.deleteTrip()" style="background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; padding: 10px 20px; border-radius: 12px; font-size: 0.8rem;">🗑️ Eliminar Viaje Actual</button>
                    ${App.state.trips.length > 1 ? `<br><br><button onclick="App.resetTrip()" style="background: transparent; color: var(--text-muted); border: 1px dashed var(--text-muted); padding: 8px 16px; border-radius: 12px; font-size: 0.75rem;">Borrar todos los viajes (Testing)</button>` : ''}
                </div>
`;
        }
    },

    joinTransport(id) {
        const tra = this.state.trip.transports.find(t => t.id === id);
        if (tra) {
            if (!tra.passengers) tra.passengers = [];
            tra.passengers.push('Me');

            const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
            if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

            localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
            localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

            this.showToast("🚙 Te sumaste al transporte");
            this.render();
        }
    },

    leaveTransport(id) {
        const tra = this.state.trip.transports.find(t => t.id === id);
        if (tra) {
            tra.passengers = (tra.passengers || []).filter(p => p !== 'Me');

            const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
            if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

            localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
            localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

            this.showToast("👋 Te bajaste del transporte");
            this.render();
        }
    },


    showAddServiceModal(type) {
        const modal = document.getElementById('modal-container');
        const content = modal.querySelector('.modal-content');

        const title = type === 'accommodation' ? 'Añadir Alojamiento Directo (👑 Admin)' : 'Añadir Transporte';
        const namePlaceholder = type === 'accommodation' ? 'Ej: Hotel Central' : 'Ej: Auto Pedro / Vuelo LATAM';

        // Use dates input for accommodations
        const detailsInput = type === 'accommodation' ? `
             <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                 <div style="flex:1;">
                     <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Ingreso</label>
                     <input type="date" id="s-details-start" style="width: 100%;" ${App.state.trip.startDate ? `min="${App.state.trip.startDate}" value="${App.state.trip.startDate}"` : ''} required>
                 </div>
                 <div style="flex:1;">
                     <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Salida</label>
                     <input type="date" id="s-details-end" style="width: 100%;" ${App.state.trip.endDate ? `max="${App.state.trip.endDate}"` : ''} required>
                 </div>
             </div>
        ` : `
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Tipo de Transporte</label>
                <select id="s-trip-type" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--background);">
                    <option value="ida">➡️ Ida</option>
                    <option value="vuelta">↩️ Vuelta</option>
                    <option value="interno">🔄 Interno</option>
                </select>
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Detalles Extras <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                <input type="text" id="s-details" placeholder="Ej: Salida 14hs, 4 lugares">
            </div>
        `;

        content.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: var(--brand); font-family: 'Nunito', sans-serif; font-size: 1.3rem;">${title}</h2>
                <form id="add-service-form">
                    <input type="hidden" id="s-type" value="${type}">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Nombre/Lugar</label>
                        <input type="text" id="s-name" placeholder="${namePlaceholder}" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Costo Total (USD)</label>
                        <input type="number" id="s-price" placeholder="Ej: 300" required>
                    </div>
                    ${detailsInput}
                    <div style="display: flex; gap: 10px;">
                        <button type="button" onclick="App.closeModal()" style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: #e2e8f0; font-weight: bold;">Cancelar</button>
                        <button type="submit" class="primary" style="flex: 2; border-radius: 12px; padding: 14px;">Guardar</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('add-service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });
    },

    saveService() {
        const type = document.getElementById('s-type').value;
        const name = document.getElementById('s-name').value;
        const price = parseInt(document.getElementById('s-price').value) || 0;

        let details = '';
        if (type === 'accommodation') {
            const start = document.getElementById('s-details-start').value;
            const end = document.getElementById('s-details-end').value;
            details = `${start} al ${end}`;
        } else {
            details = document.getElementById('s-details') ? document.getElementById('s-details').value : '';
        }

        if (type === 'accommodation') {
            if (!this.state.trip.accommodations) this.state.trip.accommodations = [];
            this.state.trip.accommodations.push({ id: Date.now(), name, totalPrice: price, dates: details });
        } else {
            if (!this.state.trip.transports) this.state.trip.transports = [];
            const tripType = document.getElementById('s-trip-type') ? document.getElementById('s-trip-type').value : 'ida';
            this.state.trip.transports.push({ id: Date.now(), name, price, details, tripType, passengers: [] });
        }

        // Save current trip to array
        const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
        if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

        localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
        localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

        this.closeModal();
        this.showToast("✅ Añadido exitosamente");
        this.render();
    },

    showNewTripModal() {
        const modal = document.getElementById('modal-container');
        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: var(--brand); font-family: 'Nunito', sans-serif;">Nuevo Viaje</h2>
                <form id="create-trip-form">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Nombre del Viaje</label>
                    <input type="text" id="t-name" placeholder="Ej: Break Bariloche" required>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Fecha Inicio <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="date" id="t-start-date" style="width: 100%;">
                    </div>
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Fecha Fin <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="date" id="t-end-date" style="width: 100%;">
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Moneda del Viaje</label>
                    <select id="t-currency" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--background);">
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="ARS">Pesos (ARS)</option>
                        <option value="BRL">Reales (BRL)</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Presupuesto Diario <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="number" id="t-daily" placeholder="Ej: 50" style="width: 100%;">
                    </div>
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Límite Personal <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="number" id="t-limit" placeholder="Ej: 1500" style="width: 100%;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="button" onclick="App.closeModal()" style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: #e2e8f0; font-weight: bold;">Cancelar</button>
                    <button type="submit" class="primary" style="flex: 2; border-radius: 12px; padding: 14px;">Empezar Viaje</button>
                </div>
            </form>
        </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('create-trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTrip();
        });
    },

    showEditTripModal() {
        if (!this.state.trip) return;
        const t = this.state.trip;

        const modal = document.getElementById('modal-container');
        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin-bottom: 20px; color: var(--brand); font-family: 'Nunito', sans-serif;">Editar Viaje</h2>
                <form id="edit-trip-form">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Nombre del Viaje</label>
                    <input type="text" id="t-name" value="${t.name || ''}" placeholder="Ej: Break Bariloche" required>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Fecha Inicio <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="date" id="t-start-date" value="${t.startDate || ''}" style="width: 100%;">
                    </div>
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Fecha Fin <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="date" id="t-end-date" value="${t.endDate || ''}" style="width: 100%;">
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Moneda del Viaje</label>
                    <select id="t-currency" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--background);">
                        <option value="USD" ${t.currency === 'USD' ? 'selected' : ''}>Dólar (USD)</option>
                        <option value="EUR" ${t.currency === 'EUR' ? 'selected' : ''}>Euro (EUR)</option>
                        <option value="ARS" ${t.currency === 'ARS' ? 'selected' : ''}>Pesos (ARS)</option>
                        <option value="BRL" ${t.currency === 'BRL' ? 'selected' : ''}>Reales (BRL)</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Presupuesto Diario <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="number" id="t-daily" value="${t.dailyBudget || ''}" placeholder="Ej: 50" style="width: 100%;">
                    </div>
                    <div style="flex:1;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Límite Personal <span style="font-weight:normal;color:#999">(Opcional)</span></label>
                        <input type="number" id="t-limit" value="${t.budgetLimit || ''}" placeholder="Ej: 1500" style="width: 100%;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="button" onclick="App.closeModal()" style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: #e2e8f0; font-weight: bold;">Cancelar</button>
                    <button type="submit" class="primary" style="flex: 2; border-radius: 12px; padding: 14px;">Guardar Cambios</button>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button type="button" onclick="App.deleteTrip()" style="background: none; border: none; color: #ff6b6b; font-size: 0.8rem; text-decoration: underline; cursor: pointer;">Eliminar este viaje</button>
                </div>
            </form>
        </div>
        `;

        modal.classList.remove('hidden');

        document.getElementById('edit-trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditTrip();
        });
    },

    showProposeModal() {
        const modal = document.getElementById('modal-container');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            < div style = "padding: 20px;" >
                <h2 style="margin-bottom: 20px;">Proponer nueva idea</h2>
                <form id="propose-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Título</label>
                        <input type="text" id="p-title" placeholder="Ej: Cena en el refugio" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border);" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Costo Estimado</label>
                        <input type="number" id="p-cost" placeholder="0.00" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border);" required>
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom: 20px;">
                        <div style="flex:1;">
                            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Fecha Sugerida</label>
                            <input type="date" id="p-date" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border);" ${App.state.trip.startDate ? `min="${App.state.trip.startDate}" value="${App.state.trip.startDate}"` : ''} required>
                        </div>
                        <div style="flex:1;">
                            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Hora</label>
                            <input type="time" id="p-time" value="12:00" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border);" required>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">Categoría</label>
                        <select id="p-type" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border);">
                            <option value="activity">Actividad</option>
                            <option value="accommodation">Alojamiento</option>
                            <option value="food">Comida</option>
                            <option value="transport">Transporte / Movilidad</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="button" onclick="App.closeModal()" style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid var(--border); background: white;">Cancelar</button>
                        <button type="submit" style="flex: 2; padding: 14px; border-radius: 12px; border: none; background: var(--primary); color: white; font-weight: bold;">Publicar Idea</button>
                    </div>
                </form>
            </div >
    `;

        modal.classList.remove('hidden');

        document.getElementById('propose-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProposal();
        });
    },

    saveProposal() {
        const title = document.getElementById('p-title').value;
        const cost = document.getElementById('p-cost').value;
        const date = document.getElementById('p-date').value;
        const time = document.getElementById('p-time').value;
        const type = document.getElementById('p-type').value;

        // Make sure the trip has its own proposals array
        if (!this.state.trip.proposals) this.state.trip.proposals = [];

        this.state.trip.proposals.push({
            id: Date.now(),
            title,
            cost: parseInt(cost),
            type,
            date,
            time,
            votes: 1, // Creator vote automatically
            votedBy: ['Me'],
            status: 'voting' // voting, confirmed, rejected
        });

        const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
        if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

        localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
        localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

        this.closeModal();
        this.showToast("💡 ¡Propuesta enviada!");
        this.render();
    },

    vote(id) {
        if (!this.state.trip.proposals) return;
        const prop = this.state.trip.proposals.find(p => p.id === id);
        if (prop && prop.status === 'voting') {
            if (!prop.votedBy) prop.votedBy = [];

            if (!prop.votedBy.includes('Me')) {
                prop.votes++;
                prop.votedBy.push('Me');

                const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
                if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

                localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
                localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

                this.render();

                // Auto-confirm logic mock (if > half participants)
                if (prop.votes > (this.state.trip.participants / 2)) {
                    // Alert that it could be confirmed but we leave it manual for now
                }
            } else {
                this.showToast("⚠️ Ya votaste esta propuesta");
            }
        }
    },

    confirmProposal(id) {
        if (!this.state.trip.proposals) return;
        const prop = this.state.trip.proposals.find(p => p.id === id);
        if (prop) {
            prop.status = 'confirmed';

            // If it's an accommodation, auto-add to decided
            if (prop.type === 'accommodation') {
                if (!this.state.trip.accommodations) this.state.trip.accommodations = [];
                this.state.trip.accommodations.push({
                    id: Date.now(),
                    name: prop.title,
                    totalPrice: prop.cost,
                    dates: prop.date ? `A partir del ${prop.date}` : 'Sin fecha definida'
                });
            } else if (prop.type === 'transport') {
                if (!this.state.trip.transports) this.state.trip.transports = [];
                this.state.trip.transports.push({
                    id: Date.now(),
                    name: prop.title,
                    price: prop.cost,
                    details: prop.date ? `${prop.date} ${prop.time}` : 'Sin fecha definida',
                    passengers: []
                });
            } else {
                // Add as official Event
                if (!this.state.trip.events) this.state.trip.events = [];
                prop.eventId = Date.now() + 1;
                this.state.trip.events.push({
                    ...prop,
                    id: prop.eventId
                });
            }

            // Save state
            const tripIndex = this.state.trips.findIndex(t => t.id === this.state.trip.id);
            if (tripIndex > -1) this.state.trips[tripIndex] = this.state.trip;

            localStorage.setItem('tripio_current', JSON.stringify(this.state.trip));
            localStorage.setItem('tripio_all_trips', JSON.stringify(this.state.trips));

            this.showToast("✅ Idea confirmada y añadida al plan");
            this.render();
        }
    },

    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
    }
};

// Start the app
App.init();
