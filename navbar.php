<?php
require_once 'auth_check.php';
$currentUser = getCurrentUser();

// Verifica se estamos na página de login ou cadastro para não mostrar o dropdown
$isAuthPage = in_array(basename($_SERVER['PHP_SELF']), ['login.php', 'cadastro.php']);
?>

<header class="header">
    <div class="container">
        <div class="header-content">
            <a href="index.php" class="logo" style="text-decoration: none; color: inherit;">
                <div class="logo-icon"><i class="fas fa-calendar"></i></div>
                <span class="logo-text">MeCalendar</span>
            </a>
            
            <nav class="nav">
                <a href="index.php" class="nav-link">Início</a>
                <a href="calendar.php" class="nav-link">Calendário</a>
                
                <!-- Botão Dark Mode - sempre visível -->
                <button class="dark-mode-btn" id="darkModeBtn" title="Alternar modo escuro">
                    <i class="fas fa-moon" id="darkModeIcon"></i>
                </button>
                
                <?php if (isLoggedIn() && !$isAuthPage): ?>
                    <!-- Menu do usuário logado -->
                    <div class="user-menu">
                        <button class="user-menu-btn" onclick="toggleUserMenu()">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <span class="user-name"><?php echo htmlspecialchars($currentUser['nome']); ?></span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        
                        <div class="user-dropdown" id="userDropdown">
                            <div class="dropdown-header">
                                <div class="user-info">
                                    <div class="user-avatar-large">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <div class="user-name-large"><?php echo htmlspecialchars($currentUser['nome']); ?></div>
                                        <div class="user-email"><?php echo htmlspecialchars($currentUser['email']); ?></div>
                                        <div class="user-type">Proprietário</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dropdown-menu">
                                <a href="calendar.php" class="dropdown-item">
                                    <i class="fas fa-calendar-check"></i>
                                    Meus Agendamentos
                                </a>
                                <a href="relatorios.php" class="dropdown-item">
                                    <i class="fas fa-chart-line"></i>
                                    Relatórios
                                </a>
                                <div class="dropdown-divider"></div>
                                <a href="logout.php" class="dropdown-item text-danger">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Sair
                                </a>
                            </div>
                        </div>
                    </div>
                <?php elseif (!isLoggedIn()): ?>
                    <a href="login.php" class="btn btn-outline btn-sm">Entrar</a>
                    <a href="cadastro.php" class="btn btn-primary btn-sm">Criar conta</a>
                <?php endif; ?>
            </nav>
            
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </div>
</header>

<style>
/* Botão Dark Mode */
.dark-mode-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;
    margin-right: 1rem;
}

.dark-mode-btn:hover {
    background: #e5e7eb;
    color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark-mode-btn:active {
    transform: translateY(0);
}

.dark-mode-btn i {
    font-size: 1rem;
}

/* Dark mode styles */
body.dark-mode {
    background-color: #111827;
    color: #f9fafb;
}

body.dark-mode .header {
    background: rgba(17, 24, 39, 0.9);
    border-bottom-color: #374151;
}

body.dark-mode .logo-text {
    color: #f9fafb;
}

body.dark-mode .nav-link {
    color: #d1d5db;
}

body.dark-mode .nav-link:hover {
    color: #f9fafb;
}

body.dark-mode .dark-mode-btn {
    background: #374151;
    border-color: #4b5563;
    color: #fbbf24;
}

body.dark-mode .dark-mode-btn:hover {
    background: #4b5563;
    color: #f59e0b;
}

body.dark-mode .user-menu-btn {
    color: #d1d5db;
}

body.dark-mode .user-menu-btn:hover {
    background: #374151;
}

body.dark-mode .user-name {
    color: #d1d5db;
}

body.dark-mode .user-dropdown {
    background: #1f2937;
    border-color: #374151;
}

body.dark-mode .dropdown-header {
    border-bottom-color: #374151;
}

body.dark-mode .user-name-large {
    color: #f9fafb;
}

body.dark-mode .user-email {
    color: #9ca3af;
}

body.dark-mode .dropdown-item {
    color: #d1d5db;
}

body.dark-mode .dropdown-item:hover {
    background: #374151;
    color: #f9fafb;
}

body.dark-mode .dropdown-item.text-danger:hover {
    background: #7f1d1d;
    color: #fca5a5;
}

.user-menu {
    position: relative;
}

.user-menu-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #374151;
}

.user-menu-btn:hover {
    background: #f3f4f6;
}

.user-avatar {
    width: 2rem;
    height: 2rem;
    background: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.875rem;
}

.user-name {
    font-weight: 500;
    color: #374151;
}

.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 280px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0,0,0,.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s;
    z-index: 1000;
}

.user-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-header {
    padding: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-avatar-large {
    width: 3rem;
    height: 3rem;
    background: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.user-name-large {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
}

.user-email {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.user-type {
    color: #059669;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    background: #d1fae5;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    display: inline-block;
}

.dropdown-menu {
    padding: 0.5rem;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #374151;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background: #f3f4f6;
    color: #111827;
}

.dropdown-item.text-danger {
    color: #dc2626;
}

.dropdown-item.text-danger:hover {
    background: #fef2f2;
    color: #b91c1c;
}

.dropdown-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.5rem 0;
}

@media (max-width: 768px) {
    .user-name {
        display: none;
    }
    
    .user-dropdown {
        right: -1rem;
        width: 260px;
    }
    
    .dark-mode-btn {
        width: 2.25rem;
        height: 2.25rem;
        margin-right: 0.5rem;
    }
    
    .dark-mode-btn i {
        font-size: 0.875rem;
    }
}
</style>

<script>
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Fecha o menu quando clicar fora
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Fecha o menu ao pressionar ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.remove('show');
    }
});
</script>

<!-- Inclui o gerenciador de dark mode -->
<script src="dark-mode.js"></script>
