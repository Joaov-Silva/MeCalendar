<?php
require_once 'config.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'auth_check.php';

// Executa o logout
logout();
?>
