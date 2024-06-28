var ddlOcorrenciaSituacao = $('#ddlOcorrenciaSituacao');
var hdnidOcorrenciaSituacao = $('#hdnidOcorrenciaSituacao');
var hdndeOcorrenciaSituacao = $('#hdndeOcorrenciaSituacao');
var hdnidOcorrencia = $('#hdnidOcorrencia');

/**
 *  Funcção principal que roda quando todo o documento DOM é carregado
 */
$(document).ready(function() {

    let divOcorrenciaHistorico = $('#divOcorrenciaHistorico');
    let divOcorrenciaHistoricoResponsabilidade = $('#divOcorrenciaHistoricoResponsabilidade');

    // Mouseover sobre uma das linhas da tabela de ocorrencia
    $('tr[id^="trOcorrenciaMinhas"]').on('mouseover', function() {
        montaListagemHistoricoOcorrencia($(this).data('id-ocorrencia'), divOcorrenciaHistorico, $('#spanHistoricoOcorrenciaMinhas'));
    });

    // Mouseover sobre uma das linhas da tabela de ocorrencia sob minhas responsabilidade
    $('tr[id^="trOcorrenciaResposabilidade"]').on('mouseover', function() {
        montaListagemHistoricoOcorrencia($(this).data('id-ocorrencia'), divOcorrenciaHistoricoResponsabilidade, $('#spanHistoricoOcorrenciaResponsabilidade'));
    });


    $('tr[id^="trOcorrenciaMinhas"]').on('mouseleave', function() {
        divOcorrenciaHistorico.html('');
        divOcorrenciaHistoricoResponsabilidade.html('');
    });


    selectElementCriarOpionDinamicamente (
        `/api/ocorrenciaSituacao/listarJson/0`, 
        ddlOcorrenciaSituacao.attr('id'));


    ddlOcorrenciaSituacao.on('change', function() {
        if (this.value > 0){
            hdnidOcorrenciaSituacao.val(this.value);
            hdndeOcorrenciaSituacao.val($(this).find("option:selected").text());
        }
    });

    $('#btnModalEmitirParecerSalvar').on('click', function(event) {
        emitirParecerSalvar(event);
    });
});
    
// Conecta no banco de dados e montar o histpiruco de cada ocorrencia ao passa o mouse por cima da linha na listagem de ocorrencias
async function montaListagemHistoricoOcorrencia (idOcorrencia, elementoHistorico, elementoSpanNumeroOcorrencia){
    
    elementoSpanNumeroOcorrencia.html('Nº ' + idOcorrencia);
    
    conexaoAjaxFetch ('/api/ocorrencia/listarJsonHistoricoOcorrencia/' + idOcorrencia)
    .then(data => {
        
        
        elementoHistorico.html('');
        
        let tabelaHistorico = $('<table>');

        data.forEach(item => {
            let tabelaHistorico_tr = $('<tr>');
            let tabelaHistorico_td_texto = $('<td>');
            //let tabelaHistorico_td_data = $('<td>');

            tabelaHistorico_td_texto.html(
                formatarDataFrom(item.dtOcorrenciaSituacao) + '<br>' + 
                (item.deOcorrenciaHistoricoSituacao == null ? 'sem descrição' : item.deOcorrenciaHistoricoSituacao) + '<br><br>');
            //tabelaHistorico_td_data.html(formatarDataFrom(item.dtOcorrenciaSituacao));
            
            tabelaHistorico_tr.append(tabelaHistorico_td_texto);
            //tabelaHistorico_tr.append(tabelaHistorico_td_data);
            
            elementoHistorico.append(tabelaHistorico_tr);
        });


    }).catch(error => {
        console.error('Ocorreu um erro em selectElementCriarOpionDinamicamente :', error);
        console.log(error);
    });

}

/**
 * Abrir a modal de emitir parecer e eventos
 * @param {*} idOcorrencia 
 */
function emitirParecerShowModal (idOcorrencia){
    
    $('#spanOcorrenciaModalEmitirParecer').html(idOcorrencia);
    hdnidOcorrencia.val(idOcorrencia);

    var modalEmitirParecer = $('#modalEmitirParecer');
    modalEmitirParecer.show();
}

function emitirParecerCloseModal (){
    $('#modalEmitirParecer').hide();
    hdnidOcorrencia.val(0);
    hdnidOcorrenciaSituacao.val(0);
    hdndeOcorrenciaSituacao.val('');
}

/**
 * Salvar de fato o novo parecer no histórico de ocorrências
 * @param { } event 
 */
function emitirParecerSalvar (event){
  
    event.preventDefault();

    let opcoesFetch = {
        method: 'POST',
    };

    var formObject = {};
    $('#modalEmitirParecerForm :input').each(function() {
        formObject[$(this).attr('id')] = $(this).val();
    });
console.log(formObject);
    var headers = {};
    headers['Content-Type'] = 'application/json'
    opcoesFetch.headers =headers

    opcoesFetch.body = JSON.stringify(formObject); 
    
    fetch('/api/ocorrencia/salvarhistoricoocorrencia', opcoesFetch)
    .then(response => response.text())
    .then(data => {

        const jsonData = JSON.parse(data);
        alert (jsonData.status);
    }).catch(error => {
        console.error('Ocorreu um erro ao carregar a página: ' + rotaPagina, error);
    });
    
    let tdOcorrenciaResposabilidade_situacao = $('#tdOcorrenciaResposabilidade_situacao_' + hdnidOcorrencia.val())
    tdOcorrenciaResposabilidade_situacao.html(hdndeOcorrenciaSituacao.val());

    emitirParecerCloseModal ();
}


