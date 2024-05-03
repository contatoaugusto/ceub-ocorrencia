const { Client } = require('whatsapp-web.js');

const client = new Client();

function qrCodeLogin (){
    client.on('qr', (qr) => {
        // QR code gerado, você pode escanear o código QR com o seu telefone
        console.log('QR RECEIVED', qr);
    });
}

function enviaMensagem (numeroTelefone, mensagem){
    client.on('ready', () => {
        console.log('Client is ready!');
        
        // Número de telefone para o qual você deseja enviar a mensagem
        const phoneNumber = 'NUMBER'; // Substitua 'NUMBER' pelo número de telefone do destinatário
        
        // Enviar mensagem para o número especificado
        client.sendMessage(numeroTelefone, mensagem).then(message => {
            console.log('Mensagem enviada com sucesso:', message);
        }).catch(err => {
            console.error('Erro ao enviar mensagem:', err);
        });
    });
}

module.exports = {
    qrCodeLogin,
    enviaMensagem 
};
