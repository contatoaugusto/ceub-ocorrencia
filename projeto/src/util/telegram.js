// const TelegramBot = require('node-telegram-bot-api');

// /**
//  * Bot criado la no telegram
//  * Para criar um botno telegram pesquise na barra de pesquisa dele por botfather. Em seguina newbot e siga as instruções
//  */
// const token = '7070858490:AAGAtpg4RJsv6vBiRHSSI0J9_2hO9GvzMrM';

// const bot = new TelegramBot(token, { polling: true });

// /**
//  * Envia a mensagem para o bot criado no telegram
//  * @param numeroDestino 
//  * @param mensagem 
//  */
// function enviaMensagem(numeroDestino, mensagem) {
//     bot.sendMessage(numeroDestino, mensagem)
//         .then(() => {
//             console.log('Mensagem enviada com sucesso!');
//         })
//         .catch((error) => {
//             console.error('Erro ao enviar mensagem:', error);
//         });
// }

// module.exports = {
//     enviaMensagem
// };