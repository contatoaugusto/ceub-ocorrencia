const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const loginRoute = require('./projeto/src/routes/loginRoute');
const ocorrenciaRoute = require('./projeto/src/routes/ocorrenciaRoute');
const ocorrenciaTipoRoute = require('./projeto/src/routes/ocorrenciaTipoRoute');
const ocorrenciaSubTipoRoute = require('./projeto/src/routes/ocorrenciaSubTipoRoute');
const cursoRoute = require('./projeto/src/routes/cursoRoute');
const pessoaRoute = require('./projeto/src/routes/pessoaRoute');
const reponsavelRoute = require('./projeto/src/routes/reponsavelRoute');
const usuarioRoute = require('./projeto/src/routes/usuarioRoute');
const perfilRoute = require('./projeto/src/routes/perfilRoute');
const menuRoute = require('./projeto/src/routes/menuRoute');
const autenticacaoMiddleware = require('./projeto/src/midleware/authMiddleware');
const { CONFIG_DIRETORIO_SRC } = require('./projeto/src/configuracoes');

const app = express();
const PORT = 8080;

/**
 * Configura o local onde deve considerar arquivos státicos a serem renderizados nas páginas.
 * Ou seja, imagens, css, javascript, etc
 */
app.use(express.static(CONFIG_DIRETORIO_SRC));

/**
 * Middleware para analisar solicitação JSON
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Configurando o EJS como a engine de manipulação e visualização das páginas
 */
app.set('view engine', 'ejs');
app.set('views', path.join(CONFIG_DIRETORIO_SRC, 'views'));

/**
 * Sessão - Configuração do middleware de sessão
*/ 
app.use(session({
    secret: 'appOcorrenciasChaveSessao',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Configure para true se estiver usando HTTPS
        maxAge: 60 * 60 * 1000 // Duração da sessão em milissegundos (1 hora, por exemplo)
    }
}));

/** 
 * Regitrar aqui todos os arquivos e suas rotas disponíveis para que fique disponível para o resto do projeto todo
 */ 
app.use('/api/login', loginRoute);
app.use('/api/ocorrencia', ocorrenciaRoute);
app.use('/api/ocorrenciaTipo', ocorrenciaTipoRoute);
app.use('/api/ocorrenciaSubTipo', ocorrenciaSubTipoRoute);
app.use('/api/curso', cursoRoute);
app.use('/api/pessoa', pessoaRoute);
app.use('/api/responsavel', reponsavelRoute);
app.use('/api/usuario', usuarioRoute);
app.use('/api/perfil', perfilRoute);
app.use('/api/menu', menuRoute);

/**
 * Determina que a rota raiz do projeto é a pagina de ocorrencias
 */
app.get('/', autenticacaoMiddleware, (req, res) => {
    res.redirect('/api/ocorrencia/init');
});

/**
 * Iniciar o servido de fato. Fica sempre ativo na porta determinada
 */
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});

