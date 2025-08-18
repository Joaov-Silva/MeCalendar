# Guia de Instalação - Sistema de Agendamento

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **PHP 7.4 ou superior**
- **MySQL 5.7 ou superior** (ou MariaDB 10.2+)
- **Servidor web** (Apache ou Nginx)
- **Extensões PHP**: PDO, PDO_MySQL, session

## 🔧 Passo a Passo da Instalação

### 1. Configuração do Banco de Dados

1. **Crie um banco de dados MySQL:**
   ```sql
   CREATE DATABASE proAgenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Importe a estrutura do banco:**
   ```bash
   mysql -u root -p proAgenda < banco.sql
   ```

### 2. Configuração do PHP

1. **Copie o arquivo de configuração:**
   ```bash
   cp config.example.php config.php
   ```

2. **Edite o arquivo `config.php` com suas credenciais:**
   ```php
   $host = 'localhost';        // Seu servidor MySQL
   $dbname = 'proAgenda';      // Nome do banco criado
   $username = 'seu_usuario';  // Seu usuário MySQL
   $password = 'sua_senha';    // Sua senha MySQL
   ```

### 3. Configuração do Servidor Web

#### Para Apache:

1. **Habilite o mod_rewrite:**
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

2. **Configure o .htaccess** (já incluído no projeto)

#### Para Nginx:

1. **Adicione ao seu arquivo de configuração:**
   ```nginx
   location / {
       try_files $uri $uri/ /index.php?$query_string;
   }
   ```

### 4. Permissões de Arquivo

1. **Defina as permissões corretas:**
   ```bash
   chmod 644 *.php
   chmod 644 *.css
   chmod 644 *.js
   chmod 644 *.html
   ```

## 🚀 Testando a Instalação

1. **Acesse o sistema:**
   ```
   http://localhost/seu-projeto
   ```

2. **Crie uma conta de teste:**
   - Acesse a página de cadastro
   - Crie um usuário do tipo "cliente"
   - Faça login no sistema

3. **Verifique as funcionalidades:**
   - Navegação entre páginas
   - Sistema de login/logout
   - Calendário
   - Busca de serviços

## 🔍 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se o MySQL está rodando
- Confirme as credenciais em `config.php`
- Teste a conexão manualmente

### Página em Branco
- Verifique os logs de erro do PHP
- Confirme se todas as extensões estão instaladas
- Verifique as permissões dos arquivos

### Erro 500
- Verifique o arquivo `.htaccess`
- Confirme se o mod_rewrite está habilitado
- Verifique os logs do servidor web

### Problemas de Sessão
- Verifique se o diretório de sessões tem permissões de escrita
- Confirme se o PHP está configurado para usar sessões

## 📱 Funcionalidades para Testar

### Como Cliente:
1. Cadastro e login
2. Busca de serviços
3. Visualização de estabelecimentos

### Como Profissional:
1. Cadastro e login
2. Acesso ao calendário
3. Gestão de agendamentos

## 🔒 Segurança

- **NUNCA** comite o arquivo `config.php` no Git
- Use senhas fortes para o banco de dados
- Mantenha o PHP e MySQL atualizados
- Configure HTTPS em produção

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro
2. Confirme a configuração do banco
3. Teste em um ambiente limpo
4. Verifique a compatibilidade de versões

## ✅ Checklist de Instalação

- [ ] PHP 7.4+ instalado
- [ ] MySQL 5.7+ instalado e rodando
- [ ] Banco de dados criado e populado
- [ ] Arquivo config.php configurado
- [ ] Servidor web configurado
- [ ] mod_rewrite habilitado (Apache)
- [ ] Permissões de arquivo configuradas
- [ ] Sistema acessível via navegador
- [ ] Login funcionando
- [ ] Todas as funcionalidades testadas

---

**Nota**: Este é um projeto de demonstração. Em ambiente de produção, considere implementar medidas de segurança adicionais.
