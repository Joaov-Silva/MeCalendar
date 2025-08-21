<?php
header('Content-Type: application/json; charset=UTF-8');

require_once 'config.php';
require_once 'auth_check.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'error' => 'Método não permitido']);
	exit;
}

if (!isLoggedIn()) {
	http_response_code(401);
	echo json_encode(['success' => false, 'error' => 'Não autenticado']);
	exit;
}

// Lê JSON ou POST
$inputRaw = file_get_contents('php://input');
$input = [];
if ($inputRaw) {
	$parsed = json_decode($inputRaw, true);
	if (is_array($parsed)) { $input = $parsed; }
}
if (!$input) { $input = $_POST; }

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$userId = $_SESSION['usuario_id'];

if ($name === '' || $email === '') {
	http_response_code(400);
	echo json_encode(['success' => false, 'error' => 'Nome e email são obrigatórios']);
	exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	http_response_code(400);
	echo json_encode(['success' => false, 'error' => 'Email inválido']);
	exit;
}

try {
	// Verifica duplicidade de email para outro usuário
	$stmt = $pdo->prepare('SELECT 1 FROM usuario WHERE email = ? AND id_usuario <> ?');
	$stmt->execute([$email, $userId]);
	if ($stmt->fetchColumn()) {
		http_response_code(409);
		echo json_encode(['success' => false, 'error' => 'Email já está em uso por outro usuário']);
		exit;
	}

	// Atualiza
	$up = $pdo->prepare('UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?');
	$up->execute([$name, $email, $userId]);

	// Atualiza sessão para refletir imediatamente
	$_SESSION['nome'] = $name;
	$_SESSION['email'] = $email;

	echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso', 'data' => ['name' => $name, 'email' => $email]]);
} catch (PDOException $e) {
	http_response_code(500);
	echo json_encode(['success' => false, 'error' => 'Falha ao atualizar', 'detail' => $e->getMessage()]);
}

