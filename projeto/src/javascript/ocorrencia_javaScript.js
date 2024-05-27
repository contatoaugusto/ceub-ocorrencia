var dblOcorrenciaTipo = $('#ddlOcorrenciaTipo');
var ddlCurso = $('#ddlCurso');
var hdnidCurso_AlunoLogado = $('#hdnidCurso_alunologado');
var ulResponsavelOcorrencia = $('#ulResponsavelOcorrencia');    
var hdnResponsavelFinanceiroList = $('#hdnResponsavelFinanceiroList');
var formManter = $('#formManterOcorrencia');

/**
 *  Funcção principal que roda quando todo o documento DOM é carregado
 */
$(document).ready(function() {
    
     // Monta dinamicamente Curso
     selectElementCriarOpionDinamicamente (
        '/api/curso/listarJson/0', 
        ddlCurso.attr('id'), 
        true, 
        hdnidCurso_AlunoLogado.val());
    
    ddlCurso.on('change', function() {
        if (this.value > 0)
            montaElementoReponsavelOcorrencia(this.value);
        else{
            dblOcorrenciaTipo.val(0);
            ulResponsavelOcorrencia.empty();
        }
    });

    // Monta dinamicamente Tipo de Ocorrências
    selectElementCriarOpionDinamicamente (`/api/ocorrenciaTipo/listarJson/0`, dblOcorrenciaTipo.attr('id'));
    dblOcorrenciaTipo.on('change', function() {

        validacoes ('/api/ocorrenciaTipo/listarJson/'+ this.value);

        // Monta dinamicamente o dropdownlist de Subtipo Ocorrências
        selectElementCriarOpionDinamicamente ('/api/ocorrenciaSubTipo/listarJsonByTipoOcorrencia/'+ this.value, 'ddlOcorrenciaSubTipo');

        montaElementoReponsavelOcorrencia(ddlCurso.val());
    });


    /**
     * Validações do formulario antes do submit
     */
    formManter.on('submit', function(event) {
        
        event.preventDefault();
        
        if (validacoes())
            this.submit();
    });

});


/**
 * Responsável pela Ocorrencia
 * Monta o elemento html que mostra os responsáveis financeiros para esse tipo ocorrência selecinada ou o coordenador do curso selecionado
 * @param {*} idCurso 
 */
async function montaElementoReponsavelOcorrencia (idCurso){
    
    ulResponsavelOcorrencia.empty();
    hdnResponsavelFinanceiroList.val('');

    if (idCurso != null && idCurso != undefined && idCurso > 0){
       
        conexaoAjaxFetch ('/api/pessoa/listarCoordenadoByCurso/'+ idCurso)
        .then(data => {
            data.forEach(item => {
                let li = $('<li>');
                li.addClass('list-group-item');
                li.append('<i class="fa-solid fa-chalkboard-user fa-lg"></i>   ');
                li.append(item.texto);
                ulResponsavelOcorrencia.append(li);

                //hdnResponsavelFinanceiroList.val(hdnResponsavelFinanceiroList.val() + '#' + item.id + '#');
                hdnResponsavelFinanceiroList.val((hdnResponsavelFinanceiroList.val().length > 0 ? hdnResponsavelFinanceiroList.val() + '#': '') + 'pessoa' + item.id);
            });    

            hdnResponsavelFinanceiroList.val(hdnResponsavelFinanceiroList.val() + (hdnResponsavelFinanceiroList.val().slice(-1) == '#' ? '' : '#'));
        });
    }

    if (dblOcorrenciaTipo.length > 0 && dblOcorrenciaTipo.val() != null && dblOcorrenciaTipo.val() > 0) {

        conexaoAjaxFetch ('/api/responsavel/listarByOcorrenciaTipo/'+ dblOcorrenciaTipo.val())
        .then(data => {
         
            data.forEach(item => {
                let li = $('<li>');
                li.addClass('list-group-item');

                if (item.nmEntidade != null && item.nmEntidade != undefined && item.nmEntidade === 'pessoa')
                    li.append('<i class="fa-solid fa-user fa-lg"></i>   ');
                else if (item.nmEntidade != null && item.nmEntidade != undefined && item.nmEntidade === 'perfil')
                    li.append('<i class="fa-solid fa-people-group fa-lg"></i>  ');

                li.append(item.texto);
                ulResponsavelOcorrencia.append(li);

                //hdnResponsavelFinanceiroList.val(hdnResponsavelFinanceiroList.val() + '#' + item.id);
                hdnResponsavelFinanceiroList.val((hdnResponsavelFinanceiroList.val().length > 0 ? hdnResponsavelFinanceiroList.val() + '#': '') + item.nmEntidade + item.id);
            });  
            
            hdnResponsavelFinanceiroList.val(hdnResponsavelFinanceiroList.val() + (hdnResponsavelFinanceiroList.val().slice(-1) == '#' ? '' : '#'));
        });
    }
    
    // Se não tiver nenhum responsável financeiro cadastrado, não pode prosseguir
    //if (ulResponsavelOcorrencia.children('li').length === 0) {

}

function validacoes (rotaAPIValidar) {

    
    if (rotaAPIValidar != null && rotaAPIValidar != undefined){
        fetch(rotaAPIValidar)
        .then(response => response.json())
        .then(data => {
            
            // Nesse caso exige que um curso seja selecionado
            if (data[0].icResponsavelCoordenadorCurso){
                if (parseInt($('#ddlCurso').val()) <= 0)
                    mostraMensagemErroAlertaNotificacao('É preciso informar o curso quando seleciona o tipo de ocorrência ' +  data[0].texto, 'alert-warning');
            }
        })
        .catch(error => console.error('Erro:', error));
    } else {

        return validarCamposObrigatoriosForm(formManter);
    }

}

