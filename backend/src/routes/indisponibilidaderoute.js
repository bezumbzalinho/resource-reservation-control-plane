const express = require('express');
const router = express.Router();
const indisponibilidadecontrollers = require('../controllers/indisponibilidadecontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', indisponibilidadecontrollers.indisponibilidade_list);

router.get('/listweb', middleware.checkToken, indisponibilidadecontrollers.indisponibilidade_list_web);

router.get('/listbyfuncionario/:id', indisponibilidadecontrollers.indisponibilidade_list_by_funcionario);

router.get('/listbyfuncionarioweb/:id', middleware.checkToken, indisponibilidadecontrollers.indisponibilidade_list_by_funcionario_web);

router.get('/get/:id', indisponibilidadecontrollers.indisponibilidade_detail);

router.get('/getweb/:id', middleware.checkToken, indisponibilidadecontrollers.indisponibilidade_detail_web);

router.post('/create', middleware.checkToken, indisponibilidadecontrollers.indisponibilidade_create);

module.exports = router