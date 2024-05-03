const express = require('express');
const router = express.Router();
const path = require('path');
const { query } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        let retornoBancoList 
        
        if (idParameter == 0 ) {
            retornoBancoList = await query(`
                SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPessoa	AS id,
                    P.nmPessoa		AS texto,
                    'pessoa'		AS entidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OTR.idPessoa
                
                UNION ALL
                
                SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPerfil	AS id,
                    PE.nmPerfil		AS texto,
                    'perfil'		AS entidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Perfil PE ON PE.idPerfil = OTR.idPerfil`);
        } else {
            retornoBancoList = await query(`
            SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPessoa	AS id,
                    P.nmPessoa		AS texto,
                    'pessoa'		AS entidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OTR.idPessoa
                WHERE 
                    OTR.idOcorrenciaTipoResponsavel = ${idParameter}
                
                UNION ALL
                
                SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPerfil	AS id,
                    PE.nmPerfil		AS texto,
                    'perfil'		AS entidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Perfil PE ON PE.idPerfil = OTR.idPerfil
                WHERE 
                    OTR.idOcorrenciaTipoResponsavel = ${idParameter}`)
        }

        console.log('Resultado da consulta listar:', retornoBancoList);


        res.json(retornoBancoList);

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (responsavelRoute)' });
    } 
});

router.get('/listarByOcorrenciaTipo/:idOcorrenciaTipo', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.idOcorrenciaTipo;
    
    try {
        let retornoBancoList 
        
        if (idParameter > 0 ) {
            retornoBancoList = await query(`
            SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPessoa	AS id,
                    P.nmPessoa		AS texto,
                    'pessoa'		AS nmEntidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OTR.idPessoa
                WHERE 
                    OTR.idOcorrenciaTipo = ${idParameter}
                
                UNION ALL
                
                SELECT
                    OTR.idOcorrenciaTipoResponsavel,
                    OTR.idOcorrenciaTipo,
                    OTR.idPerfil	AS id,
                    PE.nmPerfil		AS texto,
                    'perfil'		AS nmEntidade
                FROM 
                    OCOTB.OcorrenciaTipoResponsavel OTR
                    INNER JOIN OCOTB.Perfil PE ON PE.idPerfil = OTR.idPerfil
                WHERE 
                    OTR.idOcorrenciaTipo = ${idParameter}`)
        }

        console.log('Resultado da consulta listarByOcorrenciaTipo:', retornoBancoList);


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