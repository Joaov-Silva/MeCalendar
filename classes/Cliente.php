<?php
class Cliente {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }

    public function create($dados) {
        $sql = "INSERT INTO clientes (nome, email, telefone, endereco, data_nascimento, observacoes, status) 
                VALUES (:nome, :email, :telefone, :endereco, :data_nascimento, :observacoes, :status)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':nome' => $dados['nome'],
            ':email' => $dados['email'],
            ':telefone' => $dados['telefone'],
            ':endereco' => $dados['endereco'],
            ':data_nascimento' => $dados['data_nascimento'],
            ':observacoes' => $dados['observacoes'],
            ':status' => $dados['status'] ?? 'ativo'
        ]);
    }

    public function getAll() {
        $sql = "SELECT * FROM clientes ORDER BY nome";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update($id, $dados) {
        $sql = "UPDATE clientes SET 
                nome = :nome,
                email = :email,
                telefone = :telefone,
                endereco = :endereco,
                data_nascimento = :data_nascimento,
                observacoes = :observacoes,
                status = :status
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':nome' => $dados['nome'],
            ':email' => $dados['email'],
            ':telefone' => $dados['telefone'],
            ':endereco' => $dados['endereco'],
            ':data_nascimento' => $dados['data_nascimento'],
            ':observacoes' => $dados['observacoes'],
            ':status' => $dados['status']
        ]);
    }

    public function delete($id) {
        $sql = "DELETE FROM clientes WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function search($termo) {
        $sql = "SELECT * FROM clientes WHERE 
                nome LIKE :termo OR 
                email LIKE :termo OR 
                telefone LIKE :termo";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':termo' => "%$termo%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>