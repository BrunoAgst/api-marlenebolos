const database = require('../database/connection');
const nodemailerConfig = require('../config/nodemailer');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

class PedidosModel{

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
            console.log(response);
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
                    <h4>Lembrando que expira em 3 minutos</h4>
                `,
            })

            return 'ok';
        

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
}

module.exports = new PedidosModel();