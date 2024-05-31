const sgMail = require('@sendgrid/mail')

// É preciso adicionar a chave da API gerada no servidor de SMPT https://sendgrid.com
// O github não permite que essa informação seja versionada
sgMail.setApiKey('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')

function enviaMensagem (emailTo, assunto, mensagem){

    const msg = {
        to: emailTo, // Change to your recipient
        from: 'contatoaugusto@gmail.com', // Change to your verified sender
        subject: assunto,
        text: mensagem,
        html: mensagem,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}

module.exports = {
    enviaMensagem 
};
