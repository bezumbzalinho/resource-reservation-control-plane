const express = require('express');
const router = express.Router();
const reservacontrollers = require('../controllers/reservacontrollers')
const middleware = require('../middlewares/middleware')

router.get('/list', reservacontrollers.reserva_list);

router.get('/listweb', middleware.checkToken, reservacontrollers.reserva_list_web);

router.get('/get/:id', reservacontrollers.reserva_detail);

router.get('/getweb/:id', middleware.checkToken, reservacontrollers.reserva_detail_web);

router.get("/listwebpassadas", middleware.checkToken, reservacontrollers.reserva_list_web_passadas);

router.get("/listwebfuturas", middleware.checkToken, reservacontrollers.reserva_list_web_futuras);

router.get('/listbysala/:id', reservacontrollers.reserva_list_by_sala);

router.get('/listbysalaweb/:id', middleware.checkToken, reservacontrollers.reserva_list_by_sala_web);

router.get('/listbysalaNovas', reservacontrollers.reserva_list_by_sala_novas);

router.get('/listbyfuncionario/:id', reservacontrollers.reserva_list_by_funcionario);

router.get('/listbyfuncionarioweb/:id', middleware.checkToken, reservacontrollers.reserva_list_by_funcionario_web);

router.get('/listbyfuncionariodescweb/:id', middleware.checkToken, reservacontrollers.reserva_list_by_funcionario_desc_web);

router.get('/listbyfuncionarioNovas', reservacontrollers.reserva_list_by_funcionario_novas);

router.post('/create', reservacontrollers.reserva_create);

router.put("/updateState/:id", reservacontrollers.reserva_UpdateState)

router.put("/updateStateweb/:id", middleware.checkToken, reservacontrollers.reserva_UpdateState_web)

router.get("/countInIntervalos", middleware.checkToken, reservacontrollers.reserva_count_entre_intervalos)

router.get("/countInIntervalosTodas", middleware.checkToken, reservacontrollers.reserva_count_entre_intervalos_todas)

router.get("/countAtivas", middleware.checkToken, reservacontrollers.reserva_count_ativas)

router.get("/countTodas", middleware.checkToken, reservacontrollers.reserva_count_todas)

router.get("/countHoje", middleware.checkToken, reservacontrollers.reserva_count_hoje)

router.get("/countMes", middleware.checkToken, reservacontrollers.reserva_count_mes)

router.put('/update/:id', reservacontrollers.reserva_update);

router.put('/deletebypolo/:id', middleware.checkToken, reservacontrollers.reserva_delete_by_polo)

router.put('/deletebysala/:id', middleware.checkToken, reservacontrollers.reserva_delete_by_sala)

router.get('/getSalaMaisReservada', middleware.checkToken, reservacontrollers.reserva_buscar_sala_mais_reservada)

module.exports = router