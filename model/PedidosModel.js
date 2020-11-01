const database = require('../database/connection');

class PedidosModel{
    async verificaNome(nome){
        try {
            if(nome === null || nome === '' || nome === ' ' || nome === undefined){
                return undefined;
            }
            return nome;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async verificaProdutos(produtos){
        try {
            if(produtos === null || produtos === '' || produtos === ' ' || produtos === undefined){
                return undefined;
            }
            return produtos;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async verificaValor(valor){
        try {
            if(valor === null || valor === '' || valor === ' ' || valor === undefined){
                return undefined;
            }

            let valorC = parseFloat(valor);

            if(isNaN(valorC) === true){
                return undefined;
            }

            return valorC;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async cadastrar(pedido){
        try {
            await database.insert(pedido).into('registro_pedidos');
            return "ok";

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async buscarPedidos(){
        try {
            var response = await database.select().table("registro_pedidos").orderBy("id", "desc");
            return response;
        } catch (error) {
            console.log(error);
            return undefined;
        }       
    }
    
    async excluirPedido(id){
        try {
            await database.where({id: id}).delete().table("registro_pedidos");
            return "ok";
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async alterarPedido(pedido){
        try {
            
            await database.where({id: pedido.id}).update({
                nome: pedido.nome, 
                produtos: pedido.produtos,
                valor: pedido.valor
            }).table("registro_pedidos");

            return "ok";

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async pedido(id){
        try {
            var response = await database.where({id: id}).table("registro_pedidos");
            return response;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
    
    async buscaTimestamp(){
        try {
            var response = await database.select("data", "valor").table("registro_pedidos");
            return response;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async transformaTimestamp(array){
        try {
            var data = [];
            
            for(let i = 0; i < array.length; i++){
               data.push({data: new Date(array[i].data), valor: array[i].valor}); 
            }

            return data;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async comparaData(array){
        try {
            var hoje = new Date();
            var valores = [];

            for(let i = 0; i < array.length; i++){
                if(array[i].data.getMonth() == hoje.getUTCMonth() && array[i].data.getFullYear() == hoje.getUTCFullYear()){
                    valores.push(array[i].valor);
                    
                }
            }
            return valores;
        
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async totalPedidosMensal(array, mes, ano){
        try {
            var pedidos = [];

            for(let i = 0; i < array.length; i++){
                if(array[i].data.getMonth() == mes && array[i].data.getFullYear() == ano){
                    pedidos.push(array[i].valor);
                }
            }

            return pedidos;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
    
};

module.exports = new PedidosModel();