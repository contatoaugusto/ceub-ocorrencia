
$(document).ready(function() {
    
    let mensagemAlert = $('#mensagemAlert');

    mensagemAlert.on('click', function() {
        mensagemAlert.addClass('invisible');
    });
    
    if (mensagemAlert.html().trim().length > 0 )
        mensagemAlert.show();


    // Script para controlar a exibição dos submenus
    $('.submenu-toggle').click(function(e) {
        e.preventDefault();
        var submenu = $(this).attr('href');
        $(submenu).toggleClass('show');
        
        var submenuCadastro = $("#iSetaAlternada");

        if (submenuCadastro.hasClass('fa-chevron-down'))
            submenuCadastro.removeClass('fa-chevron-down').addClass('fa-chevron-up');
        else
            submenuCadastro.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });
});