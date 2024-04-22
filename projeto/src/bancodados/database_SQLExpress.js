
const sql = require('mssql');

const config = {
    user: 'isabelle',
    password: 'isabelle',
    
    // Máquina da Isabelle
    //server: 'ISABELLE\\SQLEXPRESS',
    
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
async function query(sqlQuery) {
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
async function querySoredProcedure(nomeStoredProcedure, parametros) {

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
        throw error.originalError.errors[0].message;
    }
    //  finally {
    //     sql.close();
    // }
}


module.exports = {
    conectarBancoDeDados,
    desconectarBancoDeDados,
    query,
    querySoredProcedure
};
