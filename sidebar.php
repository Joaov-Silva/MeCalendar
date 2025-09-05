<?php
// sidebar.php
// Este arquivo é incluído em todas as páginas do dashboard.
// Assume que $currentUser está disponível no escopo de inclusão.
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <a href="index.php" class="logo">
            <div class="logo-icon"><i class="fas fa-calendar"></i></div>
            <span class="logo-text">MeCalendar</span>
        </a>
    </div>
    
    <nav class="sidebar-nav">
        <ul class="nav-list">
            <li class="nav-item">
                <a href="calendar.php" class="nav-link <?php echo (basename($_SERVER['PHP_SELF']) == 'calendar.php') ? 'active' : ''; ?>">
                    <i class="fas fa-calendar-alt"></i>
                    <span data-translate="calendar">Calendário</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="servicos.php" class="nav-link <?php echo (basename($_SERVER['PHP_SELF']) == 'servicos.php') ? 'active' : ''; ?>">
                    <i class="fas fa-clipboard-list"></i>
                    <span data-translate="services">Serviços</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="cliente.php" class="nav-link <?php echo (basename($_SERVER['PHP_SELF']) == 'cliente.php') ? 'active' : ''; ?>">
                    <i class="fas fa-users"></i>
                    <span data-translate="clients">Clientes</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="relatorios.php" class="nav-link <?php echo (basename($_SERVER['PHP_SELF']) == 'relatorios.php') ? 'active' : ''; ?>">
                    <i class="fas fa-chart-bar"></i>
                    <span data-translate="reports">Relatórios</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="configuracoes.php" class="nav-link <?php echo (basename($_SERVER['PHP_SELF']) == 'configuracoes.php') ? 'active' : ''; ?>">
                    <i class="fas fa-cog"></i>
                    <span data-translate="settings">Configurações</span>
                </a>
            </li>
        </ul>
    </nav>

    <!-- Botão Dark Mode -->
    <div class="dark-mode-section">
        <button class="dark-mode-btn" id="darkModeBtn" title="Alternar modo escuro">
            <i class="fas fa-moon" id="darkModeIcon"></i>
            <span data-translate="dark_mode">Modo Escuro</span>
        </button>
    </div>

    <div class="sidebar-footer">
        <div class="user-info">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-details">
                <span class="user-name"><?= htmlspecialchars($currentUser['nome']); ?></span>
                <span class="user-role" data-translate="owner">Proprietário</span>
            </div>
        </div>
    </div>
</aside>
