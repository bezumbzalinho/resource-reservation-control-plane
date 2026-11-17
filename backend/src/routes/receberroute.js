const express = require('express');
const router = express.Router();
const recebercontrollers = require('../controllers/recebercontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', recebercontrollers.receber_list);

router.get('/listbyfuncionarionovas', recebercontrollers.receber_list_by_funcionario_novas);

router.get('/listweb', middleware.checkToken, recebercontrollers.receber_list_web);

router.get('/listbyfuncionario/:id', recebercontrollers.receber_list_by_funcionario);

router.get('/listbyfuncionarioweb/:id', middleware.checkToken, recebercontrollers.receber_list_by_funcionario_web);

router.get('/listbyfuncionariodesc/:id', recebercontrollers.receber_list_by_funcionario_desc);

router.get('/listbyfuncionariodescweb/:id', middleware.checkToken, recebercontrollers.receber_list_by_funcionario_desc_web);

router.get('/get/:id', recebercontrollers.receber_detail);

router.get('/getweb/:id', middleware.checkToken, recebercontrollers.receber_detail_web);

router.post('/create', recebercontrollers.receber_create);

router.post('/createweb', middleware.checkToken, recebercontrollers.receber_create_web);

module.exports = router