const express = require('express');
const router = express.Router();
const path = require('path');
//const telegram = require('../util/telegram');
//const whatsapp = require('../util/whatsapp');
//const WhatsAppSender = require('../util/whatsappClass');
const emailSendGrid = require('../util/email_SendGrid');
const { conectarBanco, querySoredProcedure } = require('../midleware/database_middleware');


/** 
 * Endpoint para lidar com o login
 * Toda roa criada e que exige que antes o usuário esteja logado, deve se chamada com a fun callback autenticacaoMiddleware em sua assinatura
 * Dentro de autenticacaoMiddleware é verificado se existe a sessão do usuário logado e caso contrário redireciona para esta rota aqui
*/
router.get('/loginInit', async (req, res) => {
    res.render('pages/login', { title: 'Login'});
});


/**
 * Inicia a pagina de recuperação da senha
 */
router.get('/loginInitRecuperaSenha', async (req, res) => {
    res.render('pages/loginRecuperaSenha', { title: 'Recupera Senha'});
});



/**
 * Realiza de fato o login.
 * Conecta no banco ou api que permite verificar o usuario e senha para continuar a navegação
 */
router.post('/login', conectarBanco, async (req, res) => {
    const { coAcesso, coSenha } = req.body;

    try {

        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getLoginAcessoSenha", {coAcesso: coAcesso, coSenha: coSenha});
       
        console.log('Resultado da consulta:', retornoBancoDados);

        if (retornoBancoDados.length > 0){
           
            const primeiraLinha = retornoBancoDados[0];
           
            //let retornoBancoDados_menu = await querySoredProcedure("OCOTB.SP_getMenuByUsuario", {idUsuario: primeiraLinha.idUsuario});

            req.session.usuario = {
                coAcesso: primeiraLinha.coAcesso,
                deAcesso: primeiraLinha.deAcesso,
                idPessoa: primeiraLinha.idPessoa,
                nmPessoa: primeiraLinha.nmPessoa,
                urlFoto: primeiraLinha.urlFoto,
                idAluno: primeiraLinha.idAluno,
                idCurso: primeiraLinha.idCurso,
                nuRA: primeiraLinha.nuRA,
                nuTelefone: primeiraLinha.nuTelefone,
                idUsuario: primeiraLinha.idUsuario
           };

            const urlOriginal = req.session.originalUrl || '/';
        
            // Limpe a URL original da sessão
            delete req.session.originalUrl;

            return res.redirect(urlOriginal);
        }else {
             // Limpe a URL original da sessão
             delete req.session.originalUrl;
             
            console.log('Erro ao listar usuários:');
            res.render('pages/login', { title: 'Login', mensagem: 'Usuário ou senha incorretos'});
        }
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor (usuarioRoute)' });
    } 
    // finally {
    //     desconectarBanco();
    // }
});


router.get('/logout', conectarBanco, async (req, res) => {
    delete req.session.usuario;
    return res.redirect('/api/login/loginInit');
});


/**
 * Realiza de fato a recuperação da senha e usuario.
 */
router.post('/loginRecuperaSenha', conectarBanco, async (req, res) => {
    const { coAcesso, nuCPF, edMail } = req.body;

    try {

        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getLoginRecuperaUsuarioSenha", {coAcesso: coAcesso, nuCPF: nuCPF, edMail: edMail});
        let mensagemRetorno;

        console.log('Resultado da consulta:', retornoBancoDados);

        if (retornoBancoDados.length > 0){
           
            const primeiraLinha = retornoBancoDados[0];
            
            //whatsapp.qrCodeLogin();    
            //const whatsappSender = new WhatsAppSender();

            //telegram.enviaMensagem(primeiraLinha.nuTelefone, 'Seu usuário e senha são ' + primeiraLinha.coAcesso + ' e ' + primeiraLinha.coSenha)    
            //mensagemRetorno = 'Dandos de login enviado para o telegran ' + primeiraLinha.nuTelefone;
            emailSendGrid.enviaMensagem(primeiraLinha.edMail, 'Sistema Registro de Ocorrências - Recuperação de senha', 'Seu usuário e senha são ' + primeiraLinha.coAcesso + ' e ' + primeiraLinha.coSenha)
            mensagemRetorno = 'Dados de login enviado para o email ' + primeiraLinha.edMail;

        }else {

            mensagemRetorno = 'Não foi possível encontrar o usuário com as informações fornecidas';
        }

        res.render('pages/login', { title: 'Login', mensagem: mensagemRetorno});

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor (usuarioRoute)' });
    } 
});


module.exports = router;