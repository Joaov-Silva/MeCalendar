<?php
require_once 'config.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'auth_check.php';

// Verifica se o usuário está logado e é cliente
if (!isLoggedIn() || !isCliente()) {
    header('Location: login.php');
    exit;
}

$erro = '';
$servicos = [];
$categorias = [];

// Buscar categorias disponíveis
try {
    $stmt = $pdo->prepare("SELECT * FROM categoria_servico WHERE ativo = TRUE ORDER BY nome");
    $stmt->execute();
    $categorias = $stmt->fetchAll();
} catch (PDOException $e) {
    $erro = 'Erro ao carregar categorias: ' . $e->getMessage();
}

// Processar busca
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $categoria_id = $_POST['categoria_id'] ?? '';
    $cidade = trim($_POST['cidade'] ?? '');
    $servico_nome = trim($_POST['servico_nome'] ?? '');
    
    try {
        $sql = "SELECT DISTINCT 
                    e.id_estabelecimento,
                    e.nome as estabelecimento_nome,
                    e.endereco,
                    e.cidade,
                    e.estado,
                    c.nome as categoria_nome,
                    ts.nome as servico_nome,
                    ts.descricao as servico_descricao,
                    ts.duracao_media,
                    se.preco,
                    se.duracao
                FROM estabelecimento e
                INNER JOIN categoria_servico c ON e.categoria_id = c.id_categoria
                INNER JOIN servico_estabelecimento se ON e.id_estabelecimento = se.estabelecimento_id
                INNER JOIN tipo_servico ts ON se.tipo_servico_id = ts.id_tipo_servico
                WHERE e.ativo = TRUE AND se.ativo = TRUE";
        
        $params = [];
        
        if ($categoria_id) {
            $sql .= " AND e.categoria_id = ?";
            $params[] = $categoria_id;
        }
        
        if ($cidade) {
            $sql .= " AND e.cidade LIKE ?";
            $params[] = "%$cidade%";
        }
        
        if ($servico_nome) {
            $sql .= " AND ts.nome LIKE ?";
            $params[] = "%$servico_nome%";
        }
        
        $sql .= " ORDER BY e.nome, ts.nome";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $servicos = $stmt->fetchAll();
        
    } catch (PDOException $e) {
        $erro = 'Erro ao buscar serviços: ' . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Agendamento - Buscar Serviços</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .search-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 3rem 1rem;
        }
        .search-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 25px rgba(0,0,0,.08);
        }
        .search-form {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr auto;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .search-form .form-group:last-child {
            display: flex;
            align-items: end;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .service-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            transition: all 0.2s;
        }
        .service-card:hover {
            border-color: #2563eb;
            box-shadow: 0 4px 12px rgba(37,99,235,.15);
        }
        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
        }
        .service-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.25rem;
        }
        .service-price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #059669;
        }
        .service-details {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .service-actions {
            display: flex;
            gap: 0.75rem;
        }
        .no-results {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }
        @media (max-width: 768px) {
            .search-form {
                grid-template-columns: 1fr;
            }
            .services-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <?php include 'navbar.php'; ?>

    <main>
        <section class="search-section">
            <div class="search-container">
                <h1 style="text-align: center; margin-bottom: 2rem; color: #111827;">
                    <i class="fas fa-search"></i> Buscar Serviços
                </h1>
                
                <form method="POST" class="search-form">
                    <div class="form-group">
                        <label for="categoria_id" class="label">Categoria</label>
                        <select name="categoria_id" id="categoria_id" class="select">
                            <option value="">Todas as categorias</option>
                            <?php foreach ($categorias as $categoria): ?>
                                <option value="<?php echo $categoria['id_categoria']; ?>" 
                                        <?php echo (isset($_POST['categoria_id']) && $_POST['categoria_id'] == $categoria['id_categoria']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($categoria['nome']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="cidade" class="label">Cidade</label>
                        <input type="text" name="cidade" id="cidade" class="input" 
                               placeholder="Digite a cidade" 
                               value="<?php echo htmlspecialchars($_POST['cidade'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="servico_nome" class="label">Nome do serviço</label>
                        <input type="text" name="servico_nome" id="servico_nome" class="input" 
                               placeholder="Ex: Corte de cabelo" 
                               value="<?php echo htmlspecialchars($_POST['servico_nome'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                    </div>
                </form>
                
                <?php if ($erro): ?>
                    <div class="error"><?php echo htmlspecialchars($erro); ?></div>
                <?php endif; ?>
                
                <?php if (!empty($servicos)): ?>
                    <div class="services-grid">
                        <?php foreach ($servicos as $servico): ?>
                            <div class="service-card">
                                <div class="service-header">
                                    <div>
                                        <div class="service-title"><?php echo htmlspecialchars($servico['servico_nome']); ?></div>
                                        <div class="service-details">
                                            <i class="fas fa-building"></i> <?php echo htmlspecialchars($servico['estabelecimento_nome']); ?>
                                        </div>
                                    </div>
                                    <div class="service-price">
                                        R$ <?php echo number_format($servico['preco'], 2, ',', '.'); ?>
                                    </div>
                                </div>
                                
                                <div class="service-details">
                                    <div><i class="fas fa-tag"></i> <?php echo htmlspecialchars($servico['categoria_nome']); ?></div>
                                    <div><i class="fas fa-clock"></i> <?php echo $servico['duracao']; ?> min</div>
                                    <div><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($servico['cidade'] . ' - ' . $servico['estado']); ?></div>
                                </div>
                                
                                <div class="service-actions">
                                    <button class="btn btn-primary btn-sm" onclick="agendarServico(<?php echo $servico['id_estabelecimento']; ?>)">
                                        <i class="fas fa-calendar-plus"></i> Agendar
                                    </button>
                                    <button class="btn btn-outline btn-sm" onclick="verDetalhes(<?php echo $servico['id_estabelecimento']; ?>)">
                                        <i class="fas fa-info-circle"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php elseif ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
                    <div class="no-results">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                        <h3>Nenhum serviço encontrado</h3>
                        <p>Tente ajustar os filtros de busca</p>
                    </div>
                <?php endif; ?>
            </div>
        </section>
    </main>

    <script>
        function agendarServico(estabelecimentoId) {
            // Implementar redirecionamento para agendamento
            alert('Funcionalidade de agendamento será implementada em breve!');
        }
        
        function verDetalhes(estabelecimentoId) {
            // Implementar visualização de detalhes
            alert('Funcionalidade de detalhes será implementada em breve!');
        }
    </script>
</body>
</html>
