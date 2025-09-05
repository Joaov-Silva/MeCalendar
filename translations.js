// Sistema de traduções
const translations = {
    'pt-BR': {
        // Navegação
        'calendar': 'Calendário',
        'clients': 'Clientes',
        'reports': 'Relatórios',
        'settings': 'Configurações',
        'owner': 'Proprietário',
        'dark_mode': 'Modo Escuro',
        'home': 'Início',
        'login': 'Fazer Login',
        
        // Página inicial
        'new_feature': '✨ Novo: Sistema de lembretes automáticos',
        'organize_schedule': 'Organize sua agenda',
        'with_ease': 'com facilidade',
        'hero_description': 'MeCalendar, um sistema completo para organizar horários, agendamentos e clientes de forma simples e eficiente. Ideal para profissionais autônomos e pequenos estabelecimentos.',
        'create_account': 'Criar Conta',
        'view_demo': 'Ver Demonstração',
        'access_dashboard': 'Acessar Dashboard',
        'view_calendar': 'Ver Calendário',
        'access_calendar': 'Acessar Calendário',
        'easy_to_use': 'Fácil de usar',
        'intuitive_interface': 'Interface intuitiva',
        'fully_functional': 'Totalmente funcional',
        'main_features': 'Recursos principais do MeCalendar',
        'features_description': 'Funcionalidades desenvolvidas para facilitar a gestão de agendamentos e horários no MeCalendar',
        'smart_calendar': 'Calendário Inteligente',
        'smart_calendar_description': 'Visualize todos os seus agendamentos em um calendário intuitivo. Organize horários, bloqueie períodos e evite conflitos.',
        'client_management': 'Gestão de Clientes',
        'client_management_description': 'MeCalendar, um sistema completo para cadastrar e gerenciar informações dos seus clientes de forma organizada.',
        'appointment_creation': 'Criação de Agendamentos',
        'appointment_creation_description': 'Crie e gerencie agendamentos para seus clientes de forma rápida e eficiente.',
        'notification_system': 'Sistema de Notificações',
        'notification_system_description': 'Lembretes automáticos para não esquecer seus compromissos e agendamentos.',
        'security': 'Segurança',
        'security_description': 'Sistema seguro com autenticação por token, senhas criptografadas e controle de sessão.',
        'responsive': 'Responsivo',
        'responsive_description': 'Interface adaptável para todos os dispositivos, desde smartphones até desktops.',
        'start_using_today': 'Comece a usar hoje mesmo',
        'cta_description': 'Experimente todas as funcionalidades do MeCalendar',
        
        // Calendário
        'manage_appointments': 'Gerencie seus agendamentos',
        'new_appointment': 'Novo Agendamento',
        'export': 'Exportar',
        'appointment_details': 'Detalhes do Agendamento',
        'client': 'Cliente',
        'phone': 'Telefone',
        'service_type': 'Tipo de Serviço',
        'service_description': 'Descrição do Serviço',
        'date': 'Data',
        'time': 'Horário',
        'value': 'Valor',
        'status': 'Status',
        'notes': 'Observações',
        'edit': 'Editar',
        'call': 'Ligar',
        'cancel': 'Cancelar',
        'client_name': 'Nome do Cliente',
        'client_phone': 'Telefone',
        'client_email': 'Email (opcional)',
        'service_type_placeholder': 'Ex: Corte de cabelo, Manicure, Consulta, etc.',
        'service_description_placeholder': 'Descreva detalhadamente o que será realizado...',
        'duration': 'Duração Estimada (minutos)',
        'service_value': 'Valor do Serviço (R$)',
        'additional_notes': 'Observações Adicionais',
        'additional_notes_placeholder': 'Informações extras, preferências do cliente, etc.',
        'initial_status': 'Status Inicial',
        'scheduled': 'Agendado',
        'confirmed': 'Confirmado',
        'pending': 'Pendente',
        'save_appointment': 'Salvar Agendamento',
        'select_client': 'Selecione um cliente',
        'add_new_client': 'Adicionar Novo Cliente...',
        
        // Clientes
        'manage_clients': 'Gerencie sua base de clientes',
        'new_client': 'Novo Cliente',
        'search_clients': 'Buscar clientes...',
        'no_clients_found': 'Nenhum cliente encontrado',
        'client_details': 'Detalhes do Cliente',
        'full_name': 'Nome Completo',
        'birth_date': 'Data de Nascimento',
        'address': 'Endereço',
        'observations': 'Observações',
        'active': 'Ativo',
        'inactive': 'Inativo',
        'save_client': 'Salvar Cliente',
        'client_deleted': 'Cliente excluído com sucesso!',
        'client_updated': 'Cliente atualizado!',
        'client_created': 'Cliente criado!',
        'edit_client': 'Editar Cliente',
        'confirm_delete_client': 'Tem certeza que deseja excluir este cliente?',
        'conflict_warning_message': 'Este agendamento conflita com outro ou está muito próximo. Deseja salvar mesmo assim?',
        'fill_required_fields': 'Por favor, preencha todos os campos obrigatórios!',
        'negative_value_error': 'O valor do agendamento não pode ser negativo!',
        'error_loading_clients': 'Erro ao carregar clientes.',
        'error_loading_clients_generic': 'Erro ao carregar clientes. Tente novamente.',
        'error_loading_client_details': 'Erro ao carregar detalhes do cliente.',
        'error_editing_client': 'Erro ao carregar dados do cliente para edição.',
        'error_deleting_client': 'Erro ao excluir cliente.',
        'error_saving_client': 'Erro ao salvar cliente.',
        
        // Serviços (nova tela)
        'services': 'Serviços',
        'manage_active_appointments': 'Gerencie seus agendamentos ativos',
        'no_active_appointments': 'Nenhum agendamento ativo encontrado.',
        'actions': 'Ações',
        'edit_appointment': 'Editar Agendamento',
        'confirm_cancel_appointment': 'Tem certeza que deseja cancelar este agendamento?',
        'appointment_cancelled_success': 'Agendamento cancelado com sucesso!',
        'error_cancelling_appointment': 'Erro ao cancelar agendamento.',
        'appointment_updated_success': 'Agendamento atualizado com sucesso!',
        
        // Relatórios
        'track_metrics': 'Acompanhe métricas e desempenho dos atendimentos',
        'print': 'Imprimir',
        'appointments_this_month': 'Atendimentos no mês',
        'estimated_revenue': 'Receita estimada',
        'cancellations': 'Cancelamentos',
        'confirmation_rate': 'Taxa de confirmação',
        'recent_appointments': 'Últimos atendimentos',
        'no_data_yet': 'Sem dados ainda.',
        
        // Configurações
        'customize_experience': 'Personalize sua experiência e preferências do MeCalendar',
        'general_preferences': 'Preferências Gerais',
        'system_language': 'Idioma do sistema',
        'portuguese_brazil': 'Português (Brasil)',
        'english': 'English',
        'timezone': 'Fuso horário',
        'brasilia': 'GMT-3 (Brasília)',
        'manaus': 'GMT-4 (Manaus)',
        'appearance': 'Aparência',
        'theme': 'Tema',
        'light': 'Claro',
        'dark': 'Escuro',
        'font_size': 'Tamanho da fonte',
        'default': 'Padrão',
        'large': 'Grande',
        'account': 'Conta',
        'name': 'Nome',
        'email': 'Email',
        'save_changes': 'Salvar alterações',
        'data_saved_successfully': 'Dados salvos no servidor com sucesso.',
        'fill_name_email': 'Preencha nome e email.',
        
        // Dias da semana
        'sun': 'Dom',
        'mon': 'Seg',
        'tue': 'Ter',
        'wed': 'Qua',
        'thu': 'Qui',
        'fri': 'Sex',
        'sat': 'Sáb',
        
        // Meses
        'january': 'Janeiro',
        'february': 'Fevereiro',
        'march': 'Março',
        'april': 'Abril',
        'may': 'Maio',
        'june': 'Junho',
        'july': 'Julho',
        'august': 'Agosto',
        'september': 'Setembro',
        'october': 'Outubro',
        'november': 'Novembro',
        'december': 'Dezembro'
    },
    'en': {
        // Navigation
        'calendar': 'Calendar',
        'clients': 'Clients',
        'reports': 'Reports',
        'settings': 'Settings',
        'owner': 'Owner',
        'dark_mode': 'Dark Mode',
        'home': 'Home',
        'login': 'Login',
        
        // Home page
        'new_feature': '✨ New: Automatic reminder system',
        'organize_schedule': 'Organize your schedule',
        'with_ease': 'with ease',
        'hero_description': 'Complete system to organize schedules, appointments and clients in a simple and efficient way. Ideal for self-employed professionals and small businesses.',
        'create_account': 'Create Account',
        'view_demo': 'View Demo',
        'access_dashboard': 'Access Dashboard',
        'view_calendar': 'View Calendar',
        'access_calendar': 'Access Calendar',
        'easy_to_use': 'Easy to use',
        'intuitive_interface': 'Intuitive interface',
        'fully_functional': 'Fully functional',
        'main_features': 'Main system features',
        'features_description': 'Features developed to facilitate appointment and schedule management',
        'smart_calendar': 'Smart Calendar',
        'smart_calendar_description': 'View all your appointments in an intuitive calendar. Organize schedules, block periods and avoid conflicts.',
        'client_management': 'Client Management',
        'client_management_description': 'Complete system to register and manage your client information in an organized way.',
        'appointment_creation': 'Appointment Creation',
        'appointment_creation_description': 'Create and manage appointments for your clients quickly and efficiently.',
        'notification_system': 'Notification System',
        'notification_system_description': 'Automatic reminders so you don\'t forget your commitments and appointments.',
        'security': 'Security',
        'security_description': 'Secure system with token authentication, encrypted passwords and session control.',
        'responsive': 'Responsive',
        'responsive_description': 'Adaptable interface for all devices, from smartphones to desktops.',
        'start_using_today': 'Start using today',
        'cta_description': 'Try all the appointment system features',
        
        // Calendar
        'manage_appointments': 'Manage your appointments',
        'new_appointment': 'New Appointment',
        'export': 'Export',
        'appointment_details': 'Appointment Details',
        'client': 'Client',
        'phone': 'Phone',
        'service_type': 'Service Type',
        'service_description': 'Service Description',
        'date': 'Date',
        'time': 'Time',
        'value': 'Value',
        'status': 'Status',
        'notes': 'Notes',
        'edit': 'Edit',
        'call': 'Call',
        'cancel': 'Cancel',
        'client_name': 'Client Name',
        'client_phone': 'Phone',
        'client_email': 'Email (optional)',
        'service_type_placeholder': 'Ex: Haircut, Manicure, Consultation, etc.',
        'service_description_placeholder': 'Describe in detail what will be performed...',
        'duration': 'Estimated Duration (minutes)',
        'service_value': 'Service Value ($)',
        'additional_notes': 'Additional Notes',
        'additional_notes_placeholder': 'Extra information, client preferences, etc.',
        'initial_status': 'Initial Status',
        'scheduled': 'Scheduled',
        'confirmed': 'Confirmed',
        'pending': 'Pending',
        'save_appointment': 'Save Appointment',
        'select_client': 'Select a client',
        'add_new_client': 'Add New Client...',
        
        // Clients
        'manage_clients': 'Manage your client base',
        'new_client': 'New Client',
        'search_clients': 'Search clients...',
        'no_clients_found': 'No clients found',
        'client_details': 'Client Details',
        'full_name': 'Full Name',
        'birth_date': 'Birth Date',
        'address': 'Address',
        'observations': 'Observations',
        'active': 'Active',
        'inactive': 'Inactive',
        'save_client': 'Save Client',
        'client_deleted': 'Client deleted successfully!',
        'client_updated': 'Client updated!',
        'client_created': 'Client created!',
        'edit_client': 'Edit Client',
        'confirm_delete_client': 'Are you sure you want to delete this client?',
        'conflict_warning_message': 'This appointment conflicts with another or is too close. Do you want to save anyway?',
        'fill_required_fields': 'Please fill in all required fields!',
        'negative_value_error': 'Appointment value cannot be negative!',
        'error_loading_clients': 'Error loading clients.',
        'error_loading_clients_generic': 'Error loading clients. Try again.',
        'error_loading_client_details': 'Error loading client details.',
        'error_editing_client': 'Error loading client data for editing.',
        'error_deleting_client': 'Error deleting client.',
        'error_saving_client': 'Error saving client.',
        
        // Services (new screen)
        'services': 'Services',
        'manage_active_appointments': 'Manage your active appointments',
        'no_active_appointments': 'No active appointments found.',
        'actions': 'Actions',
        'edit_appointment': 'Edit Appointment',
        'confirm_cancel_appointment': 'Are you sure you want to cancel this appointment?',
        'appointment_cancelled_success': 'Appointment cancelled successfully!',
        'error_cancelling_appointment': 'Error cancelling appointment.',
        'appointment_updated_success': 'Appointment updated successfully!',
        
        // Reports
        'track_metrics': 'Track metrics and appointment performance',
        'print': 'Print',
        'appointments_this_month': 'Appointments this month',
        'estimated_revenue': 'Estimated revenue',
        'cancellations': 'Cancellations',
        'confirmation_rate': 'Confirmation rate',
        'recent_appointments': 'Recent appointments',
        'no_data_yet': 'No data yet.',
        
        // Settings
        'customize_experience': 'Customize your experience and system preferences',
        'general_preferences': 'General Preferences',
        'system_language': 'System language',
        'portuguese_brazil': 'Português (Brasil)',
        'english': 'English',
        'timezone': 'Timezone',
        'brasilia': 'GMT-3 (Brasília)',
        'manaus': 'GMT-4 (Manaus)',
        'appearance': 'Appearance',
        'theme': 'Theme',
        'light': 'Light',
        'dark': 'Dark',
        'font_size': 'Font size',
        'default': 'Default',
        'large': 'Large',
        'account': 'Account',
        'name': 'Name',
        'email': 'Email',
        'save_changes': 'Save changes',
        'data_saved_successfully': 'Data saved to server successfully.',
        'fill_name_email': 'Fill in name and email.',
        
        // Days of week
        'sun': 'Sun',
        'mon': 'Mon',
        'tue': 'Tue',
        'wed': 'Wed',
        'thu': 'Thu',
        'fri': 'Fri',
        'sat': 'Sat',
        
        // Months
        'january': 'January',
        'february': 'February',
        'march': 'March',
        'april': 'April',
        'may': 'May',
        'june': 'June',
        'july': 'July',
        'august': 'August',
        'september': 'September',
        'october': 'October',
        'november': 'November',
        'december': 'December'
    }
};

// Função para obter tradução
function t(key, lang = null) {
    const currentLang = lang || getCurrentLanguage();
    return translations[currentLang]?.[key] || key;
}

// Função para obter idioma atual
function getCurrentLanguage() {
    const settings = JSON.parse(localStorage.getItem('MeCalendarSettings') || '{}');
    return settings.language || 'pt-BR';
}

// Função para aplicar traduções
function applyTranslations(lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key, currentLang);
        element.textContent = translation;
    });
    
    // Aplicar traduções para placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = t(key, currentLang);
        element.placeholder = translation;
    });
    
    // Atualizar atributo lang do HTML
    document.documentElement.lang = currentLang;
}

// Função para definir idioma
function setLanguage(lang) {
    const settings = JSON.parse(localStorage.getItem('MeCalendarSettings') || '{}');
    settings.language = lang;
    localStorage.setItem('MeCalendarSettings', JSON.stringify(settings));
    applyTranslations(lang);
    
    // Recarregar a página para aplicar todas as traduções
    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// Aplicar traduções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
});
