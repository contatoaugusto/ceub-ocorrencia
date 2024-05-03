const express = require('express');
const router = express.Router();
const path = require('path');
const { query } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:idOcorrenciaTipo', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.idOcorrenciaTipo;
    
    try {
        let retornoBancoList 
        
        if (idParameter == 0 ) {
            retornoBancoList = await query(`
            SELECT 
                OST.idOcorrenciaSubTipo AS id,
                OST.idOcorrenciaTipo,
                OST.deOcorrenciaSubTipo AS texto
            FROM 
                OCOTB.OcorrenciaSubTipo OST`);
        } else {
            retornoBancoList = await query(`
            SELECT 
                OST.idOcorrenciaSubTipo as id,
                OST.idOcorrenciaTipo,
                OST.deOcorrenciaSubTipo AS texto
            FROM 
                OCOTB.OcorrenciaSubTipo OST
            WHERE 
                OST.idOcorrenciaTipo = ${idParameter}`)
        }

        console.log('Resultado da consulta listar:', retornoBancoList);


        res.json(retornoBancoList);

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});



/**
 * Rota para pesquisar uma ocorrência
 */
router.get('/salvar/:id', autenticacaoMiddleware, async (req, res) => {
    const ocorrenciaId = req.params.id;

    let usuarioLogado = req.session.usuario;

    try {
        let retornoBancoDados = await query(`
            SELECT 
                 OCO.idOcorrencia
                ,OCO.deOcorrencia
                ,OCO.dtOcorrencia
                ,OCO.idLocal	
                ,OCO.idPessoa
                ,OCO.idOcorrenciaSubTipo
                ,OCO.idCurso
                ,OS.deOcorrenciaSituacao
            FROM 
                OCOTB.Ocorrencia OCO
                INNER JOIN OCOTB.Pessoa P ON OCO.idPessoa = OCO.idPessoa
                INNER JOIN OCOTB.OcorrenciaHistoricoSituacao CHS ON CHS.idOcorrencia = OCO.idOcorrencia AND CHS.icAtivo = 1
                INNER JOIN OCOTB.OcorrenciaSituacao OS ON OS.idOcorrenciaSituacao = CHS.idOcorrenciaSituacao
            WHERE 
                P.idPessoa = ${usuarioLogado.idPessoa}`);

        console.log('Resultado da consulta:', retornoBancoDados);


        res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});

module.exports = router;