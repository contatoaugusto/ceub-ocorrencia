const express = require('express');
const router = express.Router();
const path = require('path');
const { conectarBanco, desconectarBanco } = require('../midleware/database_SQLExpress_middleware');
const { query } = require('../bancodados/database_SQLExpress');
const { CONFIG_DIRETORIO_SRC } = require('../configuracoes');

/** 
 * Endpoint para lidar com o login
 * Toda roa criada e que exige que antes o usuário esteja logado, deve se chamada com a fun callback autenticacaoMiddleware em sua assinatura
 * Dentro de autenticacaoMiddleware é verificado se existe a sessão do usuário logado e caso contrário redireciona para esta rota aqui
*/
router.get('/loginInit', async (req, res) => {
    res.sendFile('login.html', { root: CONFIG_DIRETORIO_SRC });
});


/**
 * Realiza de fato o login.
 * Conecta no banco ou api que permite verificar o usuario e senha para continuar a navegação
 */
router.post('/login', conectarBanco, async (req, res) => {
    const { nuRA, coSenha } = req.body;

    try {
        const consultaUsuario = await query(`SELECT * FROM OCOTB.Usuario WHERE nuRA = '${nuRA}' AND coSenha = '${coSenha}'`);
        console.log('Resultado da consulta:', consultaUsuario);

        if (consultaUsuario.length > 0){
            const primeiraLinha = consultaUsuario[0];
            req.session.usuario = {
                nuRA: primeiraLinha.nuRA,
                deAcesso: primeiraLinha.deAcesso,
                // Adicione outras informações relevantes do usuário aqui
            };

            const urlOriginal = req.session.originalUrl || '/';
        
            // Limpe a URL original da sessão
            delete req.session.originalUrl;

            return res.redirect(urlOriginal);
        }
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor (usuarioRoute)' });
    } 
    // finally {
    //     desconectarBanco();
    // }
});



module.exports = router;