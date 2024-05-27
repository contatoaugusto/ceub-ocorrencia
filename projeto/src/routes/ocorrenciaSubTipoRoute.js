const express = require('express');
const router = express.Router();
const path = require('path');
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSubTipo", {idOcorrenciaSubTipo: idParameter});
       
        res.render('pages/ocorrenciaSubTipoListar', {
            tituloCabecalho: 'Lista Sub Tipo Ocorrência', 
            subCabecalho: 'Listar',
            ocorrenciaSubTipoList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar Sub Tipo Ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSubTipoRoute)' });
    } 
});


router.get('/listarJson/:idOcorrenciaSubTipo', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.idOcorrenciaSubTipo;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSubTipo", {idOcorrenciaSubTipo: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar Sub Tipo Ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSubTipoRoute)' });
    } 
});

/**
 * Seleciona o Subtipo Ocorrencia dependendo do parámetro idOcorrenciaTipo
 */
router.get('/listarJsonByTipoOcorrencia/:idOcorrenciaTipo', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.idOcorrenciaTipo;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSubTipoByTipoOcorrencia", {idOcorrenciaTipo: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar Sub Tipo Ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSubTipoRoute)' });
    } 
});


/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaSubTipo", {idOcorrenciaSubTipo: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/ocorrenciaSubTipoManter', 
                { 
                    rota: '/api/ocorrenciaSubTipo/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Ocorrência SubTipo', 
                    subCabecalho: 'Incluir',
                    
                    idOcorrenciaSubTipo: primeiraLinha.idOcorrenciaSubTipo,
                    nmOcorrenciaSubTipo: primeiraLinha.nmOcorrenciaSubTipo,
                    

                    idOcorrenciaTipo: primeiraLinha.idOcorrenciaTipo
                    
                });
        }else {

            res.render(
                'pages/ocorrenciaSubTipoManter', 
                { 
                    rota: '/api/ocorrenciaSubTipo/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Ocorrência SubTipo', 
                    subCabecalho: 'Incluir',
                    
                    idOcorrenciaSubTipo: 0,
                    nmOcorrenciaSubTipo: '',
                    
                    idOcorrenciaTipo: 0
                    
                });
        }

    } catch (error) {
        console.error('Erro ao listar Ocorrência SubTipo:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaSubTipoRoute)' });
    } 
});



/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idOcorrenciaSubTipo, idOcorrenciaTipo, nmOcorrenciaSubTipo } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setOcorrenciaSubTipo", 
            {
                idOcorrenciaSubTipo: idOcorrenciaSubTipo,
                idOcorrenciaTipo: idOcorrenciaTipo,
                nmOcorrenciaSubTipo: nmOcorrenciaSubTipo
            });
        
        console.log('Resultado da consulta:', retornoBancoDados);

        return res.redirect('/api/ocorrenciaSubTipo/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar ocorrenciaTipo:', error);
        
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/ocorrenciaSubTipo/listar/0');
    } 
});
module.exports = router;