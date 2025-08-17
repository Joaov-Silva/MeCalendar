CREATE DATABASE IF NOT EXISTS proAgenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE proAgenda;

-- Tabela de tipos de usuário (cliente ou profissional)
CREATE TABLE IF NOT EXISTS tipo_usuario (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT
);

-- Inserir tipos básicos
INSERT INTO tipo_usuario (nome, descricao) VALUES 
('cliente', 'Usuário que busca e agenda serviços'),
('profissional', 'Proprietário ou administrador de estabelecimento');

-- Tabela de usuários (clientes e profissionais)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario_id INT NOT NULL,
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
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(id_tipo)
);

-- Tabela de categorias de serviços
CREATE TABLE IF NOT EXISTS categoria_servico (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE
);

-- Inserir categorias básicas
INSERT INTO categoria_servico (nome, descricao, icone) VALUES 
('Barbearia', 'Serviços de barbearia e cuidados masculinos', 'cut'),
('Manicure', 'Serviços de manicure e pedicure', 'palette'),
('Estética', 'Tratamentos estéticos e beleza', 'spa'),
('Técnico', 'Serviços técnicos diversos', 'wrench'),
('Outros', 'Outros tipos de serviços', 'ellipsis-h');

-- Tabela de estabelecimentos
CREATE TABLE IF NOT EXISTS estabelecimento (
    id_estabelecimento INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- proprietário
    categoria_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    telefone VARCHAR(15),
    endereco TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(8),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    horario_abertura TIME,
    horario_fechamento TIME,
    dias_funcionamento VARCHAR(50), -- "1,2,3,4,5,6" (segunda a sábado)
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (categoria_id) REFERENCES categoria_servico(id_categoria)
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    estabelecimento_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(15),
    especialidade TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimento(id_estabelecimento)
);

-- Tabela de tipos de serviços específicos
CREATE TABLE IF NOT EXISTS tipo_servico (
    id_tipo_servico INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao_media INT, -- em minutos
    preco_base DECIMAL(10, 2),
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categoria_servico(id_categoria)
);

-- Inserir tipos de serviços para barbearia
INSERT INTO tipo_servico (categoria_id, nome, descricao, duracao_media, preco_base) VALUES 
(1, 'Corte na Tesoura', 'Corte tradicional feito com tesoura', 30, 25.00),
(1, 'Corte na Máquina', 'Corte feito com máquina de cortar cabelo', 20, 20.00),
(1, 'Barba', 'Fazer a barba', 15, 15.00),
(1, 'Corte + Barba', 'Corte completo com barba', 45, 35.00),
(1, 'Hidratação', 'Tratamento hidratante para cabelo', 60, 40.00),
(1, 'Pigmentação', 'Coloração de cabelo ou barba', 90, 50.00);

-- Tabela de serviços oferecidos por estabelecimento
CREATE TABLE IF NOT EXISTS servico_estabelecimento (
    id_servico_estabelecimento INT AUTO_INCREMENT PRIMARY KEY,
    estabelecimento_id INT NOT NULL,
    tipo_servico_id INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    duracao INT NOT NULL, -- em minutos
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimento(id_estabelecimento),
    FOREIGN KEY (tipo_servico_id) REFERENCES tipo_servico(id_tipo_servico)
);

-- Tabela de funcionários que fazem cada serviço
CREATE TABLE IF NOT EXISTS funcionario_servico (
    id_funcionario_servico INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    servico_estabelecimento_id INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id_funcionario),
    FOREIGN KEY (servico_estabelecimento_id) REFERENCES servico_estabelecimento(id_servico_estabelecimento)
);

-- Tabela de horários de trabalho dos funcionários
CREATE TABLE IF NOT EXISTS horario_funcionario (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    dia_semana INT NOT NULL, -- 1=domingo, 2=segunda, etc.
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id_funcionario)
);

-- Tabela de agendamentos (eventos)
CREATE TABLE IF NOT EXISTS agendamento (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    estabelecimento_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    servico_estabelecimento_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado', 'concluido') DEFAULT 'pendente',
    observacoes TEXT,
    valor DECIMAL(10, 2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimento(id_estabelecimento),
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id_funcionario),
    FOREIGN KEY (servico_estabelecimento_id) REFERENCES servico_estabelecimento(id_servico_estabelecimento)
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL,
    cliente_id INT NOT NULL,
    estabelecimento_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id_agendamento),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimento(id_estabelecimento),
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id_funcionario)
);

-- Tabela de imagens (para estabelecimentos, serviços, etc.)
CREATE TABLE IF NOT EXISTS imagem (
    id_imagem INT AUTO_INCREMENT PRIMARY KEY,
    tipo_entidade ENUM('estabelecimento', 'servico', 'usuario') NOT NULL,
    id_entidade INT NOT NULL,
    url_imagem VARCHAR(500) NOT NULL,
    descricao VARCHAR(255),
    principal BOOLEAN DEFAULT FALSE,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_usuario_tipo ON usuario(tipo_usuario_id);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_estabelecimento_categoria ON estabelecimento(categoria_id);
CREATE INDEX idx_estabelecimento_localizacao ON estabelecimento(latitude, longitude);
CREATE INDEX idx_agendamento_data ON agendamento(data_agendamento);
CREATE INDEX idx_agendamento_status ON agendamento(status);
CREATE INDEX idx_agendamento_funcionario ON agendamento(funcionario_id, data_agendamento);
CREATE INDEX idx_token_usuario ON token_autenticacao(usuario_id);
CREATE INDEX idx_token_validade ON token_autenticacao(token, expira_em, usado);
