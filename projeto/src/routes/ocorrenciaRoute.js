const express = require('express');
const router = express.Router();
const path = require('path');
const { conectarBanco, desconectarBanco } = require('../midleware/database_SQLExpress_middleware');
const { query } = require('../bancodados/database_SQLExpress');
const { CONFIG_DIRETORIO_SRC } = require('../configuracoes');


router.get('/ocorrencia', async (req, res) => {
    res.sendFile('ocorrencias.html', { root: CONFIG_DIRETORIO_SRC });
});