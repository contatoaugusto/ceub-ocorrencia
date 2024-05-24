const express = require('express');
const router = express.Router();
const path = require('path');
const { conectarBanco, desconectarBanco } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');
const { query, querySoredProcedure } = require('../midleware/database_middleware');
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
        let retornoBancoDados = await query(`
            SELECT 
                U.coAcesso,
                U.deAcesso,
                P.idPessoa
            FROM 
                OCOTB.Usuario U
                INNER JOIN OCOTB.Pessoa P ON P.idPessoa = U.idPessoa 
            WHERE 
                coAcesso = '${nuRA}' AND coSenha = '${coSenha}'`);

        console.log('Resultado da consulta:', retornoBancoDados);

        if (retornoBancoDados.length > 0){
           
            const primeiraLinha = retornoBancoDados[0];
           
            req.session.usuario = {
                coAcesso: primeiraLinha.coAcesso,
                deAcesso: primeiraLinha.deAcesso,
                idPessoa: primeiraLinha.idPessoa
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
});

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getUsuario", {idPessoa: idParameter});
       
        res.render('pages/pessoaListar', {
            tituloCabecalho: 'Lista Usuario', 
            subCabecalho: 'Listar',
            pessoasList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ message: 'Erro interno do servidor (pessoaRoute)' });
    } 
});


/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto a manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getUsuario", {idUsuario: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/pessoaManter', 
                { 
                    rota: '/api/usuario/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Usuário', 
                    subCabecalho: 'Incluir',
                    idUsuario: primeiraLinha.idUsuario,
                    coAcesso: primeiraLinha.coAcesso,
                    coSenha: primeiraLinha.coSenha,
                    deAcesso: primeiraLinha.deAcesso,
                    idPessoa: primeiraLinha.idPessoa
                });
        }else {

            res.render(
                'pages/usuarioManter', 
                { 
                    rota: '/api/usuario/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Usuário', 
                    subCabecalho: 'Incluir',
                    idUsuario: 0,
                    coAcesso: '',
                    coSenha: '',
                    deAcesso: '',
                    idPessoa: 0
                });
        }

    } catch (error) {
        console.error('Erro ao listar usuario:', error);
        res.status(500).json({ message: 'Erro interno do servidor (usuarioRoute)' });
    } 
});

module.exports = router;