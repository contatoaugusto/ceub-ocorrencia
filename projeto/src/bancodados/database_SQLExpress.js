
const sql = require('mssql');
const { config_banco_servidor, config_banco_usuario, config_banco_senha, config_banco_nomebanco } = require('../configuracoes');

const config = {

    server: config_banco_servidor,
    user: config_banco_usuario,
    password: config_banco_senha,
    database: config_banco_nomebanco,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true
    }
};

let pool = null;

/**
 * Abre a configuração com o banco de dados
 */
async function conectarBancoDeDados() {
    try {
        pool = await sql.connect(config);
        console.log('Conexão com o banco de dados estabelecida com sucesso (database_SQLExpress)!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

async function desconectarBancoDeDados() {
    try {
        await pool.close();
        console.log('Conexão com o banco de dados fechada com sucesso!');
    } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
    }
}


/**
 * Executa consultas no banco de dado passadas da manera antiga, ou seja, informando a query
 * @param {*} sqlQuery 
 * @returns 
 */
async function query_BancoDeDados(sqlQuery) {
    try {
        const resultado = await pool.query(sqlQuery);
        return resultado.recordset;
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        throw error;
    }
}

/**
 * Executa stored procedures no banco de dados
 * @param {*} nomeStoredProcedure 
 * @param {*} parametros 
 */
async function querySoredProcedure_BancoDeDados(nomeStoredProcedure, parametros) {

    try {

        const request = pool.request();

        for (const nomeParametro in parametros) {
            if (Object.hasOwnProperty.call(parametros, nomeParametro)) {
                const valorParametro = parametros[nomeParametro];
                request.input(nomeParametro, valorParametro);
            }
        }

        const resultado = await request.execute(nomeStoredProcedure);
        return resultado.recordset;

    } catch (error) {
        console.error('Erro ao executar consulta em querySoredProcedure:', error);
        throw error.message;
    }
}


module.exports = {
    conectarBancoDeDados,
    desconectarBancoDeDados,
    query_BancoDeDados,
    querySoredProcedure_BancoDeDados
};
