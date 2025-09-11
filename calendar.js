// Calendar.js - Funcionalidade do Calendário MeCalendar

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.currentView = 'month';
        this.selectedEvent = null;
        this.currentUserId = (window && window.CURRENT_USER_ID) ? String(window.CURRENT_USER_ID) : 'guest';
        this.storageKey = `calendarEvents_${this.currentUserId}`;
        
        this.clients = []; // Adicionar array para armazenar clientes
        
        this.init();
    }

    async init() {
        await this.loadEvents();
        await this.loadClientsForAutocomplete(); // Carregar clientes na inicialização
        this.setupEventListeners();
        this.renderCalendar();
    }

    setupEventListeners() {
        // Navegação do calendário
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.previousMonth();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.nextMonth();
        });

        // Botões de visualização
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeView(e.target.dataset.view);
            });
        });

        // Botão de Exportar
        const exportBtn = document.getElementById('exportCalendarBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportEventsToCsv();
            });
        }

        // Modal de novo evento
        const newEventBtn = document.querySelector('#newEventBtn');
        if (newEventBtn) {
            newEventBtn.addEventListener('click', () => {
                this.openNewEventModal();
            });
        }

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeNewEventModal();
        });

        document.getElementById('cancelEvent').addEventListener('click', () => {
            this.closeNewEventModal();
        });

        // O clique em salvar é configurado ao abrir o modal (novo/editar)

        // Fechar painel de eventos
        document.getElementById('closePanel').addEventListener('click', () => {
            this.closeEventPanel();
        });

        // Fechar modal ao clicar fora
        document.getElementById('newEventModal').addEventListener('click', (e) => {
            if (e.target.id === 'newEventModal') {
                this.closeNewEventModal();
            }
        });

        // Impedir submissão padrão do formulário (Enter) para evitar criação indevida
        const form = document.getElementById('newEventForm');
        if (form) {
            form.addEventListener('submit', (e) => e.preventDefault());
        }

        // Botão de deletar evento (delegação com closest para cobrir o ícone interno)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-event');
            if (btn) {
                const eventId = parseInt(btn.dataset.eventId);
                this.deleteEvent(eventId);
            }
        });
        
        // Listener para autocompletar clientes
        const clientNameInput = document.getElementById('clientName');
        if (clientNameInput) {
            clientNameInput.addEventListener('change', (e) => this.handleClientSelection(e.target.value));
        }
        
    }

    async loadEvents() {
        // Buscar do backend
        try {
            const resp = await fetch('agendamentos_api.php', { credentials: 'same-origin' });
            if (!resp.ok) throw new Error('Falha ao carregar agendamentos');
            const data = await resp.json();
            if (data && data.success) {
                // Normaliza estrutura para o frontend
                this.events = (data.data || []).map(row => ({
                    id: Number(row.id),
                    client: row.client,
                    phone: row.phone,
                    email: row.email || '',
                    serviceType: row.service_type,
                    serviceDescription: row.service_description || '',
                    date: row.date,
                    time: row.time,
                    duration: Number(row.duration || 60),
                    value: Number(row.value || 0),
                    status: row.status || 'pending',
                    notes: row.notes || '',
                    ownerUserId: String(row.owner_user_id)
                })).filter(event => event.status !== 'cancelled'); // Filtra eventos cancelados
            } else {
                this.events = [];
            }
        } catch (e) {
            this.events = [];
            console.error(e);
            this.showNotification('Erro ao carregar agendamentos.', 'error');
        }
    }

    async loadClientsForAutocomplete() {
        try {
            const resp = await fetch('api/clients.php', { credentials: 'same-origin' });
            if (!resp.ok) throw new Error('Falha ao carregar clientes');
            const data = await resp.json();
            if (data && data.success) {
                this.clients = data.data.map(client => ({
                    id: client.id,
                    nome: client.nome,
                    telefone: client.telefone,
                    email: client.email
                }));
                this.populateClientSelect(); // Popular o select após carregar os clientes
            } else {
                this.clients = [];
            }
        } catch (e) {
            this.clients = [];
            console.error('Erro ao carregar clientes para autocomplete:', e);
        }
    }

    saveEvents() {
        // Não utilizado com backend, mantido por compatibilidade se necessário
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    changeView(view) {
        this.currentView = view;
        
        // Atualizar botões ativos
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.renderCalendar();
    }

    renderCalendar() {
        this.updateHeader();
        this.renderDays();
    }

    updateHeader() {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const month = monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        
        document.getElementById('currentMonth').textContent = `${month} ${year}`;
    }

    renderDays() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dayNumber = currentDate.getDate();
            const isCurrentMonth = currentDate.getMonth() === this.currentDate.getMonth();
            const isToday = this.isToday(currentDate);
            const dateString = this.formatDate(currentDate);

            if (!isCurrentMonth) {
                dayElement.classList.add('other-month');
            }
            
            const dayNumberHeader = document.createElement('div');
            dayNumberHeader.className = 'day-number-header';

            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.className = 'day-number';
            dayNumberSpan.textContent = dayNumber;
            dayNumberHeader.appendChild(dayNumberSpan);

            if (isToday) {
                dayElement.classList.add('today');
                const todayLabelSpan = document.createElement('span');
                todayLabelSpan.className = 'today-label';
                todayLabelSpan.textContent = 'Hoje';
                dayNumberHeader.appendChild(todayLabelSpan);
            }
            dayElement.appendChild(dayNumberHeader);

            // Adicionar eventos, se houver
            const dayEvents = this.getEventsForDate(dateString);
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'day-events';
                
                dayEvents.slice(0, 2).forEach(event => {
                    const eventElement = this.createEventElement(event);
                    eventsContainer.appendChild(eventElement);
                });

                if (dayEvents.length > 2) {
                    const moreEvents = document.createElement('div');
                    moreEvents.className = 'events-count';
                    moreEvents.textContent = `+${dayEvents.length - 2} mais`;
                    eventsContainer.appendChild(moreEvents);
                }
                
                dayElement.appendChild(eventsContainer);
            }

            dayElement.addEventListener('click', (e) => {
                // Sempre abrir o painel de detalhes do dia ao clicar no dia, mesmo se não houver eventos
                this.renderDayEventsPanel(dateString, dayEvents);
            });

            calendarDays.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${this.normalizeStatusCss(event.status)}`; // Adiciona classe de status aqui
        eventElement.dataset.eventId = event.id;
        eventElement.dataset.date = event.date;
        eventElement.innerHTML = `
            <span class="event-time">${event.time}</span>
            <span class="event-client">${event.client}</span>
        `;
        eventElement.addEventListener('click', (e) => {
            // Previne que o clique no evento propague para o dia, mas permite abrir o painel de detalhes do dia
            e.stopPropagation();
        });
        return eventElement;
    }

    getEventsForDate(dateString) {
        return this.events.filter(event => event.date === dateString);
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Substituir a lógica antiga do selectDate
    selectDate(date) {
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        const dayEvents = this.getEventsForDate(dateString);
        this.renderDayEventsPanel(dateString, dayEvents);
    }

    // showEventPanel será mantida para compatibilidade com editEvent, mas agora ela chama renderDayEventsPanel para o dia do evento
    showEventPanel(event) {
        // Quando um evento individual é clicado, abrimos o painel para aquele dia
        const dateString = event.date;
        const dayEvents = this.getEventsForDate(dateString);
        this.renderDayEventsPanel(dateString, dayEvents);

        // Agora, como queremos destacar o evento clicado no painel, vamos rolar até ele e/ou destacá-lo
        // Isso pode ser feito com um pequeno delay para garantir que o painel esteja renderizado
        setTimeout(() => {
            const eventElementInPanel = document.querySelector(`.event-detail-card [data-event-id="${event.id}"]`);
            if (eventElementInPanel) {
                eventElementInPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                eventElementInPanel.classList.add('highlight'); // Adicionar uma classe para destaque temporário
                setTimeout(() => eventElementInPanel.classList.remove('highlight'), 2000); // Remover destaque após 2s
            }
        }, 100); 
    }

    closeEventPanel() {
        const panel = document.getElementById('eventPanel');
        panel.classList.remove('active');
        this.selectedEvent = null;
    }

    openNewEventModal() {
        const modal = document.getElementById('newEventModal');
        modal.classList.add('show');
        
        // Resetar formulário
        modal.querySelector('#newEventForm').reset();
        
        // Resetar botão para "Salvar"
        const saveButton = document.getElementById('saveEvent');
        saveButton.textContent = 'Salvar Agendamento';
        saveButton.onclick = () => this.saveNewEvent();
        
        // Definir data atual como padrão
        const today = new Date().toISOString().split('T')[0];
        modal.querySelector('#eventDate').value = today;
        
        // Definir horário atual + 1 hora como padrão
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const timeString = now.toTimeString().slice(0, 5);
        modal.querySelector('#eventTime').value = timeString;
        
        // Popular select de clientes
        this.populateClientSelect();
    }

    closeNewEventModal() {
        const modal = document.getElementById('newEventModal');
        modal.classList.remove('show');
        
        // Limpar formulário
        modal.querySelector('#newEventForm').reset();
        
        // Resetar botão
        const saveButton = document.getElementById('saveEvent');
        saveButton.textContent = 'Salvar Agendamento';
        saveButton.onclick = () => this.saveNewEvent();
    }

    populateClientSelect() {
        const clientSelect = document.getElementById('clientName');
        if (!clientSelect) return;

        // Limpar opções existentes, exceto as duas primeiras (placeholder e "Adicionar Novo Cliente")
        while (clientSelect.options.length > 2) {
            clientSelect.remove(2);
        }

        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.nome;
            option.textContent = client.nome;
            clientSelect.appendChild(option);
        });
        clientSelect.value = ''; // Reseta a seleção para o placeholder
    }

    handleClientSelection(selectedClientName) {
        const modal = document.getElementById('newEventModal');
        const clientPhoneInput = modal.querySelector('#clientPhone');
        const clientEmailInput = modal.querySelector('#clientEmail');
        
        if (selectedClientName === 'new_client') {
            // Redirecionar para a tela de clientes
            window.location.href = 'cliente.php';
            // Limpar os campos do agendamento para evitar preenchimento indesejado ao voltar
            modal.querySelector('#newEventForm').reset();
            this.closeNewEventModal();
            return;
        }

        const client = this.clients.find(c => c.nome === selectedClientName);
        if (client) {
            clientPhoneInput.value = this.formatPhoneNumberForDisplay(client.telefone) || '';
            clientEmailInput.value = client.email || '';
        } else {
            // Limpar campos se a opção selecionada não for um cliente válido
            clientPhoneInput.value = '';
            clientEmailInput.value = '';
        }
    }

    async saveNewEvent(forceSave = false) {
        const form = document.getElementById('newEventForm');
        const formData = new FormData(form);
        
        const clientName = formData.get('clientName').trim();
        const clientPhone = formData.get('clientPhone').trim();
        const clientEmail = formData.get('clientEmail').trim();
        const serviceType = formData.get('serviceType').trim();
        const serviceDescription = formData.get('serviceDescription').trim();
        const eventDate = formData.get('eventDate');
        const eventTime = formData.get('eventTime');
        const duration = parseInt(formData.get('eventDuration')) || 60;
        const value = parseFloat(formData.get('eventValue')) || 0.00;
        const status = this.normalizeStatusCss(formData.get('eventStatus'));
        const notes = formData.get('eventNotes').trim();
        
        if (!clientName || !clientPhone || !serviceType || !eventDate || !eventTime) {
            this.showNotification(translations[getCurrentLanguage()]['fill_required_fields'], 'error');
            return;
        }

        if (value < 0) {
            this.showNotification(translations[getCurrentLanguage()]['negative_value_error'], 'error');
            return;
        }

        if (!forceSave) {
            const conflict = this.checkEventConflicts(eventDate, eventTime, duration);
            if (conflict) {
                const confirmSave = confirm(translations[getCurrentLanguage()]['conflict_warning_message']);
                if (!confirmSave) {
                    return;
                }
            }
        }
        
        // Salvar no backend
        try {
            const resp = await fetch('agendamentos_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    action: 'create',
                    client: clientName,
                    phone: clientPhone,
                    email: clientEmail,
                    serviceType: serviceType,
                    serviceDescription: serviceDescription,
                    date: eventDate,
                    time: eventTime,
                    duration: duration,
                    value: value,
                    status: status,
                    notes: notes
                })
            });
            if (!resp.ok) throw new Error('Falha ao criar agendamento');
            const data = await resp.json();
            if (!data.success) throw new Error(data.error || 'Erro ao criar');
        } catch (e) {
            console.error(e);
            this.showNotification('Erro ao criar agendamento.', 'error');
            return;
        }

        await this.loadEvents();
        this.renderCalendar();
        this.closeNewEventModal();
        this.showNotification('Agendamento criado com sucesso!', 'success');
        
        // Limpar formulário
        form.reset();
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        if (event.ownerUserId && event.ownerUserId !== this.currentUserId) {
            this.showNotification('Você não pode editar agendamento de outro profissional.', 'error');
            return;
        }
        
        // Abrir modal para edição sem resetar conteúdo
        const modal = document.getElementById('newEventModal');
        modal.classList.add('show');

        // Popular select de clientes para garantir que esteja atualizado
        this.populateClientSelect();

        // Preencher formulário com dados do evento (escopando pelo modal)
        modal.querySelector('#clientName').value = event.client;
        modal.querySelector('#clientPhone').value = this.formatPhoneNumberForDisplay(event.phone);
        modal.querySelector('#clientEmail').value = event.email || '';
        modal.querySelector('#serviceType').value = event.serviceType;
        modal.querySelector('#serviceDescription').value = event.serviceDescription || '';
        modal.querySelector('#eventDate').value = event.date;
        modal.querySelector('#eventTime').value = event.time;
        modal.querySelector('#eventDuration').value = event.duration || 60;
        modal.querySelector('#eventValue').value = event.value || 0.00;
        modal.querySelector('#eventStatus').value = this.mapStatusToFormValue(event.status);
        modal.querySelector('#eventNotes').value = event.notes || '';
        
        // Mudar botão para "Atualizar"
        const saveButton = document.getElementById('saveEvent');
        saveButton.textContent = 'Atualizar Agendamento';
        saveButton.onclick = () => this.updateEvent(eventId);
    }

    async updateEvent(eventId) {
        const form = document.getElementById('newEventForm');
        const formData = new FormData(form);
        
        const clientName = (formData.get('clientName') || '').trim();
        const clientPhone = (formData.get('clientPhone') || '').trim();
        const serviceType = (formData.get('serviceType') || '').trim();
        const eventDate = formData.get('eventDate');
        const eventTime = formData.get('eventTime');
        
        const duration = parseInt(formData.get('eventDuration')) || 60;
        const value = parseFloat(formData.get('eventValue')) || 0.00;
        
        if (!clientName || !clientPhone || !serviceType || !eventDate || !eventTime) {
            this.showNotification(translations[getCurrentLanguage()]['fill_required_fields'], 'error');
            return;
        }

        if (value < 0) {
            this.showNotification(translations[getCurrentLanguage()]['negative_value_error'], 'error');
            return;
        }

        const updatedEvent = {
            client: clientName,
            phone: clientPhone,
            email: (formData.get('clientEmail') || '').trim(),
            serviceType: serviceType,
            serviceDescription: (formData.get('serviceDescription') || '').trim(),
            date: eventDate,
            time: eventTime,
            duration: duration,
            value: value,
            status: this.normalizeStatusCss(formData.get('eventStatus')),
            notes: formData.get('eventNotes').trim()
        };
        
        // Atualizar no backend
        try {
            const resp = await fetch('agendamentos_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'update', id: eventId, ...updatedEvent })
            });
            if (!resp.ok) throw new Error('Falha ao atualizar agendamento');
            const data = await resp.json();
            if (!data.success) throw new Error(data.error || 'Erro ao atualizar');
        } catch (e) {
            console.error(e);
            this.showNotification('Erro ao atualizar agendamento.', 'error');
            return;
        }

        await this.loadEvents();
        this.renderCalendar();
        this.closeNewEventModal();
        this.showNotification('Agendamento atualizado com sucesso!', 'success');
        
        // Resetar botão
        const saveButton = document.getElementById('saveEvent');
        saveButton.textContent = 'Salvar Agendamento';
        saveButton.onclick = () => this.saveNewEvent();
        
        // Limpar formulário
        form.reset();
    }

    async deleteEvent(eventId) {
        if (!confirm('Tem certeza que deseja deletar este agendamento?')) {
            return;
        }
        
        try {
            const resp = await fetch('agendamentos_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'delete', id: eventId })
            });
            if (!resp.ok) throw new Error('Falha ao deletar agendamento');
            const data = await resp.json();
            if (!data.success) throw new Error(data.error || 'Erro ao deletar');
        } catch (e) {
            console.error(e);
            this.showNotification('Erro ao deletar agendamento.', 'error');
            return;
        }

        await this.loadEvents();
        this.renderCalendar();
        this.closeEventPanel();
        this.showNotification('Agendamento deletado com sucesso!', 'success');
    }

    callClient(phone) {
        window.open(`tel:${phone}`, '_self');
    }

    createUtcDate(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hour, minute] = timeString.split(':').map(Number);
        return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    }

    formatDateForDisplay(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    getStatusText(status) {
        const statusMap = {
            'confirmed': 'Confirmado',
            'pending': 'Pendente',
            'cancelled': 'Cancelado',
            'confirmado': 'Confirmado',
            'pendente': 'Pendente',
            'cancelado': 'Cancelado',
            'agendado': 'Pendente'
        };
        return statusMap[status] || 'Pendente';
    }

    normalizeStatusCss(status) {
        const map = {
            'confirmed': 'confirmed',
            'pending': 'pending',
            'cancelled': 'cancelled',
            'confirmado': 'confirmed',
            'pendente': 'pending',
            'agendado': 'pending',
            'cancelado': 'cancelled'
        };
        return map[status] || 'pending';
    }

    mapStatusToFormValue(status) {
        const map = {
            'confirmed': 'confirmado',
            'pending': 'pendente',
            'cancelled': 'pendente'
        };
        return map[status] || 'pendente';
    }

    showNotification(message, type = 'info') {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Nova função para renderizar o painel de eventos do dia
    renderDayEventsPanel(dateString, dayEvents) {
        const panel = document.getElementById('eventPanel');
        const panelHeader = panel.querySelector('.panel-header');
        const panelContent = panel.querySelector('.panel-content');

        panelHeader.innerHTML = `
            <h3>Agendamentos em ${this.formatDateForDisplay(dateString)}</h3>
            <button class="close-btn" id="closePanel">
                <i class="fas fa-times"></i>
            </button>
        `;
        panelContent.innerHTML = '';

        if (dayEvents.length === 0) {
            panelContent.innerHTML = '<p class="no-events-message">Nenhum agendamento para este dia.</p>';
        } else {
            dayEvents.forEach(event => {
                const eventDetailElement = document.createElement('div');
                eventDetailElement.className = 'event-detail-card';
                eventDetailElement.innerHTML = `
                    <div class="event-detail-header">
                        <h4>${event.client} - ${event.serviceType}</h4>
                        <span class="status-badge ${this.normalizeStatusCss(event.status)}">${this.getStatusText(event.status)}</span>
                    </div>
                    <div class="event-detail-body">
                        <p><strong>Horário:</strong> ${event.time} (Duração: ${event.duration} min)</p>
                        <p><strong>Telefone:</strong> ${this.formatPhoneNumberForDisplay(event.phone)}</p>
                        <p><strong>Email:</strong> ${event.email || 'Não informado'}</p>
                        <p><strong>Descrição:</strong> ${event.serviceDescription || 'Não informado'}</p>
                        <p><strong>Valor:</strong> R$ ${Number(event.value || 0).toFixed(2)}</p>
                        <p><strong>Notas:</strong> ${event.notes || 'Nenhuma observação'}</p>
                    </div>
                    <div class="event-detail-actions">
                        
                    </div>
                `;
                panelContent.appendChild(eventDetailElement);
            });
        }

        // Reatribuir listener para o botão de fechar, pois o innerHTML foi atualizado
        panelHeader.querySelector('#closePanel').addEventListener('click', () => {
            this.closeEventPanel();
        });
        
        panel.classList.add('active');
    }

    checkEventConflicts(newEventDate, newEventTime, newEventDuration) {
        const newStartTime = this.createUtcDate(newEventDate, newEventTime);
        const newEndTime = new Date(newStartTime.getTime() + newEventDuration * 60 * 1000); // duração em minutos

        const thirtyMinutes = 30 * 60 * 1000; // 30 minutos em milissegundos

        for (const existingEvent of this.events) {
            // Ignorar eventos cancelados para a verificação de conflito
            if (existingEvent.status === 'cancelled') continue;

            const existingStartTime = this.createUtcDate(existingEvent.date, existingEvent.time);
            const existingEndTime = new Date(existingStartTime.getTime() + existingEvent.duration * 60 * 1000);

            // Verifica sobreposição direta
            const directOverlap = (newStartTime.getTime() < existingEndTime.getTime() && newEndTime.getTime() > existingStartTime.getTime());

            // Verifica se o novo evento termina dentro de 30 minutos do início de um evento existente
            const endsTooCloseToExistingStart = (newEndTime.getTime() > (existingStartTime.getTime() - thirtyMinutes) && newEndTime.getTime() <= existingStartTime.getTime());

            // Verifica se o novo evento começa dentro de 30 minutos do fim de um evento existente
            const startsTooCloseToExistingEnd = (newStartTime.getTime() >= existingEndTime.getTime() && newStartTime.getTime() < (existingEndTime.getTime() + thirtyMinutes));

            if (directOverlap || endsTooCloseToExistingStart || startsTooCloseToExistingEnd) {
                return true; // Conflito encontrado
            }
        }
        return false; // Nenhum conflito
    }

    formatPhoneNumberForDisplay(phoneNumber) {
        if (!phoneNumber) return 'Não informado';
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }

    // Função para exportar eventos como CSV
    exportEventsToCsv() {
        if (this.events.length === 0) {
            this.showNotification('Nenhum agendamento para exportar.', 'info');
            return;
        }

        const headers = [
            'ID', 'Cliente', 'Telefone', 'Email', 'Tipo de Serviço', 
            'Descrição do Serviço', 'Data', 'Horário', 'Duração (min)', 
            'Valor', 'Status', 'Observações'
        ];
        
        const rows = this.events.map(event => [
            event.id,
            `"${event.client.replace(/"/g, '')}"`, // Escapar aspas duplas
            `"${event.phone.replace(/"/g, '')}"`, 
            `"${event.email.replace(/"/g, '')}"`, 
            `"${event.serviceType.replace(/"/g, '')}"`, 
            `"${event.serviceDescription.replace(/"/g, '')}"`, 
            event.date,
            event.time,
            event.duration,
            event.value.toFixed(2).replace('.', ','), // Formatar valor
            this.getStatusText(event.status),
            `"${event.notes.replace(/"/g, '')}"` 
        ]);

        const csvContent = [
            headers.join(';'), // Usar ponto e vírgula como delimitador para compatibilidade com Excel em PT-BR
            ...rows.map(row => row.join(';'))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agendamentos_mecalendar_${this.formatDate(new Date()).replace(/-/g, '')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Agendamentos exportados com sucesso!', 'success');
    }
}

// Adicionar estilos CSS para animações e botão de deletar
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .delete-event {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
        border: none;
        background: rgba(239, 68, 68, 0.8);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.6rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .event-item:hover .delete-event {
        opacity: 1;
    }
    
    .delete-event:hover {
        background: rgba(239, 68, 68, 1);
        transform: scale(1.1);
    }
    
    .event-item {
        position: relative;
    }
`;
document.head.appendChild(style);

// Inicializar o calendário quando a página carregar
let calendar;
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar(); // Atribuir a uma propriedade global
});