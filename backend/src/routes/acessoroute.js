const express = require('express');
const router = express.Router();
const acesssocontrollers = require('../controllers/acesssocontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', acesssocontrollers.acesso_list);

router.get(
  "/listweb",
  middleware.checkToken,
  acesssocontrollers.acesso_list_web
);

router.get('/get/:id', acesssocontrollers.acesso_detail);

router.get(
  "/getweb/:id",
  middleware.checkToken,
  acesssocontrollers.acesso_detail_web
);

router.post('/create', acesssocontrollers.acesso_create);

router.put('/update/:id', acesssocontrollers.acesso_update);

module.exports = router