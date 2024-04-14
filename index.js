const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const usuarioRoute = require('./projeto/src/routes/usuarioRoute');
const ocorrenciaRoute = require('./projeto/src/routes/ocorrenciaRoute');
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
 * Muito importante que a cada definição de rota, seja configurado também o diretório de arquivos státicos pra ela. Isso para que carrege css, imagens, etc
 */ 
app.use('/api/usuario', usuarioRoute);
app.use('/api/usuario', express.static(CONFIG_DIRETORIO_SRC));
app.use('/api/ocorrencia', ocorrenciaRoute);
app.use('/api/ocorrencia', express.static(CONFIG_DIRETORIO_SRC));


/**
 * Determina que a rota raiz do projeto é a pagina ocorrencias.html
 */
app.get('/', autenticacaoMiddleware, (req, res) => {
    res.redirect('/api/ocorrencia/listar');
});

/**
 * Iniciar o servido de fato. Fica sempre ativo na porta determinada
 */
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});

