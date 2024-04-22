
$(document).ready(function() {
    
    let mensagemAlert = $('#mensagemAlert');

    mensagemAlert.on('click', function() {
        mensagemAlert.addClass('invisible');
    });
    
    if (mensagemAlert.html().trim().length > 0 )
        mensagemAlert.show();

});