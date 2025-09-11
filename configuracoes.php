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
	<title>MeCalendar - Configurações</title>
	<link rel="stylesheet" href="styles.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<script src="dark-mode.js"></script>
</head>
<body>
	<div class="app-container">
		<!-- Sidebar -->
		<?php include_once 'sidebar.php'; // Inclui a sidebar ?>

		<!-- Main -->
		<main class="main-content">
			<header class="main-header">
				<div class="header-left">
					<h1 class="page-title" data-translate="settings">Configurações</h1>
					<p class="page-subtitle" data-translate="customize_experience">Personalize sua experiência e preferências do sistema</p>
				</div>
			</header>

			<section class="settings-grid">
				<div class="settings-card">
					<h3 data-translate="general_preferences">Preferências Gerais</h3>
					<div class="form-group">
						<label for="languageSelect" data-translate="system_language">Idioma do sistema</label>
						<select id="languageSelect">
							<option value="pt-BR" data-translate="portuguese_brazil">Português (Brasil)</option>
							<option value="en" data-translate="english">English</option>
						</select>
					</div>
					<div class="form-group">
						<label for="timezoneSelect" data-translate="timezone">Fuso horário</label>
						<select id="timezoneSelect">
							<option value="America/Sao_Paulo" data-translate="brasilia">GMT-3 (Brasília)</option>
							<option value="America/Manaus" data-translate="manaus">GMT-4 (Manaus)</option>
						</select>
					</div>
				</div>

				<div class="settings-card">
					<h3 data-translate="appearance">Aparência</h3>
					<div class="form-group">
						<label for="themeSelect" data-translate="theme">Tema</label>
						<select id="themeSelect">
							<option value="light" data-translate="light">Claro</option>
							<option value="dark" data-translate="dark">Escuro</option>
						</select>
					</div>
					<div class="form-group">
						<label for="fontSizeSelect" data-translate="font_size">Tamanho da fonte</label>
						<select id="fontSizeSelect">
							<option value="default" data-translate="default">Padrão</option>
							<option value="large" data-translate="large">Grande</option>
						</select>
					</div>
				</div>

				<div class="settings-card">
					<h3 data-translate="account">Conta</h3>
					<div class="form-group">
						<label for="nameInput" data-translate="name">Nome</label>
						<input type="text" id="nameInput" value="<?= htmlspecialchars($currentUser['nome']); ?>">
					</div>
					<div class="form-group">
						<label for="emailInput" data-translate="email">Email</label>
						<input type="email" id="emailInput" value="<?= htmlspecialchars($currentUser['email']); ?>">
					</div>
					<div class="form-group">
						<button class="btn btn-primary" id="saveAccountBtn" data-translate="save_changes">Salvar alterações</button>
					</div>
				</div>
			</section>
		</main>
	</div>

	<script src="translations.js"></script>
	<script src="calendar.js"></script>
	<script src="settings.js"></script>
</body>
</html>
