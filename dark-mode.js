/**
 * Dark Mode Manager
 * Gerencia a funcionalidade de alternância entre tema claro e escuro
 */

// Dark Mode Management
class DarkModeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        // Aplicar estado inicial
        if (this.isDarkMode) {
            this.enableDarkMode();
        }

        // Adicionar event listeners para botões de dark mode
        this.addEventListeners();
        
        // Atualizar ícones inicialmente
        this.updateIcons();
    }

    addEventListeners() {
        // Selecionar todos os botões de dark mode (incluindo os da página inicial)
        const darkModeBtns = document.querySelectorAll('.dark-mode-btn, #darkModeBtn');
        darkModeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleDarkMode());
        });
    }

    toggleDarkMode() {
        if (this.isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        this.isDarkMode = true;
        localStorage.setItem('darkMode', 'true');
        this.updateIcons();
        this.updateStatus();
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        this.isDarkMode = false;
        localStorage.setItem('darkMode', 'false');
        this.updateIcons();
        this.updateStatus();
    }

    updateIcons() {
        // Selecionar todos os ícones de dark mode
        const icons = document.querySelectorAll('#darkModeIcon, .dark-mode-btn i');
        icons.forEach(icon => {
            if (this.isDarkMode) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }

    updateStatus() {
        // Atualizar elementos de status se existirem (para páginas de teste)
        const statusElement = document.getElementById('darkModeStatus');
        const bodyClassElement = document.getElementById('bodyClass');
        
        if (statusElement) {
            statusElement.textContent = this.isDarkMode ? 'Sim' : 'Não';
        }
        
        if (bodyClassElement) {
            bodyClassElement.textContent = document.body.className || 'Nenhuma';
        }
    }

    // Método para verificar se o dark mode está ativo
    isActive() {
        return this.isDarkMode;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    if (!window.darkModeManager) {
        window.darkModeManager = new DarkModeManager();
    }
});

// Função global para alternar dark mode (para uso em outros scripts)
window.toggleDarkMode = function() {
    if (window.darkModeManager) {
        window.darkModeManager.toggleDarkMode();
    } else {
        // Fallback: criar instância se ainda não existir (embora não deva acontecer com a verificação acima)
        window.darkModeManager = new DarkModeManager();
        window.darkModeManager.toggleDarkMode();
    }
};

// Função para verificar o status do dark mode
window.isDarkModeActive = function() {
    return window.darkModeManager ? window.darkModeManager.isActive() : false;
};
