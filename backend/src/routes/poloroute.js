const express = require('express');
const router = express.Router();
const polocontrollers = require('../controllers/polocontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', polocontrollers.polo_list);

router.get('/listweb', middleware.checkToken,polocontrollers.polo_list_web);

router.post('/create', middleware.checkToken,polocontrollers.polo_create);

router.put('/delete/:id', middleware.checkToken,polocontrollers.polo_delete);

router.get('/get/:id', polocontrollers.polo_detail);

router.get('/getweb/:id', middleware.checkToken,polocontrollers.polo_detail_web);

router.get('/count', middleware.checkToken,polocontrollers.polos_count);

router.put('/update/:id', middleware.checkToken,polocontrollers.polo_update);

router.get('/listnovas', polocontrollers.polo_list_novas);

module.exports = router
