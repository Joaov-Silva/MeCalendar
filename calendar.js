// Calendar.js - Funcionalidade do Calendário Sistema de Agendamento

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.currentView = 'month';
        this.selectedEvent = null;
        this.currentUserId = (window && window.CURRENT_USER_ID) ? String(window.CURRENT_USER_ID) : 'guest';
        this.storageKey = `calendarEvents_${this.currentUserId}`;
        
        this.init();
    }

    init() {
        this.loadEvents();
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
                }));
            } else {
                this.events = [];
            }
        } catch (e) {
            this.events = [];
            console.error(e);
            this.showNotification('Erro ao carregar agendamentos.', 'error');
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
            
            if (isToday) {
                dayElement.classList.add('today');
            }

            // Verificar se há eventos neste dia
            const dayEvents = this.getEventsForDate(dateString);
            
            // Criar conteúdo do dia
            let dayContent = `<span class="day-number">${dayNumber}</span>`;
            
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'day-events';
                
                dayEvents.forEach(event => {
                    const eventElement = this.createEventElement(event);
                    eventsContainer.appendChild(eventElement);
                });
                
                dayElement.appendChild(document.createElement('div')).innerHTML = dayContent;
                dayElement.appendChild(eventsContainer);
            } else {
                dayElement.innerHTML = dayContent;
            }

            dayElement.addEventListener('click', (e) => {
                // Se clicou em um evento, não seleciona a data
                if (!e.target.closest('.event-item')) {
                    this.selectDate(currentDate);
                }
            });

            calendarDays.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    createEventElement(event) {
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${event.serviceType.toLowerCase().replace(/\s/g, '-')}`;
        eventElement.dataset.eventId = event.id;
        
        eventElement.innerHTML = `
            <div class="event-title">${event.client}</div>
            <div class="event-time">${event.time}</div>
            <div class="event-service">${event.serviceType}</div>
            <button class="delete-event" data-event-id="${event.id}" title="Deletar agendamento">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        eventElement.addEventListener('click', (e) => {
            // Não abrir painel se o clique foi no botão de deletar
            if (e.target.closest('.delete-event')) return;
            e.stopPropagation();
            this.showEventPanel(event);
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

    selectDate(date) {
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        const dayEvents = this.getEventsForDate(dateString);
        
        if (dayEvents.length > 0) {
            this.showEventPanel(dayEvents[0]);
        } else {
            this.openNewEventModal(dateString);
        }
    }

    showEventPanel(event) {
        const panel = document.getElementById('eventPanel');
        this.selectedEvent = event;
        
        // Atualizar informações do evento escopando pelo painel (evita conflito com IDs no formulário)
        panel.querySelector('#eventClient').textContent = event.client;
        panel.querySelector('#eventPhone').textContent = event.phone;
        panel.querySelector('#eventServiceType').textContent = event.serviceType;
        panel.querySelector('#eventServiceDescription').textContent = event.serviceDescription || 'Não informado';
        panel.querySelector('#eventDate').textContent = this.formatDateForDisplay(event.date);
        panel.querySelector('#eventTime').textContent = event.time;
        panel.querySelector('#eventValue').textContent = `R$ ${Number(event.value || 0).toFixed(2)}`;
        const statusBadge = panel.querySelector('#eventStatus');
        statusBadge.textContent = this.getStatusText(event.status);
        statusBadge.className = `status-badge ${this.normalizeStatusCss(event.status)}`;
        panel.querySelector('#eventNotes').textContent = event.notes || 'Nenhuma observação';
        
        // Atualizar botões de ação
        const actionsContainer = panel.querySelector('.event-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <button class="btn btn-outline" onclick="calendar.editEvent(${event.id})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-outline" onclick="calendar.callClient('${event.phone}')">
                    <i class="fas fa-phone"></i>
                    Ligar
                </button>
                <button class="btn btn-danger" onclick="calendar.deleteEvent(${event.id})">
                    <i class="fas fa-trash"></i>
                    Cancelar
                </button>
            `;
        }
        
        panel.classList.add('active');
    }

    closeEventPanel() {
        const panel = document.getElementById('eventPanel');
        panel.classList.remove('active', 'open', 'show');
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

    async saveNewEvent() {
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
            this.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
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

        // Preencher formulário com dados do evento (escopando pelo modal)
        modal.querySelector('#clientName').value = event.client;
        modal.querySelector('#clientPhone').value = event.phone;
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
        
        // Validação dos campos obrigatórios
        const clientName = (formData.get('clientName') || '').trim();
        const clientPhone = (formData.get('clientPhone') || '').trim();
        const serviceType = (formData.get('serviceType') || '').trim();
        const eventDate = formData.get('eventDate');
        const eventTime = formData.get('eventTime');
        if (!clientName || !clientPhone || !serviceType || !eventDate || !eventTime) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
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
            duration: parseInt(formData.get('eventDuration')) || 60,
            value: parseFloat(formData.get('eventValue')) || 0.00,
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

    formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
    calendar = new Calendar();
});
