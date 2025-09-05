class ServicesManager {
    constructor() {
        this.services = [];
        this.servicesTableBody = document.getElementById('servicesTableBody');
        this.currentUserId = (window && window.CURRENT_USER_ID) ? String(window.CURRENT_USER_ID) : 'guest';
        this.init();
    }

    async init() {
        await this.loadServices();
        this.renderServices();
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Configurando event listeners para a tabela de serviços...');
        // Delegação de eventos para botões de ação na tabela de serviços
        this.servicesTableBody.addEventListener('click', async (e) => {
            console.log('Clique detectado na tabela de serviços.', e.target);
            const editBtn = e.target.closest('.edit-service-btn');
            const deleteBtn = e.target.closest('.delete-service-btn');

            if (editBtn) {
                const serviceId = parseInt(editBtn.dataset.serviceId);
                console.log('Botão Editar clicado para o serviço ID:', serviceId);
                const service = this.services.find(s => s.id === serviceId);
                if (service) {
                    this.openEditServiceModal(service);
                }
            } else if (deleteBtn) {
                const serviceId = parseInt(deleteBtn.dataset.serviceId);
                console.log('Botão Cancelar clicado para o serviço ID:', serviceId);
                const confirmation = this.confirmAction(translations[this.getCurrentLanguage()]['confirm_cancel_appointment'] || 'Tem certeza que deseja cancelar este agendamento?');
                console.log('Confirmação para cancelar (true/false):', confirmation);
                if (confirmation) {
                    await this.cancelService(serviceId);
                }
            }
        });
    }

    // Helper para exibir notificações
    showNotification(message, type = 'info') {
        // Reutiliza a função de notificação do calendar.js se disponível, senão implementa uma básica.
        if (window.calendar && window.calendar.showNotification) {
            window.calendar.showNotification(message, type);
        } else {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => { notification.remove(); }, 3000);
        }
    }

    // Helper para confirmação de ações
    confirmAction(message) {
        return confirm(message);
    }

    // Helper para obter o idioma atual (pode ser globalmente definido em translations.js)
    getCurrentLanguage() {
        if (typeof getCurrentLanguage === 'function') {
            return getCurrentLanguage();
        }
        return localStorage.getItem('MeCalendarSettings_language') || 'pt-BR'; // Fallback
    }

    async loadServices() {
        try {
            const resp = await fetch('agendamentos_api.php?status=active', { credentials: 'same-origin' }); // Buscar apenas agendamentos ativos
            if (!resp.ok) throw new Error('Falha ao carregar serviços.');
            const data = await resp.json();
            if (data && data.success) {
                this.services = (data.data || []).map(row => ({
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
                console.log('Serviços carregados:', this.services);
            } else {
                this.services = [];
                console.log('Nenhum serviço retornado ou erro na API.', data);
            }
        } catch (e) {
            this.services = [];
            console.error('Erro ao carregar serviços:', e);
            this.showNotification('Erro ao carregar serviços.', 'error');
        }
    }

    renderServices() {
        this.servicesTableBody.innerHTML = '';
        if (this.services.length === 0) {
            this.servicesTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1rem;" data-translate="no_active_appointments">Nenhum agendamento ativo encontrado.</td></tr>`;
            return;
        }

        this.services.forEach(service => {
            const row = this.servicesTableBody.insertRow();
            const statusText = service.status ? service.status.charAt(0).toUpperCase() + service.status.slice(1) : 'Pendente';
            
            row.innerHTML = `
                <td>${service.client}</td>
                <td>${service.serviceType || 'Não informado'}</td>
                <td>${this.formatDateForDisplay(service.date)}</td>
                <td>${service.time}</td>
                <td><span class="status-badge ${service.status}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline edit-service-btn" data-service-id="${service.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-service-btn" data-service-id="${service.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
        });
        console.log('Serviços renderizados na tabela.');
    }

    openEditServiceModal(service) {
        console.log('openEditServiceModal chamado para:', service);
        this.showNotification(`Funcionalidade de edição para ${service.client} em desenvolvimento.`, 'info');

        // Aqui, precisamos abrir o modal de edição de agendamento (modal_edit_appointment.php)
        const modal = document.getElementById('editAppointmentModal');
        if (modal) {
            // Preencher o formulário com os dados do serviço
            document.getElementById('editAppointmentId').value = service.id;
            document.getElementById('editClientName').value = service.client;
            document.getElementById('editServiceType').value = service.serviceType;
            document.getElementById('editServiceDescription').value = service.serviceDescription;
            document.getElementById('editEventDate').value = service.date;
            document.getElementById('editEventTime').value = service.time;
            document.getElementById('editEventDuration').value = service.duration;
            document.getElementById('editEventValue').value = service.value;
            document.getElementById('editEventStatus').value = service.status;
            document.getElementById('editEventNotes').value = service.notes;
            
            // Novos campos: telefone e email do cliente
            const editClientPhoneInput = document.getElementById('editClientPhone');
            const editClientEmailInput = document.getElementById('editClientEmail');
            if (editClientPhoneInput) {
                editClientPhoneInput.value = this.formatPhoneNumberForDisplay(service.phone);
                editClientPhoneInput.addEventListener('input', (e) => {
                    e.target.value = this.formatPhoneNumberInput(e.target.value);
                });
            }
            if (editClientEmailInput) {
                editClientEmailInput.value = service.email || '';
            }

            modal.classList.add('show'); // Mostrar o modal
            // Adicionar event listeners para o modal
            document.getElementById('closeEditAppointmentModal').onclick = () => modal.classList.remove('show');
            document.getElementById('cancelEditAppointment').onclick = () => modal.classList.remove('show');
            document.getElementById('saveEditAppointment').onclick = async (e) => await this.handleEditAppointmentSubmit(e);
        } else {
            console.error('Modal de edição de agendamento não encontrado!');
            this.showNotification('Erro: Modal de edição não disponível.', 'error');
        }
    }

    async handleEditAppointmentSubmit(e) {
        e.preventDefault();
        console.log('handleEditAppointmentSubmit chamado.');

        const form = document.getElementById('editAppointmentForm');
        const id = document.getElementById('editAppointmentId').value;
        const client = document.getElementById('editClientName').value; 
        const phone = document.getElementById('editClientPhone').value; // Obter o telefone
        const email = document.getElementById('editClientEmail').value; // Obter o email
        const serviceType = document.getElementById('editServiceType').value;
        const serviceDescription = document.getElementById('editServiceDescription').value;
        const date = document.getElementById('editEventDate').value;
        const time = document.getElementById('editEventTime').value;
        const duration = document.getElementById('editEventDuration').value;
        const value = document.getElementById('editEventValue').value;
        const status = document.getElementById('editEventStatus').value;
        const notes = document.getElementById('editEventNotes').value;

        // Validações básicas
        if (!client || !phone || !serviceType || !date || !time) { // Adicionar 'phone' à validação
            this.showNotification(translations[this.getCurrentLanguage()]['fill_required_fields'] || 'Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        if (parseFloat(value) < 0) {
            this.showNotification(translations[this.getCurrentLanguage()]['negative_value_error'] || 'O valor do agendamento não pode ser negativo!', 'error');
            return;
        }

        try {
            const resp = await fetch('agendamentos_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    action: 'update', id,
                    client, phone, email, // Incluir telefone e email
                    serviceType, serviceDescription, date, time,
                    duration: parseInt(duration), value: parseFloat(value),
                    status, notes
                })
            });

            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.error || 'Falha ao atualizar agendamento.');
            }

            const data = await resp.json();
            if (!data.success) throw new Error(data.error || 'Erro ao atualizar agendamento.');

            this.showNotification(translations[this.getCurrentLanguage()]['appointment_updated_success'] || 'Agendamento atualizado com sucesso!', 'success');
            document.getElementById('editAppointmentModal').classList.remove('show');
            await this.loadServices(); // Recarregar e renderizar os serviços atualizados
            this.renderServices();

        } catch (e) {
            console.error('Erro ao salvar agendamento:', e);
            this.showNotification(translations[this.getCurrentLanguage()]['error_saving_appointment'] || `Erro ao salvar agendamento: ${e.message}`, 'error');
        }
    }

    async cancelService(serviceId) {
        console.log('cancelService chamado para ID:', serviceId);
        try {
            const resp = await fetch('agendamentos_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'delete', id: serviceId }) // Alterado de 'cancel' para 'delete'
            });
            if (!resp.ok) {
                const errorData = await resp.json();
                console.error('Erro na resposta da API ao cancelar:', errorData);
                throw new Error(errorData.error || 'Falha ao cancelar agendamento.');
            }
            const data = await resp.json();
            if (!data.success) {
                console.error('API retornou falha ao cancelar:', data);
                throw new Error(data.error || 'Erro ao cancelar agendamento.');
            }

            this.showNotification(translations[this.getCurrentLanguage()]['appointment_cancelled_success'] || 'Agendamento cancelado com sucesso!', 'success');
            await this.loadServices(); // Recarregar a lista de serviços
            this.renderServices();
        } catch (e) {
            console.error('Erro ao cancelar serviço:', e);
            this.showNotification(translations[this.getCurrentLanguage()]['error_cancelling_appointment'] || `Erro ao cancelar agendamento: ${e.message}`, 'error');
        }
    }

    // Métodos utilitários
    formatDateForDisplay(dateString) {
        if (!dateString) return 'Não informado';
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    formatPhoneNumberInput(value) {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return value;
    }

    formatPhoneNumberForDisplay(phoneNumber) {
        if (!phoneNumber) return '';
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 11) { // 11 dígitos para (DDD) NNNNN-NNNN
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
        }
        return phoneNumber;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    // Define window.calendar se ainda não estiver definido, para que services.js possa usá-lo.
    if (!window.calendar) {
        // Se calendar.js não carregou antes, ou não exporta um objeto global 'calendar',
        // ServicesManager vai usar sua própria implementação de showNotification.
        // O ideal é que calendar.js seja carregado antes e defina window.calendar.
        // Por enquanto, vamos garantir que a função global getCurrentLanguage esteja disponível.
        if (typeof getCurrentLanguage !== 'function') {
            window.getCurrentLanguage = () => localStorage.getItem('MeCalendarSettings_language') || 'pt-BR';
        }
    }

    new ServicesManager();
});
