const express = require('express');
const router = express.Router();
const PedidosController = require('./controller/PedidosController');
const LoginController = require('./controller/LoginController');
const auth = require('./middleware/auth');
const rateLimit = require('./config/rateLimit');

router.post('/pedidos', auth, PedidosController.cadastrar);
router.get('/pedidos', auth, PedidosController.todosPedidos);
router.delete('/pedidos/:id', auth, PedidosController.excluir);
router.put('/pedidos/:id', auth, PedidosController.alterar);
router.get('/pedidos/:id', auth, PedidosController.pedido);
router.post('/reset-senha', LoginController.resetSenha);
router.post('/usuario', LoginController.cadastrarUsuario);
router.post('/nova-senha', rateLimit, LoginController.novaSenha);
router.post('/login', rateLimit, LoginController.login);
router.post('/validar', auth, LoginController.validaToken);
router.get('/total-mensal', auth, PedidosController.valorMensal);
router.get('/pedidos-mensal/:mes/:ano', auth, PedidosController.pedidosMensal);

module.exports = router;