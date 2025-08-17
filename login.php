<?php
// Inclui o arquivo de configuração
require_once 'config.php';

$erro = '';
$sucesso = '';

// Inicia a sessão
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verifica se já existe um token válido
if (isset($_COOKIE['token'])) {
    $token = $_COOKIE['token'];
    try {
        $stmt = $pdo->prepare("SELECT u.* FROM usuario u 
                              INNER JOIN token_autenticacao t ON u.id_usuario = t.usuario_id 
                              WHERE t.token = ? AND t.tipo = 'login' AND t.expira_em > NOW() AND t.usado = FALSE");
        $stmt->execute([$token]);
        $usuario = $stmt->fetch();
        
        if ($usuario) {
            // Marca o token como usado
            $stmt = $pdo->prepare("UPDATE token_autenticacao SET usado = TRUE WHERE token = ?");
            $stmt->execute([$token]);
            
            // Cria nova sessão
            $_SESSION['usuario_id'] = $usuario['id_usuario'];
            $_SESSION['nome'] = $usuario['nome'];
            $_SESSION['email'] = $usuario['email'];
            $_SESSION['tipo_usuario_id'] = $usuario['tipo_usuario_id'];
            
            // Redireciona para o dashboard
            header('Location: index.php');
            exit;
        } else {
            // Token inválido, remove o cookie
            setcookie('token', '', time() - 3600, '/');
        }
    } catch(PDOException $e) {
        // Remove cookie inválido
        setcookie('token', '', time() - 3600, '/');
        $erro = "Erro ao verificar token: " . $e->getMessage();
    }
}

// Verifica se o formulário foi enviado via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados do formulário
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $lembrar = isset($_POST['lembrar']);
    
    if ($email === '' || $senha === '') {
        $erro = 'Preencha todos os campos obrigatórios.';
    } else {
        try {
            // Prepara a query SQL para buscar o usuário
            $stmt = $pdo->prepare("SELECT id_usuario, nome, email, senha, tipo_usuario_id FROM usuario WHERE email = ?");
            $stmt->execute([$email]);
            $usuario = $stmt->fetch();
            
            // Verifica se as credenciais estão corretas
            if ($usuario && password_verify($senha, $usuario['senha'])) {
                // Inicia a sessão do usuário
                $_SESSION['usuario_id'] = $usuario['id_usuario'];
                $_SESSION['nome'] = $usuario['nome'];
                $_SESSION['email'] = $usuario['email'];
                $_SESSION['tipo_usuario_id'] = $usuario['tipo_usuario_id'];
                
                // Se o usuário marcou "Lembrar-me", cria um token
                if ($lembrar) {
                    // Gera um token seguro
                    $token = bin2hex(random_bytes(32));
                    $expira_em = date('Y-m-d H:i:s', time() + (86400 * 30)); // 30 dias
                    
                    // Salva o token no banco de dados
                    $stmt = $pdo->prepare("INSERT INTO token_autenticacao (usuario_id, token, tipo, expira_em) VALUES (?, ?, 'login', ?)");
                    $stmt->execute([$usuario['id_usuario'], $token, $expira_em]);
                    
                    // Cria o cookie com validade de 30 dias
                    setcookie('token', $token, time() + (86400 * 30), '/', '', false, true);
                }
                
                $sucesso = 'Login realizado com sucesso! Redirecionando...';
                header('refresh:0;url=index.php');
                exit;
            } else {
                // Se as credenciais estiverem incorretas, exibe mensagem de erro
                $erro = "Email ou senha inválidos";
            }
        } catch(PDOException $e) {
            // Em caso de erro de banco de dados, exibe mensagem de erro
            $erro = "Erro ao fazer login: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Agendamento - Login</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .auth-wrapper { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
        .auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .auth-card { width: 100%; max-width: 420px; background: #fff; border-radius: 0.75rem; box-shadow: 0 10px 25px rgba(0,0,0,.08); padding: 2rem; }
        .auth-header { display: flex; flex-direction: column; gap: .5rem; align-items: center; margin-bottom: 1.5rem; }
        .auth-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
        .auth-subtitle { color: #6b7280; font-size: .95rem; text-align: center; }
        .form-group { margin-bottom: 1rem; }
        .label { display:block; margin-bottom:.5rem; color:#374151; font-weight:500; font-size:.9rem; }
        .input { width: 100%; padding: .75rem .875rem; border: 1px solid #e5e7eb; border-radius: .5rem; outline: none; font-size: 1rem; transition: border-color .2s; background:#fff; color:#111827; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
        .inline { display:flex; align-items:center; justify-content: space-between; }
        .error { background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:.75rem; border-radius:.5rem; font-size:.9rem; margin-bottom:1rem; }
        .success { background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:.75rem; border-radius:.5rem; font-size:.9rem; margin-bottom:1rem; }
        .actions { display:flex; flex-direction:column; gap:.75rem; margin-top:1rem; }
        .text-muted { color:#6b7280; font-size:.9rem; }
        .link { color:#2563eb; text-decoration:none; }
        .link:hover { text-decoration:underline; }
    </style>
</head>
<body>
    <div class="auth-wrapper">
        <?php include 'navbar.php'; ?>

        <!-- Main -->
        <main class="auth-main">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="logo-icon"><i class="fas fa-calendar"></i></div>
                    <div class="auth-title">Bem-vindo de volta</div>
                    <p class="auth-subtitle">Entre com seu e-mail e senha para acessar sua conta</p>
                </div>

                <?php if ($erro): ?>
                    <div class="error"><?php echo htmlspecialchars($erro); ?></div>
                <?php endif; ?>
                
                <?php if ($sucesso): ?>
                    <div class="success"><?php echo htmlspecialchars($sucesso); ?></div>
                <?php endif; ?>

                <form method="POST" action="">
                    <div class="form-group">
                        <label for="email" class="label">E-mail</label>
                        <input type="email" name="email" id="email" class="input" required value="<?php echo htmlspecialchars($email ?? ''); ?>" />
                    </div>
                    <div class="form-group">
                        <label for="senha" class="label">Senha</label>
                        <input type="password" name="senha" id="senha" class="input" required />
                    </div>
                    <div class="inline">
                        <label class="text-muted" style="display:flex; align-items:center; gap:.5rem;">
                            <input type="checkbox" name="lembrar" /> Lembrar-me
                        </label>
                        <a href="#" class="link">Esqueci minha senha</a>
                    </div>
                    <div class="actions">
                        <button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;">Entrar</button>
                        <a href="cadastro.php" class="btn btn-outline btn-lg" style="width:100%; justify-content:center;">Criar conta</a>
                    </div>
                </form>
            </div>
        </main>

        <!-- Footer simples -->
        <footer class="footer" style="padding:1.5rem 1rem;">
            <div class="container">
                <div class="footer-bottom" style="border:none; padding-top:0; text-align:center;">&copy; 2025 Sistema de Agendamento</div>
            </div>
        </footer>
    </div>
</body>
</html>