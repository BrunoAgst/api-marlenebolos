const database = require('../database/connection');
const nodemailerConfig = require('../config/nodemailer');

class LoginModel{

    async verificaCampo(valor){
        
        try {
            if(valor === null || valor === '' || valor === ' ' || valor === undefined){
                return undefined;
            }
            return valor;
    
        } catch (error) {
            console.log(error);
            return undefined;
        }
        
    }

    async criarUsuario(usuario){
        try {
            await database.insert(usuario).into("acesso");
            return "ok";

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async buscarUsuario(email){
        try {
            var response = await database.where({email: email}).table("acesso");
            
            if(response.length === 0){
                return undefined;
            }

            return response;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async registraAcesso(id){
        try {

            var data = await Date.now();

            await database.insert({
                ultimo_login: data,
                client_id: id

            }).into("registra_acesso");

            return 'ok';
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async verificaUsuario(email){
        try {
            var response = await database.where({email: email}).table("acesso");

            if(response.length >= 1){
                return undefined;
            }
            return "ok";

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async alteraSenha(id, senha){
        try {
            await database.where({id: id}).update({senha: senha}).table("acesso");

            return "ok";

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }


    async enviaEmail(token, email){
        try {
            await nodemailerConfig.sendMail({
                from: "Suporte Marlene Bolos <suportemarlenebolos@gmail.com.br>",
                to: `${email}`,
                subject: "Recuperação de senha",
                html: `
                    <p>O seu token para recuperar a senha é:</p><br>
                    <h5>${token}</h5><br>
                `,
            })

            return 'ok';
        

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async registraToken(token){
        try {
            await database.insert({
                token: token,
                validade: 1,
                data_criacao: await Date.now()
            }).into("token");

            return "ok";
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async gerarToken(){
        try {
            return Math.floor(Math.random() * (999999 - 100000 + 1)) + 10000;
            
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async validaToken(token){
        try {
            var response = await database.where({token: token}).table("token");
            if(response[0].validade !== 1){
                return undefined;
            };
            await database.where({token: token}).update({validade: 0}).table("token");

            return "ok";
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    

    
}

module.exports = new LoginModel();