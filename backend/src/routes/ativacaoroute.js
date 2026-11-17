const express = require('express');
const router = express.Router();
const ativacaocontrollers = require('../controllers/ativacaocontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', ativacaocontrollers.ativacao_list);

router.get('/listweb', middleware.checkToken, ativacaocontrollers.ativacao_list_web);

router.get('/listbyUser/:id', ativacaocontrollers.ativacao_list_funcionario);

router.get('/listbyUserweb/:id', middleware.checkToken, ativacaocontrollers.ativacao_list_funcionario_web);

router.get('/listbyUserinv/:id', ativacaocontrollers.ativacao_list_inv_funcionario);

router.get('/listbyUserinvweb/:id', middleware.checkToken, ativacaocontrollers.ativacao_list_inv_funcionario_web);

router.post('/create', ativacaocontrollers.ativacao_create);

router.post('/createweb', ativacaocontrollers.ativacao_create_web);

router.put('/update', ativacaocontrollers.ativacao_update);

router.put('/updateweb', ativacaocontrollers.ativacao_update_web);

module.exports = router