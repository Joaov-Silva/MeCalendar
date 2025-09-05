<?php
require_once 'config.php';
require_once 'auth_check.php';

// Verifica se o usuário está logado
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeCalendar - Clientes</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="dark-mode.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <?php include_once 'sidebar.php'; // Inclui a sidebar ?>

        <!-- Main Content -->
        <main class="main-content">
            <header class="main-header">
                <div class="header-left">
                    <h1 class="page-title" data-translate="clients">Clientes</h1>
                    <p class="page-subtitle" data-translate="manage_clients">Gerencie sua base de clientes</p>
                </div>
                <div class="header-right">
                    <button class="btn btn-primary" id="newClientBtn">
                        <i class="fas fa-user-plus"></i>
                        <span data-translate="new_client">Novo Cliente</span>
                    </button>
                </div>
            </header>

            <!-- Search Bar -->
            <div class="search-container">
                <div class="search-bar">
                    <input type="text" id="searchInput" data-translate-placeholder="search_clients" placeholder="Buscar clientes...">
                    <button class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <!-- Clients Grid -->
            <div class="clients-container">
                <div class="clients-grid" id="clientsGrid">
                    <!-- Client cards will be populated dynamically -->
                </div>
            </div>
        </main>
    </div>

    <!-- New Client Modal -->
    <div class="modal" id="clientModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle" data-translate="new_client">Novo Cliente</h3>
                <button class="close-btn" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="clientForm">
                    <input type="hidden" id="clientId" name="clientId">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome" data-translate="full_name">Nome Completo *</label>
                            <input type="text" id="nome" name="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="telefone" data-translate="phone">Telefone *</label>
                            <input type="tel" id="telefone" name="telefone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email" data-translate="email">Email</label>
                            <input type="email" id="email" name="email">
                        </div>
                        <div class="form-group">
                            <label for="dataNascimento" data-translate="birth_date">Data de Nascimento</label>
                            <input type="date" id="dataNascimento" name="dataNascimento">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endereco" data-translate="address">Endereço</label>
                        <input type="text" id="endereco" name="endereco">
                    </div>
                    <div class="form-group">
                        <label for="observacoes" data-translate="observations">Observações</label>
                        <textarea id="observacoes" name="observacoes" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="status" data-translate="status">Status</label>
                        <select id="status" name="status">
                            <option value="ativo" data-translate="active">Ativo</option>
                            <option value="inativo" data-translate="inactive">Inativo</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelClient" data-translate="cancel">Cancelar</button>
                <button class="btn btn-primary" id="saveClient" data-translate="save_client">Salvar Cliente</button>
            </div>
        </div>
    </div>

    <!-- Client Details Modal -->
    <div class="modal" id="clientDetailsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-translate="client_details">Detalhes do Cliente</h3>
                <button class="close-btn" id="closeDetailsModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="client-details">
                    <div class="client-header">
                        <div class="client-avatar" id="clientAvatar"></div>
                        <div class="client-info">
                            <h2 id="detailsNome"></h2>
                            <span class="status-badge" id="detailsStatus"></span>
                        </div>
                    </div>
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span id="detailsTelefone"></span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-envelope"></i>
                            <span id="detailsEmail"></span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span id="detailsEndereco"></span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span id="detailsDataNascimento"></span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-sticky-note"></i>
                            <span id="detailsObservacoes"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" id="editClient">
                    <i class="fas fa-edit"></i>
                    <span data-translate="edit">Editar</span>
                </button>
                <button class="btn btn-danger" id="deleteClient">
                    <i class="fas fa-trash"></i>
                    <span data-translate="cancel">Excluir</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div id="toast" class="toast"></div>

    <script src="translations.js"></script>
    <script src="clients.js"></script>
    <script src="dark-mode.js"></script>
    
    <script>
        let clientsManager;

        document.addEventListener('DOMContentLoaded', function() {
            clientsManager = new ClientsManager();
            clientsManager.loadClients(); // Carregar clientes ao iniciar a página

            // Botão Novo Cliente
            document.getElementById('newClientBtn').addEventListener('click', () => {
                clientsManager.openClientModal();
            });

            // Botão Salvar Cliente (no modal)
            document.getElementById('saveClient').addEventListener('click', (e) => {
                clientsManager.handleClientSubmit(e);
            });

            // Fechar modais
            document.getElementById('closeModal').addEventListener('click', () => clientsManager.closeClientModal('clientModal'));
            document.getElementById('closeDetailsModal').addEventListener('click', () => clientsManager.closeClientModal('clientDetailsModal'));
            document.getElementById('cancelClient').addEventListener('click', () => clientsManager.closeClientModal('clientModal'));
            
            // Fechar modal ao clicar fora
            document.getElementById('clientModal').addEventListener('click', function(e) {
                if (e.target === this) clientsManager.closeClientModal('clientModal');
            });
            document.getElementById('clientDetailsModal').addEventListener('click', function(e) {
                if (e.target === this) clientsManager.closeClientModal('clientDetailsModal');
            });
            
            // Editar cliente do modal de detalhes
            document.getElementById('editClient').addEventListener('click', function() {
                const clientId = this.dataset.clientId;
                if (clientId) {
                    clientsManager.editClient(parseInt(clientId));
                    clientsManager.closeClientModal('clientDetailsModal');
                }
            });
            
            // Deletar cliente do modal de detalhes
            document.getElementById('deleteClient').addEventListener('click', function() {
                const clientId = this.dataset.clientId;
                if (clientId) {
                    clientsManager.deleteClient(parseInt(clientId));
                    clientsManager.closeClientModal('clientDetailsModal');
                }
            });

            // Busca
            document.getElementById('searchInput').addEventListener('keyup', (e) => {
                clientsManager.filterClients(e.target.value);
            });
            document.querySelector('.search-btn').addEventListener('click', () => {
                clientsManager.filterClients(document.getElementById('searchInput').value);
            });
        });
    </script>
</body>
</html>
