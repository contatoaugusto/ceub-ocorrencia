const express = require('express');
const router = express.Router();
const path = require('path');
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');


/**
 * Prepara a tela inicial de manter ocorrência
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaTipo", {idOcorrenciaTipo: idParameter});

        console.log('Resultado da consulta ', retornoBancoDados);

        res.render('pages/ocorrenciaTipoListar', {
            tituloCabecalho: 'Lista Tipo Ocorrência', 
            subCabecalho: 'Listar',
            tipoOcorrenciaList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar Tipo Ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor (tipoOcorrenciaRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter ocorrência
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaTipo", {idOcorrenciaTipo: idParameter});

        console.log('Resultado da consulta ', retornoBancoDados);

        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (tipoOcorrenciaRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaTipo", {idOcorrenciaTipo: idParameter});
        let retornoBancoDadosPessoa = await querySoredProcedure("OCOTB.SP_getPessoa", {idPessoa: 0});
        let retornoBancoDadosPerfil = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: 0});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/ocorrenciaTipoManter', 
                { 
                    rota: '/api/ocorrenciaTipo/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Tipo Ocorrência', 
                    subCabecalho: 'Incluir',
                    idOcorrenciaTipo: primeiraLinha.idOcorrenciaTipo,
                    nmOcorrenciaTipo: primeiraLinha.nmOcorrenciaTipo,
                    icResponsavelCoordenadorCurso: primeiraLinha.icResponsavelCoordenadorCurso,
                    pessoaList: retornoBancoDadosPessoa,
                    perfilList: retornoBancoDadosPerfil,
                    responsavelConfiguradoList: {}
               });
        }else {

            res.render(
                'pages/ocorrenciaTipoManter', 
                { 
                    rota: '/api/ocorrenciaTipo/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Tipo Ocorrência', 
                    subCabecalho: 'Incluir',
                    idOcorrenciaTipo: 0,
                    nmOcorrenciaTipo: '',
                    icResponsavelCoordenadorCurso: false,
                    pessoaList: retornoBancoDadosPessoa,
                    perfilList: retornoBancoDadosPerfil,
                    responsavelConfiguradoList: {}
                });
        }

    } catch (error) {
        console.error('Erro ao listar Tipo Ocorrência:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaTipoRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idOcorrenciaTipo, nmOcorrenciaTipo, icResponsavelCoordenadorCurso, responsavelConfiguradoList } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setOcorrenciaTipo", 
            {
                idOcorrenciaTipo: idOcorrenciaTipo,
                nmOcorrenciaTipo: nmOcorrenciaTipo,
                icResponsavelCoordenadorCurso: icResponsavelCoordenadorCurso
            });
        
        const primeiraLinha = retornoBancoDados[0];
        
         JSON.parse(responsavelConfiguradoList).forEach( obj => {
            
            let idPessoa = 0;
            let idPerfil = 0;
        
            if (obj.hasOwnProperty("idPessoa") && obj.idPessoa != 0 && obj.idPessoa != '0') {
                idPessoa  = obj.idPessoa;
            } else if (obj.hasOwnProperty("idPerfil")  && obj.idPerfil != 0 && obj.idPerfil != '0') {
                idPerfil  = obj.idPerfil;
            }

            let retorno = querySoredProcedure("OCOTB.SP_setOcorrenciaTipoResponsavel", 
            {
                idOcorrenciaTipoResponsavel: 0,
                idOcorrenciaTipo: primeiraLinha.idOcorrenciaTipo,
                idPessoa: idPessoa,
                idPerfil: idPerfil
            });
        });

        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/ocorrenciaTipo/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar ocorrenciaTipo:', error);
        //res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/ocorrenciaTipo/listar/0');
    } 
});

module.exports = router;