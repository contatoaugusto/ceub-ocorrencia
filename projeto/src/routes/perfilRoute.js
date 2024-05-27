const express = require('express');
const router = express.Router();
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: idParameter});
       
        res.render('pages/perfilListar', {
            tituloCabecalho: 'Lista Perfil', 
            subCabecalho: 'Listar',
            perfilList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor (perfilRoute)' });
    } 
});

/**
 * Mesmo que o método acima, no entanto retornando formato json e preparado para preencher elemento option/dropdown list e outros elementos
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor (perfilRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/perfilManter', 
                { 
                    rota: '/api/perfil/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Perfil', 
                    subCabecalho: 'Incluir',
                    idPerfil: primeiraLinha.idPerfil,
                    nmPerfil: primeiraLinha.nmPerfil,
                    dePerfil: primeiraLinha.dePerfil
               });
        }else {

            res.render(
                'pages/perfilManter', 
                { 
                    rota: '/api/perfil/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Perfil', 
                    subCabecalho: 'Incluir',
                    idPerfil: 0,
                    nmPerfil: '',
                    dePerfil: ''
                });
        }

    } catch (error) {
        console.error('Erro ao listar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor (perfilRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idPerfil, nmPerfil, dePerfil } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setPerfil", 
            {
                idPerfil: idPerfil,
                nmPerfil: nmPerfil,
                dePerfil: dePerfil
            });
        
        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/perfil/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar perfil:', error);
        //res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/perfil/listar/0');
    } 
});


module.exports = router;