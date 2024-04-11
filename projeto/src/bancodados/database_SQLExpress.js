
const sql = require('mssql');

const config = {
    user: 'isabelle',
    password: 'isabelle',
    
    // Máquina da Isabelle
    //server: 'ISABELLE/SQLEXPRESS',
    
    // Máquina do Augusto
    server: 'DESKTOP-DUAAAQ5\\SQLEXPRESS',
    
    database: 'OCODB',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true
    }
};

let pool = null;

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


async function query(sqlQuery) {
    try {
        const resultado = await pool.query(sqlQuery);
        return resultado.recordset;
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        throw error;
    }
}

module.exports = {
    conectarBancoDeDados,
    desconectarBancoDeDados,
    query
};
