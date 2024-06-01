
$(document).ready(function() {
    
    // Carrega sempre a listagem de ocorrências como sendo a página inicial
    carregarConteudoMain ("/api/ocorrencia/listar");
    carregarConteudoMenu ('/api/menu/montamenuByUsuario');
   
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
    //adicionaEventosSubmenu ();
});

/**
 * Adiciona eventos para ontrolar a exibição dos submenus
 */
function adicionaEventosSubmenu (){
    
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
}


/**
 *  Monta o conteúdo principal da tela sempre via fetch. Tanto GET quanto POST
 * @param {*} rotaPagina 
 * @param {*} metodo 
 * @param {*} formularioId 
 */
function carregarConteudoMain (rotaPagina, metodo = 'GET', formularioId = {}){

    let opcoesFetch = {
        method: metodo,
    };

    if (metodo === 'POST' && formularioId.length) {

        var formObject = {};
        $('form[id="' + formularioId + '"] :input').each(function() {
            formObject[$(this).attr('id')] = $(this).val();
        });

        var headers = {};
        headers['Content-Type'] = 'application/json'
        opcoesFetch.headers =headers

        opcoesFetch.body = JSON.stringify(formObject); 
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

/**
 * 
 * @param {*} rotaPagina 
 */
async function carregarConteudoMenu (rotaPagina){

    const response = await fetch(rotaPagina);
    const menuHtml = await response.text();

    $('#ulMenuPricipal').prepend(menuHtml);

    adicionaEventosSubmenu ();
}