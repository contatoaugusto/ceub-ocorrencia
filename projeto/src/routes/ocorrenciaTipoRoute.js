const express = require('express');
const router = express.Router();
const path = require('path');
//const { conectarBanco, desconectarBanco } = require('../midleware/database_SQLExpress_middleware');
const { query } = require('../bancodados/database_SQLExpress');
const autenticacaoMiddleware = require('../midleware/authMiddleware');
const { CONFIG_DIRETORIO_SRC } = require('../configuracoes');


/**
 * Prepara a tela inicial de manter ocorrência
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoList = null;
        
        if (idParameter == 0){
            retornoBancoList = await query(`
                SELECT
                    OT.idOcorrenciaTipo AS id,
                    OT.deOcorrenciaTipo AS texto,
                    OT.icResponsavelCoordenadorCurso
                FROM
                    OCOTB.OcorrenciaTipo OT
                ORDER BY OT.deOcorrenciaTipo
            `);
        } else {
            retornoBancoList = await query(`
                SELECT
                    OT.idOcorrenciaTipo AS id,
                    OT.deOcorrenciaTipo AS texto,
                    OT.icResponsavelCoordenadorCurso
                FROM
                    OCOTB.OcorrenciaTipo OT
                WHERE
                    OT.idOcorrenciaTipo = ${idParameter}`)
        }

        console.log('Resultado da consulta ', retornoBancoList);

        res.json(retornoBancoList);

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});

module.exports = router;