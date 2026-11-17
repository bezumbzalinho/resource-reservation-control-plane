const express = require('express');
const router = express.Router();
const indisponibilidadeSalacontrollers = require('../controllers/indisponibilidadeSalacontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', indisponibilidadeSalacontrollers.indisponibilidadeSala_list);

router.get('/listweb', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_list_web);

router.get('/listbyindisponibilidade/:id', indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_indisponibilidade);

router.get('/listbyindisponibilidadeweb/:id', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_indisponibilidade_web);

router.get('/listbysala/:id', indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_sala);

router.get('/listbysalaweb/:id', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_sala_web);

router.get('/listbyindisponibilidadedesc/:id', indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_indisponibilidade_desc);

router.get('/listbyindisponibilidadedescweb/:id', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_indisponibilidade_desc_web);

router.get('/listbysaladesc/:id', indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_sala_desc);

router.get('/listbysaladescweb/:id', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_sala_desc_web);

router.post('/create', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_create);

router.post('/createbypolo', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_create_by_polo);

router.get('/get/:id', indisponibilidadeSalacontrollers.indisponibilidadeSala_detail);

router.get('/getweb/:id', middleware.checkToken, indisponibilidadeSalacontrollers.indisponibilidadeSala_detail_web);

router.get('/listbysalatabletdesc', indisponibilidadeSalacontrollers.indisponibilidadeSala_list_by_sala_tablet);

module.exports = router