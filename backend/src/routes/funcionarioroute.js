const express = require("express");
const router = express.Router();
const funcionariocontrollers = require("../controllers/funcionariocontrollers");
const middleware = require("../middlewares/middleware");

router.get("/list", funcionariocontrollers.funcionario_list);

router.get(
  "/listweb",
  middleware.checkToken,
  funcionariocontrollers.funcionario_list_web
);

router.put(
  "/updateState/:id",
  middleware.checkToken,
  funcionariocontrollers.funcionario_UpdateState
);

router.post(
  "/create",
  middleware.checkToken,
  funcionariocontrollers.funcionario_create
);

router.get("/get/:id", funcionariocontrollers.funcionario_detail);

router.get(
  "/getweb/:id",
  middleware.checkToken,
  funcionariocontrollers.funcionario_detail_web
);

router.put("/update/:id", funcionariocontrollers.funcionario_update);

router.put("/updatepass", funcionariocontrollers.funcionario_update_pass);

router.put(
  "/updatepassweb",
  funcionariocontrollers.funcionario_update_pass_web
);

router.put(
  "/updateweb/:id",
  middleware.checkToken,
  funcionariocontrollers.funcionario_update_web
);

router.get(
  "/cont",
  middleware.checkToken,
  funcionariocontrollers.funcionario_count
);

router.post("/login", funcionariocontrollers.funcionario_login);

router.post("/loginweb", funcionariocontrollers.funcionario_login_web);

router.post("/logintablet", funcionariocontrollers.funcionario_login_tablet);

module.exports = router;
