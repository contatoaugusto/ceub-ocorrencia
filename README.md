Projeto de registro de ocorrência

Por ser tratar de um projeto node, o arquivo de entrada, o main, é o aquivo index.js que está na raiz do projeto.

Quase todas as configurações iniciais e que de fato ira caracterizar o servidor web é feito ai

Lembrando que usado o EJS como engine de manipulação de scriplets a serem embutidos nas páginas html e assim trasfegar dados do cliente pro servior e vice-versa.

Quanto ao banco de dados é preciso configurar a string de conexão no arquivo

projeto/src/bancodados/database_SQLExpress.js

No trecho:

const config = {
    user: 'isabelle',
    password: 'isabelle',
    
    // Máquina da Isabelle
    //server: 'ISABELLE\\SQLEXPRESS',
    
    // Máquina do Augusto
    server: 'DESKTOP-DUAAAQ5\\SQLEXPRESS',
    
    // Maquina trabalho
    //server: '172.17.3.116\\SQLEXPRESS',
    
    database: 'OCODB',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true
    }
};

Feito isso, execute os script contidos nos arquivos 

 - bancodados_scriptCriacao.sql
 - bancodados_scriptCriacao Prucedures e Funcoes.sql

image.png