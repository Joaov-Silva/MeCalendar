<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Simula um banco de dados simples
$users = [
    [
        'id' => 1,
        'name' => 'João Silva',
        'email' => 'joao@barbearia.com',
        'profession' => 'Barbeiro',
        'business' => 'Barbearia Style'
    ],
    [
        'id' => 2,
        'name' => 'Maria Santos',
        'email' => 'maria@manicure.com',
        'profession' => 'Manicure',
        'business' => 'Nail Studio'
    ],
    [
        'id' => 3,
        'name' => 'Pedro Costa',
        'email' => 'pedro@tecnico.com',
        'profession' => 'Técnico',
        'business' => 'Técnico Pro'
    ]
];

$appointments = [
    [
        'id' => 1,
        'user_id' => 1,
        'client_name' => 'Carlos Oliveira',
        'service' => 'Corte + Barba',
        'date' => '2025-01-15',
        'time' => '14:00',
        'status' => 'confirmed'
    ],
    [
        'id' => 2,
        'user_id' => 2,
        'client_name' => 'Ana Paula',
        'service' => 'Manicure Completa',
        'date' => '2025-01-15',
        'time' => '15:30',
        'status' => 'pending'
    ]
];

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$path = parse_url($path, PHP_URL_PATH);
$path = trim($path, '/');

// Roteamento simples
switch ($method) {
    case 'GET':
        handleGet($path);
        break;
    case 'POST':
        handlePost($path);
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}

function handleGet($path) {
    global $users, $appointments;
    
    switch ($path) {
        case 'users':
            echo json_encode([
                'success' => true,
                'data' => $users,
                'total' => count($users)
            ]);
            break;
            
        case 'appointments':
            echo json_encode([
                'success' => true,
                'data' => $appointments,
                'total' => count($appointments)
            ]);
            break;
            
        case 'stats':
            $totalUsers = count($users);
            $totalAppointments = count($appointments);
            $confirmedAppointments = count(array_filter($appointments, function($apt) {
                return $apt['status'] === 'confirmed';
            }));
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'total_appointments' => $totalAppointments,
                    'confirmed_appointments' => $confirmedAppointments,
                    'pending_appointments' => $totalAppointments - $confirmedAppointments
                ]
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint não encontrado']);
            break;
    }
}

function handlePost($path) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($path) {
        case 'contact':
            // Simula envio de formulário de contato
            if (!isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Dados obrigatórios não fornecidos']);
                return;
            }
            
            // Aqui você poderia salvar no banco de dados ou enviar email
            echo json_encode([
                'success' => true,
                'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
                'data' => [
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
            break;
            
        case 'newsletter':
            // Simula inscrição na newsletter
            if (!isset($input['email'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email obrigatório']);
                return;
            }
            
            // Validação simples de email
            if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email inválido']);
                return;
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Inscrição realizada com sucesso! Você receberá nossas novidades.',
                'data' => [
                    'email' => $input['email'],
                    'subscribed_at' => date('Y-m-d H:i:s')
                ]
            ]);
            break;
            
        case 'demo-request':
            // Simula solicitação de demonstração
            if (!isset($input['name']) || !isset($input['email']) || !isset($input['business_type'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Dados obrigatórios não fornecidos']);
                return;
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Solicitação de demonstração enviada! Nossa equipe entrará em contato em até 24 horas.',
                'data' => [
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'business_type' => $input['business_type'],
                    'requested_at' => date('Y-m-d H:i:s')
                ]
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint não encontrado']);
            break;
    }
}

// Função auxiliar para log
function logActivity($action, $data = null) {
    $log = [
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    // Em produção, você salvaria isso em um arquivo de log ou banco de dados
    error_log(json_encode($log) . "\n", 3, 'activity.log');
}
?>
