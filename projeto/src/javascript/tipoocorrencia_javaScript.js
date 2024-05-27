    var formManter = $('#formManteridOcorrenciaTipo');
    var responsavelConfiguradoList = $('#responsavelConfiguradoList');
    var reponsavelTipoOcorrencia_pessoaPerfil = [];
    var TIPO_CHAVE_PESSOA = 'PESSOA';
    var TIPO_CHAVE_PERFIL = 'PERFIL';

    /**
     *  Função principal que roda quando todo o documento DOM é carregado
     */
    $(document).ready(function() {
        
        
        /**
         * Validações do formulario antes do submit
         */
        formManter.on('submit', function(event) {
            
            event.preventDefault();

            responsavelConfiguradoList.val(JSON.stringify(reponsavelTipoOcorrencia_pessoaPerfil));

            if (validarCamposObrigatoriosForm(formManter)) {
                carregarConteudoMain('/api/ocorrenciaTipo/salvar', 'POST', formManter.attr('id'));    
            }
        });


        montaElementoMultiploOptions ('optionsOcorrenciaBotaoAddPessoa', 'optionsOcorrenciaDisponiveisPessoa', 'optionsOcorrenciaSelecionadoPessoa');
        montaElementoMultiploOptions ('optionsOcorrenciaBotaoAddPerfil', 'optionsOcorrenciaDisponiveisPerfil', 'optionsOcorrenciaSelecionadoPerfil');
    });


    /**
     * Trecho onde é feito o tratamento para os elementos de multiplos valores e seleção
     */
    function montaElementoMultiploOptions (botaoAdcionarItem, elementoOptionDisponiveis, elementoOptionSelecionados){

        document.getElementById(botaoAdcionarItem).addEventListener('click', function(event) {
        
            event.preventDefault();

            var availableOptions = document.querySelectorAll('#' + elementoOptionDisponiveis + ' .list-group-item.active');
            var selectedOptionsContainer = document.getElementById(elementoOptionSelecionados);
            
            availableOptions.forEach(function(option) {

                var li_OptionSelecionado = document.createElement('li');
                li_OptionSelecionado.textContent = option.getAttribute('data-text');
                li_OptionSelecionado.classList.add('list-group-item');
                li_OptionSelecionado.setAttribute ('data-value', option.getAttribute('data-value'));
                
                // Adiciona a chaves ao json
                if (botaoAdcionarItem.toUpperCase().indexOf(TIPO_CHAVE_PESSOA) !== -1)
                    adicionarPessoaPerfil (option.getAttribute('data-value'), 0);
                else if (botaoAdcionarItem.toUpperCase().indexOf(TIPO_CHAVE_PERFIL) !== -1)
                    adicionarPessoaPerfil (0, option.getAttribute('data-value'));
                
                var removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remover';
                removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right');
                
                // Remove o item das opções de responsáveis
                removeBtn.addEventListener('click', function() {

                    for (let i = 0; i < reponsavelTipoOcorrencia_pessoaPerfil.length; i++) {
                        
                        let valor = li_OptionSelecionado.getAttribute('data-value');

                        if (botaoAdcionarItem.toUpperCase().indexOf(TIPO_CHAVE_PESSOA) !== -1) {
                            if (reponsavelTipoOcorrencia_pessoaPerfil[i].idPessoa === valor) {
                                reponsavelTipoOcorrencia_pessoaPerfil.splice(i, 1);
                                i--;
                            }
                        } else if (botaoAdcionarItem.toUpperCase().indexOf(TIPO_CHAVE_PERFIL) !== -1) {
                            if (reponsavelTipoOcorrencia_pessoaPerfil[i].idPerfil === valor) {
                                reponsavelTipoOcorrencia_pessoaPerfil.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    
                    // Remover o item da lista de selecionados
                    li_OptionSelecionado.remove();

                    
                    // Adicionar de volta à lista de disponíveis
                    option.classList.remove('active');
                    document.getElementById(elementoOptionDisponiveis).appendChild(option);
                    
                });

                li_OptionSelecionado.appendChild(removeBtn);
                selectedOptionsContainer.appendChild(li_OptionSelecionado);

                // Remover a opção selecionada da lista de disponíveis
                option.remove();
            });

        });
    
        // Permitir múltipla seleção com clique
        document.querySelectorAll('#' + elementoOptionDisponiveis + ' .list-group-item').forEach(function(item) {
            item.addEventListener('click', function() {
            item.classList.toggle('active');
            });
        });
    }


    function adicionarPessoaPerfil(idPessoa, idPerfil) {
        let pessoaPerfil = {
            idPessoa: idPessoa,
            idPerfil: idPerfil
        };
        reponsavelTipoOcorrencia_pessoaPerfil.push(pessoaPerfil);
    }

