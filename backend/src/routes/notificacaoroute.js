const express = require('express');
const router = express.Router();
const notificacaocontrollers = require('../controllers/notificacaocontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', notificacaocontrollers.notificacao_list);

router.get('/listnovas', notificacaocontrollers.notificacao_list_novas);

router.get('/listweb', middleware.checkToken,notificacaocontrollers.notificacao_list_web);

router.post('/create', notificacaocontrollers.notificacao_create);

router.post('/createweb', middleware.checkToken,notificacaocontrollers.notificacao_create_web);

router.get('/get/:id', notificacaocontrollers.notificacao_detail);

router.get('/getweb/:id', middleware.checkToken,notificacaocontrollers.notificacao_detail_web);

router.get('/listbyfuncionario/:id', notificacaocontrollers.notificacao_list_by_funcionario);

router.get('/listbyfuncionarioweb/:id', middleware.checkToken,notificacaocontrollers.notificacao_list_by_funcionario_web);

module.exports = router