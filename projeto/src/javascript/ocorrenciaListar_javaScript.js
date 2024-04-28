$(document).ready(function() {
    
    $('#btnOcorrenciaIncluirInit').on('click', function() {
        //window.location.href = '/api/ocorrencia/incluirInit/0';
        carregarConteudoMain("/api/ocorrencia/incluirInit/0");
        //fetch(`/api/ocorrencia/incluirInit/1`);
    });
    
});