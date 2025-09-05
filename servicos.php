<?php
require_once 'config.php';
require_once 'auth_check.php';

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
    <title>MeCalendar - Serviços</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="dark-mode.js"></script>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <?php include_once 'sidebar.php'; // Inclui a sidebar para evitar duplicação ?>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Header -->
            <header class="main-header">
                <div class="header-left">
                    <h1 class="page-title" data-translate="services">Serviços</h1>
                    <p class="page-subtitle" data-translate="manage_active_appointments">Gerencie seus agendamentos ativos</p>
                </div>
                <div class="header-right">
                    <!-- Futuro botão para adicionar novo serviço ou filtro -->
                </div>
            </header>

            <!-- Services Table/Grid -->
            <div class="services-container">
                <div class="table-simple-responsive">
                    <table class="table-simple">
                        <thead>
                            <tr>
                                <th data-translate="client_name">Cliente</th>
                                <th data-translate="service_type">Serviço</th>
                                <th data-translate="date">Data</th>
                                <th data-translate="time">Horário</th>
                                <th data-translate="status">Status</th>
                                <th data-translate="actions">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="servicesTableBody">
                            <!-- Appointments will be populated dynamically by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <?php include_once 'modal_edit_appointment.php'; // Modal de edição de agendamento, se necessário ?>

    <script>
        window.CURRENT_USER_ID = <?php echo json_encode($currentUser['id_usuario']); ?>;
    </script>
    <script src="translations.js"></script>
    <script src="services.js"></script>
</body>
</html>
