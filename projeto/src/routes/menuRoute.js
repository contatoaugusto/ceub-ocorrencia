const express = require('express');
const router = express.Router();
const { query, querySoredProcedure } = require('../midleware/database_middleware');
const autenticacaoMiddleware = require('../midleware/authMiddleware');

router.get('/listar/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getMenu", {idMenu: idParameter});
       
        res.render('pages/menuListar', {
            tituloCabecalho: 'Lista Menu', 
            subCabecalho: 'Listar',
            menuList: retornoBancoDados}
        );


    } catch (error) {
        console.error('Erro ao listar menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor (menuRoute)' });
    } 
});


router.get('/montamenuByUsuario', autenticacaoMiddleware, async (req, res) => {
   
    const idUsuario = req.session.usuario.idUsuario;
    
    try {
        
        let retornoBancoDados_menu = await querySoredProcedure("OCOTB.SP_getMenuByUsuario", {idUsuario: idUsuario});
        const menuHieraquizado = montaHierarquiaMenu(retornoBancoDados_menu);
        const menuHtml = montaHtmlMenu(menuHieraquizado);
       
        res.send(menuHtml)

    } catch (error) {
        console.error('Erro ao listar menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor (menuRoute)' });
    } 
});


/**
 * Mesmo que o método acima, no entanto retornando formato json e preparado para preencher elemento option/dropdown list e outros elementos
 */
router.get('/listarJson/:id', autenticacaoMiddleware, async (req, res) => {
   
    const idParameter = req.params.id;
    
    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getMenu", {idMenu: idParameter});
       
        res.json(retornoBancoDados);

    } catch (error) {
        console.error('Erro ao listar menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor (menuRoute)' });
    } 
});

/**
 * Prepara a tela inicial de manter
 * Tanto inclusão de uma nova quanto manter uma existente
 */
router.get('/incluirInit/:id', autenticacaoMiddleware, async (req, res) => {
    
    const idParameter = req.params.id;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_getMenu", {idMenu: idParameter});
        let retornoBancoDados_Perfil = await querySoredProcedure("OCOTB.SP_getPerfil", {idPerfil: 0});

        if (idParameter > 0 && retornoBancoDados.length > 0){
            
            const primeiraLinha = retornoBancoDados[0];

            let retornoBancoDadosPerfil_Configurado = await querySoredProcedure("OCOTB.SP_getMenuPerfilByMenu", {idMenu: primeiraLinha.idMenu});

            const idPerfilConfiguradaComoResponsaveisList = retornoBancoDadosPerfil_Configurado.map(x => x.idPerfil);
            const perfilFiltradas = retornoBancoDados_Perfil.filter(x => idPerfilConfiguradaComoResponsaveisList.length == 0 || !idPerfilConfiguradaComoResponsaveisList.includes(x.idPerfil));



            res.render(
                'pages/menuManter', 
                { 
                    rota: '/api/menu/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Perfil', 
                    subCabecalho: 'Incluir',
                    idMenu: primeiraLinha.idMenu,
                    nmMenu: primeiraLinha.nmMenu,
                    urlRota: primeiraLinha.urlRota,
                    idMenuPai: primeiraLinha.idMenuPai,
                    nuOrdem: primeiraLinha.nuOrdem,
                    perfilList: perfilFiltradas,
                    perfilList_Configurado: retornoBancoDadosPerfil_Configurado
               });
        }else {

            res.render(
                'pages/menuManter', 
                { 
                    rota: '/api/menu/salvar',
                    session: req.session, 
                    tituloCabecalho: 'Manter Perfil', 
                    subCabecalho: 'Incluir',
                    idMenu: 0,
                    nmMenu: '',
                    urlRota: '',
                    idMenuPai: 0,
                    nuOrdem: 0,
                    perfilList: retornoBancoDados_Perfil,
                    perfilList_Configurado: []
                });
        }

    } catch (error) {
        console.error('Erro ao listar menu:', error);
        res.status(500).json({ message: 'Erro interno do servidor (menuRoute)' });
    } 
});

/**
 * Para salvar um novo registro ou atualizar um existente
 */
router.post('/salvar', autenticacaoMiddleware, async (req, res) => {
    
    const { idMenu, nmMenu, urlRota, idMenuPai, nuOrdem, hiddenMenuPerfilConfiguradoList } = req.body;

    try {
        
        let retornoBancoDados = await querySoredProcedure("OCOTB.SP_setMenu", 
            {
                idMenu: idMenu,
                nmMenu: nmMenu,
                urlRota: urlRota,
                idMenuPai: idMenuPai,
                nuOrdem: nuOrdem
            });
        
        const primeiraLinha = retornoBancoDados[0];

        let retornoBancoDados_Delete = await querySoredProcedure("OCOTB.SP_setMenuPerfilDeleteByMenu", {idMenu: primeiraLinha.idMenu});

        JSON.parse(hiddenMenuPerfilConfiguradoList).forEach( obj => {
        
            let idPerfil = 0;
        
            if (obj.hasOwnProperty("perfil") && obj.usuario != 0 && obj.perfil != '0')
                idPerfil  = obj.perfil;
            
            let retorno = querySoredProcedure("OCOTB.SP_setMenuPerfil", 
            {
                idMenuPerfil: 0,
                idMenu: primeiraLinha.idMenu,
                idPerfil: idPerfil
            });
        });


        return res.redirect('/api/menu/listar/0');

    } catch (error) {
        console.log(error);
        console.error('Erro ao salvar perfil:', error);
        //res.status(500).json({ message: 'Erro interno do servidor (ocorrenciaRoute)' });
        req.session.mensagemErro = {
            id: 0,
            cssClass: [' alert-danger '],
            mensagem: error
       };

        return res.redirect('/api/menu/listar/0');
    } 
});

/**
 * 
 * @param {*} menus 
 * @returns 
 */
function montaHierarquiaMenu(menus) {
    const menuMap = {};
    const rootMenus = [];

    // Primeiro, criar um mapa de menus para fácil acesso
    menus.forEach(menu => {
        menu.children = [];
        menuMap[menu.idMenu] = menu;
    });

    // Em seguida, organizar os menus em uma estrutura hierárquica
    menus.forEach(menu => {
        if (menu.idMenuPai) {
            if (menuMap[menu.idMenuPai]) {
                menuMap[menu.idMenuPai].children.push(menu);
            }
        } else {
            rootMenus.push(menu);
        }
    });

    return rootMenus;
}

/**
 * Monta de fato o html do menu
 * @param {*} menus 
 * @returns 
 */
//function montaHtmlMenu(menus, montaUL = false, nomeSubMenu) {
function montaHtmlMenu(menus, possuiMenuFilhos = false) {
    
    let html = '';
    let irmaosSemFilhos = false;
    let irmaos_idPai;

    menus.forEach(menu => {

        if (menu.idMenuPai == undefined || menu.idMenuPai == 0 || menu.idMenuPai == '0')
            html += '<li class="nav-item ">';
        else if (irmaos_idPai != undefined && menu.idMenuPai == irmaos_idPai)
            html += '<li class="nav-item pl-4">';

        let nomeSubMenuCSS = '';

        if (menu.children.length > 0) {

            irmaos_idPai = menu.idMenuPai;
            nomeSubMenuCSS = 'submenu' + menu.idMenu;

            html += '<a class="nav-link text-white submenu-toggle d-flex justify-content-between align-items-center" href="#' + nomeSubMenuCSS + '">';
            html +=     menu.nmMenu + '<i id="iSetaAlternada' + menu.nmMenu + '" class="fa-solid fa-plus fa-xs"></i>'
            html += '</a>';
            html += '<ul class="flex-column collapse list-unstyled" id="' + nomeSubMenuCSS + '">';
            html += '    <li class="nav-item pl-4">';

            html += montaHtmlMenu(menu.children, true);
        } else {
            // html += '<ul class="flex-column collapse list-unstyled" id=" nomeSubMenuCSS ">';
            // html += '    <li class="nav-item pl-4">';

            if (irmaosSemFilhos)
                html += '    <li class="nav-item pl-4">';

            if (menu.urlRota == undefined || menu.urlRota == '')
                html += `       <a class="nav-link" href="#">${menu.nmMenu}</a>`;
            else
                html += `       <a class="nav-link" href="#" onclick="carregarConteudoMain('${menu.urlRota}')" >${menu.nmMenu}</a>`;
        //    html += '   </li>';
            //html += '</ul>';
            irmaosSemFilhos = true;
        }

        html += '</li>';

    });

    if (possuiMenuFilhos)
        html += '</ul>';

    irmaos_idPai = undefined;
    return html;    
}

module.exports = router;