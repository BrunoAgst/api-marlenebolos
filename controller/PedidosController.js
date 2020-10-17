const PedidosModel = require('../model/PedidosModel');

class PedidosController{
    async cadastrar(req, res){
        var nome = req.body.nome;
        var produtos = req.body.produtos;
        var valor = req.body.valor;
        
        
        var nomeV = await PedidosModel.verificaNome(nome);
        var produtosV = await PedidosModel.verificaProdutos(produtos);
        var valorV = await PedidosModel.verificaValor(valor);

        if(nomeV === undefined){
            res.status(400);
            res.json({"erro": "Campo nome está inválido"});
            return
        }

        if(produtosV === undefined){
            res.status(400);
            res.json({"erro": "Campo produtos está inválido"});
            return
        }

        if(valorV === undefined){
            res.status(400);
            res.json({"erro": "Campo valor está inválido"});
            return
        }

        const pedido = {
            nome: nomeV,
            produtos: produtosV,
            valor: valorV,
            data : new Date().getTime()
        }

        var response = await PedidosModel.cadastrar(pedido);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível cadastrar o pedido"});
            return;
        }

        res.status(200);
        res.json({"sucesso": "Pedido cadastrado com sucesso"});
    }

    async todosPedidos(req, res){
        var pedidos = await PedidosModel.buscarPedidos();

        if(pedidos === undefined){
            res.status(400);
            res.json({"erro": "Erro, não foi possível retornar os pedidos"});
            return
        }
        
        res.status(200);
        res.json({pedidos});
    }

    async excluir(req, res){
        var id = req.params.id;
        var response = await PedidosModel.excluirPedido(id);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "Não foi possível excluir pedido"});
            return
        }

        res.status(200);
        res.json({"sucesso": "Pedido excluído com sucesso"});
    }

    async alterar(req, res){
        var id = req.params.id;
        var nome = req.body.nome;
        var produtos = req.body.produtos;
        var valor = req.body.valor;

        var nomeV = await PedidosModel.verificaNome(nome);
        var produtosV = await PedidosModel.verificaProdutos(produtos);
        var valorV = await PedidosModel.verificaValor(valor);

        if(nomeV === undefined){
            res.status(400);
            res.json({"erro": "Campo nome está inválido"});
            return
        }

        if(produtosV === undefined){
            res.status(400);
            res.json({"erro": "Campo produtos está inválido"});
            return
        }

        if(valorV === undefined){
            res.status(400);
            res.json({"erro": "Campo valor está inválido"});
            return
        }

        const pedido = {
            id: id,
            nome: nomeV,
            produtos: produtosV,
            valor: valorV
        }

        var response = await PedidosModel.alterarPedido(pedido);

        if(response === undefined){
            res.status(400);
            res.json({"erro": "não foi possível alterar o pedido"});
            return;
        }

        res.status(200);
        res.json({"erro": "Pedido Alterado com sucesso"});
    }

    async pedido(req, res){
        var id = req.params.id;

        var pedido = await PedidosModel.pedido(id);

        if(pedido.length === 0){
            res.status(404);
            res.json({"erro": "Não localizados o pedido"});
            return
        }

        res.status(200);
        res.json({pedido});
    }

    async valorMensal(req, res){
        var dataPedidos = await PedidosModel.buscaTimestamp();
        
        var listaTimestamp = await PedidosModel.transformaTimestamp(dataPedidos);

        var listaValores = await PedidosModel.comparaData(listaTimestamp);

        res.status(200);
        res.json({listaValores});
    }
}

module.exports = new PedidosController();