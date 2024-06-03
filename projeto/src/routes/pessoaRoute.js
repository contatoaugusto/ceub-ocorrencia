const express = require('express');
const router = express.Router();
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPessoa", {idPessoa: idParameter});
       
        res.render('pages/pessoaListar', {
            tituloCabecalho: 'Lista Pessoas', 
            subCabecalho: 'Listar',
            pessoasList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ message: 'Erro interno do servidor (pessoaRoute)' });
    } 
});

/**
 * Mesmo que o método acima, no entanto retornando formato json e preparado para preencher elemento option/dropdown list e outros elementos
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPessoa", {idPessoa: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ message: 'Erro interno do servidor (pessoaRoute)' });
    } 
});

router.get('/listarCoordenadoByCurso/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        let retornoBancoList 
        
        if (idParameter > 0 ) {
            retornoBancoList = await query(`
            SELECT 
                P.idPessoa AS id,
                P.nmPessoa AS texto,
                P.nuCPF,
                P.urlFOto
            FROM 
                 OCOTB.Pessoa P
                 INNER JOIN OCOTB.Curso C ON C.idCoordenador = P.idPessoa
            WHERE 
                C.idCurso = ${idParameter}`)
        }

        console.log('Resultado da consulta listar:', retornoBancoList);


        res.json(retornoBancoList);

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPessoa", {idPessoa: idParameter});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            res.render(
                'pages/pessoaManter', 
                { 
                    rota: '/api/pessoa/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Pessoa', 
                    subCabecalho: 'Incluir',
                    idPessoa: primeiraLinha.idPessoa,
                    nmPessoa: primeiraLinha.nmPessoa,
                    nuCPF: primeiraLinha.nuCPF,
                    urlFoto: primeiraLinha.urlFoto,
                    nuTelefone: primeiraLinha.nuTelefone,
                    edMail: primeiraLinha.edMail,

                    // Usuario
                    idUsuario: primeiraLinha.idUsuario,
                    coAcesso: primeiraLinha.coAcesso,
                    coSenha: primeiraLinha.coSenha,
                    deAcesso: primeiraLinha.deAcesso
                });
        }else {

            res.render(
                'pages/pessoaManter', 
                { 
                    rota: '/api/pessoa/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Pessoa', 
                    subCabecalho: 'Incluir',
                    idPessoa: 0,
                    nmPessoa: '',
                    nuCPF: '',
                    urlFoto: '',
                    nuTelefone: '',
                    edMail: '',

                    // Usuario
                    idUsuario: 0,
                    coAcesso: '',
                    coSenha: '',
                    deAcesso: ''
                });
        }

    } catch (error) {
        console.error('Erro ao listar ocorrências:', error);
        res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idPessoa, nmPessoa, nuCPF, urlFoto, nuTelefone, idUsuario, coAcesso, coSenha, deAcesso, edMail } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setPessoa", 
            {
                idPessoa: idPessoa,
                nmPessoa: nmPessoa,
                nuCPF: nuCPF,
                urlFoto: urlFoto,
                nuTelefone: nuTelefone,
                edMail
            });
        
        const primeiraLinha = retornoBancoDados[0];
        // Usuário
        let retornoBancoDadosUsuario = await querySoredProcedure("OCOTB.SP_setUsuario", 
            {
                idUsuario: idUsuario,
                coAcesso: coAcesso,
                coSenha: coSenha,
                deAcesso: deAcesso,
                idPessoa: primeiraLinha.idPessoa
            });    
       
        console.log('Resultado da consulta:', retornoBancoDados);

        //res.render('pages/ocorrenciaManter', { session: req.session, tituloCabecalho: 'Ocorrências', ocorrenciasMinhas: retornoBancoDados});
        return res.redirect('/api/pessoa/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salva ocorrência:', error);
        //res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/pessoa/listar/0');
    } 
});


module.exports = router;