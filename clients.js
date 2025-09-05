class ClientsManager {
    constructor() {
        this.clients = [];
        this.currentUserId = (window && window.CURRENT_USER_ID) ? String(window.CURRENT_USER_ID) : 'guest';
        
        // DOM Elements
        this.searchInput = document.getElementById('searchInput');
        this.clientsGrid = document.getElementById('clientsGrid');
        this.clientModal = document.getElementById('clientModal');
        this.clientForm = document.getElementById('clientForm');
        this.modalTitle = document.getElementById('modalTitle');
        this.clientIdInput = document.getElementById('clientId');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event Listeners for search, new client, and form submission are already in cliente.php
        // This class will be instantiated in cliente.php and those listeners will call methods here.
        
        // Adicionar listener para formatar telefone enquanto o usuário digita
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                e.target.value = this.formatPhoneNumberInput(e.target.value);
            });
        }
    }

    async loadClients() {
        try {
            const response = await fetch('api/clients.php', { credentials: 'same-origin' });
            if (!response.ok) throw new Error('Falha ao carregar clientes');
            const data = await response.json();
            if (data.success) {
                this.clients = data.data;
                this.displayClients(this.clients);
            } else {
                this.showToast(translations[getCurrentLanguage()]['error_loading_clients'] || 'Erro ao carregar clientes: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            this.showToast(translations[getCurrentLanguage()]['error_loading_clients_generic'] || 'Erro ao carregar clientes.', 'error');
        }
    }

    displayClients(clientsToDisplay) {
        this.clientsGrid.innerHTML = '';
        
        if (clientsToDisplay.length === 0) {
            this.clientsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-users"></i>
                    <p>${translations[getCurrentLanguage()]['no_clients_found'] || 'Nenhum cliente encontrado'}</p>
                </div>`;
            return;
        }

        clientsToDisplay.forEach(client => {
            const card = this.createClientCard(client);
            this.clientsGrid.appendChild(card);
        });
    }

    createClientCard(client) {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `
            <div class="client-header">
                <div class="client-avatar">
                    ${client.nome.charAt(0).toUpperCase()}
                </div>
                <div class="client-info">
                    <h3>${client.nome}</h3>
                    <span class="status-badge ${client.status}">
                        ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                </div>
            </div>
            <div class="client-details">
                <p><i class="fas fa-phone"></i> ${this.formatPhoneNumberForDisplay(client.telefone)}</p>
                ${client.email ? `<p><i class="fas fa-envelope"></i> ${client.email}</p>` : ''}
                ${client.endereco ? `<p><i class="fas fa-map-marker-alt"></i> ${client.endereco}</p>` : ''}
            </div>
            <div class="client-actions">
                <button onclick="clientsManager.viewClient(${client.id})" class="btn btn-outline">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="clientsManager.editClient(${client.id})" class="btn btn-outline">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="clientsManager.deleteClient(${client.id})" class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        card.dataset.clientId = client.id;
        card.addEventListener('click', (e) => {
            if (e.target.closest('.client-actions button')) return;
            this.viewClient(client.id); // Chamar viewClient com ID para buscar detalhes atualizados
        });
        return card;
    }

    filterClients(searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredClients = this.clients.filter(client => {
            return client.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
                   client.telefone.toLowerCase().includes(lowerCaseSearchTerm) ||
                   (client.email && client.email.toLowerCase().includes(lowerCaseSearchTerm));
        });
        this.displayClients(filteredClients);
    }

    async handleClientSubmit(e) {
        console.log('handleClientSubmit called');
        e.preventDefault();
        const formData = new FormData(this.clientForm);
        const clientId = this.clientIdInput.value;
        
        const data = {
            id: clientId || null,
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            data_nascimento: formData.get('dataNascimento'),
            endereco: formData.get('endereco'),
            observacoes: formData.get('observacoes'),
            status: formData.get('status')
        };
        
        if (!data.nome || !data.telefone) {
            this.showToast(translations[getCurrentLanguage()]['fill_required_fields'] || 'Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        try {
            const response = await fetch('api/clients.php', {
                method: clientId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast(clientId ? translations[getCurrentLanguage()]['client_updated'] : translations[getCurrentLanguage()]['client_created'], 'success');
                this.closeClientModal('clientModal');
                this.loadClients();
            } else {
                // Melhorar a mensagem de erro com tradução
                const errorMessage = result.error || translations[getCurrentLanguage()]['error_saving_client'] || 'Erro ao salvar cliente';
                throw new Error(errorMessage);
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async viewClient(id) {
        try {
            const response = await fetch(`api/clients.php?id=${id}`, { credentials: 'same-origin' });
            if (!response.ok) throw new Error('Falha ao carregar detalhes do cliente');
            const data = await response.json();
            if (data.success && data.data) {
                this.showClientDetails(data.data);
            } else {
                throw new Error(data.error || 'Cliente não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do cliente:', error);
            this.showToast(translations[getCurrentLanguage()]['error_loading_client_details'] || 'Erro ao carregar detalhes do cliente.', 'error');
        }
    }

    async editClient(id) {
        try {
            const response = await fetch(`api/clients.php?id=${id}`, { credentials: 'same-origin' });
            if (!response.ok) throw new Error('Falha ao carregar cliente para edição');
            const data = await response.json();
            if (data.success && data.data) {
                this.fillClientForm(data.data);
                this.modalTitle.textContent = translations[getCurrentLanguage()]['edit_client'] || 'Editar Cliente';
                this.openClientModal();
            } else {
                throw new Error(data.error || 'Cliente não encontrado para edição');
            }
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            this.showToast(translations[getCurrentLanguage()]['error_editing_client'] || 'Erro ao carregar dados do cliente para edição.', 'error');
        }
    }

    async deleteClient(id) {
        if (confirm(translations[getCurrentLanguage()]['confirm_delete_client'] || 'Tem certeza que deseja excluir este cliente?')) {
            try {
                const response = await fetch('api/clients.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                });
                const data = await response.json();
                if (data.success) {
                    this.showToast(translations[getCurrentLanguage()]['client_deleted'], 'success');
                    this.closeClientModal('clientDetailsModal');
                    this.loadClients();
                } else {
                    // Melhorar a mensagem de erro com tradução
                    const errorMessage = data.error || translations[getCurrentLanguage()]['error_deleting_client'] || 'Erro ao excluir cliente';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Erro ao deletar cliente:', error);
                this.showToast(error.message, 'error');
            }
        }
    }

    showClientDetails(client) {
        const detailsModal = document.getElementById('clientDetailsModal');
        detailsModal.querySelector('#detailsNome').textContent = client.nome;
        detailsModal.querySelector('#detailsTelefone').textContent = this.formatPhoneNumberForDisplay(client.telefone);
        detailsModal.querySelector('#detailsEmail').textContent = client.email || 'Não informado';
        detailsModal.querySelector('#detailsEndereco').textContent = client.endereco || 'Não informado';
        detailsModal.querySelector('#detailsDataNascimento').textContent = this.formatDateForDisplay(client.data_nascimento) || 'Não informado';
        detailsModal.querySelector('#detailsObservacoes').textContent = client.observacoes || 'Nenhuma observação';
        
        const statusBadge = detailsModal.querySelector('#detailsStatus');
        statusBadge.textContent = client.status.charAt(0).toUpperCase() + client.status.slice(1);
        statusBadge.className = `status-badge ${client.status}`;
        
        detailsModal.querySelector('#clientAvatar').textContent = client.nome.charAt(0).toUpperCase();
        
        // Define os data attributes para os botões de ação do modal de detalhes
        detailsModal.querySelector('#editClient').dataset.clientId = client.id;
        detailsModal.querySelector('#deleteClient').dataset.clientId = client.id;
        
        this.openClientModal('clientDetailsModal'); // Abre o modal de detalhes
    }

    fillClientForm(client) {
        this.clientIdInput.value = client.id;
        this.clientForm.querySelector('#nome').value = client.nome;
        this.clientForm.querySelector('#telefone').value = client.telefone;
        this.clientForm.querySelector('#email').value = client.email || '';
        this.clientForm.querySelector('#dataNascimento').value = client.data_nascimento || '';
        this.clientForm.querySelector('#endereco').value = client.endereco || '';
        this.clientForm.querySelector('#observacoes').value = client.observacoes || '';
        this.clientForm.querySelector('#status').value = client.status;
    }

    openClientModal(modalId = 'clientModal') {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        if (modalId === 'clientModal') {
            this.clientForm.reset();
            this.clientIdInput.value = '';
            this.modalTitle.textContent = translations[getCurrentLanguage()]['new_client'] || 'Novo Cliente';
        }
    }

    closeClientModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        if (modalId === 'clientModal') {
            this.clientForm.reset();
            this.clientIdInput.value = '';
            this.modalTitle.textContent = translations[getCurrentLanguage()]['new_client'] || 'Novo Cliente';
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    formatDateForDisplay(dateString) {
        if (!dateString) return 'Não informado';
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    formatPhoneNumberForDisplay(phoneNumber) {
        if (!phoneNumber) return 'Não informado';
        // Remove tudo que não for dígito
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        
        // Aplica a máscara (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber; // Retorna o número original se não conseguir formatar
    }

    formatPhoneNumberInput(value) {
        if (!value) return '';
        const cleaned = value.replace(/\D/g, ''); // Remove tudo que não for dígito
        let formatted = '';
        
        if (cleaned.length > 0) {
            formatted += `(${cleaned.substring(0, 2)}`;
        }
        if (cleaned.length > 2) {
            formatted += `) ${cleaned.substring(2, 7)}`;
        }
        if (cleaned.length > 7) {
            formatted += `-${cleaned.substring(7, 11)}`;
        }
        return formatted;
    }
}

// Initialize ClientsManager in cliente.php instead of here

// Utility function (debounce) - pode ser mantida fora da classe ou movida para um arquivo de utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


document.addEventListener('DOMContentLoaded', function() {
    // Certifica-se que ClientsManager está disponível globalmente após ser instanciado em cliente.php
    // A instância 'clientsManager' já é criada e configurada em cliente.php
    // Portanto, não precisamos recriá-la aqui.
});