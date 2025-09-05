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
	<title>MeCalendar - Relatórios</title>
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
					<span class="logo-text">MeCalendar</span>
				</a>
			</div>
			<nav class="sidebar-nav">
				<ul class="nav-list">
					<li class="nav-item"><a href="calendar.php" class="nav-link"><i class="fas fa-calendar-alt"></i><span data-translate="calendar">Calendário</span></a></li>
					<li class="nav-item"><a href="cliente.php" class="nav-link"><i class="fas fa-users"></i><span data-translate="clients">Clientes</span></a></li>
					<li class="nav-item"><a href="relatorios.php" class="nav-link active"><i class="fas fa-chart-bar"></i><span data-translate="reports">Relatórios</span></a></li>
					<li class="nav-item"><a href="configuracoes.php" class="nav-link"><i class="fas fa-cog"></i><span data-translate="settings">Configurações</span></a></li>
				</ul>
			</nav>
			<div class="dark-mode-section">
				<button class="dark-mode-btn" id="darkModeBtn" title="Alternar modo escuro">
					<i class="fas fa-moon" id="darkModeIcon"></i>
					<span data-translate="dark_mode">Modo Escuro</span>
				</button>
			</div>
			<div class="sidebar-footer">
				<div class="user-info">
					<div class="user-avatar"><i class="fas fa-user"></i></div>
					<div class="user-details">
						<span class="user-name" data-user-id="<?= htmlspecialchars($currentUser['id_usuario']); ?>"><?= htmlspecialchars($currentUser['nome']); ?></span>
						<span class="user-role" data-translate="owner">Proprietário</span>
					</div>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="main-content">
			<header class="main-header">
				<div class="header-left">
					<h1 class="page-title" data-translate="reports">Relatórios</h1>
					<p class="page-subtitle" data-translate="track_metrics">Acompanhe métricas e desempenho dos atendimentos</p>
				</div>
				<div class="header-right">
					<button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> <span data-translate="print">Imprimir</span></button>
				</div>
			</header>

			<!-- KPIs -->
			<section class="reports-kpis">
				<div class="kpi-card">
					<div class="kpi-value" id="kpiAtendimentos">0</div>
					<div class="kpi-label" data-translate="appointments_this_month">Atendimentos no mês</div>
				</div>
				<div class="kpi-card">
					<div class="kpi-value" id="kpiReceita">R$ 0,00</div>
					<div class="kpi-label" data-translate="estimated_revenue">Receita estimada</div>
				</div>
				<div class="kpi-card">
					<div class="kpi-value" id="kpiCancelados">0</div>
					<div class="kpi-label" data-translate="cancellations">Cancelamentos</div>
				</div>
				<div class="kpi-card">
					<div class="kpi-value" id="kpiTaxaConfirmacao">0%</div>
					<div class="kpi-label" data-translate="confirmation_rate">Taxa de confirmação</div>
				</div>
			</section>

			<!-- Tabela simples -->
			<section class="reports-table">
				<h3 style="margin-bottom: .75rem;" data-translate="recent_appointments">Últimos atendimentos</h3>
				<div style="overflow-x:auto;">
					<table class="table-simple">
						<thead>
							<tr>
								<th data-translate="date">Data</th>
								<th data-translate="client">Cliente</th>
								<th data-translate="service_type">Serviço</th>
								<th data-translate="value">Valor</th>
								<th data-translate="status">Status</th>
							</tr>
						</thead>
						<tbody id="reportsBody">
							<tr><td colspan="5" style="text-align:center; padding:1rem;" data-translate="no_data_yet">Sem dados ainda.</td></tr>
						</tbody>
					</table>
				</div>
			</section>
		</main>
	</div>

	<script>
		window.CURRENT_USER_ID = <?php echo json_encode($currentUser['id_usuario']); ?>;
	</script>
	<script src="translations.js"></script>
	<script>
		// Funções utilitárias de formatação
		function formatDateForDisplay(dateString) {
			const [year, month, day] = dateString.split('-').map(Number);
			const date = new Date(year, month - 1, day);
			const d = String(date.getDate()).padStart(2, '0');
			const m = String(date.getMonth() + 1).padStart(2, '0');
			const y = date.getFullYear();
			return `${d}/${m}/${y}`;
		}

		function formatCurrency(value) {
			return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
		}

		async function loadReportsData() {
			const currentUserId = window.CURRENT_USER_ID; // Assumindo que CURRENT_USER_ID é global ou de algum modo acessível
			if (!currentUserId) {
				console.error("ID do usuário não disponível para carregar relatórios.");
				document.getElementById('reportsBody').innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">Erro ao carregar dados do usuário.</td></tr>';
				return;
			}

			try {
				const resp = await fetch('agendamentos_api.php', { credentials: 'same-origin' });
				if (!resp.ok) throw new Error('Falha ao carregar agendamentos para relatórios.');
				const data = await resp.json();

				if (data && data.success && data.data) {
					const allAppointments = data.data;
					const today = new Date();
					const currentMonth = today.getMonth();
					const currentYear = today.getFullYear();

					let totalAppointmentsMonth = 0;
					let totalRevenueMonth = 0;
					let cancelledAppointmentsMonth = 0;
					let confirmedAppointmentsMonth = 0;

					const recentAppointments = [];

					allAppointments.forEach(app => {
						const appDate = new Date(app.date);
						const appMonth = appDate.getMonth();
						const appYear = appDate.getFullYear();

						// Calcular KPIs para o mês atual
						if (appMonth === currentMonth && appYear === currentYear) {
							totalAppointmentsMonth++;
							// Normalize o status para cálculo
							const normalizedStatus = app.status ? app.status.toLowerCase() : '';
							if (normalizedStatus === 'confirmed' || normalizedStatus === 'realizado') {
								confirmedAppointmentsMonth++;
								totalRevenueMonth += parseFloat(app.value || 0);
							} else if (normalizedStatus === 'cancelled') {
								cancelledAppointmentsMonth++;
							}
						}

						// Coletar para a tabela de últimos atendimentos (ex: últimos 10)
						recentAppointments.push(app);
					});

					// Ordenar agendamentos recentes por data e hora (mais recentes primeiro)
					recentAppointments.sort((a, b) => {
						const dateA = new Date(`${a.date}T${a.time}`);
						const dateB = new Date(`${b.date}T${b.time}`);
						return dateB - dateA;
					});

					// Atualizar KPIs na tela
					document.getElementById('kpiAtendimentos').textContent = totalAppointmentsMonth;
					document.getElementById('kpiReceita').textContent = formatCurrency(totalRevenueMonth);
					document.getElementById('kpiCancelados').textContent = cancelledAppointmentsMonth;

					const confirmationRate = totalAppointmentsMonth > 0 
						? ((confirmedAppointmentsMonth / totalAppointmentsMonth) * 100).toFixed(0) 
						: 0;
					document.getElementById('kpiTaxaConfirmacao').textContent = `${confirmationRate}%`;

					// Preencher tabela de últimos atendimentos
					const reportsBody = document.getElementById('reportsBody');
					reportsBody.innerHTML = ''; // Limpa o conteúdo atual

					if (recentAppointments.length > 0) {
						recentAppointments.slice(0, 10).forEach(app => { // Exibe os 10 mais recentes
							const row = reportsBody.insertRow();
							const statusText = app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pendente'; // Capitaliza o status
							row.innerHTML = `
								<td>${formatDateForDisplay(app.date)}</td>
								<td>${app.client}</td>
								<td>${app.service_type || 'Não informado'}</td>
								<td>${formatCurrency(app.value || 0)}</td>
								<td><span class="status-badge ${app.status}">${statusText}</span></td>
							`;
						});
					} else {
						reportsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;" data-translate="no_data_yet">Sem dados ainda.</td></tr>';
					}

				} else {
					document.getElementById('reportsBody').innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">Nenhum agendamento encontrado.</td></tr>';
				}
			} catch (e) {
				console.error("Erro ao carregar dados de relatório:", e);
				document.getElementById('reportsBody').innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1rem;">Erro: ${e.message}</td></tr>`;
			}
		}

		// Carregar dados quando o DOM estiver pronto
		document.addEventListener('DOMContentLoaded', () => {
			// Captura o ID do usuário logado do elemento HTML
			// Isso é apenas um fallback se window.CURRENT_USER_ID não estiver definido
			// Idealmente, CURRENT_USER_ID viria do PHP de forma mais direta e segura
			const userIdElement = document.querySelector('.user-info .user-name');
			if (userIdElement && userIdElement.dataset.userId) {
				window.CURRENT_USER_ID = userIdElement.dataset.userId;
			}

			loadReportsData();
		});
	</script>
</body>
</html>



