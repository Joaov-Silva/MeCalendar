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
            .then(clients => {
                displayClients(clients);
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

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Modal Functions
    function showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // CRUD Operations
    async function handleClientSubmit(e) {
        e.preventDefault();
        const formData = new FormData(clientForm);
        const clientId = formData.get('clientId');
        
        try {
            const response = await fetch('api/clients.php', {
                method: clientId ? 'PUT' : 'POST',
                body: formData
            });
            
            if (response.ok) {
                showToast(clientId ? 'Cliente atualizado!' : 'Cliente criado!');
                closeModal('clientModal');
                loadClients();
            } else {
                throw new Error('Erro ao salvar cliente');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
});

// Global Functions for Card Actions
function viewClient(id) {
    // Implement view client details
}

function editClient(id) {
    // Implement edit client
}

function deleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        // Implement delete client
    }
}