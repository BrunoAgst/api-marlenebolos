const LoginModel = require('../model/LoginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

class LoginController{

    async resetSenha(req, res){
        var email = req.body.email;
        
        var emailV = await LoginModel.verificaCampo(email);
        
        if(emailV === undefined){
            res.status(400);
            res.json({"erro": "Email digitado é inválido"});
            return
        }

        var response = await LoginModel.buscarUsuario(emailV);

        if(response === undefined){
            res.status(404);
            res.json({"erro": "Usuario não encontrado"});
            return
        }

        var token = await LoginModel.gerarToken();

        if(token === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível gerar o token"});
            return
        }

        var registraToken = await LoginModel.registraToken(token); 

        if(registraToken === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível gerar o token"});
            return
        }

        var response = await LoginModel.enviaEmail(token, emailV);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível enviar o e-mail de troca de senha"});
            return
        }

        res.status(200);
        res.json({"sucesso": "Enviamos um e-mail para você cadastrar uma nova senha"});
    }

    async novaSenha(req, res){
        var senha = req.body.senha;
        var confirmarSenha = req.body.confirmarSenha;
        var email = req.body.email;
        var token = req.body.token;

        var senhaV = await LoginModel.verificaCampo(senha);
        var confirmarSenhaV = await LoginModel.verificaCampo(confirmarSenha);
        var emailV = await LoginModel.verificaCampo(email);
        var tokenV = await LoginModel.verificaCampo(token);

        if(senhaV === undefined){
            res.status(400);
            res.json({"erro": "Campo senha inválido"});
            return
        }

        if(tokenV === undefined){
            res.status(400);
            res.json({"erro": "Campo token inválido"});
            return
        }

        if(confirmarSenhaV === undefined){
            res.status(400);
            res.json({"erro": "Campo confirma senha inválido"});
            return
        }

        if(emailV === undefined){
            res.status(400);
            res.json({"erro": "Email inválido"});
            return
        }

        var usuario = await LoginModel.buscarUsuario(emailV);

        if(usuario === undefined){
            res.status(404);
            res.json({"erro": "Usuário não cadastrado"});
            return
        }

        if(senhaV !== confirmarSenhaV){
            res.status(400);
            res.json({"erro": "A duas senhas precisa ser iguais"});
            return
        }
        const tokenR = await LoginModel.validaToken(tokenV);
        console.log(tokenR);
        if(tokenR === undefined){
            res.status(400);
            res.json({"erro": "Token inválido"});
            return
        }

        const hash = bcrypt.hashSync(senhaV, bcrypt.genSaltSync(10));

        const response = await LoginModel.alteraSenha(usuario[0].id, hash);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível alterar a senha"});
            return
        }
        
        res.status(200);
        res.json({"sucesso": "Senha alterada com sucesso"}); 
    }   


    async validaToken(req, res){
        res.status(200);
        res.json({"sucesso": "token válido"});
    }

    async login(req, res){
        var email = req.body.email;
        var senha = req.body.senha;

        var senhaV = await LoginModel.verificaCampo(senha);
        var emailV = await LoginModel.verificaCampo(email);

        if(senhaV === undefined){
            res.status(400);
            res.json({"erro": "Campo confirma senha inválido"});
            return
        }

        if(emailV === undefined){
            res.status(400);
            res.json({"erro": "Campo senha inválido"});
            return
        }

        var usuario = await LoginModel.buscarUsuario(emailV);

        if(usuario === undefined){
            res.status(404);
            res.json({"erro": "Usuário não encontrado"});
            return
        }

        var senhaC = await bcrypt.compareSync(senha, usuario[0].senha);

        if(senhaC === false){
            res.status(400);
            res.json({"erro": "Senha inválida"});
            return
        }

        const token = await jwt.sign({email: email}, jwtSecret, {expiresIn: 60 * 30});

        var registro = await LoginModel.registraAcesso(usuario[0].id);

        if(registro === undefined){
            res.status(500);
            res.json({"erro": "Não foi possivel acessar sistema"});
            return
        }

        let response = {
            'id': usuario[0].id,
            'ultimo_login': Date.now(),
            'token': token
        }

        res.status(200);
        res.json({"sucesso": response});

    }

    async cadastrarUsuario(req, res){
        var email = req.body.email;
        var senha = req.body.senha;

        var emailV = await LoginModel.verificaCampo(email);
        var senhaV = await LoginModel.verificaCampo(senha);

        if(emailV === undefined){
            res.status(400);
            res.json({"erro": "Email informado é inválido"});
            return
        }

        if(senhaV === undefined){
            res.status(400);
            res.json({"erro": "Senha informada é inválida"});
            return
        }

        var emailB = await LoginModel.verificaUsuario(emailV);
        
        if(emailB === undefined){
            res.status(401);
            res.json({"erro": "Email já cadastrado"});
            return
        }

        const hash = bcrypt.hashSync(senhaV, bcrypt.genSaltSync(10));

        const novoUsuario = {
            email: emailV,
            senha: hash,
            data_criacao: new Date().getTime()
        }

        var response = await LoginModel.criarUsuario(novoUsuario);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "Usuário não foi cadastrado"});
            return
        }

        res.status(200);
        res.json({"sucesso": "Usuário Cadastrado com sucesso"});

    }
}

module.exports = new LoginController();