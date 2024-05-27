
var ddlPessoa = $('#ddlPessoa');

$(document).ready(function() {

     // Monta dinamicamente Curso
     selectElementCriarOpionDinamicamente (
        '/api/pessoa/listarJson/0', 
        ddlPessoa.attr('id'), 
        false, 
        null
    );

});