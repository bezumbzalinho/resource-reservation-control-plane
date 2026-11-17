const express = require("express");
const router = express.Router();
const indisponibilidadePolocontrollers = require("../controllers/indisponibilidadePolocontrollers");
const middleware = require("../middlewares/middleware");

router.get(
  "/list",
  indisponibilidadePolocontrollers.indisponibilidadePolo_list
);

router.get(
  "/listweb",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_web
);

router.get(
  "/listbyindisponibilidade/:id",
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_by_indisponibilidade
);

router.get(
  "/listbyindisponibilidadeweb/:id",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_by_indisponibilidade_web
);

router.get(
  "/listbypolo/:id",
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_by_polo
);

router.get(
  "/listbypoloweb/:id",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_by_polo_web
);


router.get(
  "/listbypolodescweb/:id",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_list_by_polo_web_desc
);




router.post(
  "/create",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_create
);

router.post(
  "/deletebypolo/:id",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_delete_by_polo
);

router.get(
  "/get/:id",
  indisponibilidadePolocontrollers.indisponibilidadePolo_detail
);

router.get(
  "/getweb/:id",
  middleware.checkToken,
  indisponibilidadePolocontrollers.indisponibilidadePolo_detail_web
);

module.exports = router;
