import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import AuthService from "../../views/auth.service";
import { useNavigate } from "react-router-dom";

export default function LoginComponent({ refetch, currentUser }) {
  var userId = 0;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (JSON.parse(AuthService.getPwdReset())) {
        navigate("/SetupPassword");
      } else {
        if (localStorage.getItem("AdminMudou")) {
          localStorage.removeItem("AdminMudou")
          navigate("/ListarUtilizadores");
        } else {
          navigate("/");
        }
        //window.location.reload(true);
      }
    } else {
      if (JSON.parse(AuthService.getPwdReset())) {
        navigate("/SetupPassword");
      }
    }

    if (localStorage.getItem("Expirou")) {
      Swal.fire({
        icon: "warning",
        title: "A sua sessão expirou, por favor faça login novamente",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      localStorage.removeItem("Expirou");
    }
  }, [currentUser]);

  function Pedido() {
    Swal.fire({
      title: "Redefinir password",
      width: "400px",
      position: "center",
      input: "email",
      inputLabel: "Email",
      inputPlaceholder: "eg: yourname@mail.com",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: `Confirmar`,
      denyButtonText: `Cancelar`,
      cancelButtonText: `Tenho código`,
    }).then((result) => {
      if (result.isConfirmed) {
        const CheckUserEmail = allowedOrigins + "ativacao/createweb";

        axios
          .post(CheckUserEmail, { email: result.value })
          .then((res) => {
            if (res.data.success) {
              const data = res.data.data;
              userId = data.funcionarioId;
              Swal.fire({
                title: "Foi enviado um código para o email que digitou.",
                width: "400px",
                position: "center",
                input: "text",
                inputLabel: "Código de ativação",
                inputPlaceholder: "*******",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: `Confirmar`,
                cancelButtonText: `Cancelar`,
              }).then((result) => {
                if (result.isConfirmed) {
                  const AtivacaoUpdate = allowedOrigins + "ativacao/updateweb";
                  axios
                    .put(AtivacaoUpdate, {
                      funcionarioId: userId,
                      codativacao: result.value,
                    })
                    .then((res) => {
                      if (res.data.success) {
                        localStorage.setItem("userId", userId);
                        navigate("/SetupPassword");
                      } else {
                        Swal.fire("Erro", res.data.data.msg, "error");
                      }
                    });
                }
              });
            } else {
              Swal.fire("Erro", res.data.data.erro, "error");
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      } else if (!result.isConfirmed && !result.isDenied) {
        Swal.fire({
          title: "Digite o código",
          width: "400px",
          position: "center",
          input: "text",
          inputLabel: "Código de ativação",
          inputPlaceholder: "*******",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: `Confirmar`,
          cancelButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            const AtivacaoUpdate = allowedOrigins + "ativacao/updateweb";
            axios
              .put(AtivacaoUpdate, {
                funcionarioId: userId,
                codativacao: result.value,
              })
              .then((res) => {
                if (res.data.success) {
                  localStorage.setItem("userId", userId);
                  navigate("/SetupPassword");
                } else {
                  Swal.fire("Erro", res.data.data.msg, "error");
                }
              })
              .catch(() => {
                Swal.fire("Erro", "Falha no servidor", "error");
              });
          }
        });
      }
    });
  }

  async function HandleLogin(event) {
    event.preventDefault();

    AuthService.login(email, password)
      .then((res) => {
        if (!res.success && res.message == "Dados de autenticação inválidos.") {
          Swal.fire("Erro", "Dados de autenticação inválidos", "error");
          setEmail("");
          setPassword("");
        } else if (
          !res.success &&
          res.message == "Erro no processo de autenticação."
        ) {
          Swal.fire("Erro", "O processo de autenticação falhou", "error");
          setEmail("");
          setPassword("");
        } else {
          if (!res.ultimoacesso) {
            navigate("/SetupPassword");
          } else {
            refetch();
          }
          //
          //window.location.reload(true)
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Autenticação falhou", "error");
        setEmail("");
        setPassword("");
      });
  }

  return (
    <div
      className="container-fluid p-0"
      style={{
        height: "100vh",
        backgroundImage: `url("${allowedOrigins}LoginPage.png")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="row m-0 align-items-center h-25  p-0">
        <div className="col-12 d-flex justify-content-center">
          <img src={allowedOrigins + "LogoSoftinsa-LoginPage.svg"} />
        </div>
      </div>

      <div className="row m-0  h-75 p-0">
        <div className="col-12 d-flex justify-content-center m-0 p-0">
          <form
            className=" col-xl-4 col-lg-5 col-md-7 col-sm-10 col-12"
            onSubmit={HandleLogin}
          >
            <div className="row d-flex justify-content-center  ">
              <div className="col-10  d-flex justify-content-center">
                <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11 form-group   p-0">
                  <label htmlFor="InputEmail" className="text-white">Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    id="InputEmail"
                    aria-describedby="emailHelp"
                    placeholder="eg: yourname@mail.com"
                    value={email}
                    onChange={(value) => setEmail(value.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row d-flex justify-content-center  ">
              <div className="col-10  d-flex justify-content-center">
                <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11 form-group   p-0">
                  <label htmlFor="InputPassword" className="text-white">
                    Palavra passe
                  </label>
                  <input
                    type="password"
                    required
                    className="form-control align-middle"
                    id="InputPassword"
                    placeholder="********"
                    value={password}
                    onChange={(value) => setPassword(value.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row d-flex justify-content-center  mt-3">
              <div className="col-10  d-flex justify-content-center">
                <div className="col-xl-10 col-lg-11 col-md-11 col-sm-11 col-11    p-0">
                  <button
                    className="btn btn-primary rounded-pill btn-lg"
                    style={{ width: "100%" }}
                  >
                    ENTRAR
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row mt-4">
                <div className="col-12  d-flex justify-content-center  align-items-center">
                  <button
                    className="btn btn-outline-light "
                    type="button"
                    onClick={() => Pedido()}
                  >
                    Esqueci-me da palavra passe
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
