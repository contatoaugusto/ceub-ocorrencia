	
	
	USE MASTER
	GO

	DROP DATABASE IF EXISTS OCODB 
	GO

	CREATE DATABASE OCODB
	GO


	USE OCODB

	GO
	CREATE SCHEMA OCOTB
	GO 


	/************************************************** TABELAS DO SGI ****************************************/ 

	-- As chaves primárias das tabelas que se referem ao SGI não são "IDENTITY" justamente porque elas são carregadas via carga períodica replicando tudo que está no banco do SGI

	-- ************************************** [OCOTB].[Pessoa]
	CREATE TABLE [OCOTB].[Pessoa]
	(
	 [idPessoa] int NOT NULL ,
	 [nmPessoa] varchar(100) NOT NULL ,
	 [nuCPF]    char(11) NOT NULL ,


	 CONSTRAINT [PK_Pessoa] PRIMARY KEY CLUSTERED ([idPessoa] ASC),
	 CONSTRAINT [UK_Pessoa_CPF] UNIQUE NONCLUSTERED ([nuCPF] ASC)
	);
	GO

	
	CREATE TABLE [OCOTB].[Curso](
		[idCurso]		int NOT NULL,
		[nmCurso]		varchar(100) NOT NULL,
		[idCoordenador] INT,

	 CONSTRAINT PK_Curso PRIMARY KEY CLUSTERED (idCurso ASC),
	 CONSTRAINT FK_Curso_Pessoa FOREIGN KEY (idCoordenador)  REFERENCES OCOTB.Pessoa(idPessoa)
	)
	GO

	-- ************************************** [OCOTB].[Aluno]
	CREATE TABLE [OCOTB].[Aluno]
	(
		[idAluno]  int   NOT NULL ,
		[nuRA]     varchar(10) NOT NULL ,
		[idPessoa] int NOT NULL ,
		[idCurso]	int	NOT NULL,

		CONSTRAINT [PK_Aluno] PRIMARY KEY CLUSTERED ([idAluno] ASC),
		CONSTRAINT [FK_Aluno_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
		CONSTRAINT [FK_Aluno_Curso] FOREIGN KEY ([idCurso])  REFERENCES [OCOTB].[Curso]([idCurso])
	);
	GO


	CREATE NONCLUSTERED INDEX [IX_Aluno_Pessoa] ON [OCOTB].[Aluno] 
	 (
	  [idPessoa] ASC
	 )

	GO

	-- ************************************** [OCOTB].[Funcionario]
	CREATE TABLE [OCOTB].[Funcionario]
	(
	 [idFuncionario] int  NOT NULL ,
	 [deCargo]       varchar(50) NOT NULL ,
	 [nuTelefone]    varchar(11) NOT NULL ,
	 [idPessoa]      int NOT NULL ,


	 CONSTRAINT [PK_Funcionario] PRIMARY KEY CLUSTERED ([idFuncionario] ASC),
	 CONSTRAINT [FK_Funcionario_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa])
	);
	GO


	CREATE NONCLUSTERED INDEX [IX_Funcionario_Pessoa] ON [OCOTB].[Funcionario] 
	 (
	  [idPessoa] ASC
	 )
	GO

	CREATE TABLE [OCOTB].[Usuario](
		[idUsuario]		int  NOT NULL,
		[coAcesso]		varchar(10) NOT NULL,
		[coSenha]		varchar(50) NOT NULL,
		[deAcesso]		varchar(100) NULL,
		[idPessoa]      int NOT NULL,

	 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([idUsuario] ASC),
	 CONSTRAINT [FK_Usuario_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa])
	);
	GO

	CREATE TABLE [OCOTB].[Perfil](
		[idPerfil] int NOT NULL,
		[nmPerfil] VARCHAR (30)  NOT NULL,
		[dePerfil] VARCHAR (300) NULL,

		CONSTRAINT [PK_Perfil] PRIMARY KEY CLUSTERED ([idPerfil] ASC),
	)
	GO

	CREATE TABLE [OCOTB].[PerfilUsuario] (
		[idPerfilUsuario]	int NOT NULL,
		[idPerfil]			int NOT NULL,
		[idUsuario]			int NOT NULL,

		CONSTRAINT [FK_PerfilUsuario_Perfil] FOREIGN KEY ([idPerfil])  REFERENCES OCOTB.Perfil([idPerfil]),
		CONSTRAINT [FK_PerfilUsuario_Usuario] FOREIGN KEY ([idUsuario])  REFERENCES [OCOTB].[Usuario]([idUsuario])
	);
	GO


	/************************************************** FIM TABELAS DO SGI ****************************************/ 


	/************************************************** TABELAS SISTEMA OCORRENCIA ****************************************/ 
	-- ************************************** [OCOTB].[TipoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaTipo]
	(
	 [idOcorrenciaTipo] tinyint IDENTITY (1, 1) NOT NULL ,
	 [deOcorrenciaTipo] varchar(50) NOT NULL ,


	 CONSTRAINT [PK_OcorrenciaTipo] PRIMARY KEY CLUSTERED ([idOcorrenciaTipo] ASC)
	);
	GO

	CREATE NONCLUSTERED INDEX UK_OcorrenciaTipo ON OCOTB.OcorrenciaTipo (deOcorrenciaTipo ASC)
	GO


	-- ************************************** [OCOTB].[SubTipoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaSubTipo]
	(
	 [idOcorrenciaSubTipo] int IDENTITY (1, 1) NOT NULL ,
	 [idOcorrenciaTipo]    tinyint NOT NULL ,
	 [deOcorrenciaSubTipo] varchar(50) NOT NULL ,
 
	 CONSTRAINT [PK_OcorrenciaSubTipo] PRIMARY KEY CLUSTERED ([idOcorrenciaSubTipo] ASC),
	 CONSTRAINT [FK_OcorrenciaSubTipo_OcorrenciaTipo] FOREIGN KEY ([idOcorrenciaTipo])  REFERENCES [OCOTB].[OcorrenciaTipo]([idOcorrenciaTipo])
	);
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaSubTipo_Ocorrencia] ON [OCOTB].[OcorrenciaSubTipo] ([idOcorrenciaTipo] ASC)
	GO


	
	-- ************************************** [OCOTB].[ResponsavelTipoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaTipoResponsavel]
	(
		[idOcorrenciaTipoResponsavel]	int IDENTITY (1, 1) NOT NULL ,
		[idOcorrenciaTipo]				tinyint NOT NULL ,
		[idPessoa]						int		NULL ,
		[idPerfil]						int		NULL ,  -- Nesse caso deve integrar com o SGI e ler a tabela SISTB.PerfilUsuario para descobrir todos os usuários que tem acesso a esse perfil,
		[icEnviaCoordenadorCurso]		bit		NULL,	-- Incorma que nesse caso o responsável dessa

		 CONSTRAINT [PK_OcorrenciaTipoResponsavel] PRIMARY KEY CLUSTERED ([idOcorrenciaTipoResponsavel] ASC),
		 CONSTRAINT [UK_OcorrenciaTipoResponsavel_Pessoa_OcorrenciaTipo] UNIQUE NONCLUSTERED ([idPessoa] ASC, [idOcorrenciaTipo] ASC),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_Perfil] FOREIGN KEY ([idPerfil])  REFERENCES [OCOTB].[Perfil]([idPerfil]),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_OcorrenciaTipo] FOREIGN KEY ([idOcorrenciaTipo])  REFERENCES [OCOTB].[OcorrenciaTipo]([idOcorrenciaTipo])
	);
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaTipoResponsavel_Pessoa] ON [OCOTB].[OcorrenciaTipoResponsavel] ([idPessoa] ASC)
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaTipoResponsavel_OcorrenciaTipo] ON [OCOTB].[OcorrenciaTipoResponsavel] ([idOcorrenciaTipo] ASC)
	GO


	-- ************************************** [OCOTB].[SituacaoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaSituacao]
	(
	 [idOcorrenciaSituacao] tinyint IDENTITY (1, 1) NOT NULL ,
	 [deOcorrenciaSituacao] varchar(30) NOT NULL ,

	 CONSTRAINT [PK_OcorrenciaSituacao] PRIMARY KEY CLUSTERED ([idOcorrenciaSituacao] ASC),
	 CONSTRAINT [UK_OcorrenciaSituacao] UNIQUE NONCLUSTERED ([deOcorrenciaSituacao] ASC)
	);
	GO

	-- ************************************** [OCOTB].[Local]
	CREATE TABLE [OCOTB].[Local]
	(
	 [idLocal] int IDENTITY (1, 1) NOT NULL ,
	 [nmBloco] varchar(20) NOT NULL ,
	 [nuSala]  varchar(20) NOT NULL ,
	 [nmLocal] varchar(50) NOT NULL ,


	 CONSTRAINT [PK_Local] PRIMARY KEY CLUSTERED ([idLocal] ASC)
	);
	GO

	-- ************************************** [OCOTB].[Ocorrencia]
	CREATE TABLE [OCOTB].[Ocorrencia]
	(
	 [idOcorrencia]			int IDENTITY (1, 1) NOT NULL ,
	 [deOcorrencia]			text NOT NULL ,
	 [dtOcorrencia]			datetime NOT NULL DEFAULT (GETDATE()),
	 [idLocal]				int NOT NULL ,
	 [idPessoa]				int NOT NULL ,
	 [idOcorrenciaSubTipo]	int NOT NULL ,
	 [idCurso]				int NULL,		-- Obrigatório preencher quando for uma Ocorrenciasubtipo cuja OcorrenciaTipoResponsavel tiver o icEnviaCoordenadorCurso = 1. Pois indica que é pra enviar para o coordenador desse curso

	 CONSTRAINT [PK_Ocorrencia] PRIMARY KEY CLUSTERED ([idOcorrencia] ASC),
	 CONSTRAINT [FK_Ocorrencia_Local] FOREIGN KEY ([idLocal])  REFERENCES [OCOTB].[Local]([idLocal]),
	 CONSTRAINT [FK_Ocorrencia_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
	 CONSTRAINT [FK_Ocorrencia_OcorrenciaSubTipo] FOREIGN KEY ([idOcorrenciaSubTipo])  REFERENCES [OCOTB].[OcorrenciaSubTipo]([idOcorrenciaSubTipo])
	);
	GO

	CREATE NONCLUSTERED INDEX [IX_Ocorrencia_Local] ON [OCOTB].[Ocorrencia] ([idLocal] ASC)
	GO

	CREATE NONCLUSTERED INDEX [IX_Ocorrencia_Pessoa] ON [OCOTB].[Ocorrencia]([idPessoa] ASC)
	GO

	CREATE NONCLUSTERED INDEX [IX_Ocorrencia_OcorrenciaSubTipo] ON [OCOTB].[Ocorrencia]([idOcorrenciaSubTipo] ASC)
	GO

	-- ************************************** [OCOTB].[HistoricoSituacaoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaHistoricoSituacao]
	(
	 [idOcorrenciaHistoricoSituacao]	int IDENTITY (1, 1) NOT NULL ,
	 [idOcorrencia]						int NOT NULL ,
	 [dtOcorrenciaSituacao]				datetime NOT NULL DEFAULT(GETDATE()),
	 [idOcorrenciaSituacao]				tinyint NOT NULL,
	 [icAtivo]							bit	NOT NULL DEFAULT (1),

	 CONSTRAINT [PK_OcorrenciaHistoricoSituacao] PRIMARY KEY CLUSTERED ([idOcorrenciaHistoricoSituacao] ASC),
	 CONSTRAINT [FK_OcorrenciaHistoricoSituacao_Ocorrencia] FOREIGN KEY ([idOcorrencia])  REFERENCES [OCOTB].[Ocorrencia]([idOcorrencia]),
	 CONSTRAINT [FK_OcorrenciaHistoricoSituacao_OcorrenciaSituacao] FOREIGN KEY ([idOcorrenciaSituacao])  REFERENCES [OCOTB].[OcorrenciaSituacao]([idOcorrenciaSituacao])
	);
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaHistoricoSituacao_Ocorrencia] ON [OCOTB].[OcorrenciaHistoricoSituacao] ([idOcorrencia] ASC)
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaHistoricoSituacao_OcorrenciaSituacao] ON [OCOTB].[OcorrenciaHistoricoSituacao] ([idOcorrenciaSituacao] ASC)
	GO

	-- TRIGGER para manter sempre apenas o último registro ativo
	CREATE TRIGGER OCOTB.TG_OcorrenciaHistoricoSituacao_Insert ON  OCOTB.OcorrenciaHistoricoSituacao 
	   AFTER INSERT
	AS 
	BEGIN

		-- verifica se existe algum registro anterior com o campo icAtiva = 1 para o mesmo boleto
		DECLARE 
			@_idOcorrenciaHistoricoSituacao	INT,
			@_idOcorrencia					INT,
			@_icAtivo						BIT
	
		DECLARE cOcorrenciaHistoricoSituacao CURSOR STATIC LOCAL FORWARD_ONLY READ_ONLY FOR 
		SELECT idOcorrenciaHistoricoSituacao, idOcorrencia, icAtivo FROM inserted

		OPEN cOcorrenciaHistoricoSituacao
		WHILE (1 = 1) 
		BEGIN
		FETCH NEXT FROM cOcorrenciaHistoricoSituacao INTO  @_idOcorrenciaHistoricoSituacao, @_idOcorrencia, @_icAtivo

			IF @@FETCH_STATUS <> 0 BREAK  

			IF (ISNULL(@_icAtivo, 0) = 1)
			BEGIN
				-- Atualiza o(s) registro(s) anteior(es) para icAtiva = 0
				UPDATE OCOTB.OcorrenciaHistoricoSituacao  SET icAtivo = 0 WHERE idOcorrenciaHistoricoSituacao <> @_idOcorrenciaHistoricoSituacao AND idOcorrencia = @_idOcorrencia
			END
		END

	END
	GO



	/*********************************** Cargas table SGI ***********************************/
	-- As cargas das tabelas que pertencem ao SGI e ja existem será feitas por algum mencanismo de integração ou até mesmo linked server
	-- Ou se este sistema for de fato implantado dentro do CEUB e rodar no banco que já existe. Ai não precisa fazer mais nada
	INSERT INTO  OCOTB.Pessoa (
		idPessoa,
		nmPessoa,
		nuCPF)
	VALUES
		(1, 'Isabelle',			'57336998097'),
		(2, 'Sergio Cozzetti',	'67256131011'),
		(3, 'Antonio Augusto',	'00235385034'),
		(4, 'Pessoa Aluno de Teste',	'68917126022'),
		(5, 'Outra Pessoa Aluno de Teste',	'59482146050'),
		(6, 'Débora Esther Helena Nunes',	'94180971763'),
		(7, 'Bryan Anderson Francisco Carvalho', '61469479389'),
		(8, 'Pessoa Coordenador Análise', '06675655310'),
		(9, 'Pessoa Coordenador Direito', '06675655311'),
		(10, 'Pessoa Coordenador Administração', '06675655312'),
		(11, 'Pessoa Coordenador Medicina', '06675655313')
	GO


	INSERT INTO  OCOTB.Curso (
		idCurso,
		nmCurso,
		idCoordenador)
	VALUES
		(1, 'Análise de Sistemas', 8),
		(2, 'Direito', 9),
		(3, 'Administração', 10),
		(4, 'Medicina', 11)
	GO


	INSERT INTO OCOTB.Aluno(
		idAluno,
		nuRA,
		idPessoa,
		idCurso)
	VALUES
		(1, '123456789', 1, 1),
		(2, '20318227', 3, 4),
		(3, '22222222', 3, 2)
	GO


	INSERT INTO OCOTB.Funcionario(
		idFuncionario,
		deCargo,
		nuTelefone,
		idPessoa)
	VALUES
		(1, 'Técnico de Suporte', '61992737164', 6),
		(2, 'Gerente Desenvolvimento Sistemas', '61992737162', 2),
		(3, 'Gestor de Redes', '61992737164', 7)
	GO
	
	INSERT INTO OCOTB.Usuario (
		idUsuario,
		coAcesso,
		coSenha,
		deAcesso,
		idPessoa) 
	values 
		(1, '20318227', '123', 'usuario 20318227', 1),
		(2, '123456', '123', 'usuario 123456', 2),
		(3, 'teste', 'teste', 'usuario teste', 7),
		(4, '86540', '123', 'Usuario Funcionario Teste', 3),
		(5, '86541', '123', 'Usuario Coordenador Curso', 3)
	GO

	INSERT INTO OCOTB.Perfil (
		idPerfil,
		nmPerfil,
		dePerfil)
	VALUES 
		(1, 'Ocorrência Administrador', 'Acesso a tudo'),
		(2, 'Ocorrência Desenvolvimento', 'Responsável por sistemas e melhorias'),
		(3, 'Ocorrência Suporte de TI', 'Suporte em geral'),
		(4, 'Ocorrência Engenharia', 'Resolve problemas de manutenção de espaços físicos'),
		(5, 'Ocorrência Cordenador', 'Grupo de cordenadores')

	INSERT INTO OCOTB.PerfilUsuario (
		idPerfilUsuario,
		idPerfil,
		idUsuario)
	VALUES 
		(1, 1, 4),
		(2, 5, 5)
	GO
	/*********************************** FIM Cargas table SGI ***********************************/
	

	INSERT INTO [OCOTB].[OcorrenciaTipo]
		([deOcorrenciaTipo])
	VALUES
		 ('Professor')
		,('Sala de Aula')
		,('Recursos Informática')
		,('Campus')
		,('Praça de Alimentação')
	GO

	
	INSERT INTO [OCOTB].[OcorrenciaSubTipo]
		([idOcorrenciaTipo]
		,[deOcorrenciaSubTipo])
	VALUES
		(1,'Atraso')
		,(1,'Saída antecipada')
		,(1,'Falta injustificada')
		,(1,'Conteúdo não previsto no plano de ensino')
		,(1, 'Comportamento ')
		,(2, 'Infra estrutura da Sala')
	GO

	
	INSERT INTO OCOTB.OcorrenciaSituacao (deOcorrenciaSituacao)
	VALUES
		('Criada'),
		('Enviada para Responsável'),
		('Indeferido'),
		('Em Atendimento'),
		('Finalizada')

	INSERT INTO OCOTB.Local(
		nmBloco,
		nuSala,
		nmLocal)
	VALUES 
		('Bloco 10', '114', 'Laboratóiro de computação')

	INSERT INTO OCOTB.Ocorrencia(
		deOcorrencia,
		idLocal,
		idPessoa,
		idOcorrenciaSubTipo,
		idCurso)
	VALUES
		('Providenciar computador na sala 114', 1, 1, 6, 1)

	INSERT INTO OCOTB.OcorrenciaHistoricoSituacao (
		idOcorrencia,
		idOcorrenciaSituacao,
		icAtivo)
	VALUES
		(1, 1, 1)


	select * from sys.dm_server_registry
	where registry_key like '%IPALL'
	and value_name like 'TCP%PORT%'
	and nullif(value_data, '') is not null