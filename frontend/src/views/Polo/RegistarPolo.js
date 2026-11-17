import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../../views/auth.service";
import authHeader from "../../views/auth-header";
export default function SalasRegistar() {
  const [currentUser, setCurrentUser] = useState("");
  const [nomePolo, setNomePolo] = useState("");
  const [morada, setMorada] = useState("");
  const [telefone, setTelefone] = useState("");
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  function CreatePolo() {
    if (nomePolo == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do nome",
        "warning"
      );
    } else if (morada == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da morada",
        "warning"
      );
    } else if (Email == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do email",
        "warning"
      );
    } else if (telefone == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do telefone",
        "warning"
      );
    } else {
      const url = allowedOrigins + "polo/create";
      const datapost = {
        designacao: nomePolo,
        endereco: morada,
        telefone: telefone,
        email: Email,
      };
      axios
        .post(url, datapost, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            Swal.fire(
              "Registado!",
              "O polo foi registado com sucesso!",
              "success"
            );
            navigate("/ListarPolos");
          } else if (
            !res.data.success &&
            (res.data.message == "Token indisponível." ||
              res.data.message == "O token não é válido.")
          ) {
            localStorage.setItem("Expirou", "1");
            authService.logout();
            window.location.reload(true);
          } else {
            if (
              !res.data.success &&
              "email must be unique" == res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Erro",
                "Falha ao registar o polo, o email que introduziu já existe na base de dados",
                "error"
              );
            } else if (
              !res.data.success &&
              "Validation isNumeric on telemovel failed" ==
                res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Erro",
                "Falha ao registar o polo, o número de telemóvel que introduziu não é válido",
                "error"
              );
            } else {
              Swal.fire("Erro", "Falha ao registar o polo", "error");
            }
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }
  function GetCurrentUser() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }
  useEffect(() => {
    GetCurrentUser();
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div className="container-xxl mx-5">
      <h1 className="mb-4">Registar Polo</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="row m-0 mb-4">
          <div style={{ width: "1.5%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-exclamation-circle mb-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
          </div>
          <div className="col-xl-2 col-md-6 col-sm-11 col-11">
            <p className="mb-0" style={{ color: "#9BA6B8", fontSize: "15px" }}>
              Campos obrigatórios
            </p>
          </div>
        </div>

        <div className="form-row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="NomePolo">
                Nome do Polo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1 "
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="NomePolo"
                type="text"
                className="form-control "
                placeholder="Nome"
                style={{ borderBottom: "1px solid grey" }}
                value={nomePolo}
                onChange={(value) => setNomePolo(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Morada">
                Morada
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Morada"
                type="text"
                className="form-control "
                placeholder="Rua, número e andar"
                style={{ borderBottom: "1px solid grey" }}
                value={morada}
                onChange={(value) => setMorada(value.target.value)}
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Email">
                Email
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Email"
                type="email"
                className="form-control "
                placeholder="Email"
                style={{ borderBottom: "1px solid grey" }}
                value={Email}
                onChange={(value) => setEmail(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Telefone">
                Telefone
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1 "
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Telefone"
                type="numb"
                className="form-control "
                placeholder="Número de telefone"
                style={{ borderBottom: "1px solid grey" }}
                value={telefone}
                onChange={(value) => setTelefone(value.target.value)}
              />
            </div>

            <div className="row m-0 mb-3">
              <div className=" col-xl-9 col-md-8 col-sm-10 col-10 d-flex justify-content-end p-0 m-0">
                <button
                  title="Confirmar"
                  className="btn btn-outline-primary mr-1"
                  onClick={() => CreatePolo()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-check-circle mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                  </svg>
                </button>
                <Link
                  className="btn btn-outline-secondary ml-1"
                  to="/ListarPolos"
                  title="Cancelar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-x-circle mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
