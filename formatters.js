// formatters.js - Funções de formatação para campos do sistema

class Formatters {
    
    /**
     * Formata número de telefone brasileiro
     * @param {string} value - Valor do campo
     * @returns {string} - Telefone formatado
     */
    static formatPhone(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 11 dígitos (DDD + 9 dígitos)
        numbers = numbers.substring(0, 11);
        
        // Aplica máscara baseada no número de dígitos
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 2) {
            return `(${numbers}`;
        } else if (numbers.length <= 6) {
            return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
        } else if (numbers.length <= 10) {
            return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
        } else {
            return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
        }
    }
    
    /**
     * Formata valor monetário brasileiro
     * @param {string} value - Valor do campo
     * @returns {string} - Valor formatado
     */
    static formatCurrency(value) {
        // Remove tudo que não é número ou vírgula
        let numbers = value.replace(/[^\d,]/g, '');
        
        // Converte vírgula para ponto para cálculos
        numbers = numbers.replace(',', '.');
        
        // Converte para número
        let num = parseFloat(numbers) || 0;
        
        // Formata para moeda brasileira
        return num.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });
    }
    
    /**
     * Formata CPF brasileiro
     * @param {string} value - Valor do campo
     * @returns {string} - CPF formatado
     */
    static formatCPF(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        numbers = numbers.substring(0, 11);
        
        // Aplica máscara
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 6) {
            return `${numbers.substring(0, 3)}.${numbers.substring(3)}`;
        } else if (numbers.length <= 9) {
            return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6)}`;
        } else {
            return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9)}`;
        }
    }
    
    /**
     * Formata CEP brasileiro
     * @param {string} value - Valor do campo
     * @returns {string} - CEP formatado
     */
    static formatCEP(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 8 dígitos
        numbers = numbers.substring(0, 8);
        
        // Aplica máscara
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 5) {
            return numbers;
        } else {
            return `${numbers.substring(0, 5)}-${numbers.substring(5)}`;
        }
    }
    
    /**
     * Formata CNPJ brasileiro
     * @param {string} value - Valor do campo
     * @returns {string} - CNPJ formatado
     */
    static formatCNPJ(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 14 dígitos
        numbers = numbers.substring(0, 14);
        
        // Aplica máscara
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 5) {
            return `${numbers.substring(0, 2)}.${numbers.substring(2)}`;
        } else if (numbers.length <= 8) {
            return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5)}`;
        } else if (numbers.length <= 12) {
            return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5, 8)}/${numbers.substring(8)}`;
        } else {
            return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5, 8)}/${numbers.substring(8, 12)}-${numbers.substring(12)}`;
        }
    }
    
    /**
     * Formata data brasileira
     * @param {string} value - Valor do campo
     * @returns {string} - Data formatada
     */
    static formatDate(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 8 dígitos (DDMMAAAA)
        numbers = numbers.substring(0, 8);
        
        // Aplica máscara
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 4) {
            return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
        } else {
            return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4)}`;
        }
    }
    
    /**
     * Formata hora brasileira
     * @param {string} value - Valor do campo
     * @returns {string} - Hora formatada
     */
    static formatTime(value) {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, '');
        
        // Limita a 4 dígitos (HHMM)
        numbers = numbers.substring(0, 4);
        
        // Aplica máscara
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 2) {
            return numbers;
        } else {
            return `${numbers.substring(0, 2)}:${numbers.substring(2)}`;
        }
    }
    
    /**
     * Aplica formatação automática em campos
     * @param {HTMLElement} input - Campo de input
     * @param {string} type - Tipo de formatação
     */
    static applyFormatting(input, type) {
        const value = input.value;
        let formatted = '';
        
        switch (type) {
            case 'phone':
                formatted = this.formatPhone(value);
                break;
            case 'currency':
                formatted = this.formatCurrency(value);
                break;
            case 'cpf':
                formatted = this.formatCPF(value);
                break;
            case 'cep':
                formatted = this.formatCEP(value);
                break;
            case 'cnpj':
                formatted = this.formatCNPJ(value);
                break;
            case 'date':
                formatted = this.formatDate(value);
                break;
            case 'time':
                formatted = this.formatTime(value);
                break;
            default:
                formatted = value;
        }
        
        input.value = formatted;
    }
    
    /**
     * Inicializa formatação automática em todos os campos
     */
    static init() {
        // Campos de telefone
        document.querySelectorAll('input[type="tel"], input[name*="phone"], input[name*="telefone"], input[id*="phone"], input[id*="telefone"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyFormatting(e.target, 'phone');
            });
            
            input.addEventListener('blur', (e) => {
                this.applyFormatting(e.target, 'phone');
            });
        });
        
        // Campos de valor/moeda
        document.querySelectorAll('input[name*="value"], input[name*="valor"], input[name*="price"], input[name*="preco"], input[id*="value"], input[id*="valor"], input[id*="price"], input[id*="preco"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyFormatting(e.target, 'currency');
            });
            
            input.addEventListener('blur', (e) => {
                this.applyFormatting(e.target, 'currency');
            });
        });
        
        // Campos de CPF
        document.querySelectorAll('input[name*="cpf"], input[id*="cpf"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyFormatting(e.target, 'cpf');
            });
        });
        
        // Campos de CEP
        document.querySelectorAll('input[name*="cep"], input[id*="cep"], input[name*="postal"], input[id*="postal"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyFormatting(e.target, 'cep');
            });
        });
        
        // Campos de CNPJ
        document.querySelectorAll('input[name*="cnpj"], input[id*="cnpj"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.applyFormatting(e.target, 'cnpj');
            });
        });
        
        // Campos de data
        document.querySelectorAll('input[name*="date"], input[id*="date"], input[name*="data"], input[id*="data"]').forEach(input => {
            if (input.type !== 'date') {
                input.addEventListener('input', (e) => {
                    this.applyFormatting(e.target, 'date');
                });
            }
        });
        
        // Campos de hora
        document.querySelectorAll('input[name*="time"], input[id*="time"], input[name*="hora"], input[id*="hora"]').forEach(input => {
            if (input.type !== 'time') {
                input.addEventListener('input', (e) => {
                    this.applyFormatting(e.target, 'time');
                });
            }
        });
    }
    
    /**
     * Aplica formatação em campo específico
     * @param {string} selector - Seletor CSS do campo
     * @param {string} type - Tipo de formatação
     */
    static formatField(selector, type) {
        const input = document.querySelector(selector);
        if (input) {
            this.applyFormatting(input, type);
        }
    }
}

// Inicializa formatação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    Formatters.init();
});

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Formatters;
}
