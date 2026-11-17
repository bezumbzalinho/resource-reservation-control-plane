import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../../views/auth.service";
import { useNavigate } from "react-router-dom";
export default function SetupPassword() {
  const [passwordNova, setPasswordNova] = useState("");
  const [confirmarPassNova, setConfirmarPassNova] = useState("");
  const navigate = useNavigate();

  window.onbeforeunload = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("reset");
  }

  useEffect(() => {
    const reset = authService.getPwdReset()
    if (!reset && !localStorage.getItem('userId')) {
      navigate('/Login')
    }
  }, []);

  function HandleChange(e) {
    e.preventDefault();
    if (passwordNova !== confirmarPassNova) {
      Swal.fire("Erro", "As palavra passe devem coincidir", "error");
      setPasswordNova("");
      setConfirmarPassNova("");
    } else {
      const UpdatePass = allowedOrigins + "funcionario/updatepassweb";
      const datapost = {
        id: localStorage.getItem("userId"),
        pass: passwordNova,
      };
      if (localStorage.getItem("email")) { //nunca mudou a pass
        axios
          .put(UpdatePass, datapost)
          .then((res) => {
            if (res.data.success) {
              Swal.fire(
                "Sucesso",
                "Palavra passe alterada com sucesso",
                "success"
              );
              localStorage.removeItem("userId");
              localStorage.removeItem("reset");
              authService.login(localStorage.getItem("email"), passwordNova).then(() => {
                localStorage.removeItem("email");
                navigate("/");
              })
            } else {
              Swal.fire("Erro", "Falha ao atualizar a palavra passe", "error");
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      } else { //esqueceu-se da pass
        axios
          .put(UpdatePass, datapost)
          .then((res) => {
            if (res.data.success) {
              Swal.fire(
                "Sucesso",
                "Palavra passe alterada com sucesso",
                "success"
              );
              localStorage.removeItem("userId");
              navigate("/Login");
            } else {
              Swal.fire("Erro", "Falha ao atualizar a palavra passe", "error");
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      }
    }
  }

  return (
    <div
      className="container-fluid p-0"
      style={{
        height: "100vh",
        backgroundImage: `url("${allowedOrigins}ChangePassword.png")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="row m-0 align-items-center p-0"
        style={{ height: "98vh" }}
      >
        <div className="col-xl-6 col-lg-6   col-12 d-flex justify-content-center">
          <img src={allowedOrigins + "LogoSoftinsa-LoginPage.svg"} />
        </div>

        <div className="col-xl-6 col-lg-6  col-12 p-0   justify-content-center">
          <div className="row  justify-content-center m-0 p-0">
            <h3 className="text-white">É necessário alterar a palavra passe</h3>
          </div>
          <div className="row  justify-content-center mt-5 m-0">
            <form
              className=" col-xl-8 col-lg-12 col-md-8 col-sm-8 col-12 "
              onSubmit={HandleChange}
            >
              <div className="row d-flex justify-content-center  ">
                <div className="col-10  d-flex justify-content-center">
                  <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11 form-group   p-0">
                    <label htmlFor="PassNova" className="text-white">
                      Palavra passe nova{" "}
                    </label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      id="PassNova"
                      aria-describedby="emailHelp"
                      placeholder="********"
                      value={passwordNova}
                      onChange={(value) => setPasswordNova(value.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row d-flex justify-content-center  ">
                <div className="col-10  d-flex justify-content-center">
                  <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11 form-group   p-0">
                    <label htmlFor="ConfirPassNova" className="text-white">
                      Confirmar Palavra passe
                    </label>
                    <input
                      type="password"
                      required
                      className="form-control align-middle"
                      id="ConfirPassNova"
                      placeholder="********"
                      value={confirmarPassNova}
                      onChange={(value) =>
                        setConfirmarPassNova(value.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row d-flex justify-content-center  mt-3">
                <div className="col-10  d-flex justify-content-center">
                  <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11    p-0">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill btn-lg"
                      style={{ width: "100%" }}
                    >
                      ALTERAR
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
