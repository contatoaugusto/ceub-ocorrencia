const express = require('express');


function autenticacaoMiddleware(req, res, next) {
    
    if (req.session && req.session.usuario) {
       
        // O usuário está autenticado
        next();
    
    } else {
        
        if (req.originalUrl != null || req.originalUrl != undefined){
            req.session.originalUrl = req.originalUrl;
        }
        
        res.redirect('/api/usuario/loginInit');
        //res.sendFile('../login.html', { root: path.join(__dirname, 'projeto', 'src') });
    }
}

module.exports = autenticacaoMiddleware;