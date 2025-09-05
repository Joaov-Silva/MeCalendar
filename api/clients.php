<?php
require_once '../config.php';
require_once '../auth_check.php';

header('Content-Type: application/json; charset=utf-8');

if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Não autenticado']);
    exit;
}

$currentUser = getCurrentUser();
$currentUserId = (int)$currentUser['id_usuario'];

// Cria tabela de clientes se não existir
$pdo->exec("CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_user_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NULL,
    data_nascimento DATE NULL,
    endereco TEXT NULL,
    observacoes TEXT NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_user_id),
    FOREIGN KEY (owner_user_id) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Listar clientes
        $stmt = $pdo->prepare('SELECT * FROM clientes WHERE owner_user_id = ? ORDER BY nome');
        $stmt->execute([$currentUserId]);
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $clientes]);
        exit;
    }

    if ($method === 'POST') {
        // Criar novo cliente
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare('INSERT INTO clientes (
            owner_user_id, nome, telefone, email, data_nascimento, endereco, observacoes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $currentUserId,
            trim($input['nome'] ?? ''),
            trim($input['telefone'] ?? ''),
            trim($input['email'] ?? ''),
            $input['dataNascimento'] ?? null,
            trim($input['endereco'] ?? ''),
            trim($input['observacoes'] ?? ''),
            $input['status'] ?? 'ativo'
        ]);
        
        echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
        exit;
    }

    if ($method === 'PUT') {
        // Atualizar cliente
        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int)($input['id'] ?? 0);
        
        if ($id <= 0) {
            throw new Exception('ID inválido');
        }
        
        // Verifica propriedade
        $chk = $pdo->prepare('SELECT owner_user_id FROM clientes WHERE id = ?');
        $chk->execute([$id]);
        $own = $chk->fetchColumn();
        if (!$own || (int)$own !== $currentUserId) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Sem permissão']);
            exit;
        }
        
        $stmt = $pdo->prepare('UPDATE clientes SET 
            nome = ?, telefone = ?, email = ?, data_nascimento = ?, 
            endereco = ?, observacoes = ?, status = ?
        WHERE id = ? AND owner_user_id = ?');
        
        $stmt->execute([
            trim($input['nome'] ?? ''),
            trim($input['telefone'] ?? ''),
            trim($input['email'] ?? ''),
            $input['dataNascimento'] ?? null,
            trim($input['endereco'] ?? ''),
            trim($input['observacoes'] ?? ''),
            $input['status'] ?? 'ativo',
            $id,
            $currentUserId
        ]);
        
        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        // Deletar cliente
        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int)($input['id'] ?? 0);
        
        if ($id <= 0) {
            throw new Exception('ID inválido');
        }
        
        $stmt = $pdo->prepare('DELETE FROM clientes WHERE id = ? AND owner_user_id = ?');
        $stmt->execute([$id, $currentUserId]);
        
        echo json_encode(['success' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
    
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
