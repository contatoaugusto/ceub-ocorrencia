	use master
go
drop database OCODB 
 go
create database OCODB
go
use OCODB

go
create schema OCOTB
go 

-- ************************************** [OCOTB].[Pessoa]
CREATE TABLE [OCOTB].[Pessoa]
(
 [idPessoa] int IDENTITY (1, 1) NOT NULL ,
 [nmPessoa] varchar(100) NOT NULL ,
 [nuCPF]    char(11) NOT NULL ,


 CONSTRAINT [PK_Pessoa] PRIMARY KEY CLUSTERED ([idPessoa] ASC),
 CONSTRAINT [UK_Pessoa_CPF] UNIQUE NONCLUSTERED ([nuCPF] ASC)
);
GO

-- ************************************** [OCOTB].[Aluno]
CREATE TABLE [OCOTB].[Aluno]
(
 [idAluno]  int IDENTITY (1, 1) NOT NULL ,
 [nmCurso]  varchar(20) NOT NULL ,
 [nuRA]     varchar(10) NOT NULL ,
 [idPessoa] int NOT NULL ,


 CONSTRAINT [PK_Aluno] PRIMARY KEY CLUSTERED ([idAluno] ASC),
 CONSTRAINT [FK_Aluno_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa])
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
 [idFuncionario] int IDENTITY (1, 1) NOT NULL ,
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

-- ************************************** [OCOTB].[TipoOcorrencia]
CREATE TABLE [OCOTB].[TipoOcorrencia]
(
 [idTipoOcorrencia] tinyint IDENTITY (1, 1) NOT NULL ,
 [deTipoOcorrencia] varchar(50) NOT NULL ,


 CONSTRAINT [PK_TipoOcorrencia] PRIMARY KEY CLUSTERED ([idTipoOcorrencia] ASC)
);
GO


CREATE NONCLUSTERED INDEX [UK_TipoOcorrencia] ON [OCOTB].[TipoOcorrencia] 
 (
  [deTipoOcorrencia] ASC
 )

GO

-- ************************************** [OCOTB].[SubTipoOcorrencia]
CREATE TABLE [OCOTB].[SubTipoOcorrencia]
(
 [idSubTipoOcorrencia] int IDENTITY (1, 1) NOT NULL ,
 [idTipoOcorrencia]    tinyint NOT NULL ,
 [deSubTipoOcorrencia] varchar(50) NOT NULL ,
 


 CONSTRAINT [PK_SubTipoOcorrencia] PRIMARY KEY CLUSTERED ([idSubTipoOcorrencia] ASC),
 CONSTRAINT [FK_SubTipoOcorrencia_TipoOcorrencia] FOREIGN KEY ([idTipoOcorrencia])  REFERENCES [OCOTB].[TipoOcorrencia]([idTipoOcorrencia])
);
GO


CREATE NONCLUSTERED INDEX [IX_SubTipoOCorrencia_Ocorrencia] ON [OCOTB].[SubTipoOcorrencia] 
 (
  [idTipoOcorrencia] ASC
 )

GO


-- ************************************** [OCOTB].[ResponsavelTipoOcorrencia]
CREATE TABLE [OCOTB].[ResponsavelTipoOcorrencia]
(
 [idResponsavelTipoOcorrencia] int IDENTITY (1, 1) NOT NULL ,
 [idTipoOcorrencia]            tinyint NOT NULL ,
 [idFuncionario]               int NOT NULL ,


 CONSTRAINT [PK_ResponsavelTipoOcorrencia] PRIMARY KEY CLUSTERED ([idResponsavelTipoOcorrencia] ASC),
 CONSTRAINT [UK_ResponsavelTipoOcorrencia] UNIQUE NONCLUSTERED ([idFuncionario] ASC, [idTipoOcorrencia] ASC),
 CONSTRAINT [FK_Funcionario_ResponsavelTipoOcorrencia] FOREIGN KEY ([idFuncionario])  REFERENCES [OCOTB].[Funcionario]([idFuncionario]),
 CONSTRAINT [FK_ResponsavelTipoOcorrencia_TipoOcorrencia] FOREIGN KEY ([idTipoOcorrencia])  REFERENCES [OCOTB].[TipoOcorrencia]([idTipoOcorrencia]),
);
GO


CREATE NONCLUSTERED INDEX [IX_ResponsavelTipoOcorrencia_Funcionario] ON [OCOTB].[ResponsavelTipoOcorrencia] 
 (
  [idFuncionario] ASC
 )

GO

CREATE NONCLUSTERED INDEX [IX_ResponsavelTipoOcorrencia_TipoOcorrencia] ON [OCOTB].[ResponsavelTipoOcorrencia] 
 (
  [idTipoOcorrencia] ASC
 )

GO


-- ************************************** [OCOTB].[SituacaoOcorrencia]
CREATE TABLE [OCOTB].[SituacaoOcorrencia]
(
 [idSituacaoOcorrencia] tinyint IDENTITY (1, 1) NOT NULL ,
 [deSituacaoOcorrencia] varchar(30) NOT NULL ,


 CONSTRAINT [PK_SituacaoOcorrencia] PRIMARY KEY CLUSTERED ([idSituacaoOcorrencia] ASC),
 CONSTRAINT [UK_SituacaoOcorrencia] UNIQUE NONCLUSTERED ([deSituacaoOcorrencia] ASC)
);
GO

-- ************************************** [OCOTB].[Local]
CREATE TABLE [OCOTB].[Local]
(
 [idLocal] int IDENTITY (1, 1) NOT NULL ,
 [nmBloco] varchar(20) NOT NULL ,
 [nuSala]  varchar(20) NOT NULL ,
 [nmLocal] varchar(20) NOT NULL ,


 CONSTRAINT [PK_Local] PRIMARY KEY CLUSTERED ([idLocal] ASC)
);
GO

-- ************************************** [OCOTB].[Ocorrencia]
CREATE TABLE [OCOTB].[Ocorrencia]
(
 [idOcorrencia]        int IDENTITY (1, 1) NOT NULL ,
 [deOcorrencia]        text NOT NULL ,
 [dtOcorrencia]        datetime NOT NULL ,
 [idLocal]             int NOT NULL ,
 [idPessoa]            int NOT NULL ,
 [idSubTipoOcorrencia] int NOT NULL ,


 CONSTRAINT [PK_Ocorrencia] PRIMARY KEY CLUSTERED ([idOcorrencia] ASC),
 CONSTRAINT [FK_Ocorrencia_Local] FOREIGN KEY ([idLocal])  REFERENCES [OCOTB].[Local]([idLocal]),
 CONSTRAINT [FK_Ocorrencia_Pessoa] FOREIGN KEY ([idPessoa])  REFERENCES [OCOTB].[Pessoa]([idPessoa]),
 CONSTRAINT [FK_Ocorrencia_SubTipoOcorrencia] FOREIGN KEY ([idSubTipoOcorrencia])  REFERENCES [OCOTB].[SubTipoOcorrencia]([idSubTipoOcorrencia])
);
GO


CREATE NONCLUSTERED INDEX [IX_Ocorrencia_Local] ON [OCOTB].[Ocorrencia] 
 (
  [idLocal] ASC
 )

GO

CREATE NONCLUSTERED INDEX [IX_Ocorrencia_Pessoa] ON [OCOTB].[Ocorrencia] 
 (
  [idPessoa] ASC
 )

GO

CREATE NONCLUSTERED INDEX [IX_Ocorrencia_SubTipoOcorrencia] ON [OCOTB].[Ocorrencia] 
 (
  [idSubTipoOcorrencia] ASC
 )

GO

-- ************************************** [OCOTB].[HistoricoSituacaoOcorrencia]
CREATE TABLE [OCOTB].[HistoricoSituacaoOcorrencia]
(
 [idHistoricoSituacaoOcorrencia] int NOT NULL ,
 [idOcorrencia]                  int NOT NULL ,
 [dtSituacaoOcorrencia]          datetime NOT NULL ,
 [idSituacaoOcorrencia]          tinyint NOT NULL ,


 CONSTRAINT [PK_HistoricoSituacaoOcorrencia] PRIMARY KEY CLUSTERED ([idHistoricoSituacaoOcorrencia] ASC),
 CONSTRAINT [FK_HistoricoSituacaoOcorrencia_Ocorrencia] FOREIGN KEY ([idOcorrencia])  REFERENCES [OCOTB].[Ocorrencia]([idOcorrencia]),
 CONSTRAINT [FK_HistoricoSituacaoOcorrencia_SituacaoOcorrencia] FOREIGN KEY ([idSituacaoOcorrencia])  REFERENCES [OCOTB].[SituacaoOcorrencia]([idSituacaoOcorrencia])
);
GO


CREATE NONCLUSTERED INDEX [IX_HistoricoSituacaoOcorrencia_Ocorrencia] ON [OCOTB].[HistoricoSituacaoOcorrencia] 
 (
  [idOcorrencia] ASC
 )

GO

CREATE NONCLUSTERED INDEX [IX_HistoricoSituacaoOcorrencia_SituacaoOcorrencia] ON [OCOTB].[HistoricoSituacaoOcorrencia] 
 (
  [idSituacaoOcorrencia] ASC
 )

GO

CREATE TABLE [OCOTB].[Usuario](
	[idUsuario]		int IDENTITY(1,1) NOT NULL,
	[nuRA]			varchar(10) NOT NULL,
	[coSenha]		varchar(50) NOT NULL,
	[deAcesso]		varchar(100) NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([idUsuario] ASC
);
GO

insert into OCOTB.Usuario 
    (nuRA, coSenha, deAcesso ) 
values 
     ('20318227', '123', 'usuario 20318227')
    ,('123456', '123', 'usuario 123456')
    ,('teste', 'teste', 'usuario teste')

INSERT INTO [OCOTB].[TipoOcorrencia]
           ([deTipoOcorrencia])
     VALUES
           ('Professor')
		   ,('Sala de Aula')
		   ,('Recursos Informática')
		   ,('Campus')
		   ,('Praça de Alimentação')
GO

select * from [OCOTB].[TipoOcorrencia]

INSERT INTO [OCOTB].[SubTipoOcorrencia]
           ([idTipoOcorrencia]
           ,[deSubTipoOcorrencia])
     VALUES
           (1,'Atraso')
		   ,(1,'Saída antecipada')
		   ,(1,'Falta injustificada')
		   ,(1,'Conteúdo não previsto no plano de ensino')
		   ,(1, 'Comportamento ')
GO




select * from sys.dm_server_registry
where registry_key like '%IPALL'
and value_name like 'TCP%PORT%'
and nullif(value_data, '') is not null