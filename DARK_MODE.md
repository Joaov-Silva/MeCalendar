# Dark Mode - Sistema de Agendamento

## Visão Geral

O sistema de agendamento agora inclui suporte completo ao modo escuro (dark mode), permitindo que os usuários alternem entre o tema claro padrão e o tema escuro para uma melhor experiência visual.

## Funcionalidades

### ✅ Características Implementadas

- **Alternância automática**: Botão para alternar entre tema claro e escuro
- **Persistência**: A preferência do usuário é salva no localStorage
- **Detecção automática**: Detecta a preferência do sistema operacional
- **Transições suaves**: Animações suaves entre os temas
- **Responsivo**: Funciona em todos os dispositivos
- **Consistente**: Aplicado em todas as páginas do sistema

### 🎨 Elementos Estilizados

- **Navbar principal**: Header com logo e navegação
- **Sidebar**: Menu lateral das páginas de calendário
- **Conteúdo principal**: Áreas de conteúdo e formulários
- **Calendário**: Grid de dias e eventos
- **Modais**: Janelas de diálogo e formulários
- **Botões**: Todos os elementos interativos
- **Formulários**: Campos de entrada e seleção

## Como Usar

### Para Usuários

1. **Localizar o botão**: O botão de dark mode está posicionado na navbar principal ou sidebar
2. **Clicar para alternar**: Clique no botão para alternar entre os temas
3. **Preferência salva**: Sua escolha é automaticamente salva para futuras visitas

### Para Desenvolvedores

#### Incluir o Dark Mode

```html
<!-- Adicionar o botão na navbar/sidebar -->
<button class="dark-mode-btn" id="darkModeBtn" title="Alternar modo escuro">
    <i class="fas fa-moon" id="darkModeIcon"></i>
    <span>Modo Escuro</span>
</button>

<!-- Incluir o arquivo JavaScript -->
<script src="dark-mode.js"></script>
```

#### Estrutura de Classes CSS

```css
/* Tema claro (padrão) */
.elemento {
    background-color: #ffffff;
    color: #374151;
}

/* Tema escuro */
body.dark-mode .elemento {
    background-color: #1f2937;
    color: #f9fafb;
}
```

#### API JavaScript

```javascript
// Verificar se o dark mode está ativo
if (window.darkModeManager.isActive()) {
    console.log('Dark mode está ativo');
}

// Ativar dark mode programaticamente
window.darkModeManager.enable();

// Desativar dark mode programaticamente
window.darkModeManager.disable();
```

## Arquivos Modificados

### Arquivos Principais
- `navbar.php` - Navbar principal com botão de dark mode
- `index.html` - Página inicial com botão na navbar
- `calendar.html` - Página de calendário com botão na sidebar
- `calendar.php` - Versão PHP do calendário
- `cliente.php` - Página de clientes

### Arquivos de Estilo
- `styles.css` - Estilos gerais e dark mode para páginas principais
- `calendar.css` - Estilos específicos para páginas de calendário

### Arquivos JavaScript
- `dark-mode.js` - Gerenciador principal do dark mode

## Personalização

### Cores do Tema Escuro

As cores padrão do tema escuro podem ser personalizadas editando as variáveis CSS:

```css
body.dark-mode {
    --bg-primary: #111827;      /* Fundo principal */
    --bg-secondary: #1f2937;    /* Fundo secundário */
    --text-primary: #f9fafb;    /* Texto principal */
    --text-secondary: #d1d5db;  /* Texto secundário */
    --border-color: #374151;    /* Cor das bordas */
    --accent-color: #3b82f6;    /* Cor de destaque */
}
```

### Adicionar Novos Elementos

Para adicionar suporte ao dark mode em novos elementos:

1. **Adicionar classe CSS**:
```css
.novo-elemento {
    background-color: #ffffff;
    color: #374151;
}

body.dark-mode .novo-elemento {
    background-color: #1f2937;
    color: #f9fafb;
}
```

2. **Verificar no JavaScript**:
```javascript
// O dark mode é aplicado automaticamente via classe CSS
// Não é necessário código JavaScript adicional
```

## Compatibilidade

### Navegadores Suportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Funcionalidades
- ✅ localStorage para persistência
- ✅ Media queries para detecção do sistema
- ✅ Transições CSS para animações
- ✅ Ícones FontAwesome para botões

## Troubleshooting

### Problemas Comuns

1. **Botão não aparece**
   - Verificar se o arquivo `dark-mode.js` está incluído
   - Confirmar se os IDs `darkModeBtn` e `darkModeIcon` estão corretos

2. **Estilos não aplicam**
   - Verificar se as classes CSS `.dark-mode` estão definidas
   - Confirmar se o arquivo CSS está sendo carregado

3. **Preferência não salva**
   - Verificar se o localStorage está disponível
   - Testar em modo privado/anônimo

### Debug

```javascript
// Verificar estado do dark mode
console.log('Dark mode ativo:', window.darkModeManager.isActive());

// Verificar localStorage
console.log('Preferência salva:', localStorage.getItem('darkMode'));

// Verificar classes CSS aplicadas
console.log('Classes do body:', document.body.className);
```

## Contribuição

Para contribuir com melhorias no dark mode:

1. **Testar em diferentes navegadores**
2. **Verificar responsividade em dispositivos móveis**
3. **Manter consistência visual entre temas**
4. **Documentar novas funcionalidades**

## Licença

Este sistema de dark mode foi desenvolvido como parte do Sistema de Agendamento e está disponível sob a mesma licença do projeto principal.
