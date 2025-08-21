<?php
require_once 'config.php';
require_once 'auth_check.php';

header('Content-Type: application/json; charset=utf-8');

if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Não autenticado']);
    exit;
}

$currentUser = getCurrentUser();
$currentUserId = (int)$currentUser['id_usuario'];

// Garante que a tabela exista (camada simples para o calendário do front)
$pdo->exec("CREATE TABLE IF NOT EXISTS agendamento_front (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_user_id INT NOT NULL,
    client VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NULL,
    service_type VARCHAR(120) NOT NULL,
    service_description TEXT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT DEFAULT 60,
    value DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_date (owner_user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$method = $_SERVER['REQUEST_METHOD'];

// Lê JSON se houver
$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true);
if (!is_array($input)) { $input = []; }

// Permite também via form-data
foreach ($_POST as $k => $v) { $input[$k] = $v; }

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare('SELECT * FROM agendamento_front WHERE owner_user_id = ? ORDER BY date, time');
        $stmt->execute([$currentUserId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $rows]);
        exit;
    }

    if ($method === 'POST') {
        $action = $input['action'] ?? '';
        switch ($action) {
            case 'create':
                $stmt = $pdo->prepare('INSERT INTO agendamento_front (
                    owner_user_id, client, phone, email, service_type, service_description,
                    date, time, duration, value, status, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

                $status = normalize_status($input['status'] ?? 'pending');
                $stmt->execute([
                    $currentUserId,
                    trim($input['client'] ?? ''),
                    trim($input['phone'] ?? ''),
                    trim($input['email'] ?? ''),
                    trim($input['serviceType'] ?? ''),
                    trim($input['serviceDescription'] ?? ''),
                    $input['date'] ?? null,
                    $input['time'] ?? null,
                    (int)($input['duration'] ?? 60),
                    (float)($input['value'] ?? 0),
                    $status,
                    trim($input['notes'] ?? '')
                ]);

                echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
                exit;

            case 'update':
                $id = (int)($input['id'] ?? 0);
                if ($id <= 0) { throw new Exception('ID inválido'); }
                // Verifica propriedade
                $chk = $pdo->prepare('SELECT owner_user_id FROM agendamento_front WHERE id = ?');
                $chk->execute([$id]);
                $own = $chk->fetchColumn();
                if (!$own || (int)$own !== $currentUserId) { http_response_code(403); echo json_encode(['success'=>false,'error'=>'Sem permissão']); exit; }

                $status = normalize_status($input['status'] ?? 'pending');
                $stmt = $pdo->prepare('UPDATE agendamento_front SET 
                    client = ?, phone = ?, email = ?, service_type = ?, service_description = ?,
                    date = ?, time = ?, duration = ?, value = ?, status = ?, notes = ?
                WHERE id = ? AND owner_user_id = ?');
                $stmt->execute([
                    trim($input['client'] ?? ''),
                    trim($input['phone'] ?? ''),
                    trim($input['email'] ?? ''),
                    trim($input['serviceType'] ?? ''),
                    trim($input['serviceDescription'] ?? ''),
                    $input['date'] ?? null,
                    $input['time'] ?? null,
                    (int)($input['duration'] ?? 60),
                    (float)($input['value'] ?? 0),
                    $status,
                    trim($input['notes'] ?? ''),
                    $id,
                    $currentUserId
                ]);
                echo json_encode(['success' => true]);
                exit;

            case 'delete':
                $id = (int)($input['id'] ?? 0);
                if ($id <= 0) { throw new Exception('ID inválido'); }
                $stmt = $pdo->prepare('DELETE FROM agendamento_front WHERE id = ? AND owner_user_id = ?');
                $stmt->execute([$id, $currentUserId]);
                echo json_encode(['success' => true]);
                exit;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

function normalize_status($status) {
    $map = [
        'confirmed' => 'confirmed', 'confirmado' => 'confirmed',
        'pending' => 'pending', 'pendente' => 'pending', 'agendado' => 'pending',
        'cancelled' => 'cancelled', 'cancelado' => 'cancelled'
    ];
    return $map[$status] ?? 'pending';
}
?>


