# MeCalendar

MeCalendar é um sistema completo de agendamento desenvolvido em PHP com banco de dados MySQL, focado em proprietários de estabelecimentos que precisam gerenciar agendamentos de clientes.

## 🚀 Funcionalidades

- **Sistema de Autenticação**: Login e cadastro de proprietários
- **Gestão de Clientes**: Cadastro e gerenciamento de clientes
- **Calendário Interativo**: Visualização e gestão de agendamentos
- **Criação de Agendamentos**: Sistema para criar e gerenciar agendamentos
- **Interface Responsiva**: Design adaptável para todos os dispositivos
- **Segurança**: Autenticação por token, senhas criptografadas e controle de sessão

## 🛠️ Tecnologias Utilizadas

- **Backend**: PHP 7.4+, JS
- **Banco de Dados**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **Bibliotecas**: Font Awesome para ícones
- **Arquitetura**: MVC simples com PDO para acesso ao banco

## 📋 Pré-requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache/Nginx)
- Extensões PHP: PDO, PDO_MySQL

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Nicolas-Pierini/MeCalendar.git
   cd MeCalendar
   ```

2. **Configure o banco de dados**
   - Crie um banco de dados MySQL
   - Importe o arquivo `banco.sql` para criar as tabelas
   - Configure as credenciais em `config.php`

3. **Configure o servidor web**
   - Aponte o document root para a pasta do projeto
   - Certifique-se de que o mod_rewrite está habilitado (Apache)

4. **Acesse o sistema**
   - Abra o navegador e acesse `http://localhost`
   - Crie uma conta ou faça login

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `usuario`: Dados dos proprietários
- `agendamento_front`: Agendamentos dos clientes
- `clientes`: Dados dos clientes
- `token_autenticacao`: Tokens para "lembrar-me"
- `notificacao`: Sistema de notificações

## 📱 Funcionalidades Principais

### Para Proprietários
- Cadastro e login
- Gestão de clientes
- Criação de agendamentos
- Calendário de agendamentos
- Relatórios e estatísticas

## 🔒 Segurança

- Senhas criptografadas com `password_hash()`
- Autenticação por token com expiração
- Controle de sessão seguro
- Validação de entrada de dados
- Proteção contra SQL injection usando PDO

## 🎨 Interface

- Design moderno e responsivo
- Paleta de cores profissional
- Ícones intuitivos
- Layout adaptável para mobile e desktop

## 📁 Estrutura de Arquivos

```
├── config.php              # Configuração do banco de dados
├── auth_check.php          # Funções de autenticação
├── login.php              # Página de login
├── cadastro.php           # Página de cadastro
├── index.php              # Página principal
├── navbar.php             # Navegação do sistema
├── footer.php             # Rodapé do sistema
├── calendar.php           # Página do calendário
├── cliente.php            # Gestão de clientes
├── relatorios.php         # Relatórios e estatísticas
├── logout.php             # Logout do sistema
├── api.php                # API REST simples
├── api/clients.php        # API para gestão de clientes
├── styles.css             # Estilos principais
├── script.js              # JavaScript principal
├── calendar.js            # JavaScript do calendário
├── clients.js             # JavaScript para gestão de clientes
└── banco.sql              # Script de criação do banco
```

## 🚀 Como Usar

1. **Primeiro acesso**: Crie uma conta de proprietário na página de cadastro
2. **Login**: Acesse o sistema com suas credenciais
3. **Gerenciar clientes**: Cadastre e gerencie seus clientes
4. **Criar agendamentos**: Use o calendário para criar e gerenciar agendamentos
5. **Acompanhar relatórios**: Visualize estatísticas e relatórios dos seus atendimentos

## 🔧 Personalização

O sistema pode ser facilmente personalizado:

- Modifique as cores em `styles.css`
- Adicione novas funcionalidades em arquivos PHP
- Expanda o banco de dados conforme necessário
- Integre com APIs externas

## 📝 Licença

Este projeto foi desenvolvido para fins de portfólio e demonstração de habilidades técnicas.

## 👨‍💻 Desenvolvedor

Desenvolvido como projeto de portfólio para demonstrar conhecimentos em:
- Desenvolvimento web full-stack
- PHP e MySQL
- Frontend responsivo
- Arquitetura de sistemas
- Segurança web

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Compartilhar feedback

---

**Nota**: Este é um projeto de demonstração desenvolvido para portfólio. Todas as funcionalidades estão implementadas e funcionais para fins educacionais e de demonstração.
