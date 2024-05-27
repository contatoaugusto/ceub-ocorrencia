/**
 * Classe contruida de tal maneira se por acaso resolver trocar o banco de dados, basta mudar o import abaixo
 * Claro que isso depois de contruir o módulo de conexao com o novo banco em questão
 * Dessa maneira fica totalmente transparante para os diversos módulos cliente que consomem os métodos conectarBanco, query e querySoredProcedure
 */
const { conectarBancoDeDados, desconectarBancoDeDados, query_BancoDeDados, querySoredProcedure_BancoDeDados } = require('../bancodados/database_SQLExpress');
//const { conectarBancoDeDados, desconectarBancoDeDados } = require('../bancodados/database_PostgreSQL');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function conectarBanco(req, res, next) {
    try {
        await conectarBancoDeDados();
        next();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados (databaseMidleWare):', error);
        res.status(500).json({ message: 'Erro interno do servidor  (databaseMidleWare)' });
    }
}

async function desconectarBanco(req, res, next) {
    try {
        await desconectarBancoDeDados();
        next();
    } catch (error) {
        console.error('Erro ao desconectar do banco de dados (databaseMidleWare):', error);
        res.status(500).json({ message: 'Erro interno do servidor (databaseMidleWare)' });
    }
}

async function query(sqlQuery) {
    try {
        return await query_BancoDeDados(sqlQuery);
    } catch (error) {
        console.error('Erro ao executar a query (databaseMidleWare): ' + sqlQuery, error);
        res.status(500).json({ message: 'Erro interno do servidor (databaseMidleWare)' });
    }
}

async function querySoredProcedure(nomeStoredProcedure, parametros) {
    try {
        return await querySoredProcedure_BancoDeDados(nomeStoredProcedure, parametros);
    } catch (error) {
        console.error('Erro ao executar a stored procedure (databaseMidleWare): ' + nomeStoredProcedure, error);
        //res.status(500).json({ message: 'Erro interno do servidor (databaseMidleWare)' });
        throw error;
    }
}

module.exports = { conectarBanco, desconectarBanco, query, querySoredProcedure };
