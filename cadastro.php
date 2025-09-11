<?php
require_once 'config.php';

$erro = '';
$sucesso = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$nome = trim($_POST['nome'] ?? '');
	$email = trim($_POST['email'] ?? '');
	$senha = $_POST['senha'] ?? '';
	$confirmar = $_POST['confirmar'] ?? '';
	$cpf = preg_replace('/[^0-9]/', '', $_POST['cpf'] ?? '');
	$telefone = trim($_POST['telefone'] ?? '');
	if ($nome === '' || $email === '' || $senha === '' || $confirmar === '' || $cpf === '') {
		$erro = 'Preencha todos os campos obrigatórios.';
	} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$erro = 'Email inválido.';
	} elseif (strlen($senha) < 6) {
		$erro = 'A senha deve ter pelo menos 6 caracteres.';
	} elseif ($senha !== $confirmar) {
		$erro = 'As senhas não coincidem.';
	} elseif (strlen($cpf) !== 11) {
		$erro = 'CPF inválido.';
	} else {
		try {
			// Verifica duplicidade de email
			$stmt = $pdo->prepare('SELECT 1 FROM usuario WHERE email = ?');
			$stmt->execute([$email]);
			if ($stmt->fetch()) {
				$erro = 'Já existe uma conta com este email.';
			} else {
				// Verifica duplicidade de CPF
				$stmt = $pdo->prepare('SELECT 1 FROM usuario WHERE cpf = ?');
				$stmt->execute([$cpf]);
				if ($stmt->fetch()) {
					$erro = 'CPF já cadastrado.';
				} else {
					$hash = password_hash($senha, PASSWORD_DEFAULT);

					// Insere o usuário (apenas proprietários)
					$stmt = $pdo->prepare('INSERT INTO usuario (nome, email, senha, cpf, telefone) VALUES (?, ?, ?, ?, ?)');
					$stmt->execute([$nome, $email, $hash, $cpf, $telefone]);

					$sucesso = 'Conta criada com sucesso! Você será redirecionado para o login.';
					header('refresh:2;url=login.php');
				}
			}
		} catch (PDOException $e) {
			$erro = 'Erro ao cadastrar: ' . $e->getMessage();
		}
	}
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MeCalendar - Cadastro</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="styles.css">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
	<!-- Inclui o gerenciador de dark mode -->
	<script src="dark-mode.js"></script>
</head>
<body>
	<div class="auth-wrapper">
		<?php 
		// Inicia a sessão para o cadastro.php
		if (session_status() === PHP_SESSION_NONE) {
			session_start();
		}
		include 'navbar.php'; 
		?>

		<main class="auth-main d-flex align-items-center justify-content-center min-vh-100">
			<div class="auth-card cadastro">
				<div class="auth-header">
					<div class="logo-icon"><i class="fas fa-calendar"></i></div>
					<div class="auth-title">Criar conta</div>
					<p class="auth-subtitle">Preencha seus dados para criar sua conta de proprietário.</p>
				</div>

				<?php if ($erro): ?>
					<div class="error"><?php echo htmlspecialchars($erro); ?></div>
				<?php endif; ?>
				<?php if ($sucesso): ?>
					<div class="success"><?php echo htmlspecialchars($sucesso); ?></div>
				<?php endif; ?>

				<form method="POST" action="">

					<div class="form-row">
						<div class="form-group">
							<label for="nome" class="label">Nome completo</label>
							<input type="text" id="nome" name="nome" class="input" required value="<?php echo htmlspecialchars($nome ?? ''); ?>" />
						</div>
						<div class="form-group">
							<label for="cpf" class="label">CPF</label>
							<input type="text" id="cpf" name="cpf" class="input" required value="<?php echo htmlspecialchars($cpf ?? ''); ?>" oninput="maskCPF(this)" maxlength="14" minlength="14" />
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="email" class="label">E-mail</label>
							<input type="email" id="email" name="email" class="input" required value="<?php echo htmlspecialchars($email ?? ''); ?>" />
						</div>
						<div class="form-group">
							<label for="telefone" class="label">Telefone (opcional)</label>
							<input type="tel" id="telefone" name="telefone" class="input" value="<?php echo htmlspecialchars($telefone ?? ''); ?>" oninput="maskPhone(this)" />
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="senha" class="label">Senha</label>
							<input type="password" id="senha" name="senha" class="input" required />
						</div>
						<div class="form-group">
							<label for="confirmar" class="label">Confirmar senha</label>
							<input type="password" id="confirmar" name="confirmar" class="input" required />
						</div>
					</div>

					<div class="actions">
						<button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;">Criar conta</button>
						<a href="login.php" class="btn btn-outline btn-lg" style="width:100%; justify-content:center;">Já tenho uma conta</a>
					</div>
				</form>
			</div>
		</main>

		<footer class="footer">
			<div class="container">
				<div class="footer-bottom">&copy; 2025 MeCalendar</div>
			</div>
		</footer>
	</div>

	<!-- Inclui o sistema de formatação automática -->
	<script src="formatters.js"></script>
	
	<script>
		// Aplica formatação específica para campos do cadastro
		document.addEventListener('DOMContentLoaded', function() {
			// Formatação de CPF
			const cpfInput = document.getElementById('cpf');
			if (cpfInput) {
				cpfInput.addEventListener('input', function() {
					Formatters.applyFormatting(this, 'cpf');
				});
			}
			
			// Formatação de telefone
			const phoneInput = document.getElementById('telefone');
			if (phoneInput) {
				phoneInput.addEventListener('input', function() {
					Formatters.applyFormatting(this, 'phone');
				});
			}
		});
	</script>
</body>
</html>


