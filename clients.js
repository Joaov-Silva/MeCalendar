document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const clientsGrid = document.getElementById('clientsGrid');
    const clientModal = document.getElementById('clientModal');
    const clientForm = document.getElementById('clientForm');
    const newClientBtn = document.getElementById('newClientBtn');
    
    // Load clients on page load
    loadClients();

    // Event Listeners
    searchInput.addEventListener('input', debounce(searchClients, 300));
    newClientBtn.addEventListener('click', () => showModal('clientModal'));
    clientForm.addEventListener('submit', handleClientSubmit);

    // Functions
    function loadClients() {
        fetch('api/clients.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayClients(data.data);
                } else {
                    showToast('Erro ao carregar clientes: ' + data.error, 'error');
                }
            })
            .catch(error => showToast('Erro ao carregar clientes', 'error'));
    }

    function displayClients(clients) {
        clientsGrid.innerHTML = '';
        
        if (clients.length === 0) {
            clientsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-users"></i>
                    <p>Nenhum cliente encontrado</p>
                </div>`;
            return;
        }

        clients.forEach(client => {
            const card = createClientCard(client);
            clientsGrid.appendChild(card);
        });
    }

    function createClientCard(client) {
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
                <p><i class="fas fa-phone"></i> ${client.telefone}</p>
                ${client.email ? `<p><i class="fas fa-envelope"></i> ${client.email}</p>` : ''}
                ${client.endereco ? `<p><i class="fas fa-map-marker-alt"></i> ${client.endereco}</p>` : ''}
            </div>
            <div class="client-actions">
                <button onclick="viewClient(${client.id})" class="btn btn-outline">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editClient(${client.id})" class="btn btn-outline">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteClient(${client.id})" class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    }

    // Utility Functions
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

    // CRUD Operations
    async function handleClientSubmit(e) {
        e.preventDefault();
        const formData = new FormData(clientForm);
        const clientId = formData.get('clientId');
        
        const data = {
            id: clientId || null,
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            dataNascimento: formData.get('dataNascimento'),
            endereco: formData.get('endereco'),
            observacoes: formData.get('observacoes'),
            status: formData.get('status')
        };
        
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
                showToast(clientId ? 'Cliente atualizado!' : 'Cliente criado!');
                closeModal('clientModal');
                loadClients();
            } else {
                throw new Error(result.error || 'Erro ao salvar cliente');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
});

// Global Functions for Card Actions
function viewClient(id) {
    fetch('api/clients.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const client = data.data.find(c => c.id == id);
                if (client) {
                    showClientDetails(client);
                }
            }
        })
        .catch(error => showToast('Erro ao carregar detalhes do cliente', 'error'));
}

function editClient(id) {
    fetch('api/clients.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const client = data.data.find(c => c.id == id);
                if (client) {
                    fillClientForm(client);
                    showModal('clientModal');
                }
            }
        })
        .catch(error => showToast('Erro ao carregar dados do cliente', 'error'));
}

function deleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        fetch('api/clients.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Cliente excluído com sucesso!');
                loadClients();
            } else {
                showToast('Erro ao excluir cliente: ' + data.error, 'error');
            }
        })
        .catch(error => showToast('Erro ao excluir cliente', 'error'));
    }
}

function showClientDetails(client) {
    document.getElementById('detailsNome').textContent = client.nome;
    document.getElementById('detailsTelefone').textContent = client.telefone;
    document.getElementById('detailsEmail').textContent = client.email || 'Não informado';
    document.getElementById('detailsEndereco').textContent = client.endereco || 'Não informado';
    document.getElementById('detailsDataNascimento').textContent = client.data_nascimento || 'Não informado';
    document.getElementById('detailsObservacoes').textContent = client.observacoes || 'Nenhuma observação';
    
    const statusBadge = document.getElementById('detailsStatus');
    statusBadge.textContent = client.status.charAt(0).toUpperCase() + client.status.slice(1);
    statusBadge.className = `status-badge ${client.status}`;
    
    document.getElementById('clientAvatar').textContent = client.nome.charAt(0).toUpperCase();
    
    // Define os data attributes para os botões
    document.getElementById('editClient').dataset.clientId = client.id;
    document.getElementById('deleteClient').dataset.clientId = client.id;
    
    showModal('clientDetailsModal');
}

function fillClientForm(client) {
    document.getElementById('clientId').value = client.id;
    document.getElementById('nome').value = client.nome;
    document.getElementById('telefone').value = client.telefone;
    document.getElementById('email').value = client.email || '';
    document.getElementById('dataNascimento').value = client.data_nascimento || '';
    document.getElementById('endereco').value = client.endereco || '';
    document.getElementById('observacoes').value = client.observacoes || '';
    document.getElementById('status').value = client.status;
    
    document.getElementById('modalTitle').textContent = 'Editar Cliente';
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'clientModal') {
        document.getElementById('clientForm').reset();
        document.getElementById('clientId').value = '';
        document.getElementById('modalTitle').textContent = 'Novo Cliente';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}