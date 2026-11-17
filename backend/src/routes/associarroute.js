const express = require("express");
const router = express.Router();
const associarcontrollers = require("../controllers/associarcontrollers");
const middleware = require("../middlewares/middleware");

router.get("/list", associarcontrollers.associar_list);

router.get(
  "/listweb",
  middleware.checkToken,
  associarcontrollers.associar_list_web
);

router.get(
  "/listbyfuncionario/:id",
  associarcontrollers.associar_list_by_funcionario
);

router.get(
  "/listbyfuncionarioweb/:id",
  middleware.checkToken,
  associarcontrollers.associar_list_by_funcionario_web
);

router.get(
  "/listbyfuncionariodesc/:id",
  associarcontrollers.associar_list_by_funcionario_desc
);

router.get(
  "/listbyfuncionariodescweb/:id",
  middleware.checkToken,
  associarcontrollers.associar_list_by_funcionario_desc_web
);

router.get("/listbypolo/:id", associarcontrollers.associar_list_by_polo);

router.get(
  "/listbypoloweb/:id",
  middleware.checkToken,
  associarcontrollers.associar_list_by_polo_web
);

router.get(
  "/listbypolodesc/:id",
  associarcontrollers.associar_list_by_polo_desc
);

router.get(
  "/listbypolodescweb/:id",
  middleware.checkToken,
  associarcontrollers.associar_list_by_polo_desc_web
);

router.post("/create", associarcontrollers.associar_create);

router.post(
  "/deletebypolo/:id",
  middleware.checkToken,
  associarcontrollers.associar_delete_by_polo
);

router.get("/detail/:id", associarcontrollers.associar_detail);

router.get(
  "/detailweb/:id",
  middleware.checkToken,
  associarcontrollers.associar_detail_web
);

router.post(
  "/createIfNotExists/:userId",
  middleware.checkToken,
  associarcontrollers.associar_create_if_not_exists
);

router.post(
  "/deleteIfExists/:userId",
  middleware.checkToken,
  associarcontrollers.associar_delete_if_exists
);

module.exports = router;
