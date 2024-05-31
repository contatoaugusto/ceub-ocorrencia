    var formManter = $('#formManteridOcorrenciaTipo');
    var hiddenResponsavelConfiguradoList = $('#hiddenResponsavelConfiguradoList');
 
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
                
                montaJsonElementosSelecionados( $('#optionsOcorrenciaSelecionadoPessoa'), hiddenResponsavelConfiguradoList);
                montaJsonElementosSelecionados( $('#optionsOcorrenciaSelecionadoPerfil'), hiddenResponsavelConfiguradoList);

                carregarConteudoMain('/api/ocorrenciaTipo/salvar', 'POST', formManter.attr('id'));    
            }
        });


        montaElementoMultiploOptions (
            $('#optionsOcorrenciaBotaoAddPessoa'), 
            $('#optionsOcorrenciaDisponiveisPessoa').attr('id'), 
            $('#optionsOcorrenciaSelecionadoPessoa').attr('id'));

        montaElementoMultiploOptions (
            $('#optionsOcorrenciaBotaoAddPerfil'), 
            $('#optionsOcorrenciaDisponiveisPerfil').attr('id'), 
            $('#optionsOcorrenciaSelecionadoPerfil').attr('id'));

    });
