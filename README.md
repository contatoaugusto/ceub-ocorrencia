Projeto de registro de ocorrência

Por ser tratar de um projeto node, o arquivo de entrada, o nossp main, é o index.js que está na raiz do projeto 

Quanto ao banco de dados é preciso configurar a string de conexão no arquivo

projeto/src/bancodados/database_SQLExpress.js

No trecho:

const config = {
    user: 'isabelle',
    password: 'isabelle',
    
    // Máquina da Isabelle
    //server: 'ISABELLE/SQLEXPRESS',
    
    // Máquina do Augusto
    server: 'DESKTOP-DUAAAQ5\\SQLEXPRESS',
    //server: '172.17.3.116\\SQLEXPRESS',
    
    database: 'OCODB',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true
    }
};
