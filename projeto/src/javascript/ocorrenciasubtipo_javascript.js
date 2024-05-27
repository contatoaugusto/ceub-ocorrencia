var formManter = $('#formManterOcorrenciaSubtipo');

/**
 *  Função principal que roda quando todo o documento DOM é carregado
 */
$(document).ready(function() {
    
    
    // Monta dinamicamente o dropdownlist de Subtipo Ocorrências
    selectElementCriarOpionDinamicamente ('/api/ocorrenciaTipo/listarJson/0', 'ddlOcorrenciaTipo', false, $('#idOcorrenciaTipo').val());


    /**
     * Validações do formulario antes do submit
     */
    formManter.on('submit', function(event) {
        
        event.preventDefault();

        if (validarCamposObrigatoriosForm(formManter)) {
            carregarConteudoMain('/api/ocorrenciaSubTipo/salvar', 'POST', formManter.attr('id'));    
        }
    });


    $('#ddlOcorrenciaTipo').on('change', function() {
        $('#idOcorrenciaTipo').val(this.value);
    });
    

});


