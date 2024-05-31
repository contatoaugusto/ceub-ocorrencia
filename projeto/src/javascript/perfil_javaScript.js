var formManter = $('#formManterPerfil');

/**
 *  Função principal que roda quando todo o documento DOM é carregado
 */
$(document).ready(function() {
    
    
    /**
     * Validações do formulario antes do submit
     */
    formManter.on('submit', function(event) {
        
        event.preventDefault();

        if (validarCamposObrigatoriosForm(formManter)) {

            montaJsonElementosSelecionados( $('#optionsOcorrenciaSelecionadoPessoa'), $('#hiddenResponsavelConfiguradoList'));
            
            carregarConteudoMain('/api/perfil/salvar', 'POST', formManter.attr('id'));    
        }
    });

    
    montaElementoMultiploOptions (
        $('#optionsOcorrenciaBotaoAddPessoa'), 
        $('#optionsOcorrenciaDisponiveisPessoa').attr('id'), 
        $('#optionsOcorrenciaSelecionadoPessoa').attr('id'));
});


