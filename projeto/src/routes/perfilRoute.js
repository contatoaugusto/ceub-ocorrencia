const express = require('express');
const router = express.Router();
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: idParameter});
        let retornoBancoDadosPessoa_Configurado = await querySoredProcedure("OCOTB.SP_getPerfilUsuario_Todos");

        res.render('pages/perfilListar', {
            tituloCabecalho: 'Lista Perfil', 
            subCabecalho: 'Listar',
            perfilList: retornoBancoDados,
            pessoaList_Configurado: retornoBancoDadosPessoa_Configurado
        }
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
        let retornoBancoDadosPessoa = await querySoredProcedure("OCOTB.SP_getPessoa", {idPessoa: 0});
        
        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            let retornoBancoDadosPessoa_Configurado = await querySoredProcedure("OCOTB.SP_getPerfilUsuarioByPerfil", {idPerfil: idParameter});

            const idPessoaConfiguradaComoResponsaveisList = retornoBancoDadosPessoa_Configurado.map(ocorrencia => ocorrencia.idPessoa);
            const pessoasFiltradas = retornoBancoDadosPessoa.filter(pessoa => 
                pessoa.idUsuario > 0 &&
                (idPessoaConfiguradaComoResponsaveisList.length == 0 || 
                !idPessoaConfiguradaComoResponsaveisList.includes(pessoa.idPessoa)));

            res.render(
                'pages/perfilManter', 
                { 
                    rota: '/api/perfil/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Perfil', 
                    subCabecalho: 'Incluir',
                    idPerfil: primeiraLinha.idPerfil,
                    nmPerfil: primeiraLinha.nmPerfil,
                    dePerfil: primeiraLinha.dePerfil,
                    pessoaList: pessoasFiltradas,
                    pessoaList_Configurado: retornoBancoDadosPessoa_Configurado
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
                    dePerfil: '',
                    pessoaList: retornoBancoDadosPessoa,
                    pessoaList_Configurado: []
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
    
    const { idPerfil, nmPerfil, dePerfil, hiddenResponsavelConfiguradoList } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setPerfil", 
            {
                idPerfil: idPerfil,
                nmPerfil: nmPerfil,
                dePerfil: dePerfil
            });
        
        const primeiraLinha = retornoBancoDados[0];

        let retornoBancoDados_Delete = await querySoredProcedure("OCOTB.SP_setPerfilUsuarioDeleteByPerfil", {idPerfil: primeiraLinha.idPerfil});

        JSON.parse(hiddenResponsavelConfiguradoList).forEach( obj => {
        
            let idUsuario = 0;
        
            if (obj.hasOwnProperty("usuario") && obj.usuario != 0 && obj.usuario != '0')
                idUsuario  = obj.usuario;
            
            let retorno = querySoredProcedure("OCOTB.SP_setPerfilUsuario", 
            {
                idPerfilUsuario: 0,
                idPerfil: primeiraLinha.idPerfil,
                idUsuario: idUsuario
            });
        });


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