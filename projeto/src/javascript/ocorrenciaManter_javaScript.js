$(document).ready(function() {
    
    // Tipo de Ocorrências
    let dblOcorrenciaTipo = $('#selectOcorrenciaTipo');
    selectElementCriarOpionDinamicamente (`/api/ocorrenciaTipoRoute/listar/0`, dblOcorrenciaTipo.attr('id'));
    
    dblOcorrenciaTipo.on('change', function() {

        validacoes ('/api/ocorrenciaTipoRoute/listar/'+ this.value);

        selectElementCriarOpionDinamicamente ('/api/ocorrenciaSubTipoRoute/listar/'+ this.value, 'selectOcorrenciaSubTipo');
    });

    // Curso
    let selectCurso = $('#selectCurso');
    let hdnidCursoalunologado = $('#hdnidCurso_alunologado');
    
    selectElementCriarOpionDinamicamente (
        '/api/cursoRoute/listar/0', 
        selectCurso.attr('id'), 
        true, 
        hdnidCursoalunologado.val());
    
    selectCurso.on('change', function() {
        montaElementoReponsavelOcorrencia(this.value);
    });

     // Responsavel
     selectElementCriarOpionDinamicamente ('/api/pessoaRoute/listar/0', 'selectResponsavel');
});


/**
 * Monta o elemento html para mostrar os responsáveis financeiros do tipo de ocorrências selecinada
 * @param {*} idCurso 
 */
async function montaElementoReponsavelOcorrencia (idCurso){
    
    //let retornoAjax = null;
    let dblOcorrenciaTipo = $('#selectOcorrenciaTipo');
    let ulResponsavelOcorrencia = $('#ulResponsavelOcorrencia');

    ulResponsavelOcorrencia.empty();

    if (idCurso != null && idCurso != undefined){
        //const retornoAjax = await conexaoAjaxFetch ('/api/pessoaRoute/listarCoordenadoByCurso/'+ idCurso);
        conexaoAjaxFetch ('/api/pessoaRoute/listarCoordenadoByCurso/'+ idCurso)
        .then(data => {
            data.forEach(item => {
                let li = $('<li>');
                li.addClass('list-group-item');
                li.append('<i class="fa-solid fa-people-group fa-lg"></i>  ');
                li.append(item.texto);
                ulResponsavelOcorrencia.append(li);
            });    
        });
    }

    //if (dblOcorrenciaTipo.length > 0) 
   // const    retornoAjax = await conexaoAjaxFetch ('/api/responsavelRoute/listar/'+ dblOcorrenciaTipo.val());


    //    console.log(retornoAjax);

    //     ulResponsavelOcorrencia.empty();

    //     retornoAjax.then(data => {
            
    //         data.forEach(item => {
    //             let li = document.createElement('li');
    //             li.textContent = item.texto;
    //             ulResponsavelOcorrencia.appendChild(li);
    //         });
    //     }).catch(error => {
    //         console.error('Ocorreu um erro em montaElementoReponsavelOcorrencia :', error);
    //     });
    // selectElementCriarOpionDinamicamente (
    //     '/api/pessoaRoute/listarCoordenadoByCurso/'+ idCurso, 
    //     'selectResponsavel', 
    //     false, 
    //     $(this).val()
}

function validacoes (rotaAPIValidar) {

    fetch(rotaAPIValidar)
    .then(response => response.json())
    .then(data => {
        
        // Nesse caso exige que um curso seja selecionado
        if (data[0].icResponsavelCoordenadorCurso){
            
            if ($('#selectCurso').val() <= 0){
                
                var mensagemAlert = $('#mensagemAlert');
                mensagemAlert.html('É preciso informar o curso quando seleciona o tipo de ocorrência ' +  data[0].texto);
                mensagemAlert.show();
                setTimeout(function() { mensagemAlert.fadeOut(); }, 10000);
                
            }
        }
    })
    .catch(error => console.error('Erro:', error));
}
