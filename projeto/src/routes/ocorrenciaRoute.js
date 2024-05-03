const express = require('express');
const router = express.Router();
const path = require('path');
const { querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');
const { formataData } = require('../util/library');
const app = express();
//const fs = require('fs');


/**
 * Carrega a página main.ejs, a qual pe na verdade um conjunto de layouts.
 * Quando a pagina estiver pronta será chamado a função carregarConteudoMain
 * carregarConteudoMain será SEMPRE chamada para carregar TODAS as páginas do sistema
 */
router.get('/init', autenticacaoMiddleware, async (req, res) => {
    
    res.render('layouts/main.ejs', {
        session: req.session, 
        tituloCabecalho: 'Lista Ocorrências', 
        subCabecalho: 'Listar',
    });
});

router.get('/listar', autenticacaoMiddleware, async (req, res) => {
    
    let usuarioLogado = req.session.usuario;
    
    try {
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getOcorrenciaByPessoa", {idPessoa: usuarioLogado.idPessoa});
        let retornoBancoDadosOcorrenciaMinhaResponsabilidade = await querySoredProcedure("OCOTB.SP_getOcorrenciaByPessoaResponsavel", {idPessoa: usuarioLogado.idPessoa});
 
        console.log('Resultado da consulta listar:', retornoBancoDados);

        res.render('pages/ocorrenciaListar', {
            session: req.session, 
            tituloCabecalho: 'Lista Ocorrências', 
            subCabecalho: 'Listar',
            ocorrenciasMinhas: retornoBancoDados,
            ocorrenciasMinhaResponsabilidade: retornoBancoDadosOcorrenciaMinhaResponsabilidade,
            formataData}
        );

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter ocorrência
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const ocorrenciaId = req.params.id;

    try {
        
        console.log('Chamou incluirInit/:id');

        res.render(
            'pages/ocorrenciaManter', 
            { 
                rota: '/api/ocorrencia/salvar/0',
                session: req.session, 
                tituloCabecalho: 'Manter Ocorrência', 
                subCabecalho: 'Incluir',
                deOcorrencia: '',
                idLocal: 0,
                idPessoa: 0,
                idOcorrenciaSubTipo: 0,
                idCurso: 0
            });

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});


/**
 * Para salvar uma deteminada ocorrência
 */
router.post('/salvar/:id', autenticacaoMiddleware, async (req, res) => {
    const ocorrenciaId = req.params.id;
    const ddlCursoTeste =  req.body.ddlCurso;
    const { ddlCurso, ddlOcorrenciaTipo, ddlOcorrenciaSubTipo, deOcorrencia, hdnResponsavelFinanceiroList } = req.body;

    let usuarioLogado = req.session.usuario;

    try {
        
        if (!ValidaCampoObrigatorio (req, ddlOcorrenciaTipo, ddlOcorrenciaSubTipo, deOcorrencia, hdnResponsavelFinanceiroList)){
            return res.redirect('/api/ocorrencia/incluirInit/0');
        }


        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setOcorrencia", 
            {
                deOcorrencia: deOcorrencia, 
                idLocal: null,
                idPessoa: usuarioLogado.idPessoa,
                idOcorrenciaSubTipo: ddlOcorrenciaSubTipo,
                idCurso: ddlCurso,
                idPessoaResponsavelArray: hdnResponsavelFinanceiroList 
            });
        
       
        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/ocorrencia/init');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salva ocorrência:', error);
        //res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/ocorrencia/init');
    } 
});


function ValidaCampoObrigatorio(req, ddlOcorrenciaTipo, ddlOcorrenciaSubTipo, deOcorrencia, hdnResponsavelFinanceiroList){
    
    let mensagemValidacao = '';

    if (ddlOcorrenciaTipo == undefined || ddlOcorrenciaTipo == '' || ddlOcorrenciaTipo == 0)
        mensagemValidacao = 'É preciso infomar o tipo da ocorrência \n';
    if (ddlOcorrenciaSubTipo == undefined || ddlOcorrenciaSubTipo == '' || ddlOcorrenciaSubTipo == 0)
        mensagemValidacao += 'É preciso infomar o sub tipo da ocorrência \n';
    if (deOcorrencia == undefined || deOcorrencia.trim() == '')
        mensagemValidacao += 'É preciso infomar o detalhamento da ocorrências \n';
    if (hdnResponsavelFinanceiroList == undefined || hdnResponsavelFinanceiroList.trim() == '')
        mensagemValidacao += 'É preciso infomar o responsável pela ocorrências \n';

    if (mensagemValidacao != '' || mensagemValidacao.length > 0) {
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: mensagemValidacao
        };
        return false;
    }

    return true;
}

module.exports = router;