
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
        FROM 
            OCOTB.Ocorrencia OCO
            INNER JOIN OCOTB.Pessoa P ON P.idPessoa = OCO.idPessoa
            INNER JOIN OCOTB.OcorrenciaHistoricoSituacao CHS ON CHS.idOcorrencia = OCO.idOcorrencia AND CHS.icAtivo = 1
            INNER JOIN OCOTB.OcorrenciaSituacao OS ON OS.idOcorrenciaSituacao = CHS.idOcorrenciaSituacao
        WHERE 
            P.idPessoa = @idPessoa
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
			@_idPessoaResponsavel			INT,
			@_nuPosicao						INT,
			@_SEPARADOR_RESPONSAVEIS		VARCHAR(1) = '#'
	
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
		
		SET @_idOcorrenciaHistoricoSituacao = SCOPE_IDENTITY()


		WHILE CHARINDEX(@_SEPARADOR_RESPONSAVEIS, @idPessoaResponsavelArray)  > 0
		BEGIN
			SET @_nuPosicao  = CHARINDEX(@_SEPARADOR_RESPONSAVEIS, @idPessoaResponsavelArray)  
			SET @_idPessoaResponsavel = SUBSTRING(@idPessoaResponsavelArray, 1, @_nuPosicao -1)

select @_nuPosicao as _nuPosicao, @_idPessoaResponsavel as _idPessoaResponsavel, @idPessoaResponsavelArray as idOcorrenciaTipoResponsavelArray

			IF (ISNULL(@_idPessoaResponsavel, 0) > 0)
			BEGIN
				INSERT INTO OCOTB.OcorrenciaHistoricoResponsavel (
					idOcorrenciaHistoricoSituacao,
					idPessoa)
				SELECT
					@_idOcorrenciaHistoricoSituacao,
					@_idPessoaResponsavel

			END
			
			SET @idPessoaResponsavelArray = SUBSTRING(@idPessoaResponsavelArray, @_nuPosicao + 1, LEN(@idPessoaResponsavelArray) - @_nuPosicao)
		END
		
	END
GO