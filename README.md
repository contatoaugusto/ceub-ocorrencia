Projeto de registro de ocorrência

Por ser tratar de um projeto node, o arquivo de entrada, o main/server, é o aquivo index.js que está na raiz do projeto.

Quase todas as configurações iniciais e que de fato ira caracterizar o servidor web é feito ai

Lembrando que é utilizado o EJS (https://ejs.co) como engine de manipulação de scriplets a serem embutidos nas páginas html e assim trafegar dados do servidor para cliente e de volta do cliente para o servidor.


<h4>Banco de Dados</h4>

<p>Quanto ao banco de dados é utilizado o SQL Expres ou SQL Server.</p>
<p>preciso configurar a string de conexão no arquivo <b>configuracoes.js</b></p>

<b>- projeto/src/configuracoes.js</b>

Mais precisamente no trecho:

<code>
// Máquina da Isabelle
//const config_banco_servidor = 'ISABELLE\\SQLEXPRESS'
// Máquina do Augusto
// const config_banco_servidor = 'DESKTOP-DUAAAQ5\\SQLEXPRESS'
// Maquina trabalho
const config_banco_servidor = '172.17.3.116\\SQLEXPRESS';

const config_banco_usuario = 'isabelle';
const config_banco_senha = 'isabelle';
const config_banco_nomebanco = 'OCODB';
</code>

Feito isso, execute os script contidos nos arquivos:

 - bancodados_scriptCriacao.sql
 - bancodados_scriptCriacao Prucedures e Funcoes.sql

Feito isso o banco tá pronto para uso