// Calendar.js - Funcionalidade do Calendário Sistema de Agendamento

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.currentView = 'month';
        this.selectedEvent = null;
        
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
        document.querySelector('.btn-secondary').addEventListener('click', () => {
            this.openNewEventModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeNewEventModal();
        });

        document.getElementById('cancelEvent').addEventListener('click', () => {
            this.closeNewEventModal();
        });

        document.getElementById('saveEvent').addEventListener('click', () => {
            this.saveNewEvent();
        });

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

        // Botão de deletar evento
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-event')) {
                const eventId = parseInt(e.target.dataset.eventId);
                this.deleteEvent(eventId);
            }
        });
    }

    loadEvents() {
        // Carregar eventos do localStorage ou API
        const savedEvents = localStorage.getItem('calendarEvents');
        if (savedEvents) {
            this.events = JSON.parse(savedEvents);
        } else {
            // Eventos de exemplo
            this.events = [
                {
                    id: 1,
                    client: 'João Silva',
                    phone: '(11) 99999-9999',
                    service: 'corte-barba',
                    date: '2025-01-15',
                    time: '14:00',
                    status: 'confirmed',
                    notes: 'Cliente preferência por corte mais curto'
                },
                {
                    id: 2,
                    client: 'Maria Santos',
                    phone: '(11) 88888-8888',
                    service: 'hidratacao',
                    date: '2025-01-20',
                    time: '10:30',
                    status: 'pending',
                    notes: 'Primeira vez no salão'
                },
                {
                    id: 3,
                    client: 'Pedro Costa',
                    phone: '(11) 77777-7777',
                    service: 'corte',
                    date: '2025-01-22',
                    time: '16:00',
                    status: 'confirmed',
                    notes: ''
                }
            ];
            this.saveEvents();
        }
    }

    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
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
        eventElement.className = `event-item ${event.service} ${event.status}`;
        eventElement.dataset.eventId = event.id;
        
        const serviceNames = {
            'corte': 'Corte',
            'barba': 'Barba',
            'corte-barba': 'Corte + Barba',
            'hidratacao': 'Hidratação',
            'pigmentacao': 'Pigmentação',
            'tratamento': 'Tratamento'
        };
        
        eventElement.innerHTML = `
            <div class="event-title">${event.client}</div>
            <div class="event-time">${event.time}</div>
            <div class="event-service">${serviceNames[event.service] || event.service}</div>
            <button class="delete-event" data-event-id="${event.id}" title="Deletar agendamento">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        eventElement.addEventListener('click', (e) => {
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
        this.selectedEvent = event;
        const panel = document.getElementById('eventPanel');
        
        const serviceNames = {
            'corte': 'Corte',
            'barba': 'Barba',
            'corte-barba': 'Corte + Barba',
            'hidratacao': 'Hidratação',
            'pigmentacao': 'Pigmentação',
            'tratamento': 'Tratamento'
        };
        
        document.getElementById('eventClient').textContent = event.client;
        document.getElementById('eventPhone').textContent = event.phone;
        document.getElementById('eventService').textContent = serviceNames[event.service] || event.service;
        document.getElementById('eventDate').textContent = this.formatDateForDisplay(event.date);
        document.getElementById('eventTime').textContent = event.time;
        document.getElementById('eventStatus').textContent = this.getStatusText(event.status);
        document.getElementById('eventStatus').className = `status-badge ${event.status}`;
        
        // Atualizar botões de ação
        const actionsContainer = document.querySelector('.event-actions');
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
                Deletar
            </button>
        `;
        
        panel.classList.add('active');
    }

    closeEventPanel() {
        document.getElementById('eventPanel').classList.remove('active');
        this.selectedEvent = null;
    }

    openNewEventModal(selectedDate = null) {
        const modal = document.getElementById('newEventModal');
        const form = document.getElementById('newEventForm');
        
        if (selectedDate) {
            document.getElementById('eventDate').value = selectedDate;
        } else {
            document.getElementById('eventDate').value = this.formatDate(new Date());
        }
        
        form.reset();
        modal.classList.add('active');
    }

    closeNewEventModal() {
        document.getElementById('newEventModal').classList.remove('active');
    }

    saveNewEvent() {
        const form = document.getElementById('newEventForm');
        const formData = new FormData(form);
        
        // Validar campos obrigatórios
        const clientName = formData.get('clientName').trim();
        const clientPhone = formData.get('clientPhone').trim();
        const serviceType = formData.get('serviceType');
        const eventDate = formData.get('eventDate');
        const eventTime = formData.get('eventTime');
        
        if (!clientName || !clientPhone || !serviceType || !eventDate || !eventTime) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }
        
        const event = {
            id: Date.now(),
            client: clientName,
            phone: clientPhone,
            service: serviceType,
            date: eventDate,
            time: eventTime,
            status: 'pending',
            notes: formData.get('eventNotes') || ''
        };

        this.events.push(event);
        this.saveEvents();
        this.renderCalendar();
        this.closeNewEventModal();
        
        this.showNotification('Agendamento criado com sucesso!', 'success');
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        // Preencher o modal com os dados do evento
        document.getElementById('clientName').value = event.client;
        document.getElementById('clientPhone').value = event.phone;
        document.getElementById('serviceType').value = event.service;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventNotes').value = event.notes;
        
        // Mudar o comportamento do botão salvar para editar
        const saveBtn = document.getElementById('saveEvent');
        saveBtn.textContent = 'Atualizar';
        saveBtn.onclick = () => this.updateEvent(eventId);
        
        this.openNewEventModal();
    }

    updateEvent(eventId) {
        const form = document.getElementById('newEventForm');
        const formData = new FormData(form);
        
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return;
        
        this.events[eventIndex] = {
            ...this.events[eventIndex],
            client: formData.get('clientName').trim(),
            phone: formData.get('clientPhone').trim(),
            service: formData.get('serviceType'),
            date: formData.get('eventDate'),
            time: formData.get('eventTime'),
            notes: formData.get('eventNotes') || ''
        };
        
        this.saveEvents();
        this.renderCalendar();
        this.closeNewEventModal();
        
        // Restaurar o botão salvar
        const saveBtn = document.getElementById('saveEvent');
        saveBtn.textContent = 'Salvar';
        saveBtn.onclick = () => this.saveNewEvent();
        
        this.showNotification('Agendamento atualizado com sucesso!', 'success');
    }

    deleteEvent(eventId) {
        if (!confirm('Tem certeza que deseja deletar este agendamento?')) {
            return;
        }
        
        this.events = this.events.filter(e => e.id !== eventId);
        this.saveEvents();
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
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || 'Pendente';
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
