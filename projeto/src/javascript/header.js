
$(document).ready(function() {
    
    // Carrega sempre a listagem de ocorrências como sendo a página inicial
    carregarConteudoMain("/api/ocorrencia/listar");
   
    let mensagemAlert = $('#mensagemAlert');

    mensagemAlert.on('click', function() {
        mensagemAlert.addClass('invisible');
    });
    
    if (mensagemAlert.html().trim().length > 0 )
        mensagemAlert.show();

    // $('.nav-link').click(function(e) {
    //     e.preventDefault();
    //     var elementosIrmaos = $(this).parent().siblings('li').not($(this));;
    //     elementosIrmaos.removeClass('activeOcorrencia');
    // });

    // Script para controlar a exibição dos submenus
    $('.nav-link').click(function(e) {
        e.preventDefault();
        
        $(this).addClass('activeOcorrencia');
 
        var submenu_Destino_ID = $(this).attr('href');
        if (submenu_Destino_ID !== '#')
            $(submenu_Destino_ID).toggleClass('show');

        var submenu_SetaAbreFecha = $(this).find('i').first();
        
        if (submenu_SetaAbreFecha.hasClass('fa-plus'))
            submenu_SetaAbreFecha.removeClass('fa-plus').addClass('fa-minus');
        else
            submenu_SetaAbreFecha.removeClass('fa-minus').addClass('fa-plus');

        // Remover os ative links dos outros elementos que não o clicado
        // Procura todos os elementos <li> irmão do elmento <li> pai deste elemento aqui clicado <a> ($(this)) 
        var liElementsIrmaos = $(this).parent().siblings('li').not($(this));
        // Procura todos os elementos <a> contido dentro dos elementos <li> irmãos
        liElementsIrmaos.find('a').removeClass('activeOcorrencia');
       
       // $(this).nextAll().find('.nav-link').removeClass('activeOcorrencia');

    });
});

function carregarConteudoMain (rotaPagina, metodo = 'GET', formularioId = {}){

    let opcoesFetch = {
        method: metodo,
    };

    if (metodo === 'POST' && formularioId.length) {

            var formObject = {};
            $('form[id="' + formularioId + '"] :input').each(function() {
                formObject[$(this).attr('id')] = $(this).val();
            });

            const requestBody = new URLSearchParams(formObject).toString();
            alert ('Teste');
            // Converte os dados do formulário em formato URL-encoded
            opcoesFetch.body = requestBody; 
            console.log(opcoesFetch);
    }
 
    fetch(rotaPagina, opcoesFetch)
    .then(response => response.text())
    .then(data => {
        $('#divMainConteudo').empty();
        $('#divMainConteudo').html(data);
    }).catch(error => {
        console.error('Ocorreu um erro ao carregar a página: ' + rotaPagina, error);
    });
}