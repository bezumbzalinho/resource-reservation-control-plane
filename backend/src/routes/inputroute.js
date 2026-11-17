const express = require('express');
const router = express.Router();
const inputcontrollers = require('../controllers/inputcontrollers')
const middleware = require('../middlewares/middleware')

router.post('/:fileName', middleware.checkToken, inputcontrollers.funcionarios)

module.exports = router