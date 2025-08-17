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
	$tipo = $_POST['tipo'] ?? 'cliente';

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
				// Primeiro, busca o ID do tipo de usuário
				$stmt = $pdo->prepare('SELECT id_tipo FROM tipo_usuario WHERE nome = ?');
				$stmt->execute([$tipo]);
				$tipo_usuario = $stmt->fetch();
				
				if (!$tipo_usuario) {
					$erro = 'Tipo de usuário inválido.';
				} else {
					$tipo_usuario_id = $tipo_usuario['id_tipo'];
					
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

							// Insere o usuário com o tipo_usuario_id correto
							$stmt = $pdo->prepare('INSERT INTO usuario (tipo_usuario_id, nome, email, senha, cpf, telefone) VALUES (?, ?, ?, ?, ?, ?)');
							$stmt->execute([$tipo_usuario_id, $nome, $email, $hash, $cpf, $telefone]);

							$sucesso = 'Conta criada com sucesso! Você será redirecionado para o login.';
							header('refresh:2;url=login.php');
						}
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
	<title>Sistema de Agendamento - Cadastro</title>
	<link rel="stylesheet" href="styles.css">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
	<style>
		.auth-wrapper { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
		.auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
		.auth-card { width: 100%; max-width: 520px; background: #fff; border-radius: 0.75rem; box-shadow: 0 10px 25px rgba(0,0,0,.08); padding: 2rem; }
		.auth-header { display: flex; flex-direction: column; gap: .5rem; align-items: center; margin-bottom: 1.25rem; }
		.auth-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
		.auth-subtitle { color: #6b7280; font-size: .95rem; text-align: center; }
		.form-row { display:grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
		.form-group { margin-bottom: 1rem; }
		.label { display:block; margin-bottom:.5rem; color:#374151; font-weight:500; font-size:.9rem; }
		.input, .select { width: 100%; padding: .75rem .875rem; border: 1px solid #e5e7eb; border-radius: .5rem; outline: none; font-size: 1rem; transition: border-color .2s; background:#fff; color:#111827; }
		.input:focus, .select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
		.error { background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:.75rem; border-radius:.5rem; font-size:.9rem; margin-bottom:1rem; }
		.success { background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:.75rem; border-radius:.5rem; font-size:.9rem; margin-bottom:1rem; }
		.actions { display:flex; flex-direction:column; gap:.75rem; margin-top:.5rem; }
		@media (max-width: 640px){ .form-row { grid-template-columns: 1fr; } }
	</style>
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

		<main class="auth-main">
			<div class="auth-card">
				<div class="auth-header">
					<div class="logo-icon"><i class="fas fa-calendar"></i></div>
					<div class="auth-title">Criar conta</div>
					<p class="auth-subtitle">Preencha seus dados para criar sua conta. Se for profissional, selecione a opção abaixo.</p>
				</div>

				<?php if ($erro): ?>
					<div class="error"><?php echo htmlspecialchars($erro); ?></div>
				<?php endif; ?>
				<?php if ($sucesso): ?>
					<div class="success"><?php echo htmlspecialchars($sucesso); ?></div>
				<?php endif; ?>

				<form method="POST" action="">
					<div class="form-group">
						<label class="label">Tipo de conta</label>
						<div style="display:flex; gap: .75rem;">
							<label style="display:flex; align-items:center; gap:.5rem;">
								<input type="radio" name="tipo" value="cliente" <?php echo (($tipo ?? 'cliente')==='cliente')?'checked':''; ?>> Cliente
							</label>
							<label style="display:flex; align-items:center; gap:.5rem;">
								<input type="radio" name="tipo" value="profissional" <?php echo (($tipo ?? '')==='profissional')?'checked':''; ?>> Profissional
							</label>
						</div>
					</div>

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

		<footer class="footer" style="padding:1.5rem 1rem;">
			<div class="container">
				                <div class="footer-bottom" style="border:none; padding-top:0; text-align:center;">&copy; 2025 Sistema de Agendamento</div>
			</div>
		</footer>
	</div>

	<script>
		function maskCPF(input) {
			let v = input.value.replace(/\D/g, '');
			v = v.replace(/(\d{3})(\d)/, '$1.$2');
			v = v.replace(/(\d{3})(\d)/, '$1.$2');
			v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
			input.value = v;
		}
		function maskPhone(input) {
			let v = input.value.replace(/\D/g, '');
			if (v.length > 11) v = v.substring(0,11);
			if (v.length >= 11) input.value = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
			else if (v.length >= 10) input.value = v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
			else input.value = v;
		}
	</script>
</body>
</html>
