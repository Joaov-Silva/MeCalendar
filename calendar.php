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
    <title>MeCalendar - Calendário</title>
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
            <!-- Header -->
            <header class="main-header">
                <div class="header-left">
                    <h1 class="page-title" data-translate="calendar">Calendário</h1>
                    <p class="page-subtitle" data-translate="manage_appointments">Gerencie seus agendamentos</p>
                </div>
                <div class="header-right">
                    <button class="btn btn-secondary" id="newEventBtn">
                        <i class="fas fa-plus"></i>
                        <span data-translate="new_appointment">Novo Agendamento</span>
                    </button>
                    <button class="btn btn-primary" id="exportCalendarBtn">
                        <i class="fas fa-download"></i>
                        <span data-translate="export">Exportar</span>
                    </button>
                </div>
            </header>

            <!-- Calendar Container -->
            <div class="calendar-container">
                <!-- Calendar Header -->
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="nav-btn" id="prevMonth">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h2 class="current-month" id="currentMonth">Janeiro 2025</h2>
                        <button class="nav-btn" id="nextMonth">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <!-- Calendar Grid -->
                <div class="calendar-grid">
                    <div class="calendar-weekdays">
                        <div class="weekday" data-translate="sun">Dom</div>
                        <div class="weekday" data-translate="mon">Seg</div>
                        <div class="weekday" data-translate="tue">Ter</div>
                        <div class="weekday" data-translate="wed">Qua</div>
                        <div class="weekday" data-translate="thu">Qui</div>
                        <div class="weekday" data-translate="fri">Sex</div>
                        <div class="weekday" data-translate="sat">Sáb</div>
                    </div>
                    <div class="calendar-days" id="calendarDays">
                        <!-- Days will be populated by JavaScript -->
                    </div>
                </div>
            </div>

            <!-- Event Details Panel -->
            <div class="event-panel" id="eventPanel">
                <div class="panel-header">
                    <h3>Detalhes do Agendamento</h3>
                    <button class="close-btn" id="closePanel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="panel-content">
                    <div class="event-info">
                        <div class="info-item">
                            <label>Cliente:</label>
                            <span id="eventClient">-</span>
                        </div>
                        <div class="info-item">
                            <label>Telefone:</label>
                            <span id="eventPhone">-</span>
                        </div>
                        <div class="info-item">
                            <label>Tipo de Serviço:</label>
                            <span id="eventServiceType">-</span>
                        </div>
                        <div class="info-item">
                            <label>Descrição do Serviço:</label>
                            <span id="eventServiceDescription">-</span>
                        </div>
                        <div class="info-item">
                            <label>Data:</label>
                            <span id="eventDate">-</span>
                        </div>
                        <div class="info-item">
                            <label>Horário:</label>
                            <span id="eventTime">-</span>
                        </div>
                        <div class="info-item">
                            <label>Valor:</label>
                            <span id="eventValue">-</span>
                        </div>
                        <div class="info-item">
                            <label>Status:</label>
                            <span class="status-badge confirmed" id="eventStatus">Confirmado</span>
                        </div>
                        <div class="info-item">
                            <label>Observações:</label>
                            <span id="eventNotes">-</span>
                        </div>
                    </div>
                    <div class="event-actions">
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- New Event Modal -->
    <div class="modal" id="newEventModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 data-translate="new_appointment">Novo Agendamento</h3>
                <button class="close-btn" id="closeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="newEventForm">
                    <div class="form-group">
                        <label for="clientName" data-translate="client_name">Nome do Cliente *</label>
                        <select id="clientName" name="clientName" required>
                            <option value="" disabled selected data-translate="select_client">Selecione um cliente</option>
                            <option value="new_client" data-translate="add_new_client">Adicionar Novo Cliente...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="clientPhone" data-translate="client_phone">Telefone *</label>
                        <input type="tel" id="clientPhone" name="clientPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="clientEmail" data-translate="client_email">Email (opcional)</label>
                        <input type="email" id="clientEmail" name="clientEmail">
                    </div>
                    <div class="form-group">
                        <label for="serviceType" data-translate="service_type">Tipo de Serviço *</label>
                        <input type="text" id="serviceType" name="serviceType" data-translate-placeholder="service_type_placeholder" placeholder="Ex: Corte de cabelo, Manicure, Consulta, etc." required>
                    </div>
                    <div class="form-group">
                        <label for="serviceDescription" data-translate="service_description">Descrição Detalhada do Serviço</label>
                        <textarea id="serviceDescription" name="serviceDescription" rows="3" data-translate-placeholder="service_description_placeholder" placeholder="Descreva detalhadamente o que será realizado..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="eventDate" data-translate="date">Data *</label>
                            <input type="date" id="eventDate" name="eventDate" required>
                        </div>
                        <div class="form-group">
                            <label for="eventTime" data-translate="time">Horário *</label>
                            <input type="time" id="eventTime" name="eventTime" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="eventDuration" data-translate="duration">Duração Estimada (minutos)</label>
                            <input type="number" id="eventDuration" name="eventDuration" min="15" step="15" value="60">
                        </div>
                        <div class="form-group">
                            <label for="eventValue" data-translate="service_value">Valor do Serviço (R$)</label>
                            <input type="number" id="eventValue" name="eventValue" min="0" step="0.01" placeholder="0.00">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="eventNotes" data-translate="additional_notes">Observações Adicionais</label>
                        <textarea id="eventNotes" name="eventNotes" rows="3" data-translate-placeholder="additional_notes_placeholder" placeholder="Informações extras, preferências do cliente, etc."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="eventStatus" data-translate="initial_status">Status Inicial</label>
                        <select id="eventStatus" name="eventStatus">
                            <option value="agendado" data-translate="scheduled">Agendado</option>
                            <option value="confirmado" data-translate="confirmed">Confirmado</option>
                            <option value="pendente" data-translate="pending">Pendente</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelEvent" data-translate="cancel">Cancelar</button>
                <button class="btn btn-primary" id="saveEvent" data-translate="save_appointment">Salvar Agendamento</button>
            </div>
        </div>
    </div>

    <script>
        window.CURRENT_USER_ID = <?php echo json_encode($currentUser['id_usuario']); ?>;
    </script>
    <script src="translations.js"></script>
    <script src="calendar.js"></script>
    
    <!-- Inclui o sistema de formatação automática -->
    <script src="formatters.js"></script>

    <!-- Fixes específicos desta página: clique para expandir, validação e deletar -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Delegação para deletar (cobre clique no ícone dentro do botão)
            document.addEventListener('click', function (e) {
                var deleteBtn = e.target.closest('.delete-event');
                if (deleteBtn) {
                    var eventId = parseInt(deleteBtn.dataset.eventId);
                    if (!isNaN(eventId) && window.calendar) {
                        calendar.deleteEvent(eventId);
                    }
                    return;
                }
            });

            // Delegação para abrir painel ao clicar no agendamento, sem conflitar com deletar
            document.addEventListener('click', function (e) {
                // Evitar abrir painel quando clicar no botão de deletar
                if (e.target.closest('.delete-event')) return;

                var eventItem = e.target.closest('.event-item');
                if (eventItem && window.calendar) {
                    var eventId = parseInt(eventItem.dataset.eventId);
                    if (!isNaN(eventId)) {
                        var ev = (calendar.events || []).find(function (x) { return x.id === eventId; });
                        if (ev) {
                            calendar.showEventPanel(ev);
                        }
                    }
                }
            });

            // Impedir submit nativo do form (Enter) e reforçar validação manual
            var form = document.getElementById('newEventForm');
            if (form) {
                form.addEventListener('submit', function (ev) { ev.preventDefault(); });
            }
        });
    </script>
</body>
</html>
