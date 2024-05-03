const { Client } = require('whatsapp-web.js');

class WhatsAppSender {
    constructor() {
        this.client = new Client();
        this.initialize();
    }

    initialize() {
        this.client.on('qr', this.onQR.bind(this));
        this.client.on('ready', this.onReady.bind(this));
        this.client.initialize();
    }

    onQR(qr) {
        console.log('QR RECEIVED', qr);
        // Aqui você pode exibir o QR em uma interface gráfica ou enviá-lo para o console para escaneamento manual.
    }

    onReady() {
        console.log('Client is ready!');
        // Chame o método para enviar a mensagem após o cliente estar pronto
        this.sendMessage('61992737257', 'Sua mensagem aqui');
    }

    sendMessage(phoneNumber, message) {
        this.client.sendMessage(phoneNumber, message).then(message => {
            console.log('Mensagem enviada com sucesso:', message);
        }).catch(err => {
            console.error('Erro ao enviar mensagem:', err);
        });
    }
}

module.exports = WhatsAppSender;
