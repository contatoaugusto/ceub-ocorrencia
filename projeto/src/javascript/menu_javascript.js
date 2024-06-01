    var formManter = $('#formMenuPerfil');
    
    /**
     *  Função principal que roda quando todo o documento DOM é carregado
     */
    $(document).ready(function() {
        
        // Monta dinamicamente o dropdownlist de Subtipo Ocorrências
        selectElementCriarOpionDinamicamente ('/api/menu/listarJson/0', 'ddlMenuPai', false, $('#idMenuPai').val());


        /**
         * Validações do formulario antes do submit
         */
        formManter.on('submit', function(event) {
            
            event.preventDefault();

            if (validarCamposObrigatoriosForm(formManter)) {
                
                montaJsonElementosSelecionados( $('#optionsOcorrenciaSelecionadoPerfil'), $('#hiddenMenuPerfilConfiguradoList'));

                carregarConteudoMain('/api/menu/salvar', 'POST', formManter.attr('id'));    
            }
        });


        montaElementoMultiploOptions (
            $('#optionsOcorrenciaBotaoAddPerfil'), 
            $('#optionsOcorrenciaDisponiveisPerfil').attr('id'), 
            $('#optionsOcorrenciaSelecionadoPerfil').attr('id'));

    });
