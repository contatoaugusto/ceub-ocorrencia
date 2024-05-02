
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
		@coAcesso	varchar(10) = null,
		@coSenha	varchar(50) = null,
		@nuCPF    	char(11)	= null
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
				1 = (CASE WHEN @coAcesso IS NULL OR coAcesso	= @coAcesso THEN 1 ELSE 0 END)
			AND 1 = (CASE WHEN @coSenha IS NULL OR coSenha	= @coSenha THEN 1 ELSE 0 END)
			AND 1 = (CASE WHEN @nuCPF IS NULL OR nuCPF	= @nuCPF THEN 1 ELSE 0 END)
	END
GO

-->>>>>>> Pessoa
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
            P.nuCPF,
            P.urlFoto,
			P.nuTelefone
        FROM 
			OCOTB.Pessoa P
        WHERE 
            1 = (CASE WHEN ISNULL(@idPessoa, 0) = 0  OR P.idPessoa = @idPessoa THEN 1 ELSE 0 END)
	END
GO

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