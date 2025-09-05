CREATE DATABASE IF NOT EXISTS MeCalendar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MeCalendar;

-- Tabela de usuários (apenas proprietários)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE,
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(8),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos (eventos) - versão simplificada
CREATE TABLE IF NOT EXISTS agendamento_front (
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
    INDEX idx_owner_date (owner_user_id, date),
    FOREIGN KEY (owner_user_id) REFERENCES usuario(id_usuario)
);

-- Tabela de tokens de autenticação
CREATE TABLE IF NOT EXISTS token_autenticacao (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    tipo ENUM('login', 'recuperacao', 'verificacao') NOT NULL,
    expira_em TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacao (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('agendamento', 'lembrete', 'cancelamento', 'confirmacao') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);

-- Índices para melhor performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_agendamento_data ON agendamento_front(date);
CREATE INDEX idx_agendamento_status ON agendamento_front(status);
CREATE INDEX idx_token_usuario ON token_autenticacao(usuario_id);
CREATE INDEX idx_token_validade ON token_autenticacao(token, expira_em, usado);
