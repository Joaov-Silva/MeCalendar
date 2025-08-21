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
    <title>Sistema de Agendamento - Clientes</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="dark-mode.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <a href="index.php" class="logo">
                    <div class="logo-icon"><i class="fas fa-calendar"></i></div>
                    <span class="logo-text">Sistema de Agendamento</span>
                </a>
            </div>
            
            <nav class="sidebar-nav">
                <ul class="nav-list">
                    <li class="nav-item">
                        <a href="calendar.php" class="nav-link">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Calendário</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="cliente.php" class="nav-link active">
                            <i class="fas fa-users"></i>
                            <span>Clientes</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="relatorios.php" class="nav-link">
                            <i class="fas fa-chart-bar"></i>
                            <span>Relatórios</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="configuracoes.php" class="nav-link">
                            <i class="fas fa-cog"></i>
                            <span>Configurações</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- Botão Dark Mode -->
            <div class="dark-mode-section">
                <button class="dark-mode-btn" id="darkModeBtn" title="Alternar modo escuro">
                    <i class="fas fa-moon" id="darkModeIcon"></i>
                    <span>Modo Escuro</span>
                </button>
            </div>

            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <span class="user-name"><?= htmlspecialchars($currentUser['nome']); ?></span>
                        <span class="user-role"><?= ucfirst($currentUser['tipo_nome']); ?></span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="main-header">
                <div class="header-left">
                    <h1 class="page-title">Clientes</h1>
                    <p class="page-subtitle">Gerencie sua base de clientes</p>
                </div>
                <div class="header-right">
                    <button class="btn btn-primary" id="newClientBtn">
                        <i class="fas fa-user-plus"></i>
                        Novo Cliente
                    </button>
                </div>
            </header>

            <!-- Search Bar -->
            <div class="search-container">
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Buscar clientes...">
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
                <h3 id="modalTitle">Novo Cliente</h3>
                <button class="close-btn" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="clientForm">
                    <input type="hidden" id="clientId" name="clientId">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome">Nome Completo *</label>
                            <input type="text" id="nome" name="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="telefone">Telefone *</label>
                            <input type="tel" id="telefone" name="telefone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email">
                        </div>
                        <div class="form-group">
                            <label for="dataNascimento">Data de Nascimento</label>
                            <input type="date" id="dataNascimento" name="dataNascimento">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="endereco">Endereço</label>
                        <input type="text" id="endereco" name="endereco">
                    </div>
                    <div class="form-group">
                        <label for="observacoes">Observações</label>
                        <textarea id="observacoes" name="observacoes" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelClient">Cancelar</button>
                <button class="btn btn-primary" id="saveClient">Salvar Cliente</button>
            </div>
        </div>
    </div>

    <!-- Client Details Modal -->
    <div class="modal" id="clientDetailsModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detalhes do Cliente</h3>
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
                    Editar
                </button>
                <button class="btn btn-danger" id="deleteClient">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div id="toast" class="toast"></div>

    <script src="clients.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>
