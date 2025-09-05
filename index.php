<?php
require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeCalendar - Organize sua agenda</title>
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
                <div class="badge" data-translate="new_feature">
                    ✨ Novo: Sistema de lembretes automáticos
                </div>
                <h1 class="hero-title">
                    <span data-translate="organize_schedule">Organize sua agenda</span>
                    <span class="hero-title-highlight" data-translate="with_ease">com facilidade</span>
                </h1>
                <p class="hero-description" data-translate="hero_description">
                    Sistema completo para organizar horários, agendamentos e clientes de forma simples e eficiente.
                    Ideal para profissionais autônomos e pequenos estabelecimentos.
                </p>
                <div class="hero-buttons">
                    <?php if (!isLoggedIn()): ?>
                        <a href="cadastro.php" class="btn btn-primary btn-lg">
                            <span data-translate="create_account">Criar Conta</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <a href="calendar.php" class="btn btn-outline btn-lg">
                            <span data-translate="view_demo">Ver Demonstração</span>
                        </a>
                    <?php else: ?>
                        <a href="calendar.php" class="btn btn-primary btn-lg">
                            <span data-translate="access_dashboard">Acessar Dashboard</span>
                            <i class="fas fa-chart-line"></i>
                        </a>
                        <a href="calendar.php" class="btn btn-outline btn-lg">
                            <span data-translate="view_calendar">Ver Calendário</span>
                        </a>
                    <?php endif; ?>
                </div>
                <div class="hero-features">
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span data-translate="easy_to_use">Fácil de usar</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span data-translate="intuitive_interface">Interface intuitiva</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check"></i>
                        <span data-translate="fully_functional">Totalmente funcional</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title" data-translate="main_features">Recursos principais do MeCalendar</h2>
                <p class="section-description" data-translate="features_description">
                    Funcionalidades desenvolvidas para facilitar a gestão de agendamentos e horários no MeCalendar
                </p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon bg-blue">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <h3 class="feature-title" data-translate="smart_calendar">Calendário Inteligente</h3>
                    <p class="feature-description" data-translate="smart_calendar_description">
                        Visualize todos os seus agendamentos em um calendário intuitivo. Organize horários, bloqueie períodos
                        e evite conflitos.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-green">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="feature-title" data-translate="client_management">Gestão de Clientes</h3>
                    <p class="feature-description" data-translate="client_management_description">
                        Sistema completo para cadastrar e gerenciar informações dos seus clientes de forma organizada.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-purple">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h3 class="feature-title" data-translate="appointment_creation">Criação de Agendamentos</h3>
                    <p class="feature-description" data-translate="appointment_creation_description">
                        Crie e gerencie agendamentos para seus clientes de forma rápida e eficiente.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-orange">
                        <i class="fas fa-bell"></i>
                    </div>
                    <h3 class="feature-title" data-translate="notification_system">Sistema de Notificações</h3>
                    <p class="feature-description" data-translate="notification_system_description">
                        Lembretes automáticos para não esquecer seus compromissos e agendamentos.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-red">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="feature-title" data-translate="security">Segurança</h3>
                    <p class="feature-description" data-translate="security_description">
                        Sistema seguro com autenticação por token, senhas criptografadas e controle de sessão.
                    </p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon bg-teal">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3 class="feature-title" data-translate="responsive">Responsivo</h3>
                    <p class="feature-description" data-translate="responsive_description">
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
                <h2 class="cta-title" data-translate="start_using_today">Comece a usar hoje mesmo</h2>
                <p class="cta-description" data-translate="cta_description">
                    Experimente todas as funcionalidades do MeCalendar
                </p>
                <div class="cta-buttons">
                    <?php if (!isLoggedIn()): ?>
                        <a href="cadastro.php" class="btn btn-primary btn-lg" data-translate="create_account">Criar Conta</a>
                        <a href="login.php" class="btn btn-outline btn-lg" data-translate="login">Fazer Login</a>
                    <?php else: ?>
                        <a href="calendar.php" class="btn btn-primary btn-lg" data-translate="access_calendar">Acessar Calendário</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <?php include 'footer.php'; ?>

    <script src="translations.js"></script>
    <script src="script.js"></script>
    
    <!-- Inclui o gerenciador de dark mode -->
    <script src="dark-mode.js"></script>
</body>
</html>

<style>
/* General improvements */

</style>
