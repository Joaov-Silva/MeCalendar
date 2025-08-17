<?php
// Não inicia sessão aqui, pois já é iniciada nos arquivos que incluem este arquivo

// Função para verificar se o usuário está logado
function isLoggedIn() {
    return isset($_SESSION['usuario_id']);
}

// Função para obter dados do usuário logado
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT u.*, t.nome as tipo_nome 
                              FROM usuario u 
                              INNER JOIN tipo_usuario t ON u.tipo_usuario_id = t.id_tipo 
                              WHERE u.id_usuario = ?");
        $stmt->execute([$_SESSION['usuario_id']]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        return null;
    }
}

// Função para verificar se é cliente
function isCliente() {
    $user = getCurrentUser();
    return $user && $user['tipo_nome'] === 'cliente';
}

// Função para verificar se é profissional
function isProfissional() {
    $user = getCurrentUser();
    return $user && $user['tipo_nome'] === 'profissional';
}

// Função para fazer logout
function logout() {
    // Remove o token do cookie se existir
    if (isset($_COOKIE['token'])) {
        global $pdo;
        try {
            $stmt = $pdo->prepare("UPDATE token_autenticacao SET usado = TRUE WHERE token = ?");
            $stmt->execute([$_COOKIE['token']]);
        } catch (PDOException $e) {
            // Ignora erro se não conseguir atualizar
        }
        setcookie('token', '', time() - 3600, '/');
    }
    
    // Destrói a sessão
    session_destroy();
    
    // Redireciona para login
    header('Location: login.php');
    exit;
}
?>
