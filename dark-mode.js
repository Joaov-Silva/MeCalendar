/**
 * Dark Mode Manager
 * Gerencia a funcionalidade de alternância entre tema claro e escuro
 */

class DarkModeManager {
    constructor() {
        this.darkModeBtn = document.getElementById('darkModeBtn');
        this.darkModeIcon = document.getElementById('darkModeIcon');
        this.body = document.body;
        this.isDarkMode = false;
        
        this.init();
    }
    
    init() {
        // Verifica se o dark mode está ativado no localStorage
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // Aplica o estado inicial
        this.applyTheme();
        
        // Adiciona evento de clique
        if (this.darkModeBtn) {
            this.darkModeBtn.addEventListener('click', () => this.toggle());
        }
        
        // Adiciona evento para detectar mudanças no sistema
        this.detectSystemPreference();
    }
    
    toggle() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.savePreference();
    }
    
    applyTheme() {
        if (this.isDarkMode) {
            this.body.classList.add('dark-mode');
            if (this.darkModeIcon) {
                this.darkModeIcon.className = 'fas fa-sun';
            }
        } else {
            this.body.classList.remove('dark-mode');
            if (this.darkModeIcon) {
                this.darkModeIcon.className = 'fas fa-moon';
            }
        }
        
        // Adiciona efeito de transição suave
        this.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove a transição após a animação
        setTimeout(() => {
            this.body.style.transition = '';
        }, 300);
    }
    
    savePreference() {
        localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
    
    detectSystemPreference() {
        // Detecta preferência do sistema operacional
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Aplica automaticamente se não houver preferência salva
        if (localStorage.getItem('darkMode') === null) {
            this.isDarkMode = mediaQuery.matches;
            this.applyTheme();
        }
        
        // Escuta mudanças na preferência do sistema
        mediaQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                this.isDarkMode = e.matches;
                this.applyTheme();
            }
        });
    }
    
    // Método para verificar se o dark mode está ativo
    isActive() {
        return this.isDarkMode;
    }
    
    // Método para ativar programaticamente
    enable() {
        this.isDarkMode = true;
        this.applyTheme();
        this.savePreference();
    }
    
    // Método para desativar programaticamente
    disable() {
        this.isDarkMode = false;
        this.applyTheme();
        this.savePreference();
    }
}

// Inicializa o dark mode quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.darkModeManager = new DarkModeManager();
});

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}
