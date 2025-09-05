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
	<title>Sistema de Agendamento - Relatórios</title>
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
						<span class="user-name"><?= htmlspecialchars($currentUser['nome']); ?></span>
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

	<script src="translations.js"></script>
	<script>
	// Mock: preencher KPIs com dados básicos
	document.addEventListener('DOMContentLoaded', () => {
		document.getElementById('kpiAtendimentos').textContent = '24';
		document.getElementById('kpiReceita').textContent = 'R$ 2.380,00';
		document.getElementById('kpiCancelados').textContent = '3';
		document.getElementById('kpiTaxaConfirmacao').textContent = '87%';
	});
	</script>
</body>
</html>



