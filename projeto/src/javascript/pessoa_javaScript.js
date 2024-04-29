var formManter = $('#formManterPessoa');

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
            carregarConteudoMain('/api/pessoa/salvar', 'POST', formManter.attr('id'));    
            //this.submit();
        }
    });

});


