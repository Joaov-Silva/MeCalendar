<?php
// Arquivo de configuração de exemplo
// Copie este arquivo para config.php e configure suas credenciais

// Inicia a sessão PHP
session_start();

// Configurações do banco de dados
$host = 'localhost';        // Servidor do banco de dados
$dbname = 'MeCalendar';      // Nome do banco de dados
$username = 'root';         // Usuário do banco de dados
$password = '';             // Senha do banco de dados

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erro de conexão com o banco de dados: " . $e->getMessage());
}
?>
