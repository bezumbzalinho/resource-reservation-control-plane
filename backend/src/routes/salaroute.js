const express = require('express');
const router = express.Router();
const salacontrollers = require('../controllers/salacontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', salacontrollers.sala_list);

router.get('/listweb', middleware.checkToken,salacontrollers.sala_list_web);

router.post('/create', middleware.checkToken,salacontrollers.sala_create);

router.put('/delete/:id', middleware.checkToken,salacontrollers.sala_delete);

router.get('/get/:id', salacontrollers.sala_detail);

router.get('/getweb/:id', middleware.checkToken,salacontrollers.sala_detail_web);

router.put('/update/:id', middleware.checkToken, salacontrollers.sala_update);

router.put('/updatetablet/:id', salacontrollers.sala_update_tablet);

router.put('/updatelimpeza/:id', salacontrollers.sala_update_limpeza);

router.get('/listbypolo/:id', salacontrollers.sala_list_by_polo);

router.get('/listbypoloweb/:id', middleware.checkToken,salacontrollers.sala_list_by_polo_web);

router.put('/deletebypolo/:id', middleware.checkToken,salacontrollers.sala_delete_by_polo);

router.get('/listnovas', salacontrollers.sala_list_novas);

router.get('/count', middleware.checkToken,salacontrollers.sala_count);

module.exports = router