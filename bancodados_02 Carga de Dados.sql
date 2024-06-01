

	/*********************************** Cargas table SGI ***********************************/
		-- As cargas das tabelas que pertencem ao SGI e ja existem será feitas por algum mencanismo de integração ou até mesmo linked server
		-- Ou se este sistema for de fato implantado dentro do CEUB e rodar no banco que já existe. Ai não precisa fazer mais nada
		INSERT INTO  OCOTB.Pessoa (
			idPessoa,
			nmPessoa,
			nuCPF,
			urlFoto,
			nuTelefone,
			edMail)
		VALUES
			(1, 'Admin Admin de Admin',	'11111111111', 'https://upload.wikimedia.org/wikipedia/pt/a/af/The_Godfather%2C_The_Game.jpg', '6199999999', 'emailTeste@email.com'),
			(2, 'Isabelle',	'57336998097', 'https://avatars.githubusercontent.com/u/85378287?v=4', '6199999999', 'emailTeste@email.com'),
			(3, 'Sergio Cozzetti',	'67256131011', 'https://bit.ly/cozzetti', '6199999999', 'emailTeste@email.com'),
			(4, 'Antonio Augusto',	'00235385034', 'https://avatars.githubusercontent.com/u/11243840?v=4', '61992737257', 'contatoaugusto@gmail.com'),
			(5, 'Pessoa Aluno de Teste',	'68917126022', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(6, 'Outra Pessoa Aluno de Teste',	'59482146050', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(7, 'Débora Esther Helena Nunes',	'94180971763', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(8, 'Bryan Anderson Francisco Carvalho', '61469479389', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(9, 'Pessoa Coordenador Análise', '06675655310', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(10, 'Pessoa Coordenador Direito', '06675655311', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(11, 'Pessoa Coordenador Administração', '06675655312', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(12, 'Pessoa Coordenador Medicina', '06675655313', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com'),
			(13, 'Pessoa Que Cuida Predios', '06675655316', 'https://visualpharm.com/assets/527/Person-595b40b85ba036ed117da7ec.svg', '6199999999', 'emailTeste@email.com')
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
			(2, '20318227', 4, 1),
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
			(1, 'admin', '123', 'Administrador da porra Toda', 1),
			(2, '22206600', '123', 'usuario Isabelle', 2),
			(3, '84354', '123', 'usuario Sergio Cozezetti', 3),
			(4, '123', '123', 'usuario Antonio Augusto', 4),
			(5, '1234', '123', 'Usuario Funcionario Teste', 8),
			(6, '20318227', '123', 'Usuario Coordenador Curso', 5)
		GO

		INSERT INTO OCOTB.Perfil (
			idPerfil,
			nmPerfil,
			dePerfil)
		VALUES 
			(1, 'Perfil Administrador', 'Acesso a tudo'),
			(2, 'Perfil Ocorrência Administrador', 'Acesso a tudo'),
			(3, 'Perfil Ocorrência Desenvolvimento', 'Responsável por sistemas e melhorias'),
			(4, 'Perfil Ocorrência Suporte de TI', 'Suporte em geral'),
			(5, 'Perfil Ocorrência Engenharia', 'Resolve problemas de manutenção de espaços físicos'),
			(6, 'Perfil Ocorrência Cordenador', 'Grupo de cordenadores'),
			(7, 'Perfil Cuida Praça Alimentação', 'Grupo Alimentação')

		INSERT INTO OCOTB.PerfilUsuario (
			idPerfilUsuario,
			idPerfil,
			idUsuario)
		VALUES 
			(1, 1, 1),
			(2, 2, 5),
			(3, 6, 6)
		GO
		/*********************************** FIM Cargas table SGI ***********************************/
	

		INSERT INTO [OCOTB].[OcorrenciaTipo]
			([nmOcorrenciaTipo], icResponsavelCoordenadorCurso)
		VALUES
			 ('Professor', 1)
			,('Sala de Aula', 0)
			,('Recursos Informática', 0)
			,('Campus', 0)
			,('Praça de Alimentação', 0)
		GO

	
		INSERT INTO [OCOTB].[OcorrenciaSubTipo]
			([idOcorrenciaTipo]
			,[nmOcorrenciaSubTipo])
		VALUES
			(1,'Atraso')
			,(1,'Saída antecipada')
			,(1,'Falta injustificada')
			,(1,'Conteúdo não previsto no plano de ensino')
			,(1, 'Comportamento ')
			,(2, 'Infra estrutura da Sala')
		GO

		INSERT INTO OCOTB.OcorrenciaTipoResponsavel
			(idOcorrenciaTipo,
			 idPessoa,
			 idPerfil)
		VALUES
			 (2, null, 4)
			,(2, 12, null)
			,(5, null, 6)
		GO

		INSERT INTO OCOTB.OcorrenciaSituacao (deOcorrenciaSituacao)
		VALUES
			('Criada'),
			('Enviada para Responsável'),
			('Indeferido'),
			('Em Atendimento'),
			('Finalizada')
		GO

		INSERT INTO OCOTB.Local(
			nmBloco,
			nuSala,
			nmLocal)
		VALUES 
			('Bloco 10', '114', 'Laboratóiro de computação')
		GO

		INSERT INTO OCOTB.Ocorrencia(
			deOcorrencia,
			idLocal,
			idPessoa,
			idOcorrenciaSubTipo,
			idCurso)
		VALUES
			('Providenciar computador na sala 114', 1, 1, 6, 1)
		GO

		INSERT INTO OCOTB.OcorrenciaHistoricoSituacao (
			idOcorrencia,
			idOcorrenciaSituacao,
			icAtivo)
		VALUES
			(1, 1, 1)
		GO

	/************************************** MENU **************************************/
		DECLARE 
			@_idMenu 			INT,
			@_idMenu_Cadastros 	INT

		-- Ocorrencias
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Ocorrências', '/api/ocorrencia/listar', null, 1)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)
	
		-->> Cadastros
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Cadastros', '', null, 10)
	
		SET @_idMenu_Cadastros = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu_Cadastros, 1)

		-- Pessoa
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Pessoa', '', @_idMenu_Cadastros, 11)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/pessoa/listar/0', @_idMenu, 12),
			('Incluir', '/api/pessoa/incluirInit/0', @_idMenu, 13)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)

		
		-- Perfil
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Perfil', '', @_idMenu_Cadastros, 21)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/perfil/listar/0', @_idMenu, 22),
			('Incluir', '/api/perfil/incluirInit/0', @_idMenu, 23)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)
	
		-- Tipo Ocorrência
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Tipo Ocorrência', '', @_idMenu_Cadastros, 31)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/ocorrenciaTipo/listar/0', @_idMenu, 32),
			('Incluir', '/api/ocorrenciaTipo/incluirInit/0', @_idMenu, 33)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)

		-- Sub Tipo Ocorrência
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Sub Tipo Ocorrência', '', @_idMenu_Cadastros, 41)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/ocorrenciaSubTipo/listar/0', @_idMenu, 42),
			('Incluir', '/api/ocorrenciaSubTipo/incluirInit/0', @_idMenu, 43)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)

	
		-- Curso
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Curso', '', @_idMenu_Cadastros, 51)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/curso/listar/0', @_idMenu, 52),
			('Incluir', '/api/curso/incluirInit/0', @_idMenu, 53)
		
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)




	-- Administração do Sistema
		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Sistema', '', null, 1001)
	
		SET @_idMenu = SCOPE_IDENTITY()

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Menu', '', @_idMenu, 1001)

		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			(@_idMenu, 1)

		INSERT INTO OCOTB.Menu(
			nmMenu,
			urlRota,
			idMenuPai,
			nuOrdem)
		VALUES 
			('Lista', '/api/menu/listar/0', @_idMenu, 1002),
			('Incluir', '/api/menu/incluirInit/0', @_idMenu, 1003)
		
		SET @_idMenu = SCOPE_IDENTITY() 

		INSERT INTO OCOTB.MenuPerfil(
			idMenu,
			idPerfil)
		VALUES 
			((@_idMenu -1) , 1),
			(@_idMenu, 1)
	
