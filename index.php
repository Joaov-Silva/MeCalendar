<?php
require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Agendamento - Organize sua agenda</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php 
    // Inicia a sessão para o index.php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    include 'navbar.php'; 
    ?>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="badge">
                    ✨ Novo: Sistema de lembretes automáticos
                </div>
                <h1 class="hero-title">
                    Organize sua agenda
                    <span class="hero-title-highlight">com facilidade</span>
                </h1>
                <p class="hero-description">
                    Sistema completo para organizar horários, agendamentos e clientes de forma simples e eficiente.
                    Ideal para profissionais autônomos e pequenos estabelecimentos.
                </p>
                <div class="hero-buttons">
                    <?php if (!isLoggedIn()): ?>
                        <a href="cadastro.php" class="btn btn-primary btn-lg">D
                            Criar Conta
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <a href="calendar.php" class="btn btn-outline btn-lg">
                            Ver Demonstração
                        </a>
                    <?php else: ?>
                        <?php if (isCliente()): ?>
                            <a href="buscar_servicos.php" class="btn btn-primary btn-lg">
                                Buscar Serviços
                                <i class="fas fa-search"></i>
                            </a>
                        <?php else: ?>
                            <a href="dashboard.js" class="btn btn-primary btn-lg">
                                Acessar Dashboard
                                <i class="fas fa-chart-line"></i>
                            </a>
                        <?php endif; ?>
                        <a href="calendar.php" class="btn btn-outline btn-lg">
                            Ver Calendário
                        </a>
                    <?php endif; ?>
                </div>
                <div class="hero-features">
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span>Fácil de usar</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span>Interface intuitiva</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span>Totalmente funcional</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Recursos principais do sistema</h2>
                <p class="section-description">
                    Funcionalidades desenvolvidas para facilitar a gestão de agendamentos e horários
                </p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon bg-blue">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <h3 class="feature-title">Calendário Inteligente</h3>
                    <p class="feature-description">
                        Visualize todos os seus agendamentos em um calendário intuitivo. Organize horários, bloqueie períodos
                        e evite conflitos.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-green">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="feature-title">Gestão de Usuários</h3>
                    <p class="feature-description">
                        Sistema completo de cadastro e autenticação com diferentes tipos de usuário (cliente e profissional).
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-purple">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="feature-title">Busca de Serviços</h3>
                    <p class="feature-description">
                        Encontre e agende serviços facilmente com sistema de busca e filtros por categoria.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-orange">
                        <i class="fas fa-bell"></i>
                    </div>
                    <h3 class="feature-title">Sistema de Notificações</h3>
                    <p class="feature-description">
                        Lembretes automáticos para não esquecer seus compromissos e agendamentos.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-red">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="feature-title">Segurança</h3>
                    <p class="feature-description">
                        Sistema seguro com autenticação por token, senhas criptografadas e controle de sessão.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-teal">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3 class="feature-title">Responsivo</h3>
                    <p class="feature-description">
                        Interface adaptável para todos os dispositivos, desde smartphones até desktops.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="container">
            <div class="cta-content">
                <h2 class="cta-title">Comece a usar hoje mesmo</h2>
                <p class="cta-description">
                    Experimente todas as funcionalidades do sistema de agendamento
                </p>
                <div class="cta-buttons">
                    <?php if (!isLoggedIn()): ?>
                        <a href="cadastro.php" class="btn btn-primary btn-lg">Criar Conta</a>
                        <a href="login.php" class="btn btn-outline btn-lg">Fazer Login</a>
                    <?php else: ?>
                        <a href="calendar.php" class="btn btn-primary btn-lg">Acessar Calendário</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <?php include 'footer.php'; ?>

    <script src="script.js"></script>
    
    <!-- Inclui o gerenciador de dark mode -->
    <script src="dark-mode.js"></script>
</body>
</html>
