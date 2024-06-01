	
	
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
	 [nuCPF]    char(11) NOT NULL,
	 [urlFOto]  varchar(100) NULL,
	 [nuTelefone]  varchar(12) NULL,
	 [edMail]  varchar(50) NOT NULL,
	 
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
		[nmPerfil] VARCHAR (100)  NOT NULL,
		[dePerfil] VARCHAR (300) NULL,

		CONSTRAINT [PK_Perfil] PRIMARY KEY CLUSTERED ([idPerfil] ASC),
	)
	GO

	CREATE TABLE [OCOTB].[PerfilUsuario] (
		[idPerfilUsuario]	int NOT NULL,
		[idPerfil]			int NOT NULL,
		[idUsuario]			int NOT NULL,
		[icAtivo]			bit	NOT NULL DEFAULT(1),

		CONSTRAINT [FK_PerfilUsuario_Perfil] FOREIGN KEY ([idPerfil])  REFERENCES OCOTB.Perfil([idPerfil]),
		CONSTRAINT [FK_PerfilUsuario_Usuario] FOREIGN KEY ([idUsuario])  REFERENCES [OCOTB].[Usuario]([idUsuario])
	);
	GO


	/************************************************** FIM TABELAS DO SGI ****************************************/ 


	/************************************************** TABELAS SISTEMA OCORRENCIA ****************************************/ 
	-- ************************************** [OCOTB].[TipoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaTipo]
	(
	 [idOcorrenciaTipo]					tinyint IDENTITY (1, 1) NOT NULL ,
	 [nmOcorrenciaTipo]					varchar(50) NOT NULL ,
	 [icResponsavelCoordenadorCurso]	bit		NOT NULL DEFAULT (0),	-- Incorma que nesse caso o responsável dessa ocrrência é o coordenador do curso. ENtão é obrigatório informar o idCurso na ocorrência

	 CONSTRAINT [PK_OcorrenciaTipo] PRIMARY KEY CLUSTERED ([idOcorrenciaTipo] ASC)
	);
	GO

	CREATE NONCLUSTERED INDEX UK_OcorrenciaTipo ON OCOTB.OcorrenciaTipo (nmOcorrenciaTipo ASC)
	GO


	-- ************************************** [OCOTB].[SubTipoOcorrencia]
	CREATE TABLE [OCOTB].[OcorrenciaSubTipo]
	(
	 [idOcorrenciaSubTipo] int IDENTITY (1, 1) NOT NULL ,
	 [idOcorrenciaTipo]    tinyint NOT NULL ,
	 [nmOcorrenciaSubTipo] varchar(50) NOT NULL ,
 
	 CONSTRAINT [PK_OcorrenciaSubTipo] PRIMARY KEY CLUSTERED ([idOcorrenciaSubTipo] ASC),
	 CONSTRAINT [FK_OcorrenciaSubTipo_OcorrenciaTipo] FOREIGN KEY ([idOcorrenciaTipo])  REFERENCES [OCOTB].[OcorrenciaTipo]([idOcorrenciaTipo])
	);
	GO

	CREATE NONCLUSTERED INDEX [IX_OcorrenciaSubTipo_Ocorrencia] ON [OCOTB].[OcorrenciaSubTipo] ([idOcorrenciaTipo] ASC)
	GO


	
	-- ************************************** [OCOTB].[ResponsavelTipoOcorrencia]
	CREATE TABLE OCOTB.OcorrenciaTipoResponsavel
	(
		[idOcorrenciaTipoResponsavel]	int IDENTITY (1, 1) NOT NULL ,
		[idOcorrenciaTipo]				tinyint NOT NULL ,
		[idPessoa]						int		NULL ,
		[idPerfil]						int		NULL ,  -- Nesse caso deve integrar com o SGI e ler a tabela SISTB.PerfilUsuario para descobrir todos os usuários que tem acesso a esse perfil,
		[icAtivo]						bit		NOT NULL DEFAULT(1),
		
		 CONSTRAINT [PK_OcorrenciaTipoResponsavel] PRIMARY KEY CLUSTERED ([idOcorrenciaTipoResponsavel] ASC),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_Perfil] FOREIGN KEY ([idPerfil])  REFERENCES [OCOTB].[Perfil]([idPerfil]),
		 CONSTRAINT [FK_OcorrenciaTipoResponsavel_OcorrenciaTipo] FOREIGN KEY ([idOcorrenciaTipo])  REFERENCES [OCOTB].[OcorrenciaTipo]([idOcorrenciaTipo])
	);
	GO

	CREATE UNIQUE INDEX UQ_OcorrenciaTipoResponsavel_Pessoa_Perfil_icAtivo ON OCOTB.OcorrenciaTipoResponsavel (idPessoa, idPerfil, idOcorrenciaTipo) WHERE icAtivo = 1;
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


	-- ************************************** OCOTB.Menu
	CREATE TABLE OCOTB.Menu
	(
	 idMenu 	int IDENTITY (1, 1) NOT NULL ,
	 nmMenu 	varchar(50) NOT NULL ,
	 urlRota 	varchar(100) NOT NULL ,
	 idMenuPai 	int	NULL,
	 nuOrdem	INT NOT NULL,

	 CONSTRAINT [PK_Menu] PRIMARY KEY CLUSTERED ([idMenu] ASC),
	 CONSTRAINT [FK_Menu_Menu] FOREIGN KEY ([idMenuPai])  REFERENCES [OCOTB].[Menu]([idMenu])
	);
	GO

	
-- ************************************** OCOTB.MenuPerfil
	CREATE TABLE OCOTB.MenuPerfil
	(
	 idMenuPerfil 	int IDENTITY (1, 1) NOT NULL ,
	 idMenu 		int NOT NULL,
	 idPerfil 		int NOT NULL,
	 icAtivo		BIT NOT NULL DEFAULT (1),

	 CONSTRAINT [PK_MenuPerfil] PRIMARY KEY CLUSTERED ([idMenuPerfil] ASC),
	 CONSTRAINT [FK_MenuPerfil_Menu] FOREIGN KEY ([idMenu])  REFERENCES [OCOTB].[Menu]([idMenu]),
	 CONSTRAINT [FK_MenuPerfil_Perfil] FOREIGN KEY ([idPerfil])  REFERENCES [OCOTB].[Perfil]([idPerfil])
	);
	GO

	CREATE UNIQUE INDEX UQ_MenuPerfil_Menu_Perfil_icAtivo ON OCOTB.MenuPerfil (idMenu, idPerfil) WHERE icAtivo = 1;
	GO 

	-- ************************************** [OCOTB].[Ocorrencia]
	CREATE TABLE [OCOTB].[Ocorrencia]
	(
	 [idOcorrencia]			int IDENTITY (1, 1) NOT NULL ,
	 [deOcorrencia]			text NOT NULL ,
	 [dtOcorrencia]			datetime NOT NULL DEFAULT (GETDATE()),
	 [idLocal]				int NULL ,
	 [idPessoa]				int NOT NULL ,
	 [idOcorrenciaSubTipo]	int NOT NULL ,
	 [idCurso]				int NULL,		-- Obrigatório preencher quando for uma Ocorrenciasubtipo cuja OcorrenciaTipoResponsavel tiver o icEnviaCoordenadorCurso = 1. Pois indica que é pra enviar para o coordenador desse curso

	 CONSTRAINT [PK_Ocorrencia] PRIMARY KEY CLUSTERED ([idOcorrencia] ASC),
	 CONSTRAINT [FK_Ocorrencia_Local] FOREIGN KEY ([idLocal])  REFERENCES [OCOTB].[Local]([idLocal]),
	 CONSTRAINT [FK_Ocorrencia_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
	 CONSTRAINT [FK_Ocorrencia_OcorrenciaSubTipo] FOREIGN KEY ([idOcorrenciaSubTipo])  REFERENCES [OCOTB].[OcorrenciaSubTipo]([idOcorrenciaSubTipo])
	);
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


	-- ************************************** [OCOTB].[OcorrenciaResponsavel]
	-- Para armezenar os responsáveis por essa ocorrencias e não perder a rastreabilidade de quem foi que aprovou ou atendeu dterminada ocorrência
	CREATE TABLE OCOTB.OcorrenciaResponsavel
	(
		idOcorrenciaResponsavel	int IDENTITY (1, 1) NOT NULL ,
		idOcorrencia	int NOT NULL ,
		idPessoa		int NULL, -- Esse é o presponsável por essa demanda, por essa ocorrências
		idPerfil		int NULL, -- Esse é o presponsável por essa demanda, por essa ocorrências

		CONSTRAINT PK_OcorrenciaResponsavel PRIMARY KEY CLUSTERED (idOcorrenciaResponsavel ASC),
		CONSTRAINT FK_OcorrenciaResponsavel_Ocorrencia FOREIGN KEY ([idOcorrencia])  REFERENCES OCOTB.Ocorrencia(idOcorrencia),
		CONSTRAINT FK_OcorrenciaResponsavel_Pessoa FOREIGN KEY ([idPessoa])  REFERENCES OCOTB.Pessoa(idPessoa),
		CONSTRAINT FK_OcorrenciaResponsavel_Perfil FOREIGN KEY ([idPerfil])  REFERENCES OCOTB.Perfil(idPerfil),
		CONSTRAINT CK_OcorrenciaResponsave_Pessoa_Perfil CHECK (idPessoa IS NOT NULL OR idPerfil IS NOT NULL)
	);
	GO


	

	USE OCODB;
	GO
	ALTER AUTHORIZATION ON DATABASE::OCODB TO isabelle;
	GO

	select * from sys.dm_server_registry
	where registry_key like '%IPALL'
	and value_name like 'TCP%PORT%'
	and nullif(value_data, '') is not null
