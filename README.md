# Sistema de Agendamento

Um sistema completo de agendamento desenvolvido em PHP com banco de dados MySQL, focado em demonstrar habilidades de desenvolvimento web full-stack.

## 🚀 Funcionalidades

- **Sistema de Autenticação**: Login e cadastro de usuários com diferentes tipos (cliente e profissional)
- **Gestão de Usuários**: Cadastro, autenticação e controle de sessão
- **Calendário Interativo**: Visualização e gestão de agendamentos
- **Busca de Serviços**: Sistema de busca com filtros por categoria e localização
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
   git clone https://github.com/Nicolas-Pierini/ProAgenda.git
   cd ProAgenda
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

- `usuario`: Dados dos usuários (clientes e profissionais)
- `tipo_usuario`: Tipos de usuário (cliente, profissional)
- `estabelecimento`: Informações dos estabelecimentos
- `categoria_servico`: Categorias de serviços disponíveis
- `tipo_servico`: Tipos específicos de serviços
- `token_autenticacao`: Tokens para "lembrar-me"

## 📱 Funcionalidades Principais

### Para Clientes
- Cadastro e login
- Busca de serviços por categoria e localização
- Visualização de seus agendamentos
- Sistema de agendamentos

### Para Profissionais
- Cadastro e login
- Gestão de estabelecimento
- Calendário de agendamentos
- Dashboard de atividades

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
├── buscar_servicos.php    # Busca de serviços
├── logout.php             # Logout do sistema
├── api.php                # API REST simples
├── styles.css             # Estilos principais
├── calendar.css           # Estilos do calendário
├── script.js              # JavaScript principal
├── calendar.js            # JavaScript do calendário
└── banco.sql              # Script de criação do banco
```

## 🚀 Como Usar

1. **Primeiro acesso**: Crie uma conta na página de cadastro
2. **Login**: Acesse o sistema com suas credenciais
3. **Explorar**: Navegue pelas funcionalidades disponíveis
4. **Testar**: Experimente o sistema de agendamentos e busca

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
