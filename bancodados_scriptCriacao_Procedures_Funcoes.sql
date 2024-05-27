
USE OCODB
GO

/****************************** Funções  *****************************/

	--------->>> FC_getResponsavelOcorrencia
	
	drop function if exists OCOTB.FC_getResponsavelOcorrencia
GO

	-- =============================================
	-- Author:		Antonio Augusto
	-- Create date: 25-04-2024
	-- Description:	Cunção que dado o parâmetro idOcorrencia, retornas os responsáveis por essa ocorrêcia
	-- =============================================
	CREATE FUNCTION OCOTB.FC_getResponsavelOcorrencia
	(	
		@idOcorrrencia INT
	)
	RETURNS TABLE 
	AS
	RETURN 
	(
		SELECT
			OST.idOcorrenciaSubTipo,
			P.idPessoa,
			PE.idPerfil,
			P.nmPessoa,
			PE.nmPerfil,
			pessoaResponsavelCoordenador.idPessoa idPessoaCoordenador,
			pessoaResponsavelCoordenador.nmPessoa nmPessoaCoordenador
		FROM
			OCOTB.Ocorrencia OCO
			INNER JOIN OCOTB.OcorrenciaSubTipo OST  ON OST.idOcorrenciaSubTipo = OCO.idOcorrenciaSubTipo

			INNER JOIN OCOTB.OcorrenciaTipo	OT ON OT.idOcorrenciaTipo = OST.idOcorrenciaTipo
			LEFT JOIN OCOTB.OcorrenciaTipoResponsavel	OTR ON OTR.idOcorrenciaTipo = OT.idOcorrenciaTipo
			LEFT JOIN OCOTB.Pessoa P ON P.idPessoa = OTR.idPessoa
			LEFT JOIN OCOTB.Perfil PE ON PE.idPerfil = OTR.idPerfil

			LEFT JOIN (
				SELECT	
					C.idCurso,
					P.idPessoa,
					P.nmPessoa
				FROM
					OCOTB.Curso C
					INNER JOIN OCOTB.Pessoa P ON P.idPessoa = C.idCoordenador
			) AS pessoaResponsavelCoordenador ON OT.icResponsavelCoordenadorCurso = 1 AND pessoaResponsavelCoordenador.idCurso = OCO.idCurso
		WHERE
			OCO.idOcorrencia = @idOcorrrencia
	)
GO

	--------->>> FC_getPerfilByPessoa
	drop function if exists OCOTB.FC_getPerfilByPessoa
GO

	-- =============================================
	-- Author:		Antonio Augusto
	-- Create date: 25-04-2024
	-- Description:	Dado uma pessoa traz os perfis em que ela está contida
	-- =============================================
	CREATE FUNCTION OCOTB.FC_getPerfilByPessoa
	(	
		@idPessoa INT
	)
	RETURNS TABLE 
	AS
	RETURN 
	(
		SELECT
			PE.idPerfil,
			P.idPessoa,
			P.nmPessoa,
			PE.nmPerfil
		FROM
			OCOTB.Pessoa					P
			INNER JOIN OCOTB.Usuario		U	ON U.idPessoa = P.idPessoa
			INNER JOIN OCOTB.PerfilUsuario	PU	ON PU.idUsuario = U.idUsuario
			INNER JOIN OCOTB.Perfil			PE	ON PE.idPerfil = PU.idPerfil
		WHERE
			P.idPessoa = @idPessoa
	)
GO


/************************************************************ Stores Procedures  ***********************************************************/

	drop procedure if exists OCOTB.SP_getLoginAcessoSenha
GO 

	CREATE PROCEDURE OCOTB.SP_getLoginAcessoSenha (
		@coAcesso	varchar(10),
		@coSenha	varchar(50)
	)
	AS
	BEGIN
		SELECT 
			U.coAcesso,
			U.deAcesso,
			P.idPessoa,
			P.nmPessoa,
			P.urlFoto,
			P.nuTelefone,
			A.idAluno,
			A.idCurso,
			A.nuRA
		FROM 
			OCOTB.Usuario U
			INNER JOIN OCOTB.Pessoa P ON P.idPessoa = U.idPessoa 
			LEFT JOIN OCOTB.Aluno A ON A.idPessoa = P.idPessoa 
		WHERE 
				coAcesso	= @coAcesso
			AND coSenha		= @coSenha
	END
GO

	drop procedure if exists OCOTB.SP_getLoginRecuperaUsuarioSenha
GO 

	CREATE PROCEDURE OCOTB.SP_getLoginRecuperaUsuarioSenha (
		@coAcesso	varchar(10) = null,
		@nuCPF    	char(11)	= null
	)
	AS
	BEGIN
		SELECT 
			U.coAcesso,
			U.coSenha,
			U.deAcesso,
			P.idPessoa,
			P.nmPessoa,
			P.urlFoto,
			P.nuTelefone,
			A.idAluno,
			A.idCurso,
			A.nuRA
		FROM 
			OCOTB.Usuario U
			INNER JOIN OCOTB.Pessoa P ON P.idPessoa = U.idPessoa 
			LEFT JOIN OCOTB.Aluno A ON A.idPessoa = P.idPessoa 
		WHERE 
				1 = (CASE WHEN @coAcesso = '' OR @coAcesso IS NULL OR coAcesso	= @coAcesso THEN 1 ELSE 0 END)
			AND 1 = (CASE WHEN @nuCPF = '' OR @nuCPF IS NULL OR nuCPF	= @nuCPF THEN 1 ELSE 0 END)
	END
GO

-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Pessoa <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  
drop procedure if exists OCOTB.SP_setPessoa
GO
	CREATE PROCEDURE OCOTB.SP_setPessoa (
		@idPessoa	INT = NULL,
		@nmPessoa	VARCHAR(100),
        @nuCPF		CHAR(11),
        @urlFoto	VARCHAR(100),
		@nuTelefone VARCHAR(12)
	)
	AS
	BEGIN

		IF ISNULL(@idPessoa, 0) = 0 OR @idPessoa = '0' OR @idPessoa = ''
		BEGIN
			INSERT INTO OCOTB.Pessoa (
				idPessoa,
				nmPessoa,
				nuCPF,
				urlFoto,
				nuTelefone
			)
			SELECT 
				(select max(idPessoa) + 1 from OCOTB.Pessoa),
				@nmPessoa,
				@nuCPF,
				@urlFoto,
				@nuTelefone
			
			SET @idPessoa = (select max(idPessoa) from OCOTB.Pessoa)
		END
		ELSE
		BEGIN
			UPDATE OCOTB.Pessoa SET
				nmPessoa	= @nmPessoa,
				nuCPF		= @nuCPF,
				urlFoto		= @urlFoto,
				nuTelefone  = @nuTelefone
			WHERE 
				idPEssoa = @idPessoa
		END

		SELECT @idPessoa AS idPessoa
	END
GO


	drop procedure if exists OCOTB.SP_getPessoa
GO
	CREATE PROCEDURE OCOTB.SP_getPessoa (
		@idPessoa	INT = NULL
	)
	AS
	BEGIN
		SELECT 
            P.idPessoa,
            P.nmPessoa,
			P.idPessoa AS id,  	-- Para adequar a construção de elemntos na tela dinamicamente
            P.nmPessoa AS texto,-- Para adequar a construção de elemntos na tela dinamicamente 
            P.nuCPF,
            P.urlFoto,
			P.nuTelefone,

			-- Usuario
			U.idUsuario,
			U.coAcesso,
			U.coSenha,
			U.deAcesso
        FROM 
			OCOTB.Pessoa 			P
			LEFT JOIN OCOTB.Usuario U ON U.idPessoa = P.idPessoa
        WHERE 
            1 = (CASE WHEN ISNULL(@idPessoa, 0) = 0  OR P.idPessoa = @idPessoa THEN 1 ELSE 0 END)
	END
GO


-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Usuário <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setUsuario
GO
	CREATE PROCEDURE OCOTB.SP_setUsuario (
		@idUsuario	INT = NULL,
		@coAcesso	VARCHAR(10),
        @coSenha	VARCHAR(50),
        @deAcesso	VARCHAR(100),
		@idPessoa	INT
	)
	AS
	BEGIN

		IF ISNULL(@idUsuario, 0) = 0
		BEGIN
			INSERT INTO OCOTB.Usuario (
				idUsuario,
				coAcesso,
				coSenha,
				deAcesso,
				idPessoa
			)
			SELECT 
				(select max(idUsuario) + 1 from OCOTB.Usuario),
				@coAcesso,
				@coSenha,
				@deAcesso,
				@idPessoa
		END
		ELSE
		BEGIN
			UPDATE OCOTB.Usuario SET
				coAcesso	= @coAcesso,
				coSenha		= @coSenha,
				deAcesso	= @deAcesso,
				idPessoa	= @idPessoa
			WHERE 
				idUsuario = @idUsuario
		END

	END
GO


	drop procedure if exists OCOTB.SP_getUsuario
GO
	CREATE PROCEDURE OCOTB.SP_getUsuario (
		@idUsuario	INT = NULL
	)
	AS
	BEGIN
		SELECT 
            U.idUsuario,
			U.coAcesso,
			U.coSenha,
			U.deAcesso,
			U.idPessoa
        FROM 
			OCOTB.Usuario U
			INNER JOIN OCOTB.Pessoa P ON P.idPessoa = U.idPessoa
        WHERE 
            1 = (CASE WHEN ISNULL(@idUsuario, 0) = 0  OR U.idUsuario = @idUsuario THEN 1 ELSE 0 END)
	END
GO


-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Perfil <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setPerfil
GO
	CREATE PROCEDURE OCOTB.SP_setPerfil (
		@idPerfil	INT = NULL,
        @nmPerfil	VARCHAR(100),
		@dePerfil	VARCHAR(300)
	)
	AS
	BEGIN

		IF ISNULL(@idPerfil, 0) = 0 OR @idPerfil = '0' OR @idPerfil = ''
		BEGIN
			INSERT INTO OCOTB.Perfil (
				idPerfil,
				nmPerfil,
				dePerfil
			)
			SELECT 
				(select max(idPerfil) + 1 from OCOTB.Perfil),
				@nmPerfil,
				@dePerfil
		END
		ELSE
		BEGIN
			UPDATE OCOTB.Perfil SET
				nmPerfil	= @nmPerfil,
				dePerfil	= @dePerfil
			WHERE 
				idPerfil = @idPerfil
		END

	END
GO


	drop procedure if exists OCOTB.SP_getPerfil
GO
	CREATE PROCEDURE OCOTB.SP_getPerfil (
		@idPerfil	INT = NULL
	)
	AS
	BEGIN
		SELECT 
            idPerfil,
			nmPerfil,
			dePerfil
        FROM 
			OCOTB.Perfil
        WHERE 
            1 = (CASE WHEN ISNULL(@idPerfil, 0) = 0  OR idPerfil = @idPerfil THEN 1 ELSE 0 END)
	END
GO


-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Curso <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setCurso
GO
	CREATE PROCEDURE OCOTB.SP_setCurso (
		@idCurso	INT = NULL,
        @nmCurso	VARCHAR(100),
		@idCoordenador	INT
	)
	AS
	BEGIN

		IF ISNULL(@idCurso, 0) = 0 OR @idCurso = '0' OR @idCurso = ''
		BEGIN
			INSERT INTO OCOTB.Curso (
				idCurso,
				nmCurso,
				idCoordenador
			)
			SELECT 
				(select max(idCurso) + 1 from OCOTB.Curso),
				@nmCurso,
				@idCoordenador
		END
		ELSE
		BEGIN
			UPDATE OCOTB.Curso SET
				nmCurso	= @nmCurso,
				idCoordenador	= @idCoordenador
			WHERE 
				idCurso = @idCurso
		END

	END
GO


	drop procedure if exists OCOTB.SP_getCurso
GO
	CREATE PROCEDURE OCOTB.SP_getCurso (
		@idCurso	INT = NULL
	)
	AS
	BEGIN
		SELECT 
			C.idCurso,
			C.nmCurso,
			C.idCurso AS id,
			C.nmCurso AS texto,
			C.idCoordenador,
			P.nmPessoa,
			P.urlFOto
		FROM 
			OCOTB.Curso C
			INNER JOIN OCOTB.Pessoa P ON P.idPessoa = C.idCoordenador
        WHERE 
            1 = (CASE WHEN ISNULL(@idCurso, 0) = 0  OR idCurso = @idCurso THEN 1 ELSE 0 END)
	END
GO

-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Tipo Ocorrencia <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setOcorrenciaTipo
GO
	CREATE PROCEDURE OCOTB.SP_setOcorrenciaTipo (
		@idOcorrenciaTipo	INT = NULL,
        @nmOcorrenciaTipo	VARCHAR(50),
		@icResponsavelCoordenadorCurso	BIT -- Indica que o responsável por esse tipo de ocorrência e o coordenador do curso
	)
	AS
	BEGIN

		IF ISNULL(@idOcorrenciaTipo, 0) = 0 OR @idOcorrenciaTipo = '0' OR @idOcorrenciaTipo = ''
		BEGIN
			INSERT INTO OCOTB.OcorrenciaTipo (
				nmOcorrenciaTipo,
				icResponsavelCoordenadorCurso
			)
			SELECT 
				@nmOcorrenciaTipo,
				@icResponsavelCoordenadorCurso
			
			SET @idOcorrenciaTipo = SCOPE_IDENTITY()
		END
		ELSE
		BEGIN
			UPDATE OCOTB.OcorrenciaTipo SET
				nmOcorrenciaTipo	= @nmOcorrenciaTipo,
				icResponsavelCoordenadorCurso	= @icResponsavelCoordenadorCurso
			WHERE 
				idOcorrenciaTipo = @idOcorrenciaTipo
		END

		SELECT @idOcorrenciaTipo AS idOcorrenciaTipo
	END
GO


	drop procedure if exists OCOTB.SP_getOcorrenciaTipo
GO
	CREATE PROCEDURE OCOTB.SP_getOcorrenciaTipo (
		@idOcorrenciaTipo	INT = NULL
	)
	AS
	BEGIN
		SELECT 
            idOcorrenciaTipo,
			nmOcorrenciaTipo,
			idOcorrenciaTipo AS id,		-- Para adequar a construção de elemntos na tela dinamicamente
			nmOcorrenciaTipo AS texto,  -- Para adequar a construção de elemntos na tela dinamicamente 
			icResponsavelCoordenadorCurso
        FROM 
			OCOTB.OcorrenciaTipo
        WHERE 
            1 = (CASE WHEN ISNULL(@idOcorrenciaTipo, 0) = 0  OR idOcorrenciaTipo = @idOcorrenciaTipo THEN 1 ELSE 0 END)
		ORDER BY nmOcorrenciaTipo
	END
GO


-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Ocorrência Tipo Responsavel <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setOcorrenciaTipoResponsavel
GO
	CREATE PROCEDURE OCOTB.SP_setOcorrenciaTipoResponsavel (
		@idOcorrenciaTipoResponsavel	INT = NULL,
        @idOcorrenciaTipo	INT,
		@idPessoa			INT,
		@idPerfil			INT
	)
	AS
	BEGIN

		IF ISNULL(@idOcorrenciaTipoResponsavel, 0) = 0 OR @idOcorrenciaTipoResponsavel = '0' OR @idOcorrenciaTipoResponsavel = ''
		BEGIN
			IF ISNULL(@idPessoa, 0) = 0 OR @idPessoa = '0' OR @idPessoa = ''
				SET @idPessoa = NULL
			IF ISNULL(@idPerfil, 0) = 0 OR @idPerfil = '0' OR @idPerfil = ''
				SET @idPerfil = NULL

			INSERT INTO OCOTB.OcorrenciaTipoResponsavel (
				idOcorrenciaTipo,
				idPessoa,
				idPerfil
			)
			SELECT 
				@idOcorrenciaTipo,
				@idPessoa,
				@idPerfil
			
			SET @idOcorrenciaTipoResponsavel = SCOPE_IDENTITY()
		END
		ELSE
		BEGIN
			UPDATE OCOTB.OcorrenciaTipoResponsavel SET
				idOcorrenciaTipo	= @idOcorrenciaTipo,
				idPessoa	= @idPessoa,
				idPerfil	= @idPerfil
			WHERE 
				idOcorrenciaTipoResponsavel = @idOcorrenciaTipoResponsavel
		END

		SELECT @idOcorrenciaTipoResponsavel AS idOcorrenciaTipoResponsavel
	END
GO




-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Sub Tipo Ocorrencia <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_setOcorrenciaSubTipo
GO
	CREATE PROCEDURE OCOTB.SP_setOcorrenciaSubTipo (
		@idOcorrenciaSubTipo	INT = NULL,
        @idOcorrenciaTipo		INT,
		@nmOcorrenciaSubTipo	VARCHAR(50)
	)
	AS
	BEGIN

		IF ISNULL(@idOcorrenciaSubTipo, 0) = 0 OR @idOcorrenciaSubTipo = '0' OR @idOcorrenciaSubTipo = ''
		BEGIN
			INSERT INTO OCOTB.OcorrenciaSubTipo (
				idOcorrenciaTipo,
				nmOcorrenciaSubTipo
			)
			SELECT 
				@idOcorrenciaTipo,
				@nmOcorrenciaSubTipo
		END
		ELSE
		BEGIN
			UPDATE OCOTB.OcorrenciaSubTipo SET
				idOcorrenciaTipo	= @idOcorrenciaTipo,
				nmOcorrenciaSubTipo	= @nmOcorrenciaSubTipo
			WHERE 
				idOcorrenciaSubTipo = @idOcorrenciaSubTipo
		END

	END
GO


	drop procedure if exists OCOTB.SP_getOcorrenciaSubTipo
GO
	CREATE PROCEDURE OCOTB.SP_getOcorrenciaSubTipo (
		@idOcorrenciaSubTipo	INT = NULL
	)
	AS
	BEGIN
		SELECT 
            OST.idOcorrenciaSubTipo,
			OST.nmOcorrenciaSubTipo,
			OST.idOcorrenciaSubTipo AS id,		-- Para adequar a construção de elemntos na tela dinamicamente
			OST.nmOcorrenciaSubTipo AS texto,  -- Para adequar a construção de elemntos na tela dinamicamente 
			OST.idOcorrenciaTipo,
			OT.nmOcorrenciaTipo
        FROM 
			OCOTB.OcorrenciaSubTipo OST
			LEFT JOIN OCOTB.OcorrenciaTipo OT ON OT.idOcorrenciaTipo = OST.idOcorrenciaTipo
        WHERE 
            1 = (CASE WHEN ISNULL(@idOcorrenciaSubTipo, 0) = 0  OR idOcorrenciaSubTipo = @idOcorrenciaSubTipo THEN 1 ELSE 0 END)
		ORDER BY nmOcorrenciaSubTipo
	END
GO

	drop procedure if exists OCOTB.SP_getOcorrenciaSubTipoByTipoOcorrencia
GO
	CREATE PROCEDURE OCOTB.SP_getOcorrenciaSubTipoByTipoOcorrencia (
		@idOcorrenciaTipo	INT
	)
	AS
	BEGIN
		SELECT 
            OST.idOcorrenciaSubTipo,
			OST.nmOcorrenciaSubTipo,
			OST.idOcorrenciaSubTipo AS id,		-- Para adequar a construção de elemntos na tela dinamicamente
			OST.nmOcorrenciaSubTipo AS texto,  -- Para adequar a construção de elemntos na tela dinamicamente 
			OST.idOcorrenciaTipo,
			OT.nmOcorrenciaTipo
        FROM 
			OCOTB.OcorrenciaSubTipo OST
			LEFT JOIN OCOTB.OcorrenciaTipo OT ON OT.idOcorrenciaTipo = OST.idOcorrenciaTipo
        WHERE 
            OST.idOcorrenciaTipo = @idOcorrenciaTipo
		ORDER BY nmOcorrenciaSubTipo
	END
GO

-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Ocorrências <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	drop procedure if exists OCOTB.SP_getOcorrenciaByPessoa
GO 

	CREATE PROCEDURE OCOTB.SP_getOcorrenciaByPessoa (
		@idPessoa	INT
	)
	AS
	BEGIN
		SELECT 
             OCO.idOcorrencia
            ,OCO.deOcorrencia
            ,OCO.dtOcorrencia
            ,OCO.idLocal	
            ,OCO.idPessoa
            ,OCO.idOcorrenciaSubTipo
            ,OCO.idCurso
            ,OS.deOcorrenciaSituacao
			,Responsavel.idPessoa AS idPessoaResponsavel
			,Responsavel.nmPessoa AS nmPessoaResponsavel

			,Responsavel.idPerfil AS idPerfilResponsavel
			,Responsavel.nmPerfil AS nmPerfilResponsavel

			,Responsavel.idPessoaCoordenador AS idPessoaResponsavelCoordenador
			,Responsavel.nmPessoaCoordenador AS nmPessoaResponsavelCoordenador
        FROM 
            OCOTB.Ocorrencia OCO
            INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OCO.idPessoa
            INNER JOIN OCOTB.OcorrenciaHistoricoSituacao CHS ON CHS.idOcorrencia = OCO.idOcorrencia AND CHS.icAtivo = 1
            INNER JOIN OCOTB.OcorrenciaSituacao OS ON OS.idOcorrenciaSituacao = CHS.idOcorrenciaSituacao

			CROSS APPLY OCOTB.FC_getResponsavelOcorrencia (OCO.idOcorrencia) AS Responsavel
        WHERE 
            P.idPessoa = @idPessoa
		ORDER BY OCO.idOcorrencia
	END
GO

-- Recupera as ocorrências sob a responsabilidade da pessoa logada
	drop procedure if exists OCOTB.SP_getOcorrenciaByPessoaResponsavel
GO 

	CREATE PROCEDURE OCOTB.SP_getOcorrenciaByPessoaResponsavel (
		@idPessoa	INT
	)
	AS
	BEGIN
		SELECT 
             OCO.idOcorrencia
            ,OCO.deOcorrencia
            ,OCO.dtOcorrencia
            ,OCO.idLocal	
            ,OCO.idPessoa
			,P.nmPessoa
            ,OCO.idOcorrenciaSubTipo
            ,OCO.idCurso
            ,OS.deOcorrenciaSituacao
			,Responsavel.idPessoa AS idPessoaResponsavel
			,Responsavel.idPerfil AS idPerfilResponsavel
			,Responsavel.nmPessoa AS nmPessoaResponsavel
			,Responsavel.nmPerfil AS nmPerfilResponsavel

			,PessoaOcorrenciaSobSuaResponsabilidade.idPessoa idPessoaResponsavelLogada
			,PessoaOcorrenciaSobSuaResponsabilidade.nmPessoa nmPessoaResponsavelLogada
        FROM 
            OCOTB.Ocorrencia OCO
            INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OCO.idPessoa
            INNER JOIN OCOTB.OcorrenciaHistoricoSituacao CHS ON CHS.idOcorrencia = OCO.idOcorrencia AND CHS.icAtivo = 1
            INNER JOIN OCOTB.OcorrenciaSituacao OS ON OS.idOcorrenciaSituacao = CHS.idOcorrenciaSituacao

			-- TOdos os responsáveis dessa
			CROSS APPLY OCOTB.FC_getResponsavelOcorrencia (OCO.idOcorrencia) AS Responsavel

			CROSS APPLY OCOTB.FC_getPerfilByPessoa(@idPessoa) PessoaOcorrenciaSobSuaResponsabilidade
		
		ORDER BY OCO.idOcorrencia
	END
GO
	
	
	/************************** Insere Ocorrencia **************************/
	drop procedure if exists OCOTB.SP_setOcorrencia
	GO 
/*
BEGIN TRANSACTION
	exec OCOTB.SP_setOcorrencia @deOcorrencia=N'Quero providencias para essa demanda',@idLocal=NULL,@idPessoa=2,@idOcorrenciaSubTipo=N'0',@idCurso=N'2',@idPessoaResponsavelArray=N'9##6#'
ROLLBACK


select * from  OCOTB.Ocorrencia
*/
	CREATE PROCEDURE OCOTB.SP_setOcorrencia (
		@deOcorrencia				text,
		@idLocal					int		= NULL ,
		@idPessoa					int,
		@idOcorrenciaSubTipo		int,
		@idCurso					int	= NULL,
		@idPessoaResponsavelArray	varchar(50)
	)
	AS
	BEGIN
		
		DECLARE
			@_idOcorrencia					INT,
			@_idOcorrenciaHistoricoSituacao	INT,
			@_nuPosicao						INT,
			@_SEPARADOR_RESPONSAVEIS		VARCHAR(1) = '#',
			@_nmEntidade					VARCHAR(20),
			@_nmEntidadeID_Temp				VARCHAR(20),
			@_ENTIDADE_PESSOA				VARCHAR(20) = 'pessoa',
			@_ENTIDADE_PERFIL				VARCHAR(20) = 'perfil',
			@_idPessoa						INT,
			@_idPerfil						INT

	
		SET @idPessoaResponsavelArray = REPLACE(@idPessoaResponsavelArray, @_SEPARADOR_RESPONSAVEIS + @_SEPARADOR_RESPONSAVEIS, @_SEPARADOR_RESPONSAVEIS)

		INSERT INTO OCOTB.Ocorrencia(
			deOcorrencia,
			idLocal,
			idPessoa,
			idOcorrenciaSubTipo,
			idCurso)
		SELECT
			@deOcorrencia,
			@idLocal,   
			@idPessoa, -- A pessoa que abriu a ocorrêcia
			@idOcorrenciaSubTipo,
			@idCurso
		
		SET @_idOcorrencia = SCOPE_IDENTITY()

		-- Salvar o OcorrenciaHistoricoSituacao
		INSERT INTO OCOTB.OcorrenciaHistoricoSituacao (
			idOcorrencia,
			idOcorrenciaSituacao,
			icAtivo)
		SELECT
			@_idOcorrencia,
			1,
			1
		
		
		WHILE CHARINDEX(@_SEPARADOR_RESPONSAVEIS, @idPessoaResponsavelArray)  > 0
		BEGIN
			
			SET @_nuPosicao  = CHARINDEX(@_SEPARADOR_RESPONSAVEIS, @idPessoaResponsavelArray)  
			SET @_nmEntidadeID_Temp		=	SUBSTRING(@idPessoaResponsavelArray, 1, @_nuPosicao -1)
		
			SET @_idPessoa = NULL
			SET @_idPerfil = NULL

			IF (CHARINDEX(@_ENTIDADE_PESSOA, @_nmEntidadeID_Temp) > 0)
				SET @_idPessoa = REPLACE(@_nmEntidadeID_Temp, @_ENTIDADE_PESSOA, '')

			IF (CHARINDEX(@_ENTIDADE_PERFIL, @_nmEntidadeID_Temp) > 0)
				SET @_idPerfil = REPLACE(@_nmEntidadeID_Temp, @_ENTIDADE_PERFIL, '')

			IF (ISNULL(@_idPessoa, 0) > 0 OR ISNULL(@_idPerfil, 0) > 0)
			BEGIN
				INSERT INTO OCOTB.OcorrenciaResponsavel (
					idOcorrencia,
					idPessoa,
					idPerfil)
				SELECT
					@_idOcorrencia,
					@_idPessoa,
					@_idPerfil

			END
			
			SET @idPessoaResponsavelArray = SUBSTRING(@idPessoaResponsavelArray, @_nuPosicao + 1, LEN(@idPessoaResponsavelArray) - @_nuPosicao)
		END
		
	END
GO