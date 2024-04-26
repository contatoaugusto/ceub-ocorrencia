function formataData(data) {
    // Obtém os componentes da data
    let dia = String(data.getDate()).padStart(2, '0'); // Adiciona um zero à esquerda se necessário
    let mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses começam do zero, então adicionamos 1
    let ano = data.getFullYear();
    let horas = String(data.getHours()).padStart(2, '0');
    let minutos = String(data.getMinutes()).padStart(2, '0');

    // Retorna a data formatada
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

module.exports = {
    formataData
};