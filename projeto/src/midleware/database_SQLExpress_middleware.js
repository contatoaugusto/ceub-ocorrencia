

const { conectarBancoDeDados, desconectarBancoDeDados } = require('../bancodados/database_SQLExpress');

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

module.exports = { conectarBanco, desconectarBanco };
