const express = require('express');
const router = express.Router();
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');


router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSituacao", {idOcorrenciaSituacao: idParameter});
       
        res.render('pages/ocorrenciaSituacaoListar', {
            tituloCabecalho: 'Lista Curso', 
            subCabecalho: 'Listar',
            ocorrenciaSituacaoList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSituacaoRoute)' });
    } 
});

/**
 * Mesmo que o método acima, no entanto retornando formato json e preparado para preencher elemento option/dropdown list e outros elementos
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSituacao", {idOcorrenciaSituacao: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar Curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSituacaoRoute)' });
    } 
});


/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSituacao", {idOcorrenciaSituacao: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/ocorrenciaSituacaoManter', 
                { 
                    rota: '/api/ocorrenciaSituacao/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Curso', 
                    subCabecalho: 'Incluir',
                    idOcorrenciaSituacao: primeiraLinha.idOcorrenciaSituacao,
                    deOcorrenciaSituacao: primeiraLinha.deOcorrenciaSituacao
               });
        }else {

            res.render(
                'pages/ocorrenciaSituacaoManter', 
                { 
                    rota: '/api/ocorrenciaSituacao/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Curso', 
                    subCabecalho: 'Incluir',
                    idOcorrenciaSituacao: 0,
                    deOcorrenciaSituacao: ''
                });
        }

    } catch (error) {
        console.error('Erro ao listar curso:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSituacaoRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idOcorrenciaSituacao, deOcorrenciaSituacao } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setOcorrenciaSituacao", 
            {
                idOcorrenciaSituacao: idOcorrenciaSituacao,
                deOcorrenciaSituacao: deOcorrenciaSituacao
            });
        
        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/ocorrenciaSituacao/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar curso:', error);
        
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/ocorrenciaSituacao/listar/0');
    } 
});

module.exports = router;