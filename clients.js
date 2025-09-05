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
        card.dataset.clientId = client.id; // Adiciona o ID ao card para acesso fácil
        card.addEventListener('click', (e) => {
            // Previne que o clique nos botões propague e abra os detalhes novamente
            if (e.target.closest('.client-actions button')) return;
            viewClient(client);
        });
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
            data_nascimento: formData.get('dataNascimento'), // Corrigido para data_nascimento
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
                showToast(clientId ? translations[getCurrentLanguage()]['client_updated'] : translations[getCurrentLanguage()]['client_created'], 'success'); // Usando traduções
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
// As funções globais viewClient, editClient e deleteClient agora recebem o objeto client ou ID diretamente
function viewClient(client) {
    showClientDetails(client);
}

async function editClient(id) {
    try {
        const response = await fetch(`api/clients.php?id=${id}`); // Fetch individual client
        const data = await response.json();
        if (data.success && data.data) {
            fillClientForm(data.data);
            document.getElementById('modalTitle').textContent = translations[getCurrentLanguage()]['edit_client']; // Título de edição
            showModal('clientModal');
        } else {
            throw new Error(data.error || 'Cliente não encontrado');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteClient(id) {
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
                showToast(translations[getCurrentLanguage()]['client_deleted'], 'success'); // Usando traduções
                loadClients();
                closeModal('clientDetailsModal'); // Fecha o modal de detalhes após exclusão
            } else {
                throw new Error(data.error || 'Erro ao excluir cliente');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

function showClientDetails(client) {
    document.getElementById('detailsNome').textContent = client.nome;
    document.getElementById('detailsTelefone').textContent = client.telefone;
    document.getElementById('detailsEmail').textContent = client.email || 'Não informado';
    document.getElementById('detailsEndereco').textContent = client.endereco || 'Não informado';
    document.getElementById('detailsDataNascimento').textContent = formatDateForDisplay(client.data_nascimento) || 'Não informado';
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
    document.getElementById('dataNascimento').value = client.data_nascimento || ''; // Corrigido para data_nascimento
    document.getElementById('endereco').value = client.endereco || '';
    document.getElementById('observacoes').value = client.observacoes || '';
    document.getElementById('status').value = client.status;
    
    document.getElementById('modalTitle').textContent = translations[getCurrentLanguage()]['edit_client']; // Usando traduções
}

// Funções de modal e toast (mover para o topo do arquivo ou em um utilitário se usadas em mais lugares)
// Já existem em cliente.php. Preciso garantir que não haverá duplicidade ou que a versão correta será usada.
// Para evitar conflito, vou definir estas funções como globais aqui, e o script em cliente.php pode utilizá-las.

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'clientModal') {
        document.getElementById('clientForm').reset();
        document.getElementById('clientId').value = '';
        document.getElementById('modalTitle').textContent = translations[getCurrentLanguage()]['new_client']; // Usando traduções
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

// Adicionar função de formatação de data para display, se não existir globalmente
// (poderia vir de translations.js ou utilitários)
function formatDateForDisplay(dateString) {
    if (!dateString) return 'Não informado';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
}

// Adicionar traduções para `edit_client` e `confirm_delete_client` no translations.js
// (isso será feito no próximo passo, se necessário)