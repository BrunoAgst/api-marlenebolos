const express = require('express');
const router = express.Router();
const PedidosController = require('./controller/PedidosController');
const LoginController = require('./controller/LoginController');
const auth = require('./middleware/auth');

router.post('/pedidos', auth, PedidosController.cadastrar);
router.get('/pedidos', auth, PedidosController.todosPedidos);
router.delete('/pedidos/:id', auth, PedidosController.excluir);
router.put('/pedidos/:id', auth, PedidosController.alterar);
router.get('/pedidos/:id', auth, PedidosController.pedido);
router.post('/reset-senha', LoginController.resetSenha);
router.post('/usuario', auth, LoginController.cadastrarUsuario);
router.post('/nova-senha', auth, LoginController.novaSenha);
router.get('/usuario', LoginController.login);

module.exports = router;