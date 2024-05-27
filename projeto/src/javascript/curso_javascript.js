var formManter = $('#formManterCurso');
var ddlCoordenador = $('#ddlCoordenador');

/**
 *  Função principal que roda quando todo o documento DOM é carregado
 */
$(document).ready(function() {
    
     // Monta dinamicamente Curso
     selectElementCriarOpionDinamicamente (
        '/api/pessoa/listarJson/0', 
        ddlCoordenador.attr('id'), 
        false, 
        $('#idCoordenador').val()
    );

    ddlCoordenador.on('change', function() {
        $('#idCoordenador').val(this.value);
    });

    /**
     * Validações do formulario antes do submit
     */
    formManter.on('submit', function(event) {
        
        event.preventDefault();

        if (validarCamposObrigatoriosForm(formManter)) {
            carregarConteudoMain('/api/curso/salvar', 'POST', formManter.attr('id'));    
        }
    });

});


