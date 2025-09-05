<!-- modal_edit_appointment.php -->
<div class="modal" id="editAppointmentModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 data-translate="edit_appointment">Editar Agendamento</h3>
            <button class="close-btn" id="closeEditAppointmentModal">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="editAppointmentForm">
                <input type="hidden" id="editAppointmentId" name="id">
                <div class="form-group">
                    <label for="editClientName" data-translate="client_name">Nome do Cliente *</label>
                    <input type="text" id="editClientName" name="client" required>
                </div>
                <div class="form-group">
                    <label for="editClientPhone" data-translate="client_phone">Telefone *</label>
                    <input type="tel" id="editClientPhone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="editClientEmail" data-translate="client_email">Email (opcional)</label>
                    <input type="email" id="editClientEmail" name="email">
                </div>
                <div class="form-group">
                    <label for="editServiceType" data-translate="service_type">Tipo de Serviço *</label>
                    <input type="text" id="editServiceType" name="serviceType" required>
                </div>
                <div class="form-group">
                    <label for="editServiceDescription" data-translate="service_description">Descrição Detalhada do Serviço</label>
                    <textarea id="editServiceDescription" name="serviceDescription" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editEventDate" data-translate="date">Data *</label>
                        <input type="date" id="editEventDate" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="editEventTime" data-translate="time">Horário *</label>
                        <input type="time" id="editEventTime" name="time" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editEventDuration" data-translate="duration">Duração Estimada (minutos)</label>
                        <input type="number" id="editEventDuration" name="duration" min="15" step="15" value="60">
                    </div>
                    <div class="form-group">
                        <label for="editEventValue" data-translate="service_value">Valor do Serviço (R$)</label>
                        <input type="number" id="editEventValue" name="value" min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>
                <div class="form-group">
                    <label for="editEventStatus" data-translate="status">Status</label>
                    <select id="editEventStatus" name="status">
                        <option value="pending" data-translate="pending">Pendente</option>
                        <option value="confirmed" data-translate="confirmed">Confirmado</option>
                        <option value="cancelled" data-translate="cancelled">Cancelado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editEventNotes" data-translate="notes">Observações</label>
                    <textarea id="editEventNotes" name="notes" rows="3"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelEditAppointment" data-translate="cancel">Cancelar</button>
            <button class="btn btn-primary" id="saveEditAppointment" data-translate="save_changes">Salvar Alterações</button>
        </div>
    </div>
</div>
